var stream = require('../../../src/getstream-enrich');
var config = require('../utils/config');
var signing = require('../../../src/lib/signing');
var randUserId = require('../utils/hooks').randUserId;
require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let response;
    let prevResponse;
    let ctx;
    let failed = false;
    let beforeFn = () => {
        response = null;
        prevResponse = null;
        failed = false;
        ctx = {};
        ctx.client = stream.connect(config.API_KEY, null, config.APP_ID, {
            group: 'testCycle',
            location: 'qa',
            protocol: 'https',
            browser: true,
        });
        let createUserSession = userId => {
            userId = randUserId(userId);
            return ctx.client.createUserSession(
                userId,
                signing.JWTScopeToken(config.API_SECRET, '*', '*', {
                    feedId: '*',
                    userId: userId,
                }),
            );
        };
        ctx.alice = createUserSession('alice');
        ctx.bob = createUserSession('bob');
        ctx.carl = createUserSession('carl');
        ctx.dave = createUserSession('dave');
    };

    // test is a wrapper around it that skips the test if a previous one in the
    // same story failed already.
    let test = (label, fn) => {
        it(label, async function() {
            if (failed) {
                this.skip();
            }
            try {
                await fn();
            } catch (ex) {
                failed = true;
                throw ex;
            }
        });
    };

    let requestShouldNotError = fn => {
        test('the request should not error', fn);
    };
    let responseShould = (label, fn) => {
        test('the response should ' + label, fn);
    };

    let requestShouldError = (statusCode, fn) => {
        test('the request should error with status ' + statusCode, async () => {
            try {
                await fn();
            } catch (e) {
                if (!(e instanceof stream.errors.StreamApiError)) {
                    throw e;
                }
                e.response.statusCode.should.equal(statusCode);
                response = e.error;
            }
        });
    };

    describe('Enrich story', () => {
        before(beforeFn);
        let cheeseBurgerData = {
            name: 'cheese burger',
            toppings: ['cheese'],
            objectID: 123,
        };
        let cheeseBurger;

        describe('When alice reads her empty feed through the enrich endpoint', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').get();
            });

            responseShould('be empty', () => {
                response.results.should.eql([]);
            });
        });

        describe('When alice adds a cheese burger to the food collection', () => {
            requestShouldNotError(async () => {
                response = await ctx.client
                    .storage('food', ctx.alice.token)
                    .add(undefined, cheeseBurgerData);
            });

            responseShould('have all expected fields', () => {
                response.should.have.all.keys(
                    'id',
                    'created_at',
                    'updated_at',
                    'collection',
                    'data',
                );
            });

            responseShould('have a generated UUID as ID', () => {
                response.id.should.be.a('string').lengthOf(36);
            });

            responseShould(
                'have collection and data matching the request',
                () => {
                    response.collection.should.equal('food');
                    response.data.should.eql(cheeseBurgerData);
                },
            );

            after(() => {
                cheeseBurger = response;
            });
        });

        describe('When alice eats the cheese burger', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').addActivity({
                    actor: ctx.alice.userId,
                    verb: 'eat',
                    object: `SC:food:${cheeseBurger.id}`,
                });
            });
        });

        describe('When alice then reads his feed through the enrich endpoint', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').get();
            });

            responseShould('have the activity containing enriched data', () => {
                response.results.should.be.lengthOf(1);
                response.results[0].object.should.eql(cheeseBurger);
            });
        });
    });
    describe('User profile story', () => {
        before(beforeFn);
        let aliceData = {
            name: 'Alice Abbot',
            likes: ['apples', 'ajax'],
        };
        let bobData = {
            name: 'Bob Baker',
            likes: ['berries'],
        };
        let newBobData = {
            name: bobData.name,
            hates: bobData.likes,
        };
        let carlData = {
            name: 'Carl Church',
            likes: ['apples', 'toyota'],
        };

        describe('When alice gets her account without creating it', () => {
            requestShouldError(404, async () => {
                response = await ctx.alice.user.get();
                console.log(response);
            });
        });

        let checkUserResponse = (userFn, data) => {
            responseShould('have all the expected fields', () => {
                response.should.have.all.keys(
                    'id',
                    'created_at',
                    'updated_at',
                    'data',
                );
            });

            responseShould('have id and data matching the request', () => {
                response.id.should.equal(userFn().id);
                response.data.should.eql(data);
            });

            test('the local user data should be updated', () => {
                userFn().data.should.eql(data);
            });
        };

        let checkProfileResponse = (userFn, data, following, followers) => {
            responseShould('have all the expected fields', () => {
                response.should.have.all.keys(
                    'id',
                    'created_at',
                    'updated_at',
                    'data',
                    'following_count',
                    'followers_count',
                );
            });

            responseShould('have id and data matching the previously submitted data', () => {
                response.id.should.equal(userFn().id);
                response.data.should.eql(data);
            });

            test('the local user data should be updated', () => {
                userFn().data.should.eql(data);
            });

            responseShould('contain the counts for following and followers for timeline->user feedgroups', () => {
                response.following_count.should.equal(following);
                response.followers_count.should.equal(followers);
            });

        };

        describe('When alice creates her account', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.user.create(aliceData);
            });
            checkUserResponse(() => ctx.alice.user, aliceData);
        });

        describe('When alice tries to create her account again', () => {
            requestShouldError(409, async () => {
                await ctx.alice.user.create(aliceData);
            });
        });

        describe('When bob calls getOrCreate for his user that does not exist yet', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob.user.getOrCreate(bobData);
            });
            checkUserResponse(() => ctx.bob.user, bobData);
        });

        describe('When bob calls getOrCreate for his existing user with new data', () => {
            requestShouldNotError(async () => {
                prevResponse = response;
                response = await ctx.bob.user.getOrCreate(newBobData);
            });

            responseShould('be the same as the previous response', () => {
                response.should.eql(prevResponse);
            });
        });

        describe('When bob updates his existing user', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob.user.update(newBobData);
            });
            checkUserResponse(() => ctx.bob.user, newBobData);
        });

        describe('When creating follow relationships', () => {
            requestShouldNotError(async () => {
                let promises = [];
                promises.push(
                    ctx.alice.followUser(ctx.bob.userId),
                );
                promises.push(
                    ctx.alice.followUser(ctx.carl.userId),
                );
                promises.push(
                    ctx.alice.feed('timeline').follow('timeline', ctx.dave.userId),
                );
                promises.push(
                    ctx.bob.followUser(ctx.alice.userId),
                );
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
            requestShouldNotError(async () => {
                response = await ctx.alice.user.profile();
            });

            checkProfileResponse(() => ctx.alice.user, aliceData, 2, 1);
        });

        describe('When alice looks at bob\'s profile', () => {
            let bobUser;
            requestShouldNotError(async () => {
                bobUser = ctx.alice.getUser(ctx.bob.userId);
                response = await bobUser.profile();
            });

            checkProfileResponse(() => bobUser, newBobData, 1, 1);
        });
    });
});
