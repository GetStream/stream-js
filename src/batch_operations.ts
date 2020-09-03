import { StreamClient, APIResponse } from './client';
import utils from './utils';

type BaseFollowRelation = {
  source: string;
  target: string;
};

export type FollowRelation = BaseFollowRelation & {
  activity_copy_limit?: number;
};

export type UnfollowRelation = BaseFollowRelation & {
  keep_history?: boolean;
};

/**
 * Add one activity to many feeds
 * @method addToMany
 * @memberof StreamClient.prototype
 * @since 2.3.0
 * @param {ActivityType}  activity The activity to add
 * @param {string[]}  feeds    Array of feed id in form of `${feedSlug}:${feedId}`
 * @return {Promise<APIResponse>}
 */
function addToMany<ActivityType>(this: StreamClient, activity: ActivityType, feeds: string[]) {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'feed/add_to_many/',
    body: {
      activity: utils.replaceStreamObjects(activity),
      feeds,
    },
    signature: this.getOrCreateToken(),
  });
}

/**
 * Follow multiple feeds with one API call
 * @method followMany
 * @memberof StreamClient.prototype
 * @since 2.3.0
 * @param {FollowRelation[]} follows  The follow relations to create: [{ source: string; target: string }]
 * @param {number}  [activityCopyLimit] How many activities should be copied from the target feed
 * @return {Promise<APIResponse>}
 */
function followMany(this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) {
  this._throwMissingApiSecret();

  const qs: { activity_copy_limit?: number } = {};
  if (typeof activityCopyLimit === 'number') qs.activity_copy_limit = activityCopyLimit;

  return this.post<APIResponse>({
    url: 'follow_many/',
    body: follows,
    qs,
    signature: this.getOrCreateToken(),
  });
}

/**
 * Unfollow multiple feeds with one API call
 * @method unfollowMany
 * @memberof StreamClient.prototype
 * @since 3.15.0
 * @param {UnfollowRelation[]}  unfollows The follow relations to remove: [{ source: string; target: string }]
 * @return {Promise<APIResponse>}
 */
function unfollowMany(this: StreamClient, unfollows: UnfollowRelation[]) {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'unfollow_many/',
    body: unfollows,
    signature: this.getOrCreateToken(),
  });
}

export default {
  addToMany,
  followMany,
  unfollowMany,
};
