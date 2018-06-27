var beforeEachFn = require('../utils/hooks').beforeEachNode;
require('chai').should();

describe('[INTEGRATION] Stream cloud', () => {
    let ctx;
    let beforeFn = () => {
        ctx = {};
        beforeEachFn(ctx);
    };

    describe('Enrich story', () => {
        before(beforeFn);
        describe('When user1 reads his empty feed through the enrich endpoint', () => {
            let response;
            before(async () => {
                response = await ctx.user1.getEnriched();
            });

            it('should be empty', () => {
                response.results.should.eql([]);
            });
        });
    });
});
