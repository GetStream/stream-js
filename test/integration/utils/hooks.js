var stream = require('../../../src/getstream')
  , feed = require('../utils').feed
  , config = require('./config');

function jwt(resource, action, options) {
    var KJUR = require('exports?KJUR!./kjur');

    var header = {
        alg: "HS256",
        typ: "JWT",
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

    var res = KJUR.jws.JWS.sign("HS256", header, payload, process.env.STREAM_API_SECRET);

    return res;
}

function createFeedWithToken(client, feedGroup, userId, readOnly) {
    userId = userId + '-' + Date.now();

    var token = jwt('*', readOnly ? 'read' : '*', { feedId: feedGroup + userId });
    return client.feed(feedGroup, userId, token);
}

function initNode() {
    this.timeout(6000);
    this.localRun = false;

    if (process.env.LOCAL) {
      // local testing is slow as we run celery tasks in sync
      this.timeout(25000);
      this.localRun = true;
    }
}

function initBrowser() {
    this.timeout(6000);
    this.localRun = false;

    if (document.location.href.indexOf('local=1') != -1) {
        // local testing via the browser
        this.timeout(25000);
        this.localRun = true;
    }
}

function beforeEachNode() {
    this.client = stream.connect(config.API_KEY, config.API_SECRET);
    this.client = stream.connect(config.API_KEY, config.API_SECRET, config.APP_ID, {
        'group': 'testCycle', 
        'location': 'qa'
    });
    this.user1 = this.client.feed('user', '11-' + Date.now());
    this.user2 = this.client.feed('user', '22-' + Date.now());
    this.user3 = this.client.feed('user', '33-' + Date.now());
    this.user4 = this.client.feed('user', '44-' + Date.now());
    this.aggregated2 = this.client.feed('aggregated', '22-' + Date.now());
    this.aggregated3 = this.client.feed('aggregated', '33-' + Date.now());
    this.flat3 = this.client.feed('flat', '33-' + Date.now());
    this.secret3 = this.client.feed('secret', '33-' + Date.now());
    this.notification3 = this.client.feed('notification', '33-' + Date.now());
    this.user1ReadOnly = this.client.feed('user', '11-' + Date.now(), null, null, {readOnly: true});
    this.user2ReadOnly = this.client.feed('user', '22-' + Date.now(), null, null, {readOnly: true});
}

function beforeEachBrowser() {
    this.client = stream.connect(config.API_KEY);
    this.client = stream.connect(config.API_KEY, null, config.APP_ID, {
        'group': 'browserTestCycle', 
        'location': 'qa'
    });

    if (this.localRun){
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