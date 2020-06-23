import expect from 'expect.js';

import signing from '../../../src/lib/signing';

import config from './config';

export function wrapCB(expectedStatusCode, done, cb) {
  return function (error, response) {
    if (error) return done(error);
    expect(response.statusCode).to.be(expectedStatusCode);

    if (typeof cb === 'function') {
      cb.apply(cb, [error, response]);
    } else {
      done();
    }
  };
}

function feed(client, feedId, userId) {
  const { token } = signing.JWTScopeToken(config.API_SECRET, '*', '*', {
    feedId,
    userId,
  });

  return client.feed(feedId, userId, token);
}

function delay(s, wth) {
  return new Promise((resolve) => setTimeout(() => resolve(wth), s));
}

export default { feed, delay };
