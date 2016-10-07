var expect = require('expect.js')
  , beforeEachFn = require('../utils/hooks').beforeEach
  , config = require('../utils/config')
  , td = require('testdouble')
  , stream = require('../../../src/getstream')
  , mocks = require('../utils/mocks')
  , errors = stream.errors;

function enrichKwargs(kwargs) {
    return kwargs;
}

describe('Stream Client (Common)', function() {

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

    describe('#feed', function() {

        it('(1) throw', function() {
            var self = this;

            function toThrow() {
                self.client.feed();
            }

            expect(toThrow).to.throwException(function(e) {
                expect(e).to.be.a(errors.FeedError);
            });
        });

        it('(2) throw', function() {
            var self = this;

            function toThrow() {
                self.client.feed('user:jaap');
            }

            expect(toThrow).to.throwException(function(e) {
                expect(e).to.be.a(errors.FeedError);
            });
        });

        it('(3) throw', function() {
            var self = this;

            function toThrow() {
                self.client.feed('user###','jaap');
            }

            expect(toThrow).to.throwException(function(e) {
                expect(e).to.be.a(errors.FeedError);
            });
        });

        it('(4) throw', function() {
            var self = this;

            function toThrow() {
                self.client.feed('user','###jaap');
            }

            expect(toThrow).to.throwException(function(e) {
                expect(e).to.be.a(errors.FeedError);
            });
        });     

    });

    describe('#wrapPromiseTask', function() {

        it('(1) success', function(done) {
            function fulfill() {
                done();
            }

            function reject(err) {
                done(err);
            }

            var task = this.client.wrapPromiseTask(undefined, fulfill, reject); 

            task(null, { statusCode: 200 }, {});
        });

        it('(2) failure 500 status code', function(done) {
            function fulfill() {
                done('Expected to fail');
            }

            function reject(err) {
                done();
            }

            var task = this.client.wrapPromiseTask(undefined, fulfill, reject); 

            task(null, { statusCode: 500 }, {});
        });

        it('(3) failure rejected', function(done) {
            function fulfill() {
                done('Expected to fail');
            }

            function reject(err) {
                done();
            }

            var task = this.client.wrapPromiseTask(undefined, fulfill, reject); 

            task(new Error('oops'), { statusCode: 200 }, {});
        });

    });

    it('#enrichUrl', function() {
        var url = this.client.enrichUrl('matthisk');
        expect(url).to.be(this.client.baseUrl + this.client.version + '/' + 'matthisk');
    });

    it('#enrichKwargs', function() {
        var kwargs = this.client.enrichKwargs({ 
            url: 'matthisk',
            signature: 'heimensen',
        });

        expect(kwargs.qs.api_key).to.be(this.client.apiKey);
        expect(kwargs.qs.location).to.be(this.client.group);
        expect(kwargs.json).to.be(true);
        expect(kwargs.headers['stream-auth-type']).to.be('simple');
        expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
        expect(kwargs.headers['Authorization']).to.be('heimensen');
    });

    describe('#signActivities', function() {

        it('(1) without to', function() {
            var activities = [{ object: 0, actor: 'matthisk', verb: 'tweet' }];

            var output = this.client.signActivities(activities);

            expect(output).to.equal(activities);
        });

        it('(2) with to', function() {
            var activities = [{ object: 0, actor: 'matthisk', verb: 'tweet', to: ['global:feed'] }];

            var output = this.client.signActivities(activities);

            expect(output[0].to[0].split(' ')[0]).to.be('global:feed');

            if (this.client.apiSecret) {
                var token = this.client.feed('global', 'feed').token;
                expect(output[0].to[0].split(' ')[1]).to.be(token);    
            }

        });

    });

    describe('Requests', function() {

        function toExpect(method) {
            var arg0 = { url: 'matthisk', method: method };
            var fun = td.matchers.isA(Function);
            return mocks.request(arg0, fun);
        }

        beforeEach(function() {
            td.replace(this.client, 'enrichKwargs', enrichKwargs);
        });

        it('#get', function() {
            this.client.get({ url: 'matthisk' });

            td.verify(toExpect('GET'));
        });

        it('#post', function() {
            this.client.post({ url: 'matthisk' });

            td.verify(toExpect('POST'));
        });

        it('#delete', function() {
            this.client.delete({ url: 'matthisk' });

            td.verify(toExpect('DELETE'));
        });

    });

    describe('#updateActivities', function() {

        it('throws', function() {
            function isGoingToThrow1() {
                this.client.updateActivities({});
            }

            function isGoingToThrow2() {
                this.client.updateActivities(0);
            }

            function isGoingToThrow3() {
                this.client.updateActivities(null);
            }

            function isNotGoingToThrow() {
                this.client.updateActivities([]);
            }

            function isTypeError(err) {
                expect(err).to.be.a(TypeError);
            }

            expect(isGoingToThrow1).to.throwException(isTypeError);
            expect(isGoingToThrow2).to.throwException(isTypeError);
            expect(isGoingToThrow3).to.throwException(isTypeError);
            expect(isNotGoingToThrow).to.not.throw;
        });

        it('(1) works', function() {
            var post = td.function();
            td.replace(this.client, 'post', post);

            var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];

            this.client.updateActivities(activities);

            td.verify(post(td.matchers.contains({
                url: 'activities/',
            }), undefined));
        });

        it('(2) works', function() {
            var post = td.function();
            td.replace(this.client, 'post', post);

            var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];
            var fn = function() {};

            this.client.updateActivities(activities, fn);

            td.verify(post(td.matchers.contains({
                url: 'activities/',
            }), fn));
        });

    });

});