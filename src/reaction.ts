import StreamClient, { APIResponse } from './client';
import StreamFeed from './feed';
import * as errors from './errors';

type TargetFeeds = (string | StreamFeed)[];

type TargetFeed = string | StreamFeed;

type TargetFeedsExtraData = Record<string, unknown>;

type ReactionBody<T> = {
  id?: string; // api will generate an id if it's missing
  kind?: string; // required only for add/addChile, not update
  user_id?: string; // optional when using client tokens
  activity_id?: string; // only required for reactions
  parent?: string; // only required for child reactions
  data?: T | Record<string, unknown>;
  target_feeds?: string[];
  target_feeds_extra_data?: TargetFeedsExtraData;
};

export type Reaction<T> = {
  id: string;
  kind: string;
  activity_id: string;
  user_id: string;
  data: T;
  created_at: Date;
  updated_at: Date;
  target_feeds?: string[];
  target_feeds_extra_data?: TargetFeedsExtraData;
  parent: string;
};

type ReactionAPIResponse<T> = APIResponse & Reaction<T>;

export type EnrichedReaction<ReactionType, ChildReactionType, UserType> = Reaction<ReactionType | ChildReactionType> & {
  children_counts: Record<string, number>;
  latest_children: Record<string, ChildReactionType>;
  own_children?: Record<string, ChildReactionType>;
  user?: UserType;
};

type EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType> = APIResponse &
  EnrichedReaction<ReactionType, ChildReactionType, UserType>;

type ReactionFilterAPIResponse<ReactionType, ChildReactionType, ActivityType, UserType> = APIResponse & {
  activity?: ActivityType;
  next: string;
  results:
    | ReactionAPIResponse<ReactionType | ChildReactionType>[]
    | EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>[];
};

export default class StreamReaction<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType> {
  client: StreamClient;
  token: string;

  constructor(client: StreamClient, token: string) {
    /**
     * Initialize a reaction object
     * @method constructor
     * @memberof StreamReaction.prototype
     * @param {StreamClient} client Stream client this feed is constructed from
     * @param {string} token JWT token
     * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.token = token;
  }

  buildURL = (...args: string[]): string => {
    return `${['reaction', ...args].join('/')}/`;
  };

  // DEPRECATED
  all(options = {}) {
    /**
     * get all reactions
     * @method all
     * @memberof StreamReaction.prototype
     * @param  {object}   options  {limit:}
     * @return {Promise} Promise object
     * @example reactions.all()
     * @example reactions.all({limit:100})
     */
    console.warn('Deprecated function, please use reactions.filter()'); // eslint-disable-line
    return this.client.get({
      url: this.buildURL(),
      signature: this.token,
      qs: options,
    });
  }

  _convertTargetFeeds = (targetFeeds: TargetFeeds = []): string[] => {
    return targetFeeds.map((elem: TargetFeed) => (typeof elem === 'string' ? elem : (elem as StreamFeed).id));
  };

  add(
    kind: string,
    activity: string | { id: string },
    data: ReactionType,
    {
      id,
      targetFeeds = [],
      userId,
      targetFeedsExtraData,
    }: { id?: string; targetFeeds?: TargetFeeds; userId?: string; targetFeedsExtraData?: TargetFeedsExtraData } = {},
  ): Promise<ReactionAPIResponse<ReactionType>> {
    /**
     * add reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   activity Activity or an ActivityID
     * @param  {object}   data  data related to reaction
     * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
     * @return {Promise} Promise object
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
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
      signature: this.token,
    });
  }

  addChild(
    kind: string,
    reaction: string | { id: string },
    data = {},
    {
      targetFeeds = [],
      userId,
      targetFeedsExtraData,
    }: {
      targetFeeds?: TargetFeeds;
      userId?: string;
      targetFeedsExtraData?: TargetFeedsExtraData;
    } = {},
  ): Promise<ReactionAPIResponse<ChildReactionType>> {
    /**
     * add reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   reaction Reaction or a ReactionID
     * @param  {object}   data  data related to reaction
     * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
     * @return {Promise} Promise object
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
    const body: ReactionBody<ChildReactionType> = {
      parent: reaction instanceof Object ? (reaction as { id: string }).id : reaction,
      kind,
      data,
      target_feeds: this._convertTargetFeeds(targetFeeds),
      user_id: userId,
    };
    if (targetFeedsExtraData != null) {
      body.target_feeds_extra_data = targetFeedsExtraData;
    }
    return this.client.post<ReactionAPIResponse<ChildReactionType>>({
      url: this.buildURL(),
      body,
      signature: this.token,
    });
  }

  get(id: string): Promise<EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>> {
    /**
     * get reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise} Promise object
     * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    return this.client.get<EnrichedReactionAPIResponse<ReactionType, ChildReactionType, UserType>>({
      url: this.buildURL(id),
      signature: this.token,
    });
  }

  filter(conditions: {
    kind?: string;
    user_id?: string;
    activity_id?: string;
    reaction_id?: string;
    id_lt?: string;
    id_lte?: string;
    id_gt?: string;
    id_gte?: string;
    limit?: number;
    with_activity_data?: boolean;
  }): Promise<ReactionFilterAPIResponse<ReactionType, ChildReactionType, ActivityType, UserType>> {
    /**
     * retrieve reactions by activity_id, user_id or reaction_id (to paginate children reactions), pagination can be done using id_lt, id_lte, id_gt and id_gte parameters
     * id_lt and id_lte return reactions order by creation descending starting from the reaction with the ID provided, when id_lte is used
     * the reaction with ID equal to the value provided is included.
     * id_gt and id_gte return reactions order by creation ascending (oldest to newest) starting from the reaction with the ID provided, when id_gte is used
     * the reaction with ID equal to the value provided is included.
     * results are limited to 25 at most and are ordered newest to oldest by default.
     * @method filter
     * @memberof StreamReaction.prototype
     * @param  {object}   conditions Reaction Id {activity_id|user_id|reaction_id:string, kind:string, limit:integer}
     * @return {Promise} Promise object
     * @example reactions.filter({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
     * @example reactions.filter({user_id: "john", kinds:"like"})
     */

    const { user_id: userId, activity_id: activityId, reaction_id: reactionId, ...qs } = conditions;
    if (!qs.limit) {
      qs.limit = 10;
    }

    if ((userId ? 1 : 0) + (activityId ? 1 : 0) + (reactionId ? 1 : 0) !== 1) {
      throw new errors.SiteError(
        'Must provide exactly one value for one of these params: user_id, activity_id, reaction_id',
      );
    }

    const lookupType = (userId && 'user_id') || (activityId && 'activity_id') || (reactionId && 'reaction_id');
    const value = userId || activityId || reactionId;

    const url = conditions.kind
      ? this.buildURL(lookupType as string, value as string, conditions.kind)
      : this.buildURL(lookupType as string, value as string);

    return this.client.get<ReactionFilterAPIResponse<ReactionType, ChildReactionType, ActivityType, UserType>>({
      url,
      qs: qs as { [key: string]: unknown },
      signature: this.token,
    });
  }

  update(
    id: string,
    data: ReactionType | ChildReactionType,
    {
      targetFeeds = [],
      targetFeedsExtraData,
    }: { targetFeeds?: string[] | StreamFeed[]; targetFeedsExtraData?: TargetFeedsExtraData } = {},
  ): Promise<ReactionAPIResponse<ReactionType | ChildReactionType>> {
    /**
     * update reaction
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {object}   data  Data associated to reaction
     * @param  {array}   targetFeeds  Optional feeds to post the activity to. If you sent this before and don't set it here it will be removed.
     * @return {Promise} Promise object
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "like")
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "comment", {"text": "love it!"},)
     */
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
      signature: this.token,
    });
  }

  delete(id: string): Promise<APIResponse> {
    /**
     * delete reaction
     * @method delete
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise} Promise object
     * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    return this.client.delete<APIResponse>({
      url: this.buildURL(id),
      signature: this.token,
    });
  }
}
