var expect = require('expect.js');

module.exports.wrapCB = function(expectedStatusCode, done, cb) {
    return function(error, response, body) {
        if (error) return done(error);
        expect(response.statusCode).to.be(expectedStatusCode);

        if (typeof cb === 'function') {
            cb.apply(cb, arguments);
        } else {
            done();
        }
    };
};