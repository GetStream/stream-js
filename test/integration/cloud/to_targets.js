var { CloudContext } = require('./utils');

describe('To targets', () => {
  let ctx = new CloudContext();
  ctx.createUsers();
  ctx.aliceAddsCheeseBurger();

  describe('When alice adds an activity with a badly typed to target', () => {
    let at = new Date().toISOString();

    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:123',
        to: 'abc',
        time: at,
      });
    });
  });

  describe('When alice adds an activity with a to target that she cannot write to', () => {
    let at = new Date().toISOString();

    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:123',
        to: ['user:123'],
        time: at,
      });
    });
  });

  describe('When alice adds an activity with a to target that she can write to', () => {
    let at = new Date().toISOString();

    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'eat',
        object: ctx.cheeseBurger,
        foreign_id: 'fid:123',
        to: ['notification:123'],
        time: at,
      });
    });
  });
});
