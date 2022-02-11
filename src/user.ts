import { StreamClient, APIResponse, DefaultGenerics } from './client';

export type EnrichedUser<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
  created_at: string;
  data: StreamFeedGenerics['userType'];
  id: string;
  updated_at: string;
};

export type UserAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse &
  EnrichedUser<StreamFeedGenerics> & {
    // present only in profile response
    followers_count?: number;
    following_count?: number;
  };

export class StreamUser<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  client: StreamClient<StreamFeedGenerics>;
  token: string;
  id: string;
  data?: StreamFeedGenerics['userType'];
  full?: UserAPIResponse<StreamFeedGenerics>;
  private url: string;

  /**
   * Initialize a user session object
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js
   * @method constructor
   * @memberof StreamUser.prototype
   * @param {StreamClient} client Stream client this collection is constructed from
   * @param {string} userId The ID of the user
   * @param {string} userAuthToken JWT token
   * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
   */
  constructor(client: StreamClient<StreamFeedGenerics>, userId: string, userAuthToken: string) {
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.full = undefined;
    this.token = userAuthToken;
    this.url = `user/${this.id}/`;
  }

  /**
   * Create a stream user ref
   * @return {string}
   */
  ref() {
    return `SU:${this.id}`;
  }

  /**
   * Delete the user
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#removing-users
   * @return {Promise<APIResponse>}
   */
  delete() {
    return this.client.delete({
      url: this.url,
      token: this.token,
    });
  }

  /**
   * Get the user data
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
   * @param {boolean} [options.with_follow_counts]
   * @return {Promise<StreamUser>}
   */
  async get(options?: { with_follow_counts?: boolean }) {
    const response = await this.client.get<UserAPIResponse<StreamFeedGenerics>>({
      url: this.url,
      token: this.token,
      qs: options,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  /**
   * Create a new user in stream
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
   * @param {object} data user date stored in stream
   * @param {boolean} [options.get_or_create] if user already exists return it
   * @return {Promise<StreamUser>}
   */
  async create(data?: StreamFeedGenerics['userType'], options?: { get_or_create?: boolean }) {
    const response = await this.client.post<UserAPIResponse<StreamFeedGenerics>>({
      url: 'user/',
      body: {
        id: this.id,
        data: data || this.data || {},
      },
      qs: options,
      token: this.token,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  /**
   * Update the user
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#updating-users
   * @param {object} data user date stored in stream
   * @return {Promise<StreamUser>}
   */
  async update(data?: Partial<StreamFeedGenerics['userType']>) {
    const response = await this.client.put<UserAPIResponse<StreamFeedGenerics>>({
      url: this.url,
      body: {
        data: data || this.data || {},
      },
      token: this.token,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  /**
   * Get or Create a new user in stream
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
   * @param {object} data user date stored in stream
   * @return {Promise<StreamUser>}
   */
  getOrCreate(data: StreamFeedGenerics['userType']) {
    return this.create(data, { get_or_create: true });
  }

  /**
   * Get the user profile, it includes the follow counts by default
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
   * @return {Promise<StreamUser>}
   */
  profile() {
    return this.get({ with_follow_counts: true });
  }
}
