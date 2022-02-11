/// <reference path="../types/modules.d.ts" />

import * as axios from 'axios';
import * as Faye from 'faye';
import * as http from 'http';
import * as https from 'https';
import jwtDecode from 'jwt-decode';

import { Personalization } from './personalization';
import { Collections } from './collections';
import { StreamFileStore } from './files';
import { StreamImageStore } from './images';
import { StreamReaction } from './reaction';
import { StreamUser } from './user';
import { JWTScopeToken, JWTUserSessionToken } from './signing';
import { FeedError, StreamApiError, SiteError } from './errors';
import utils from './utils';
import BatchOperations, { FollowRelation, UnfollowRelation } from './batch_operations';
import createRedirectUrl from './redirect_url';
import {
  StreamFeed,
  UpdateActivity,
  Activity,
  EnrichOptions,
  PersonalizationFeedAPIResponse,
  GetActivitiesAPIResponse,
  GetFeedOptions,
  EnrichedActivity,
} from './feed';

// TODO: no import since typescript json loader shifts the final output structure
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

export type UR = Record<string, unknown>;
export type UnknownRecord = UR; // alias to avoid breaking change

export type DefaultGenerics = {
  activityType: UR;
  childReactionType: UR;
  collectionType: UR;
  personalizationType: UR;
  reactionType: UR;
  userType: UR;
};

export type APIResponse = { duration?: string };

export type FileUploadAPIResponse = APIResponse & { file: string };

export type OnUploadProgress = (progressEvent: ProgressEvent) => void;

export type ClientOptions = {
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

type OGResource = {
  secure_url?: string;
  type?: string;
  url?: string;
};

type OGAudio = OGResource & {
  audio?: string;
};

type OGImage = OGResource & {
  alt?: string;
  height?: number;
  image?: string;
  width?: number;
};

type OGVideo = OGResource & {
  height?: number;
  video?: string;
  width?: number;
};

export type OGAPIResponse = APIResponse & {
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

type AxiosConfig = {
  token: string;
  url: string;
  axiosOptions?: axios.AxiosRequestConfig;
  body?: unknown;
  headers?: UR;
  qs?: UR;
  serviceName?: string;
};

export type HandlerCallback = (...args: unknown[]) => unknown;

export type ForeignIDTimes = { foreign_id: string; time: Date | string } | { foreignID: string; time: Date | string };

export type ActivityPartialChanges<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> =
  Partial<ForeignIDTimes> & {
    id?: string;
    set?: Partial<StreamFeedGenerics['activityType']>;
    unset?: Array<Extract<keyof StreamFeedGenerics['activityType'], string>>;
  };

export type RealTimeMessage<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
  deleted: Array<string>;
  deleted_foreign_ids: Array<[id: string, time: string]>;
  new: Array<
    Omit<
      EnrichedActivity<StreamFeedGenerics>,
      'latest_reactions' | 'latest_reactions_extra' | 'own_reactions' | 'own_reactions_extra' | 'reaction_counts'
    > & { group?: string }
  >;
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
export class StreamClient<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
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
  nodeOptions?: { httpAgent: http.Agent; httpsAgent: https.Agent };

  request: axios.AxiosInstance;
  subscriptions: Record<
    string,
    { fayeSubscription: Faye.Subscription | Promise<Faye.Subscription>; token: string; userId: string }
  >;
  handlers: Record<string, HandlerCallback>;

  currentUser?: StreamUser<StreamFeedGenerics>;
  personalization: Personalization<StreamFeedGenerics>;
  collections: Collections<StreamFeedGenerics>;
  files: StreamFileStore;
  images: StreamImageStore;
  reactions: StreamReaction<StreamFeedGenerics>;

  private _personalizationToken?: string;
  private _collectionsToken?: string;
  private _getOrCreateToken?: string;

  addToMany?: <StreamFeedGenerics extends DefaultGenerics = DefaultGenerics>( // eslint-disable-line no-shadow
    this: StreamClient, // eslint-disable-line no-use-before-define
    activity: StreamFeedGenerics['activityType'],
    feeds: string[],
  ) => Promise<APIResponse>; // eslint-disable-line no-use-before-define
  followMany?: (this: StreamClient, follows: FollowRelation[], activityCopyLimit?: number) => Promise<APIResponse>; // eslint-disable-line no-use-before-define
  unfollowMany?: (this: StreamClient, unfollows: UnfollowRelation[]) => Promise<APIResponse>; // eslint-disable-line no-use-before-define
  createRedirectUrl?: (this: StreamClient, targetUrl: string, userId: string, events: unknown[]) => string; // eslint-disable-line no-use-before-define

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
  constructor(apiKey: string, apiSecretOrToken: string | null, appId?: string, options: ClientOptions = {}) {
    this.baseUrl = 'https://api.stream-io-api.com/api/';
    this.baseAnalyticsUrl = 'https://analytics.stream-io-api.com/analytics/';
    this.apiKey = apiKey;
    this.usingApiSecret = apiSecretOrToken != null && !apiSecretOrToken.includes(`.`);
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

    if (typeof process !== 'undefined' && process.env?.LOCAL_FAYE) this.fayeUrl = 'http://localhost:9999/faye/';
    if (typeof process !== 'undefined' && process.env?.STREAM_ANALYTICS_BASE_URL)
      this.baseAnalyticsUrl = process.env.STREAM_ANALYTICS_BASE_URL;

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

    this.personalization = new Personalization<StreamFeedGenerics>(this);

    if (this.browser && this.usingApiSecret) {
      throw new FeedError(
        'You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.',
      );
    }
    this.collections = new Collections<StreamFeedGenerics>(this, this.getOrCreateToken());
    this.files = new StreamFileStore(this as StreamClient, this.getOrCreateToken());
    this.images = new StreamImageStore(this as StreamClient, this.getOrCreateToken());
    this.reactions = new StreamReaction<StreamFeedGenerics>(this, this.getOrCreateToken());

    // If we are in a node environment and batchOperations/createRedirectUrl is available add the methods to the prototype of StreamClient
    if (BatchOperations && !!createRedirectUrl) {
      this.addToMany = BatchOperations.addToMany;
      this.followMany = BatchOperations.followMany;
      this.unfollowMany = BatchOperations.unfollowMany;
      this.createRedirectUrl = createRedirectUrl;
    }
  }

  _throwMissingApiSecret() {
    if (!this.usingApiSecret) {
      throw new SiteError(
        'This method can only be used server-side using your API Secret, use client = stream.connect(key, secret);',
      );
    }
  }

  getPersonalizationToken() {
    if (this._personalizationToken) return this._personalizationToken;

    this._throwMissingApiSecret();

    this._personalizationToken = JWTScopeToken(this.apiSecret as string, 'personalization', '*', {
      userId: '*',
      feedId: '*',
      expireTokens: this.expireTokens,
    });
    return this._personalizationToken;
  }

  getCollectionsToken() {
    if (this._collectionsToken) return this._collectionsToken;

    this._throwMissingApiSecret();

    this._collectionsToken = JWTScopeToken(this.apiSecret as string, 'collections', '*', {
      feedId: '*',
      expireTokens: this.expireTokens,
    });
    return this._collectionsToken;
  }

  getAnalyticsToken() {
    this._throwMissingApiSecret();

    return JWTScopeToken(this.apiSecret as string, 'analytics', '*', {
      userId: '*',
      expireTokens: this.expireTokens,
    });
  }

  getBaseUrl(serviceName?: string) {
    if (!serviceName) serviceName = 'api';

    if (this.options.urlOverride && this.options.urlOverride[serviceName]) return this.options.urlOverride[serviceName];

    const urlEnvironmentKey = serviceName === 'api' ? 'STREAM_BASE_URL' : `STREAM_${serviceName.toUpperCase()}_URL`;
    if (typeof process !== 'undefined' && process.env?.[urlEnvironmentKey])
      return process.env[urlEnvironmentKey] as string;

    if ((typeof process !== 'undefined' && process.env?.LOCAL) || this.options.local)
      return `http://localhost:8000/${serviceName}/`;

    if (this.location) {
      const protocol = this.options.protocol || 'https';
      return `${protocol}://${this.location}-${serviceName}.stream-io-api.com/${serviceName}/`;
    }

    if (serviceName !== 'api') return `https://${serviceName}.stream-io-api.com/${serviceName}/`;

    return this.baseUrl;
  }

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
  on(event: string, callback: HandlerCallback) {
    this.handlers[event] = callback;
  }

  /**
   * Remove one or more event handlers
   * @method off
   * @memberof StreamClient.prototype
   * @param {string} [key] - Name of the handler
   * @example
   * client.off() removes all handlers
   * client.off(name) removes the specified handler
   */
  off(key?: string) {
    if (key === undefined) {
      this.handlers = {};
    } else {
      delete this.handlers[key];
    }
  }

  /**
   * Call the given handler with the arguments
   * @method send
   * @memberof StreamClient.prototype
   * @access private
   */
  send(key: string, ...args: unknown[]) {
    if (this.handlers[key]) this.handlers[key].apply(this, args);
  }

  /**
   * Get the current user agent
   * @method userAgent
   * @memberof StreamClient.prototype
   * @return {string} current user agent
   */
  userAgent() {
    return `stream-javascript-client-${this.node ? 'node' : 'browser'}-${pkg.version}`;
  }

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
  getReadOnlyToken(feedSlug: string, userId: string) {
    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    return JWTScopeToken(this.apiSecret as string, '*', 'read', {
      feedId: `${feedSlug}${userId}`,
      expireTokens: this.expireTokens,
    });
  }

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
  getReadWriteToken(feedSlug: string, userId: string) {
    utils.validateFeedSlug(feedSlug);
    utils.validateUserId(userId);

    return JWTScopeToken(this.apiSecret as string, '*', '*', {
      feedId: `${feedSlug}${userId}`,
      expireTokens: this.expireTokens,
    });
  }

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
  feed(
    feedSlug: string,
    userId?: string | StreamUser<StreamFeedGenerics>,
    token?: string,
  ): StreamFeed<StreamFeedGenerics> {
    if (userId instanceof StreamUser) userId = userId.id;

    if (token === undefined) {
      if (this.usingApiSecret) {
        token = JWTScopeToken(this.apiSecret as string, '*', '*', { feedId: `${feedSlug}${userId}` });
      } else {
        token = this.userToken as string;
      }
    }

    return new StreamFeed<StreamFeedGenerics>(this, feedSlug, userId || (this.userId as string), token);
  }

  /**
   * Combines the base url with version and the relative url
   * @method enrichUrl
   * @memberof StreamClient.prototype
   * @private
   * @param {string} relativeUrl
   * @param {string} [serviceName]
   * @return {string}
   */
  enrichUrl(relativeUrl: string, serviceName?: string) {
    return `${this.getBaseUrl(serviceName)}${this.version}/${relativeUrl}`;
  }

  replaceReactionOptions = (options: {
    reactions?: Record<string, boolean>;
    withOwnChildren?: boolean;
    withOwnReactions?: boolean;
    withReactionCounts?: boolean;
    withRecentReactions?: boolean;
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
      withOwnChildren?: boolean;
      withReactionCounts?: boolean;
      withRecentReactions?: boolean;
    } = {},
  ) {
    if (options.enrich !== undefined) {
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

  /**
   * Adds the API key and the token
   * @method enrichKwargs
   * @private
   * @memberof StreamClient.prototype
   * @param {AxiosConfig} kwargs
   * @return {axios.AxiosRequestConfig}
   */
  enrichKwargs({ method, token, ...kwargs }: AxiosConfig & { method: axios.Method }): axios.AxiosRequestConfig {
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
        'stream-auth-type': 'jwt',
        Authorization: token,
        ...(kwargs.headers || {}),
      },
      ...(kwargs.axiosOptions || {}),
    };
  }

  /**
   * Get the authorization middleware to use Faye with getstream.io
   * @method getFayeAuthorization
   * @memberof StreamClient.prototype
   * @private
   * @return {Faye.Middleware} Faye authorization middleware
   */
  getFayeAuthorization() {
    return {
      incoming: (
        message: Faye.Message<RealTimeMessage<StreamFeedGenerics>>,
        callback: Faye.Callback<RealTimeMessage<StreamFeedGenerics>>,
      ) => callback(message),
      outgoing: (
        message: Faye.Message<RealTimeMessage<StreamFeedGenerics>>,
        callback: Faye.Callback<RealTimeMessage<StreamFeedGenerics>>,
      ) => {
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

  /**
   * Returns this client's current Faye client
   * @method getFayeClient
   * @memberof StreamClient.prototype
   * @private
   * @param {number} timeout
   * @return {Faye.Client} Faye client
   */
  getFayeClient(timeout = 10) {
    if (this.fayeClient === null) {
      this.fayeClient = new Faye.Client<RealTimeMessage<StreamFeedGenerics>>(this.fayeUrl, { timeout });
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

    throw new StreamApiError<T>(
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
      const err = error as StreamApiError<T>;
      if (err.response) return this.handleResponse(err.response);
      throw new SiteError(err.message);
    }
  };

  upload(
    url: string,
    uri: string | File | Buffer | NodeJS.ReadStream,
    name?: string,
    contentType?: string,
    onUploadProgress?: OnUploadProgress,
  ) {
    const fd = utils.addFileToFormData(uri, name, contentType);
    return this.doAxiosRequest<FileUploadAPIResponse>('POST', {
      url,
      body: fd,
      headers: fd.getHeaders ? fd.getHeaders() : {}, // node vs browser
      token: this.getOrCreateToken(),
      axiosOptions: {
        timeout: 0,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress,
      },
    });
  }

  /**
   * Shorthand function for get request
   * @method get
   * @memberof StreamClient.prototype
   * @private
   * @param  {AxiosConfig}    kwargs
   * @return {Promise}   Promise object
   */
  get<T>(kwargs: AxiosConfig) {
    return this.doAxiosRequest<T>('GET', kwargs);
  }

  /**
   * Shorthand function for post request
   * @method post
   * @memberof StreamClient.prototype
   * @private
   * @param  {AxiosConfig}    kwargs
   * @return {Promise}   Promise object
   */
  post<T>(kwargs: AxiosConfig) {
    return this.doAxiosRequest<T>('POST', kwargs);
  }

  /**
   * Shorthand function for delete request
   * @method delete
   * @memberof StreamClient.prototype
   * @private
   * @param  {AxiosConfig}    kwargs
   * @return {Promise}   Promise object
   */
  delete<T = APIResponse>(kwargs: AxiosConfig) {
    return this.doAxiosRequest<T>('DELETE', kwargs);
  }

  /**
   * Shorthand function for put request
   * @method put
   * @memberof StreamClient.prototype
   * @private
   * @param  {AxiosConfig}    kwargs
   * @return {Promise}   Promise object
   */
  put<T>(kwargs: AxiosConfig) {
    return this.doAxiosRequest<T>('PUT', kwargs);
  }

  /**
   * create a user token
   * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#generate-user-token-server-side
   * @param {string} userId
   * @param {object} extraData
   * @return {string}
   */
  createUserToken(userId: string, extraData = {}) {
    this._throwMissingApiSecret();

    return JWTUserSessionToken(this.apiSecret as string, userId, extraData, {
      noTimestamp: !this.expireTokens,
    });
  }

  /**
   * Updates all supplied activities on the stream
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
   * @param  {UpdateActivity<StreamFeedGenerics>[]} activities list of activities to update
   * @return {Promise<APIResponse>}
   */
  updateActivities(activities: UpdateActivity<StreamFeedGenerics>[]) {
    this._throwMissingApiSecret();

    if (!(activities instanceof Array)) {
      throw new TypeError('The activities argument should be an Array');
    }

    const token = JWTScopeToken(this.apiSecret as string, 'activities', '*', {
      feedId: '*',
      expireTokens: this.expireTokens,
    });

    return this.post<APIResponse>({
      url: 'activities/',
      body: { activities },
      token,
    });
  }

  /**
   * Updates one activity on the stream
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
   * @param  {UpdateActivity<StreamFeedGenerics>} activity The activity to update
   * @return {Promise<APIResponse>}
   */
  updateActivity(activity: UpdateActivity<StreamFeedGenerics>) {
    this._throwMissingApiSecret();

    return this.updateActivities([activity]);
  }

  /**
   * Retrieve activities by ID or foreign_id and time
   * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-get-activities-by-id
   * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign_ids and time as {foreignIDTimes: [{foreign_id: ..., time: ...}, ...]}
   * @return {Promise<GetActivitiesAPIResponse>}
   */
  getActivities({
    ids,
    foreignIDTimes,
    ...params
  }: EnrichOptions & {
    foreignIDTimes?: ForeignIDTimes[];
    ids?: string[];
    reactions?: Record<string, boolean>;
  }) {
    const extraParams: { foreign_ids?: string; ids?: string; timestamps?: string } = {};

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
      const timestamps: (Date | string)[] = [];
      foreignIDTimes.forEach((fidTime) => {
        if (!(fidTime instanceof Object)) {
          throw new TypeError('foreignIDTimes elements should be Objects');
        }
        foreignIDs.push((fidTime as { foreign_id: string }).foreign_id || (fidTime as { foreignID: string }).foreignID);
        timestamps.push(fidTime.time);
      });

      extraParams.foreign_ids = foreignIDs.join(',');
      extraParams.timestamps = timestamps.join(',');
    } else {
      throw new TypeError('Missing ids or foreignIDTimes params');
    }

    let token = this.userToken as string;
    if (this.usingApiSecret) {
      token = JWTScopeToken(this.apiSecret as string, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens,
      });
    }

    this.replaceReactionOptions(params);
    const path = this.shouldUseEnrichEndpoint(params) ? 'enrich/activities/' : 'activities/';

    return this.get<GetActivitiesAPIResponse<StreamFeedGenerics>>({
      url: path,
      qs: { ...params, ...extraParams },
      token,
    });
  }

  getOrCreateToken() {
    if (!this._getOrCreateToken) {
      this._getOrCreateToken = this.usingApiSecret
        ? JWTScopeToken(this.apiSecret as string, '*', '*', { feedId: '*' })
        : (this.userToken as string);
    }
    return this._getOrCreateToken;
  }

  user(userId: string) {
    return new StreamUser<StreamFeedGenerics>(this, userId, this.getOrCreateToken());
  }

  async setUser(data: StreamFeedGenerics['userType']) {
    if (this.usingApiSecret) {
      throw new SiteError('This method can only be used client-side using a user token');
    }

    const body = { ...data };
    delete body.id;

    const user = await (this.currentUser as StreamUser<StreamFeedGenerics>).getOrCreate(body);
    this.currentUser = user;
    return user;
  }

  og(url: string) {
    return this.get<OGAPIResponse>({
      url: 'og/',
      qs: { url },
      token: this.getOrCreateToken(),
    });
  }

  personalizedFeed(options: GetFeedOptions = {}) {
    return this.get<PersonalizationFeedAPIResponse<StreamFeedGenerics>>({
      url: 'enrich/personalization/feed/',
      qs: options,
      token: this.getOrCreateToken(),
    });
  }

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
  async activityPartialUpdate(
    data: ActivityPartialChanges<StreamFeedGenerics>,
  ): Promise<APIResponse & Activity<StreamFeedGenerics>> {
    const { activities, ...response } = await this.activitiesPartialUpdate([data]);
    const [activity] = activities;
    return { ...activity, ...response };
  }

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
  activitiesPartialUpdate(changes: ActivityPartialChanges<StreamFeedGenerics>[]) {
    if (!(changes instanceof Array)) {
      throw new TypeError('changes should be an Array');
    }
    changes.forEach(
      (item: ActivityPartialChanges<StreamFeedGenerics> & { foreign_id?: string; foreignID?: string }) => {
        if (!(item instanceof Object)) {
          throw new TypeError(`changeset should be and Object`);
        }
        if (item.foreignID) {
          item.foreign_id = item.foreignID;
        }
        if (item.id === undefined && (item.foreign_id === undefined || item.time === undefined)) {
          throw new TypeError('missing id or foreign_id and time');
        }
        if (item.set && !(item.set instanceof Object)) {
          throw new TypeError('set field should be an Object');
        }
        if (item.unset && !(item.unset instanceof Array)) {
          throw new TypeError('unset field should be an Array');
        }
      },
    );

    let token = this.userToken as string;
    if (this.usingApiSecret) {
      token = JWTScopeToken(this.apiSecret as string, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens,
      });
    }

    return this.post<APIResponse & { activities: Activity<StreamFeedGenerics>[] }>({
      url: 'activity/',
      body: { changes },
      token,
    });
  }
}
