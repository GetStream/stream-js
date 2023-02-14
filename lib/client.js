"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamClient = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var axios = _interopRequireWildcard(require("axios"));

var Faye = _interopRequireWildcard(require("faye"));

var http = _interopRequireWildcard(require("http"));

var https = _interopRequireWildcard(require("https"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

var _personalization = require("./personalization");

var _collections = require("./collections");

var _files = require("./files");

var _images = require("./images");

var _reaction = require("./reaction");

var _user = require("./user");

var _signing = require("./signing");

var _errors = require("./errors");

var _utils = _interopRequireDefault(require("./utils"));

var _batch_operations = _interopRequireDefault(require("./batch_operations"));

var _redirect_url = _interopRequireDefault(require("./redirect_url"));

var _feed = require("./feed");

var _excluded = ["method", "token"],
    _excluded2 = ["ids", "foreignIDTimes"],
    _excluded3 = ["activities"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// TODO: no import since typescript json loader shifts the final output structure
// eslint-disable-next-line @typescript-eslint/no-var-requires
var pkg = require('../package.json');

/**
 * Client to connect to Stream api
 * @class StreamClient
 */
var StreamClient = /*#__PURE__*/function () {
  // eslint-disable-line no-use-before-define
  // eslint-disable-line no-use-before-define
  // eslint-disable-line no-use-before-define
  // eslint-disable-line no-use-before-define

  /**
   * Initialize a client
   * @link https://getstream.io/activity-feeds/docs/node/#setup
   * @method initialize
   * @memberof StreamClient.prototype
   * @param {string} apiKey - the api key
   * @param {string} [apiSecret] - the api secret
   * @param {string} [appId] - id of the app
   * @param {ClientOptions} [options] - additional options
   * @param {string} [options.location] - which data center to use
   * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
   * @param {string} [options.version] - advanced usage, custom api version
   * @param {boolean} [options.keepAlive] - axios keepAlive, default to true
   * @param {number} [options.timeout] - axios timeout in Ms, default to 10s
   * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
   * stream.connect(apiKey, apiSecret)
   * @example <caption>secret is optional and only used in server side mode</caption>
   * stream.connect(apiKey, null, appId);
   */
  function StreamClient(apiKey, apiSecretOrToken, appId) {
    var _this = this,
        _process$env,
        _process$env2;

    var _options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    (0, _classCallCheck2.default)(this, StreamClient);
    (0, _defineProperty2.default)(this, "baseUrl", void 0);
    (0, _defineProperty2.default)(this, "baseAnalyticsUrl", void 0);
    (0, _defineProperty2.default)(this, "apiKey", void 0);
    (0, _defineProperty2.default)(this, "appId", void 0);
    (0, _defineProperty2.default)(this, "usingApiSecret", void 0);
    (0, _defineProperty2.default)(this, "apiSecret", void 0);
    (0, _defineProperty2.default)(this, "userToken", void 0);
    (0, _defineProperty2.default)(this, "enrichByDefault", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "userId", void 0);
    (0, _defineProperty2.default)(this, "authPayload", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    (0, _defineProperty2.default)(this, "fayeUrl", void 0);
    (0, _defineProperty2.default)(this, "group", void 0);
    (0, _defineProperty2.default)(this, "expireTokens", void 0);
    (0, _defineProperty2.default)(this, "location", void 0);
    (0, _defineProperty2.default)(this, "fayeClient", void 0);
    (0, _defineProperty2.default)(this, "browser", void 0);
    (0, _defineProperty2.default)(this, "node", void 0);
    (0, _defineProperty2.default)(this, "nodeOptions", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "subscriptions", void 0);
    (0, _defineProperty2.default)(this, "handlers", void 0);
    (0, _defineProperty2.default)(this, "currentUser", void 0);
    (0, _defineProperty2.default)(this, "personalization", void 0);
    (0, _defineProperty2.default)(this, "collections", void 0);
    (0, _defineProperty2.default)(this, "files", void 0);
    (0, _defineProperty2.default)(this, "images", void 0);
    (0, _defineProperty2.default)(this, "reactions", void 0);
    (0, _defineProperty2.default)(this, "_personalizationToken", void 0);
    (0, _defineProperty2.default)(this, "_collectionsToken", void 0);
    (0, _defineProperty2.default)(this, "_getOrCreateToken", void 0);
    (0, _defineProperty2.default)(this, "addToMany", void 0);
    (0, _defineProperty2.default)(this, "followMany", void 0);
    (0, _defineProperty2.default)(this, "unfollowMany", void 0);
    (0, _defineProperty2.default)(this, "createRedirectUrl", void 0);
    (0, _defineProperty2.default)(this, "replaceReactionOptions", function (options) {
      // Shortcut options for reaction enrichment
      if (options !== null && options !== void 0 && options.reactions) {
        if (options.reactions.own != null) {
          options.withOwnReactions = options.reactions.own;
        }

        if (options.reactions.recent != null) {
          options.withRecentReactions = options.reactions.recent;
        }

        if (options.reactions.counts != null) {
          options.withReactionCounts = options.reactions.counts;
        }

        if (options.reactions.own_children != null) {
          options.withOwnChildren = options.reactions.own_children;
        }

        delete options.reactions;
      }
    });
    (0, _defineProperty2.default)(this, "handleResponse", function (response) {
      if (/^2/.test("".concat(response.status))) {
        _this.send('response', null, response, response.data);

        return response.data;
      }

      throw new _errors.StreamApiError("".concat(JSON.stringify(response.data), " with HTTP status code ").concat(response.status), response.data, response);
    });
    (0, _defineProperty2.default)(this, "doAxiosRequest", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(method, options) {
        var response, err;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.send('request', method, options);

                _context.prev = 1;
                _context.next = 4;
                return _this.request(_this.enrichKwargs(_objectSpread({
                  method: method
                }, options)));

              case 4:
                response = _context.sent;
                return _context.abrupt("return", _this.handleResponse(response));

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                err = _context.t0;

                if (!err.response) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", _this.handleResponse(err.response));

              case 13:
                throw new _errors.SiteError(err.message);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 8]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    this.baseUrl = 'https://api.stream-io-api.com/api/';
    this.baseAnalyticsUrl = 'https://analytics.stream-io-api.com/analytics/';
    this.apiKey = apiKey;
    this.usingApiSecret = apiSecretOrToken != null && !apiSecretOrToken.includes(".");
    this.apiSecret = this.usingApiSecret ? apiSecretOrToken : null;
    this.userToken = this.usingApiSecret ? null : apiSecretOrToken;
    this.enrichByDefault = !this.usingApiSecret;

    if (this.userToken != null) {
      var jwtBody = (0, _jwtDecode.default)(this.userToken);

      if (!jwtBody.user_id) {
        throw new TypeError('user_id is missing in user token');
      }

      this.userId = jwtBody.user_id;
      this.currentUser = this.user(this.userId);
    }

    this.appId = appId;
    this.options = _options;
    this.version = this.options.version || 'v1.0';
    this.fayeUrl = this.options.fayeUrl || 'https://faye-us-east.stream-io-api.com/faye';
    this.fayeClient = null; // track a source name for the api calls, ie get started or databrowser

    this.group = this.options.group || 'unspecified'; // track subscriptions made on feeds created by this client

    this.subscriptions = {};
    this.expireTokens = this.options.expireTokens ? this.options.expireTokens : false; // which data center to use

    this.location = this.options.location;
    this.baseUrl = this.getBaseUrl();
    if (typeof process !== 'undefined' && (_process$env = process.env) !== null && _process$env !== void 0 && _process$env.LOCAL_FAYE) this.fayeUrl = 'http://localhost:9999/faye/';
    if (typeof process !== 'undefined' && (_process$env2 = process.env) !== null && _process$env2 !== void 0 && _process$env2.STREAM_ANALYTICS_BASE_URL) this.baseAnalyticsUrl = process.env.STREAM_ANALYTICS_BASE_URL;
    this.handlers = {};
    this.node = typeof window === 'undefined'; // use for real browser vs node behavior
    // use for browser warnings

    this.browser = typeof this.options.browser !== 'undefined' ? this.options.browser : !this.node;

    if (this.node) {
      var keepAlive = this.options.keepAlive === undefined ? true : this.options.keepAlive;
      this.nodeOptions = {
        httpAgent: new http.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        }),
        httpsAgent: new https.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        })
      };
    }

    this.request = axios.default.create(_objectSpread({
      timeout: this.options.timeout || 10000,
      withCredentials: false
    }, this.nodeOptions || {}));
    this.personalization = new _personalization.Personalization(this);

    if (this.browser && this.usingApiSecret) {
      throw new _errors.FeedError('You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.');
    }

    this.collections = new _collections.Collections(this, this.getOrCreateToken());
    this.files = new _files.StreamFileStore(this, this.getOrCreateToken());
    this.images = new _images.StreamImageStore(this, this.getOrCreateToken());
    this.reactions = new _reaction.StreamReaction(this, this.getOrCreateToken()); // If we are in a node environment and batchOperations/createRedirectUrl is available add the methods to the prototype of StreamClient

    if (_batch_operations.default && !!_redirect_url.default) {
      this.addToMany = _batch_operations.default.addToMany;
      this.followMany = _batch_operations.default.followMany;
      this.unfollowMany = _batch_operations.default.unfollowMany;
      this.createRedirectUrl = _redirect_url.default;
    }
  }

  (0, _createClass2.default)(StreamClient, [{
    key: "_throwMissingApiSecret",
    value: function _throwMissingApiSecret() {
      if (!this.usingApiSecret) {
        throw new _errors.SiteError('This method can only be used server-side using your API Secret, use client = stream.connect(key, secret);');
      }
    }
  }, {
    key: "getPersonalizationToken",
    value: function getPersonalizationToken() {
      if (this._personalizationToken) return this._personalizationToken;

      this._throwMissingApiSecret();

      this._personalizationToken = (0, _signing.JWTScopeToken)(this.apiSecret, 'personalization', '*', {
        userId: '*',
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this._personalizationToken;
    }
  }, {
    key: "getCollectionsToken",
    value: function getCollectionsToken() {
      if (this._collectionsToken) return this._collectionsToken;

      this._throwMissingApiSecret();

      this._collectionsToken = (0, _signing.JWTScopeToken)(this.apiSecret, 'collections', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this._collectionsToken;
    }
  }, {
    key: "getAnalyticsToken",
    value: function getAnalyticsToken() {
      this._throwMissingApiSecret();

      return (0, _signing.JWTScopeToken)(this.apiSecret, 'analytics', '*', {
        userId: '*',
        expireTokens: this.expireTokens
      });
    }
  }, {
    key: "getBaseUrl",
    value: function getBaseUrl(serviceName) {
      var _process$env3, _process$env4;

      if (!serviceName) serviceName = 'api';
      if (this.options.urlOverride && this.options.urlOverride[serviceName]) return this.options.urlOverride[serviceName];
      var urlEnvironmentKey = serviceName === 'api' ? 'STREAM_BASE_URL' : "STREAM_".concat(serviceName.toUpperCase(), "_URL");
      if (typeof process !== 'undefined' && (_process$env3 = process.env) !== null && _process$env3 !== void 0 && _process$env3[urlEnvironmentKey]) return process.env[urlEnvironmentKey];
      if (typeof process !== 'undefined' && (_process$env4 = process.env) !== null && _process$env4 !== void 0 && _process$env4.LOCAL || this.options.local) return "http://localhost:8000/".concat(serviceName, "/");

      if (this.location) {
        var protocol = this.options.protocol || 'https';
        return "".concat(protocol, "://").concat(this.location, "-").concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      }

      if (serviceName !== 'api') return "https://".concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      return this.baseUrl;
    }
    /**
     * Support for global event callbacks
     * This is useful for generic error and loading handling
     * @method on
     * @memberof StreamClient.prototype
     * @param {string} event - Name of the event
     * @param {function} callback - Function that is called when the event fires
     * @example
     * client.on('request', callback);
     * client.on('response', callback);
     */

  }, {
    key: "on",
    value: function on(event, callback) {
      this.handlers[event] = callback;
    }
    /**
     * Remove one or more event handlers
     * @method off
     * @memberof StreamClient.prototype
     * @param {string} [key] - Name of the handler
     * @example
     * client.off() removes all handlers
     * client.off(name) removes the specified handler
     */

  }, {
    key: "off",
    value: function off(key) {
      if (key === undefined) {
        this.handlers = {};
      } else {
        delete this.handlers[key];
      }
    }
    /**
     * Call the given handler with the arguments
     * @method send
     * @memberof StreamClient.prototype
     * @access private
     */

  }, {
    key: "send",
    value: function send(key) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.handlers[key]) this.handlers[key].apply(this, args);
    }
    /**
     * Get the current user agent
     * @method userAgent
     * @memberof StreamClient.prototype
     * @return {string} current user agent
     */

  }, {
    key: "userAgent",
    value: function userAgent() {
      return "stream-javascript-client-".concat(this.node ? 'node' : 'browser', "-").concat(pkg.version);
    }
    /**
     * Returns a token that allows only read operations
     *
     * @method getReadOnlyToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadOnlyToken('user', '1');
     */

  }, {
    key: "getReadOnlyToken",
    value: function getReadOnlyToken(feedSlug, userId) {
      _utils.default.validateFeedSlug(feedSlug);

      _utils.default.validateUserId(userId);

      return (0, _signing.JWTScopeToken)(this.apiSecret, '*', 'read', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }
    /**
     * Returns a token that allows read and write operations
     *
     * @method getReadWriteToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadWriteToken('user', '1');
     */

  }, {
    key: "getReadWriteToken",
    value: function getReadWriteToken(feedSlug, userId) {
      _utils.default.validateFeedSlug(feedSlug);

      _utils.default.validateUserId(userId);

      return (0, _signing.JWTScopeToken)(this.apiSecret, '*', '*', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }
    /**
     * Returns a feed object for the given feed id and token
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js
     * @method feed
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug
     * @param {string} [userId] - The user identifier
     * @param {string} [token] - The token
     * @return {StreamFeed}
     * @example  client.feed('user', '1');
     */

  }, {
    key: "feed",
    value: function feed(feedSlug, userId, token) {
      if (userId instanceof _user.StreamUser) userId = userId.id;

      if (token === undefined) {
        if (this.usingApiSecret) {
          token = (0, _signing.JWTScopeToken)(this.apiSecret, '*', '*', {
            feedId: "".concat(feedSlug).concat(userId)
          });
        } else {
          token = this.userToken;
        }
      }

      return new _feed.StreamFeed(this, feedSlug, userId || this.userId, token);
    }
    /**
     * Combines the base url with version and the relative url
     * @method enrichUrl
     * @memberof StreamClient.prototype
     * @private
     * @param {string} relativeUrl
     * @param {string} [serviceName]
     * @return {string}
     */

  }, {
    key: "enrichUrl",
    value: function enrichUrl(relativeUrl, serviceName) {
      return "".concat(this.getBaseUrl(serviceName)).concat(this.version, "/").concat(relativeUrl);
    }
  }, {
    key: "shouldUseEnrichEndpoint",
    value: function shouldUseEnrichEndpoint() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.enrich !== undefined) {
        var result = options.enrich;
        delete options.enrich;
        return result;
      }

      return this.enrichByDefault || options.ownReactions != null || options.withRecentReactions != null || options.withReactionCounts != null || options.withOwnChildren != null;
    }
    /**
     * Adds the API key and the token
     * @method enrichKwargs
     * @private
     * @memberof StreamClient.prototype
     * @param {AxiosConfig} kwargs
     * @return {axios.AxiosRequestConfig}
     */

  }, {
    key: "enrichKwargs",
    value: function enrichKwargs(_ref2) {
      var method = _ref2.method,
          token = _ref2.token,
          kwargs = (0, _objectWithoutProperties2.default)(_ref2, _excluded);
      return _objectSpread({
        method: method,
        url: this.enrichUrl(kwargs.url, kwargs.serviceName),
        data: kwargs.body,
        params: _objectSpread({
          api_key: this.apiKey,
          location: this.group
        }, kwargs.qs || {}),
        headers: _objectSpread({
          'X-Stream-Client': this.userAgent(),
          'stream-auth-type': 'jwt',
          Authorization: token
        }, kwargs.headers || {})
      }, kwargs.axiosOptions || {});
    }
    /**
     * Get the authorization middleware to use Faye with getstream.io
     * @method getFayeAuthorization
     * @memberof StreamClient.prototype
     * @private
     * @return {Faye.Middleware} Faye authorization middleware
     */

  }, {
    key: "getFayeAuthorization",
    value: function getFayeAuthorization() {
      var _this2 = this;

      return {
        incoming: function incoming(message, callback) {
          return callback(message);
        },
        outgoing: function outgoing(message, callback) {
          if (message.subscription && _this2.subscriptions[message.subscription]) {
            var subscription = _this2.subscriptions[message.subscription];
            message.ext = {
              user_id: subscription.userId,
              api_key: _this2.apiKey,
              signature: subscription.token
            };
          }

          callback(message);
        }
      };
    }
    /**
     * Returns this client's current Faye client
     * @method getFayeClient
     * @memberof StreamClient.prototype
     * @private
     * @param {number} timeout
     * @return {Faye.Client} Faye client
     */

  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

      if (this.fayeClient === null) {
        this.fayeClient = new Faye.Client(this.fayeUrl, {
          timeout: timeout
        });
        var authExtension = this.getFayeAuthorization();
        this.fayeClient.addExtension(authExtension);
      }

      return this.fayeClient;
    }
  }, {
    key: "upload",
    value: function upload(url, uri, name, contentType, onUploadProgress) {
      var fd = _utils.default.addFileToFormData(uri, name, contentType);

      return this.doAxiosRequest('POST', {
        url: url,
        body: fd,
        headers: fd.getHeaders ? fd.getHeaders() : {},
        // node vs browser
        token: this.getOrCreateToken(),
        axiosOptions: {
          timeout: 0,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: onUploadProgress
        }
      });
    }
    /**
     * Shorthand function for get request
     * @method get
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */

  }, {
    key: "get",
    value: function get(kwargs) {
      return this.doAxiosRequest('GET', kwargs);
    }
    /**
     * Shorthand function for post request
     * @method post
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */

  }, {
    key: "post",
    value: function post(kwargs) {
      return this.doAxiosRequest('POST', kwargs);
    }
    /**
     * Shorthand function for delete request
     * @method delete
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */

  }, {
    key: "delete",
    value: function _delete(kwargs) {
      return this.doAxiosRequest('DELETE', kwargs);
    }
    /**
     * Shorthand function for put request
     * @method put
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */

  }, {
    key: "put",
    value: function put(kwargs) {
      return this.doAxiosRequest('PUT', kwargs);
    }
    /**
     * create a user token
     * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#generate-user-token-server-side
     * @param {string} userId
     * @param {object} extraData
     * @return {string}
     */

  }, {
    key: "createUserToken",
    value: function createUserToken(userId) {
      var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._throwMissingApiSecret();

      return (0, _signing.JWTUserSessionToken)(this.apiSecret, userId, extraData, {
        noTimestamp: !this.expireTokens
      });
    }
    /**
     * Updates all supplied activities on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>[]} activities list of activities to update
     * @return {Promise<APIResponse>}
     */

  }, {
    key: "updateActivities",
    value: function updateActivities(activities) {
      this._throwMissingApiSecret();

      if (!(activities instanceof Array)) {
        throw new TypeError('The activities argument should be an Array');
      }

      var token = (0, _signing.JWTScopeToken)(this.apiSecret, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this.post({
        url: 'activities/',
        body: {
          activities: activities
        },
        token: token
      });
    }
    /**
     * Updates one activity on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>} activity The activity to update
     * @return {Promise<APIResponse>}
     */

  }, {
    key: "updateActivity",
    value: function updateActivity(activity) {
      this._throwMissingApiSecret();

      return this.updateActivities([activity]);
    }
    /**
     * Retrieve activities by ID or foreign_id and time
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-get-activities-by-id
     * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign_ids and time as {foreignIDTimes: [{foreign_id: ..., time: ...}, ...]}
     * @return {Promise<GetActivitiesAPIResponse>}
     */

  }, {
    key: "getActivities",
    value: function getActivities(_ref3) {
      var ids = _ref3.ids,
          foreignIDTimes = _ref3.foreignIDTimes,
          params = (0, _objectWithoutProperties2.default)(_ref3, _excluded2);
      var extraParams = {};

      if (ids) {
        if (!(ids instanceof Array)) {
          throw new TypeError('The ids argument should be an Array');
        }

        extraParams.ids = ids.join(',');
      } else if (foreignIDTimes) {
        if (!(foreignIDTimes instanceof Array)) {
          throw new TypeError('The foreignIDTimes argument should be an Array');
        }

        var foreignIDs = [];
        var timestamps = [];
        foreignIDTimes.forEach(function (fidTime) {
          if (!(fidTime instanceof Object)) {
            throw new TypeError('foreignIDTimes elements should be Objects');
          }

          foreignIDs.push(fidTime.foreign_id || fidTime.foreignID);
          timestamps.push(fidTime.time);
        });
        extraParams.foreign_ids = foreignIDs.join(',');
        extraParams.timestamps = timestamps.join(',');
      } else {
        throw new TypeError('Missing ids or foreignIDTimes params');
      }

      var token = this.userToken;

      if (this.usingApiSecret) {
        token = (0, _signing.JWTScopeToken)(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }

      this.replaceReactionOptions(params);
      var path = this.shouldUseEnrichEndpoint(params) ? 'enrich/activities/' : 'activities/';
      return this.get({
        url: path,
        qs: _objectSpread(_objectSpread({}, params), extraParams),
        token: token
      });
    }
  }, {
    key: "getOrCreateToken",
    value: function getOrCreateToken() {
      if (!this._getOrCreateToken) {
        this._getOrCreateToken = this.usingApiSecret ? (0, _signing.JWTScopeToken)(this.apiSecret, '*', '*', {
          feedId: '*'
        }) : this.userToken;
      }

      return this._getOrCreateToken;
    }
  }, {
    key: "user",
    value: function user(userId) {
      return new _user.StreamUser(this, userId, this.getOrCreateToken());
    }
  }, {
    key: "setUser",
    value: function () {
      var _setUser = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(data) {
        var body, user;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.usingApiSecret) {
                  _context2.next = 2;
                  break;
                }

                throw new _errors.SiteError('This method can only be used client-side using a user token');

              case 2:
                body = _objectSpread({}, data);
                delete body.id;
                _context2.next = 6;
                return this.currentUser.getOrCreate(body);

              case 6:
                user = _context2.sent;
                this.currentUser = user;
                return _context2.abrupt("return", user);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setUser(_x3) {
        return _setUser.apply(this, arguments);
      }

      return setUser;
    }()
  }, {
    key: "og",
    value: function og(url) {
      return this.get({
        url: 'og/',
        qs: {
          url: url
        },
        token: this.getOrCreateToken()
      });
    }
  }, {
    key: "personalizedFeed",
    value: function personalizedFeed() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.get({
        url: 'enrich/personalization/feed/',
        qs: options,
        token: this.getOrCreateToken()
      });
    }
    /**
     * Update a single activity with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>} data object containing either the ID or the foreign_id and time of the activity and the operations to issue as set:{...} and unset:[...].
     * @return {Promise<Activity<StreamFeedGenerics>>}
     * @example
     * client.activityPartialUpdate({
     *   id: "54a60c1e-4ee3-494b-a1e3-50c06acb5ed4",
     *   set: {
     *     "product.price": 19.99,
     *     "shares": {
     *       "facebook": "...",
     *       "twitter": "...",
     *     }
     *   },
     *   unset: [
     *     "daily_likes",
     *     "popularity"
     *   ]
     * })
     * @example
     * client.activityPartialUpdate({
     *   foreign_id: "product:123",
     *   time: "2016-11-10T13:20:00.000000",
     *   set: {
     *     ...
     *   },
     *   unset: [
     *     ...
     *   ]
     * })
     */

  }, {
    key: "activityPartialUpdate",
    value: function () {
      var _activityPartialUpdate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(data) {
        var _yield$this$activitie, activities, response, _activities, activity;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.activitiesPartialUpdate([data]);

              case 2:
                _yield$this$activitie = _context3.sent;
                activities = _yield$this$activitie.activities;
                response = (0, _objectWithoutProperties2.default)(_yield$this$activitie, _excluded3);
                _activities = (0, _slicedToArray2.default)(activities, 1), activity = _activities[0];
                return _context3.abrupt("return", _objectSpread(_objectSpread({}, activity), response));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function activityPartialUpdate(_x4) {
        return _activityPartialUpdate.apply(this, arguments);
      }

      return activityPartialUpdate;
    }()
    /**
     * Update multiple activities with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>[]} changes array containing the changesets to be applied. Every changeset contains the activity identifier which is either the ID or the pair of of foreign ID and time of the activity. The operations to issue can be set:{...} and unset:[...].
     * @return {Promise<{ activities: Activity<StreamFeedGenerics>[] }>}
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     id: "4b39fda2-d6e2-42c9-9abf-5301ef071b12",
     *     set: {
     *       "product.price.eur": 12.99,
     *       "colors": {
     *         "blue": "#0000ff",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "popularity", "size.x2" ],
     *   },
     *   {
     *     id: "8d2dcad8-1e34-11e9-8b10-9cb6d0925edd",
     *     set: {
     *       "product.price.eur": 17.99,
     *       "colors": {
     *         "red": "#ff0000",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "rating" ],
     *   },
     * ])
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     foreign_id: "product:123",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     *   {
     *     foreign_id: "product:321",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     * ])
     */

  }, {
    key: "activitiesPartialUpdate",
    value: function activitiesPartialUpdate(changes) {
      if (!(changes instanceof Array)) {
        throw new TypeError('changes should be an Array');
      }

      changes.forEach(function (item) {
        if (!(item instanceof Object)) {
          throw new TypeError("changeset should be and Object");
        }

        if (item.foreignID) {
          item.foreign_id = item.foreignID;
        }

        if (item.id === undefined && (item.foreign_id === undefined || item.time === undefined)) {
          throw new TypeError('missing id or foreign_id and time');
        }

        if (item.set && !(item.set instanceof Object)) {
          throw new TypeError('set field should be an Object');
        }

        if (item.unset && !(item.unset instanceof Array)) {
          throw new TypeError('unset field should be an Array');
        }
      });
      var token = this.userToken;

      if (this.usingApiSecret) {
        token = (0, _signing.JWTScopeToken)(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }

      return this.post({
        url: 'activity/',
        body: {
          changes: changes
        },
        token: token
      });
    }
  }]);
  return StreamClient;
}();

exports.StreamClient = StreamClient;