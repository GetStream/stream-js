
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
		this.feedToken = this.feedTogether + ' ' + this.token;
        this.fayeClient = null;
        this.notificationChannel = 'site-' + this.client.siteId + '-feed-' + this.feedTogether;
	},
	addActivity: function(activity, callback) {
		/*
		 * Adds the given activity to the feed and
		 * calls the specified callback
		 */
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'body': activity,
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	removeActivity: function(activityId, callback) {
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/' + activityId + '/', 
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	follow: function(target, callback) {
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/follows/', 
			'body': {'target': target},
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	unfollow: function(target, callback) {
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/follows/' + target + '/', 
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	get: function(argumentHash, callback) {
		var xhr = this.client.get({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'qs': argumentHash,
			'secret': this.feedToken
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
        return this.getFayeClient().subscribe('/'+this.notificationChannel, callback);
    }
};


module.exports = StreamFeed;