var init = require('../utils/hooks').init
  , expect = require('expect.js')
  , beforeEachFn = require('../utils/hooks').beforeEach;

describe('Stream client (Promises)', function() {

    init.call(this);
    beforeEach(beforeEachFn);

    it('get promises', function(done) {
        this.user1.get({
            'limit': 1
        }).then(function(body) {
            done();
        }, done);
    });

    it('post promises', function(done) {
        var activity = {
            'actor': 'test-various:characters',
            'verb': 'add',
            'object': 1,
            'tweet': 'hello world'
        };
        this.user1.addActivity(activity).then(function(body) {
            done();
        }, done);
    });

    it('post promises fail', function(done) {
        var activity = {
            'actor': 'test-various:characters',
            'verb': 'add',
            'object': '',
            'tweet': 'hello world'
        };
        var p = this.user1.addActivity(activity)
            .then(function(body) {
                done('expected failure');
            }, function(errorObj) {
                done();
            });
    });

});