var fetch = require('cross-fetch');
var Headers = require('cross-fetch').Headers;
var FormData = require('form-data');
var utils = require('./utils');

var StreamImageStore = function() {
  this.initialize.apply(this, arguments);
};

StreamImageStore.prototype = {
  initialize: function(client, token) {
    this.client = client;
    this.token = token;
  },
  upload: function(uri, name) {
    const data = new FormData();
    let fileField;

    if (utils.isReadableStream(uri)) {
      fileField = uri;
    } else {
      fileField = {
        uri: uri,
        type: 'application/octet-stream',
        name: name || uri.split('/').reverse()[0],
      };
    }
    data.append('file', fileField);
    return fetch(
      `${this.client.enrichUrl('images/')}?api_key=${this.client.apiKey}`,
      {
        method: 'post',
        body: data,
        headers: new Headers({
          Authorization: this.token,
        }),
      }
    ).then((r) => {
      return r.json();
    });
  },
  delete: function(uri) {
    return this.client.delete({
      url: `images/${uri}`,
      signature: this.token,
    });
  },
  process: function(uri, options) {
    let params = Object.assign(options);
    if (Array.isArray(params.crop)) {
      params.crop = params.crop.join(',');
    }

    return this.client.get({
      url: `images/${uri}`,
      qs: params,
      signature: this.token,
    });
  },
  thumbmail: function(
    uri,
    w,
    h,
    { crop, resize } = { crop: 'center', resize: 'clip' }
  ) {
    return this.process(uri, { w, h, crop, resize });
  },
};

module.exports = StreamImageStore;
