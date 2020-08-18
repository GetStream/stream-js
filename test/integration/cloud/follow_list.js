import { expect } from 'chai';

import { CloudContext } from './utils';

describe('Read followers', () => {
  const ctx = new CloudContext();

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

    ctx.responseShould('should include a user key with bob and carl', async function () {
      this.skip();
      ctx.response.should.have.property('users');
      ctx.response.users[ctx.bob.userId].data.should.eql(ctx.userData.bob);
      ctx.response.users[ctx.carl.userId].data.should.eql(ctx.userData.carl);
    });
  });
});

describe('Read followings', () => {
  const ctx = new CloudContext();

  ctx.createUsers();

  describe('When initializing follow relationships', async function () {
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

    ctx.responseShould('should include a user key with bob and carl', async function () {
      this.skip();
      ctx.response.should.have.property('users');
      ctx.response.users[ctx.bob.userId].data.should.eql(ctx.userData.bob);
      ctx.response.users[ctx.carl.userId].data.should.eql(ctx.userData.carl);
    });
  });
});

describe('Follow stats', async () => {
  const ctx = new CloudContext();
  ctx.createUsers();

  describe('When initializing follow relationships', async function () {
    ctx.noRequestsShouldError(async () => {
      await Promise.all([
        ctx.alice.feed('timeline').follow('user', ctx.bob.currentUser),
        ctx.alice.feed('timeline').follow('user', ctx.carl.currentUser),
        ctx.alice.feed('timeline').follow('timeline', ctx.dave.currentUser),

        ctx.bob.feed('user').follow('timeline', ctx.alice.currentUser),
        ctx.carl.feed('timeline').follow('timeline', ctx.alice.currentUser),
      ]);
    });
  });

  describe('When alice get the follow stats', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('timeline').followStats();
    });

    ctx.responseShould('should include the feed id', function () {
      ctx.response.should.have.property('results');
      ctx.response.results.should.have.property('following');
      ctx.response.results.should.have.property('followers');
      ctx.response.results.following.feed.should.eql(ctx.alice.feed('timeline').id);
      ctx.response.results.followers.feed.should.eql(ctx.alice.feed('timeline').id);
    });

    ctx.responseShould('should have 3 followings and 2 followers', function () {
      ctx.response.results.following.count.should.eql(3);
      ctx.response.results.followers.count.should.eql(2);
    });
  });

  describe('When alice get the follow stats for single feed slug', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('timeline')
        .followStats({ followerSlugs: ['timeline'], followingSlugs: ['timeline'] });
    });

    ctx.responseShould('should include the feed id', function () {
      ctx.response.should.have.property('results');
      ctx.response.results.should.have.property('following');
      ctx.response.results.should.have.property('followers');
      ctx.response.results.following.feed.should.eql(ctx.alice.feed('timeline').id);
      ctx.response.results.followers.feed.should.eql(ctx.alice.feed('timeline').id);
    });

    ctx.responseShould('should have 1 followings and 1 followers', function () {
      ctx.response.results.following.count.should.eql(1);
      ctx.response.results.followers.count.should.eql(1);
    });
  });

  describe('When alice get the follow stats for multiple feed slugs', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('timeline')
        .followStats({ followerSlugs: ['timeline', 'user'], followingSlugs: ['timeline'] });
    });

    ctx.responseShould('should have 2 followings and 1 followers', function () {
      ctx.response.results.following.count.should.eql(1);
      ctx.response.results.followers.count.should.eql(2);
    });
  });

  describe('When alice get the follow stats for feed slugs without follow', async () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('timeline')
        .followStats({ followerSlugs: ['news'], followingSlugs: ['news'] });
    });

    ctx.responseShould('should have 0 followings and 0 followers', function () {
      ctx.response.results.following.count.should.eql(0);
      ctx.response.results.followers.count.should.eql(0);
    });
  });
});
