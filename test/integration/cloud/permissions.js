var { CloudContext } = require('./utils');
var randUserId = require('../utils/hooks').randUserId;
var util = require('util');

// eslint-disable-next-line no-unused-vars
function log(...args) {
  console.log(
    util.inspect(...args, { showHidden: false, depth: null, colors: true }),
  );
}

describe('Permission checking', () => {
  let ctx = new CloudContext();
  ctx.createUsers();
  describe('When alice tries to impersonate bob', () => {
    let at = new Date().toISOString();
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.bob.user,
        verb: 'post',
        object: 'I love Alice',
        foreign_id: 'fid:123',
        time: at,
      });
    });
  });
  describe('When alice tries to create another user', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.getUser(randUserId('someone')).create();
    });
  });
  describe('When alice tries to update bob', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice
        .getUser(ctx.bob.userId)
        .update({ hacked: true });
    });
  });
  describe('When alice tries to delete bob', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice
        .getUser(ctx.bob.userId)
        .update({ hacked: true });
    });
  });
});
