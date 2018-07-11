var config = require('./config'),
  td = require('testdouble'),
  StreamClient = require('../../../src/lib/client');

function init() {
  this.timeout(500);
}

function beforeEachBrowser() {
  this.client = new StreamClient(config.API_KEY, null, 9498);
  this.client.request = td.function();
}

function beforeEachNode() {
  this.client = new StreamClient(config.API_KEY, config.API_SECRET);
  this.client.request = td.function();
}

module.exports = {
  init: init,
  beforeEachNode: beforeEachNode,
  beforeEachBrowser: beforeEachBrowser,
  beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
};
