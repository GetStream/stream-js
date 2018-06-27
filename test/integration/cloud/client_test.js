var stream = require('../../../src/getstream-enrich');
var config = require('../utils/config');
var signing = require('../../../src/lib/signing');
var randUserId = require('../utils/hooks').randUserId;
require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let ctx;
    let failed = false;
    let beforeFn = () => {
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
        ctx.doug = createUserSession('doug');
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

    describe('Enrich story', () => {
        before(beforeFn);
        let response;
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
});
