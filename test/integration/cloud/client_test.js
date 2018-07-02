var stream = require('../../../src/getstream-enrich');
var config = require('../utils/config');
var signing = require('../../../src/lib/signing');
var randUserId = require('../utils/hooks').randUserId;
var expect = require('chai').expect;
require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let response;
    let prevResponse;
    let ctx;
    let activity;
    let failed = false;
    let beforeFn = () => {
        response = null;
        activity = null;
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
    let activityShould = (label, fn) => {
        test('the activity should ' + label, fn);
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

    let responseShouldHaveFields = (...fields) => {
        responseShould('have all expected fields', () => {
            response.should.have.all.keys(fields);
        });
    };

    let responseShouldHaveNoActivities = () => {
        responseShould('have no activities', () => {
            response.results.should.eql([]);
        });
    };

    let responseShouldHaveActivityWithFields = (...fields) => {
        responseShould('have a single activity', () => {
            response.results.should.be.lengthOf(1);
            activity = response.results[0];
        });

        test('the activity should have all expected fields', () => {
            activity.should.have.all.keys(
                'id',
                'foreign_id',
                'time',
                'actor',
                'verb',
                'target',
                'object',
                'origin',
                ...fields,
            );
        });
    };

    let responseShouldHaveUUID = () => {
        responseShould('have a generated UUID as ID', () => {
            response.id.should.be.a('string').lengthOf(36);
        });
    };
    let reactionFields = [
        'id',
        'kind',
        'activity_id',
        'user_id',
        'data',
        'created_at',
        'updated_at',
    ];

    describe('Enrich story', () => {
        before(beforeFn);
        let cheeseBurgerData = {
            name: 'cheese burger',
            toppings: ['cheese'],
            objectID: 123,
        };
        let cheeseBurger;
        let eatCheeseBurgerActivity;
        let like;
        let like2;
        let comment;

        describe('When alice reads her empty feed', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').get();
            });

            responseShouldHaveNoActivities();
        });

        describe('When alice adds a cheese burger to the food collection', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .add(null, cheeseBurgerData);
            });

            responseShouldHaveFields(
                'id',
                'created_at',
                'updated_at',
                'collection',
                'data',
            );

            responseShouldHaveUUID();

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

        describe('When alice then reads her feed', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').get();
            });

            responseShouldHaveActivityWithFields();

            responseShould('have the activity containing enriched data', () => {
                activity.object.should.eql(cheeseBurger);
                eatCheeseBurgerActivity = response.results[0];
            });
        });

        describe('When bob reads his empty timeline', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob.feed('timeline').get();
            });

            responseShouldHaveNoActivities();
        });

        describe('When bob follows alice', () => {
            requestShouldNotError(async () => {
                await ctx.bob.followUser(ctx.alice.user);
            });
        });

        describe('When bob then reads his timeline with own reactions', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob.feed('timeline').get();
            });

            responseShouldHaveActivityWithFields();

            activityShould('contain enriched data', () => {
                activity.object.should.eql(cheeseBurger);
            });
        });

        describe('When bob then likes that alice ate the cheese burger', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob.react(
                    'like',
                    eatCheeseBurgerActivity.id,
                );
                like = response;
            });

            responseShouldHaveFields(...reactionFields);

            responseShouldHaveUUID();

            responseShould('have data matching the request', () => {
                response.should.deep.include({
                    kind: 'like',
                    activity_id: eatCheeseBurgerActivity.id,
                    user_id: ctx.bob.userId,
                });
                response.data.should.eql({});
            });
        });

        describe('When bob then reads his timeline with own reactions', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob
                    .feed('timeline')
                    .get({ withOwnReactions: true });
            });

            responseShouldHaveActivityWithFields('own_reactions');

            activityShould('contain the enriched data', () => {
                activity.object.should.eql(cheeseBurger);
            });

            activityShould('contain the reaction of bob', () => {
                activity.own_reactions.like.should.eql([like]);
            });
        });

        describe('When bob then reads alice her feed', () => {
            requestShouldNotError(async () => {
                response = await ctx.bob
                    .feed('user', ctx.alice.userId)
                    .get({ withOwnReactions: true });
            });

            responseShouldHaveActivityWithFields('own_reactions');

            activityShould('contain the enriched data', () => {
                activity.object.should.eql(cheeseBurger);
            });

            activityShould('contain the reaction of bob', () => {
                activity.own_reactions.like.should.eql([like]);
            });
        });

        describe('When carl then reads alice her feed', () => {
            requestShouldNotError(async () => {
                response = await ctx.carl
                    .feed('user', ctx.alice.userId)
                    .get({ withRecentReactions: true, withOwnReactions: true });
            });

            responseShouldHaveActivityWithFields(
                'own_reactions',
                'latest_reactions',
            );

            activityShould('contain the enriched data', () => {
                activity.object.should.eql(cheeseBurger);
            });

            activityShould('not contain anything in own_reactions', () => {
                activity.own_reactions.should.eql({});
            });

            activityShould(
                'contain the reaction of bob in latest_reactions',
                () => {
                    activity.latest_reactions.like.should.eql([like]);
                },
            );
        });

        describe('When dave also likes that alice ate the cheese burger', () => {
            requestShouldNotError(async () => {
                response = await ctx.dave.react(
                    'like',
                    eatCheeseBurgerActivity.id,
                );
                like2 = response;
            });

            responseShouldHaveFields(...reactionFields);

            responseShouldHaveUUID();

            responseShould('have data matching the request', () => {
                response.should.deep.include({
                    kind: 'like',
                    activity_id: eatCheeseBurgerActivity.id,
                    user_id: ctx.dave.userId,
                });
                response.data.should.eql({});
            });
        });

        describe('When dave then comments on that alice ate a cheeseburger', () => {
            requestShouldNotError(async () => {
                response = await ctx.dave.react(
                    'comment',
                    eatCheeseBurgerActivity.id,
                    {
                        text: 'Looks juicy!!!',
                    },
                );
                comment = response;
            });

            responseShouldHaveFields(...reactionFields);

            responseShouldHaveUUID();

            responseShould('have data matching the request', () => {
                response.should.deep.include({
                    kind: 'comment',
                    activity_id: eatCheeseBurgerActivity.id,
                    user_id: ctx.dave.userId,
                });
                response.data.should.eql({
                    text: 'Looks juicy!!!',
                });
            });
        });

        describe('When dave then reads alice her feed with all enrichment enabled', () => {
            requestShouldNotError(async () => {
                response = await ctx.dave.feed('user', ctx.alice.userId).get({
                    withRecentReactions: true,
                    withOwnReactions: true,
                    withReactionCounts: true,
                });
            });

            responseShouldHaveActivityWithFields(
                'own_reactions',
                'latest_reactions',
                'reaction_counts',
            );

            activityShould('contain the enriched data', () => {
                activity.object.should.eql(cheeseBurger);
            });

            activityShould(
                'contain dave his like and comment in own_reactions',
                () => {
                    activity.own_reactions.should.eql({
                        like: [like2],
                        comment: [comment],
                    });
                },
            );

            activityShould(
                'contain his own reactions and of bob his like in latest_reactions',
                () => {
                    activity.latest_reactions.should.eql({
                        like: [like, like2],
                        comment: [comment],
                    });
                },
            );

            activityShould(
                'have the correct counts for reactions',
                () => {
                    activity.reaction_counts.should.eql({
                        like: 2,
                        comment: 1,
                    });
                },
            );
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
            likes: ['cherries', 'curry'],
        };

        describe('When alice gets her account without creating it', () => {
            requestShouldError(404, async () => {
                response = await ctx.alice.user.get();
            });
        });

        let checkUserResponse = (userFn, data) => {
            responseShouldHaveFields('id', 'created_at', 'updated_at', 'data');

            responseShould('have id and data matching the request', () => {
                response.id.should.equal(userFn().id);
                response.data.should.eql(data);
            });

            test('the local user data should be updated', () => {
                userFn().data.should.eql(data);
            });
        };

        let checkProfileResponse = (userFn, data, following, followers) => {
            responseShouldHaveFields(
                'id',
                'created_at',
                'updated_at',
                'data',
                'following_count',
                'followers_count',
            );

            responseShould(
                'have id and data matching the previously submitted data',
                () => {
                    response.id.should.equal(userFn().id);
                    response.data.should.eql(data);
                },
            );

            test('the local user data should be updated', () => {
                userFn().data.should.eql(data);
            });

            responseShould(
                'contain the counts for following and followers for timeline->user feedgroups',
                () => {
                    response.following_count.should.equal(following);
                    response.followers_count.should.equal(followers);
                },
            );
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
                promises.push(ctx.alice.followUser(ctx.bob.userId));
                promises.push(ctx.alice.followUser(ctx.carl.userId));
                promises.push(
                    ctx.alice
                        .feed('timeline')
                        .follow('timeline', ctx.dave.userId),
                );
                promises.push(ctx.bob.followUser(ctx.alice.userId));
                promises.push(
                    ctx.bob
                        .feed('notification')
                        .follow('user', ctx.alice.userId),
                );
                promises.push(
                    ctx.carl
                        .feed('notification')
                        .follow('user', ctx.alice.userId),
                );
                promises.push(
                    ctx.dave
                        .feed('notification')
                        .follow('user', ctx.alice.userId),
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

        describe("When alice looks at bob's profile", () => {
            let bobUser;
            requestShouldNotError(async () => {
                bobUser = ctx.alice.getUser(ctx.bob.userId);
                response = await bobUser.profile();
            });

            checkProfileResponse(() => bobUser, newBobData, 1, 1);
        });
    });
});
