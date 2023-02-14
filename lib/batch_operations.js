"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("./utils"));

/**
 * Add one activity to many feeds
 * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-activity-add
 * @method addToMany
 * @memberof StreamClient.prototype
 * @since 2.3.0
 * @param {ActivityType}  activity The activity to add
 * @param {string[]}  feeds    Array of feed id in form of `${feedSlug}:${feedId}`
 * @return {Promise<APIResponse>}
 */
function addToMany(activity, feeds) {
  this._throwMissingApiSecret();

  return this.post({
    url: 'feed/add_to_many/',
    body: {
      activity: _utils.default.replaceStreamObjects(activity),
      feeds: feeds
    },
    token: this.getOrCreateToken()
  });
}
/**
 * Follow multiple feeds with one API call
 * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-follow
 * @method followMany
 * @memberof StreamClient.prototype
 * @since 2.3.0
 * @param {FollowRelation[]} follows  The follow relations to create: [{ source: string; target: string }]
 * @param {number}  [activityCopyLimit] How many activities should be copied from the target feed
 * @return {Promise<APIResponse>}
 */


function followMany(follows, activityCopyLimit) {
  this._throwMissingApiSecret();

  var qs = {};
  if (typeof activityCopyLimit === 'number') qs.activity_copy_limit = activityCopyLimit;
  return this.post({
    url: 'follow_many/',
    body: follows,
    qs: qs,
    token: this.getOrCreateToken()
  });
}
/**
 * Unfollow multiple feeds with one API call
 * This feature is usually restricted, please contact support if you face an issue
 * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-unfollow
 * @method unfollowMany
 * @memberof StreamClient.prototype
 * @since 3.15.0
 * @param {UnfollowRelation[]}  unfollows The follow relations to remove: [{ source: string; target: string }]
 * @return {Promise<APIResponse>}
 */


function unfollowMany(unfollows) {
  this._throwMissingApiSecret();

  return this.post({
    url: 'unfollow_many/',
    body: unfollows,
    token: this.getOrCreateToken()
  });
}

var _default = {
  addToMany: addToMany,
  followMany: followMany,
  unfollowMany: unfollowMany
};
exports.default = _default;