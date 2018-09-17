var errors = require('./errors');

var StreamReaction = function() {
  this.initialize.apply(this, arguments);
};

StreamReaction.prototype = {
  initialize: function(client, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof StreamReaction.prototype
     * @param {StreamClient} client Stream client this feed is constructed from
     * @param {string} token JWT token
     * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.token = token;
    this.signature = token;
  },

  buildURL: function() {
    var url = 'reaction/';
    for (var i = 0; i < arguments.length; i++) {
      url += arguments[i] + '/';
    }
    return url;
  },

  all: function(options, callback) {
    /**
     * get all reactions
     * @method all
     * @memberof StreamReaction.prototype
     * @param  {object}   options  {limit:}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.all()
     * @example reactions.all({limit:100})
     */
    return this.client.get(
      {
        url: this.buildURL(),
        signature: this.signature,
      },
      callback
    );
  },

  _convertTargetFeeds: function(targetFeeds = []) {
    return targetFeeds.map(
      (elem) => (typeof elem === 'string' ? elem : elem.id)
    );
  },

  add: function(kind, activity, { id, data, targetFeeds } = {}, callback) {
    /**
     * add reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   activity Activity or an ActivityID
     * @param  {object}   data  data related to reaction
     * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", {"id": "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "text": "I climbed a mountain"}, {"text": "love it!"},)
     */
    if (activity instanceof Object) {
      activity = activity.id;
    }
    targetFeeds = this._convertTargetFeeds(targetFeeds);
    var body = {
      activity_id: activity,
      kind: kind,
      id: id,
      data: data,
      target_feeds: targetFeeds,
    };
    return this.client.post(
      {
        url: this.buildURL(),
        body: body,
        signature: this.signature,
      },
      callback
    );
  },

  get: function(id, callback) {
    /**
     * get reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    return this.client.get(
      {
        url: this.buildURL(id),
        signature: this.signature,
      },
      callback
    );
  },

  lookup: function(search, callback) {
    /**
     * lookup reaction by activity id, user id or foreign id
     * @method lookup
     * @memberof StreamReaction.prototype
     * @param  {object}   search Reaction Id {activity_id|user_id|foreign_id:string, kinds:[string]}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.lookup({by:"activity_id", value:"0c7db91c-67f9-11e8-bcd9-fe00a9219401", kinds:["like"]})
     * @example reactions.lookup({by:"user_id", value:"john"}, kinds:["like", "comment"]})
     * @example reactions.lookup({by:"foreign_id", value:"fid"}, kinds:["comment"]})
     */

    switch (search.by) {
      case 'activity_id':
      case 'user_id':
      case 'foreign_id':
        break;
      default:
        throw new errors.SiteError(
          'search.by is required and must be equal to activity_id, user_id or foreign_id'
        );
    }
    if (!search.value) {
      throw new errors.SiteError('Missing search.value');
    }
    if (!search.kinds) {
      throw new errors.SiteError('Missing search.kinds');
    }
    return this.client.get(
      {
        url: this.build('by', search.by, search.value, search.kinds),
        signature: this.signature,
      },
      callback
    );
  },

  update: function(id, { data, targetFeeds }, callback) {
    /**
     * update reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {object}   data  Data associated to reaction
     * @param  {array}   targetFeeds  Optional feeds to post the activity to. If you sent this before and don't set it here it will be removed.
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "like")
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "comment", {"text": "love it!"},)
     */
    targetFeeds = this._convertTargetFeeds(targetFeeds);
    var body = {
      data: data,
      target_feeds: targetFeeds,
    };
    return this.client.put(
      {
        url: this.buildURL(id),
        body: body,
        signature: this.signature,
      },
      callback
    );
  },

  delete: function(id, callback) {
    /**
     * delete reaction
     * @method delete
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    return this.client.delete(
      {
        url: this.buildURL(id),
        signature: this.signature,
      },
      callback
    );
  },
};

module.exports = StreamReaction;
