var StreamUser = function() {
  this.initialize.apply(this, arguments);
};

StreamUser.prototype = {
  initialize: function(client, userId, userAuthToken) {
    /**
     * Initialize a user session object
     * @method intialize
     * @memberof StreamUser.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} userId The ID of the user
     * @param {string} token JWT token
     * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.token = userAuthToken;
    this.url = 'user/' + this.id + '/';
  },

  get: async function(options) {
    let response = await this.client.get({
      url: this.url,
      signature: this.token,
      qs: options,
    });
    this.data = response.data;
    return response;
  },

  _chooseData: function(data) {
    if (data !== undefined) {
      return data;
    }
    if (this.data !== undefined) {
      return this.data;
    }
    return {};
  },

  create: async function(data, options) {
    let response = await this.client.post({
      url: 'user/',
      body: {
        id: this.id,
        data: this._chooseData(data),
      },
      qs: options,
      signature: this.token,
    });
    this.data = response.data;
    return response;
  },

  update: async function(data) {
    let response = await this.client.put({
      url: this.url,
      body: {
        data: this._chooseData(data),
      },
      signature: this.token,
    });
    this.data = response.data;
    return response;
  },
  getOrCreate: function(data) {
    return this.create(data, { get_or_create: true });
  },
  profile: function() {
    return this.get({ with_follow_counts: true });
  },
};

module.exports = StreamUser;
