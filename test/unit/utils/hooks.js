var config = require('./config')
  , rewire = require('rewire')
  , stream = rewire('../../../src/getstream')
  , StreamClient = require('./mocks').StreamClient;

function init() {
    this.timeout(500);
}

function beforeEachBrowser() {
    this.client = stream.connect(config.API_KEY);
    this.client = stream.connect(config.API_KEY, null, 9498);

    this.client = new StreamClient(config.API_KEY);
    this.client = new StreamClient(config.API_KEY, null, 9498);
}

function beforeEachNode() {
    this.client = stream.connect(config.API_KEY, config.API_SECRET);
    
    this.client = new StreamClient(config.API_KEY, config.API_SECRET);
}

module.exports = {
    init: init,
    beforeEachNode : beforeEachNode,
    beforeEachBrowser : beforeEachBrowser,
    beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
};