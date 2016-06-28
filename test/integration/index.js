var expect = require('expect.js');
var stream = require('../../src/getstream');
var isNodeEnv = typeof window === 'undefined';
var Promise = require('faye/src/util/promise');

var READ_TIMEOUT = 2000;
var errors;

describe('Stream client', function () {
  /*
   * Run these tests
   *
   * mocha test/integration/index.js
   * LOCAL=1 mocha test/integration/index.js
   *
   * Browser open
   * test.html
   * test.html#local=1
   *
   */
  var self = this;
  this.timeout(4000);
  this.localRun = false;

  if (typeof (process) != "undefined" && process.env.LOCAL) {
    // local testing is slow as we run celery tasks in sync
    this.timeout(25000);
    this.localRun = true;
  }

  if (typeof (document) != "undefined" && document.location.href.indexOf('local=1') != -1) {
    // local testing via the browser
    this.timeout(25000);
    this.localRun = true;
  }

  var API_KEY = 'q56mdvdzreye'
    , API_SECRET = 'spmf6x2b2v2tqg93sfp5t393wfcxru58zm7jr3ynf7dmmndw5y8chux25hs63znf';

  if (this.localRun && isNodeEnv) {
    API_KEY = process.env.STREAM_API_KEY || API_KEY;
    API_SECRET = process.env.STREAM_API_SECRET || API_SECRET;
  }

  console.log('node is set to ', isNodeEnv);
  errors = stream.errors;

  var client, user1, aggregated2, aggregated3, flat3, secret3, notification3, user1ReadOnly, user2ReadOnly;

  function beforeEachBrowser() {
    client = stream.connect(API_KEY);
    client = stream.connect(API_KEY, null, 9498, {'group': 'browserTestCycle', 'location': 'eu-west'});

    if (self.localRun){
      client.baseUrl = 'http://localhost:8000/api/';
      client.fayeUrl = 'http://localhost:9999/faye/';
    }

    user1 = client.feed('user', '11', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIxMSJ9.9OP-WR_b4-1CEh_CLw8ZR-ZCuDuIVNQITjab8np739Q');
    aggregated2 = client.feed('aggregated', '22', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImFnZ3JlZ2F0ZWQyMiJ9.pYTcr0BU99CWaD4Sd5BEjBvGzgOy3rxkvDDeAOWhi10');
    aggregated3 = client.feed('aggregated', '33', 'YxCkg56vpnabvHPNLCHK7Se36FY');
    flat3 = client.feed('flat', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImFnZ3JlZ2F0ZWQzMyJ9.G8Fdpdv5B4Q2WoE5ko6KAMk2qKgES2QLJK1gdotAAC0');
    secret3 = client.feed('secret', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InNlY3JldDMzIn0.mtcy0oTLtvcxVDo4ikp53DLSxxgZ22V23B7d6S5QHUg');
    notification3 = client.feed('notification', '33', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbjMzIn0.80RDMlGD3pSics5Rbm5b89lnbwm2fqaOZ0q9fMYXCk4');
    user1ReadOnly = client.feed('user', '11', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6InVzZXIxMSJ9.nMvaxLCTpmJTmJqEjsGtB8j90ZoVTXQEiL7OjO7GOBo');
  }

  function beforeEachNode() {
    client = stream.connect(API_KEY, API_SECRET);
    client = stream.connect(API_KEY, API_SECRET, 9498, {'group': 'testCycle', 'location': 'us-east'});
    user1 = client.feed('user', '11');
    aggregated2 = client.feed('aggregated', '22');
    aggregated3 = client.feed('aggregated', '33');
    flat3 = client.feed('flat', '33');
    secret3 = client.feed('secret', '33');
    notification3 = client.feed('notification', '33');
    user1ReadOnly = client.feed('user', '11', null, null, {readOnly: true});
    user2ReadOnly = client.feed('user', '22', null, null, {readOnly: true});
  }

  var before = (isNodeEnv) ? beforeEachNode : beforeEachBrowser;

  beforeEach(before);

  if (isNodeEnv) {
    it('heroku', function (done) {
      var url = 'https://thierry:pass@getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      client = stream.connect();
      expect(client.apiKey).to.eql('thierry');
      expect(client.apiSecret).to.eql('pass');
      expect(client.appId).to.eql('1');
      done();
    });

    it('heroku legacy', function (done) {
      var url = 'https://bvt88g4kvc63:twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd@getstream.io/?app_id=669';
      process.env.STREAM_URL = url;
      client = stream.connect();
      expect(client.apiKey).to.eql('bvt88g4kvc63');
      expect(client.apiSecret).to.eql('twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd');
      expect(client.appId).to.eql('669');
      expect(client.baseUrl).to.eql('https://api.getstream.io/api/');
      done();
    });

    it('heroku with location', function (done) {
      var url = 'https://ahj2ndz7gsan:gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy@us-east.getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      client = stream.connect();
      expect(client.apiKey).to.eql('ahj2ndz7gsan');
      expect(client.apiSecret).to.eql('gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
      expect(client.appId).to.eql('1');
      expect(client.baseUrl).to.eql('https://us-east-api.getstream.io/api/');
      done();
    });

    it('heroku_overwrite', function (done) {
      var url = 'https://thierry:pass@getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      client = stream.connect('a','b','c');
      expect(client.apiKey).to.eql('a');
      expect(client.apiSecret).to.eql('b');
      expect(client.appId).to.eql('c');
      done();
    });

    it('location support', function (done) {
      var options = {};
      var location = 'us-east';
      var fullLocation = 'https://us-east-api.getstream.io/api/';
      options.location = location;
      client = stream.connect('a','b','c', options);
      expect(client.baseUrl).to.eql(fullLocation);
      expect(client.location).to.eql(location);
      done();
    });
  }

  it('handlers', function (done) {
    var called = {};
    called.request = 0;
    called.response = 0;

    function callback () {
      called.request += 1;
    }

    function responseCallback () {
      called.response += 1;
    }

    client.on('request', callback);
    client.on('response', responseCallback);

    function third() {
      expect(called.request).to.eql(1);
      expect(called.response).to.eql(1);
      done();
    }
    function second() {
      client.off();
      user1.get({'limit': 1}, third);
    }
    user1.get({'limit': 1}, second);
  });

  it('signing', function (done) {
    expect(user1.token).to.be.an('string');
    done();
  });

  it('get feed', function (done) {
    user1.get({'limit': 1}, function(error, response, body) {
      expect(response.statusCode).to.eql(200);
      expect(body['results'][0]['id']).to.be.a('string');
      if (isNodeEnv) {
        var userAgent = response.req._headers['x-stream-client'];
        expect(userAgent.indexOf('stream-javascript-client')).to.eql(0);
      }
      done();
  });
  });

  it('get wrong feed', function (done) {
    var getFeed = function() { client.feed('flat1');};
    expect(getFeed).to.throwException(function (e) {
      expect(e).to.be.a(errors.FeedError);
  });
    done();
  });

  it('get wrong format', function (done) {
    var getFeed = function() { client.feed('flat:1', '2');};
    expect(getFeed).to.throwException(function (e) {
      expect(e).to.be.a(errors.FeedError);
  });
    done();
  });

  it('get invalid format', function (done) {
    var invalidFormats = [];
    invalidFormats.push(function() { client.feed('flat 1', '2');});
    invalidFormats.push(function() { client.feed('flat1', '2:3');});
    invalidFormats.push(function() { user1.follow('flat 1', '3');});
    invalidFormats.push(function() { user1.follow('flat', '3 3');});
    // verify all of the above throw an error
    for (var i = 0; i < invalidFormats.length; i++) {
      var callable = invalidFormats[i];
        expect(callable).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
    });
  }
  // a dash should be allowed
  client.feed('flat1', '2-3', 'token');
    done();
  });

  it('add activity', function (done) {
    var activity = {'actor': 'test-various:characters', 'verb': 'add', 'object': 1, 'tweet': 'hello world'};
    function get(error, response, body) {
      var activityId = body['id'];
      user1.get({'limit': 1}, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        expect(body['results'][0]['id']).to.eql(activityId);
        done();
      });
    }
    user1.addActivity(activity, get);
  });

  it('add complex activity', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1};
    activity['participants'] = ['Thierry', 'Tommaso'];
    activity['route'] = {'name': 'Vondelpark', 'distance': '20'};
    var currentDate = new Date();
    activity['date'] = currentDate;
    var isoDate = currentDate.toISOString();
    function get(error, response, body) {
      var activityId = body['id'];
      user1.get({'limit': 1}, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        expect(body['results'][0]['id']).to.eql(activityId);
        expect(body['results'][0]['participants']).to.eql(['Thierry', 'Tommaso']);
        expect(body['results'][0]['route']).to.eql({'name': 'Vondelpark', 'distance': '20'});
        expect(body['results'][0]['date']).to.eql(isoDate);
        done();
      });
    }
    user1.addActivity(activity, get);
  });

  it('add activity using to', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1};
    activity['participants'] = ['Thierry', 'Tommaso'];
    activity['route'] = {'name': 'Vondelpark', 'distance': '20'};
    activity['to'] = ['flat:33', 'user:everyone'];
    //flat3
    if (!isNodeEnv) activity['to'] = ['flat:33' + ' ' + flat3.token];

    function get(error, response, body) {
      var activityId = body['id'];
      expect(error).to.eql(null);
      expect(body.exception).to.eql(undefined);
      flat3.get({'limit': 1}, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        expect(body['results'][0]['id']).to.eql(activityId);
        done();
      });
    }
    user1.addActivity(activity, get);
  });

  it('add activity no callback', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1};
    user1.addActivity(activity);
    done();
  });

  it('remove activity', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1};
    function remove(error, response, body) {
      var activityId = body['id'];
      expect(response.statusCode).to.eql(201);
      user1.removeActivity(activityId, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        done();
      });
    }
    user1.addActivity(activity, remove);
  });

  it('remove activity foreign id', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1, 'foreign_id': 'add:1'};
    var now = new Date();
  activity.time = now.toISOString();
    function remove(error, response, body) {
      var activityId = body['id'];
      expect(response.statusCode).to.eql(201);
      user1.removeActivity({foreignId: 'add:1'}, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        user1.get({limit:10}, function(error, response, body) {
          expect(response.statusCode).to.eql(200);
          expect(body['results'][0]['id']).not.to.eql(activityId);
          expect(body['results'][0]['foreign_id']).not.to.eql('add:1');
          done();
        });
      });
    }
    user1.addActivity(activity, remove);
  });

  it('add activities', function (done) {
  var activities = [
    {'actor': 1, 'verb': 'tweet', 'object': 1},
    {'actor': 2, 'verb': 'tweet', 'object': 3},
  ];
    function get(error, response, body) {
      var activityIdFirst = body['activities'][0]['id'];
      var activityIdLast = body['activities'][1]['id'];
      user1.get({'limit': 2}, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        expect(body['results'][0]['id']).to.eql(activityIdLast);
        expect(body['results'][1]['id']).to.eql(activityIdFirst);
        done();
      });
    }
    user1.addActivities(activities, get);
  });

  if (isNodeEnv) {
    it('update activities', function (done) {
      var activities = [
        {'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'update_activity_1'},
        {'actor': 2, 'verb': 'tweet', 'object': 3, 'foreign_id': 'update_activity_1'},
      ];

      user1.addActivities(activities)
        .then(function(body) {
          var activity = body['activities'][0];

          activity['answer'] = 10;
          delete activity.to;
          delete activity.target;
          delete activity.origin;

          var activities = [activity];

          return client.updateActivities(activities);
        })
        .then(function(body) {
          var activity = body['activities'][0];
          expect(activity.answer).to.be(10);
          done();
        })
        .catch(function(reason) {
          done(reason.error);
        });
    });

    it('update activity illegal foreign id', function(done) {
      var activity = {
        'actor': 1,
        'verb': 'tweet',
        'object': 2,
      };

      user1.addActivity(activity)
        .catch(done)
        .then(function(body) {
          var activity = body;
          
          delete activity.id;
          delete activity.duration;
          delete activity.to;
          delete activity.time;

          activity['foreign_id'] = 'aap';

          return client.updateActivity(activity);
        })
        .then(function() {
          done('Expected InputException');
        })
        .catch(function(reason) {
          expect(reason.error.code).to.be(4);
          expect(reason.error.exception).to.be('InputException')
          done();
        });
      });

      it('update activity illegal time', function(done) {
        var activity = {
          'actor': 1,
          'verb': 'tweet',
          'object': 2,
        };

        user1.addActivity(activity)
          .catch(done)
          .then(function(body) {
            var activity = body;
            
            delete activity.duration;
            delete activity.to;

            activity['time'] = 'aap';

            return client.updateActivity(activity);
          })
          .then(function() {
            done('Expected InputException');
          })
          .catch(function(reason) {
            expect(reason.error.code).to.be(4);
            expect(reason.error.exception).to.be('InputException')
            done();
          });
      });

      it('update activity illegal to field', function(done) {
        var activity = {
          'actor': 1,
          'verb': 'tweet',
          'object': 2,
        };

        user1.addActivity(activity)
          .catch(done)
          .then(function(body) {
            var activity = body;
            
            delete activity.duration;
            delete activity.time;

            activity['to'] = ['to:something'];

            return client.updateActivity(activity);
          })
          .then(function() {
            done('Expected InputException');
          })
          .catch(function(reason) {
            expect(reason.error.code).to.be(4);
            expect(reason.error.exception).to.be('InputException')
            done();
          });
      });

      it('updating many activities', function(done) {
        var activities = [];
        for(var i = 0; i < 10; i++) {
          activities.push({
            'verb': 'do',
            'object': 'object:' + i,
            'actor': 'user:' + i,
            'foreign_id': 'update_activities_' + i
          });
        }

        user1.addActivities(activities)
          .then(function(body) {
            var activitiesCreated = body['activities'];

            for(var j = 0; j < activitiesCreated.length; j++) {
              activitiesCreated[j]['answer'] = 100;
            }

            return client.updateActivities(activitiesCreated);
          })
          .then(function(body) {
            return user1.get({ limit: 10 });
          })
          .then(function(body) {
            var activitiesUpdated = body['results'];

            for(var n = 0; n < activitiesUpdated.length; n++) {
              expect(activitiesUpdated[n]['answer']).to.be(100);
            }

            done();
          })
          .catch(done);
      });

      it('#updateActivity', function(done) {
        var activity = {
          'verb': 'do',
          'actor': 'user:1',
          'object': 'object:1',
          'time': new Date().toISOString(),
          'foreign_id': 'update_activity_11'
        };

        client.updateActivity(activity)
          .then(function() { done(); }, done);
      });

  }

  it('follow', function (done) {
    var activityId = null;
    this.timeout(9000);
    function add() {
      var activity = {'actor': 1, 'verb': 'add', 'object': 1};
      user1.addActivity(activity, follow);
    }
    function follow(error, response, body) {
      activityId = body['id'];
      aggregated2.follow('user', '11', runCheck);
    }
    function runCheck(error, response, body) {
      function check() {
          aggregated2.get({'limit': 1}, function(error, response, body) {
            expect(response.statusCode).to.eql(200);
            expect(body['results'][0]['activities'][0]['id']).to.eql(activityId);
            done();
          });
        }
      setTimeout(check, READ_TIMEOUT);
     }
    add();
  });

  it('follow without callback', function (done) {
    aggregated2.follow('user', '111');
    done();
  });

  it('follow with copy limit', function (done) {
    aggregated2.follow('user', '999', { limit: 500 }, function(error, response, body) {
      if(error) done(error);
      expect(response.statusCode).to.be(201);
      done();
    });
  });

  it('unfollow', function (done) {
    this.timeout(6000);
    var activityId = null;
    function add() {
      var activity = {'actor': 1, 'verb': 'add', 'object': 1};
      user1.addActivity(activity, follow);
    }
    function follow(error, response, body) {
      activityId = body['id'];
      aggregated2.follow('user', '11', unfollow);
    }
    function unfollow(error, response, body) {
      aggregated2.unfollow('user', '11', check);
    }
    function check(error, response, body) {
      setTimeout(function() {
        aggregated2.get({'limit': 1}, function(error, response, body) {
          expect(response.statusCode).to.eql(200);
          var firstResult = body['results'][0];
          var activityFound = (firstResult) ? firstResult['activities'][0]['id'] : null;
          expect(activityFound).to.not.eql(activityId);
          done();
        });
      }, READ_TIMEOUT);
    }
    add();
  });

  it('unfollow keep_history', function(done) {
    this.timeout(6000);

    var activityId = null;
    function add() {
      var activity = {'actor': 1, 'verb': 'add', 'object': 1};
      user1.addActivity(activity, follow);
    }

    function follow(error, response, body) {
      if (error) return done(error);

      activityId = body['id'];
      flat3.follow('user', '11', unfollow);
    }

    function unfollow(error, response, body) {
      if(error) return done(error);

      flat3.unfollow('user', '11', { keepHistory: true }, check);
    }

    function check(error, response, body) {
      if(error) return done(error);

      setTimeout(function() {
        flat3.get({ 'limit': 1 }, function(error, response, body) {
          expect(response.statusCode).to.eql(200);
          var firstResult = body['results'][0];
          var activityFound = (firstResult) ? firstResult['id'] : null;
          expect(activityFound).to.eql(activityId);
          done();
        });
      }, READ_TIMEOUT);
    }

    add();
  });

  it('list followers', function (done) {
    function callback(error, response, body){
      expect(error).to.eql(null);
      expect(body.exception).to.eql(undefined);
      done();
    };
    user1.followers({limit: '10', offset: '10'}, callback);
  });

  it('list following', function (done) {
    function callback(error, response, body){
      expect(error).to.eql(null);
      expect(body.exception).to.eql(undefined);
      done();
    };
    user1.following({limit: '10', offset: '10'}, callback);
  });

  it('do i follow', function (done) {
    function doifollow() {
      user1.following({'filter': ['flat:33', 'flat:44']}, callback);
    }
    function callback(error, response, body){
      expect(error).to.eql(null);
      expect(body.exception).to.eql(undefined);
      var results = body.results;
      expect(results.length).to.eql(1);
      expect(results[0].target_id).to.eql('flat:33');
      done();
    }
    user1.follow('flat', '33', doifollow);
  });

  it('get read-only feed', function (done) {
    function check(error, response, body) {
      expect(response.statusCode).to.eql(200);
      done();
    }
    user1ReadOnly.get({'limit': 2}, check);
  });

  it('get filtering', function (done) {
    // first add three activities
    //TODO find a library to make async testing easier on the eye

    var activityIdOne = null;
    var activityIdTwo = null;
    var activityIdThree = null;

    function add() {
      var activity = {'actor': 1, 'verb': 'add', 'object': 1};
      user1.addActivity(activity, add2);
    }

    function add2(error, response, body) {
      activityIdOne = body['id'];
      var activity = {'actor': 2, 'verb': 'watch', 'object': 2};
      user1.addActivity(activity, add3);
    }

    function add3(error, response, body) {
      activityIdTwo = body['id'];
      var activity = {'actor': 3, 'verb': 'run', 'object': 2};
      user1.addActivity(activity, function(error, response, body) {
        // testing eventual consistency is not easy :)
        function getBound() {
          get(error, response, body);
        }
        setTimeout(getBound, 200);
      });
    }

    function get(error, response, body) {
      activityIdThree = body['id'];
      user1.get({'limit': 2}, check);
    }

    // no filtering
    function check(error, response, body) {
      expect(body['results'].length).to.eql(2);
      expect(body['results'][0]['id']).to.eql(activityIdThree);
      expect(body['results'][1]['id']).to.eql(activityIdTwo);
      user1.get({limit:2, offset:1}, check2);
    }

    // offset based
    function check2(error, response, body) {
      expect(body['results'].length).to.eql(2);
      expect(body['results'][0]['id']).to.eql(activityIdTwo);
      expect(body['results'][1]['id']).to.eql(activityIdOne);
      user1.get({limit:2, id_lt:activityIdTwo}, check3);
    }

    // try id_lt based
    function check3(error, response, body) {
      expect(body['results'].length).to.eql(2);
      expect(body['results'][0]['id']).to.eql(activityIdOne);
      done();
    }

    add();

  });

  it('mark read and seen', function (done) {
    // add 2 activities to ensure we have new data
    var params = {limit: 2};
    var activities = [
      {'actor': 1, 'verb': 'add', 'object': 1},
      {'actor': 2, 'verb': 'test', 'object': 2}
    ]
    notification3.addActivities(activities, getNotifications);
    // lookup the notification ids
    function getNotifications(error, response, body) {
      notification3.get(params, markRead);
    };
    // mark all seen and the first read
    function markRead(error, response, body) {
       var notificationId = body['results'][0]['id'];
       var params = {limit:2, mark_seen:true, mark_read: notificationId};
       notification3.get(params, readFeed);
    }
    // read the feed (should be seen and 1 unread)
    function readFeed(error, response, body) {
      notification3.get(params, verifyState);
    };
    // verify the seen and 1 unread
    function verifyState(error, response, body) {
      expect(body['results'][0]['is_seen']).to.eql(true);
      expect(body['results'][1]['is_seen']).to.eql(true);
      expect(body['results'][0]['is_read']).to.eql(true);
      expect(body['results'][1]['is_read']).to.eql(false);
      expect(body['unread']).to.be.greaterThan(1);
      expect(body['unseen']).to.eql(0);
      done();
    };

  });

  it('fayeGetClient', function (done) {
    var client = user1.getFayeClient();
    done();
  });

  it('fayeSubscribe', function (done) {
    this.timeout(6000);

    user1.subscribe(function callback() {})
      .then(function() { done(); }, done);
  });

  it('fayeSubscribeListening', function(done) {
    this.timeout(6000);

    var testUser1 = client.feed('user', '111', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIxMTEifQ.QHiPXFufxIjMnQbMoyfdKbdE82u7UFswPVVobhOL0G0'),
        testUser2 = client.feed('user', '222', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIyMjIifQ.WXZTbUgxfitUVwJOhRKu9HRnpf-Je8AwA5BmiUG6vYY'),
        testUser3 = client.feed('user', '333', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIzMzMifQ.atyOocKSyZIjisssKaVjDI4Ct18T0hK7PjkEnPvWxTk');

    var subscribes = [],
        messages = 0,
        N_MESSAGES = 3,
        activity = {
      'verb': 'test',
      'actor': 'User:1',
      'object': 1
    };

    var msgCallback = function(message) {
      if( message && message['new'] && message['new'].length > 0) {
        messages += 1;
      }

      if( messages == N_MESSAGES ) {
        done();
      }
    };

    var httpCallback = function(error, response, body) {
      if(error) done(error);
      if(response.statusCode !== 201) done(body);
    };

    Promise.all([
      testUser1.subscribe(msgCallback),
      testUser2.subscribe(msgCallback),
      testUser3.subscribe(msgCallback)
    ]).then(function() {
      testUser1.addActivity(activity, httpCallback);
      testUser2.addActivity(activity, httpCallback);
      testUser3.addActivity(activity, httpCallback);
    }, done);
  });

  it('fayeSubscribeListeningWrongToken', function(done) {
    this.timeout(6000);

    // Invalid token:
    var testUser1 = client.feed('user', '111', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIyMjIifQ.WXZTbUgxfitUVwJOhRKu9HRnpf-Je8AwA5BmiUG6vYY'),
    // Valid token:
        testUser2 = client.feed('user', '222', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIyMjIifQ.WXZTbUgxfitUVwJOhRKu9HRnpf-Je8AwA5BmiUG6vYY');

    var messages = 0,
        activity = {
      'verb': 'test',
      'actor': 'User:1',
      'object': 1
    };

    var httpCallback = function(error, response, body) {
      if(error) done(error);
      if(response.statusCode !== 201) done(body);
    };

    var doneYet = function(obj) {
      messages++;

      if(messages === 2) done();
    }

    testUser1.subscribe(function(message) {
      done('testUser1 should not receive any messages');
    }).then(function() {
      done('testUser1 should not authenticate succefully');
    }, doneYet);

    testUser2.subscribe(doneYet).then(function() {
      testUser2.addActivity(activity, httpCallback);
    }, done);

  });

  it('fayeSubscribeScope', function (done) {
    this.timeout(6000);
    var client = user1ReadOnly.getFayeClient();
    var isDone = false;

    var doneYet = function() {
      if(!isDone) {
        done();
        isDone = true;
      }
    }

    var subscription = user1ReadOnly.subscribe(doneYet);
    subscription.then(doneYet);
  });

  it('fayeSubscribeScopeTampered', function (done) {
    this.timeout(6000);
    var client = user1ReadOnly.getFayeClient();
    var isDone = false;

    var doneYet = function() {
      if(!isDone) {
        done();
        isDone = true;
      }
    }
    var subscription = user1ReadOnly.subscribe(doneYet);
    subscription.then(doneYet);
  });

  it('fayeSubscribeError', function (done) {
    this.timeout(6000);

    var client = stream.connect('5crf3bhfzesn');
    function sub() {
      var user1 = client.feed('user', '11', 'secret');
      user1.subscribe();
    }
    expect(sub).to.throwException(function (e) {
      expect(e).to.be.a(errors.SiteError);
  });
  done();
  });

  var wrapCB = function(expectedStatusCode, done, cb) {
    return function(error, response, body) {
      if(error) return done(error);
      expect(response.statusCode).to.be(expectedStatusCode);

      if( typeof cb === 'function') {
        cb.apply(cb, arguments);
      } else {
        done();
      }
    }
  };

  if(isNodeEnv) {
    // Server side specific tests

    it('supports application level authentication', function(done) {
      client.makeSignedRequest({
        url: 'test/auth/digest/'
      }, wrapCB(200, done));
    });

    it('fails application level authentication with wrong keys', function(done) {
      var client = stream.connect('aap','noot');

      client.makeSignedRequest({
        url: 'test/auth/digest/'
      }, function(error, response, body) {
        if(error) done(error);
        if(body.exception === 'ApiKeyException') done();
      });
    });

    it('supports adding activity to multiple feeds', function(done) {
      var activity = {
        'actor': 'user:11',
        'verb': 'like',
        'object': '000'
      };
      var feeds = ['flat:33', 'user:11'];

      client.addToMany(activity, feeds, wrapCB(201, done));
    });

    it('supports batch following', function(done) {
      this.timeout(6000);

      var follows = [
        {'source': 'flat:1', 'target': 'user:1'},
        {'source': 'flat:1', 'target': 'user:2'},
        {'source': 'flat:1', 'target': 'user:3'}
      ];

      client.followMany(follows, null, wrapCB(201, done));
    });

    it('supports batch following with activity_copy_limit', function(done) {
      var follows = [
        {'source': 'flat:1', 'target': 'user:1'},
        {'source': 'flat:1', 'target': 'user:2'},
        {'source': 'flat:1', 'target': 'user:3'}
      ];

      client.followMany(follows, 20, wrapCB(201, done, function(error, response, body) {
        expect(response.req.path.indexOf('activity_copy_limit=20')).to.not.be(0);
        done();
      }));
    });

    it('no secret application auth', function() {
      var client = stream.connect('ahj2ndz7gsan');

      expect(function() {
        client.addToMany({},[])
      }).to.throwError(function(e) {
        expect(e).to.be.a(errors.SiteError);
      });
    });

    it('batch promises', function (done) {
      var activity = {
        'actor': 'user:11',
        'verb': 'like',
        'object': '000'
      };
      var feeds = ['flat:33', 'user:11'];

      client.addToMany(activity, feeds).then(function(body) {
        done();
      }, done);
    });
  } else {
    // Client side specific tests

    it('shouldn\'t support signed requests on the client', function() {
      expect(client.makeSignedRequest).to.be(undefined);
    });
  }

  it('get promises', function (done) {
    user1.get({'limit': 1}).then(function(body) {
      done();
    }, done);
  });

  it('post promises', function (done) {
    var activity = {'actor': 'test-various:characters', 'verb': 'add', 'object': 1, 'tweet': 'hello world'};
    user1.addActivity(activity).then(function(body) {
        done();
    }, done);
  });

  it('post promises fail', function (done) {
    var activity = {'actor': 'test-various:characters', 'verb': 'add', 'object': '', 'tweet': 'hello world'};
    var p = user1.addActivity(activity)
      .then(function(body) {
        done('expected failure');
      }, function(errorObj) {
        done();
      });
  });
});
