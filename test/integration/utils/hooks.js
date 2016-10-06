var stream = require('../../../src/getstream')
  , config = require('./config');

function initNode() {
    this.timeout(4000);
    this.localRun = false;

    if (process.env.LOCAL) {
      // local testing is slow as we run celery tasks in sync
      this.timeout(25000);
      this.localRun = true;
    }
}

function initBrowser() {
    this.timeout(4000);
    this.localRun = false;

    if (document.location.href.indexOf('local=1') != -1) {
      // local testing via the browser
        this.timeout(25000);
        this.localRun = true;
    }
}

function beforeEachNode() {
    this.client = stream.connect(config.API_KEY, config.API_SECRET);
    this.client = stream.connect(config.API_KEY, config.API_SECRET, 9498, {'group': 'testCycle', 'location': 'us-east'});
    this.user1 = this.client.feed('user', '11');
    this.aggregated2 = this.client.feed('aggregated', '22');
    this.aggregated3 = this.client.feed('aggregated', '33');
    this.flat3 = this.client.feed('flat', '33');
    this.secret3 = this.client.feed('secret', '33');
    this.notification3 = this.client.feed('notification', '33');
    this.user1ReadOnly = this.client.feed('user', '11', null, null, {readOnly: true});
    this.user2ReadOnly = this.client.feed('user', '22', null, null, {readOnly: true});
}

function beforeEachBrowser() {
    this.client = stream.connect(config.API_KEY);
    this.client = stream.connect(config.API_KEY, null, 9498, {'group': 'browserTestCycle', 'location': 'eu-west'});

    if (this.localRun){
        this.client.baseUrl = 'http://localhost:8000/api/';
        this.client.fayeUrl = 'http://localhost:9999/faye/';
    }

    this.user1 = this.client.feed('user', '11', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIxMSJ9.9OP-WR_b4-1CEh_CLw8ZR-ZCuDuIVNQITjab8np739Q');
    this.aggregated2 = this.client.feed('aggregated', '22', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImFnZ3JlZ2F0ZWQyMiJ9.pYTcr0BU99CWaD4Sd5BEjBvGzgOy3rxkvDDeAOWhi10');
    this.aggregated3 = this.client.feed('aggregated', '33', 'YxCkg56vpnabvHPNLCHK7Se36FY');
    this.flat3 = this.client.feed('flat', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImFnZ3JlZ2F0ZWQzMyJ9.G8Fdpdv5B4Q2WoE5ko6KAMk2qKgES2QLJK1gdotAAC0');
    this.secret3 = this.client.feed('secret', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InNlY3JldDMzIn0.mtcy0oTLtvcxVDo4ikp53DLSxxgZ22V23B7d6S5QHUg');
    this.notification3 = this.client.feed('notification', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbjMzIn0.80RDMlGD3pSics5Rbm5b89lnbwm2fqaOZ0q9fMYXCk4');
    this.user1ReadOnly = this.client.feed('user', '11', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6InVzZXIxMSJ9.nMvaxLCTpmJTmJqEjsGtB8j90ZoVTXQEiL7OjO7GOBo');
}

module.exports = {
    initNode: initNode,
    initBrowser: initBrowser,
    beforeEachNode: beforeEachNode,
    beforeEachBrowser: beforeEachBrowser,
    beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
    init: config.IS_NODE_ENV ? initNode : initBrowser,
};