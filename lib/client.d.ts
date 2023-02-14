/// <reference path="../types/modules.d.ts" />
/// <reference types="node" />
import * as axios from 'axios';
import * as Faye from 'faye';
import * as http from 'http';
import * as https from 'https';
import { Personalization } from './personalization';
import { Collections } from './collections';
import { StreamFileStore } from './files';
import { StreamImageStore } from './images';
import { StreamReaction } from './reaction';
import { StreamUser } from './user';
import { FollowRelation, UnfollowRelation } from './batch_operations';
import { StreamFeed, UpdateActivity, Activity, EnrichOptions, PersonalizationFeedAPIResponse, GetActivitiesAPIResponse, GetFeedOptions, EnrichedActivity } from './feed';
export declare type UR = Record<string, unknown>;
export declare type UnknownRecord = UR;
export declare type DefaultGenerics = {
    activityType: UR;
    childReactionType: UR;
    collectionType: UR;
    personalizationType: UR;
    reactionType: UR;
    userType: UR;
};
export declare type APIResponse = {
    duration?: string;
};
export declare type FileUploadAPIResponse = APIResponse & {
    file: string;
};
export declare type OnUploadProgress = (progressEvent: ProgressEvent) => void;
export declare type ClientOptions = {
    browser?: boolean;
    expireTokens?: boolean;
    fayeUrl?: string;
    group?: string;
    keepAlive?: boolean;
    local?: boolean;
    location?: string;
    protocol?: string;
    timeout?: number;
    urlOverride?: Record<string, string>;
    version?: string;
};
declare type OGResource = {
    secure_url?: string;
    type?: string;
    url?: string;
};
declare type OGAudio = OGResource & {
    audio?: string;
};
declare type OGImage = OGResource & {
    alt?: string;
    height?: number;
    image?: string;
    width?: number;
};
declare type OGVideo = OGResource & {
    height?: number;
    video?: string;
    width?: number;
};
export declare type OGAPIResponse = APIResponse & {
    audios?: OGAudio[];
    description?: string;
    determiner?: string;
    favicon?: string;
    images?: OGImage[];
    locale?: string;
    site?: string;
    site_name?: string;
    title?: string;
    type?: string;
    url?: string;
    videos?: OGVideo[];
};
declare type AxiosConfig = {
    token: string;
    url: string;
    axiosOptions?: axios.AxiosRequestConfig;
    body?: unknown;
    headers?: UR;
    qs?: UR;
    serviceName?: string;
};
export declare type HandlerCallback = (...args: unknown[]) => unknown;
export declare type ForeignIDTimes = {
    foreign_id: string;
    time: Date | string;
} | {
    foreignID: string;
    time: Date | string;
};
export declare type ActivityPartialChanges<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = Partial<ForeignIDTimes> & {
    id?: string;
    set?: Partial<StreamFeedGenerics['activityType']>;
    unset?: Array<Extract<keyof StreamFeedGenerics['activityType'], string>>;
};
export declare type RealTimeMessage<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
    deleted: Array<string>;
    deleted_foreign_ids: Array<[id: string, time: string]>;
    new: Array<Omit<EnrichedActivity<StreamFeedGenerics>, 'latest_reactions' | 'latest_reactions_extra' | 'own_reactions' | 'own_reactions_extra' | 'reaction_counts'> & {
        group?: string;
    }>;
    app_id?: string;
    feed?: string;
    mark_read?: 'all' | 'current' | Array<string>;
    mark_seen?: 'all' | 'current' | Array<string>;
    published_at?: string;
};
/**
 * Client to connect to Stream api
 * @class StreamClient
 */
export declare class StreamClient<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    baseUrl: string;
    baseAnalyticsUrl: string;
    apiKey: string;
    appId?: string;
    usingApiSecret: boolean;
    apiSecret: string | null;
    userToken: string | null;
    enrichByDefault: boolean;
    options: ClientOptions;
    userId?: string;
    authPayload?: unknown;
    version: string;
    fayeUrl: string;
    group: string;
    expireTokens: boolean;
    location: string;
    fayeClient: Faye.Client<RealTimeMessage<StreamFeedGenerics>> | null;
    browser: boolean;
    node: boolean;
    nodeOptions?: {
        httpAgent: http.Agent;
        httpsAgent: https.Agent;
    };
    request: axios.AxiosInstance;
    subscriptions: Record<string, {
        fayeSubscription: Faye.Subscription | Promise<Faye.Subscription>;
        token: string;
        userId: string;
    }>;
    handlers: Record<string, HandlerCallback>;
    currentUser?: StreamUser<StreamFeedGenerics>;
    personalization: Personalization<StreamFeedGenerics>;
    collections: Collections<StreamFeedGenerics>;
    files: StreamFileStore;
    images: StreamImageStore;
    reactions: StreamReaction<StreamFeedGenerics>;
    private _personalizationToken?;
    private _collectionsToken?;
    private _getOrCreateToken?;
    addToMany?: <StreamFeedGenerics extends DefaultGenerics = DefaultGenerics>(// eslint-disable-line no-shadow
    this: StreamClient, // eslint-disable-line no-use-before-define
    activity: StreamFeedGenerics['activityType'], feeds: string[]) => Promise<APIResponse>;
    followMany?: (this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) => Promise<APIResponse>;
    unfollowMany?: (this: StreamClient, unfollows: UnfollowRelation[]) => Promise<APIResponse>;
    createRedirectUrl?: (this: StreamClient, targetUrl: string, userId: string, events: unknown[]) => string;
    /**
     * Initialize a client
     * @link https://getstream.io/activity-feeds/docs/node/#setup
     * @method initialize
     * @memberof StreamClient.prototype
     * @param {string} apiKey - the api key
     * @param {string} [apiSecret] - the api secret
     * @param {string} [appId] - id of the app
     * @param {ClientOptions} [options] - additional options
     * @param {string} [options.location] - which data center to use
     * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
     * @param {string} [options.version] - advanced usage, custom api version
     * @param {boolean} [options.keepAlive] - axios keepAlive, default to true
     * @param {number} [options.timeout] - axios timeout in Ms, default to 10s
     * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
     * stream.connect(apiKey, apiSecret)
     * @example <caption>secret is optional and only used in server side mode</caption>
     * stream.connect(apiKey, null, appId);
     */
    constructor(apiKey: string, apiSecretOrToken: string | null, appId?: string, options?: ClientOptions);
    _throwMissingApiSecret(): void;
    getPersonalizationToken(): string;
    getCollectionsToken(): string;
    getAnalyticsToken(): string;
    getBaseUrl(serviceName?: string): string;
    /**
     * Support for global event callbacks
     * This is useful for generic error and loading handling
     * @method on
     * @memberof StreamClient.prototype
     * @param {string} event - Name of the event
     * @param {function} callback - Function that is called when the event fires
     * @example
     * client.on('request', callback);
     * client.on('response', callback);
     */
    on(event: string, callback: HandlerCallback): void;
    /**
     * Remove one or more event handlers
     * @method off
     * @memberof StreamClient.prototype
     * @param {string} [key] - Name of the handler
     * @example
     * client.off() removes all handlers
     * client.off(name) removes the specified handler
     */
    off(key?: string): void;
    /**
     * Call the given handler with the arguments
     * @method send
     * @memberof StreamClient.prototype
     * @access private
     */
    send(key: string, ...args: unknown[]): void;
    /**
     * Get the current user agent
     * @method userAgent
     * @memberof StreamClient.prototype
     * @return {string} current user agent
     */
    userAgent(): string;
    /**
     * Returns a token that allows only read operations
     *
     * @method getReadOnlyToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadOnlyToken('user', '1');
     */
    getReadOnlyToken(feedSlug: string, userId: string): string;
    /**
     * Returns a token that allows read and write operations
     *
     * @method getReadWriteToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadWriteToken('user', '1');
     */
    getReadWriteToken(feedSlug: string, userId: string): string;
    /**
     * Returns a feed object for the given feed id and token
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js
     * @method feed
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug
     * @param {string} [userId] - The user identifier
     * @param {string} [token] - The token
     * @return {StreamFeed}
     * @example  client.feed('user', '1');
     */
    feed(feedSlug: string, userId?: string | StreamUser<StreamFeedGenerics>, token?: string): StreamFeed<StreamFeedGenerics>;
    /**
     * Combines the base url with version and the relative url
     * @method enrichUrl
     * @memberof StreamClient.prototype
     * @private
     * @param {string} relativeUrl
     * @param {string} [serviceName]
     * @return {string}
     */
    enrichUrl(relativeUrl: string, serviceName?: string): string;
    replaceReactionOptions: (options: {
        reactions?: Record<string, boolean>;
        withOwnChildren?: boolean;
        withOwnReactions?: boolean;
        withReactionCounts?: boolean;
        withRecentReactions?: boolean;
    }) => void;
    shouldUseEnrichEndpoint(options?: {
        enrich?: boolean;
        ownReactions?: boolean;
        withOwnChildren?: boolean;
        withReactionCounts?: boolean;
        withRecentReactions?: boolean;
    }): boolean;
    /**
     * Adds the API key and the token
     * @method enrichKwargs
     * @private
     * @memberof StreamClient.prototype
     * @param {AxiosConfig} kwargs
     * @return {axios.AxiosRequestConfig}
     */
    enrichKwargs({ method, token, ...kwargs }: AxiosConfig & {
        method: axios.Method;
    }): axios.AxiosRequestConfig;
    /**
     * Get the authorization middleware to use Faye with getstream.io
     * @method getFayeAuthorization
     * @memberof StreamClient.prototype
     * @private
     * @return {Faye.Middleware} Faye authorization middleware
     */
    getFayeAuthorization(): {
        incoming: (message: Faye.Message<RealTimeMessage<StreamFeedGenerics>>, callback: Faye.Callback<RealTimeMessage<StreamFeedGenerics>>) => unknown;
        outgoing: (message: Faye.Message<RealTimeMessage<StreamFeedGenerics>>, callback: Faye.Callback<RealTimeMessage<StreamFeedGenerics>>) => void;
    };
    /**
     * Returns this client's current Faye client
     * @method getFayeClient
     * @memberof StreamClient.prototype
     * @private
     * @param {number} timeout
     * @return {Faye.Client} Faye client
     */
    getFayeClient(timeout?: number): Faye.Client<RealTimeMessage<StreamFeedGenerics>>;
    handleResponse: <T>(response: axios.AxiosResponse<T>) => T;
    doAxiosRequest: <T>(method: axios.Method, options: AxiosConfig) => Promise<T>;
    upload(url: string, uri: string | File | Buffer | NodeJS.ReadStream, name?: string, contentType?: string, onUploadProgress?: OnUploadProgress): Promise<FileUploadAPIResponse>;
    /**
     * Shorthand function for get request
     * @method get
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
    get<T>(kwargs: AxiosConfig): Promise<T>;
    /**
     * Shorthand function for post request
     * @method post
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
    post<T>(kwargs: AxiosConfig): Promise<T>;
    /**
     * Shorthand function for delete request
     * @method delete
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
    delete<T = APIResponse>(kwargs: AxiosConfig): Promise<T>;
    /**
     * Shorthand function for put request
     * @method put
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
    put<T>(kwargs: AxiosConfig): Promise<T>;
    /**
     * create a user token
     * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#generate-user-token-server-side
     * @param {string} userId
     * @param {object} extraData
     * @return {string}
     */
    createUserToken(userId: string, extraData?: {}): string;
    /**
     * Updates all supplied activities on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>[]} activities list of activities to update
     * @return {Promise<APIResponse>}
     */
    updateActivities(activities: UpdateActivity<StreamFeedGenerics>[]): Promise<APIResponse>;
    /**
     * Updates one activity on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>} activity The activity to update
     * @return {Promise<APIResponse>}
     */
    updateActivity(activity: UpdateActivity<StreamFeedGenerics>): Promise<APIResponse>;
    /**
     * Retrieve activities by ID or foreign_id and time
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-get-activities-by-id
     * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign_ids and time as {foreignIDTimes: [{foreign_id: ..., time: ...}, ...]}
     * @return {Promise<GetActivitiesAPIResponse>}
     */
    getActivities({ ids, foreignIDTimes, ...params }: EnrichOptions & {
        foreignIDTimes?: ForeignIDTimes[];
        ids?: string[];
        reactions?: Record<string, boolean>;
    }): Promise<GetActivitiesAPIResponse<StreamFeedGenerics>>;
    getOrCreateToken(): string;
    user(userId: string): StreamUser<StreamFeedGenerics>;
    setUser(data: StreamFeedGenerics['userType']): Promise<StreamUser<StreamFeedGenerics>>;
    og(url: string): Promise<OGAPIResponse>;
    personalizedFeed(options?: GetFeedOptions): Promise<PersonalizationFeedAPIResponse<StreamFeedGenerics>>;
    /**
     * Update a single activity with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>} data object containing either the ID or the foreign_id and time of the activity and the operations to issue as set:{...} and unset:[...].
     * @return {Promise<Activity<StreamFeedGenerics>>}
     * @example
     * client.activityPartialUpdate({
     *   id: "54a60c1e-4ee3-494b-a1e3-50c06acb5ed4",
     *   set: {
     *     "product.price": 19.99,
     *     "shares": {
     *       "facebook": "...",
     *       "twitter": "...",
     *     }
     *   },
     *   unset: [
     *     "daily_likes",
     *     "popularity"
     *   ]
     * })
     * @example
     * client.activityPartialUpdate({
     *   foreign_id: "product:123",
     *   time: "2016-11-10T13:20:00.000000",
     *   set: {
     *     ...
     *   },
     *   unset: [
     *     ...
     *   ]
     * })
     */
    activityPartialUpdate(data: ActivityPartialChanges<StreamFeedGenerics>): Promise<APIResponse & Activity<StreamFeedGenerics>>;
    /**
     * Update multiple activities with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>[]} changes array containing the changesets to be applied. Every changeset contains the activity identifier which is either the ID or the pair of of foreign ID and time of the activity. The operations to issue can be set:{...} and unset:[...].
     * @return {Promise<{ activities: Activity<StreamFeedGenerics>[] }>}
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     id: "4b39fda2-d6e2-42c9-9abf-5301ef071b12",
     *     set: {
     *       "product.price.eur": 12.99,
     *       "colors": {
     *         "blue": "#0000ff",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "popularity", "size.x2" ],
     *   },
     *   {
     *     id: "8d2dcad8-1e34-11e9-8b10-9cb6d0925edd",
     *     set: {
     *       "product.price.eur": 17.99,
     *       "colors": {
     *         "red": "#ff0000",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "rating" ],
     *   },
     * ])
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     foreign_id: "product:123",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     *   {
     *     foreign_id: "product:321",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     * ])
     */
    activitiesPartialUpdate(changes: ActivityPartialChanges<StreamFeedGenerics>[]): Promise<APIResponse & {
        activities: Activity<StreamFeedGenerics>[];
    }>;
}
export {};
//# sourceMappingURL=client.d.ts.map