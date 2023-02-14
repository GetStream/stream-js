import { StreamClient, APIResponse, UR, DefaultGenerics } from './client';
import { StreamFeed } from './feed';
import { EnrichedUser } from './user';
export declare type TargetFeeds = (string | StreamFeed)[];
export declare type TargetFeed = string | StreamFeed;
export declare type TargetFeedsExtraData = Record<string, unknown>;
export declare type Reaction<T extends UR = UR> = {
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
export declare type ReactionAPIResponse<T extends UR = UR> = APIResponse & Reaction<T>;
export declare type ChildReactionsRecords<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = Record<string, EnrichedReaction<StreamFeedGenerics>[]>;
export declare type EnrichedReaction<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = Reaction<StreamFeedGenerics['reactionType'] | StreamFeedGenerics['childReactionType']> & {
    children_counts: Record<string, number>;
    latest_children: ChildReactionsRecords<StreamFeedGenerics>;
    latest_children_extra?: Record<string, {
        next?: string;
    }>;
    own_children?: ChildReactionsRecords<StreamFeedGenerics>;
    user?: EnrichedUser<StreamFeedGenerics>;
};
export declare type EnrichedReactionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & EnrichedReaction<StreamFeedGenerics>;
export declare type ReactionFilterAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    next: string;
    results: ReactionAPIResponse<StreamFeedGenerics['reactionType'] | StreamFeedGenerics['childReactionType']>[] | EnrichedReactionAPIResponse<StreamFeedGenerics>[];
    activity?: StreamFeedGenerics['childReactionType'];
};
export declare type ReactionFilterConditions = {
    activity_id?: string;
    children_user_id?: string;
    filter_user_id?: string;
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
export declare type ReactionUpdateOptions = {
    targetFeeds?: TargetFeeds;
    targetFeedsExtraData?: TargetFeedsExtraData;
};
export declare type ReactionAddOptions = ReactionUpdateOptions & {
    id?: string;
    userId?: string;
};
export declare type ReactionAddChildOptions = ReactionUpdateOptions & {
    userId?: string;
};
export declare class StreamReaction<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    client: StreamClient<StreamFeedGenerics>;
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
    constructor(client: StreamClient<StreamFeedGenerics>, token: string);
    buildURL: (...args: string[]) => string;
    _convertTargetFeeds: (targetFeeds?: TargetFeeds) => string[];
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
    add(kind: string, activity: string | {
        id: string;
    }, data?: StreamFeedGenerics['reactionType'], { id, targetFeeds, userId, targetFeedsExtraData }?: ReactionAddOptions): Promise<ReactionAPIResponse<StreamFeedGenerics["reactionType"]>>;
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
    addChild(kind: string, reaction: string | {
        id: string;
    }, data?: StreamFeedGenerics['childReactionType'], { targetFeeds, userId, targetFeedsExtraData }?: ReactionAddChildOptions): Promise<ReactionAPIResponse<StreamFeedGenerics["childReactionType"]>>;
    /**
     * get reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
     * @method get
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<EnrichedReactionAPIResponse<StreamFeedGenerics>>}
     * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    get(id: string): Promise<EnrichedReactionAPIResponse<StreamFeedGenerics>>;
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
     * @return {Promise<ReactionFilterAPIResponse<StreamFeedGenerics>>}
     * @example reactions.filter({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
     * @example reactions.filter({user_id: "john", kinds:"like"})
     */
    filter(conditions: ReactionFilterConditions): Promise<ReactionFilterAPIResponse<StreamFeedGenerics>>;
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
    update(id: string, data?: StreamFeedGenerics['reactionType'] | StreamFeedGenerics['childReactionType'], { targetFeeds, targetFeedsExtraData }?: ReactionUpdateOptions): Promise<ReactionAPIResponse<StreamFeedGenerics["reactionType"] | StreamFeedGenerics["childReactionType"]>>;
    /**
     * delete reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#removing-reactions
     * @method delete
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<APIResponse>}
     * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
    delete(id: string): Promise<APIResponse>;
}
//# sourceMappingURL=reaction.d.ts.map