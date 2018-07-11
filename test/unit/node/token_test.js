var signing = require('../../../src/lib/signing'),
  expect = require('expect.js'),
  beforeEachFn = require('../utils/hooks').beforeEach;

describe('[UNIT] Creating tokens', function() {
  beforeEach(beforeEachFn);

  it('#getReadOnlyToken', function() {
    var token = this.client.getReadOnlyToken('user', 'test');

    expect(token).not.to.be(undefined);

    var feedId = 'usertest';
    var expected = signing.JWTScopeToken(this.client.apiSecret, '*', 'read', {
      feedId: feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });

  it('#getReadWriteToken', function() {
    var token = this.client.getReadWriteToken('user', 'test');

    expect(token).not.to.be(undefined);

    var feedId = 'usertest';
    var expected = signing.JWTScopeToken(this.client.apiSecret, '*', '*', {
      feedId: feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });

  it('feed #getReadOnlyToken', function() {
    var token = this.client.feed('user', 'test').getReadOnlyToken();

    expect(token).not.to.be(undefined);

    var feedId = 'usertest';
    var expected = signing.JWTScopeToken(this.client.apiSecret, '*', 'read', {
      feedId: feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });

  it('feed #getReadWriteToken', function() {
    var token = this.client.feed('user', 'test').getReadWriteToken();

    expect(token).not.to.be(undefined);

    var feedId = 'usertest';
    var expected = signing.JWTScopeToken(this.client.apiSecret, '*', '*', {
      feedId: feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });
});
