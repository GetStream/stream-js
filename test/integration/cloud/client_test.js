var stream = require('../../../src/getstream-enrich');
var config = require('../utils/config');
var signing = require('../../../src/lib/signing');
var randUserId = require('../utils/hooks').randUserId;
var expect = require('chai').expect;
var should = require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let response;
    let prevResponse;
    let ctx;
    let activity;
    let failed = false;
    let cheeseBurger;
    let cheeseBurgerData;
    let beforeFn = () => {
        response = null;
        activity = null;
        prevResponse = null;
        failed = false;
        cheeseBurgerData = {
            name: 'cheese burger',
            toppings: ['cheese'],
        };
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
                expect.fail(null, null, 'request should not succeed');
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

    let responseShouldHaveNewUpdatedAt = () => {
        responseShould('have an updated updated_at', () => {
            should.exist(prevResponse.updated_at);
            should.exist(response.updated_at);
            response.updated_at.should.not.equal(prevResponse.updated_at);
        });
    };

    let responseShouldEqualPreviousResponse = () => {
        responseShould('be the same as the previous response', () => {
            should.exist(prevResponse);
            should.exist(response);
            response.should.eql(prevResponse);
        });
    };


    let collectionFields = [
        'id',
        'created_at',
        'updated_at',
        'collection',
        'data',
    ];

    let reactionFields = [
        'id',
        'kind',
        'activity_id',
        'user_id',
        'data',
        'created_at',
        'updated_at',
    ];

    let aliceAddsCheeseBurger = () => {
        describe('When alice adds a cheese burger to the food collection', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .add(null, cheeseBurgerData);
            });

            responseShouldHaveFields(...collectionFields);

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
    };

    describe('Enrich story', () => {
        before(beforeFn);
        let eatCheeseBurgerActivity;
        let like;
        let like2;
        let comment;

        aliceAddsCheeseBurger();

        describe('When alice reads her empty feed', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.feed('user').get();
            });

            responseShouldHaveNoActivities();
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
                    eatCheeseBurgerActivity,
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

            activityShould('have the correct counts for reactions', () => {
                activity.reaction_counts.should.eql({
                    like: 2,
                    comment: 1,
                });
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
                prevResponse = response;
                response = await ctx.bob.user.update(newBobData);
            });
            checkUserResponse(() => ctx.bob.user, newBobData);
            responseShouldHaveNewUpdatedAt();
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

    describe('OpenGraph story', () => {
        before(beforeFn);

        describe('When alice requests opengraph info for our blog', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.og(
                    'https://getstream.io/blog/try-out-the-stream-api-with-postman',
                );
            });

            responseShould('have the expected content', () => {
                response.should.eql({
                    locale: 'en_US',
                    type: 'article',
                    title:
                        'Try out the Stream API with Postman - The Stream Blog',
                    description:
                        "Many of us at Stream use Postman regularly as we build and test our services. We're also always looking for ways to make it quick and easy for other developers to try the service. One of our goals is to help people see first hand how simple it is to build powerful social apps with Stream.",
                    url:
                        'https://getstream.io/blog/try-out-the-stream-api-with-postman/',
                    site_name: 'The Stream Blog',
                    images: [
                        {
                            image:
                                'https://getstream-blog.imgix.net/blog/wp-content/uploads/2018/04/stream_postman.png',
                            secure_url:
                                'https://getstream-blog.imgix.net/blog/wp-content/uploads/2018/04/stream_postman.png',
                            width: '1600',
                            height: '835',
                            alt: 'Postman Collection for the Stream API',
                        },
                    ],
                });
            });
        });

        describe('When alice requests opengraph info for a binary blob', () => {
            requestShouldError(400, async () => {
                response = await ctx.alice.og(
                    'https://github.com/buger/goreplay/releases/download/v0.16.1/gor_0.16.1_mac.tar.gz',
                );
            });

            responseShould('have the expected content', () => {
                response.should.eql({
                    detail: 'document too large (>1MB)',
                });
            });
        });
    });

    describe('Collection CRUD behaviours', () => {
        beforeFn();
        let improvedCheeseBurgerData = {
            name: 'The improved cheese burger',
            toppings: ['cheese', 'pickles', 'bacon'],
        };
        aliceAddsCheeseBurger();

        describe('When alice tries to get the cheeseburger', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice.storage('food').get(cheeseBurger.id);
                prevResponse = response;
            });

            responseShould(
                'be the same as when the cheeseburger was added',
                async () => {
                    response.should.eql(cheeseBurger);
                },
            );
        });

        describe('When bob tries to add the improved cheeseburger with the same ID', () => {
            requestShouldError(409, async () => {
                response = await ctx.bob
                    .storage('food')
                    .add(cheeseBurger.id, improvedCheeseBurgerData);
            });
        });

        describe('When alice tries to add the improved cheeseburger with the same ID', () => {
            requestShouldError(409, async () => {
                response = await ctx.alice
                    .storage('food')
                    .add(cheeseBurger.id, improvedCheeseBurgerData);
            });
        });

        describe('When bob tries to update the cheeseburger', () => {
            requestShouldError(403, async () => {
                response = await ctx.bob
                    .storage('food')
                    .update(cheeseBurger.id, improvedCheeseBurgerData);
            });
        });

        describe('When alice tries to update the cheeseburger', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .update(cheeseBurger.id, improvedCheeseBurgerData);
            });
            responseShouldHaveNewUpdatedAt();
        });

        describe('When alice then tries to get the cheeseburger', () => {
            requestShouldNotError(async () => {
                prevResponse = response;
                response = await ctx.alice.storage('food').get(cheeseBurger.id);
            });

            responseShouldEqualPreviousResponse();
        });

        describe('When alice tries to change the ID of cheeseburger in an update call', () => {
            requestShouldError(400, async () => {
                let storage = ctx.alice.storage('food');
                var body = {
                    id: 1234,
                    data: improvedCheeseBurgerData,
                };
                await storage.client.put({
                    url: storage.buildURL(cheeseBurger.id),
                    body: body,
                    signature: storage.signature,
                });
            });
        });

        describe('When bob tries to delete the cheeseburger', () => {
            requestShouldError(403, async () => {
                response = await ctx.bob
                    .storage('food')
                    .delete(cheeseBurger.id);
            });
        });

        describe('When alice tries to delete the cheeseburger', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .delete(cheeseBurger.id);
            });
        });

        describe('When alice then tries to get the cheeseburger', () => {
            requestShouldError(404, async () => {
                await ctx.alice.storage('food').get(cheeseBurger.id);
            });
        });


        describe('When alice tries to create an object with an illegal character in the id', () => {
            requestShouldError(400, async () => {
                await ctx.alice.storage('food').add('!abcdee!', {});
            });
        });

        let newCheeseBurger;

        describe('When alice tries to add a new cheeseburger with a provided ID', () => {
            let newCheeseBurgerID = randUserId('cheeseburger');
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .add(newCheeseBurgerID, cheeseBurgerData);
            });

            responseShouldHaveFields(...collectionFields);

            responseShould(
                'have ID, collection and data matching the request',
                () => {
                    response.id.should.equal(newCheeseBurgerID);
                    response.collection.should.equal('food');
                    response.data.should.eql(cheeseBurgerData);
                },
            );

            after(() => {
                newCheeseBurger = response;
            });
        });

        describe('When alice tries to get the new cheeseburger', () => {
            requestShouldNotError(async () => {
                response = await ctx.alice
                    .storage('food')
                    .get(newCheeseBurger.id);
            });
            responseShould(
                'be the same as when the new cheeseburger was added',
                async () => {
                    response.should.eql(newCheeseBurger);
                },
            );
        });

    });
});
