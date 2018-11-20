var { CloudContext } = require('./utils');

describe('Personalized enrichment story', () => {
  let ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();

  describe('When alice reads her personalization feed', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.personalizedFeed({
        feed_slug: 'timeline',
      });
    });
    ctx.responseShouldHaveNoActivities();
  });

  describe("When alice reads bob's personalization feed", () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.bob.personalizedFeed({
        feed_slug: 'timeline',
        user_id: 'alice',
      });
    });
  });

  describe("When alice reads her personalization feed with an endpoint that doesn't exist", () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.personalizedFeed({
        feed_slug: 'timeline',
        userId: 'hello',
        endpoint: 'not_existing',
      });
    });
  });

  describe('When alice adds an activity to her timeline with collection and reaction data', () => {
    let activity;

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('user', ctx.alice.userId)
        .addActivity({
          actor: ctx.alice.user,
          verb: 'eat',
          object: ctx.cheeseBurger,
        });
      activity = ctx.response;
    });

    describe('When Bob follows alice', () => {
      ctx.requestShouldNotError(async () => {
        await ctx.bob
          .feed('timeline', ctx.bob.userId)
          .follow('user', ctx.alice.userId);
      });
    });

    describe('When Bob likes the activity', () => {
      ctx.requestShouldNotError(async () => {
        await ctx.bob.react('like', activity.id);
      });

      describe('and then bob reads his personalized feed', () => {
        ctx.requestShouldNotError(async () => {
          ctx.response = await ctx.bob.personalizedFeed({
            feed_slug: 'timeline',
            normalized_user_id: ctx.bob.user.id,
            withRecentReactions: true,
            withOwnReactions: true,
            withReactionCounts: true,
          });
        });

        ctx.responseShouldHaveFields(
          'limit',
          'version',
          'duration',
          'offset',
          'results',
        );

        ctx.test(
          'the response should have 1 activity with the right fields',
          () => {
            ctx.response.results.should.be.lengthOf(1);
            ctx.activity = ctx.response.results[0];
            ctx.activity.should.have.all.keys(
              ...ctx.fields.activity,
              'own_reactions',
              'latest_reactions',
              'reaction_counts',
              'latest_reactions_extra',
            );
          },
        );

        ctx.test('the activity should have 1 like from bob', () => {
          ctx.activity.reaction_counts.should.eql({ like: 1 });
          ctx.activity.latest_reactions.should.have.all.keys('like');
          ctx.activity.latest_reactions.like.should.have.length(1);
          ctx.activity.latest_reactions.like[0].user.should.eql(
            ctx.bob.user.full,
          );
        });

        ctx.responseShould('have the activity containing enriched data', () => {
          ctx.activity.actor.should.eql(ctx.alice.user.full);
          ctx.activity.verb.should.eql('eat');
          ctx.shouldEqualBesideDuration(
            ctx.activity.object,
            ctx.cheeseBurger.full,
          );
        });
      });
    });
  });
});
