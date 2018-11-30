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
      callback,
    );
  },

  _convertTargetFeeds: function(targetFeeds = []) {
    return targetFeeds.map(
      (elem) => (typeof elem === 'string' ? elem : elem.id),
    );
  },

  add: function(
    kind,
    activity,
    data = {},
    { targetFeeds = [], userId } = {},
    callback,
  ) {
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
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
    if (activity instanceof Object) {
      activity = activity.id;
    }
    targetFeeds = this._convertTargetFeeds(targetFeeds);
    var body = {
      activity_id: activity,
      kind: kind,
      data: data,
      target_feeds: targetFeeds,
      user_id: userId,
    };
    return this.client.post(
      {
        url: this.buildURL(),
        body: body,
        signature: this.signature,
      },
      callback,
    );
  },

  addChild: function(
    kind,
    reaction,
    data = {},
    { targetFeeds = [], userId } = {},
    callback,
  ) {
    /**
     * add reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   reaction Reaction or a ReactionID
     * @param  {object}   data  data related to reaction
     * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
    if (reaction instanceof Object) {
      reaction = reaction.id;
    }
    targetFeeds = this._convertTargetFeeds(targetFeeds);
    var body = {
      parent: reaction,
      kind: kind,
      data: data,
      target_feeds: targetFeeds,
      user_id: userId,
    };
    return this.client.post(
      {
        url: this.buildURL(),
        body: body,
        signature: this.signature,
      },
      callback,
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
      callback,
    );
  },

  filter: function(conditions, callback) {
    /**
     * retrieve reactions by activity_id, user_id or reaction_id (to paginate children reactions), pagination can be done using id_lt, id_lte, id_gt and id_gte parameters
     * id_lt and id_lte return reactions order by creation descending starting from the reaction with the ID provided, when id_lte is used
     * the reaction with ID equal to the value provided is included.
     * id_gt and id_gte return reactions order by creation ascending (oldest to newest) starting from the reaction with the ID provided, when id_gte is used
     * the reaction with ID equal to the value provided is included.
     * results are limited to 25 at most and are ordered newest to oldest by default.
     * @method lookup
     * @memberof StreamReaction.prototype
     * @param  {object}   conditions Reaction Id {activity_id|user_id|foreign_id:string, kind:string, next:string, previous:string, limit:integer}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example reactions.lookup({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
     * @example reactions.lookup({user_id: "john", kinds:"like"})
     */

    let { user_id, activity_id, reaction_id, ...qs } = conditions;
    if (!qs.limit) {
      qs.limit = 10;
    }

    if ((user_id ? 1 : 0 + activity_id ? 1 : 0 + reaction_id ? 1 : 0) != 1) {
      throw new errors.SiteError(
        'Must provide exactly one value for one of these params: user_id, activity_id, reaction_id',
      );
    }

    let lookupType =
      (user_id && 'user_id') ||
      (activity_id && 'activity_id') ||
      (reaction_id && 'reaction_id');
    let value = user_id || activity_id || reaction_id;

    let url = this.buildURL(lookupType, value);

    if (conditions.kind) {
      url = this.buildURL(lookupType, value, conditions.kind);
    }

    return this.client.get(
      {
        url: url,
        qs: qs,
        signature: this.signature,
      },
      callback,
    );
  },

  update: function(id, data, { targetFeeds = [] } = {}, callback) {
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
      callback,
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
      callback,
    );
  },
};

module.exports = StreamReaction;
