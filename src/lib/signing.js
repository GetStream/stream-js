var jwt = require('jsonwebtoken');
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
var Base64 = require('Base64');

function decodeBase64Url(base64UrlString) {
  try {
    return Base64.atob(toBase64(base64UrlString));
  } catch (e) {
    /* istanbul ignore else */
    if (e.name === 'InvalidCharacterError') {
      return undefined;
    } else {
      throw e;
    }
  }
}

function safeJsonParse(thing) {
  if (typeof thing === 'object') return thing;
  try {
    return JSON.parse(thing);
  } catch (e) {
    return undefined;
  }
}

function padString(string) {
  var segmentLength = 4;
  var diff = string.length % segmentLength;
  if (!diff) return string;
  var padLength = segmentLength - diff;

  while (padLength--) string += '=';
  return string;
}

function toBase64(base64UrlString) {
  var b64str = padString(base64UrlString)
    .replace(/\-/g, '+') // eslint-disable-line no-useless-escape
    .replace(/_/g, '/');
  return b64str;
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(decodeBase64Url(encodedHeader));
}

exports.headerFromJWS = headerFromJWS;

exports.JWTScopeToken = function(apiSecret, resource, action, opts) {
  /**
   * Creates the JWT token for feedId, resource and action using the apiSecret
   * @method JWTScopeToken
   * @memberof signing
   * @private
   * @param {string} apiSecret - API Secret key
   * @param {string} resource - JWT payload resource
   * @param {string} action - JWT payload action
   * @param {object} [options] - Optional additional options
   * @param {string} [options.feedId] - JWT payload feed identifier
   * @param {string} [options.userId] - JWT payload user identifier
   * @return {string} JWT Token
   */
  var options = opts || {},
    noTimestamp = options.expireTokens ? !options.expireTokens : true;
  var payload = {
    resource: resource,
    action: action,
  };

  if (options.feedId) {
    payload['feed_id'] = options.feedId;
  }

  if (options.userId) {
    payload['user_id'] = options.userId;
  }

  var token = jwt.sign(payload, apiSecret, {
    algorithm: 'HS256',
    noTimestamp: noTimestamp,
  });
  return token;
};

exports.JWTUserSessionToken = function(
  apiSecret,
  userId,
  extraData = {},
  jwtOptions = {},
) {
  /**
   * Creates the JWT token that can be used for a UserSession
   * @method JWTUserSessionToken
   * @memberof signing
   * @private
   * @param {string} apiSecret - API Secret key
   * @param {string} userId - The user_id key in the JWT payload
   * @param {string} [extraData] - Extra that should be part of the JWT token
   * @param {object} [jwtOptions] - Options that can be past to jwt.sign
   * @return {string} JWT Token
   */
  if (typeof userId !== 'string') {
    throw new TypeError('userId should be a string');
  }

  var payload = {
    user_id: userId,
    ...extraData,
  };

  var opts = Object.assign(
    { algorithm: 'HS256', noTimestamp: true },
    jwtOptions,
  );
  var token = jwt.sign(payload, apiSecret, opts);
  return token;
};

exports.isJWTSignature = exports.isJWT = function(signature) {
  /**
   * check if token is a valid JWT token
   * @method isJWTSignature
   * @memberof signing
   * @private
   * @param {string} signature - Signature to check
   * @return {boolean}
   */
  if (signature == null || signature.length == 0) {
    return false;
  }
  var token = signature.split(' ')[1] || signature;
  return JWS_REGEX.test(token) && !!headerFromJWS(token);
};
