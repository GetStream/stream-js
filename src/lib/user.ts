export default class StreamUser {
  constructor(client, userId, userAuthToken) {
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

  ref() {
    return `SU:${this.id}`;
  }

  delete() {
    return this.client.delete({
      url: this.url,
      signature: this.token,
    });
  }

  async get(options) {
    const response = await this.client.get({
      url: this.url,
      signature: this.token,
      qs: options,
    });

    this.full = { ...response };
    delete this.full.duration;
    this.data = this.full.data;
    return this;
  }

  async create(data, options) {
    const response = await this.client.post({
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

  async update(data) {
    const response = await this.client.put({
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

  getOrCreate(data) {
    return this.create(data, { get_or_create: true });
  }

  profile() {
    return this.get({ with_follow_counts: true });
  }
}
