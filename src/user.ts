import StreamClient, { APIResponse } from './client';

export type UserAPIResponse<UserType> = APIResponse & {
  id: string;
  data: UserType;
  created_at: Date;
  updated_at: Date;
  followers_count?: number;
  following_count?: number;
};

export default class StreamUser<UserType> {
  client: StreamClient;
  token: string;
  id: string;
  data?: UserType;
  full?: UserAPIResponse<UserType>;
  private url: string;

  constructor(client: StreamClient, userId: string, userAuthToken: string) {
    /**
     * Initialize a user session object
     * @method constructor
     * @memberof StreamUser.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} userId The ID of the user
     * @param {string} userAuthToken JWT token
     * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.full = undefined;
    this.token = userAuthToken;
    this.url = `user/${this.id}/`;
  }

  ref() {
    return `SU:${this.id}`;
  }

  delete() {
    return this.client.delete({
      url: this.url,
      signature: this.token,
    });
  }

  async get(options: { with_follow_counts?: boolean }) {
    const response = await this.client.get<UserAPIResponse<UserType>>({
      url: this.url,
      signature: this.token,
      qs: options,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  async create(data: UserType, options: { get_or_create?: boolean }) {
    const response = await this.client.post<UserAPIResponse<UserType>>({
      url: 'user/',
      body: {
        id: this.id,
        data: data || this.data || {},
      },
      qs: options,
      signature: this.token,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  async update(data?: Partial<UserType>) {
    const response = await this.client.put<UserAPIResponse<UserType>>({
      url: this.url,
      body: {
        data: data || this.data || {},
      },
      signature: this.token,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  getOrCreate(data: UserType) {
    return this.create(data, { get_or_create: true });
  }

  profile() {
    return this.get({ with_follow_counts: true });
  }
}
