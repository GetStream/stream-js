var { CloudContext } = require('./utils');

describe('Enrich story', () => {
  let ctx = new CloudContext();
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
        actor: ctx.alice.user,
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
        ctx.activity.actor.should.eql(ctx.alice.user.full);
        ctx.activity.verb.should.eql('eat');
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
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
      await ctx.bob.followUser(ctx.alice.user);
    });
    describe('and then bob reads his timeline with own reactions', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.feed('timeline').get();
      });

      ctx.responseShouldHaveActivityWithFields();

      ctx.activityShould('contain enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
      });
    });
  });

  describe('When bob likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.react('like', eatCheeseBurgerActivity.id);
    });

    ctx.responseShouldHaveFields(...ctx.fields.reaction);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'like',
        activity_id: eatCheeseBurgerActivity.id,
        user_id: ctx.bob.userId,
      });
      ctx.response.data.should.eql({});
      like = ctx.reactionToReactionInActivity(ctx.response, ctx.bob.user);
    });

    describe('and then bob reads his timeline with own reactions', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob
          .feed('timeline')
          .get({ withOwnReactions: true });
      });

      ctx.responseShouldHaveActivityWithFields('own_reactions');

      ctx.activityShould('contain the enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
      });

      ctx.activityShould('contain the reaction of bob', () => {
        ctx.activity.own_reactions.like.should.eql([like]);
      });
    });

    describe('and then bob reads alice her feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob
          .feed('user', ctx.alice.userId)
          .get({ withOwnReactions: true });
      });

      ctx.responseShouldHaveActivityWithFields('own_reactions');

      ctx.activityShould('contain the enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
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

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
      );

      ctx.activityShould('contain the enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
      });

      ctx.activityShould('not contain anything in own_reactions', () => {
        ctx.activity.own_reactions.should.eql({});
      });

      ctx.activityShould(
        'contain the reaction of bob in latest_reactions',
        () => {
          ctx.activity.latest_reactions.like.should.eql([like]);
        },
      );
    });
  });

  describe('When dave also likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.react('like', eatCheeseBurgerActivity.id);
    });

    ctx.responseShouldHaveFields(...ctx.fields.reaction);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'like',
        activity_id: eatCheeseBurgerActivity.id,
        user_id: ctx.dave.userId,
      });
      ctx.response.data.should.eql({});
      like2 = ctx.reactionToReactionInActivity(ctx.response, ctx.dave.user);
    });
  });

  describe('When dave comments on that alice ate a cheeseburger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.react('comment', eatCheeseBurgerActivity, {
        data: {
          text: 'Looks juicy!!!',
        },
      });
    });

    ctx.responseShouldHaveFields(...ctx.fields.reaction);

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
      comment = ctx.reactionToReactionInActivity(ctx.response, ctx.dave.user);
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
        'reaction_counts',
      );

      ctx.activityShould('contain the enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
      });

      ctx.activityShould(
        'contain dave his like and comment in own_reactions',
        () => {
          ctx.activity.own_reactions.should.eql({
            like: [like2],
            comment: [comment],
          });
        },
      );

      ctx.activityShould(
        'contain his own reactions and of bob his like in latest_reactions',
        () => {
          ctx.activity.latest_reactions.should.eql({
            like: [like2, like],
            comment: [comment],
          });
        },
      );

      ctx.activityShould('have the correct counts for reactions', () => {
        ctx.activity.reaction_counts.should.eql({
          like: 2,
          comment: 1,
        });
      });
    });
  });

  describe('When dave removes his likes that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.reactions.delete(like2.id);
    });

    ctx.responseShould('be empty JSON', () => {
      ctx.response.should.eql({});
    });

    describe('and then dave reads alice her feed with all enrichment enabled', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('user', ctx.alice.user).get({
          withRecentReactions: true,
          withOwnReactions: true,
          withReactionCounts: true,
        });
      });

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
        'reaction_counts',
      );

      ctx.activityShould('contain the enriched data', () => {
        ctx.activity.object.should.eql(ctx.cheeseBurger.full);
      });

      ctx.activityShould(
        'contain dave his like and comment in own_reactions',
        () => {
          ctx.activity.own_reactions.should.eql({
            comment: [comment],
          });
        },
      );

      ctx.activityShould(
        'contain his own reactions and of bob his like in latest_reactions',
        () => {
          ctx.activity.latest_reactions.should.eql({
            like: [like],
            comment: [comment],
          });
        },
      );

      ctx.activityShould('have the correct counts for reactions', () => {
        ctx.activity.reaction_counts.should.eql({
          like: 1,
          comment: 1,
        });
      });
    });
  });
});
