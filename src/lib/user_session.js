var StreamUser = require('./user');

var StreamUserSession = function() {
  this.initialize.apply(this, arguments);
};

StreamUserSession.prototype = {
  initialize: function(client, userId, userAuthToken) {
    /**
     * Initialize a user session object
     * @method intialize
     * @memberof StreamUserSession.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} userId The ID of the user
     * @param {string} token JWT token
     * @example new StreamUserSession(client, "123", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.userId = userId;
    this.token = userAuthToken;
    this.user = new StreamUser(client, userId, userAuthToken);
    this.reactions = client.reactions(userAuthToken);
  },

  feed: function(feedGroup, userId) {
    if (userId === undefined) {
      userId = this.userId;
    }

    let feed = this.client.feed(feedGroup, userId, this.token);
    // HACK: override the normal get with one that enriches
    // TODO: make this not super ugly like it is now
    feed.get = (options, callback) => {
      if (options && options['mark_read'] && options['mark_read'].join) {
        options['mark_read'] = options['mark_read'].join(',');
      }

      if (options && options['mark_seen'] && options['mark_seen'].join) {
        options['mark_seen'] = options['mark_seen'].join(',');
      }

      return feed.client.get(
        {
          url: 'enrich/feed/' + feed.feedUrl + '/',
          qs: options,
          signature: feed.signature,
        },
        callback,
      );
    };

    return feed;
  },

  followUser: function(user) {
    // The user argument can be a StreamUser object or a userId
    if (user instanceof StreamUser) {
      user = user.id;
    }
    return this.feed('timeline').follow('user', user);
  },

  getUser: function(userId) {
    return new StreamUser(this.client, userId, this.token);
  },

  storage: function(collection) {
    return this.client.storage(collection, this.token);
  },
  react: function(kind, activityId, data) {
    return this.reactions.add(kind, activityId, data);
  },
};

module.exports = StreamUserSession;
