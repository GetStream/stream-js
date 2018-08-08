var StreamUser = require('./user');
var isObject = require('lodash/isObject');
var isPlainObject = require('lodash/isPlainObject');

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
    this.images = this.client.images(this.token);
    this.files = this.client.files(this.token);
  },

  feed: function(feedGroup, user) {
    if (user === undefined) {
      user = this.userId;
    } else if (user instanceof StreamUser) {
      user = user.id;
    }

    let feed = this.client.feed(feedGroup, user, this.token);

    let replaceStreamObjects = obj => {
      let cloned = obj;
      if (Array.isArray(obj)) {
        cloned = obj.map(v => replaceStreamObjects(v));
      } else if (isPlainObject(obj)) {
        cloned = {};
        for (let k in obj) {
          cloned[k] = replaceStreamObjects(obj[k]);
        }
      } else if (isObject(obj) && obj._streamRef !== undefined) {
        cloned = obj._streamRef();
      }
      return cloned;
    };

    feed._addActivityOriginal = feed.addActivity;
    feed.addActivity = (activity, callback) => {
      activity = replaceStreamObjects(activity);
      return feed._addActivityOriginal(activity, callback);
    };

    return feed;
  },
  personalizedFeed: function(options = {}, callback) {
    return this.client.get(
      {
        url: 'enrich/personalization/feed/',
        qs: options,
        signature: this.token,
      },
      callback,
    );
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

  objectFromResponse: function(response) {
    let object = this.storage(response.collection).object(
      response.id,
      response.data,
    );
    object.full = response;
    return object;
  },

  og: function(url) {
    return this.client.get({
      url: 'og/',
      qs: { url: url },
      signature: this.token,
    });
  },
};

module.exports = StreamUserSession;
