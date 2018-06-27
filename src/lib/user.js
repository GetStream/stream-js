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
  },
  get: function() {
    // TODO: code to get the data for the user
  },
  create: function(data) {
    // TODO: code to create the user
  },
  update: function(data) {
    // TODO: code to update the user
  },
  getOrCreate: function() {
    // TODO: code to getOrCreate the user
  },
  profile: function() {
    // TODO: Should return the user profile data, and it should also update data
  },
};

module.exports = StreamUser;
