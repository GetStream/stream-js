
//     GetStream client library for node and the browser
//     Author: Thierry Schellenbach
//     BSD License

var StreamClient = require('./lib/client');


function connect(apiKey, apiSecret) {
	return new StreamClient(apiKey, apiSecret);
}

module.exports.connect = connect;
