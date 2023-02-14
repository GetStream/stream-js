import { StreamClient, APIResponse, DefaultGenerics } from './client';
declare type BaseFollowRelation = {
    source: string;
    target: string;
};
export declare type FollowRelation = BaseFollowRelation & {
    activity_copy_limit?: number;
};
export declare type UnfollowRelation = BaseFollowRelation & {
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
declare function addToMany<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics>(this: StreamClient, activity: StreamFeedGenerics['activityType'], feeds: string[]): Promise<APIResponse>;
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
declare function followMany(this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number): Promise<APIResponse>;
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
declare function unfollowMany(this: StreamClient, unfollows: UnfollowRelation[]): Promise<APIResponse>;
declare const _default: {
    addToMany: typeof addToMany;
    followMany: typeof followMany;
    unfollowMany: typeof unfollowMany;
};
export default _default;
//# sourceMappingURL=batch_operations.d.ts.map