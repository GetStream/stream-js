import { CloudContext } from './utils';

describe('Enrich story', () => {
  const ctx = new CloudContext();
  let eatCheeseBurgerActivity;
  let like;
  let like2;
  let comment;

  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();

  describe('When alice reads her empty feed', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').get();
    });

    ctx.responseShouldHaveNoActivities();
  });

  describe('When alice eats the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
      });
    });
    describe('and then alice reads her feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user').get();
      });

      ctx.responseShouldHaveActivityWithFields();

      ctx.responseShould('have the activity containing enriched data', () => {
        ctx.activity.actor.should.eql(ctx.alice.currentUser.full);
        ctx.activity.verb.should.eql('eat');
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
        eatCheeseBurgerActivity = ctx.response.results[0];
      });
    });
  });

  describe('When bob reads his empty timeline', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('timeline').get();
    });

    ctx.responseShouldHaveNoActivities();
  });

  describe('When bob follows alice', () => {
    ctx.requestShouldNotError(async () => {
      await ctx.bob.feed('timeline').follow('user', ctx.alice.userId);
    });
    describe('and then bob reads his timeline with own reactions', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.feed('timeline').get();
      });

      ctx.responseShouldHaveActivityWithFields();

      ctx.activityShould('contain enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });
    });
  });

  describe('When bob likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.add('like', eatCheeseBurgerActivity.id);
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponse);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'like',
        activity_id: eatCheeseBurgerActivity.id,
        user_id: ctx.bob.userId,
      });
      ctx.response.data.should.eql({});
      like = ctx.reactionToReactionInActivity(ctx.response, ctx.bob.currentUser);
      delete like.duration;
    });

    describe('and then bob reads his timeline with own reactions', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.feed('timeline').get({ withOwnReactions: true });
      });

      ctx.responseShouldHaveActivityWithFields('own_reactions');

      ctx.activityShould('contain the enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });

      ctx.activityShould('contain the reaction of bob', () => {
        ctx.activity.own_reactions.like.should.eql([like]);
      });
    });

    describe('and then bob reads alice her feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.feed('user', ctx.alice.userId).get({ withOwnReactions: true });
      });

      ctx.responseShouldHaveActivityWithFields('own_reactions');

      ctx.activityShould('contain the enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });

      ctx.activityShould('contain the reaction of bob', () => {
        ctx.activity.own_reactions.like.should.eql([like]);
      });
    });

    describe('and then carl reads alice her feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl
          .feed('user', ctx.alice.userId)
          .get({ withRecentReactions: true, withOwnReactions: true });
      });

      ctx.responseShouldHaveActivityWithFields('own_reactions', 'latest_reactions', 'latest_reactions_extra');

      ctx.activityShould('contain the enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });

      ctx.activityShould('not contain anything in own_reactions', () => {
        ctx.activity.own_reactions.should.eql({});
      });

      ctx.activityShould('contain the reaction of bob in latest_reactions', () => {
        ctx.activity.latest_reactions.like.should.eql([like]);
      });
      ctx.activityShould('have an empty next for like in latest_reactions_extra', () => {
        ctx.activity.latest_reactions_extra.should.eql({
          like: { next: '' },
        });
      });
    });
  });

  describe('When dave also likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.reactions.add('like', eatCheeseBurgerActivity.id);
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponse);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'like',
        activity_id: eatCheeseBurgerActivity.id,
        user_id: ctx.dave.userId,
      });
      ctx.response.data.should.eql({});
      like2 = ctx.reactionToReactionInActivity(ctx.response, ctx.dave.currentUser);
      delete like2.duration;
    });
  });

  describe('When dave comments on that alice ate a cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.reactions.add(
        'comment',
        eatCheeseBurgerActivity,
        {
          text: 'Looks juicy!!!',
        },
        { targetFeeds: [ctx.alice.feed('notification')] },
      );
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'comment',
        activity_id: eatCheeseBurgerActivity.id,
        user_id: ctx.dave.userId,
      });
      ctx.response.data.should.eql({
        text: 'Looks juicy!!!',
      });
      comment = ctx.reactionToReactionInActivity(ctx.response, ctx.dave.currentUser);
      delete comment.duration;
    });

    describe('and then dave reads alice her feed with all enrichment enabled', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('user', ctx.alice.userId).get({
          withRecentReactions: true,
          withOwnReactions: true,
          withReactionCounts: true,
        });
      });

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
        'latest_reactions_extra',
        'reaction_counts',
      );

      ctx.activityShould('contain the enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });

      ctx.activityShould('contain dave his like and comment in own_reactions', () => {
        ctx.activity.own_reactions.should.eql({
          like: [like2],
          comment: [comment],
        });
      });

      ctx.activityShould('contain his own reactions and of bob his like in latest_reactions', () => {
        ctx.activity.latest_reactions.should.eql({
          like: [like2, like],
          comment: [comment],
        });
      });

      ctx.activityShould('not contain an empty next for like and comment in latest_reactions_extra', () => {
        ctx.activity.latest_reactions_extra.should.eql({
          like: { next: '' },
          comment: { next: '' },
        });
      });

      ctx.activityShould('have the correct counts for reactions', () => {
        ctx.activity.reaction_counts.should.include({
          like: 2,
          comment: 1,
        });
      });
    });

    describe('and then alice reads her notification with all enrichment enabled', () => {
      let expectedReactedOnActivity;
      ctx.requestShouldNotError(async () => {
        expectedReactedOnActivity = ctx.activity;
        expectedReactedOnActivity.own_reactions = {};
        ctx.response = await ctx.alice.feed('notification').get({
          withRecentReactions: true,
          withOwnReactions: true,
          withReactionCounts: true,
        });
      });

      ctx.responseShouldHaveActivityInGroupWithFields(
        'own_reactions',
        'latest_reactions',
        'latest_reactions_extra',
        'reaction_counts',
        'reaction',
      );

      ctx.activityShould('have object key that is the original enriched activity', () => {
        ctx.activity.object.should.eql(expectedReactedOnActivity);
      });

      ctx.activityShould('have no reactions itself', () => {
        ctx.activity.own_reactions.should.eql({});
        ctx.activity.latest_reactions.should.eql({});
        ctx.activity.latest_reactions_extra.should.eql({});
      });
    });
  });

  describe('When dave removes his likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.reactions.delete(like2.id);
    });

    ctx.responseShould('be empty JSON', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {});
    });

    describe('and then dave reads alice her feed with all enrichment enabled', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('user', ctx.alice.currentUser).get({
          withRecentReactions: true,
          withOwnReactions: true,
          withReactionCounts: true,
        });
      });

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
        'latest_reactions_extra',
        'reaction_counts',
      );

      ctx.activityShould('contain the enriched data', () => {
        ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      });

      ctx.activityShould('contain dave his like and comment in own_reactions', () => {
        ctx.activity.own_reactions.should.eql({
          comment: [comment],
        });
      });

      ctx.activityShould('contain his own reactions and of bob his like in latest_reactions', () => {
        ctx.activity.latest_reactions.should.eql({
          like: [like],
          comment: [comment],
        });
      });

      ctx.activityShould('have the correct counts for reactions', () => {
        ctx.activity.reaction_counts.should.include({
          like: 1,
          comment: 1,
        });
      });
    });
  });
});
