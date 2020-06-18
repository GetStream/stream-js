import { CloudContext } from './utils';

describe('Get activities', () => {
  const ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();
  let originalActivity;
  let enrichedActivity;

  describe('When alice eats the cheese burger', () => {
    const at = new Date().toISOString();

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
      ctx.response = await ctx.alice.feed('user').getActivityDetail(originalActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields();
    ctx.activityShould('have enriched data', () => {
      ctx.activity.id.should.equal(originalActivity.id);
      ctx.activity.foreign_id.should.equal('fid:123');
      ctx.shouldEqualBesideDuration(ctx.activity.actor, ctx.alice.currentUser.full);
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
    ctx.activityShouldHaveFields('latest_reactions', 'latest_reactions_extra', 'own_reactions', 'reaction_counts');
    ctx.activityShould('have enriched data', () => {
      ctx.activity.id.should.equal(originalActivity.id);
      ctx.activity.latest_reactions.should.eql({});
      ctx.activity.latest_reactions_extra.should.eql({});
      ctx.activity.own_reactions.should.eql({});
      ctx.activity.reaction_counts.should.eql({});
    });
  });
});

describe('Update activities', () => {
  const ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();
  let firstActivity;
  let secondActivity;

  describe('When alice prepares the cheese burger', () => {
    const at = new Date().toISOString();

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'prepare',
        object: ctx.cheeseBurger,
        speed: 'slow',
        ingredients: {
          bread: 'white',
          meat: 'beef',
          vegetables: ['tomato', 'cucumber'],
        },
        foreign_id: 'fid:123',
        time: at,
      });
      firstActivity = ctx.response;
    });
  });

  describe('When bob eats the cheese burger', () => {
    const at = new Date().toISOString();

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:321',
        time: at,
        rating: 'undecided',
        expectations: 'low',
      });
      secondActivity = ctx.response;
    });
  });

  describe('When partially updating the activity by ID', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.serverSideClient.activityPartialUpdate({
        id: firstActivity.id,
        set: { speed: 'fast', 'ingredients.meat': 'chicken' },
        unset: [],
      });
      ctx.activity = ctx.response;
    });
    ctx.activityShouldHaveFields('speed', 'ingredients', 'duration');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(firstActivity.id);
      ctx.activity.speed.should.equal('fast');
      ctx.activity.ingredients.meat.should.equal('chicken');
    });
  });

  describe('When partially updating the activity by Foreign ID', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.serverSideClient.activityPartialUpdate({
        foreign_id: secondActivity.foreign_id,
        time: secondActivity.time,
        set: { speed: 'slow', rating: 'excellent' },
        unset: ['expectations'],
      });
      ctx.activity = ctx.response;
    });
    ctx.activityShouldHaveFields('rating', 'speed', 'duration');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(secondActivity.id);
      ctx.activity.speed.should.equal('slow');
      ctx.activity.rating.should.equal('excellent');
      ctx.activity.should.not.have.any.keys('expectations');
    });
  });

  describe('When batch partially updating by ID', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.serverSideClient.activitiesPartialUpdate([
        {
          id: firstActivity.id,
          set: { 'ingredients.bread': 'brown' },
          unset: ['speed'],
        },
        {
          id: secondActivity.id,
          set: { rating: 'passable' },
          unset: ['speed'],
        },
      ]);
    });
    ctx.responseShould('contain multiple activities', () => {
      ctx.response.should.have.all.keys('duration', 'activities');
      ctx.response.activities.should.be.lengthOf(2);
    });
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').getActivityDetail(firstActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields('ingredients');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(firstActivity.id);
      ctx.activity.ingredients.bread.should.equal('brown');
      ctx.activity.should.not.have.any.keys('speed');
    });
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user').getActivityDetail(secondActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields('rating');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(secondActivity.id);
      ctx.activity.rating.should.equal('passable');
      ctx.activity.should.not.have.any.keys('speed');
    });
  });

  describe('When batch partially updating by foreign ID', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.serverSideClient.activitiesPartialUpdate([
        {
          foreign_id: firstActivity.foreign_id,
          time: firstActivity.time,
          set: { speed: 'dangerous' },
          unset: ['ingredients.meat'],
        },
        {
          foreign_id: secondActivity.foreign_id,
          time: secondActivity.time,
          set: { speed: 'light' },
          unset: ['rating'],
        },
      ]);
    });
    ctx.responseShould('contain multiple activities', () => {
      ctx.response.should.have.all.keys('duration', 'activities');
      ctx.response.activities.should.be.lengthOf(2);
    });
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').getActivityDetail(firstActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields('ingredients', 'speed');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(firstActivity.id);
      ctx.activity.speed.should.equal('dangerous');
      ctx.activity.ingredients.should.not.have.any.keys('meat');
    });
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user').getActivityDetail(secondActivity.id);
    });
    ctx.responseShouldHaveActivityWithFields('speed');
    ctx.activityShould('have updated fields', () => {
      ctx.activity.id.should.equal(secondActivity.id);
      ctx.activity.speed.should.equal('light');
      ctx.activity.should.not.have.any.keys('rating');
    });
  });
});
