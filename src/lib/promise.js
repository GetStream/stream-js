var Faye = require('faye');

Faye.Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

module.exports = Faye.Promise;
