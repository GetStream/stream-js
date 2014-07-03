
//     GetStream client library for node and the browser
//     Author: Thierry Schellenbach
//     BSD License

var StreamClient = require('./lib/client');
var errors = require('./lib/errors');
var request = require('request');

function connect(apiKey, apiSecret, siteId) {
	/*
	 * Usage
	 * stream.connect(apiKey, ApiSecret)
	 * or if you want to be able to subscribe and listen
	 * for changes
	 * stream.connect(apiKey, apiSecret, siteId)
	 * or on heroku
	 * stream.connect(streamURL)
	 * where streamURL looks like this
	 * https://thierry:pass@getstream.io/?site=1
	 * 
	 */
	if (typeof(process) != "undefined" && process.env.STREAM_URL && !apiKey) {
		var parts = /https\:\/\/(\w+)\:(\w+).*site=(\d+)/.exec(process.env.STREAM_URL);
		apiKey = parts[1];
		apiSecret = parts[2];
		siteId = parts[3];
	}
	return new StreamClient(apiKey, apiSecret, siteId);
}

module.exports.connect = connect;
module.exports.errors = errors;
module.exports.request = request;
module.exports.Client = StreamClient;
