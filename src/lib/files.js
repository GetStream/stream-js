var errors = require('./errors');

var StreamFileStore = function () {
  this.initialize.apply(this, arguments);
};

StreamFileStore.prototype = {
  initialize: function (client, token) {
    this.client = client;
    this.signature = token;
  },
};

module.exports = StreamFileStore;
