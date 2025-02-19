import { StreamClient, APIResponse, DefaultGenerics } from './client';
import utils from './utils';
import { StreamUser } from './user';

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
 * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-activity-add
 * @method addToMany
 * @memberof StreamClient.prototype
 * @since 2.3.0
 * @param {ActivityType}  activity The activity to add
 * @param {string[]}  feeds    Array of feed id in form of `${feedSlug}:${feedId}`
 * @return {Promise<APIResponse>}
 */
function addToMany<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics>(
  this: StreamClient,
  activity: StreamFeedGenerics['activityType'],
  feeds: string[],
) {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'feed/add_to_many/',
    body: {
      activity: utils.replaceStreamObjects(activity),
      feeds,
    },
    token: this.getOrCreateToken(),
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
function followMany(this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) {
  this._throwMissingApiSecret();

  const qs: { activity_copy_limit?: number } = {};
  if (typeof activityCopyLimit === 'number') qs.activity_copy_limit = activityCopyLimit;

  return this.post<APIResponse>({
    url: 'follow_many/',
    body: follows,
    qs,
    token: this.getOrCreateToken(),
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
function unfollowMany(this: StreamClient, unfollows: UnfollowRelation[]) {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'unfollow_many/',
    body: unfollows,
    token: this.getOrCreateToken(),
  });
}
export type AddUsersResponse = APIResponse & {
  created_users: StreamUser[];
};

export type GetUsersResponse = APIResponse & {
  users: StreamUser[];
};

function addUsers(this: StreamClient, users: StreamUser[], overrideExisting: boolean = false) {
  return this.post<AddUsersResponse>({
    url: 'users/',
    body: {
      users,
      override: overrideExisting,
    },
    token: this.getOrCreateToken(),
  });
}

function getUsers(this: StreamClient, ids: string[]) {
  return this.get<GetUsersResponse>({
    url: 'users/',
    qs: { ids: ids.join(',') },
    token: this.getOrCreateToken(),
  });
}
function deleteUsers(this: StreamClient, ids: string[]) {
  return this.delete<string[]>({
    url: 'users/',
    qs: { ids: ids.join(',') },
    token: this.getOrCreateToken(),
  });
}

export default {
  addToMany,
  followMany,
  unfollowMany,
  addUsers,
  getUsers,
  deleteUsers,
};
