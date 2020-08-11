import { StreamClient, APIResponse, UnknownRecord } from './client';
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

function addToMany<ActivityType extends UnknownRecord = UnknownRecord>(
  this: StreamClient,
  activity: ActivityType,
  feeds: string[],
) {
  /**
   * Add one activity to many feeds
   * @method addToMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param {ActivityType}  activity The activity to add
   * @param {string[]}  feeds    Array of feed id in form of `${feedSlug}:${feedId}`
   * @return {Promise<APIResponse>}
   */
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

function followMany(this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) {
  /**
   * Follow multiple feeds with one API call
   * @method followMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param {FollowRelation[]} follows  The follow relations to create: [{ source: string; target: string }]
   * @param {number}  [activityCopyLimit] How many activities should be copied from the target feed
   * @return {Promise<APIResponse>}
   */
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

function unfollowMany(this: StreamClient, unfollows: UnfollowRelation[]) {
  /**
   * Unfollow multiple feeds with one API call
   * @method unfollowMany
   * @memberof StreamClient.prototype
   * @since 3.15.0
   * @param {UnfollowRelation[]}  unfollows The follow relations to remove: [{ source: string; target: string }]
   * @return {Promise<APIResponse>}
   */
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
