var request = require('request');
var StreamFeed = require('./feed');
var signing = require('./signing');
var errors = require('./errors');
var crypto = require('crypto');

var StreamClient = function () {
    this.initialize.apply(this, arguments);
};

StreamClient.prototype = {
    baseUrl: 'https://getstream.io',

    initialize: function (key, secret, siteId, fayeUrl) {
        /*
         * API key and secret
         * Secret is optional
         */
        this.key = key;
        this.secret = secret;
        this.siteId = siteId;
        this.fayeUrl = fayeUrl ? fayeUrl : 'https://getstream.io/faye';
        if (typeof (process) != "undefined" && process.env.LOCAL) {
            //this.fayeUrl = 'http://localhost:8000/faye';
            this.baseUrl = 'http://localhost:8000';
        }
        this.handlers = {};
    },
    
    on: function(event, callback) {
    	/*
    	 * Support for global event callbacks
    	 * This is useful for generic error and loading handling
    	 * 
    	 * client.on('pre_request', callback);
    	 * client.on('response', callback);
    	 * 
    	 */
    	this.handlers[event] = callback;
    },
    
    off: function(event) {
    	/*
    	 * client.off() removes all handlers
    	 * client.off(name) removes the specified handler
    	 */
    	if (key == undefined) {
    		this.handlers = {};
    	} else {
    		delete this.handlers[key];
    	}
    },
    
    send: function(key) {
    	/*
    	 * Call the given handler with the arguments
    	 */
    	var key = arguments[0];
    	var args = arguments.slice(1,null);
    	if (this.handlers[key]) {
    		this.handlers[key].apply(this, args);
    	}
    },

    feed: function (feedId, token, siteId) {
        /*
         * Returns a feed object for the given feed id and token
         * Example:
         *
         * client.feed('user1', 'token2');
         */
        var match = feedId.match(/\:/g);
        if (match === null || match.length != 1) {
            throw new errors.FeedError('Wrong feed format ' + feedId + ' correct format is flat:1');
        }

        if (crypto.createHash && this.secret && !token) {
            // we are server side, have a secret but no feed signature
            token = signing.sign(this.secret, feedId.replace(':', ''));
        }

        if (!token) {
            throw new errors.FeedError('Missing token, in client side mode please provide a feed secret');
        }

        var feed = new StreamFeed(this, feedId, token, siteId);
        return feed;
    },

    enrichUrl: function (relativeUrl) {
        var url = this.baseUrl + relativeUrl;
        if (url.indexOf('?') != -1) {
            url += '&api_key=' + this.key;
        } else {
            url += '?api_key=' + this.key;
        }
        return url;
    },

    enrichKwargs: function (kwargs) {
        kwargs.url = this.enrichUrl(kwargs.url);
        kwargs.json = true;
        var authorization = kwargs.authorization || this.authorization;
        kwargs.headers = {};
        kwargs.headers.Authorization = authorization;
        return kwargs;
    },
    /*
     * Shortcuts for post, get and delete HTTP methods
     */
    dummyCallback: function (error, response, body) {

    },
    
    wrapCallback: function (cb) {
    	var client = this;
        function callback() {
        	// first hit the global callback, subsequently forward
        	client.send.apply(client, ['response'] + arguments());
        	cb.apply(arguments());
        }
        return callback;
    }
    
    get: function (kwargs, cb) {
		this.send('pre_request', 'get', kwargs, cb);
        cb = cb || this.dummyCallback;
        kwargs = this.enrichKwargs(kwargs);
        kwargs.method = 'GET';
        var callback = this.wrapCallback();
        return request.get(kwargs, callback);
    },
    post: function (kwargs, cb) {
    	this.handlers.send('pre_request', 'post', kwargs, cb);
        cb = cb || this.dummyCallback;
        kwargs = this.enrichKwargs(kwargs);
        kwargs.method = 'POST';
        var callback = this.wrapCallback();
        return request(kwargs, callback);
    },
    delete: function (kwargs, cb) {
    	this.handlers.send('pre_request', 'delete', kwargs, cb);
        cb = cb || this.dummyCallback;
        kwargs = this.enrichKwargs(kwargs);
        kwargs.method = 'DELETE';
        var callback = this.wrapCallback();
        return request(kwargs, callback);
    }
};

module.exports = StreamClient;