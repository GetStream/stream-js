
console.log('found me');
function request(options, callback) {
	console.log('calling request with', options, callback);
	// first difference with request, qs is called params
	options.params = options.qs;
	// next up we need to support json for complex body params
	options.body = JSON.stringify(options.body);
	// also the callback is somewhat different
	function callbackWrapperSuccess(httpResponse) {
		console.log('succes', httpResponse);
		callback(httpResponse);
	}
	function callbackWrapperFailure(httpResponse) {
		console.log('fail', httpResponse);
		callback(httpResponse);
	}
	options.success = callbackWrapperSuccess;
	options.error = callbackWrapperFailure;
	// add the json header
	options.headers['Content-Type'] = 'application/json;charset=utf-8';
	Parse.Cloud.httpRequest(options);
}

module.exports = request;
