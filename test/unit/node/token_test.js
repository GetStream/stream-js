import expect from 'expect.js';

import { JWTScopeToken } from '../../../src';
import { beforeEachFn } from '../utils/hooks';

describe('[UNIT] Creating tokens', function () {
  beforeEach(beforeEachFn);

  it('#getReadOnlyToken', function () {
    const token = this.client.getReadOnlyToken('user', 'test');

    expect(token).not.to.be(undefined);

    const feedId = 'usertest';
    const expected = JWTScopeToken(this.client.apiSecret, '*', 'read', {
      feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });

  it('#getReadWriteToken', function () {
    const token = this.client.getReadWriteToken('user', 'test');

    expect(token).not.to.be(undefined);

    const feedId = 'usertest';
    const expected = JWTScopeToken(this.client.apiSecret, '*', '*', {
      feedId,
      expireTokens: this.client.expireTokens,
    });

    expect(token).to.be(expected);
  });

  it('#multiClaimToken', () => {
    const token = JWTScopeToken('abcdefghijklmnop', ['personalization', 'collections'], ['read', 'delete'], {
      feedId: ['timeline:me', 'timeline:you'],
    });
    expect(token).to.be(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6InBlcnNvbmFsaXphdGlvbixjb2xsZWN0aW9ucyIsImFjdGlvbiI6InJlYWQsZGVsZXRlIiwiZmVlZF9pZCI6InRpbWVsaW5lOm1lLHRpbWVsaW5lOnlvdSJ9.zWwZIdeWl2HCFvFPC9aMK4h832bmoQuifmUlyPq9knE',
    );
  });
});
