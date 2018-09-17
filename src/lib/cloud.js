var StreamClient = require('./client');
var StreamFeed = require('./feed');
var StreamObjectStore = require('./object_store');
var StreamUserSession = require('./user_session');
var StreamReaction = require('./reaction');
var StreamFileStore = require('./files');
var StreamImageStore = require('./images');
var StreamPermissions = require('./permissions');
var isObject = require('lodash/isObject');
var isPlainObject = require('lodash/isPlainObject');

// Inheriting StreamClient like discribed:
// https://stackoverflow.com/a/15192747/2570866
function StreamCloudClient() {
  let options = arguments[3] || {};

  let location = 'cloud';
  if (options.location) {
    location = options.location + '-cloud';
  }
  options = { ...options, location };
  StreamClient.apply(this, [arguments[0], arguments[1], arguments[2], options]);
}

function createObject(proto) {
  function ctor() {}
  ctor.prototype = proto;
  return new ctor();
}

StreamCloudClient.prototype = createObject(StreamClient.prototype);

StreamCloudClient.prototype.storage = function(name, token) {
  return new StreamObjectStore(this, name, token);
};

StreamCloudClient.prototype.files = function(token) {
  return new StreamFileStore(this, token);
};

StreamCloudClient.prototype.images = function(token) {
  return new StreamImageStore(this, token);
};

StreamCloudClient.prototype.reactions = function(token) {
  return new StreamReaction(this, token);
};

StreamCloudClient.prototype.permissions = function(token) {
  return new StreamPermissions(this, token);
};

StreamCloudClient.prototype.createUserSession = function(
  userId,
  userAuthToken
) {
  return new StreamUserSession(this, userId, userAuthToken);
};

StreamCloudClient.prototype.feed = function(feedSlug, userId, token) {
  return new StreamCloudFeed(this, feedSlug, userId, token);
};

function StreamCloudFeed() {
  StreamFeed.apply(this, arguments);
}

StreamCloudFeed.prototype = createObject(StreamFeed.prototype);

StreamCloudFeed.prototype.get = function(options, callback) {
  /**
   * Reads the feed
   * @method getEnriched
   * @memberof StreamFeed.prototype
   * @param  {object}   options  Additional options
   * @param  {requestCallback} callback Callback to call on completion
   * @return {Promise} Promise object
   * @example feed.getEnriched({limit: 10, id_lte: 'activity-id'})
   * @example feed.getEnriched({limit: 10, mark_seen: true})
   * @example feed.getEnriched({limit: 10, mark_seen: true, withRecentReactions: true})
   * @example feed.getEnriched({limit: 10, mark_seen: true, withReactionCounts: true})
   * @example feed.getEnriched({limit: 10, mark_seen: true, withOwnReactions: true, withReactionCounts: true})
   */
  if (options && options['mark_read'] && options['mark_read'].join) {
    options['mark_read'] = options['mark_read'].join(',');
  }

  if (options && options['mark_seen'] && options['mark_seen'].join) {
    options['mark_seen'] = options['mark_seen'].join(',');
  }

  return this.client.get(
    {
      url: 'enrich/feed/' + this.feedUrl + '/',
      qs: options,
      signature: this.signature,
    },
    callback
  );
};

function replaceStreamObjects(obj) {
  let cloned = obj;
  if (Array.isArray(obj)) {
    cloned = obj.map((v) => replaceStreamObjects(v));
  } else if (isPlainObject(obj)) {
    cloned = {};
    for (let k in obj) {
      cloned[k] = replaceStreamObjects(obj[k]);
    }
  } else if (isObject(obj) && obj._streamRef !== undefined) {
    cloned = obj._streamRef();
  }
  return cloned;
}

StreamCloudFeed.prototype._addActivityOriginal =
  StreamCloudFeed.prototype.addActivity;
StreamCloudFeed.prototype.addActivity = function(activity, callback) {
  activity = replaceStreamObjects(activity);
  return this._addActivityOriginal(activity, callback);
};

StreamCloudFeed.prototype._addActivitiesOriginal =
  StreamCloudFeed.prototype.addActivities;
StreamCloudFeed.prototype.addActivities = function(activities, callback) {
  activities = replaceStreamObjects(activities);
  return this._addActivitiesOriginal(activities, callback);
};

StreamCloudFeed.prototype.getActivityDetail = function(
  activity_id,
  options,
  callback
) {
  /**
   * Retrieves one activity from a feed and adds enrichment
   * @method getActivityDetail
   * @memberof StreamFeed.prototype
   * @param  {array}    ids  Additional options
   * @param  {object}   options  Additional options
   * @param  {requestCallback} callback Callback to call on completion
   * @return {Promise} Promise object
   * @example feed.getActivityDetail(activity_id)
   * @example feed.getActivityDetail(activity_id, {withRecentReactions: true})
   * @example feed.getActivityDetail(activity_id, {withReactionCounts: true})
   * @example feed.getActivityDetail(activity_id, {withOwnReactions: true, withReactionCounts: true})
   */

  return this.get(
    Object.assign(
      { id_lte: activity_id, id_gte: activity_id, limit: 1 },
      options
    ),
    callback
  );
};

module.exports.StreamCloudClient = StreamCloudClient;
module.exports.StreamCloudFeed = StreamCloudFeed;
