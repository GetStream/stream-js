var httpSignature = require('http-signature');
var request = require('request');
var errors = require('./errors');

module.exports = {
  addToMany: function(activity, feeds, callback) {
      var req = this.makeSignedRequest({
        url: 'feed/add_to_many/',
        body: {
          activity: activity,
          feeds: feeds,
        },
      }, callback);

      return req;
    },

  followMany: function(follows, callback)  {
      var req = this.makeSignedRequest({
        url: 'follow_many/',
        body: follows,
      }, callback);

      return req;
    },

  makeSignedRequest: function(kwargs, cb) {
      if (!this.apiSecret) {
        throw new errors.SiteError('Missing secret, which is needed to perform signed requests, use var client = stream.connect(key, secret);');
      }

      this.send('request', 'post', kwargs, cb);

      kwargs.url = this.enrichUrl(kwargs.url);
      kwargs.json = true;
      kwargs.method = 'POST';
      kwargs.headers = { 'X-Api-Key': this.apiKey };

      var callback = this.wrapCallback(cb);
      var req = request(kwargs, callback);

      httpSignature.sign(req, {
        algorithm: 'hmac-sha256',
        key: this.apiSecret,
        keyId: this.apiKey,
      });

      return request;
    },
};
