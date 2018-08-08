import {fetch, Headers} from 'cross-fetch';

var utils = require('./utils');
var errors = require('./errors');
var FormData = require('form-data');

var StreamFileStore = function () {
  this.initialize.apply(this, arguments);
};

StreamFileStore.prototype = {
  initialize: function (client, token) {
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
        type: 'file',
        name: name || uri.split('/').reverse()[0]
      };
    }

    data.append('file', fileField);

    return fetch(
      `${this.client.enrichUrl('files/')}?api_key=${this.client.apiKey}`, {
      method: 'post',
      body: data,
      headers: new Headers({
        'Authorization': this.token,
      })
    }).then(r => { return r.json() });
  },
  delete: function(uri) {
    return this.client.delete(
      {
        url: `files/${uri}`,
        signature: this.token,
      }
    );
  },
};

module.exports = StreamFileStore;
