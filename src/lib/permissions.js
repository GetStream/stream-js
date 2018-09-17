var StreamPermissions = function() {
  this.initialize.apply(this, arguments);
};

StreamPermissions.prototype = {
  initialize: function(client, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof StreamPermissions.prototype
     * @param {StreamCloudClient} client Stream client this collection is constructed from
     * @param {string} name ObjectStore name
     * @param {string} token JWT token
     * @example new StreamPermissions(client, "food", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.token = token;
  },

  buildURL: function(itemId) {
    var url = 'permissions/';
    if (itemId === undefined) {
      return url;
    }
    return url + itemId + '/';
  },

  get: function(callback) {
    /**
     * Get the list of policies
     * @method get
     * @memberof StreamPermissions.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example permissions.get()
     */
    return this.client.get(
      {
        url: this.buildURL(),
        signature: this.token,
      },
      callback,
    );
  },

  add: function(body, callback) {
    /**
     * Add a policy
     * @method add
     * @memberof StreamPermissions.prototype
     * @param  {object}   body  The json describing the policy
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example permissions.add({"priority": "80", "resources": ['ReadFeed'], action: 1})
     */
    return this.client.post(
      {
        url: this.buildURL(),
        body: body,
        signature: this.token,
      },
      callback,
    );
  },

  delete: function(priority, callback) {
    /**
     * Delete a policy
     * @method delete
     * @memberof StreamPermissions.prototype
     * @param  {object}   priority  The priority of the policy that should be deleted
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("cheese101")
     */
    return this.client['delete'](
      {
        url: this.buildURL(priority),
        signature: this.token,
      },
      callback,
    );
  },
};

module.exports = StreamPermissions;
