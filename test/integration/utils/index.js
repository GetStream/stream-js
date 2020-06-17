import expect from 'expect.js';

import signing from '../../../src/lib/signing';
import Promise from '../../../src/lib/promise';

import config from './config';

module.exports.wrapCB = function(expectedStatusCode, done, cb) {
  return function(error, response) {
    if (error) return done(error);
    expect(response.statusCode).to.be(expectedStatusCode);

    if (typeof cb === 'function') {
      cb.apply(cb, arguments);
    } else {
      done();
    }
  };
};

module.exports.feed = function(client, feedId, userId) {
  var token = signing.JWTScopeToken(config.API_SECRET, '*', '*', {
    feedId: feedId,
    userId: userId,
  }).token;

  return client.feed(feedId, userId, token);
};

module.exports.delay = function(s, wth) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(wth);
    }, s);
  });
};
