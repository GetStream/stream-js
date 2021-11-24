import { StreamClient, APIResponse, UR } from './client';
import { StreamFeed } from './feed';
import { SiteError } from './errors';
import { EnrichedUser } from './user';

export type TargetFeeds = (string | StreamFeed)[];

export type TargetFeed = string | StreamFeed;

export type TargetFeedsExtraData = Record<string, unknown>;

type ReactionBody<T> = {
  activity_id?: string; // only required for reactions
  data?: T | UR;
  id?: string; // api will generate an id if it's missing
  kind?: string; // required only for add/addChile, not update
  parent?: string; // only required for child reactions
  target_feeds?: string[];
  target_feeds_extra_data?: TargetFeedsExtraData;
  user_id?: string; // optional when using client tokens
};

export type Reaction<T extends UR = UR> = {
  activity_id: string;
  created_at: string;
  data: T;
  id: string;
  kind: string;
  parent: string;
  updated_at: string;
  user_id: string;
  target_feeds?: string[];
  target_feeds_extra_data?: TargetFeedsExtraData;
};

export type ReactionAPIResponse<T extends UR = UR> = APIResponse & Reaction<T>;

export type ChildReactionsRecords<
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  UserType extends UR = UR
  // eslint-disable-next-line no-use-before-define
> = Record<string, EnrichedReaction<ReactionType, ChildReactionType, UserType>[]>;

export type EnrichedReaction<
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  UserType extends UR = UR
> = Reaction<ReactionType | ChildReactionType> & {
  children_counts: Record<string, number>;
  latest_children: ChildReactionsRecords<ReactionType, ChildReactionType, UserType>;
  latest_children_extra?: Record<string, { next?: string }>;
  own_children?: ChildReactionsRecords<ReactionType, ChildReactionType, UserType>;
  user?: EnrichedUser<UserType>;
};

export type EnrichedReactionAPIResponse<
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  UserType extends UR = UR
> = APIResponse & EnrichedReaction<ReactionType, ChildReactionType, UserType>;

export type ReactionFilterAPIResponse<
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  ActivityType extends UR = UR,
  UserType extends UR = UR
> = APIResponse & {
  next: string;
  results:
    | ReactionAPIResponse<ReactionType | ChildReactionType>[]
    | EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>[];
  activity?: ActivityType;
};

export type ReactionFilterConditions = {
  activity_id?: string;
  id_gt?: string;
  id_gte?: string;
  id_lt?: string;
  id_lte?: string;
  kind?: string;
  limit?: number;
  reaction_id?: string;
  user_id?: string;
  with_activity_data?: boolean;
  with_own_children?: boolean;
};

export type ReactionUpdateOptions = {
  targetFeeds?: TargetFeeds;
  targetFeedsExtraData?: TargetFeedsExtraData;
};

export type ReactionAddOptions = ReactionUpdateOptions & {
  id?: string;
  userId?: string;
};

export type ReactionAddChildOptions = ReactionUpdateOptions & {
  userId?: string;
};

export class StreamReaction<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  PersonalizationType extends UR = UR
> {
  client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>;
  token: string;

  /**
   * Initialize a reaction object
   * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js
   * @method constructor
   * @memberof StreamReaction.prototype
   * @param {StreamClient} client Stream client this feed is constructed from
   * @param {string} token JWT token
   * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
   */
  constructor(
    client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
    token: string,
  ) {
    this.client = client;
    this.token = token;
  }

  buildURL = (...args: string[]) => {
    return `${['reaction', ...args].join('/')}/`;
  };

  _convertTargetFeeds = (targetFeeds: TargetFeeds = []): string[] => {
    return targetFeeds.map((elem: TargetFeed) => (typeof elem === 'string' ? elem : (elem as StreamFeed).id));
  };

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
  add(
    kind: string,
    activity: string | { id: string },
    data?: ReactionType,
    { id, targetFeeds = [], userId, targetFeedsExtraData }: ReactionAddOptions = {},
  ) {
    const body: ReactionBody<ReactionType> = {
      id,
      activity_id: activity instanceof Object ? (activity as { id: string }).id : activity,
      kind,
      data: data || {},
      target_feeds: this._convertTargetFeeds(targetFeeds),
      user_id: userId,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.post<ReactionAPIResponse<ReactionType>>({
      url: this.buildURL(),
      body,
      token: this.token,
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
  addChild(
    kind: string,
    reaction: string | { id: string },
    data?: ChildReactionType,
    { targetFeeds = [], userId, targetFeedsExtraData }: ReactionAddChildOptions = {},
  ) {
    const body: ReactionBody<ChildReactionType> = {
      parent: reaction instanceof Object ? (reaction as { id: string }).id : reaction,
      kind,
      data: data || {},
      target_feeds: this._convertTargetFeeds(targetFeeds),
      user_id: userId,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.post<ReactionAPIResponse<ChildReactionType>>({
      url: this.buildURL(),
      body,
      token: this.token,
    });
  }

  /**
   * get reaction
   * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
   * @method get
   * @memberof StreamReaction.prototype
   * @param  {string}   id Reaction Id
   * @return {Promise<EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>>}
   * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
   */
  get(id: string) {
    return this.client.get<EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>>({
      url: this.buildURL(id),
      token: this.token,
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
   * @return {Promise<ReactionFilterAPIResponse<ReactionType, ChildReactionType, ActivityType, UserType>>}
   * @example reactions.filter({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
   * @example reactions.filter({user_id: "john", kinds:"like"})
   */
  filter(conditions: ReactionFilterConditions) {
    const { user_id: userId, activity_id: activityId, reaction_id: reactionId, ...qs } = conditions;
    if (!qs.limit) {
      qs.limit = 10;
    }

    if ((userId ? 1 : 0) + (activityId ? 1 : 0) + (reactionId ? 1 : 0) !== 1) {
      throw new SiteError('Must provide exactly one value for one of these params: user_id, activity_id, reaction_id');
    }

    const lookupType = (userId && 'user_id') || (activityId && 'activity_id') || (reactionId && 'reaction_id');
    const value = userId || activityId || reactionId;

    const url = conditions.kind
      ? this.buildURL(lookupType as string, value as string, conditions.kind)
      : this.buildURL(lookupType as string, value as string);

    return this.client.get<ReactionFilterAPIResponse<ReactionType, ChildReactionType, ActivityType, UserType>>({
      url,
      qs: qs as { [key: string]: unknown },
      token: this.token,
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
  update(
    id: string,
    data?: ReactionType | ChildReactionType,
    { targetFeeds = [], targetFeedsExtraData }: ReactionUpdateOptions = {},
  ) {
    const body: ReactionBody<ReactionType | ChildReactionType> = {
      data,
      target_feeds: this._convertTargetFeeds(targetFeeds),
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.put<ReactionAPIResponse<ReactionType | ChildReactionType>>({
      url: this.buildURL(id),
      body,
      token: this.token,
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
  delete(id: string) {
    return this.client.delete({
      url: this.buildURL(id),
      token: this.token,
    });
  }
}
