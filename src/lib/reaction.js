import errors from './errors';

export default class StreamReaction {
  constructor(client, token) {
    /**
     * Initialize a reaction object
     * @method constructor
     * @memberof StreamReaction.prototype
     * @param {StreamClient} client Stream client this feed is constructed from
     * @param {string} token JWT token
     * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.token = token;
    this.signature = token;
  }

  buildURL = (...args) => {
    return `${['reaction', ...args].join('/')}/`;
  };

  all(options, callback) {
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
  }

  _convertTargetFeeds = (targetFeeds = []) => {
    return targetFeeds.map((elem) => (typeof elem === 'string' ? elem : elem.id));
  };

  add(kind, activity, data = {}, { id, targetFeeds = [], userId, targetFeedsExtraData } = {}, callback) {
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
    const body = {
      id,
      activity_id: activity,
      kind,
      data,
      target_feeds: targetFeeds,
      user_id: userId,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.post(
      {
        url: this.buildURL(),
        body,
        signature: this.signature,
      },
      callback,
    );
  }

  addChild(kind, reaction, data = {}, { targetFeeds = [], userId, targetFeedsExtraData } = {}, callback) {
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
    const body = {
      parent: reaction,
      kind,
      data,
      target_feeds: targetFeeds,
      user_id: userId,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.post(
      {
        url: this.buildURL(),
        body,
        signature: this.signature,
      },
      callback,
    );
  }

  get(id, callback) {
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
  }

  filter(conditions, callback) {
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

    const { user_id, activity_id, reaction_id, ...qs } = conditions;
    if (!qs.limit) {
      qs.limit = 10;
    }

    if ((user_id ? 1 : 0) + (activity_id ? 1 : 0) + (reaction_id ? 1 : 0) !== 1) {
      throw new errors.SiteError(
        'Must provide exactly one value for one of these params: user_id, activity_id, reaction_id',
      );
    }

    const lookupType = (user_id && 'user_id') || (activity_id && 'activity_id') || (reaction_id && 'reaction_id');
    const value = user_id || activity_id || reaction_id;

    const url = conditions.kind ? this.buildURL(lookupType, value, conditions.kind) : this.buildURL(lookupType, value);

    return this.client.get(
      {
        url,
        qs,
        signature: this.signature,
      },
      callback,
    );
  }

  update(id, data, { targetFeeds = [], targetFeedsExtraData } = {}, callback) {
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
    const body = {
      data,
      target_feeds: targetFeeds,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.put(
      {
        url: this.buildURL(id),
        body,
        signature: this.signature,
      },
      callback,
    );
  }

  delete(id, callback) {
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
  }
}
