var errors = require('./errors');

var Personalization = function() {
  /**
   * Manage api calls for personalization
   * The collection object contains convenience functions such as  get, post, delete
   * @class Personalization
   */
  this.initialize.apply(this, arguments);
};

Personalization.prototype = {
  /**
   * Initialize the Personalization object
   *
   * @method intialize
   * @memberof Personalization.prototype
   * @param {StreamClient} client - The stream client
   */
  initialize: function(client) {
    this.client = client;
  },

  get: function(resource, options, callback) {
  /**
   * Get personalized activities for this feed
   *
   * @method get
   * @memberof Personalization.prototype
   * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options  Additional options
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object. Personalized feed
   * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'}, cb)
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;
    if (!options || options.call) {
      options = {};
    }

    return this.client.get(
      {
        url: resource + '/',
        serviceName: 'personalization',
        qs: options,
        signature: this.client.getPersonalizationToken()
      },
      callback);
  },

  post: function(resource, options, data, callback) {
  /**
   * Post data to personalization endpoint
   *
   * @method post
   * @memberof Personalization.prototype
   * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options - Additional options
   * @param {object} data - Data to send in the payload
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object. Data that was posted if successful, or an error.
   * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'}, cb)
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;
    if (!options || options.call) {
      options = {};
    }
    if (!data || data.call) {
      data = {};
    }

    return this.client.post(
      {
        url: resource + '/',
        serviceName: 'personalization',
        qs: options,
        body: data,
        signature: this.client.getPersonalizationToken()
      },
      callback);
  },

  delete: function(resource, options, callback) {
  /**
   * Delete metadata or activites
   *
   * @method delete
   * @memberof Personalization.prototype
   * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options - Additional options
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object. Data that was deleted if successful, or an error.
   * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'}, cb)
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;
    if (!options || options.call) {
      options = {};
    }

    return this.client.delete(
      {
        url: resource + '/',
        serviceName: 'personalization',
        qs: options,
        signature: this.client.getPersonalizationToken()
      },
      callback);
  },

};

module.exports = Personalization;
