var StreamClient = require('./client');
var StreamFeed = require('./feed');
var StreamCollection = require('./collection');
var StreamReaction = require('./reaction');


StreamClient.prototype.collection = function(name, token) {
  return new StreamCollection(this, name, token);
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
     */
     return this.get(options, callback, 'enrich/');
};
