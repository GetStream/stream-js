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
    this.url = 'user/' + this.id + '/';
  }

  _streamRef() {
    return `SU:${this.id}`;
  }

  ref() {
    return this._streamRef();
  }

  delete(callback) {
    return this.client
      .delete({
        url: this.url,
        signature: this.token,
      })
      .then((response) => {
        if (callback) {
          callback(response);
        }
        return response;
      });
  }

  get(options, callback) {
    return this.client
      .get({
        url: this.url,
        signature: this.token,
        qs: options,
      })
      .then((response) => {
        this.full = Object.assign({}, response);
        delete this.full.duration;
        this.data = this.full.data;
        if (callback) {
          callback(response);
        }
        return this;
      });
  }

  _chooseData(data) {
    if (data !== undefined) {
      return data;
    }
    if (this.data !== undefined) {
      return this.data;
    }
    return {};
  }

  create(data, options, callback) {
    return this.client
      .post({
        url: 'user/',
        body: {
          id: this.id,
          data: this._chooseData(data),
        },
        qs: options,
        signature: this.token,
      })
      .then((response) => {
        this.full = Object.assign({}, response);
        delete this.full.duration;
        this.data = this.full.data;
        if (callback) {
          callback(response);
        }
        return this;
      });
  }

  update(data, callback) {
    return this.client
      .put({
        url: this.url,
        body: {
          data: this._chooseData(data),
        },
        signature: this.token,
      })
      .then((response) => {
        this.full = Object.assign({}, response);
        delete this.full.duration;
        this.data = this.full.data;
        if (callback) {
          callback(response);
        }
        return this;
      });
  }

  getOrCreate(data, callback) {
    return this.create(data, { get_or_create: true }, callback);
  }

  profile(callback) {
    return this.get({ with_follow_counts: true }, callback);
  }
}
