
var crypto = require('crypto');


function urlsafe_b64_encode(s) {
	var escaped = s.replace('+', '-').replace('/', '_');
	return escaped.replace(/^=+/, '').replace(/=+$/, '');
}


exports.sign = function(secret, value) {
	/*
	 * Setup sha1 based on the secret
	 * Get the digest of the value
	 * Base64 encode the result
	 *
	 * Also see
	 * https://github.com/tbarbugli/stream-ruby/blob/master/lib/stream/signer.rb
	 * https://github.com/tschellenbach/stream-python/blob/master/stream/signing.py
	 *
	 * Steps
	 * secret: tfq2sdqpj9g446sbv653x3aqmgn33hsn8uzdc9jpskaw8mj6vsnhzswuwptuj9su
	 * value: flat1
	 * digest: Q\xb6\xd5+\x82\xd58\xdeu\x80\xc5\xe3\xb8\xa5bL1\xf1\xa3\xdb
	 * result: UbbVK4LVON51gMXjuKViTDHxo9s
	 */
	var key = new crypto.createHash('sha1').update(secret).digest();
	var hmac = crypto.createHmac('sha1', key);
	var signature = hmac.update(value).digest('base64');
	var urlsafe = urlsafe_b64_encode(signature);
	return urlsafe;
};