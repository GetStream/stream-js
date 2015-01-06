
//     GetStream client library for node and the browser
//     Author: Thierry Schellenbach
//     BSD License

var StreamClient = require('./lib/client');
var errors = require('./lib/errors');
var request = require('request');

function connect(apiKey, apiSecret, appId, options) {
	/*
	 * Usage
	 * stream.connect(apiKey, apiSecret)
	 * or if you want to be able to subscribe and listen
	 * for changes
	 * stream.connect(apiKey, apiSecret, appId)
	 * or on heroku
	 * stream.connect(streamURL)
	 * where streamURL looks like this
	 * https://thierry:pass@getstream.io/?app=1
	 * 
	 */
	if (typeof(process) != "undefined" && process.env.STREAM_URL && !apiKey) {
		var parts = /https\:\/\/(\w+)\:(\w+)\@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL);
		apiKey = parts[1];
		apiSecret = parts[2];
		var location = parts[3];
		appId = parts[4];
		if (options === undefined) {
			options = {};
		}
		if (location != 'getstream') {
			options.location = location;
		}
	}
	return new StreamClient(apiKey, apiSecret, appId, options);
}

module.exports.connect = connect;
module.exports.errors = errors;
module.exports.request = request;
module.exports.Client = StreamClient;
