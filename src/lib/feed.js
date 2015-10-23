var errors = require('./errors');
var utils = require('./utils');

var StreamFeed = function() {
	this.initialize.apply(this, arguments);
};

StreamFeed.prototype = {
	/*
	 * The feed object contains convenience functions such add activity
	 * remove activity etc
	 *
	 */
	initialize : function(client, feedSlug, userId, token, siteId) {
		this.client = client;
		this.slug = feedSlug;
		this.userId = userId;
		this.id = this.slug + ':' + this.userId;
		this.token = token;

		this.feedUrl = this.id.replace(':', '/');
		this.feedTogether = this.id.replace(':', '');
		this.signature = this.feedTogether + ' ' + this.token;

		// faye setup
		this.notificationChannel = 'site-' + this.client.appId + '-feed-' + this.feedTogether;
	},
	addActivity : function(activity, callback) {
		/*
		 * Adds the given activity to the feed and
		 * calls the specified callback
		 */
		activity = this.client.signActivity(activity);
		var xhr = this.client.post({
			'url' : 'feed/' + this.feedUrl + '/',
			'body' : activity,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	removeActivity : function(activityId, callback) {
		/*
		 * Removes the activity by activityId
		 * feed.removeActivity(activityId);
		 * Or
		 * feed.removeActivity({'foreign_id': foreignId});
		 */
		var identifier = (activityId.foreignId) ? activityId.foreignId : activityId;
		var params = {};
		if (activityId.foreignId) {
			params.foreign_id = '1';
		}
		var xhr = this.client.delete( {
			'url' : 'feed/' + this.feedUrl + '/' + identifier + '/',
			'qs' : params,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	addActivities : function(activities, callback) {
		/*
		 * Adds the given activities to the feed and
		 * calls the specified callback
		 */
		activities = this.client.signActivities(activities);
		var data = {
			activities : activities
		};
		var xhr = this.client.post({
			'url' : 'feed/' + this.feedUrl + '/',
			'body' : data,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	follow : function(targetSlug, targetUserId, limitOrTokenOrCallback, callbackOrToken, callback) {
		/*
		 * feed.follow('user', '1');
		 * or
		 * feed.follow('user', '1', 'token');
		 * or
		 * feed.follow('user', '1', callback);
     * or
     * feed.follow('user', '1', 'token', 300, callback);
     * or
     * feed.follow('user', '1', 300, callback);
		 */
		utils.validateFeedSlug(targetSlug);
		utils.validateUserId(targetUserId);

		var targetToken, activityCopyLimit;
		var last = arguments[arguments.length - 1];
		// callback is always the last argument
		callback = (last.call) ? last : undefined;
		var target = targetSlug + ':' + targetUserId;
		// token is 3rd or 4th
    var arg2 = arguments[2],
        arg3 = arguments[3],
        arg4 = arguments[4];

    if(arg2 && !arg2.call && typeof arg2 === 'string') {
      targetToken = arg2;
    } else if(arg3 && !arg3.call && typeof arg3 === 'string') {
      targetToken = arg3;
    }

    if(arg2 && !arg2.call && typeof arg2 === 'number') {
      activityCopyLimit = arg2;
    }

		// if have a secret, always just generate and send along the token
		if (this.client.apiSecret && !targetToken) {
			targetToken = this.client.feed(targetSlug, targetUserId).token;
		}

    var body = {
      'target': target,
      'target_token': targetToken 
    };

    if(activityCopyLimit) {
      body['activity_copy_limit'] = activityCopyLimit;
    }

		var xhr = this.client.post({
			'url' : 'feed/' + this.feedUrl + '/following/',
			'body' : body,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	unfollow : function(targetSlug, targetUserId, callback) {
		/*
		 * Unfollow the given feed, ie:
		 * feed.unfollow('user', '2', callback);
		 */
		utils.validateFeedSlug(targetSlug);
		utils.validateUserId(targetUserId);
		var targetFeedId = targetSlug + ':' + targetUserId;
		var xhr = this.client.delete( {
			'url' : 'feed/' + this.feedUrl + '/following/' + targetFeedId + '/',
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	following : function(options, callback) {
		/*
		 * List which feeds this feed is following
		 * 
		 * feed.following({limit:10, filter: ['user:1', 'user:2']}, callback);
		 */
		if (options !== undefined && options.filter) {
			options.filter = options.filter.join(',');
		}
		var xhr = this.client.get({
			'url' : 'feed/' + this.feedUrl + '/following/',
			'qs' : options,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	followers : function(options, callback) {
		/*
		 * List the followers of this feed
		 * 
		 * feed.followers({limit:10, filter: ['user:1', 'user:2']}, callback);
		 */
		if (options !== undefined && options.filter) {
			options.filter = options.filter.join(',');
		}
		var xhr = this.client.get({
			'url' : 'feed/' + this.feedUrl + '/followers/',
			'qs' : options,
			'signature' : this.signature
		}, callback);
		return xhr;
	},
	get : function(options, callback) {
		/*
		 * Reads the feed
		 * 
		 * feed.get({limit: 10, id_lte: 'activity-id'})
		 * or
		 * feed.get({limit: 10, mark_seen: true})
		 */
		if (options && options.mark_read && options.mark_read.join) {
			options.mark_read = options.mark_read.join(',');
		}
		if (options && options.mark_seen && options.mark_seen.join) {
			options.mark_seen = options.mark_seen.join(',');
		}

		var xhr = this.client.get({
			'url' : 'feed/' + this.feedUrl + '/',
			'qs' : options,
			'signature' : this.signature
		}, callback);
		return xhr;
	},

  getFayeClient : function() {
    return this.client.getFayeClient();
  },

	subscribe : function(callback) {
		/*
		 * subscribes to any changes in the feed, return a promise
		 * feed.subscribe(callback).then(function(){
		 * 		console.log('we are now listening to changes');
		 * });
		 */
		if (!this.client.appId) {
			throw new errors.SiteError('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
		}

    this.client.subscriptions['/' + this.notificationChannel] = {
      'token': this.token,
      'userId': this.notificationChannel 
    };

		return this.getFayeClient().subscribe('/' + this.notificationChannel, callback);
	}
};

module.exports = StreamFeed; 
