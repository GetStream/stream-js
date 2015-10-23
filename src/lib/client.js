var request = require('request');
var StreamFeed = require('./feed');
var signing = require('./signing');
var errors = require('./errors');
var utils = require('./utils');
var BatchOperations = require('./batch_operations');

var StreamClient = function() {
  /**
   * Client to connect to Stream api
   * @class StreamClient
   */ 
  this.initialize.apply(this, arguments);
};

StreamClient.prototype = {
  baseUrl: 'https://api.getstream.io/api/',

  initialize: function(apiKey, apiSecret, appId, options) {
    /**
     * Initialize a client
     * @method intialize
     * @memberof StreamClient.prototype
     * @param {string} apiKey - the api key
     * @param {string} [apiSecret] - the api secret 
     * @param {string} [appId] - id of the app
     * @param {object} options - additional options
     * @param {string} options.location - which data center to use
     * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
     * stream.connect(apiKey, apiSecret)
     * @example <caption>secret is optional and only used in server side mode</caption>
     * stream.connect(apiKey, null, appId);
     */
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.appId = appId;
    this.options = options || {};
    this.version = this.options.version || 'v1.0';
    this.fayeUrl = this.options.fayeUrl || 'https://faye.getstream.io/faye';
    this.fayeClient = null;
    // track a source name for the api calls, ie get started or databrowser
    this.group = this.options.group || 'unspecified';
    // track subscriptions made on feeds created by this client
    this.subscriptions = {};
    // which data center to use
    this.location = this.options.location;
    if (this.location) {
      this.baseUrl = 'https://' + this.location + '-api.getstream.io/api/';
    }

    if (typeof (process) !== 'undefined' && process.env.LOCAL) {
      this.baseUrl = 'http://localhost:8000/api/';
    }

    if (typeof (process) !== 'undefined' && process.env.LOCAL_FAYE) {
      this.fayeUrl = 'http://localhost:9999/faye/';
    }

    this.handlers = {};
    this.browser = typeof (window) !== 'undefined';
    this.node = !this.browser;

    if (this.browser && this.apiSecret) {
      throw new errors.FeedError('You are publicly sharing your private key. Dont use the private key while in the browser.');
    }
  },

  on: function(event, callback) {
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
    this.handlers[event] = callback;
  },

  off: function(key) {
    /**
     * Remove one or more event handlers
     * @method off
     * @memberof StreamClient.prototype
     * @param {string} [key] - Name of the handler
     * @example
     * client.off() removes all handlers
     * client.off(name) removes the specified handler
     */
    if (key === undefined) {
      this.handlers = {};
    } else {
      delete this.handlers[key];
    }
  },

  send: function() {
    /**
     * Call the given handler with the arguments
     * @method send
     * @memberof StreamClient.prototype
     * @access private
     */
    var args = Array.prototype.slice.call(arguments);
    var key = args[0];
    args = args.slice(1);
    if (this.handlers[key]) {
      this.handlers[key].apply(this, args);
    }
  },

  wrapCallback: function(cb) {
    /**
     * Wrap callback for HTTP request
     * @method wrapCallBack
     * @memberof StreamClient.prototype
     * @access private
     */
    var client = this;

    function callback() {
      // first hit the global callback, subsequently forward
      var args = Array.prototype.slice.call(arguments);
      var sendArgs = ['response'].concat(args);
      client.send.apply(client, sendArgs);
      if (cb !== undefined) {
        cb.apply(client, args);
      }
    }

    return callback;
  },

  userAgent: function() {
    var description = (this.node) ? 'node' : 'browser';
    // TODO: get the version here in a way which works in both and browserify
    var version = 'unknown';
    return 'stream-javascript-client-' + description + '-' + version;
  },

  getReadOnlyToken: function(feedSlug, userId) {
    /**
     * Returns a token that allows only read operations
     *
     * @method getReadOnlyToken 
     * @memberOf StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example
     * client.getReadOnlyToken('user', '1');
     */
    var feedId = '' + feedSlug + userId;
    return signing.JWTScopeToken(this.apiSecret, feedId, '*', 'read');
  },

  getReadWriteToken: function(feedSlug, userId) {
    /**
     * Returns a token that allows read and write operations
     *
     * @method getReadWriteToken
     * @memberOf StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example
     * client.getReadWriteToken('user', '1');
     */
    var feedId = '' + feedSlug + userId;
    return signing.JWTScopeToken(this.apiSecret, feedId, '*', '*');
  },

  feed: function(feedSlug, userId, token, siteId, options) {
    /**
     * Returns a feed object for the given feed id and token
     * @method feed
     * @memberOf StreamClient.prototype
     * @param {string} feedSlug - The feed slug
     * @param {string} userId - The user identifier
     * @param {string} [token] - The token
     * @param {string} [siteId] - The site identifier
     * @param {object} [options] - Additional function options 
     * @param {boolean} [options.readOnly] - A boolean indicating whether to generate a read only token for this feed
     * @return {Feed}
     * @example
     * client.feed('user', '1', 'token2');
     */

    options = options || {};

    if (!feedSlug || !userId) {
      throw new errors.FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
    }

    if (feedSlug.indexOf(':') !== -1) {
      throw new errors.FeedError('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
    }

    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    // raise an error if there is no token
    if (!this.apiSecret && !token) {
      throw new errors.FeedError('Missing token, in client side mode please provide a feed secret');
    }

    // create the token in server side mode
    if (this.apiSecret && !token) {
      var feedId = '' + feedSlug + userId;
      // use scoped token if read-only access is necessary
      token = options.readOnly ? this.getReadOnlyToken(feedSlug, userId) : signing.sign(this.apiSecret, feedId);
    }

    var feed = new StreamFeed(this, feedSlug, userId, token, siteId);
    return feed;
  },

  enrichUrl: function(relativeUrl) {
    /**
     * Combines the base url with version and the relative url
     * @access private
     */
    var url = this.baseUrl + this.version + '/' + relativeUrl;
    return url;
  },

  enrichKwargs: function(kwargs) {
    /**
     * Adds the API key and the signature
     * @access private
     */
    kwargs.url = this.enrichUrl(kwargs.url);
    if (kwargs.qs === undefined) {
      kwargs.qs = {};
    }

    kwargs.qs['api_key'] = this.apiKey;
    kwargs.qs.location = this.group;
    kwargs.json = true;
    var signature = kwargs.signature || this.signature;
    kwargs.headers = {};

    // auto-detect authentication type and set HTTP headers accordingly
    if (signing.isJWTSignature(signature)) {
      kwargs.headers['stream-auth-type'] = 'jwt';
      signature = signature.split(' ').reverse()[0];
    } else {
      kwargs.headers['stream-auth-type'] = 'simple';
    }

    kwargs.headers.Authorization = signature;
    kwargs.headers['X-Stream-Client'] = this.userAgent();
    return kwargs;
  },

  signActivity: function(activity) {
    return this.signActivities([activity])[0];
  },

  signActivities: function(activities) {
    /**
     * We automatically sign the to parameter when in server side mode
     * @access private
     */
    if (!this.apiSecret) {
      return activities;
    }

    for (var i = 0; i < activities.length; i++) {
      var activity = activities[i];
      var to = activity.to || [];
      var signedTo = [];
      for (var j = 0; j < to.length; j++) {
        var feedId = to[j];
        var feedSlug = feedId.split(':')[0];
        var userId = feedId.split(':')[1];
        var token = this.feed(feedSlug, userId).token;
        var signedFeed = feedId + ' ' + token;
        signedTo.push(signedFeed);
      }

      activity.to = signedTo;
    }

    return activities;
  },

  getFayeAuthorization: function() {
      var apiKey = this.apiKey,
          self = this;

      return {
        incoming: function(message, callback) {
          callback(message);
        },

        outgoing: function(message, callback) {
          if (message.subscription && self.subscriptions[message.subscription]) {
            var subscription = self.subscriptions[message.subscription];

            message.ext = {
              'user_id': subscription.userId,
              'api_key': apiKey,
              'signature': subscription.token,
            };
          }

          callback(message);
        },
      };
    },

  getFayeClient: function() {
      var Faye = require('faye');
      if (this.fayeClient === null) {
        this.fayeClient = new Faye.Client(this.fayeUrl);
        var authExtension = this.getFayeAuthorization();
        this.fayeClient.addExtension(authExtension);
      }

      return this.fayeClient;
    },

  /*
   * Shortcuts for post, get and delete HTTP methods
   *
   */

  get: function(kwargs, cb) {
    this.send('request', 'get', kwargs, cb);
    kwargs = this.enrichKwargs(kwargs);
    kwargs.method = 'GET';
    var callback = this.wrapCallback(cb);
    return request(kwargs, callback);
  },

  post: function(kwargs, cb) {
    this.send('request', 'post', kwargs, cb);
    kwargs = this.enrichKwargs(kwargs);
    kwargs.method = 'POST';
    var callback = this.wrapCallback(cb);
    return request(kwargs, callback);
  },

  delete: function(kwargs, cb) {
    this.send('request', 'delete', kwargs, cb);
    kwargs = this.enrichKwargs(kwargs);
    kwargs.method = 'DELETE';
    var callback = this.wrapCallback(cb);
    return request(kwargs, callback);
  },

};

// If we are in a node environment and batchOperations is available add the methods to the prototype of StreamClient
if (BatchOperations) {
  for (var key in BatchOperations) {
    if (BatchOperations.hasOwnProperty(key)) {
      StreamClient.prototype[key] = BatchOperations[key];
    }
  }
}

module.exports = StreamClient;
