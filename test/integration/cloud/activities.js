var { CloudContext } = require('./utils');

describe('Get activities', () => {
  let ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();

  describe('When alice eats the cheese burger', () => {
    let at = new Date().toISOString();

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.alice.user,
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:123',
        time: at,
      });
    });

    it('Should be possible to read the same activity by ID', async () => {
      let response = await ctx.alice
        .feed('user')
        .getActivityDetail([ctx.response.id]);
      let activity = response.results[0];
      activity.should.have.property('foreign_id');
      ctx.shouldEqualBesideDuration(activity.actor, ctx.alice.user.full);
      activity.verb.should.equal('eat');
      ctx.shouldEqualBesideDuration(activity.object, ctx.cheeseBurger.full);
      activity.object.collection.should.equal('food');
      // activity.object.data.name.should.equal('cheese burger');
    });
  });
});
