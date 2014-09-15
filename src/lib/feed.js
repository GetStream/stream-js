var errors = require('./errors');


var StreamFeed = function () {
    this.initialize.apply(this, arguments);
};

StreamFeed.prototype = {
	/*
	 * The feed object contains convenience functions such add activity
	 * remove activity etc
	 * 
	 */
	initialize: function(client, feed, token) {
		this.client = client;
		this.feed = feed;
		this.token = token;
		this.feedUrl = feed.replace(':', '/');
		this.feedTogether = feed.replace(':', '');
		this.authorization = this.feedTogether + ' ' + this.token;
        this.fayeClient = null;
        this.notificationChannel = 'site-' + this.client.siteId + '-feed-' + this.feedTogether;
	},
	addActivity: function(activity, callback) {
		/*
		 * Adds the given activity to the feed and
		 * calls the specified callback
		 */
		var activity = this.client.signActivity(activity);
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'body': activity,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	removeActivity: function(activityId, callback) {
		var identifier = (activityId.foreignId) ? activityId.foreignId : activityId;
		var params = {};
		if (activityId.foreignId) {
			params.foreign_id = '1';
		}
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/' + activityId + '/', 
			'qs': params,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	addActivities: function(activities, callback) {
		/*
		 * Adds the given activities to the feed and
		 * calls the specified callback
		 */
		var activities = this.client.signActivities(activities);
		var data = {activities: activities};
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'body': data,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	follow: function(target, callbackOrToken, callback) {
		if (callbackOrToken != undefined) {
			var targetToken = (callbackOrToken.call) ? null : callbackOrToken;
			var callback = (callbackOrToken.call) ? callbackOrToken : callback;
		}
		// if have a secret, always just generate and send along the token
		if (this.client.secret && !targetToken) {
			targetToken = this.client.feed(target).token;
		}
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/follows/', 
			'body': {'target': target, 'target_token': targetToken},
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	unfollow: function(target, callback) {
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/follows/' + target + '/', 
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	following: function(argumentHash, callback) {
		if (argumentHash != undefined && argumentHash.feeds) {
			argumentHash.feeds = argumentHash.feeds.join(',');
		}
		var xhr = this.client.get({
			'url': '/api/feed/'+ this.feedUrl + '/following/', 
			'qs': argumentHash,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	followers: function(argumentHash, callback) {
		if (argumentHash != undefined && argumentHash.feeds) {
			argumentHash.feeds = argumentHash.feeds.join(',');
		}
		var xhr = this.client.get({
			'url': '/api/feed/'+ this.feedUrl + '/followers/', 
			'qs': argumentHash,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},
	get: function(argumentHash, callback) {
		if (argumentHash && argumentHash.mark_read) {
			argumentHash.mark_read = argumentHash.mark_read.join(',');
		}
		if (argumentHash && argumentHash.mark_seen) {
			argumentHash.mark_seen = argumentHash.mark_seen.join(',');
		}

		var xhr = this.client.get({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'qs': argumentHash,
			'authorization': this.authorization
		}, callback);
		return xhr;
	},

    getFayeAuthorization: function(){
        var api_key = this.client.key;
        var user_id = this.notificationChannel;
        var signature = this.token;
        return {
          incoming: function(message, callback) {
            callback(message);
          },
          outgoing: function(message, callback) {
            message.ext = {'user_id': user_id, 'api_key':api_key, 'signature': signature};
            callback(message);
          }
        };
    },

    getFayeClient: function(){
    	var Faye = require('faye');
        if (this.fayeClient === null){
            this.fayeClient = new Faye.Client(this.client.fayeUrl);
            var authExtension = this.getFayeAuthorization();
            this.fayeClient.addExtension(authExtension);
        }
        return this.fayeClient;
    },

    subscribe: function(callback){
    	if (!this.client.siteId) {
    		throw new errors.SiteError('Missing site id, which is needed to subscribe, use var client = stream.connect(key, secret, siteId);');
    	}
        return this.getFayeClient().subscribe('/'+this.notificationChannel, callback);
    }
};


module.exports = StreamFeed;