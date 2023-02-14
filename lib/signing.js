"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JWTScopeToken = JWTScopeToken;
exports.JWTUserSessionToken = JWTUserSessionToken;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// for a claim in jwt
function joinClaimValue(items) {
  var values = Array.isArray(items) ? items : [items];
  var claims = [];

  for (var i = 0; i < values.length; i += 1) {
    var s = values[i].trim();
    if (s === '*') return s;
    claims.push(s);
  }

  return claims.join(',');
}
/**
 * Creates the JWT token for feedId, resource and action using the apiSecret
 * @method JWTScopeToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string | string[]} resource - JWT payload resource
 * @param {string | string[]} action - JWT payload action
 * @param {object} [options] - Optional additional options
 * @param {string | string[]} [options.feedId] - JWT payload feed identifier
 * @param {string} [options.userId] - JWT payload user identifier
 * @param {boolean} [options.expireTokens] - JWT noTimestamp
 * @return {string} JWT Token
 */


function JWTScopeToken(apiSecret, resource, action) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var noTimestamp = options.expireTokens ? !options.expireTokens : true;
  var payload = {
    resource: joinClaimValue(resource),
    action: joinClaimValue(action)
  };
  if (options.feedId) payload.feed_id = joinClaimValue(options.feedId);
  if (options.userId) payload.user_id = options.userId;
  return _jsonwebtoken.default.sign(payload, apiSecret, {
    algorithm: 'HS256',
    noTimestamp: noTimestamp
  });
}
/**
 * Creates the JWT token that can be used for a UserSession
 * @method JWTUserSessionToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string} userId - The user_id key in the JWT payload
 * @param {object} [extraData] - Extra that should be part of the JWT token
 * @param {object} [jwtOptions] - Options that can be past to jwt.sign
 * @return {string} JWT Token
 */


function JWTUserSessionToken(apiSecret, userId) {
  var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var jwtOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (typeof userId !== 'string') {
    throw new TypeError('userId should be a string');
  }

  var payload = _objectSpread({
    user_id: userId
  }, extraData);

  var opts = _objectSpread({
    algorithm: 'HS256',
    noTimestamp: true
  }, jwtOptions);

  return _jsonwebtoken.default.sign(payload, apiSecret, opts);
}