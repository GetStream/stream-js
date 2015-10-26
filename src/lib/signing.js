var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
var Base64 = require('Base64');

function makeUrlSafe(s) {
  /*
   * Makes the given base64 encoded string urlsafe
   */
  var escaped = s.replace(/\+/g, '-').replace(/\//g, '_');
  return escaped.replace(/^=+/, '').replace(/=+$/, '');
}

function decodeBase64Url(base64UrlString) {
  try {
    return Base64.atob(toBase64(base64UrlString));
  } catch (e) {
    if (e.name === 'InvalidCharacterError') {
      return undefined;
    } else {
      throw e;
    }
  }
}

function safeJsonParse(thing) {
  if (typeof (thing) === 'object') return thing;
  try {
    return JSON.parse(thing);
  } catch (e) {
    return undefined;
  }
}

function padString(string) {
  var segmentLength = 4;
  var diff = string.length % segmentLength;
  if (!diff)
      return string;
  var padLength = segmentLength - diff;

  while (padLength--)
    string += '=';
  return string;
}

function toBase64(base64UrlString) {
  var b64str = padString(base64UrlString)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  return b64str;
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(decodeBase64Url(encodedHeader));
}

exports.headerFromJWS = headerFromJWS;

exports.sign = function(apiSecret, feedId) {
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
   * apiSecret: tfq2sdqpj9g446sbv653x3aqmgn33hsn8uzdc9jpskaw8mj6vsnhzswuwptuj9su
   * feedId: flat1
   * digest: Q\xb6\xd5+\x82\xd58\xdeu\x80\xc5\xe3\xb8\xa5bL1\xf1\xa3\xdb
   * token: UbbVK4LVON51gMXjuKViTDHxo9s
   */
  var hashedSecret = new crypto.createHash('sha1').update(apiSecret).digest();
  var hmac = crypto.createHmac('sha1', hashedSecret);
  var digest = hmac.update(feedId).digest('base64');
  var token = makeUrlSafe(digest);
  return token;
};

exports.JWTScopeToken = function(apiSecret, feedId, resource, action) {
  /*
   * Creates the JWT token for feedId, resource and action using the apiSecret
   */
  var payload = {'feed_id':feedId, resource:resource, action:action};
  var token = jwt.sign(payload, apiSecret, {algorithm: 'HS256'});
  return token;
};

exports.isJWTSignature = function(signature) {
  /*
   * check if token is a valid JWT token
   */
  var token = signature.split(' ')[1];
  return JWS_REGEX.test(token) && !!headerFromJWS(token);
};
