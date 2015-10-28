var Promise = require('faye').Promise;

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

module.exports = Promise;
