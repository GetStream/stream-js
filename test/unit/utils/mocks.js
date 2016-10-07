var config = require('./config')
  , rewire = require('rewire')
  , td = require('testdouble')
  , StreamClient = rewire('../../../src/lib/client');

var request = td.function();

StreamClient.__set__('request', request);

module.exports = {
    request: request,
    StreamClient : StreamClient,
};