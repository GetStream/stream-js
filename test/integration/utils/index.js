import signing from '../../../src/lib/signing';

import config from './config';

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
