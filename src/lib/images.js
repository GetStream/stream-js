import 'whatwg-fetch'
var errors = require('./errors');

var StreamImageStore = function () {
  this.initialize.apply(this, arguments);
};

StreamImageStore.prototype = {
  initialize: function (client, token) {
    this.client = client;
    this.signature = token;
  },
  upload: function(uri, name) {
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: 'image',
      name: name || uri.split('/').reverse()[0]
    });
    return fetch(
      `${this.client.enrichUrl('images/')}?api_key=${this.client.apiKey}`, {
      method: 'post',
      body: data,
      headers: new Headers({
        'Authorization': this.signature,
      })
    }).then(r => { return r.json() });
  },
  delete: function() {},
  process: function() {},
  thumbmail: function() {},
};

module.exports = StreamImageStore;
