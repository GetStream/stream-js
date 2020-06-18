import { CloudContext } from './utils';

describe('User profile story', () => {
  const ctx = new CloudContext();
  const aliceData = ctx.userData.alice;
  const bobData = ctx.userData.bob;
  const newBobData = {
    name: bobData.name,
    hates: bobData.likes,
  };

  describe('When alice gets her account without creating it', () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.user(ctx.alice.userId).get();
    });
  });

  const checkUserResponse = (userFn, data) => {
    ctx.responseShouldHaveFields('id', 'created_at', 'updated_at', 'data');

    ctx.responseShould('have id and data matching the request', () => {
      ctx.response.id.should.equal(userFn().id);
      ctx.response.data.should.eql(data);
    });

    ctx.test('the local user data should be updated', () => {
      userFn().data.should.eql(data);
    });
  };

  const checkProfileResponse = (userFn, data, following, followers) => {
    ctx.responseShouldHaveFields('id', 'created_at', 'updated_at', 'data', 'following_count', 'followers_count');

    ctx.responseShould('have id and data matching the previously submitted data', () => {
      ctx.response.id.should.equal(userFn().id);
      ctx.response.data.should.eql(data);
    });

    ctx.test('the local user data should be updated', () => {
      userFn().data.should.eql(data);
    });

    ctx.responseShould('contain the counts for following and followers for timeline->user feedgroups', () => {
      ctx.response.following_count.should.equal(following);
      ctx.response.followers_count.should.equal(followers);
    });
  };

  describe('When alice creates her account', () => {
    ctx.requestShouldNotError(async () => {
      ctx.user = await ctx.alice.currentUser.getOrCreate(aliceData);
      ctx.response = ctx.user.full;
    });
    checkUserResponse(() => ctx.response, aliceData);
  });

  describe('When alice looks at her own profile', () => {
    ctx.requestShouldNotError(async () => {
      const user = await ctx.user.profile();
      ctx.response = user.full;
    });

    ctx.responseShouldHaveFields('id', 'created_at', 'updated_at', 'data', 'followers_count', 'following_count');
  });

  describe('When alice tries to create her account again', () => {
    ctx.requestShouldError(409, async () => {
      await ctx.user.create(aliceData);
    });
  });

  describe('When bob calls getOrCreate for his user that does not exist yet', () => {
    ctx.requestShouldNotError(async () => {
      ctx.user = await ctx.bob.currentUser.getOrCreate(bobData);
      ctx.response = ctx.user.full;
    });
    checkUserResponse(() => ctx.response, bobData);
  });

  describe('When bob calls getOrCreate for his existing user with new data', () => {
    ctx.requestShouldNotError(async () => {
      ctx.prevResponse = ctx.response;
      ctx.user = await ctx.bob.currentUser.getOrCreate(newBobData);
      ctx.response = ctx.user.full;
    });

    ctx.responseShould('be the same as the previous response', () => {
      ctx.response.should.eql(ctx.prevResponse);
    });
  });

  describe('When bob updates his existing user', () => {
    ctx.requestShouldNotError(async () => {
      ctx.prevResponse = ctx.response;
      ctx.user = await ctx.user.update(newBobData);
      ctx.response = ctx.user.full;
    });
    checkUserResponse(() => ctx.user, newBobData);
    ctx.responseShouldHaveNewUpdatedAt();
  });

  describe('When creating follow relationships', () => {
    ctx.requestShouldNotError(async () => {
      const promises = [];
      promises.push(ctx.alice.feed('timeline', ctx.alice.userId).follow('user', ctx.bob.userId));
      promises.push(ctx.alice.feed('user', ctx.alice.userId).follow('user', ctx.carl.userId));
      promises.push(ctx.alice.feed('timeline', ctx.alice.userId).follow('timeline', ctx.dave.userId));
      promises.push(ctx.bob.feed('timeline', ctx.bob.userId).follow('user', ctx.alice.userId));
      promises.push(ctx.bob.feed('notification', ctx.bob.userId).follow('user', ctx.alice.userId));
      promises.push(ctx.carl.feed('notification', ctx.carl.userId).follow('user', ctx.alice.userId));
      promises.push(ctx.dave.feed('notification', ctx.dave.userId).follow('user', ctx.alice.userId));
      await Promise.all(promises);
    });
  });

  describe("When alice looks at bob's profile", () => {
    let bobUser;
    ctx.requestShouldNotError(async () => {
      bobUser = await ctx.alice.user(ctx.bob.userId).profile();
      ctx.response = await bobUser.full;
    });

    checkProfileResponse(() => ctx.response, newBobData, 1, 1);
  });

  describe('When alice tries to set a string as user data', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.user(ctx.alice.userId).update('some string');
    });
  });

  describe('When alice deletes her profile', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.user(ctx.alice.userId).delete();
    });

    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.user(ctx.alice.userId).get();
    });
  });

  describe('When alice tries to delete bob', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.user(ctx.bob.userId).delete();
    });
  });
});
