var stream = require('../../../src/getstream'),
  config = require('./config');

function jwt(resource, action, options) {
  var KJUR = require('exports?KJUR!./kjur');

  var header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  var payload = {
    resource: resource,
    action: action,
  };

  if (options.feedId) {
    payload['feed_id'] = options.feedId;
  }

  if (options.userId) {
    payload['user_id'] = options.userId;
  }

  header = JSON.stringify(header);
  payload = JSON.stringify(payload);

  var res = KJUR.jws.JWS.sign(
    'HS256',
    header,
    payload,
    process.env.STREAM_API_SECRET
  );

  return res;
}

function randUserId(userId) {
  return userId + '-' + Date.now() + '-' + Math.round(Math.random() * 1000);
}

function createFeedWithToken(client, feedGroup, userId, readOnly) {
  userId = randUserId(userId);

  var token = jwt('*', readOnly ? 'read' : '*', { feedId: feedGroup + userId });
  return client.feed(feedGroup, userId, token);
}

function initNode() {
  this.timeout(40000);
}

function initBrowser() {
  this.timeout(40000);
}

function beforeEachNode() {
  this.client = stream.connect(
    config.API_KEY,
    config.API_SECRET
  );
  this.client = stream.connect(
    config.API_KEY,
    config.API_SECRET,
    config.APP_ID,
    {
      group: 'testCycle',
      location: 'qa',
      protocol: 'https',
    }
  );
  this.user1 = this.client.feed('user', randUserId('11'));
  this.user2 = this.client.feed('user', randUserId('22'));
  this.user3 = this.client.feed('user', randUserId('33'));
  this.user4 = this.client.feed('user', randUserId('44'));
  this.aggregated2 = this.client.feed('aggregated', randUserId('22'));
  this.aggregated3 = this.client.feed('aggregated', randUserId('33'));
  this.flat3 = this.client.feed('flat', randUserId('33'));
  this.secret3 = this.client.feed('secret', randUserId('33'));
  this.notification3 = this.client.feed('notification', randUserId('33'));
  this.user1ReadOnly = this.client.feed('user', randUserId('11'), null, null, {
    readOnly: true,
  });
  this.user2ReadOnly = this.client.feed('user', randUserId('22'), null, null, {
    readOnly: true,
  });
}

function beforeEachBrowser() {
  this.client = stream.connect(config.API_KEY);
  this.client = stream.connect(
    config.API_KEY,
    null,
    config.APP_ID,
    {
      group: 'browserTestCycle',
      location: 'qa',
      protocol: 'https',
    }
  );

  if (this.localRun) {
    this.client.baseUrl = 'http://localhost:8000/api/';
    this.client.fayeUrl = 'http://localhost:9999/faye/';
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
  initNode: initNode,
  initBrowser: initBrowser,
  beforeEachNode: beforeEachNode,
  beforeEachBrowser: beforeEachBrowser,
  beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
  init: config.IS_NODE_ENV ? initNode : initBrowser,
};
