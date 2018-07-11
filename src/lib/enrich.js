var StreamClient = require('./client');
var StreamFeed = require('./feed');
var StreamObjectStore = require('./object_store');
var StreamUserSession = require('./user_session');
var StreamReaction = require('./reaction');

StreamClient.prototype.storage = function(name, token) {
  return new StreamObjectStore(this, name, token);
};

StreamClient.prototype.reactions = function(token) {
  return new StreamReaction(this, token);
};

StreamClient.prototype.createUserSession = function(userId, userAuthToken) {
  return new StreamUserSession(this, userId, userAuthToken);
};

StreamFeed.prototype.getEnriched = function(options, callback) {
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

StreamFeed.prototype.getActivityDetail = function(activity_id, options, callback) {  /**
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

  return this.getEnriched(Object.assign({id_lte:activity_id, id_gte:activity_id, limit:1}, options), callback);
};
