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
    this.full = undefined;
    this.token = userAuthToken;
    this.url = 'user/' + this.id + '/';
  },

  _streamRef: function() {
    return `SU:${this.id}`;
  },

  get: function(options, callback) {
    return this.client
      .get({
        url: this.url,
        signature: this.token,
        qs: options,
      })
      .then((response) => {
        this.full = response;
        this.data = response.data;
        if (callback) {
          callback(response);
        }
        return response;
      });
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

  create: function(data, options, callback) {
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
        this.full = response;
        this.data = response.data;
        if (callback) {
          callback(response);
        }
        return response;
      });
  },

  update: function(data, callback) {
    return this.client
      .put({
        url: this.url,
        body: {
          data: this._chooseData(data),
        },
        signature: this.token,
      })
      .then((response) => {
        this.full = response;
        this.data = response.data;
        if (callback) {
          callback(response);
        }
        return response;
      });
  },
  getOrCreate: function(data, callback) {
    return this.create(data, { get_or_create: true }, callback);
  },
  profile: function(callback) {
    return this.get({ with_follow_counts: true }, callback);
  },
};

module.exports = StreamUser;
