var fetch = require('@stream-io/cross-fetch');
var Headers = require('@stream-io/cross-fetch').Headers;
var FormData = require('form-data');
var utils = require('./utils');
var errors = require('./errors');

var StreamImageStore = function() {
  this.initialize.apply(this, arguments);
};

StreamImageStore.prototype = {
  initialize: function(client, token) {
    this.client = client;
    this.token = token;
  },
  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  upload: function(uri, name, contentType) {
    const data = new FormData();
    let fileField;

    if (utils.isReadableStream(uri)) {
      fileField = uri;
    } else {
      fileField = {
        uri: uri,
        name: name || uri.split('/').reverse()[0],
      };
      if (contentType != null) {
        fileField.type = contentType;
      }
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
      },
    ).then((r) => {
      let responseData = r.json();
      if (r.ok) {
        return responseData;
      }
      r.statusCode = r.status;
      throw new errors.StreamApiError(
        r.body + ' with HTTP status code ' + r.status,
        responseData,
        r,
      );
    });
  },
  delete: function(uri) {
    return this.client.delete({
      url: `images/`,
      qs: { url: uri },
      signature: this.token,
    });
  },
  process: function(uri, options) {
    let params = Object.assign(options, { url: uri });
    if (Array.isArray(params.crop)) {
      params.crop = params.crop.join(',');
    }

    return this.client.get({
      url: `images/`,
      qs: params,
      signature: this.token,
    });
  },
  thumbmail: function(
    uri,
    w,
    h,
    { crop, resize } = { crop: 'center', resize: 'clip' },
  ) {
    return this.process(uri, { w, h, crop, resize });
  },
};

module.exports = StreamImageStore;
