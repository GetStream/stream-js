import * as axios from 'axios';
import http from 'http';
import https from 'https';
import * as Faye from 'faye';
import jwtDecode from 'jwt-decode';

import Personalization from './personalization';
import Collections from './collections';
import StreamFileStore from './files';
import StreamImageStore from './images';
import StreamReaction from './reaction';
import StreamUser from './user';
import createRedirectUrl from './redirect_url';
import signing from './signing';
import * as errors from './errors';
import utils from './utils';
import BatchOperations, { FollowRelation, UnfollowRelation } from './batch_operations';
import StreamFeed, {
  UpdateActivity,
  Activity,
  EnrichOptions,
  PersonalizationFeedAPIResponse,
  GetActivitiesAPIResponse,
  GetFeedOptions,
} from './feed';

// no import since typescript json loader shifts the final output structure
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

export type APIResponse = { duration?: string };

export type FileUploadAPIResponse = APIResponse & { file: string };

export type OnUploadProgress = (progressEvent: ProgressEvent) => void;

export type ClientOptions = {
  location?: string;
  expireTokens?: boolean;
  version?: string;
  group?: string;
  keepAlive?: boolean;
  timeout?: number;
  browser?: boolean;
  fayeUrl?: string;
  protocol?: string;
  local?: boolean;
  urlOverride?: Record<string, string>;
};

type OGResource = {
  url?: string;
  secure_url?: string;
  type?: string;
};

type OGAudio = OGResource & {
  audio?: string;
};

type OGImage = OGResource & {
  image?: string;
  width?: number;
  height?: number;
  alt?: string;
};

type OGVideo = OGResource & {
  video?: string;
  width?: number;
  height?: number;
};

type OGAPIResponse = APIResponse & {
  title?: string;
  type?: string;
  url?: string;
  site?: string;
  site_name?: string;
  description?: string;
  favicon?: string;
  determiner?: string;
  locale?: string;
  audios?: OGAudio[];
  images?: OGImage[];
  videos?: OGVideo[];
};

type AxiosConfig = {
  signature: string;
  url: string;
  serviceName?: string;
  body?: unknown;
  qs?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  axiosOptions?: axios.AxiosRequestConfig;
};

type HandlerCallback = (...args: unknown[]) => unknown;

type ActivityPartialChanges = {
  id?: string;
  foreignID?: string;
  time?: Date;
  set?: Record<string, unknown>;
  unset?: string[];
};

/**
 * Client to connect to Stream api
 * @class StreamClient
 */
class StreamClient<
  UserType = unknown,
  ActivityType = unknown,
  CollectionType = unknown,
  ReactionType = unknown,
  ChildReactionType = unknown,
  PersonalizationType = unknown
> {
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
  fayeClient: Faye.Client | null;
  browser: boolean;
  node: boolean;
  nodeOptions?: { httpAgent: http.Agent; httpsAgent: https.Agent };

  request: axios.AxiosInstance;
  subscriptions: Record<string, { userId: string; token: string; fayeSubscription: Faye.Subscription }>;
  handlers: Record<string, HandlerCallback>;

  currentUser?: StreamUser<UserType>;
  personalization: Personalization<PersonalizationType>;
  collections: Collections<CollectionType>;
  files: StreamFileStore;
  images: StreamImageStore;
  reactions: StreamReaction<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>;

  private _personalizationToken?: string;
  private _collectionsToken?: string;
  private _getOrCreateToken?: string;

  addToMany?: <ActivityType>(this: StreamClient, activity: ActivityType, feeds: string[]) => Promise<APIResponse>;
  followMany?: (this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) => Promise<APIResponse>;
  unfollowMany?: (this: StreamClient, unfollows: UnfollowRelation[]) => Promise<APIResponse>;
  createRedirectUrl?: (this: StreamClient, targetUrl: string, userId: string, events: unknown[]) => string;

  constructor(apiKey: string, apiSecretOrToken: string | null, appId?: string, options: ClientOptions = {}) {
    /**
     * Initialize a client
     * @method initialize
     * @memberof StreamClient.prototype
     * @param {string} apiKey - the api key
     * @param {string} [apiSecret] - the api secret
     * @param {string} [appId] - id of the app
     * @param {object} [options] - additional options
     * @param {string} [options.location] - which data center to use
     * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
     * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
     * stream.connect(apiKey, apiSecret)
     * @example <caption>secret is optional and only used in server side mode</caption>
     * stream.connect(apiKey, null, appId);
     */

    this.baseUrl = 'https://api.stream-io-api.com/api/';
    this.baseAnalyticsUrl = 'https://analytics.stream-io-api.com/analytics/';
    this.apiKey = apiKey;
    this.usingApiSecret = apiSecretOrToken != null && !signing.isJWT(apiSecretOrToken);
    this.apiSecret = this.usingApiSecret ? apiSecretOrToken : null;
    this.userToken = this.usingApiSecret ? null : apiSecretOrToken;
    this.enrichByDefault = !this.usingApiSecret;

    if (this.userToken != null) {
      const jwtBody: { user_id?: string } = jwtDecode(this.userToken);
      if (!jwtBody.user_id) {
        throw new TypeError('user_id is missing in user token');
      }
      this.userId = jwtBody.user_id;
      this.currentUser = this.user(this.userId);
      this.authPayload = jwtBody;
    }

    this.appId = appId;
    this.options = options;
    this.version = this.options.version || 'v1.0';
    this.fayeUrl = this.options.fayeUrl || 'https://faye-us-east.stream-io-api.com/faye';
    this.fayeClient = null;
    // track a source name for the api calls, ie get started or databrowser
    this.group = this.options.group || 'unspecified';
    // track subscriptions made on feeds created by this client
    this.subscriptions = {};
    this.expireTokens = this.options.expireTokens ? this.options.expireTokens : false;
    // which data center to use
    this.location = this.options.location as string;
    this.baseUrl = this.getBaseUrl();

    if (process?.env?.LOCAL_FAYE) this.fayeUrl = 'http://localhost:9999/faye/';
    if (process?.env?.STREAM_ANALYTICS_BASE_URL) this.baseAnalyticsUrl = process.env.STREAM_ANALYTICS_BASE_URL;

    this.handlers = {};
    this.browser = typeof this.options.browser !== 'undefined' ? this.options.browser : typeof window !== 'undefined';
    this.node = !this.browser;

    if (this.node) {
      const keepAlive = this.options.keepAlive === undefined ? true : this.options.keepAlive;
      this.nodeOptions = {
        httpAgent: new http.Agent({ keepAlive, keepAliveMsecs: 3000 }),
        httpsAgent: new https.Agent({ keepAlive, keepAliveMsecs: 3000 }),
      };
    }

    this.request = axios.default.create({
      timeout: this.options.timeout || 10 * 1000, // 10 seconds
      withCredentials: false, // making sure cookies are not sent
      ...(this.nodeOptions || {}),
    });

    this.personalization = new Personalization<PersonalizationType>(this);

    if (this.browser && this.usingApiSecret) {
      throw new errors.FeedError(
        'You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.',
      );
    }
    this.collections = new Collections<CollectionType>(this, this.getOrCreateToken());
    this.files = new StreamFileStore(this, this.getOrCreateToken());
    this.images = new StreamImageStore(this, this.getOrCreateToken());
    this.reactions = new StreamReaction<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>(
      this,
      this.getOrCreateToken(),
    );

    // If we are in a node environment and batchOperations/createRedirectUrl is available add the methods to the prototype of StreamClient
    if (BatchOperations && createRedirectUrl) {
      this.addToMany = BatchOperations.addToMany;
      this.followMany = BatchOperations.followMany;
      this.unfollowMany = BatchOperations.unfollowMany;
      this.createRedirectUrl = createRedirectUrl;
    }
  }

  _throwMissingApiSecret() {
    if (!this.usingApiSecret) {
      throw new errors.SiteError(
        'This method can only be used server-side using your API Secret, use client = stream.connect(key, secret);',
      );
    }
  }

  getPersonalizationToken() {
    if (this._personalizationToken) return this._personalizationToken;

    this._throwMissingApiSecret();

    this._personalizationToken = signing.JWTScopeToken(this.apiSecret as string, 'personalization', '*', {
      userId: '*',
      feedId: '*',
      expireTokens: this.expireTokens,
    });
    return this._personalizationToken;
  }

  getCollectionsToken() {
    if (this._collectionsToken) return this._collectionsToken;

    this._throwMissingApiSecret();

    this._collectionsToken = signing.JWTScopeToken(this.apiSecret as string, 'collections', '*', {
      feedId: '*',
      expireTokens: this.expireTokens,
    });
    return this._collectionsToken;
  }

  getAnalyticsToken() {
    this._throwMissingApiSecret();

    return signing.JWTScopeToken(this.apiSecret as string, 'analytics', '*', {
      userId: '*',
      expireTokens: this.expireTokens,
    });
  }

  getBaseUrl(serviceName?: string) {
    if (!serviceName) serviceName = 'api';

    if (this.options.urlOverride && this.options.urlOverride[serviceName]) return this.options.urlOverride[serviceName];

    const urlEnvironmentKey = serviceName === 'api' ? 'STREAM_BASE_URL' : `STREAM_${serviceName.toUpperCase()}_URL`;
    if (process?.env?.[urlEnvironmentKey]) return process.env[urlEnvironmentKey] as string;

    if (process?.env?.LOCAL || this.options.local) return `http://localhost:8000/${serviceName}/`;

    if (this.location) {
      const protocol = this.options.protocol || 'https';
      return `${protocol}://${this.location}-${serviceName}.stream-io-api.com/${serviceName}/`;
    }

    if (serviceName !== 'api') return `https://${serviceName}.stream-io-api.com/${serviceName}/`;

    return this.baseUrl;
  }

  on(event: string, callback: HandlerCallback) {
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
    this.handlers[event] = callback;
  }

  off(key?: string) {
    /**
     * Remove one or more event handlers
     * @method off
     * @memberof StreamClient.prototype
     * @param {string} [key] - Name of the handler
     * @example
     * client.off() removes all handlers
     * client.off(name) removes the specified handler
     */
    if (key === undefined) {
      this.handlers = {};
    } else {
      delete this.handlers[key];
    }
  }

  send(key: string, ...args: unknown[]) {
    /**
     * Call the given handler with the arguments
     * @method send
     * @memberof StreamClient.prototype
     * @access private
     */
    if (this.handlers[key]) this.handlers[key].apply(this, args);
  }

  userAgent() {
    /**
     * Get the current user agent
     * @method userAgent
     * @memberof StreamClient.prototype
     * @return {string} current user agent
     */
    return `stream-javascript-client-${this.node ? 'node' : 'browser'}-${pkg.version}`;
  }

  getReadOnlyToken(feedSlug: string, userId: string) {
    /**
     * Returns a token that allows only read operations
     *
     * @method getReadOnlyToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example
     * client.getReadOnlyToken('user', '1');
     */
    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    return signing.JWTScopeToken(this.apiSecret as string, '*', 'read', {
      feedId: `${feedSlug}${userId}`,
      expireTokens: this.expireTokens,
    });
  }

  getReadWriteToken(feedSlug: string, userId: string) {
    /**
     * Returns a token that allows read and write operations
     *
     * @method getReadWriteToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example
     * client.getReadWriteToken('user', '1');
     */
    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    return signing.JWTScopeToken(this.apiSecret as string, '*', '*', {
      feedId: `${feedSlug}${userId}`,
      expireTokens: this.expireTokens,
    });
  }

  feed(
    feedSlug: string,
    userId?: string | StreamUser<UserType>,
    token?: string,
  ): StreamFeed<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType> {
    /**
     * Returns a feed object for the given feed id and token
     * @method feed
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug
     * @param {string} userId - The user identifier
     * @param {string} [token] - The token (DEPRECATED), used for internal testing
     * @return {StreamFeed}
     * @example
     * client.feed('user', '1');
     */
    if (userId instanceof StreamUser) userId = userId.id;

    if (token === undefined) {
      if (this.usingApiSecret) {
        token = signing.JWTScopeToken(this.apiSecret as string, '*', '*', { feedId: `${feedSlug}${userId}` });
      } else {
        token = this.userToken as string;
      }
    }

    return new StreamFeed<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>(
      this,
      feedSlug,
      userId || (this.userId as string),
      token,
    );
  }

  enrichUrl(relativeUrl: string, serviceName?: string) {
    /**
     * Combines the base url with version and the relative url
     * @method enrichUrl
     * @memberof StreamClient.prototype
     * @private
     * @param {string} relativeUrl
     */
    return `${this.getBaseUrl(serviceName)}${this.version}/${relativeUrl}`;
  }

  replaceReactionOptions = (options: {
    reactions?: Record<string, boolean>;
    withOwnReactions?: boolean;
    withRecentReactions?: boolean;
    withReactionCounts?: boolean;
    withOwnChildren?: boolean;
  }) => {
    // Shortcut options for reaction enrichment
    if (options?.reactions) {
      if (options.reactions.own != null) {
        options.withOwnReactions = options.reactions.own;
      }
      if (options.reactions.recent != null) {
        options.withRecentReactions = options.reactions.recent;
      }
      if (options.reactions.counts != null) {
        options.withReactionCounts = options.reactions.counts;
      }
      if (options.reactions.own_children != null) {
        options.withOwnChildren = options.reactions.own_children;
      }
      delete options.reactions;
    }
  };

  shouldUseEnrichEndpoint(
    options: {
      enrich?: boolean;
      ownReactions?: boolean;
      withRecentReactions?: boolean;
      withReactionCounts?: boolean;
      withOwnChildren?: boolean;
    } = {},
  ) {
    if (options.enrich) {
      const result = options.enrich;
      delete options.enrich;
      return result;
    }

    return (
      this.enrichByDefault ||
      options.ownReactions != null ||
      options.withRecentReactions != null ||
      options.withReactionCounts != null ||
      options.withOwnChildren != null
    );
  }

  enrichKwargs({ method, signature, ...kwargs }: AxiosConfig & { method: axios.Method }): axios.AxiosRequestConfig {
    /**
     * Adds the API key and the signature
     * @method enrichKwargs
     * @memberof StreamClient.prototype
     * @param {object} kwargs
     * @private
     */
    const isJWT = signing.isJWTSignature(signature);

    return {
      method,
      url: this.enrichUrl(kwargs.url, kwargs.serviceName),
      data: kwargs.body,
      params: {
        api_key: this.apiKey,
        location: this.group,
        ...(kwargs.qs || {}),
      },
      headers: {
        'X-Stream-Client': this.userAgent(),
        'stream-auth-type': isJWT ? 'jwt' : 'simple',
        Authorization: isJWT ? signature.split(' ').reverse()[0] : signature,
        ...(kwargs.headers || {}),
      },
      ...(kwargs.axiosOptions || {}),
    };
  }

  getFayeAuthorization(): Faye.Middleware {
    /**
     * Get the authorization middleware to use Faye with getstream.io
     * @method getFayeAuthorization
     * @memberof StreamClient.prototype
     * @private
     * @return {object} Faye authorization middleware
     */
    return {
      incoming: (message: Faye.Message, callback: Faye.Callback) => callback(message),
      outgoing: (message: Faye.Message, callback: Faye.Callback) => {
        if (message.subscription && this.subscriptions[message.subscription]) {
          const subscription = this.subscriptions[message.subscription];

          message.ext = {
            user_id: subscription.userId,
            api_key: this.apiKey,
            signature: subscription.token,
          };
        }

        callback(message);
      },
    };
  }

  getFayeClient(timeout = 10) {
    /**
     * Returns this client's current Faye client
     * @method getFayeClient
     * @memberof StreamClient.prototype
     * @private
     * @return {object} Faye client
     */
    if (this.fayeClient === null) {
      this.fayeClient = new Faye.Client(this.fayeUrl, { timeout });
      const authExtension = this.getFayeAuthorization();
      this.fayeClient.addExtension(authExtension);
    }

    return this.fayeClient;
  }

  handleResponse = <T>(response: axios.AxiosResponse<T>): T => {
    if (/^2/.test(`${response.status}`)) {
      this.send('response', null, response, response.data);
      return response.data;
    }

    throw new errors.StreamApiError(
      `${JSON.stringify(response.data)} with HTTP status code ${response.status}`,
      response.data,
      response,
    );
  };

  doAxiosRequest = async <T>(method: axios.Method, options: AxiosConfig): Promise<T> => {
    this.send('request', method, options);

    try {
      const response = await this.request(this.enrichKwargs({ method, ...options }));
      return this.handleResponse(response);
    } catch (error) {
      if (error.response) return this.handleResponse(error.response);
      throw new errors.SiteError(error.message);
    }
  };

  upload(
    url: string,
    uri: string | File | NodeJS.ReadStream,
    name?: string,
    contentType?: string,
    onUploadProgress?: OnUploadProgress,
  ) {
    const fd = utils.addFileToFormData(uri, name, contentType);
    return this.doAxiosRequest<FileUploadAPIResponse>('POST', {
      url,
      body: fd,
      headers: fd.getHeaders ? fd.getHeaders() : {}, // node vs browser
      signature: this.getOrCreateToken(),
      axiosOptions: {
        timeout: 0,
        maxContentLength: Infinity,
        onUploadProgress,
      },
    });
  }

  get<T>(kwargs: AxiosConfig) {
    /**
     * Shorthand function for get request
     * @method get
     * @memberof StreamClient.prototype
     * @private
     * @param  {object}    kwargs
     * @return {Promise}   Promise object
     */
    return this.doAxiosRequest<T>('GET', kwargs);
  }

  post<T>(kwargs: AxiosConfig) {
    /**
     * Shorthand function for post request
     * @method post
     * @memberof StreamClient.prototype
     * @private
     * @param  {object}    kwargs
     * @return {Promise}   Promise object
     */
    return this.doAxiosRequest<T>('POST', kwargs);
  }

  delete<T = APIResponse>(kwargs: AxiosConfig) {
    /**
     * Shorthand function for delete request
     * @method delete
     * @memberof StreamClient.prototype
     * @private
     * @param  {object}    kwargs
     * @return {Promise}   Promise object
     */
    return this.doAxiosRequest<T>('DELETE', kwargs);
  }

  put<T>(kwargs: AxiosConfig) {
    /**
     * Shorthand function for put request
     * @method put
     * @memberof StreamClient.prototype
     * @private
     * @param  {object}    kwargs
     * @return {Promise}   Promise object
     */
    return this.doAxiosRequest<T>('PUT', kwargs);
  }

  /**
   * @param {string} userId
   * @param {object} extraData
   */
  createUserToken(userId: string, extraData = {}) {
    this._throwMissingApiSecret();

    return signing.JWTUserSessionToken(this.apiSecret as string, userId, extraData, {
      noTimestamp: !this.expireTokens,
    });
  }

  updateActivities(activities: UpdateActivity<ActivityType>[]) {
    /**
     * Updates all supplied activities on the getstream-io api
     * @since  3.1.0
     * @param  {array} activities list of activities to update
     * @return {Promise}
     */
    this._throwMissingApiSecret();

    if (!(activities instanceof Array)) {
      throw new TypeError('The activities argument should be an Array');
    }

    const authToken = signing.JWTScopeToken(this.apiSecret as string, 'activities', '*', {
      feedId: '*',
      expireTokens: this.expireTokens,
    });

    return this.post<APIResponse>({
      url: 'activities/',
      body: { activities },
      signature: authToken,
    });
  }

  updateActivity(activity: UpdateActivity<ActivityType>) {
    /**
     * Updates one activity on the getstream-io api
     * @since  3.1.0
     * @param  {object} activity The activity to update
     * @return {Promise}
     */
    this._throwMissingApiSecret();

    return this.updateActivities([activity]);
  }

  getActivities({
    ids,
    foreignIDTimes,
    ...params
  }: EnrichOptions & {
    ids?: string[];
    foreignIDTimes?: { foreignID: string; time: Date }[];
    reactions?: Record<string, boolean>;
  }) {
    /**
     * Retrieve activities by ID or foreign ID and time
     * @since  3.19.0
     * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign IDs and time as {foreignIDTimes: [{foreignID: ..., time: ...}, ...]}
     * @return {Promise}
     */
    const extraParams: { ids?: string; foreign_ids?: string; timestamps?: string } = {};

    if (ids) {
      if (!(ids instanceof Array)) {
        throw new TypeError('The ids argument should be an Array');
      }
      extraParams.ids = ids.join(',');
    } else if (foreignIDTimes) {
      if (!(foreignIDTimes instanceof Array)) {
        throw new TypeError('The foreignIDTimes argument should be an Array');
      }
      const foreignIDs: string[] = [];
      const timestamps: Date[] = [];
      foreignIDTimes.forEach((fidTime) => {
        if (!(fidTime instanceof Object)) {
          throw new TypeError('foreignIDTimes elements should be Objects');
        }
        foreignIDs.push(fidTime.foreignID);
        timestamps.push(fidTime.time);
      });

      extraParams.foreign_ids = foreignIDs.join(',');
      extraParams.timestamps = timestamps.join(',');
    } else {
      throw new TypeError('Missing ids or foreignIDTimes params');
    }

    let token = this.userToken as string;
    if (this.usingApiSecret) {
      token = signing.JWTScopeToken(this.apiSecret as string, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens,
      });
    }

    this.replaceReactionOptions(params);
    const path = this.shouldUseEnrichEndpoint(params) ? 'enrich/activities/' : 'activities/';

    return this.get<GetActivitiesAPIResponse<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>>({
      url: path,
      qs: { ...params, ...extraParams },
      signature: token,
    });
  }

  getOrCreateToken() {
    if (!this._getOrCreateToken) {
      this._getOrCreateToken = this.usingApiSecret
        ? signing.JWTScopeToken(this.apiSecret as string, '*', '*', { feedId: '*' })
        : (this.userToken as string);
    }
    return this._getOrCreateToken;
  }

  user(userId: string): StreamUser<UserType> {
    return new StreamUser<UserType>(this, userId, this.getOrCreateToken());
  }

  async setUser(data: UserType) {
    if (this.usingApiSecret) {
      throw new errors.SiteError('This method can only be used client-side using a user token');
    }

    const body = { ...data };
    // @ts-expect-error
    delete body?.id;

    const user = await (this.currentUser as StreamUser<UserType>).getOrCreate(body);
    this.currentUser = user;
    return user;
  }

  og(url: string) {
    return this.get<OGAPIResponse>({
      url: 'og/',
      qs: { url },
      signature: this.getOrCreateToken(),
    });
  }

  personalizedFeed(options: GetFeedOptions = {}) {
    return this.get<
      PersonalizationFeedAPIResponse<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType>
    >({
      url: 'enrich/personalization/feed/',
      qs: options,
      signature: this.getOrCreateToken(),
    });
  }

  async activityPartialUpdate(data: ActivityPartialChanges): Promise<APIResponse & Activity<ActivityType>> {
    /**
     * Update a single activity with partial operations.
     * @since 3.20.0
     * @param {object} data object containing either the ID or the foreign ID and time of the activity and the operations to issue as set:{...} and unset:[...].
     * @return {Promise}
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
     *   foreignID: "product:123",
     *   time: "2016-11-10T13:20:00.000000",
     *   set: {
     *     ...
     *   },
     *   unset: [
     *     ...
     *   ]
     * })
     */
    const response = await this.activitiesPartialUpdate([data]);
    const activity = response.activities[0];
    delete response.activities;
    return { ...activity, ...response };
  }

  activitiesPartialUpdate(changes: ActivityPartialChanges[]) {
    /**
     * Update multiple activities with partial operations.
     * @since v3.20.0
     * @param {array} changes array containing the changesets to be applied. Every changeset contains the activity identifier which is either the ID or the pair of of foreign ID and time of the activity. The operations to issue can be set:{...} and unset:[...].
     * @return {Promise}
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
     *     foreignID: "product:123",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     *   {
     *     foreignID: "product:321",
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
    if (!(changes instanceof Array)) {
      throw new TypeError('changes should be an Array');
    }
    changes.forEach(function (item: ActivityPartialChanges & { foreign_id?: string }) {
      if (!(item instanceof Object)) {
        throw new TypeError(`changeset should be and Object`);
      }
      if (item.foreignID) {
        item.foreign_id = item.foreignID;
      }
      if (item.id === undefined && (item.foreign_id === undefined || item.time === undefined)) {
        throw new TypeError('missing id or foreign ID and time');
      }
      if (item.set && !(item.set instanceof Object)) {
        throw new TypeError('set field should be an Object');
      }
      if (item.unset && !(item.unset instanceof Array)) {
        throw new TypeError('unset field should be an Array');
      }
    });

    let authToken = this.userToken as string;
    if (this.usingApiSecret) {
      authToken = signing.JWTScopeToken(this.apiSecret as string, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens,
      });
    }

    return this.post<APIResponse & { activities: Activity<ActivityType>[] }>({
      url: 'activity/',
      body: {
        changes,
      },
      signature: authToken,
    });
  }
}

export default StreamClient;
