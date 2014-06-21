
//     GetStream client library for node and the browser
//     Author: Thierry Schellenbach
//     BSD License

var StreamClient = require('./lib/client');
var errors = require('./lib/errors');
var request = require('request');

function connect(apiKey, apiSecret) {
	return new StreamClient(apiKey, apiSecret);
}

module.exports.connect = connect;
module.exports.errors = errors;
module.exports.request = request;
