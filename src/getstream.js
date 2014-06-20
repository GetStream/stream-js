
var StreamClient = require('./lib/client');


function connect(apiKey, apiSecret) {
	return new StreamClient(apiKey, apiSecret);
}

module.exports.connect = connect;
