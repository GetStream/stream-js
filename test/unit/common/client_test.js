var expect = require('expect.js')
  , beforeEachFn = require('../utils/hooks').beforeEach
  , config = require('../utils/config')
  , rewire = require('rewire')
  , td = require('testdouble')
  , stream = rewire('../../../src/getstream')
  , StreamFeed = require('../../../src/lib/feed')
  , errors = stream.errors;

stream.__set__('request', function() {});

function enrichKwargs(kwargs) {
    return kwargs;
}

describe('Stream Client', function() {

    beforeEach(beforeEachFn);
    afterEach(function() {
        td.reset();
    });

    it('#connect', function() {
        expect(this.client.apiKey).to.be(config.API_KEY);
        expect(this.client.version).to.be('v1.0');
        expect(this.client.fayeUrl).to.be('https://faye.getstream.io/faye');
        expect(this.client.group).to.be('unspecified');
        expect(this.client.location).to.be(undefined);
        expect(this.client.expireTokens).to.be(false);
        expect(this.client.baseUrl).to.be('https://api.getstream.io/api/');
    });

    it('#on', function(done) {
        expect(this.client.on).to.be.a(Function);

        td.replace(this.client, 'enrichKwargs', enrichKwargs);

        this.client.on('request', function() {
            done();
        });

        this.client.get({ uri: 'test' });
    });

    it('#off', function(done) {
        expect(this.client.off).to.be.a(Function);

        td.replace(this.client, 'enrichKwargs', enrichKwargs);

        this.client.on('request', function() {
            done('Expected not to be called');
        });
        this.client.off('request');

        this.client.get({ uri: 'test' });

        done();
    });

    it('#send', function(done) {
        expect(this.client.send).to.be.a(Function);

        this.client.on('test', function(a, b) {
            expect(a).to.be(100);
            expect(b).to.be(50);
            done();
        });

        this.client.send('test', 100, 50);
    });

    it('#feed throw (1)', function() {
        var self = this;

        function toThrow() {
            self.client.feed();
        }

        expect(toThrow).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
    });

    it('#feed throw (2)', function() {
        var self = this;

        function toThrow() {
            self.client.feed('user:jaap');
        }

        expect(toThrow).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
    });

    it('#feed throw (3)', function() {
        var self = this;

        function toThrow() {
            self.client.feed('user###','jaap');
        }

        expect(toThrow).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
    });

    it('#feed throw (4)', function() {
        var self = this;

        function toThrow() {
            self.client.feed('user','###jaap');
        }

        expect(toThrow).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
    });     

});