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

  describe('When alice adds an activity to her timeline with collection data', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.alice.user,
        verb: 'eat',
        object: ctx.cheeseBurger,
      });
    });

    describe('When Bob follows alice', () => {
      ctx.requestShouldNotError(async () => {
        await ctx.bob.followUser(ctx.alice.user);
      });
      describe('and then bob reads his personalized feed', () => {
        ctx.requestShouldNotError(async () => {
          ctx.response = await ctx.bob.personalizedFeed({
            feed_slug: 'timeline',
            normalized_user_id: ctx.bob.user.id,
          });
        });
        ctx.presonalizationAPIResponseShouldHaveActivityWithFields();
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
