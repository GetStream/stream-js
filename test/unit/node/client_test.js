var StreamFeed = require('../../../src/lib/feed'),
    expect = require('expect.js'),
    beforeEachFn = require('../utils/hooks').beforeEach,
    signing = signing || require('../../../src/lib/signing');


describe('Stream Client (Node)', function() {

    beforeEach(beforeEachFn);

    it('#updateActivities', function() {
        var self = this;

        expect(function() {
            self.client.updateActivities('A-String-Thing');
        }).to.throwException(function(e) {
            expect(e).to.be.a(TypeError);
        });
    });

    it('#userAgent', function() {
        var useragent = this.client.userAgent();

        expect(useragent).to.be('stream-javascript-client-node-unknown');
    });

    it('#feed', function() {
        var feed = this.client.feed('user', 'jaap', '123456789');

        expect(feed).to.be.a(StreamFeed);
    });
});