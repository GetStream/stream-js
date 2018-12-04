var { CloudContext } = require('./utils');
var expect = require('chai').expect;

describe('Read followers', () => {
  let ctx = new CloudContext();

  ctx.createUsers();

  describe('When initializing follow relationships', () => {
    ctx.noRequestsShouldError(async () => {
      await Promise.all([
        ctx.bob.feed('timeline').follow('user', ctx.alice.currentUser),
        ctx.carl.feed('timeline').follow('user', ctx.alice.currentUser),
        ctx.dave.feed('timeline').follow('user', ctx.alice.currentUser),
      ]);
    });
  });

  describe('When alice reads the list of followers', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').followers();
    });

    ctx.responseShould('have 3', () => {
      expect(ctx.response.results).to.have.lengthOf(3);
    });

    ctx.responseShould(
      'should include a user key with bob and carl',
      async function() {
        this.skip();
        ctx.response.should.have.property('users');
        ctx.response.users[ctx.bob.userId].data.should.eql(ctx.userData.bob);
        ctx.response.users[ctx.carl.userId].data.should.eql(ctx.userData.carl);
      },
    );
  });
});

describe('Read followings', () => {
  let ctx = new CloudContext();

  ctx.createUsers();

  describe('When initializing follow relationships', async function() {
    ctx.noRequestsShouldError(async () => {
      await Promise.all([
        ctx.alice.feed('timeline').follow('user', ctx.bob.currentUser),
        ctx.alice.feed('timeline').follow('user', ctx.carl.currentUser),
        ctx.alice.feed('timeline').follow('user', ctx.dave.currentUser),
      ]);
    });
  });

  describe('When alice reads the list of followings', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('timeline').following();
    });
    ctx.responseShould('have 3', () => {
      expect(ctx.response.results).to.have.lengthOf(3);
    });

    ctx.responseShould(
      'should include a user key with bob and carl',
      async function() {
        this.skip();
        ctx.response.should.have.property('users');
        ctx.response.users[ctx.bob.userId].data.should.eql(ctx.userData.bob);
        ctx.response.users[ctx.carl.userId].data.should.eql(ctx.userData.carl);
      },
    );
  });
});
