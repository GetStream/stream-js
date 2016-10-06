var stream = require('../../../src/getstream')
  , config = require('./config');

function beforeEachBrowser() {
    this.client = stream.connect(config.API_KEY);
    this.client = stream.connect(config.API_KEY, null, 9498);
}

function beforeEachNode() {
    this.client = stream.connect(config.API_KEY, config.API_SECRET);
}

module.exports = {
    beforeEachNode : beforeEachNode,
    beforeEachBrowser : beforeEachBrowser,
    beforeEach: config.IS_NODE_ENV ? beforeEachNode : beforeEachBrowser,
};