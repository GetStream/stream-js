var StreamClient = require('./client');
var StreamFeed = require('./feed');
var StreamObjectStore = require('./object_store');
var StreamReaction = require('./reaction');


StreamClient.prototype.storage = function(name, token) {
  return new StreamObjectStore(this, name, token);
};

StreamClient.prototype.reactions = function(token) {
  return new StreamReaction(this, token);
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

    return this.client.get({
      url: 'enrich/feed/' + this.feedUrl + '/',
      qs: options,
      signature: this.signature,
    }, callback);
};
