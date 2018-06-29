var errors = require('./errors');

var StreamObjectStore = function() {
  this.initialize.apply(this, arguments);
};

StreamObjectStore.prototype = {

  initialize: function(client, name, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof StreamObjectStore.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} name ObjectStore name
     * @param {string} token JWT token
     * @example new StreamObjectStore(client, "food", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.collectionName = name;
    this.token = token;
    this.signature = this.collectionName + ' ' + this.token;
  },

  buildURL: function(itemId) {
    var url = 'object_store/' + this.collectionName + '/';
    if (itemId === undefined) {
        return url;
    }
      return url + itemId + '/';
  },

  items: function(options, callback) {
    /**
     * get all items from collection
     * @method items
     * @memberof StreamObjectStore.prototype
     * @param  {object}   options  {limit:}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get()
     * @example collection.get({limit:100})
     */
    return this.client.get({
      url: this.buildURL(),
      signature: this.signature,
    }, callback);
  },

  get: function(itemId, callback) {
    /**
     * get item from collection
     * @method get
     * @memberof StreamObjectStore.prototype
     * @param  {object}   itemId  ObjectStore object id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    return this.client.get({
      url: this.buildURL(itemId),
      signature: this.signature,
    }, callback);
  },

  add: function(itemId, collectionData, callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof StreamObjectStore.prototype
     * @param  {string}   itemId  ObjectStore id
     * @param  {object}   collectionData  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    var body = {
      'id': itemId,
      'data': collectionData,
    };
    return this.client.post({
      url: this.buildURL(),
      body: body,
      signature: this.signature,
    }, callback);
  },

  update: function(itemId, collectionData, callback) {
      /**
       * Update item into collection
       * @method update
       * @memberof StreamObjectStore.prototype
       * @param  {object}   itemId  ObjectStore object id
       * @param  {object}   collectionData  ObjectStore data
       * @param  {requestCallback} callback Callback to call on completion
       * @return {Promise} Promise object
       * @example collection.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
       * @example collection.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
       */
      var body = {
          'data': collectionData,
      };
      return this.client.post({
      url: this.buildURL(itemId),
      body: body,
      signature: this.signature,
    }, callback);
  },

  delete: function(itemId, callback) {
    /**
     * Delete item from collection
     * @method delete
     * @memberof StreamObjectStore.prototype
     * @param  {object}   itemId  ObjectStore object id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("cheese101")
     */
    return this.client['delete']({
      url: this.buildURL(itemId),
      signature: this.signature,
    }, callback);
  },
};

module.exports = StreamObjectStore;
