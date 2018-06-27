var beforeEachFn = require('../utils/hooks').beforeEachNode;
require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let ctx;
    let beforeFn = () => {
        ctx = {};
        beforeEachFn(ctx);
    };
    let requestShouldNotError = fn => {
        it('the request should not error', fn);
    };
    let responseShould = (str, fn) => {
        it('the response should ' + str, fn);
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

        describe('When user1 reads his empty feed through the enrich endpoint', () => {
            requestShouldNotError(async () => {
                response = await ctx.user1.getEnriched();
            });

            responseShould('be empty', () => {
                response.results.should.eql([]);
            });
        });

        describe('When user1 adds a cheese burger to the food collection', () => {
            requestShouldNotError(async () => {
                response = await ctx.client
                    .collection('food', ctx.user1.getReadWriteToken())
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

        describe('When user1 eats the cheese burger', () => {
            requestShouldNotError(async () => {
                response = await ctx.user1.addActivity({
                    actor: ctx.user1.userId,
                    verb: 'eat',
                    object: `SC:food:${cheeseBurger.id}`,
                });
            });
        });

        describe('When user1 then reads his feed through the regular endpoint', () => {
            requestShouldNotError(async () => {
                response = await ctx.user1.get();
            });

            responseShould(
                'have the activity should have the non enriched object',
                () => {
                    response.results.should.be.lengthOf(1);
                    response.results[0].object.should.eql(
                        `SC:food:${cheeseBurger.id}`,
                    );
                },
            );
        });
        describe('When user1 then reads his feed through the enrich endpoint', () => {
            requestShouldNotError(async () => {
                response = await ctx.user1.getEnriched();
            });

            responseShould('have the activity containing enriched data', () => {
                response.results.should.be.lengthOf(1);
                response.results[0].object.should.eql(cheeseBurger);
            });
        });
    });
});
