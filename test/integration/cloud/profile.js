var { CloudContext } = require('./utils');

describe('User profile story', () => {
    let ctx = new CloudContext();
    let aliceData = ctx.userData.alice;
    let bobData = ctx.userData.bob;
    let newBobData = {
        name: bobData.name,
        hates: bobData.likes,
    };

    describe('When alice gets her account without creating it', () => {
        ctx.requestShouldError(404, async () => {
            ctx.response = await ctx.alice.user.get();
        });
    });

    let checkUserResponse = (userFn, data) => {
        ctx.responseShouldHaveFields('id', 'created_at', 'updated_at', 'data');

        ctx.responseShould('have id and data matching the request', () => {
            ctx.response.id.should.equal(userFn().id);
            ctx.response.data.should.eql(data);
        });

        ctx.test('the local user data should be updated', () => {
            userFn().data.should.eql(data);
        });
    };

    let checkProfileResponse = (userFn, data, following, followers) => {
        ctx.responseShouldHaveFields(
            'id',
            'created_at',
            'updated_at',
            'data',
            'following_count',
            'followers_count',
        );

        ctx.responseShould(
            'have id and data matching the previously submitted data',
            () => {
                ctx.response.id.should.equal(userFn().id);
                ctx.response.data.should.eql(data);
            },
        );

        ctx.test('the local user data should be updated', () => {
            userFn().data.should.eql(data);
        });

        ctx.responseShould(
            'contain the counts for following and followers for timeline->user feedgroups',
            () => {
                ctx.response.following_count.should.equal(following);
                ctx.response.followers_count.should.equal(followers);
            },
        );
    };

    describe('When alice creates her account', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.user.create(aliceData);
        });
        checkUserResponse(() => ctx.alice.user, aliceData);
    });

    describe('When alice tries to create her account again', () => {
        ctx.requestShouldError(409, async () => {
            await ctx.alice.user.create(aliceData);
        });
    });

    describe('When bob calls getOrCreate for his user that does not exist yet', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.bob.user.getOrCreate(bobData);
        });
        checkUserResponse(() => ctx.bob.user, bobData);
    });

    describe('When bob calls getOrCreate for his existing user with new data', () => {
        ctx.requestShouldNotError(async () => {
            ctx.prevResponse = ctx.response;
            ctx.response = await ctx.bob.user.getOrCreate(newBobData);
        });

        ctx.responseShould('be the same as the previous response', () => {
            ctx.response.should.eql(ctx.prevResponse);
        });
    });

    describe('When bob updates his existing user', () => {
        ctx.requestShouldNotError(async () => {
            ctx.prevResponse = ctx.response;
            ctx.response = await ctx.bob.user.update(newBobData);
        });
        checkUserResponse(() => ctx.bob.user, newBobData);
        ctx.responseShouldHaveNewUpdatedAt();
    });

    describe('When creating follow relationships', () => {
        ctx.requestShouldNotError(async () => {
            let promises = [];
            promises.push(ctx.alice.followUser(ctx.bob.userId));
            promises.push(ctx.alice.followUser(ctx.carl.userId));
            promises.push(
                ctx.alice.feed('timeline').follow('timeline', ctx.dave.userId),
            );
            promises.push(ctx.bob.followUser(ctx.alice.userId));
            promises.push(
                ctx.bob.feed('notification').follow('user', ctx.alice.userId),
            );
            promises.push(
                ctx.carl.feed('notification').follow('user', ctx.alice.userId),
            );
            promises.push(
                ctx.dave.feed('notification').follow('user', ctx.alice.userId),
            );
            await Promise.all(promises);
        });
    });

    describe('When alice looks at her own profile', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.user.profile();
        });

        checkProfileResponse(() => ctx.alice.user, aliceData, 2, 1);
    });

    describe("When alice looks at bob's profile", () => {
        let bobUser;
        ctx.requestShouldNotError(async () => {
            bobUser = ctx.alice.getUser(ctx.bob.userId);
            ctx.response = await bobUser.profile();
        });

        checkProfileResponse(() => bobUser, newBobData, 1, 1);
    });

    describe('When alice tries to set a string as user data', () => {
        ctx.requestShouldError(400, async () => {
            ctx.response = await ctx.alice.user.update('some string');
        });
    });
});
