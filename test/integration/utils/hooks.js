const { connect } = require('../../../src');
const config = require('./config');

// this function can only be run in browser context
function jwt(resource, action, options) {
  const KJUR = require('./kjur'); // eslint-disable-line

  let header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  let payload = {
    resource,
    action,
  };

  if (options.feedId) {
    payload.feed_id = options.feedId;
  }

  if (options.userId) {
    payload.user_id = options.userId;
  }

  header = JSON.stringify(header);
  payload = JSON.stringify(payload);

  return KJUR.jws.JWS.sign('HS256', header, payload, process.env.STREAM_API_SECRET);
}

function randUserId(userId) {
  return `${userId}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function createFeedWithToken(client, feedGroup, userId, readOnly) {
  userId = randUserId(userId);

  const token = jwt('*', readOnly ? 'read' : '*', { feedId: feedGroup + userId });
  return client.feed(feedGroup, userId, token);
}

function initNode() {
  this.timeout(40000);
}

function initBrowser() {
  this.timeout(60000);
}

function beforeEachNode() {
  this.client = connect(config.API_KEY, config.API_SECRET, config.APP_ID, {
    group: 'testCycle',
    location: 'qa',
    protocol: 'https',
  });
  this.user1 = this.client.feed('user', randUserId('11'));
  this.user2 = this.client.feed('user', randUserId('22'));
  this.user3 = this.client.feed('user', randUserId('33'));
  this.user4 = this.client.feed('user', randUserId('44'));
  this.aggregated2 = this.client.feed('aggregated', randUserId('22'));
  this.aggregated3 = this.client.feed('aggregated', randUserId('33'));
  this.flat3 = this.client.feed('flat', randUserId('33'));
  this.secret3 = this.client.feed('secret', randUserId('33'));
  this.notification3 = this.client.feed('notification', randUserId('33'));
  const user1ReadOnlyId = randUserId('11');
  const user2ReadOnlyId = randUserId('22');
  this.user1ReadOnly = this.client.feed('user', user1ReadOnlyId, this.client.getReadOnlyToken('user', user1ReadOnlyId));
  this.user2ReadOnly = this.client.feed('user', user2ReadOnlyId, this.client.getReadOnlyToken('user', user2ReadOnlyId));
}

function beforeEachBrowser() {
  this.client = connect(config.API_KEY, null, config.APP_ID, {
    group: 'browserTestCycle',
    location: 'qa',
    protocol: 'https',
  });

  this.browserClient = connect(config.API_KEY, jwt(undefined, undefined, { userId: '123' }), config.APP_ID, {
    group: 'browserTestCycle',
    location: 'qa',
  });

  if (this.localRun) {
    this.client.baseUrl = 'http://localhost:8000/api/';
    this.client.fayeUrl = 'http://localhost:9999/faye/';
    this.browserClient.baseUrl = 'http://localhost:8000/api/';
    this.browserClient.fayeUrl = 'http://localhost:9999/faye/';
  }

  this.user1 = createFeedWithToken(this.client, 'user', '11');
  this.user2 = createFeedWithToken(this.client, 'user', '22');
  this.user3 = createFeedWithToken(this.client, 'user', '33');
  this.user4 = createFeedWithToken(this.client, 'user', '44');
  this.aggregated2 = createFeedWithToken(this.client, 'aggregated', '22');
  this.aggregated3 = createFeedWithToken(this.client, 'aggregated', '33');
  this.flat3 = createFeedWithToken(this.client, 'flat', '33');
  this.secret3 = createFeedWithToken(this.client, 'secret', '33');
  this.notification3 = createFeedWithToken(this.client, 'notification', '33');
  this.user1ReadOnly = createFeedWithToken(this.client, 'user', '11', true);
}

module.exports = {
  jwt,
  randUserId,
  initNode,
  initBrowser,
  beforeEachNode,
  beforeEachBrowser,
  beforeEachFn: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
  init: config.IS_NODE_ENV ? initNode : initBrowser,
};
