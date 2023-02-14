/// <reference path="../types/modules.d.ts" />
import * as Faye from 'faye';
import { StreamClient, APIResponse, UR, RealTimeMessage, DefaultGenerics } from './client';
import { StreamUser, EnrichedUser } from './user';
import { EnrichedReaction } from './reaction';
import { CollectionResponse } from './collections';
export declare type FollowStatsOptions = {
    followerSlugs?: string[];
    followingSlugs?: string[];
};
export declare type EnrichOptions = {
    enrich?: boolean;
    ownReactions?: boolean;
    reactionKindsFilter?: string;
    recentReactionsLimit?: number;
    withOwnChildren?: boolean;
    withOwnReactions?: boolean;
    withReactionCounts?: boolean;
    withRecentReactions?: boolean;
};
export declare type FeedPaginationOptions = {
    id_gt?: string;
    id_gte?: string;
    id_lt?: string;
    id_lte?: string;
    limit?: number;
};
export declare type RankedFeedOptions = {
    offset?: number;
    ranking?: string;
    session?: string;
};
export declare type NotificationFeedOptions = {
    mark_read?: boolean | 'current' | string[];
    mark_seen?: boolean | 'current' | string[];
};
export declare type FeedContextOptions = {
    user_id?: string;
};
export declare type GetFeedOptions = FeedPaginationOptions & EnrichOptions & RankedFeedOptions & NotificationFeedOptions & FeedContextOptions;
export declare type GetFollowOptions = {
    filter?: string[];
    limit?: number;
    offset?: number;
};
export declare type GetFollowAPIResponse = APIResponse & {
    results: {
        created_at: string;
        feed_id: string;
        target_id: string;
        updated_at: string;
    }[];
};
export declare type FollowStatsAPIResponse = APIResponse & {
    results: {
        followers: {
            count: number;
            feed: string;
        };
        following: {
            count: number;
            feed: string;
        };
    };
};
declare type BaseActivity = {
    verb: string;
    target?: string;
    to?: string[];
};
export declare type NewActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = StreamFeedGenerics['activityType'] & BaseActivity & {
    actor: string | StreamUser;
    object: string | unknown;
    foreign_id?: string;
    time?: string;
};
export declare type UpdateActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = StreamFeedGenerics['activityType'] & BaseActivity & {
    actor: string;
    foreign_id: string;
    object: string | unknown;
    time: string;
};
export declare type Activity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = StreamFeedGenerics['activityType'] & BaseActivity & {
    actor: string;
    foreign_id: string;
    id: string;
    object: string | unknown;
    time: string;
    analytics?: Record<string, number>;
    extra_context?: UR;
    origin?: string;
    score?: number;
};
export declare type ReactionsRecords<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = Record<string, EnrichedReaction<StreamFeedGenerics>[]>;
export declare type EnrichedActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = StreamFeedGenerics['activityType'] & BaseActivity & Pick<Activity, 'foreign_id' | 'id' | 'time' | 'analytics' | 'extra_context' | 'origin' | 'score'> & {
    actor: EnrichedUser<StreamFeedGenerics> | string;
    object: string | unknown | EnrichedActivity<StreamFeedGenerics> | EnrichedReaction<StreamFeedGenerics> | CollectionResponse<StreamFeedGenerics>;
    latest_reactions?: ReactionsRecords<StreamFeedGenerics>;
    latest_reactions_extra?: Record<string, {
        next?: string;
    }>;
    own_reactions?: ReactionsRecords<StreamFeedGenerics>;
    own_reactions_extra?: Record<string, {
        next?: string;
    }>;
    reaction?: EnrichedReaction<StreamFeedGenerics>;
    reaction_counts?: Record<string, number>;
};
export declare type FlatActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = Activity<StreamFeedGenerics>;
export declare type FlatActivityEnriched<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = EnrichedActivity<StreamFeedGenerics>;
declare type BaseAggregatedActivity = {
    activity_count: number;
    actor_count: number;
    created_at: string;
    group: string;
    id: string;
    updated_at: string;
    verb: string;
    score?: number;
};
export declare type AggregatedActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = BaseAggregatedActivity & {
    activities: Activity<StreamFeedGenerics>[];
};
export declare type AggregatedActivityEnriched<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = BaseAggregatedActivity & {
    activities: EnrichedActivity<StreamFeedGenerics>[];
};
declare type BaseNotificationActivity = {
    is_read: boolean;
    is_seen: boolean;
};
export declare type NotificationActivity<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = AggregatedActivity<StreamFeedGenerics> & BaseNotificationActivity;
export declare type NotificationActivityEnriched<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = BaseNotificationActivity & AggregatedActivityEnriched<StreamFeedGenerics>;
export declare type FeedAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    next: string;
    results: FlatActivity<StreamFeedGenerics>[] | FlatActivityEnriched<StreamFeedGenerics>[] | AggregatedActivity<StreamFeedGenerics>[] | AggregatedActivityEnriched<StreamFeedGenerics>[] | NotificationActivity<StreamFeedGenerics>[] | NotificationActivityEnriched<StreamFeedGenerics>[];
    unread?: number;
    unseen?: number;
};
export declare type PersonalizationFeedAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    limit: number;
    next: string;
    offset: number;
    results: FlatActivityEnriched<StreamFeedGenerics>[];
    version: string;
};
export declare type GetActivitiesAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    results: FlatActivity<StreamFeedGenerics>[] | FlatActivityEnriched<StreamFeedGenerics>[];
};
export declare type ToTargetUpdate = {
    foreignId: string;
    time: string;
    addedTargets?: string[];
    newTargets?: string[];
    removedTargets?: string[];
};
/**
 * Manage api calls for specific feeds
 * The feed object contains convenience functions such add activity, remove activity etc
 * @class StreamFeed
 */
export declare class StreamFeed<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    client: StreamClient<StreamFeedGenerics>;
    token: string;
    id: string;
    slug: string;
    userId: string;
    feedUrl: string;
    feedTogether: string;
    notificationChannel: string;
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
    constructor(client: StreamClient<StreamFeedGenerics>, feedSlug: string, userId: string, token: string);
    /**
     * Adds the given activity to the feed
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#adding-activities-basic
     * @method addActivity
     * @memberof StreamFeed.prototype
     * @param {NewActivity<StreamFeedGenerics>} activity - The activity to add
     * @return {Promise<Activity<StreamFeedGenerics>>}
     */
    addActivity(activity: NewActivity<StreamFeedGenerics>): Promise<Activity<StreamFeedGenerics>>;
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
    removeActivity(activityOrActivityId: string | {
        foreignId: string;
    } | {
        foreign_id: string;
    }): Promise<APIResponse & {
        removed: string;
    }>;
    /**
     * Adds the given activities to the feed
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-add-activities
     * @method addActivities
     * @memberof StreamFeed.prototype
     * @param  {NewActivity<StreamFeedGenerics>[]}   activities Array of activities to add
     * @return {Promise<Activity<StreamFeedGenerics>[]>}
     */
    addActivities(activities: NewActivity<StreamFeedGenerics>[]): Promise<Activity<StreamFeedGenerics>[]>;
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
    follow(targetSlug: string, targetUserId: string | {
        id: string;
    }, options?: {
        limit?: number;
    }): Promise<APIResponse>;
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
    unfollow(targetSlug: string, targetUserId: string, options?: {
        keepHistory?: boolean;
    }): Promise<APIResponse>;
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
    following(options?: GetFollowOptions): Promise<GetFollowAPIResponse>;
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
    followers(options?: GetFollowOptions): Promise<GetFollowAPIResponse>;
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
    followStats(options?: FollowStatsOptions): Promise<FollowStatsAPIResponse>;
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
    get(options?: GetFeedOptions): Promise<FeedAPIResponse<StreamFeedGenerics>>;
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
    getActivityDetail(activityId: string, options: EnrichOptions): Promise<FeedAPIResponse<StreamFeedGenerics>>;
    /**
     * Returns the current faye client object
     * @method getFayeClient
     * @memberof StreamFeed.prototype
     * @access private
     * @return {Faye.Client} Faye client
     */
    getFayeClient(): Faye.Client<RealTimeMessage<StreamFeedGenerics>>;
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
    subscribe(callback: Faye.SubscribeCallback<RealTimeMessage<StreamFeedGenerics>>): Promise<Faye.Subscription>;
    /**
     * Cancel updates created via feed.subscribe()
     * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
     * @return void
     */
    unsubscribe(): void;
    _validateToTargetInput(foreignId: string, time: string, newTargets?: string[], addedTargets?: string[], removedTargets?: string[]): void;
    /**
     * Updates an activity's "to" fields
     * @link https://getstream.io/activity-feeds/docs/node/targeting/?language=js
     * @param {string} foreignId The foreign_id of the activity to update
     * @param {string} time The time of the activity to update
     * @param {string[]} newTargets Set the new "to" targets for the activity - will remove old targets
     * @param {string[]} addedTargets Add these new targets to the activity
     * @param {string[]} removedTargets Remove these targets from the activity
     */
    updateActivityToTargets(foreignId: string, time: string, newTargets?: string[], addedTargets?: string[], removedTargets?: string[]): Promise<APIResponse & StreamFeedGenerics["activityType"] & BaseActivity & {
        actor: string;
        foreign_id: string;
        id: string;
        object: unknown;
        time: string;
        analytics?: Record<string, number> | undefined;
        extra_context?: UR | undefined;
        origin?: string | undefined;
        score?: number | undefined;
    } & {
        added?: string[] | undefined;
        removed?: string[] | undefined;
    }>;
    _updateActivityToTargetsMany(inputs: ToTargetUpdate[]): Promise<APIResponse & StreamFeedGenerics["activityType"] & BaseActivity & {
        actor: string;
        foreign_id: string;
        id: string;
        object: unknown;
        time: string;
        analytics?: Record<string, number> | undefined;
        extra_context?: UR | undefined;
        origin?: string | undefined;
        score?: number | undefined;
    } & {
        added?: string[] | undefined;
        removed?: string[] | undefined;
    }>;
}
export {};
//# sourceMappingURL=feed.d.ts.map