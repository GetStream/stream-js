var { CloudContext } = require('./utils');

describe('Get activities', () => {
  let ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();
  let originalActivity;
  let enrichedActivity;

  describe('When alice eats the cheese burger', () => {
    let at = new Date().toISOString();

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:123',
        time: at,
      });
      originalActivity = ctx.response;
    });
  });

  describe('When getting the activity from the feed with getActivityDetail', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('user')
        .getActivityDetail(originalActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields();
    ctx.activityShould('have enriched data', () => {
      ctx.activity.id.should.equal(originalActivity.id);
      ctx.activity.foreign_id.should.equal('fid:123');
      ctx.shouldEqualBesideDuration(
        ctx.activity.actor,
        ctx.alice.currentUser.full,
      );
      ctx.activity.verb.should.equal('eat');
      ctx.shouldEqualBesideDuration(ctx.activity.object, ctx.cheeseBurger.full);
      enrichedActivity = ctx.activity;
    });
  });

  describe('When getting the activity without feed by ID', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.getActivities({
        ids: [originalActivity.id],
        enrich: true,
      });
    });
    ctx.responseShould('have a single activity', () => {
      ctx.response.should.have.all.keys('results', 'duration');
      ctx.response.results.should.be.lengthOf(1);
      ctx.activity = ctx.response.results[0];
    });
    ctx.activityShould('have enriched data', () => {
      ctx.activity.should.eql(enrichedActivity);
    });
  });

  describe('When getting the activity without feed by ID', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.getActivities({
        ids: [originalActivity.id],
      });
    });
    ctx.responseShould('have a single activity', () => {
      ctx.response.should.have.all.keys('results', 'duration');
      ctx.response.results.should.be.lengthOf(1);
      ctx.activity = ctx.response.results[0];
    });
    ctx.activityShould('have enriched data', () => {
      ctx.activity.should.eql(enrichedActivity);
    });
  });

  describe('When getting the activity without feed by ID', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.getActivities({
        ids: [originalActivity.id],
      });
    });
    ctx.responseShould('have a single activity', () => {
      ctx.response.should.have.all.keys('results', 'duration');
      ctx.response.results.should.be.lengthOf(1);
      ctx.activity = ctx.response.results[0];
    });
    ctx.activityShould('have enriched data', () => {
      ctx.activity.should.eql(enrichedActivity);
    });
  });

  describe('When getting the activity without feed by ID', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.getActivities({
        ids: [originalActivity.id],
      });
    });
    ctx.responseShould('have a single activity', () => {
      ctx.response.should.have.all.keys('results', 'duration');
      ctx.response.results.should.be.lengthOf(1);
      ctx.activity = ctx.response.results[0];
    });
    ctx.activityShouldHaveFields();
    ctx.activityShould('have enriched data', () => {
      ctx.activity.should.eql(enrichedActivity);
    });
  });

  describe('When getting the activity without feed by ID and with full enrichment', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.getActivities({
        ids: [originalActivity.id],
        reactions: {
          own: true,
          recent: true,
          counts: true,
        },
      });
    });
    ctx.responseShould('have a single activity', () => {
      ctx.response.should.have.all.keys('results', 'duration');
      ctx.response.results.should.be.lengthOf(1);
      ctx.activity = ctx.response.results[0];
    });
    ctx.activityShouldHaveFields(
      'latest_reactions',
      'latest_reactions_extra',
      'own_reactions',
      'reaction_counts',
    );
    ctx.activityShould('have enriched data', () => {
      ctx.activity.id.should.equal(originalActivity.id);
      ctx.activity.latest_reactions.should.eql({});
      ctx.activity.latest_reactions_extra.should.eql({});
      ctx.activity.own_reactions.should.eql({});
      ctx.activity.reaction_counts.should.eql({});
    });
  });
});
