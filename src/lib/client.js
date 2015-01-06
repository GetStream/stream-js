var request = require('request');
var StreamFeed = require('./feed');
var signing = require('./signing');
var errors = require('./errors');
var crypto = require('crypto');
var utils = require('./utils');

var StreamClient = function() {
    this.initialize.apply(this, arguments);
};

StreamClient.prototype = {
    baseUrl: 'https://api.getstream.io/api/',

    initialize: function(apiKey, apiSecret, appId, options) {
        /*
         * initialize is not directly called by via stream.connect, ie:
         * stream.connect(apiKey, apiSecret)
         * secret is optional and only used in server side mode
         * stream.connect(apiKey, null, appId);
         */
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.appId = appId;
        this.options = options || {};
        this.version = this.options.version || 'v1.0';
        this.fayeUrl = this.options.fayeUrl || 'https://faye.getstream.io/faye';
        // track a source name for the api calls, ie get started or databrowser
        this.group = this.options.group || 'unspecified';
        // which data center to use
        this.location = this.options.location;
        if (this.location) {
        	this.baseUrl = 'https://' + this.location + '-api.getstream.io/api/';
        } else if (typeof(process) != "undefined" && process.env.LOCAL) {
            this.baseUrl = 'http://localhost:8000/api/';
        }
        this.handlers = {};
        this.browser = typeof(window) != 'undefined';
        this.node = !this.browser;

        if (this.browser && this.apiSecret) {
            throw new errors.FeedError('You are publicly sharing your private key. Dont use the private key while in the browser.');
        }
    },

    on: function(event, callback) {
        /*
         * Support for global event callbacks
         * This is useful for generic error and loading handling
         *
         * client.on('request', callback);
         * client.on('response', callback);
         *
         */
        this.handlers[event] = callback;
    },

    off: function(key) {
        /*
         * client.off() removes all handlers
         * client.off(name) removes the specified handler
         */
        if (key === undefined) {
            this.handlers = {};
        } else {
            delete this.handlers[key];
        }
    },

    send: function(key) {
        /*
         * Call the given handler with the arguments
         */
        var args = Array.prototype.slice.call(arguments);
        var key = args[0];
        args = args.slice(1);
        if (this.handlers[key]) {
            this.handlers[key].apply(this, args);
        }
    },

    wrapCallback: function(cb) {
        var client = this;

        function callback() {
            // first hit the global callback, subsequently forward
            var args = Array.prototype.slice.call(arguments);
            var sendArgs = ['response'].concat(args);
            client.send.apply(client, sendArgs);
            if (cb != undefined) {
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

    feed: function(feedSlug, userId, token, siteId) {
        /*
         * Returns a feed object for the given feed id and token
         * Example:
         *
         * client.feed('user', '1', 'token2');
         */
        if (!feedSlug || !userId) {
            throw new errors.FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
        }
        
        if (feedSlug.indexOf(':') != -1) {
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
            token = signing.sign(this.apiSecret, feedId);
        }

        var feed = new StreamFeed(this, feedSlug, userId, token, siteId);
        return feed;
    },

    enrichUrl: function(relativeUrl) {
        /*
         * Combines the base url with version and the relative url
         */
        var url = this.baseUrl + this.version + '/' + relativeUrl;
        return url;
    },

    enrichKwargs: function(kwargs) {
        /*
         * Adds the API key and the signature
         */
        kwargs.url = this.enrichUrl(kwargs.url);
        if (kwargs.qs == undefined) {
            kwargs.qs = {};
        }
        kwargs.qs['api_key'] = this.apiKey;
        kwargs.qs['location'] = this.group;
        kwargs.json = true;
        var signature = kwargs.signature || this.signature;
        kwargs.headers = {};
        kwargs.headers.Authorization = signature;
        // User agent can only be changed in server side mode
        var headerName = (this.node) ? 'User-Agent' : 'X-Stream-Client';
        kwargs.headers[headerName] = this.userAgent();

        return kwargs;
    },

    signActivity: function(activity) {
        return this.signActivities([activity])[0];
    },

    signActivities: function(activities) {
        /*
         * We automatically sign the to parameter when in server side mode
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
    }
};

module.exports = StreamClient;
