import { StreamClient, APIResponse, UR } from './client';

export type EnrichedUser<UserType extends UR = UR> = {
  created_at: string;
  data: UserType;
  id: string;
  updated_at: string;
};

export type UserAPIResponse<UserType extends UR = UR> = APIResponse &
  EnrichedUser<UserType> & {
    // present only in profile response
    followers_count?: number;
    following_count?: number;
  };

export class StreamUser<
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
  data?: UserType;
  full?: UserAPIResponse<UserType>;
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
  constructor(
    client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
    userId: string,
    userAuthToken: string,
  ) {
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
    const response = await this.client.get<UserAPIResponse<UserType>>({
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
  async create(data?: UserType, options?: { get_or_create?: boolean }) {
    const response = await this.client.post<UserAPIResponse<UserType>>({
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
  async update(data?: Partial<UserType>) {
    const response = await this.client.put<UserAPIResponse<UserType>>({
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
  getOrCreate(data: UserType) {
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
