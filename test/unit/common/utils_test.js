var utils = require('../../../src/lib/utils')
  , expect = require('expect.js')
  , errors = require('../../../src/lib/errors');

describe('Utility functions', function() {

    it('should validate feed id\'s', function() {
        expect(utils.validateFeedId('flat:0')).to.be.ok();
    });

    it('should throw exception while validating faulty feed id',function() {
        expect(function() {
            utils.validateFeedId('b134u92fval');
        }).to.throwError(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
    });

    it('#rfc3986', function() {
        var result = utils.rfc3986('hello!\'()*matthisk');

        expect(result).to.be('hello%21%27%28%29%2Amatthisk');
    });

});