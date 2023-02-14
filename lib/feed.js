"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamFeed = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _user = require("./user");

var _errors = require("./errors");

var _utils = _interopRequireDefault(require("./utils"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Manage api calls for specific feeds
 * The feed object contains convenience functions such add activity, remove activity etc
 * @class StreamFeed
 */
var StreamFeed = /*#__PURE__*/function () {
  /**
   * Initialize a feed object
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js
   * @method constructor
   * @memberof StreamFeed.prototype
   * @param {StreamClient} client - The stream client this feed is constructed from
   * @param {string} feedSlug - The feed slug
   * @param {string} userId - The user id
   * @param {string} [token] - The authentication token
   */
  function StreamFeed(client, feedSlug, userId, token) {
    (0, _classCallCheck2.default)(this, StreamFeed);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "token", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "slug", void 0);
    (0, _defineProperty2.default)(this, "userId", void 0);
    (0, _defineProperty2.default)(this, "feedUrl", void 0);
    (0, _defineProperty2.default)(this, "feedTogether", void 0);
    (0, _defineProperty2.default)(this, "notificationChannel", void 0);

    if (!feedSlug || !userId) {
      throw new _errors.FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
    }

    if (feedSlug.indexOf(':') !== -1) {
      throw new _errors.FeedError('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
    }

    _utils.default.validateFeedSlug(feedSlug);

    _utils.default.validateUserId(userId); // raise an error if there is no token


    if (!token) {
      throw new _errors.FeedError('Missing token, in client side mode please provide a feed secret');
    }

    this.client = client;
    this.slug = feedSlug;
    this.userId = userId;
    this.id = "".concat(this.slug, ":").concat(this.userId);
    this.token = token;
    this.feedUrl = this.id.replace(':', '/');
    this.feedTogether = this.id.replace(':', ''); // faye setup

    this.notificationChannel = "site-".concat(this.client.appId, "-feed-").concat(this.feedTogether);
  }
  /**
   * Adds the given activity to the feed
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#adding-activities-basic
   * @method addActivity
   * @memberof StreamFeed.prototype
   * @param {NewActivity<StreamFeedGenerics>} activity - The activity to add
   * @return {Promise<Activity<StreamFeedGenerics>>}
   */


  (0, _createClass2.default)(StreamFeed, [{
    key: "addActivity",
    value: function addActivity(activity) {
      activity = _utils.default.replaceStreamObjects(activity);

      if (!activity.actor && this.client.currentUser) {
        activity.actor = this.client.currentUser.ref();
      }

      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: activity,
        token: this.token
      });
    }
    /**
     * Removes the activity by activityId or foreignId
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#removing-activities
     * @method removeActivity
     * @memberof StreamFeed.prototype
     * @param  {string} activityOrActivityId Identifier of activity to remove
     * @return {Promise<APIResponse & { removed: string }>}
     * @example feed.removeActivity(activityId);
     * @example feed.removeActivity({'foreign_id': foreignId});
     */

  }, {
    key: "removeActivity",
    value: function removeActivity(activityOrActivityId) {
      var foreign_id = activityOrActivityId.foreignId || activityOrActivityId.foreign_id;
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/").concat(foreign_id || activityOrActivityId, "/"),
        qs: foreign_id ? {
          foreign_id: '1'
        } : {},
        token: this.token
      });
    }
    /**
     * Adds the given activities to the feed
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-add-activities
     * @method addActivities
     * @memberof StreamFeed.prototype
     * @param  {NewActivity<StreamFeedGenerics>[]}   activities Array of activities to add
     * @return {Promise<Activity<StreamFeedGenerics>[]>}
     */

  }, {
    key: "addActivities",
    value: function addActivities(activities) {
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: {
          activities: _utils.default.replaceStreamObjects(activities)
        },
        token: this.token
      });
    }
    /**
     * Follows the given target feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js
     * @method follow
     * @memberof StreamFeed.prototype
     * @param  {string}   targetSlug   Slug of the target feed
     * @param  {string}   targetUserId User identifier of the target feed
     * @param  {object}   [options]      Additional options
     * @param  {number}   [options.limit] Limit the amount of activities copied over on follow
     * @return {Promise<APIResponse>}
     * @example feed.follow('user', '1');
     * @example feed.follow('user', '1');
     * @example feed.follow('user', '1', options);
     */

  }, {
    key: "follow",
    value: function follow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (targetUserId instanceof _user.StreamUser) {
        targetUserId = targetUserId.id;
      }

      _utils.default.validateFeedSlug(targetSlug);

      _utils.default.validateUserId(targetUserId);

      var body = {
        target: "".concat(targetSlug, ":").concat(targetUserId)
      };
      if (typeof options.limit === 'number') body.activity_copy_limit = options.limit;
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/following/"),
        body: body,
        token: this.token
      });
    }
    /**
     * Unfollow the given feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#unfollowing-feeds
     * @method unfollow
     * @memberof StreamFeed.prototype
     * @param  {string}   targetSlug   Slug of the target feed
     * @param  {string}   targetUserId User identifier of the target feed
     * @param  {object} [options]
     * @param  {boolean} [options.keepHistory] when provided the activities from target
     *                                                 feed will not be kept in the feed
     * @return {Promise<APIResponse>}
     * @example feed.unfollow('user', '2');
     */

  }, {
    key: "unfollow",
    value: function unfollow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var qs = {};
      if (typeof options.keepHistory === 'boolean' && options.keepHistory) qs.keep_history = '1';

      _utils.default.validateFeedSlug(targetSlug);

      _utils.default.validateUserId(targetUserId);

      var targetFeedId = "".concat(targetSlug, ":").concat(targetUserId);
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/following/").concat(targetFeedId, "/"),
        qs: qs,
        token: this.token
      });
    }
    /**
     * List which feeds this feed is following
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-followed-feeds
     * @method following
     * @memberof StreamFeed.prototype
     * @param  {GetFollowOptions}   [options]  Additional options
     * @param  {string[]}   options.filter array of feed id to filter on
     * @param  {number}   options.limit pagination
     * @param  {number}   options.offset pagination
     * @return {Promise<GetFollowAPIResponse>}
     * @example feed.following({limit:10, filter: ['user:1', 'user:2']});
     */

  }, {
    key: "following",
    value: function following() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};
      if (options.filter) extraOptions.filter = options.filter.join(',');
      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/following/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }
    /**
     * List the followers of this feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-feed-followers
     * @method followers
     * @memberof StreamFeed.prototype
     * @param  {GetFollowOptions}   [options]  Additional options
     * @param  {string[]}   options.filter array of feed id to filter on
     * @param  {number}   options.limit pagination
     * @param  {number}   options.offset pagination
     * @return {Promise<GetFollowAPIResponse>}
     * @example feed.followers({limit:10, filter: ['user:1', 'user:2']});
     */

  }, {
    key: "followers",
    value: function followers() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};
      if (options.filter) extraOptions.filter = options.filter.join(',');
      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/followers/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }
    /**
     *  Retrieve the number of follower and following feed stats of the current feed.
     *  For each count, feed slugs can be provided to filter counts accordingly.
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-follow-stats
     * @method followStats
     * @param  {object}   [options]
     * @param  {string[]} [options.followerSlugs] find counts only on these slugs
     * @param  {string[]} [options.followingSlugs] find counts only on these slugs
     * @return {Promise<FollowStatsAPIResponse>}
     * @example feed.followStats();
     * @example feed.followStats({ followerSlugs:['user', 'news'], followingSlugs:['timeline'] });
     */

  }, {
    key: "followStats",
    value: function followStats() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var qs = {
        followers: this.id,
        following: this.id
      };
      if (options.followerSlugs && options.followerSlugs.length) qs.followers_slugs = options.followerSlugs.join(',');
      if (options.followingSlugs && options.followingSlugs.length) qs.following_slugs = options.followingSlugs.join(',');
      return this.client.get({
        url: 'stats/follow/',
        qs: qs,
        token: this.client.getOrCreateToken() || this.token
      });
    }
    /**
     * Reads the feed
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#retrieving-activities
     * @method get
     * @memberof StreamFeed.prototype
     * @param {GetFeedOptions} options  Additional options
     * @return {Promise<FeedAPIResponse>}
     * @example feed.get({limit: 10, id_lte: 'activity-id'})
     * @example feed.get({limit: 10, mark_seen: true})
     */

  }, {
    key: "get",
    value: function get() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};

      if (options.mark_read && options.mark_read.join) {
        extraOptions.mark_read = options.mark_read.join(',');
      }

      if (options.mark_seen && options.mark_seen.join) {
        extraOptions.mark_seen = options.mark_seen.join(',');
      }

      this.client.replaceReactionOptions(options);
      var path = this.client.shouldUseEnrichEndpoint(options) ? 'enrich/feed/' : 'feed/';
      return this.client.get({
        url: "".concat(path).concat(this.feedUrl, "/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }
    /**
     * Retrieves one activity from a feed and adds enrichment
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#retrieving-activities
     * @method getActivityDetail
     * @memberof StreamFeed.prototype
     * @param  {string}   activityId Identifier of activity to retrieve
     * @param  {EnrichOptions}   options  Additional options
     * @return {Promise<FeedAPIResponse>}
     * @example feed.getActivityDetail(activityId)
     * @example feed.getActivityDetail(activityId, {withRecentReactions: true})
     * @example feed.getActivityDetail(activityId, {withReactionCounts: true})
     * @example feed.getActivityDetail(activityId, {withOwnReactions: true, withReactionCounts: true})
     */

  }, {
    key: "getActivityDetail",
    value: function getActivityDetail(activityId, options) {
      return this.get(_objectSpread({
        id_lte: activityId,
        id_gte: activityId,
        limit: 1
      }, options || {}));
    }
    /**
     * Returns the current faye client object
     * @method getFayeClient
     * @memberof StreamFeed.prototype
     * @access private
     * @return {Faye.Client} Faye client
     */

  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      return this.client.getFayeClient();
    }
    /**
     * Subscribes to any changes in the feed, return a promise
     * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
     * @method subscribe
     * @memberof StreamFeed.prototype
     * @param  {function} Faye.Callback<RealTimeMessage<StreamFeedGenerics>> Callback to call on completion
     * @return {Promise<Faye.Subscription>}
     * @example
     * feed.subscribe(callback).then(function(){
     * 		console.log('we are now listening to changes');
     * });
     */

  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      if (!this.client.appId) {
        throw new _errors.SiteError('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
      }

      var subscription = this.getFayeClient().subscribe("/".concat(this.notificationChannel), callback);
      this.client.subscriptions["/".concat(this.notificationChannel)] = {
        token: this.token,
        userId: this.notificationChannel,
        fayeSubscription: subscription
      };
      return subscription;
    }
    /**
     * Cancel updates created via feed.subscribe()
     * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
     * @return void
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      var streamSubscription = this.client.subscriptions["/".concat(this.notificationChannel)];

      if (streamSubscription) {
        delete this.client.subscriptions["/".concat(this.notificationChannel)];
        streamSubscription.fayeSubscription.cancel();
      }
    }
  }, {
    key: "_validateToTargetInput",
    value: function _validateToTargetInput(foreignId, time, newTargets, addedTargets, removedTargets) {
      if (!foreignId) throw new Error('Missing `foreign_id` parameter!');
      if (!time) throw new Error('Missing `time` parameter!');

      if (!newTargets && !addedTargets && !removedTargets) {
        throw new Error('Requires you to provide at least one parameter for `newTargets`, `addedTargets`, or `removedTargets` - example: `updateActivityToTargets("foreignID:1234", new Date(), [newTargets...], [addedTargets...], [removedTargets...])`');
      }

      if (newTargets) {
        if (addedTargets || removedTargets) {
          throw new Error("Can't include add_targets or removedTargets if you're also including newTargets");
        }
      }

      if (addedTargets && removedTargets) {
        // brute force - iterate through added, check to see if removed contains that element
        addedTargets.forEach(function (addedTarget) {
          if (removedTargets.includes(addedTarget)) {
            throw new Error("Can't have the same feed ID in addedTargets and removedTargets.");
          }
        });
      }
    }
    /**
     * Updates an activity's "to" fields
     * @link https://getstream.io/activity-feeds/docs/node/targeting/?language=js
     * @param {string} foreignId The foreign_id of the activity to update
     * @param {string} time The time of the activity to update
     * @param {string[]} newTargets Set the new "to" targets for the activity - will remove old targets
     * @param {string[]} addedTargets Add these new targets to the activity
     * @param {string[]} removedTargets Remove these targets from the activity
     */

  }, {
    key: "updateActivityToTargets",
    value: function updateActivityToTargets(foreignId, time, newTargets, addedTargets, removedTargets) {
      return this._updateActivityToTargetsMany([{
        foreignId: foreignId,
        time: time,
        newTargets: newTargets,
        addedTargets: addedTargets,
        removedTargets: removedTargets
      }]);
    } // NOTE: it can change without notice

  }, {
    key: "_updateActivityToTargetsMany",
    value: function _updateActivityToTargetsMany(inputs) {
      if (!inputs || inputs.length === 0) {
        throw new Error('At least one input is required');
      }

      var body = [];

      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        this._validateToTargetInput(input.foreignId, input.time, input.newTargets, input.addedTargets, input.removedTargets);

        var item = {
          foreign_id: input.foreignId,
          time: input.time
        };
        if (input.newTargets) item.new_targets = input.newTargets;
        if (input.addedTargets) item.added_targets = input.addedTargets;
        if (input.removedTargets) item.removed_targets = input.removedTargets;
        body.push(item);
      }

      return this.client.post({
        url: "feed_targets/".concat(this.feedUrl, "/activity_to_targets/"),
        token: this.token,
        body: body.length > 1 ? body : body[0]
      });
    }
  }]);
  return StreamFeed;
}();

exports.StreamFeed = StreamFeed;