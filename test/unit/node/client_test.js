var StreamFeed = require('../../../src/lib/feed'),
    expect = require('expect.js'),
    beforeEachFn = require('../utils/hooks').beforeEach,
    td = require('testdouble'),
    stream = require('../../../src/getstream'),
    signing = require('../../../src/lib/signing');


describe('[UNIT] Stream Client (Node)', function() {

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

        it('(3) update single activity', function() {
            var post = td.function();
            td.replace(this.client, 'post', post);

            var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];

            this.client.updateActivity(activities[0]);

            td.verify(post(td.matchers.contains({
                url: 'activities/',
            }), undefined));
        });

    });

    describe('connect', function() {

        it('#LOCAL', function() {
            process.env['LOCAL'] = 1;

            var client = stream.connect('12345', 'abcdefghijklmnop');
            expect(client.baseUrl).to.be('http://localhost:8000/api/');

            delete process.env['LOCAL'];
        });

        it('#LOCAL', function() {
            var client = stream.connect('12345', 'abcdefghijklmnop', null, {
                location: 'nl-NL'
            });
            expect(client.baseUrl).to.be('https://nl-NL-api.stream-io-api.com/api/');
        });

        it('#LOCAL_FAYE', function() {
            process.env['LOCAL_FAYE'] = 1;

            var client = stream.connect('12345', 'abcdefghijklmnop');
            expect(client.fayeUrl).to.be('http://localhost:9999/faye/');

            delete process.env['LOCAL_FAYE'];
        });

        it('#STREAM_BASE_URL', function() {
            process.env['STREAM_BASE_URL'] = 'https://local.stream-io-api.com/api/';

            var client = stream.connect('12345', 'abcdefghijklmnop');
            expect(client.baseUrl).to.be('https://local.stream-io-api.com/api/');

            delete process.env['STREAM_BASE_URL'];
        });

    });
});
