import StreamClient, { APIResponse } from './client';

type UserAPIResponse<UserType> = APIResponse & {
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
     * @param {string} token JWT token
     * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.full = undefined;
    this.token = userAuthToken;
    this.url = `user/${this.id}/`;
  }

  ref(): string {
    return `SU:${this.id}`;
  }

  delete(): Promise<APIResponse> {
    return this.client.delete<APIResponse>({
      url: this.url,
      signature: this.token,
    });
  }

  async get(options: { with_follow_counts?: boolean }): Promise<StreamUser<UserType>> {
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

  async create(data: UserType, options: { get_or_create?: boolean }): Promise<StreamUser<UserType>> {
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

  async update(data?: Record<string, unknown>): Promise<StreamUser<UserType>> {
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

  getOrCreate(data: UserType): Promise<StreamUser<UserType>> {
    return this.create(data, { get_or_create: true });
  }

  profile(): Promise<StreamUser<UserType>> {
    return this.get({ with_follow_counts: true });
  }
}
