/// <reference path="../types/modules.d.ts" />

import * as Faye from 'faye';
import { StreamClient, APIResponse, UR, RealTimeMessage } from './client';
import { StreamUser, EnrichedUser } from './user';
import { FeedError, SiteError } from './errors';
import utils from './utils';
import { EnrichedReaction } from './reaction';
import { CollectionResponse } from './collections';

export type FollowStatsOptions = {
  followerSlugs?: string[];
  followingSlugs?: string[];
};

export type EnrichOptions = {
  enrich?: boolean;
  ownReactions?: boolean; // best not to use it, will be removed by client.replaceReactionOptions()
  reactionKindsFilter?: string; // TODO: add support for array sample: kind,kind,kind
  recentReactionsLimit?: number;
  withOwnChildren?: boolean;
  withOwnReactions?: boolean;
  withReactionCounts?: boolean;
  withRecentReactions?: boolean;
};

export type FeedPaginationOptions = {
  id_gt?: string;
  id_gte?: string;
  id_lt?: string;
  id_lte?: string;
  limit?: number;
};

export type RankedFeedOptions = {
  offset?: number;
  ranking?: string;
  session?: string;
};

export type NotificationFeedOptions = {
  mark_read?: boolean | 'current' | string[];
  mark_seen?: boolean | 'current' | string[];
};

export type FeedContextOptions = {
  user_id?: string;
};

export type GetFeedOptions = FeedPaginationOptions &
  EnrichOptions &
  RankedFeedOptions &
  NotificationFeedOptions &
  FeedContextOptions;

export type GetFollowOptions = {
  filter?: string[];
  limit?: number;
  offset?: number;
};

export type GetFollowAPIResponse = APIResponse & {
  results: { created_at: string; feed_id: string; target_id: string; updated_at: string }[];
};

export type FollowStatsAPIResponse = APIResponse & {
  results: {
    followers: { count: number; feed: string };
    following: { count: number; feed: string };
  };
};

type BaseActivity = {
  verb: string;
  target?: string;
  to?: string[];
};

export type NewActivity<ActivityType extends UR = UR> = ActivityType &
  BaseActivity & {
    actor: string | StreamUser;
    object: string | unknown;
    foreign_id?: string;
    time?: string;
  };

export type UpdateActivity<ActivityType extends UR = UR> = ActivityType &
  BaseActivity & {
    actor: string;
    foreign_id: string;
    object: string | unknown;
    time: string;
  };

export type Activity<ActivityType extends UR = UR> = ActivityType &
  BaseActivity & {
    actor: string;
    foreign_id: string;
    id: string;
    object: string | unknown;
    time: string;
    analytics?: Record<string, number>; // ranked feeds only
    extra_context?: UR;
    origin?: string;
    score?: number; // ranked feeds only
    // ** Add new fields to EnrichedActivity as well **
  };

export type ReactionsRecords<
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  UserType extends UR = UR
> = Record<string, EnrichedReaction<ReactionType, ChildReactionType, UserType>[]>;

export type EnrichedActivity<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = ActivityType &
  BaseActivity &
  Pick<Activity, 'foreign_id' | 'id' | 'time' | 'analytics' | 'extra_context' | 'origin' | 'score'> & {
    actor: EnrichedUser<UserType> | string;
    // Object should be casted based on the verb
    object:
      | string
      | unknown
      | EnrichedActivity<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>
      | EnrichedReaction<ReactionType, ChildReactionType, UserType>
      | CollectionResponse<CollectionType>;
    latest_reactions?: ReactionsRecords<ReactionType, ChildReactionType, UserType>;
    latest_reactions_extra?: Record<string, { next?: string }>;
    own_reactions?: ReactionsRecords<ReactionType, ChildReactionType, UserType>;
    own_reactions_extra?: Record<string, { next?: string }>;
    // Reaction posted to feed
    reaction?: EnrichedReaction<ReactionType, ChildReactionType, UserType>;
    // enriched reactions
    reaction_counts?: Record<string, number>;
  };

export type FlatActivity<ActivityType extends UR = UR> = Activity<ActivityType>;

export type FlatActivityEnriched<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = EnrichedActivity<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>;

type BaseAggregatedActivity = {
  activity_count: number;
  actor_count: number;
  created_at: string;
  group: string;
  id: string;
  updated_at: string;
  verb: string;
  score?: number;
};

export type AggregatedActivity<ActivityType extends UR = UR> = BaseAggregatedActivity & {
  activities: Activity<ActivityType>[];
};

export type AggregatedActivityEnriched<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = BaseAggregatedActivity & {
  activities: EnrichedActivity<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[];
};

type BaseNotificationActivity = { is_read: boolean; is_seen: boolean };

export type NotificationActivity<ActivityType extends UR = UR> = AggregatedActivity<ActivityType> &
  BaseNotificationActivity;

export type NotificationActivityEnriched<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = BaseNotificationActivity &
  AggregatedActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>;

export type FeedAPIResponse<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = APIResponse & {
  next: string;
  results:
    | FlatActivity<ActivityType>[]
    | FlatActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[]
    | AggregatedActivity<ActivityType>[]
    | AggregatedActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[]
    | NotificationActivity<ActivityType>[]
    | NotificationActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[];

  // Notification Feed only
  unread?: number;
  unseen?: number;
};

export type PersonalizationFeedAPIResponse<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = APIResponse & {
  limit: number;
  next: string;
  offset: number;
  results: FlatActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[];
  version: string;
};

export type GetActivitiesAPIResponse<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR
> = APIResponse & {
  results:
    | FlatActivity<ActivityType>[]
    | FlatActivityEnriched<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>[];
};

/**
 * Manage api calls for specific feeds
 * The feed object contains convenience functions such add activity, remove activity etc
 * @class StreamFeed
 */
export class StreamFeed<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  PersonalizationType extends UR = UR
> {
  client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>;
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
  constructor(
    client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
    feedSlug: string,
    userId: string,
    token: string,
  ) {
    if (!feedSlug || !userId) {
      throw new FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
    }

    if (feedSlug.indexOf(':') !== -1) {
      throw new FeedError('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
    }

    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    // raise an error if there is no token
    if (!token) {
      throw new FeedError('Missing token, in client side mode please provide a feed secret');
    }

    this.client = client;
    this.slug = feedSlug;
    this.userId = userId;
    this.id = `${this.slug}:${this.userId}`;
    this.token = token;

    this.feedUrl = this.id.replace(':', '/');
    this.feedTogether = this.id.replace(':', '');

    // faye setup
    this.notificationChannel = `site-${this.client.appId}-feed-${this.feedTogether}`;
  }

  /**
   * Adds the given activity to the feed
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#adding-activities-basic
   * @method addActivity
   * @memberof StreamFeed.prototype
   * @param {NewActivity<ActivityType>} activity - The activity to add
   * @return {Promise<Activity<ActivityType>>}
   */
  addActivity(activity: NewActivity<ActivityType>) {
    activity = utils.replaceStreamObjects(activity);
    if (!activity.actor && this.client.currentUser) {
      activity.actor = this.client.currentUser.ref();
    }

    return this.client.post<Activity<ActivityType>>({
      url: `feed/${this.feedUrl}/`,
      body: activity,
      token: this.token,
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
  removeActivity(activityOrActivityId: string | { foreignId: string } | { foreign_id: string }) {
    const foreign_id =
      (activityOrActivityId as { foreignId?: string }).foreignId ||
      (activityOrActivityId as { foreign_id?: string }).foreign_id;

    return this.client.delete<APIResponse & { removed: string }>({
      url: `feed/${this.feedUrl}/${foreign_id || activityOrActivityId}/`,
      qs: foreign_id ? { foreign_id: '1' } : {},
      token: this.token,
    });
  }

  /**
   * Adds the given activities to the feed
   * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-add-activities
   * @method addActivities
   * @memberof StreamFeed.prototype
   * @param  {NewActivity<ActivityType>[]}   activities Array of activities to add
   * @return {Promise<Activity<ActivityType>[]>}
   */
  addActivities(activities: NewActivity<ActivityType>[]) {
    return this.client.post<Activity<ActivityType>[]>({
      url: `feed/${this.feedUrl}/`,
      body: { activities: utils.replaceStreamObjects(activities) },
      token: this.token,
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
  follow(targetSlug: string, targetUserId: string | { id: string }, options: { limit?: number } = {}) {
    if (targetUserId instanceof StreamUser) {
      targetUserId = targetUserId.id;
    }
    utils.validateFeedSlug(targetSlug);
    utils.validateUserId(targetUserId as string);

    const body: { target: string; activity_copy_limit?: number } = { target: `${targetSlug}:${targetUserId}` };
    if (typeof options.limit === 'number') body.activity_copy_limit = options.limit;

    return this.client.post<APIResponse>({
      url: `feed/${this.feedUrl}/following/`,
      body,
      token: this.token,
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
  unfollow(targetSlug: string, targetUserId: string, options: { keepHistory?: boolean } = {}) {
    const qs: { keep_history?: string } = {};
    if (typeof options.keepHistory === 'boolean' && options.keepHistory) qs.keep_history = '1';

    utils.validateFeedSlug(targetSlug);
    utils.validateUserId(targetUserId);
    const targetFeedId = `${targetSlug}:${targetUserId}`;
    return this.client.delete<APIResponse>({
      url: `feed/${this.feedUrl}/following/${targetFeedId}/`,
      qs,
      token: this.token,
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
  following(options: GetFollowOptions = {}) {
    const extraOptions: { filter?: string } = {};
    if (options.filter) extraOptions.filter = options.filter.join(',');

    return this.client.get<GetFollowAPIResponse>({
      url: `feed/${this.feedUrl}/following/`,
      qs: { ...options, ...extraOptions },
      token: this.token,
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
  followers(options: GetFollowOptions = {}) {
    const extraOptions: { filter?: string } = {};
    if (options.filter) extraOptions.filter = options.filter.join(',');

    return this.client.get<GetFollowAPIResponse>({
      url: `feed/${this.feedUrl}/followers/`,
      qs: { ...options, ...extraOptions },
      token: this.token,
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
  followStats(options: FollowStatsOptions = {}) {
    const qs: { followers: string; following: string; followers_slugs?: string; following_slugs?: string } = {
      followers: this.id,
      following: this.id,
    };

    if (options.followerSlugs && options.followerSlugs.length) qs.followers_slugs = options.followerSlugs.join(',');
    if (options.followingSlugs && options.followingSlugs.length) qs.following_slugs = options.followingSlugs.join(',');

    return this.client.get<FollowStatsAPIResponse>({
      url: 'stats/follow/',
      qs,
      token: this.client.getOrCreateToken() || this.token,
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
  get(options: GetFeedOptions = {}) {
    const extraOptions: { mark_read?: boolean | string; mark_seen?: boolean | string } = {};

    if (options.mark_read && (options.mark_read as string[]).join) {
      extraOptions.mark_read = (options.mark_read as string[]).join(',');
    }

    if (options.mark_seen && (options.mark_seen as string[]).join) {
      extraOptions.mark_seen = (options.mark_seen as string[]).join(',');
    }

    this.client.replaceReactionOptions(options);

    const path = this.client.shouldUseEnrichEndpoint(options) ? 'enrich/feed/' : 'feed/';

    return this.client.get<FeedAPIResponse<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>>({
      url: `${path}${this.feedUrl}/`,
      qs: { ...options, ...extraOptions },
      token: this.token,
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
  getActivityDetail(activityId: string, options: EnrichOptions) {
    return this.get({
      id_lte: activityId,
      id_gte: activityId,
      limit: 1,
      ...(options || {}),
    });
  }

  /**
   * Returns the current faye client object
   * @method getFayeClient
   * @memberof StreamFeed.prototype
   * @access private
   * @return {Faye.Client} Faye client
   */
  getFayeClient() {
    return this.client.getFayeClient();
  }

  /**
   * Subscribes to any changes in the feed, return a promise
   * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
   * @method subscribe
   * @memberof StreamFeed.prototype
   * @param  {function} Faye.Callback<RealTimeMessage<UserType, ActivityType, CollectionType, ReactionType>> Callback to call on completion
   * @return {Promise<Faye.Subscription>}
   * @example
   * feed.subscribe(callback).then(function(){
   * 		console.log('we are now listening to changes');
   * });
   */
  subscribe(callback: Faye.SubscribeCallback<RealTimeMessage<UserType, ActivityType, CollectionType, ReactionType>>) {
    if (!this.client.appId) {
      throw new SiteError(
        'Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);',
      );
    }

    const subscription = this.getFayeClient().subscribe(`/${this.notificationChannel}`, callback);
    this.client.subscriptions[`/${this.notificationChannel}`] = {
      token: this.token,
      userId: this.notificationChannel,
      fayeSubscription: subscription,
    };

    return subscription;
  }

  /**
   * Cancel updates created via feed.subscribe()
   * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
   * @return void
   */
  unsubscribe() {
    const streamSubscription = this.client.subscriptions[`/${this.notificationChannel}`];
    if (streamSubscription) {
      delete this.client.subscriptions[`/${this.notificationChannel}`];
      (streamSubscription.fayeSubscription as Faye.Subscription).cancel();
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
  updateActivityToTargets(
    foreignId: string,
    time: string,
    newTargets?: string[],
    addedTargets?: string[],
    removedTargets?: string[],
  ) {
    if (!foreignId) throw new Error('Missing `foreign_id` parameter!');
    if (!time) throw new Error('Missing `time` parameter!');

    if (!newTargets && !addedTargets && !removedTargets) {
      throw new Error(
        'Requires you to provide at least one parameter for `newTargets`, `addedTargets`, or `removedTargets` - example: `updateActivityToTargets("foreignID:1234", new Date(), [newTargets...], [addedTargets...], [removedTargets...])`',
      );
    }

    if (newTargets) {
      if (addedTargets || removedTargets) {
        throw new Error("Can't include add_targets or removedTargets if you're also including newTargets");
      }
    }

    if (addedTargets && removedTargets) {
      // brute force - iterate through added, check to see if removed contains that element
      addedTargets.forEach((addedTarget) => {
        if (removedTargets.includes(addedTarget)) {
          throw new Error("Can't have the same feed ID in addedTargets and removedTargets.");
        }
      });
    }

    const body: {
      foreign_id: string;
      time: string;
      added_targets?: string[];
      new_targets?: string[];
      removed_targets?: string[];
    } = { foreign_id: foreignId, time };
    if (newTargets) body.new_targets = newTargets;
    if (addedTargets) body.added_targets = addedTargets;
    if (removedTargets) body.removed_targets = removedTargets;

    return this.client.post<APIResponse & Activity<ActivityType> & { added?: string[]; removed?: string[] }>({
      url: `feed_targets/${this.feedUrl}/activity_to_targets/`,
      token: this.token,
      body,
    });
  }
}
