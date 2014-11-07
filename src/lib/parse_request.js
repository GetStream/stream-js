
/*
 * Simple wrapper to make make parse httprequest look 
 * somewhat like request library
 */

function request(options, callback) {
	// first difference with request, qs is called params
	options.params = options.qs;
	// next up we need to support json for complex body params
	options.body = JSON.stringify(options.body);
	// also the callback is somewhat different
	function callbackWrapperSuccess(httpResponse) {
		callback(httpResponse);
	}
	function callbackWrapperFailure(httpResponse) {
		callback(httpResponse);
	}
	options.success = callbackWrapperSuccess;
	options.error = callbackWrapperFailure;
	// add the json header
	options.headers['Content-Type'] = 'application/json;charset=utf-8';
	Parse.Cloud.httpRequest(options);
}

module.exports = request;
