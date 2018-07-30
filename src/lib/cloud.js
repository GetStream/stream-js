var StreamClient = require('./client');
var StreamFeed = require('./feed');
var StreamObjectStore = require('./object_store');
var StreamUserSession = require('./user_session');
var StreamReaction = require('./reaction');

// Inheriting StreamClient like discribed:
// https://stackoverflow.com/a/15192747/2570866
function StreamCloudClient() {
  StreamClient.apply(this, arguments);
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

StreamCloudClient.prototype.reactions = function(token) {
  return new StreamReaction(this, token);
};

StreamCloudClient.prototype.createUserSession = function(
  userId,
  userAuthToken,
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
    callback,
  );
};

StreamCloudFeed.prototype.getActivityDetail = function(
  activity_id,
  options,
  callback,
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
      options,
    ),
    callback,
  );
};

module.exports.StreamCloudClient = StreamCloudClient;
module.exports.StreamCloudFeed = StreamCloudFeed;
