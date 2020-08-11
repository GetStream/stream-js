import expect from 'expect.js';

import { FeedError } from '../../../src/errors';
import utils from '../../../src/utils';
import { init } from '../utils/hooks';

describe('[UNIT] Utility functions', function () {
  init.call(this);

  it("should validate feed id's", function () {
    expect(utils.validateFeedId('flat:0')).to.be.ok();
  });

  it('should throw exception while validating faulty feed id', function () {
    expect(function () {
      utils.validateFeedId('b134u92fval');
    }).to.throwError(function (e) {
      expect(e).to.be.a(FeedError);
    });
  });

  it('#rfc3986', function () {
    const result = utils.rfc3986("hello!'()*matthisk");

    expect(result).to.be('hello%21%27%28%29%2Amatthisk');
  });
});
