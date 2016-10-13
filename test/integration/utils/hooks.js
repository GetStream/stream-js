var stream = require('../../../src/getstream')
  , feed = require('../utils').feed
  , config = require('./config');

function feedFromWebpack(client, feed) {
    return client.feed(feed.feedGroup, feed.userId, feed.token);
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

    this.user1 = feedFromWebpack(this.client, USER_1);
    this.user2 = feedFromWebpack(this.client, USER_2);
    this.user3 = feedFromWebpack(this.client, USER_3);
    this.user4 = feedFromWebpack(this.client, USER_4);
    this.aggregated2 = feedFromWebpack(this.client, AGG_2);
    this.aggregated3 = feedFromWebpack(this.client, AGG_3);
    this.flat3 = feedFromWebpack(this.client, FLAT_3);
    this.secret3 = feedFromWebpack(this.client, SECRET_3);
    this.notification3 = feedFromWebpack(this.client, NOTI_3);
    this.user1ReadOnly = feedFromWebpack(this.client, USER_READ_ONLY_1);
}

module.exports = {
    initNode: initNode,
    initBrowser: initBrowser,
    beforeEachNode: beforeEachNode,
    beforeEachBrowser: beforeEachBrowser,
    beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
    init: config.IS_NODE_ENV ? initNode : initBrowser,
};