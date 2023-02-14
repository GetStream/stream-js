"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamReaction = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _errors = require("./errors");

var _excluded = ["user_id", "activity_id", "reaction_id"];

var StreamReaction = /*#__PURE__*/function () {
  /**
   * Initialize a reaction object
   * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js
   * @method constructor
   * @memberof StreamReaction.prototype
   * @param {StreamClient} client Stream client this feed is constructed from
   * @param {string} token JWT token
   * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
   */
  function StreamReaction(client, token) {
    (0, _classCallCheck2.default)(this, StreamReaction);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "token", void 0);
    (0, _defineProperty2.default)(this, "buildURL", function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return "".concat(['reaction'].concat(args).join('/'), "/");
    });
    (0, _defineProperty2.default)(this, "_convertTargetFeeds", function () {
      var targetFeeds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return targetFeeds.map(function (elem) {
        return typeof elem === 'string' ? elem : elem.id;
      });
    });
    this.client = client;
    this.token = token;
  }

  (0, _createClass2.default)(StreamReaction, [{
    key: "add",
    value:
    /**
     * add reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#adding-reactions
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   activity Activity or an ActivityID
     * @param  {ReactionType}   data  data related to reaction
     * @param  {ReactionAddOptions} [options]
     * @param  {string} [options.id] id associated with reaction
     * @param  {string[]} [options.targetFeeds] an array of feeds to which to send an activity with the reaction
     * @param  {string} [options.userId] useful for adding reaction with server token
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ReactionType>>}
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
    function add(kind, activity, data) {
      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          id = _ref.id,
          _ref$targetFeeds = _ref.targetFeeds,
          targetFeeds = _ref$targetFeeds === void 0 ? [] : _ref$targetFeeds,
          userId = _ref.userId,
          targetFeedsExtraData = _ref.targetFeedsExtraData;

      var body = {
        id: id,
        activity_id: activity instanceof Object ? activity.id : activity,
        kind: kind,
        data: data || {},
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };

      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }

      return this.client.post({
        url: this.buildURL(),
        body: body,
        token: this.token
      });
    }
    /**
     * add child reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_add_child/?language=js
     * @method addChild
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   reaction Reaction or a ReactionID
     * @param  {ChildReactionType}   data  data related to reaction
     * @param  {ReactionAddChildOptions} [options]
     * @param  {string[]} [options.targetFeeds] an array of feeds to which to send an activity with the reaction
     * @param  {string} [options.userId] useful for adding reaction with server token
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ChildReactionType>>}
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */

  }, {
    key: "addChild",
    value: function addChild(kind, reaction, data) {
      var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          _ref2$targetFeeds = _ref2.targetFeeds,
          targetFeeds = _ref2$targetFeeds === void 0 ? [] : _ref2$targetFeeds,
          userId = _ref2.userId,
          targetFeedsExtraData = _ref2.targetFeedsExtraData;

      var body = {
        parent: reaction instanceof Object ? reaction.id : reaction,
        kind: kind,
        data: data || {},
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };

      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }

      return this.client.post({
        url: this.buildURL(),
        body: body,
        token: this.token
      });
    }
    /**
     * get reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
     * @method get
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<EnrichedReactionAPIResponse<StreamFeedGenerics>>}
     * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */

  }, {
    key: "get",
    value: function get(id) {
      return this.client.get({
        url: this.buildURL(id),
        token: this.token
      });
    }
    /**
     * retrieve reactions by activity_id, user_id or reaction_id (to paginate children reactions), pagination can be done using id_lt, id_lte, id_gt and id_gte parameters
     * id_lt and id_lte return reactions order by creation descending starting from the reaction with the ID provided, when id_lte is used
     * the reaction with ID equal to the value provided is included.
     * id_gt and id_gte return reactions order by creation ascending (oldest to newest) starting from the reaction with the ID provided, when id_gte is used
     * the reaction with ID equal to the value provided is included.
     * results are limited to 25 at most and are ordered newest to oldest by default.
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
     * @method filter
     * @memberof StreamReaction.prototype
     * @param  {ReactionFilterConditions} conditions Reaction Id {activity_id|user_id|reaction_id:string, kind:string, limit:integer}
     * @return {Promise<ReactionFilterAPIResponse<StreamFeedGenerics>>}
     * @example reactions.filter({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
     * @example reactions.filter({user_id: "john", kinds:"like"})
     */

  }, {
    key: "filter",
    value: function filter(conditions) {
      var userId = conditions.user_id,
          activityId = conditions.activity_id,
          reactionId = conditions.reaction_id,
          qs = (0, _objectWithoutProperties2.default)(conditions, _excluded);

      if (!qs.limit) {
        qs.limit = 10;
      }

      if ((userId ? 1 : 0) + (activityId ? 1 : 0) + (reactionId ? 1 : 0) !== 1) {
        throw new _errors.SiteError('Must provide exactly one value for one of these params: user_id, activity_id, reaction_id');
      }

      var lookupType = userId && 'user_id' || activityId && 'activity_id' || reactionId && 'reaction_id';
      var value = userId || activityId || reactionId;
      var url = conditions.kind ? this.buildURL(lookupType, value, conditions.kind) : this.buildURL(lookupType, value);
      return this.client.get({
        url: url,
        qs: qs,
        token: this.token
      });
    }
    /**
     * update reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#updating-reactions
     * @method update
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {ReactionType | ChildReactionType}   data  Data associated to reaction or childReaction
     * @param  {ReactionUpdateOptions} [options]
     * @param  {string[]} [options.targetFeeds] Optional feeds to post the activity to. If you sent this before and don't set it here it will be removed.
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ReactionType | ChildReactionType>>}
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "like")
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "comment", {"text": "love it!"},)
     */

  }, {
    key: "update",
    value: function update(id, data) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$targetFeeds = _ref3.targetFeeds,
          targetFeeds = _ref3$targetFeeds === void 0 ? [] : _ref3$targetFeeds,
          targetFeedsExtraData = _ref3.targetFeedsExtraData;

      var body = {
        data: data,
        target_feeds: this._convertTargetFeeds(targetFeeds)
      };

      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }

      return this.client.put({
        url: this.buildURL(id),
        body: body,
        token: this.token
      });
    }
    /**
     * delete reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#removing-reactions
     * @method delete
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<APIResponse>}
     * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */

  }, {
    key: "delete",
    value: function _delete(id) {
      return this.client.delete({
        url: this.buildURL(id),
        token: this.token
      });
    }
  }]);
  return StreamReaction;
}();

exports.StreamReaction = StreamReaction;