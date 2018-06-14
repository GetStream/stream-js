var errors = require('./errors');

var StreamCollection = function() {
  this.initialize.apply(this, arguments);
};

StreamCollection.prototype = {

  initialize: function(client, name, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof StreamCollection.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} name Collection name
     * @param {string} token JWT token
     * @example new StreamCollection(client, "food", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.collectionName = name;
    this.token = token;
    this.signature = this.collectionName + ' ' + this.token;
  },

  buildURL: function() {
    var url = 'collection/' + this.collectionName + '/';
    for(var i = 0; i < arguments.length; i++) {
      url += arguments[i] + '/';
    }
    return url;
  },

  getItemURL: function(itemId) {
    if (itemId.foreignId) {
      return this.buildURL('foreign_id', itemId.foreignID);
    }
    if (itemId.id) {
      return this.buildURL(itemId.id);
    }
    throw new errors.SiteError('Invalid itemId, must be {id:} or {foreignId:}');
  },

  items: function(options, callback) {
    /**
     * get all items from collection
     * @method items
     * @memberof StreamCollection.prototype
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
     * @memberof StreamCollection.prototype
     * @param  {object}   itemId  Collection object id {id:} or {foreign_id:}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get({id:"0c7db91c-67f9-11e8-bcd9-fe00a9219401"})
     * @example collection.get({foreign_id:"cheese101"})
     */
    return this.client.get({
      url: this.getItemURL(itemId),
      signature: this.signature,
    }, callback);
  },

  add: function(foreignId, collectionData, callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof StreamCollection.prototype
     * @param  {string}   foreignId  Collection foreign_id
     * @param  {object}   collectionData  Collection data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    var body = {
      'foreign_id': foreignId,
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
       * @memberof StreamCollection.prototype
       * @param  {object}   itemId  Collection object id {id:} or {foreign_id:}
       * @param  {object}   collectionData  Collection data
       * @param  {requestCallback} callback Callback to call on completion
       * @return {Promise} Promise object
       * @example collection.update({id:"0c7db91c-67f9-11e8-bcd9-fe00a9219401"}, {"name": "cheese burger","toppings": "cheese"})
       * @example collection.update({foreign_id:"cheese101"}, {"name": "cheese burger","toppings": "cheese"})
       */
      var body = {
          'data': collectionData,
      };
      return this.client.post({
      url: this.getItemURL(itemId),
      body: body,
      signature: this.signature,
    }, callback);
  },

  delete: function(itemId, callback) {
    /**
     * Delete item from collection
     * @method delete
     * @memberof StreamCollection.prototype
     * @param  {object}   itemId  Collection object id {id:} or {foreign_id:}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete({id:"0c7db91c-67f9-11e8-bcd9-fe00a9219401"})
     * @example collection.delete({foreign_id:"cheese101"})
     */
    return this.client.post({
      url: this.getItemURL(itemId),
      signature: this.signature,
    }, callback);
  },
};

module.exports = StreamCollection;
