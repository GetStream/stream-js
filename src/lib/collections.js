var errors = require('./errors');

var Collections = function() {
  /**
   * Manage api calls for collections
   * The collection object contains convenience functions such as upsert, select and delete.
   * @class Collections
   */
  this.initialize.apply(this, arguments);
};


Collections.prototype = {
  initialize: function(client) {
    this.client = client;
  },

  upsert: function(collectionName, data, callback) {
  /**
   * Upsert one or more items within a collection.
   *
   * @method upsert
   * @memberof Collections.prototype
   * @param {object} collectionName - The name of the collection
   * @param {object or array} data - A single json object or an array of objects
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object.
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;

    if (!Array.isArray(data)) {
      data = [data];
    }
    var data_json = {data: {}};
    data_json['data'][collectionName] = data;

    return this.client.post(
      {
        url: 'meta/',
        serviceName: 'api',
        body: data_json,
        signature: this.client.getCollectionsToken()
      },
      callback);
  },

  select: function(collectionName, ids, callback) {
  /**
   * Select all objects with ids from the collection.
   *
   * @method select
   * @memberof Collections.prototype
   * @param {object} collectionName - The name of the collection
   * @param {object or array} ids - A single json object or an array of objects
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object.
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;

    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    var params = {
      foreign_ids: ids.map(function(id) { return collectionName + ":" + id;}).join(',')
    };

    return this.client.get(
      {
        url: 'meta/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken()
      },
      callback);
  },

  delete: function(collectionName, ids, callback) {
  /**
   * Remove all objects by id from the collection.
   *
   * @method delete
   * @memberof Collections.prototype
   * @param {object} collectionName - The name of the collection
   * @param {object or array} ids - A single json object or an array of objects
   * @param {requestCallback} callback - Callback to call on completion
   * @return {Promise} Promise object.
  */
    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = (last.call) ? last : undefined;

    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    ids = ids.map(function(id) { return id.toString();}).join(',');

    var params = {
      collection_name: collectionName,
      ids: ids
    };

    return this.client.delete(
      {
        url: 'meta/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken()
      },
      callback);
  },
};

module.exports = Collections;
