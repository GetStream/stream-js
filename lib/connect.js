"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _client = require("./client");

/**
 * Create StreamClient
 * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#setup
 * @method connect
 * @param  {string} apiKey    API key
 * @param  {string} [apiSecret] API secret (only use this on the server)
 * @param  {string} [appId]     Application identifier
 * @param {ClientOptions} [options] - additional options
 * @param {string} [options.location] - which data center to use
 * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
 * @param {string} [options.version] - advanced usage, custom api version
 * @param {boolean} [options.keepAlive] - axios keepAlive, default to true
 * @param {number} [options.timeout] - axios timeout in Ms, default to 10s
 * @return {StreamClient}     StreamClient
 * @example <caption>Basic usage</caption>
 * stream.connect(apiKey, apiSecret);
 * @example <caption>or if you want to be able to subscribe and listen</caption>
 * stream.connect(apiKey, apiSecret, appId);
 * @example <caption>or on Heroku</caption>
 * stream.connect(streamURL);
 * @example <caption>where streamURL looks like</caption>
 * "https://thierry:pass@gestream.io/?app=1"
 */
function connect(apiKey, apiSecret, appId, options) {
  var _process$env;

  if (typeof process !== 'undefined' && (_process$env = process.env) !== null && _process$env !== void 0 && _process$env.STREAM_URL && !apiKey) {
    var parts = /https:\/\/(\w+):(\w+)@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL) || [];
    apiKey = parts[1];
    apiSecret = parts[2];
    var location = parts[3];
    appId = parts[4];

    if (options === undefined) {
      options = {};
    }

    if (location !== 'getstream' && location !== 'stream-io-api') {
      options.location = location;
    }
  }

  return new _client.StreamClient(apiKey, apiSecret, appId, options);
}