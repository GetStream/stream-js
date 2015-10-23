var errors = require('./errors');
var utils = require('./utils');

var StreamFeed = function() {
  /**
   * Manage api calls for specific feeds
   * The feed object contains convenience functions such add activity, remove activity etc
   * @class StreamFeed
   */
  this.initialize.apply(this, arguments);
};

StreamFeed.prototype = {
  initialize: function(client, feedSlug, userId, token, siteId) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberOf StreamFeed.prototype
     * @param {StreamClient} client - The stream client this feed is constructed from
     * @param {string} feedSlug - The feed slug
     * @param {string} userId - The user id
     * @param {string} [token] - The authentication token
     * @param {string} [siteId] - The site identifier
     * 
     */
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

  addActivity: function(activity, callback) {
    /**
     * Adds the given activity to the feed and
     * calls the specified callback
     * @method addActivity
     * @memberOf StreamFeed
     * @param {object} activity - The activity to add
     * @param {function} callback - The callback
     */
    activity = this.client.signActivity(activity);
    var xhr = this.client.post({
      url: 'feed/' + this.feedUrl + '/',
      body: activity,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  removeActivity: function(activityId, callback) {
    /*
     * Removes the activity by activityId
     * feed.removeActivity(activityId);
     * Or
     * feed.removeActivity({'foreign_id': foreignId});
     */
    var identifier = (activityId.foreignId) ? activityId.foreignId : activityId;
    var params = {};
    if (activityId.foreignId) {
      params['foreign_id'] = '1';
    }

    var xhr = this.client.delete({
      url: 'feed/' + this.feedUrl + '/' + identifier + '/',
      qs: params,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  addActivities: function(activities, callback) {
    /*
     * Adds the given activities to the feed and
     * calls the specified callback
     */
    activities = this.client.signActivities(activities);
    var data = {
      activities: activities,
    };
    var xhr = this.client.post({
      url: 'feed/' + this.feedUrl + '/',
      body: data,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  follow: function(targetSlug, targetUserId, options, callback) {
    /*
     * feed.follow('user', '1');
     * or
     * feed.follow('user', '1', callback);
     * or
     * feed.follow('user', '1', options, callback);
     */
    utils.validateFeedSlug(targetSlug);
    utils.validateUserId(targetUserId);

    var activityCopyLimit;
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;
    var target = targetSlug + ':' + targetUserId;

    // check for additional options
    if (options && !options.call) {
      if (options.limit) {
        activityCopyLimit = options.limit;
      }
    }

    var body = {
      target: target,
    };

    if (activityCopyLimit) {
      body['activity_copy_limit'] = activityCopyLimit;
    }

    var xhr = this.client.post({
      url: 'feed/' + this.feedUrl + '/following/',
      body: body,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  unfollow: function(targetSlug, targetUserId, callback) {
    /*
     * Unfollow the given feed, ie:
     * feed.unfollow('user', '2', callback);
     */
    utils.validateFeedSlug(targetSlug);
    utils.validateUserId(targetUserId);
    var targetFeedId = targetSlug + ':' + targetUserId;
    var xhr = this.client.delete({
      url: 'feed/' + this.feedUrl + '/following/' + targetFeedId + '/',
      signature: this.signature,
    }, callback);
    return xhr;
  },

  following: function(options, callback) {
    /*
     * List which feeds this feed is following
     *
     * feed.following({limit:10, filter: ['user:1', 'user:2']}, callback);
     */
    if (options !== undefined && options.filter) {
      options.filter = options.filter.join(',');
    }

    var xhr = this.client.get({
      url: 'feed/' + this.feedUrl + '/following/',
      qs: options,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  followers: function(options, callback) {
    /*
     * List the followers of this feed
     *
     * feed.followers({limit:10, filter: ['user:1', 'user:2']}, callback);
     */
    if (options !== undefined && options.filter) {
      options.filter = options.filter.join(',');
    }

    var xhr = this.client.get({
      url: 'feed/' + this.feedUrl + '/followers/',
      qs: options,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  get: function(options, callback) {
    /*
     * Reads the feed
     *
     * feed.get({limit: 10, id_lte: 'activity-id'})
     * or
     * feed.get({limit: 10, mark_seen: true})
     */
    if (options && options['mark_read'] && options['mark_read'].join) {
      options['mark_read'] = options['mark_read'].join(',');
    }

    if (options && options['mark_seen'] && options['mark_seen'].join) {
      options['mark_seen'] = options['mark_seen'].join(',');
    }

    var xhr = this.client.get({
      url: 'feed/' + this.feedUrl + '/',
      qs: options,
      signature: this.signature,
    }, callback);
    return xhr;
  },

  getFayeClient: function() {
    return this.client.getFayeClient();
  },

  subscribe: function(callback) {
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
      token: this.token,
      userId: this.notificationChannel,
    };

    return this.getFayeClient().subscribe('/' + this.notificationChannel, callback);
  },
};

module.exports = StreamFeed;
