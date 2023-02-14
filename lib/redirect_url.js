"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRedirectUrl;

var _url = _interopRequireDefault(require("url"));

var _qs = _interopRequireDefault(require("qs"));

var _errors = require("./errors");

var _utils = _interopRequireDefault(require("./utils"));

var _signing = require("./signing");

// TODO: userId is skipped here

/**
 * Creates a redirect url for tracking the given events in the context of
 * an email using Stream's analytics platform. Learn more at
 * getstream.io/personalization
 * @link https://getstream.io/activity-feeds/docs/node/analytics_email/?language=js
 * @method createRedirectUrl
 * @memberof StreamClient.prototype
 * @param  {string} targetUrl Target url
 * @param  {string} userId    User id to track
 * @param  {array} events     List of events to track
 * @return {string}           The redirect url
 */
function createRedirectUrl(targetUrl, userId, events) {
  var uri = _url.default.parse(targetUrl);

  if (!(uri.host || uri.hostname && uri.port)) {
    throw new _errors.MissingSchemaError("Invalid URI: \"".concat(_url.default.format(uri), "\""));
  }

  var authToken = (0, _signing.JWTScopeToken)(this.apiSecret, 'redirect_and_track', '*', {
    userId: '*',
    expireTokens: this.expireTokens
  });
  var analyticsUrl = "".concat(this.baseAnalyticsUrl, "redirect/");
  var kwargs = {
    auth_type: 'jwt',
    authorization: authToken,
    url: targetUrl,
    api_key: this.apiKey,
    events: JSON.stringify(events)
  };

  var qString = _utils.default.rfc3986(_qs.default.stringify(kwargs));

  return "".concat(analyticsUrl, "?").concat(qString);
}