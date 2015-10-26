/**
 * @module stream
 * @author Thierry Schellenbach
 * BSD License
 */
var StreamClient = require('./lib/client');
var errors = require('./lib/errors');
var request = require('request');

function connect(apiKey, apiSecret, appId, options) {
  /**
   * Create StreamClient
   * @method connect
   * @param  {string} apiKey    API key
   * @param  {string} [apiSecret] API secret (only use this on the server)
   * @param  {string} [appId]     Application identifier
   * @param  {object} [options]   Additional options
   * @param  {string} [options.location] Datacenter location
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
  if (typeof (process) !== 'undefined' && process.env.STREAM_URL && !apiKey) {
    var parts = /https\:\/\/(\w+)\:(\w+)\@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL);
    apiKey = parts[1];
    apiSecret = parts[2];
    var location = parts[3];
    appId = parts[4];
    if (options === undefined) {
      options = {};
    }

    if (location !== 'getstream') {
      options.location = location;
    }
  }

  return new StreamClient(apiKey, apiSecret, appId, options);
}

module.exports.connect = connect;
module.exports.errors = errors;
module.exports.request = request;
module.exports.Client = StreamClient;
