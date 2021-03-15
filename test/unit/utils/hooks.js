const td = require('testdouble/dist/testdouble');
const { StreamClient } = require('../../../src/client');
const config = require('./config');

function init() {
  this.timeout(500);
}

function beforeEachBrowser() {
  this.client = new StreamClient(config.API_KEY, null, 9498);
  this.client.request = td.function();
  td.when(this.client.request(), { ignoreExtraArgs: true }).thenResolve({ status: 200, data: {} });
}

function beforeEachNode() {
  this.client = new StreamClient(config.API_KEY, config.API_SECRET);
  this.client.request = td.function();
  td.when(this.client.request(), { ignoreExtraArgs: true }).thenResolve({ status: 200, data: {} });
}

module.exports = {
  init,
  beforeEachNode,
  beforeEachBrowser,
  beforeEachFn: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
};
