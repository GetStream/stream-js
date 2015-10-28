/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var integrationTests = __webpack_require__(1);
	var unitTests = __webpack_require__(25);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var expect = __webpack_require__(3);
	var Faye = __webpack_require__(9);
	var stream = __webpack_require__(11);
	var isNodeEnv = typeof window === 'undefined';

	var READ_TIMEOUT = 2000;

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
	  console.log('node is set to ', isNodeEnv);
	  errors = stream.errors;

	  var client, user1, aggregated2, aggregated3, flat3, secret3, notification3, user1ReadOnly, user2ReadOnly;

	  function beforeEachBrowser() {
	    client = stream.connect('ahj2ndz7gsan');
	    client = stream.connect('ahj2ndz7gsan', null, 519, {'group': 'browserTestCycle', 'location': 'eu-west'});

	    if (self.localRun){
	      client.baseUrl = 'http://localhost:8000/api/';
	      client.fayeUrl = 'http://localhost:9999/faye/';
	    }

	    user1 = client.feed('user', '11', 'YHEtoaiaB03gBR9px6vX4HCRVKk');
	    aggregated2 = client.feed('aggregated', '22', 'HxAmzOcePOz0vAIpyEolPl5NEfA');
	    aggregated3 = client.feed('aggregated', '33', 'YxCkg56vpnabvHPNLCHK7Se36FY');
	    flat3 = client.feed('flat', '33', 'MqPLN1eA_7l5iYrJ8zMyImkY8V0');
	    secret3 = client.feed('secret', '33', 'fo8mzeoxsa1if2te5KWJtOF-cZw');
	    notification3 = client.feed('notification', '33', 'h2YC_zy7fcHQUAJc5kNhZaH9Kp0');
	    user1ReadOnly = client.feed('user', '11', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmZWVkX2lkIjoidXNlcjExIiwicmVzb3VyY2UiOiIqIiwiYWN0aW9uIjoicmVhZCIsImlhdCI6MTQzMzkzODYyMX0.8FAc6ja0Gb2IBZjBIJ7NnsbtMHpGtDpreej-z84NPOQ');
	  }

	  function beforeEachNode() {
	    client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
	    client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy', 519, {'group': 'testCycle', 'location': 'us-east'});
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
	    };
	    function responseCallback () {
	      called.response += 1;
	    };
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
	    var client = user1.getFayeClient()
	    var subscription = user1.subscribe(function callback() {
	    });
	    subscription.then(function() {
	      done();
	   });
	  });

	  it('fayeSubscribeListening', function(done) {
	    this.timeout(6000);

	    var testUser1 = client.feed('user', '111', 'ksBmfluIarcgjR9e6ptwqkWZWJo'),
	        testUser2 = client.feed('user', '222', 'psuPHwgwoX-PGsg780jcXdO93VM'),
	        testUser3 = client.feed('user', '333', '7e4xHA0y1Pn6_iZAv7nu0ujuMXg');

	    var subscribes = [],
	        messages = 0,
	        N_MESSAGES = 3,
	        activity = {
	      'verb': 'test',
	      'actor': 'User:1',
	      'object': 1
	    };

	    var msgCallback = function(message) {
	      if( message && message.new && message.new.length > 0) {
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

	    Faye.Promise.all([
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

	    var testUser1 = client.feed('user', '111', 'psuPHwgwoX-PGsg780jcXdO93VM'),
	        testUser2 = client.feed('user', '222', 'psuPHwgwoX-PGsg780jcXdO93VM');

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

	      client.followMany(follows, wrapCB(201, done));
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
	      })
	      p.catch(function(errorObj) {
	        done();
	      });
	  });
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, Buffer) {(function (global, module) {

	  var exports = module.exports;

	  /**
	   * Exports.
	   */

	  module.exports = expect;
	  expect.Assertion = Assertion;

	  /**
	   * Exports version.
	   */

	  expect.version = '0.3.1';

	  /**
	   * Possible assertion flags.
	   */

	  var flags = {
	      not: ['to', 'be', 'have', 'include', 'only']
	    , to: ['be', 'have', 'include', 'only', 'not']
	    , only: ['have']
	    , have: ['own']
	    , be: ['an']
	  };

	  function expect (obj) {
	    return new Assertion(obj);
	  }

	  /**
	   * Constructor
	   *
	   * @api private
	   */

	  function Assertion (obj, flag, parent) {
	    this.obj = obj;
	    this.flags = {};

	    if (undefined != parent) {
	      this.flags[flag] = true;

	      for (var i in parent.flags) {
	        if (parent.flags.hasOwnProperty(i)) {
	          this.flags[i] = true;
	        }
	      }
	    }

	    var $flags = flag ? flags[flag] : keys(flags)
	      , self = this;

	    if ($flags) {
	      for (var i = 0, l = $flags.length; i < l; i++) {
	        // avoid recursion
	        if (this.flags[$flags[i]]) continue;

	        var name = $flags[i]
	          , assertion = new Assertion(this.obj, name, this)

	        if ('function' == typeof Assertion.prototype[name]) {
	          // clone the function, make sure we dont touch the prot reference
	          var old = this[name];
	          this[name] = function () {
	            return old.apply(self, arguments);
	          };

	          for (var fn in Assertion.prototype) {
	            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
	              this[name][fn] = bind(assertion[fn], assertion);
	            }
	          }
	        } else {
	          this[name] = assertion;
	        }
	      }
	    }
	  }

	  /**
	   * Performs an assertion
	   *
	   * @api private
	   */

	  Assertion.prototype.assert = function (truth, msg, error, expected) {
	    var msg = this.flags.not ? error : msg
	      , ok = this.flags.not ? !truth : truth
	      , err;

	    if (!ok) {
	      err = new Error(msg.call(this));
	      if (arguments.length > 3) {
	        err.actual = this.obj;
	        err.expected = expected;
	        err.showDiff = true;
	      }
	      throw err;
	    }

	    this.and = new Assertion(this.obj);
	  };

	  /**
	   * Check if the value is truthy
	   *
	   * @api public
	   */

	  Assertion.prototype.ok = function () {
	    this.assert(
	        !!this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
	      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
	  };

	  /**
	   * Creates an anonymous function which calls fn with arguments.
	   *
	   * @api public
	   */

	  Assertion.prototype.withArgs = function() {
	    expect(this.obj).to.be.a('function');
	    var fn = this.obj;
	    var args = Array.prototype.slice.call(arguments);
	    return expect(function() { fn.apply(null, args); });
	  };

	  /**
	   * Assert that the function throws.
	   *
	   * @param {Function|RegExp} callback, or regexp to match error string against
	   * @api public
	   */

	  Assertion.prototype.throwError =
	  Assertion.prototype.throwException = function (fn) {
	    expect(this.obj).to.be.a('function');

	    var thrown = false
	      , not = this.flags.not;

	    try {
	      this.obj();
	    } catch (e) {
	      if (isRegExp(fn)) {
	        var subject = 'string' == typeof e ? e : e.message;
	        if (not) {
	          expect(subject).to.not.match(fn);
	        } else {
	          expect(subject).to.match(fn);
	        }
	      } else if ('function' == typeof fn) {
	        fn(e);
	      }
	      thrown = true;
	    }

	    if (isRegExp(fn) && not) {
	      // in the presence of a matcher, ensure the `not` only applies to
	      // the matching.
	      this.flags.not = false;
	    }

	    var name = this.obj.name || 'fn';
	    this.assert(
	        thrown
	      , function(){ return 'expected ' + name + ' to throw an exception' }
	      , function(){ return 'expected ' + name + ' not to throw an exception' });
	  };

	  /**
	   * Checks if the array is empty.
	   *
	   * @api public
	   */

	  Assertion.prototype.empty = function () {
	    var expectation;

	    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
	      if ('number' == typeof this.obj.length) {
	        expectation = !this.obj.length;
	      } else {
	        expectation = !keys(this.obj).length;
	      }
	    } else {
	      if ('string' != typeof this.obj) {
	        expect(this.obj).to.be.an('object');
	      }

	      expect(this.obj).to.have.property('length');
	      expectation = !this.obj.length;
	    }

	    this.assert(
	        expectation
	      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
	    return this;
	  };

	  /**
	   * Checks if the obj exactly equals another.
	   *
	   * @api public
	   */

	  Assertion.prototype.be =
	  Assertion.prototype.equal = function (obj) {
	    this.assert(
	        obj === this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
	    return this;
	  };

	  /**
	   * Checks if the obj sortof equals another.
	   *
	   * @api public
	   */

	  Assertion.prototype.eql = function (obj) {
	    this.assert(
	        expect.eql(this.obj, obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
	      , obj);
	    return this;
	  };

	  /**
	   * Assert within start to finish (inclusive).
	   *
	   * @param {Number} start
	   * @param {Number} finish
	   * @api public
	   */

	  Assertion.prototype.within = function (start, finish) {
	    var range = start + '..' + finish;
	    this.assert(
	        this.obj >= start && this.obj <= finish
	      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
	    return this;
	  };

	  /**
	   * Assert typeof / instance of
	   *
	   * @api public
	   */

	  Assertion.prototype.a =
	  Assertion.prototype.an = function (type) {
	    if ('string' == typeof type) {
	      // proper english in error msg
	      var n = /^[aeiou]/.test(type) ? 'n' : '';

	      // typeof with support for 'array'
	      this.assert(
	          'array' == type ? isArray(this.obj) :
	            'regexp' == type ? isRegExp(this.obj) :
	              'object' == type
	                ? 'object' == typeof this.obj && null !== this.obj
	                : type == typeof this.obj
	        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
	    } else {
	      // instanceof
	      var name = type.name || 'supplied constructor';
	      this.assert(
	          this.obj instanceof type
	        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
	    }

	    return this;
	  };

	  /**
	   * Assert numeric value above _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */

	  Assertion.prototype.greaterThan =
	  Assertion.prototype.above = function (n) {
	    this.assert(
	        this.obj > n
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
	    return this;
	  };

	  /**
	   * Assert numeric value below _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */

	  Assertion.prototype.lessThan =
	  Assertion.prototype.below = function (n) {
	    this.assert(
	        this.obj < n
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
	    return this;
	  };

	  /**
	   * Assert string value matches _regexp_.
	   *
	   * @param {RegExp} regexp
	   * @api public
	   */

	  Assertion.prototype.match = function (regexp) {
	    this.assert(
	        regexp.exec(this.obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
	      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
	    return this;
	  };

	  /**
	   * Assert property "length" exists and has value of _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */

	  Assertion.prototype.length = function (n) {
	    expect(this.obj).to.have.property('length');
	    var len = this.obj.length;
	    this.assert(
	        n == len
	      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
	      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
	    return this;
	  };

	  /**
	   * Assert property _name_ exists, with optional _val_.
	   *
	   * @param {String} name
	   * @param {Mixed} val
	   * @api public
	   */

	  Assertion.prototype.property = function (name, val) {
	    if (this.flags.own) {
	      this.assert(
	          Object.prototype.hasOwnProperty.call(this.obj, name)
	        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
	      return this;
	    }

	    if (this.flags.not && undefined !== val) {
	      if (undefined === this.obj[name]) {
	        throw new Error(i(this.obj) + ' has no property ' + i(name));
	      }
	    } else {
	      var hasProp;
	      try {
	        hasProp = name in this.obj
	      } catch (e) {
	        hasProp = undefined !== this.obj[name]
	      }

	      this.assert(
	          hasProp
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
	    }

	    if (undefined !== val) {
	      this.assert(
	          val === this.obj[name]
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
	          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
	          + ' of ' + i(val) });
	    }

	    this.obj = this.obj[name];
	    return this;
	  };

	  /**
	   * Assert that the array contains _obj_ or string contains _obj_.
	   *
	   * @param {Mixed} obj|string
	   * @api public
	   */

	  Assertion.prototype.string =
	  Assertion.prototype.contain = function (obj) {
	    if ('string' == typeof this.obj) {
	      this.assert(
	          ~this.obj.indexOf(obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    } else {
	      this.assert(
	          ~indexOf(this.obj, obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    }
	    return this;
	  };

	  /**
	   * Assert exact keys or inclusion of keys by using
	   * the `.own` modifier.
	   *
	   * @param {Array|String ...} keys
	   * @api public
	   */

	  Assertion.prototype.key =
	  Assertion.prototype.keys = function ($keys) {
	    var str
	      , ok = true;

	    $keys = isArray($keys)
	      ? $keys
	      : Array.prototype.slice.call(arguments);

	    if (!$keys.length) throw new Error('keys required');

	    var actual = keys(this.obj)
	      , len = $keys.length;

	    // Inclusion
	    ok = every($keys, function (key) {
	      return ~indexOf(actual, key);
	    });

	    // Strict
	    if (!this.flags.not && this.flags.only) {
	      ok = ok && $keys.length == actual.length;
	    }

	    // Key string
	    if (len > 1) {
	      $keys = map($keys, function (key) {
	        return i(key);
	      });
	      var last = $keys.pop();
	      str = $keys.join(', ') + ', and ' + last;
	    } else {
	      str = i($keys[0]);
	    }

	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;

	    // Have / include
	    str = (!this.flags.only ? 'include ' : 'only have ') + str;

	    // Assertion
	    this.assert(
	        ok
	      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
	      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

	    return this;
	  };

	  /**
	   * Assert a failure.
	   *
	   * @param {String ...} custom message
	   * @api public
	   */
	  Assertion.prototype.fail = function (msg) {
	    var error = function() { return msg || "explicit failure"; }
	    this.assert(false, error, error);
	    return this;
	  };

	  /**
	   * Function bind implementation.
	   */

	  function bind (fn, scope) {
	    return function () {
	      return fn.apply(scope, arguments);
	    }
	  }

	  /**
	   * Array every compatibility
	   *
	   * @see bit.ly/5Fq1N2
	   * @api public
	   */

	  function every (arr, fn, thisObj) {
	    var scope = thisObj || global;
	    for (var i = 0, j = arr.length; i < j; ++i) {
	      if (!fn.call(scope, arr[i], i, arr)) {
	        return false;
	      }
	    }
	    return true;
	  }

	  /**
	   * Array indexOf compatibility.
	   *
	   * @see bit.ly/a5Dxa2
	   * @api public
	   */

	  function indexOf (arr, o, i) {
	    if (Array.prototype.indexOf) {
	      return Array.prototype.indexOf.call(arr, o, i);
	    }

	    if (arr.length === undefined) {
	      return -1;
	    }

	    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
	        ; i < j && arr[i] !== o; i++);

	    return j <= i ? -1 : i;
	  }

	  // https://gist.github.com/1044128/
	  var getOuterHTML = function(element) {
	    if ('outerHTML' in element) return element.outerHTML;
	    var ns = "http://www.w3.org/1999/xhtml";
	    var container = document.createElementNS(ns, '_');
	    var xmlSerializer = new XMLSerializer();
	    var html;
	    if (document.xmlVersion) {
	      return xmlSerializer.serializeToString(element);
	    } else {
	      container.appendChild(element.cloneNode(false));
	      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
	      container.innerHTML = '';
	      return html;
	    }
	  };

	  // Returns true if object is a DOM element.
	  var isDOMElement = function (object) {
	    if (typeof HTMLElement === 'object') {
	      return object instanceof HTMLElement;
	    } else {
	      return object &&
	        typeof object === 'object' &&
	        object.nodeType === 1 &&
	        typeof object.nodeName === 'string';
	    }
	  };

	  /**
	   * Inspects an object.
	   *
	   * @see taken from node.js `util` module (copyright Joyent, MIT license)
	   * @api private
	   */

	  function i (obj, showHidden, depth) {
	    var seen = [];

	    function stylize (str) {
	      return str;
	    }

	    function format (value, recurseTimes) {
	      // Provide a hook for user-specified inspect functions.
	      // Check that value is an object with an inspect function on it
	      if (value && typeof value.inspect === 'function' &&
	          // Filter out the util module, it's inspect function is special
	          value !== exports &&
	          // Also filter out any prototype objects using the circular check.
	          !(value.constructor && value.constructor.prototype === value)) {
	        return value.inspect(recurseTimes);
	      }

	      // Primitive types cannot have properties
	      switch (typeof value) {
	        case 'undefined':
	          return stylize('undefined', 'undefined');

	        case 'string':
	          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
	                                                   .replace(/'/g, "\\'")
	                                                   .replace(/\\"/g, '"') + '\'';
	          return stylize(simple, 'string');

	        case 'number':
	          return stylize('' + value, 'number');

	        case 'boolean':
	          return stylize('' + value, 'boolean');
	      }
	      // For some reason typeof null is "object", so special case here.
	      if (value === null) {
	        return stylize('null', 'null');
	      }

	      if (isDOMElement(value)) {
	        return getOuterHTML(value);
	      }

	      // Look up the keys of the object.
	      var visible_keys = keys(value);
	      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

	      // Functions without properties can be shortcutted.
	      if (typeof value === 'function' && $keys.length === 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          var name = value.name ? ': ' + value.name : '';
	          return stylize('[Function' + name + ']', 'special');
	        }
	      }

	      // Dates without properties can be shortcutted
	      if (isDate(value) && $keys.length === 0) {
	        return stylize(value.toUTCString(), 'date');
	      }
	      
	      // Error objects can be shortcutted
	      if (value instanceof Error) {
	        return stylize("["+value.toString()+"]", 'Error');
	      }

	      var base, type, braces;
	      // Determine the object type
	      if (isArray(value)) {
	        type = 'Array';
	        braces = ['[', ']'];
	      } else {
	        type = 'Object';
	        braces = ['{', '}'];
	      }

	      // Make functions say that they are functions
	      if (typeof value === 'function') {
	        var n = value.name ? ': ' + value.name : '';
	        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	      } else {
	        base = '';
	      }

	      // Make dates with properties first say the date
	      if (isDate(value)) {
	        base = ' ' + value.toUTCString();
	      }

	      if ($keys.length === 0) {
	        return braces[0] + base + braces[1];
	      }

	      if (recurseTimes < 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          return stylize('[Object]', 'special');
	        }
	      }

	      seen.push(value);

	      var output = map($keys, function (key) {
	        var name, str;
	        if (value.__lookupGetter__) {
	          if (value.__lookupGetter__(key)) {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Getter/Setter]', 'special');
	            } else {
	              str = stylize('[Getter]', 'special');
	            }
	          } else {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Setter]', 'special');
	            }
	          }
	        }
	        if (indexOf(visible_keys, key) < 0) {
	          name = '[' + key + ']';
	        }
	        if (!str) {
	          if (indexOf(seen, value[key]) < 0) {
	            if (recurseTimes === null) {
	              str = format(value[key]);
	            } else {
	              str = format(value[key], recurseTimes - 1);
	            }
	            if (str.indexOf('\n') > -1) {
	              if (isArray(value)) {
	                str = map(str.split('\n'), function (line) {
	                  return '  ' + line;
	                }).join('\n').substr(2);
	              } else {
	                str = '\n' + map(str.split('\n'), function (line) {
	                  return '   ' + line;
	                }).join('\n');
	              }
	            }
	          } else {
	            str = stylize('[Circular]', 'special');
	          }
	        }
	        if (typeof name === 'undefined') {
	          if (type === 'Array' && key.match(/^\d+$/)) {
	            return str;
	          }
	          name = json.stringify('' + key);
	          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	            name = name.substr(1, name.length - 2);
	            name = stylize(name, 'name');
	          } else {
	            name = name.replace(/'/g, "\\'")
	                       .replace(/\\"/g, '"')
	                       .replace(/(^"|"$)/g, "'");
	            name = stylize(name, 'string');
	          }
	        }

	        return name + ': ' + str;
	      });

	      seen.pop();

	      var numLinesEst = 0;
	      var length = reduce(output, function (prev, cur) {
	        numLinesEst++;
	        if (indexOf(cur, '\n') >= 0) numLinesEst++;
	        return prev + cur.length + 1;
	      }, 0);

	      if (length > 50) {
	        output = braces[0] +
	                 (base === '' ? '' : base + '\n ') +
	                 ' ' +
	                 output.join(',\n  ') +
	                 ' ' +
	                 braces[1];

	      } else {
	        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	      }

	      return output;
	    }
	    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	  }

	  expect.stringify = i;

	  function isArray (ar) {
	    return Object.prototype.toString.call(ar) === '[object Array]';
	  }

	  function isRegExp(re) {
	    var s;
	    try {
	      s = '' + re;
	    } catch (e) {
	      return false;
	    }

	    return re instanceof RegExp || // easy case
	           // duck-type for context-switching evalcx case
	           typeof(re) === 'function' &&
	           re.constructor.name === 'RegExp' &&
	           re.compile &&
	           re.test &&
	           re.exec &&
	           s.match(/^\/.*\/[gim]{0,3}$/);
	  }

	  function isDate(d) {
	    return d instanceof Date;
	  }

	  function keys (obj) {
	    if (Object.keys) {
	      return Object.keys(obj);
	    }

	    var keys = [];

	    for (var i in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, i)) {
	        keys.push(i);
	      }
	    }

	    return keys;
	  }

	  function map (arr, mapper, that) {
	    if (Array.prototype.map) {
	      return Array.prototype.map.call(arr, mapper, that);
	    }

	    var other= new Array(arr.length);

	    for (var i= 0, n = arr.length; i<n; i++)
	      if (i in arr)
	        other[i] = mapper.call(that, arr[i], i, arr);

	    return other;
	  }

	  function reduce (arr, fun) {
	    if (Array.prototype.reduce) {
	      return Array.prototype.reduce.apply(
	          arr
	        , Array.prototype.slice.call(arguments, 1)
	      );
	    }

	    var len = +this.length;

	    if (typeof fun !== "function")
	      throw new TypeError();

	    // no value to return if no initial value and an empty array
	    if (len === 0 && arguments.length === 1)
	      throw new TypeError();

	    var i = 0;
	    if (arguments.length >= 2) {
	      var rv = arguments[1];
	    } else {
	      do {
	        if (i in this) {
	          rv = this[i++];
	          break;
	        }

	        // if array contains no values, no initial value to return
	        if (++i >= len)
	          throw new TypeError();
	      } while (true);
	    }

	    for (; i < len; i++) {
	      if (i in this)
	        rv = fun.call(null, rv, this[i], i, this);
	    }

	    return rv;
	  }

	  /**
	   * Asserts deep equality
	   *
	   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
	   * @api private
	   */

	  expect.eql = function eql(actual, expected) {
	    // 7.1. All identical values are equivalent, as determined by ===.
	    if (actual === expected) {
	      return true;
	    } else if ('undefined' != typeof Buffer
	      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	      if (actual.length != expected.length) return false;

	      for (var i = 0; i < actual.length; i++) {
	        if (actual[i] !== expected[i]) return false;
	      }

	      return true;

	      // 7.2. If the expected value is a Date object, the actual value is
	      // equivalent if it is also a Date object that refers to the same time.
	    } else if (actual instanceof Date && expected instanceof Date) {
	      return actual.getTime() === expected.getTime();

	      // 7.3. Other pairs that do not both pass typeof value == "object",
	      // equivalence is determined by ==.
	    } else if (typeof actual != 'object' && typeof expected != 'object') {
	      return actual == expected;
	    // If both are regular expression use the special `regExpEquiv` method
	    // to determine equivalence.
	    } else if (isRegExp(actual) && isRegExp(expected)) {
	      return regExpEquiv(actual, expected);
	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical "prototype" property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	    } else {
	      return objEquiv(actual, expected);
	    }
	  };

	  function isUndefinedOrNull (value) {
	    return value === null || value === undefined;
	  }

	  function isArguments (object) {
	    return Object.prototype.toString.call(object) == '[object Arguments]';
	  }

	  function regExpEquiv (a, b) {
	    return a.source === b.source && a.global === b.global &&
	           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
	  }

	  function objEquiv (a, b) {
	    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	      return false;
	    // an identical "prototype" property.
	    if (a.prototype !== b.prototype) return false;
	    //~~~I've managed to break Object.keys through screwy arguments passing.
	    //   Converting to array solves the problem.
	    if (isArguments(a)) {
	      if (!isArguments(b)) {
	        return false;
	      }
	      a = pSlice.call(a);
	      b = pSlice.call(b);
	      return expect.eql(a, b);
	    }
	    try{
	      var ka = keys(a),
	        kb = keys(b),
	        key, i;
	    } catch (e) {//happens when one is a string literal and the other isn't
	      return false;
	    }
	    // having the same number of owned properties (keys incorporates hasOwnProperty)
	    if (ka.length != kb.length)
	      return false;
	    //the same set of keys (although not necessarily the same order),
	    ka.sort();
	    kb.sort();
	    //~~~cheap key test
	    for (i = ka.length - 1; i >= 0; i--) {
	      if (ka[i] != kb[i])
	        return false;
	    }
	    //equivalent values for every corresponding key, and
	    //~~~possibly expensive deep test
	    for (i = ka.length - 1; i >= 0; i--) {
	      key = ka[i];
	      if (!expect.eql(a[key], b[key]))
	         return false;
	    }
	    return true;
	  }

	  var json = (function () {
	    "use strict";

	    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
	      return {
	          parse: nativeJSON.parse
	        , stringify: nativeJSON.stringify
	      }
	    }

	    var JSON = {};

	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }

	    function date(d, key) {
	      return isFinite(d.valueOf()) ?
	          d.getUTCFullYear()     + '-' +
	          f(d.getUTCMonth() + 1) + '-' +
	          f(d.getUTCDate())      + 'T' +
	          f(d.getUTCHours())     + ':' +
	          f(d.getUTCMinutes())   + ':' +
	          f(d.getUTCSeconds())   + 'Z' : null;
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;


	    function quote(string) {

	  // If the string contains no control characters, no quote characters, and no
	  // backslash characters, then we can safely slap some quotes around it.
	  // Otherwise we must also replace the offending characters with safe escape
	  // sequences.

	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {

	  // Produce a string from holder[key].

	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	  // If the value has a toJSON method, call it to obtain a replacement value.

	        if (value instanceof Date) {
	            value = date(key);
	        }

	  // If we were called with a replacer function, then call the replacer to
	  // obtain a replacement value.

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	  // What happens next depends on the value's type.

	        switch (typeof value) {
	        case 'string':
	            return quote(value);

	        case 'number':

	  // JSON numbers must be finite. Encode non-finite numbers as null.

	            return isFinite(value) ? String(value) : 'null';

	        case 'boolean':
	        case 'null':

	  // If the value is a boolean or null, convert it to a string. Note:
	  // typeof null does not produce 'null'. The case is included here in
	  // the remote chance that this gets fixed someday.

	            return String(value);

	  // If the type is 'object', we might be dealing with an object or an array or
	  // null.

	        case 'object':

	  // Due to a specification blunder in ECMAScript, typeof null is 'object',
	  // so watch out for that case.

	            if (!value) {
	                return 'null';
	            }

	  // Make an array to hold the partial results of stringifying this object value.

	            gap += indent;
	            partial = [];

	  // Is the value an array?

	            if (Object.prototype.toString.apply(value) === '[object Array]') {

	  // The value is an array. Stringify every element. Use null as a placeholder
	  // for non-JSON values.

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }

	  // Join all of the elements together, separated with commas, and wrap them in
	  // brackets.

	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	  // If the replacer is an array, use it to select the members to be stringified.

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {

	  // Otherwise, iterate through all of the keys in the object.

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	  // Join all of the member texts together, separated with commas,
	  // and wrap them in braces.

	            v = partial.length === 0 ? '{}' : gap ?
	                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	                '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	  // If the JSON object does not yet have a stringify method, give it one.

	    JSON.stringify = function (value, replacer, space) {

	  // The stringify method takes a value and an optional replacer, and an optional
	  // space parameter, and returns a JSON text. The replacer can be a function
	  // that can replace values, or an array of strings that will select the keys.
	  // A default replacer method can be provided. Use of the space parameter can
	  // produce text that is more easily readable.

	        var i;
	        gap = '';
	        indent = '';

	  // If the space parameter is a number, make an indent string containing that
	  // many spaces.

	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }

	  // If the space parameter is a string, it will be used as the indent string.

	        } else if (typeof space === 'string') {
	            indent = space;
	        }

	  // If there is a replacer, it must be a function or an array.
	  // Otherwise, throw an error.

	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                typeof replacer.length !== 'number')) {
	            throw new Error('JSON.stringify');
	        }

	  // Make a fake root object containing our value under the key of ''.
	  // Return the result of stringifying the value.

	        return str('', {'': value});
	    };

	  // If the JSON object does not yet have a parse method, give it one.

	    JSON.parse = function (text, reviver) {
	    // The parse method takes a text and an optional reviver function, and returns
	    // a JavaScript value if the text is a valid JSON text.

	        var j;

	        function walk(holder, key) {

	    // The walk method is used to recursively walk the resulting structure so
	    // that modifications can be made.

	            var k, v, value = holder[key];
	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }


	    // Parsing happens in four stages. In the first stage, we replace certain
	    // Unicode characters with escape sequences. JavaScript handles many characters
	    // incorrectly, either silently deleting them, or treating them as line endings.

	        text = String(text);
	        cx.lastIndex = 0;
	        if (cx.test(text)) {
	            text = text.replace(cx, function (a) {
	                return '\\u' +
	                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            });
	        }

	    // In the second stage, we run the text against regular expressions that look
	    // for non-JSON patterns. We are especially concerned with '()' and 'new'
	    // because they can cause invocation, and '=' because it can cause mutation.
	    // But just to be safe, we want to reject all unexpected forms.

	    // We split the second stage into 4 regexp operations in order to work around
	    // crippling inefficiencies in IE's and Safari's regexp engines. First we
	    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	    // replace all simple value tokens with ']' characters. Third, we delete all
	    // open brackets that follow a colon or comma or that begin the text. Finally,
	    // we look to see that the remaining characters are only whitespace or ']' or
	    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

	        if (/^[\],:{}\s]*$/
	                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

	    // In the third stage we use the eval function to compile the text into a
	    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	    // in JavaScript: it can begin a block or an object literal. We wrap the text
	    // in parens to eliminate the ambiguity.

	            j = eval('(' + text + ')');

	    // In the optional fourth stage, we recursively walk the new structure, passing
	    // each name/value pair to a reviver function for possible transformation.

	            return typeof reviver === 'function' ?
	                walk({'': j}, '') : j;
	        }

	    // If the text is not JSON parseable, then a SyntaxError is thrown.

	        throw new SyntaxError('JSON.parse');
	    };

	    return JSON;
	  })();

	  if ('undefined' != typeof window) {
	    window.expect = module.exports;
	  }

	})(
	    this
	  ,  true ? module : {exports: {}}
	);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), __webpack_require__(5).Buffer))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	var base64 = __webpack_require__(6)
	var ieee754 = __webpack_require__(7)
	var isArray = __webpack_require__(8)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  this.length = 0
	  this.parent = undefined

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, setImmediate, process) {(function() {
	'use strict';

	var Faye = {
	  VERSION:          '1.1.2',

	  BAYEUX_VERSION:   '1.0',
	  ID_LENGTH:        160,
	  JSONP_CALLBACK:   'jsonpcallback',
	  CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

	  MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process'],

	  ENV: (typeof window !== 'undefined') ? window : global,

	  extend: function(dest, source, overwrite) {
	    if (!source) return dest;
	    for (var key in source) {
	      if (!source.hasOwnProperty(key)) continue;
	      if (dest.hasOwnProperty(key) && overwrite === false) continue;
	      if (dest[key] !== source[key])
	        dest[key] = source[key];
	    }
	    return dest;
	  },

	  random: function(bitlength) {
	    bitlength = bitlength || this.ID_LENGTH;
	    var maxLength = Math.ceil(bitlength * Math.log(2) / Math.log(36));
	    var string = csprng(bitlength, 36);
	    while (string.length < maxLength) string = '0' + string;
	    return string;
	  },

	  validateOptions: function(options, validKeys) {
	    for (var key in options) {
	      if (this.indexOf(validKeys, key) < 0)
	        throw new Error('Unrecognized option: ' + key);
	    }
	  },

	  clientIdFromMessages: function(messages) {
	    var connect = this.filter([].concat(messages), function(message) {
	      return message.channel === '/meta/connect';
	    });
	    return connect[0] && connect[0].clientId;
	  },

	  copyObject: function(object) {
	    var clone, i, key;
	    if (object instanceof Array) {
	      clone = [];
	      i = object.length;
	      while (i--) clone[i] = Faye.copyObject(object[i]);
	      return clone;
	    } else if (typeof object === 'object') {
	      clone = (object === null) ? null : {};
	      for (key in object) clone[key] = Faye.copyObject(object[key]);
	      return clone;
	    } else {
	      return object;
	    }
	  },

	  commonElement: function(lista, listb) {
	    for (var i = 0, n = lista.length; i < n; i++) {
	      if (this.indexOf(listb, lista[i]) !== -1)
	        return lista[i];
	    }
	    return null;
	  },

	  indexOf: function(list, needle) {
	    if (list.indexOf) return list.indexOf(needle);

	    for (var i = 0, n = list.length; i < n; i++) {
	      if (list[i] === needle) return i;
	    }
	    return -1;
	  },

	  map: function(object, callback, context) {
	    if (object.map) return object.map(callback, context);
	    var result = [];

	    if (object instanceof Array) {
	      for (var i = 0, n = object.length; i < n; i++) {
	        result.push(callback.call(context || null, object[i], i));
	      }
	    } else {
	      for (var key in object) {
	        if (!object.hasOwnProperty(key)) continue;
	        result.push(callback.call(context || null, key, object[key]));
	      }
	    }
	    return result;
	  },

	  filter: function(array, callback, context) {
	    if (array.filter) return array.filter(callback, context);
	    var result = [];
	    for (var i = 0, n = array.length; i < n; i++) {
	      if (callback.call(context || null, array[i], i))
	        result.push(array[i]);
	    }
	    return result;
	  },

	  asyncEach: function(list, iterator, callback, context) {
	    var n       = list.length,
	        i       = -1,
	        calls   = 0,
	        looping = false;

	    var iterate = function() {
	      calls -= 1;
	      i += 1;
	      if (i === n) return callback && callback.call(context);
	      iterator(list[i], resume);
	    };

	    var loop = function() {
	      if (looping) return;
	      looping = true;
	      while (calls > 0) iterate();
	      looping = false;
	    };

	    var resume = function() {
	      calls += 1;
	      loop();
	    };
	    resume();
	  },

	  // http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/
	  toJSON: function(object) {
	    if (!this.stringify) return JSON.stringify(object);

	    return this.stringify(object, function(key, value) {
	      return (this[key] instanceof Array) ? this[key] : value;
	    });
	  }
	};

	if (true)
	  module.exports = Faye;
	else if (typeof window !== 'undefined')
	  window.Faye = Faye;

	Faye.Class = function(parent, methods) {
	  if (typeof parent !== 'function') {
	    methods = parent;
	    parent  = Object;
	  }

	  var klass = function() {
	    if (!this.initialize) return this;
	    return this.initialize.apply(this, arguments) || this;
	  };

	  var bridge = function() {};
	  bridge.prototype = parent.prototype;

	  klass.prototype = new bridge();
	  Faye.extend(klass.prototype, methods);

	  return klass;
	};

	(function() {
	var EventEmitter = Faye.EventEmitter = function() {};

	/*
	Copyright Joyent, Inc. and other Node contributors. All rights reserved.
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	var isArray = typeof Array.isArray === 'function'
	    ? Array.isArray
	    : function (xs) {
	        return Object.prototype.toString.call(xs) === '[object Array]'
	    }
	;
	function indexOf (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (x === xs[i]) return i;
	    }
	    return -1;
	}


	EventEmitter.prototype.emit = function(type) {
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events || !this._events.error ||
	        (isArray(this._events.error) && !this._events.error.length))
	    {
	      if (arguments[1] instanceof Error) {
	        throw arguments[1]; // Unhandled 'error' event
	      } else {
	        throw new Error("Uncaught, unspecified 'error' event.");
	      }
	      return false;
	    }
	  }

	  if (!this._events) return false;
	  var handler = this._events[type];
	  if (!handler) return false;

	  if (typeof handler == 'function') {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        var args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	    return true;

	  } else if (isArray(handler)) {
	    var args = Array.prototype.slice.call(arguments, 1);

	    var listeners = handler.slice();
	    for (var i = 0, l = listeners.length; i < l; i++) {
	      listeners[i].apply(this, args);
	    }
	    return true;

	  } else {
	    return false;
	  }
	};

	// EventEmitter is defined in src/node_events.cc
	// EventEmitter.prototype.emit() is also defined there.
	EventEmitter.prototype.addListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('addListener only takes instances of Function');
	  }

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type == "newListeners"! Before
	  // adding it to the listeners, first emit "newListeners".
	  this.emit('newListener', type, listener);

	  if (!this._events[type]) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  } else if (isArray(this._events[type])) {
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  } else {
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  var self = this;
	  self.on(type, function g() {
	    self.removeListener(type, g);
	    listener.apply(this, arguments);
	  });

	  return this;
	};

	EventEmitter.prototype.removeListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('removeListener only takes instances of Function');
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (!this._events || !this._events[type]) return this;

	  var list = this._events[type];

	  if (isArray(list)) {
	    var i = indexOf(list, listener);
	    if (i < 0) return this;
	    list.splice(i, 1);
	    if (list.length == 0)
	      delete this._events[type];
	  } else if (this._events[type] === listener) {
	    delete this._events[type];
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (arguments.length === 0) {
	    this._events = {};
	    return this;
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (type && this._events && this._events[type]) this._events[type] = null;
	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  if (!this._events) this._events = {};
	  if (!this._events[type]) this._events[type] = [];
	  if (!isArray(this._events[type])) {
	    this._events[type] = [this._events[type]];
	  }
	  return this._events[type];
	};

	})();

	Faye.Namespace = Faye.Class({
	  initialize: function() {
	    this._used = {};
	  },

	  exists: function(id) {
	    return this._used.hasOwnProperty(id);
	  },

	  generate: function() {
	    var name = Faye.random();
	    while (this._used.hasOwnProperty(name))
	      name = Faye.random();
	    return this._used[name] = name;
	  },

	  release: function(id) {
	    delete this._used[id];
	  }
	});

	(function() {
	'use strict';

	var timeout = setTimeout, defer;

	if (typeof setImmediate === 'function')
	  defer = function(fn) { setImmediate(fn) };
	else if (typeof process === 'object' && process.nextTick)
	  defer = function(fn) { process.nextTick(fn) };
	else
	  defer = function(fn) { timeout(fn, 0) };

	var PENDING   = 0,
	    FULFILLED = 1,
	    REJECTED  = 2;

	var RETURN = function(x) { return x },
	    THROW  = function(x) { throw  x };

	var Promise = function(task) {
	  this._state       = PENDING;
	  this._onFulfilled = [];
	  this._onRejected  = [];

	  if (typeof task !== 'function') return;
	  var self = this;

	  task(function(value)  { fulfill(self, value) },
	       function(reason) { reject(self, reason) });
	};

	Promise.prototype.then = function(onFulfilled, onRejected) {
	  var next = new Promise();
	  registerOnFulfilled(this, onFulfilled, next);
	  registerOnRejected(this, onRejected, next);
	  return next;
	};

	var registerOnFulfilled = function(promise, onFulfilled, next) {
	  if (typeof onFulfilled !== 'function') onFulfilled = RETURN;
	  var handler = function(value) { invoke(onFulfilled, value, next) };

	  if (promise._state === PENDING) {
	    promise._onFulfilled.push(handler);
	  } else if (promise._state === FULFILLED) {
	    handler(promise._value);
	  }
	};

	var registerOnRejected = function(promise, onRejected, next) {
	  if (typeof onRejected !== 'function') onRejected = THROW;
	  var handler = function(reason) { invoke(onRejected, reason, next) };

	  if (promise._state === PENDING) {
	    promise._onRejected.push(handler);
	  } else if (promise._state === REJECTED) {
	    handler(promise._reason);
	  }
	};

	var invoke = function(fn, value, next) {
	  defer(function() { _invoke(fn, value, next) });
	};

	var _invoke = function(fn, value, next) {
	  var outcome;

	  try {
	    outcome = fn(value);
	  } catch (error) {
	    return reject(next, error);
	  }

	  if (outcome === next) {
	    reject(next, new TypeError('Recursive promise chain detected'));
	  } else {
	    fulfill(next, outcome);
	  }
	};

	var fulfill = Promise.fulfill = Promise.resolve = function(promise, value) {
	  var called = false, type, then;

	  try {
	    type = typeof value;
	    then = value !== null && (type === 'function' || type === 'object') && value.then;

	    if (typeof then !== 'function') return _fulfill(promise, value);

	    then.call(value, function(v) {
	      if (!(called ^ (called = true))) return;
	      fulfill(promise, v);
	    }, function(r) {
	      if (!(called ^ (called = true))) return;
	      reject(promise, r);
	    });
	  } catch (error) {
	    if (!(called ^ (called = true))) return;
	    reject(promise, error);
	  }
	};

	var _fulfill = function(promise, value) {
	  if (promise._state !== PENDING) return;

	  promise._state      = FULFILLED;
	  promise._value      = value;
	  promise._onRejected = [];

	  var onFulfilled = promise._onFulfilled, fn;
	  while (fn = onFulfilled.shift()) fn(value);
	};

	var reject = Promise.reject = function(promise, reason) {
	  if (promise._state !== PENDING) return;

	  promise._state       = REJECTED;
	  promise._reason      = reason;
	  promise._onFulfilled = [];

	  var onRejected = promise._onRejected, fn;
	  while (fn = onRejected.shift()) fn(reason);
	};

	Promise.all = function(promises) {
	  return new Promise(function(fulfill, reject) {
	    var list = [],
	         n   = promises.length,
	         i;

	    if (n === 0) return fulfill(list);

	    for (i = 0; i < n; i++) (function(promise, i) {
	      Promise.fulfilled(promise).then(function(value) {
	        list[i] = value;
	        if (--n === 0) fulfill(list);
	      }, reject);
	    })(promises[i], i);
	  });
	};

	Promise.defer = defer;

	Promise.deferred = Promise.pending = function() {
	  var tuple = {};

	  tuple.promise = new Promise(function(fulfill, reject) {
	    tuple.fulfill = tuple.resolve = fulfill;
	    tuple.reject  = reject;
	  });
	  return tuple;
	};

	Promise.fulfilled = Promise.resolved = function(value) {
	  return new Promise(function(fulfill, reject) { fulfill(value) });
	};

	Promise.rejected = function(reason) {
	  return new Promise(function(fulfill, reject) { reject(reason) });
	};

	if (typeof Faye === 'undefined')
	  module.exports = Promise;
	else
	  Faye.Promise = Promise;

	})();

	Faye.Set = Faye.Class({
	  initialize: function() {
	    this._index = {};
	  },

	  add: function(item) {
	    var key = (item.id !== undefined) ? item.id : item;
	    if (this._index.hasOwnProperty(key)) return false;
	    this._index[key] = item;
	    return true;
	  },

	  forEach: function(block, context) {
	    for (var key in this._index) {
	      if (this._index.hasOwnProperty(key))
	        block.call(context, this._index[key]);
	    }
	  },

	  isEmpty: function() {
	    for (var key in this._index) {
	      if (this._index.hasOwnProperty(key)) return false;
	    }
	    return true;
	  },

	  member: function(item) {
	    for (var key in this._index) {
	      if (this._index[key] === item) return true;
	    }
	    return false;
	  },

	  remove: function(item) {
	    var key = (item.id !== undefined) ? item.id : item;
	    var removed = this._index[key];
	    delete this._index[key];
	    return removed;
	  },

	  toArray: function() {
	    var array = [];
	    this.forEach(function(item) { array.push(item) });
	    return array;
	  }
	});

	Faye.URI = {
	  isURI: function(uri) {
	    return uri && uri.protocol && uri.host && uri.path;
	  },

	  isSameOrigin: function(uri) {
	    var location = Faye.ENV.location;
	    return uri.protocol === location.protocol &&
	           uri.hostname === location.hostname &&
	           uri.port     === location.port;
	  },

	  parse: function(url) {
	    if (typeof url !== 'string') return url;
	    var uri = {}, parts, query, pairs, i, n, data;

	    var consume = function(name, pattern) {
	      url = url.replace(pattern, function(match) {
	        uri[name] = match;
	        return '';
	      });
	      uri[name] = uri[name] || '';
	    };

	    consume('protocol', /^[a-z]+\:/i);
	    consume('host',     /^\/\/[^\/\?#]+/);

	    if (!/^\//.test(url) && !uri.host)
	      url = Faye.ENV.location.pathname.replace(/[^\/]*$/, '') + url;

	    consume('pathname', /^[^\?#]*/);
	    consume('search',   /^\?[^#]*/);
	    consume('hash',     /^#.*/);

	    uri.protocol = uri.protocol || Faye.ENV.location.protocol;

	    if (uri.host) {
	      uri.host     = uri.host.substr(2);
	      parts        = uri.host.split(':');
	      uri.hostname = parts[0];
	      uri.port     = parts[1] || '';
	    } else {
	      uri.host     = Faye.ENV.location.host;
	      uri.hostname = Faye.ENV.location.hostname;
	      uri.port     = Faye.ENV.location.port;
	    }

	    uri.pathname = uri.pathname || '/';
	    uri.path = uri.pathname + uri.search;

	    query = uri.search.replace(/^\?/, '');
	    pairs = query ? query.split('&') : [];
	    data  = {};

	    for (i = 0, n = pairs.length; i < n; i++) {
	      parts = pairs[i].split('=');
	      data[decodeURIComponent(parts[0] || '')] = decodeURIComponent(parts[1] || '');
	    }

	    uri.query = data;

	    uri.href = this.stringify(uri);
	    return uri;
	  },

	  stringify: function(uri) {
	    var string = uri.protocol + '//' + uri.hostname;
	    if (uri.port) string += ':' + uri.port;
	    string += uri.pathname + this.queryString(uri.query) + (uri.hash || '');
	    return string;
	  },

	  queryString: function(query) {
	    var pairs = [];
	    for (var key in query) {
	      if (!query.hasOwnProperty(key)) continue;
	      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
	    }
	    if (pairs.length === 0) return '';
	    return '?' + pairs.join('&');
	  }
	};

	Faye.Error = Faye.Class({
	  initialize: function(code, params, message) {
	    this.code    = code;
	    this.params  = Array.prototype.slice.call(params);
	    this.message = message;
	  },

	  toString: function() {
	    return this.code + ':' +
	           this.params.join(',') + ':' +
	           this.message;
	  }
	});

	Faye.Error.parse = function(message) {
	  message = message || '';
	  if (!Faye.Grammar.ERROR.test(message)) return new this(null, [], message);

	  var parts   = message.split(':'),
	      code    = parseInt(parts[0]),
	      params  = parts[1].split(','),
	      message = parts[2];

	  return new this(code, params, message);
	};




	Faye.Error.versionMismatch = function() {
	  return new this(300, arguments, 'Version mismatch').toString();
	};

	Faye.Error.conntypeMismatch = function() {
	  return new this(301, arguments, 'Connection types not supported').toString();
	};

	Faye.Error.extMismatch = function() {
	  return new this(302, arguments, 'Extension mismatch').toString();
	};

	Faye.Error.badRequest = function() {
	  return new this(400, arguments, 'Bad request').toString();
	};

	Faye.Error.clientUnknown = function() {
	  return new this(401, arguments, 'Unknown client').toString();
	};

	Faye.Error.parameterMissing = function() {
	  return new this(402, arguments, 'Missing required parameter').toString();
	};

	Faye.Error.channelForbidden = function() {
	  return new this(403, arguments, 'Forbidden channel').toString();
	};

	Faye.Error.channelUnknown = function() {
	  return new this(404, arguments, 'Unknown channel').toString();
	};

	Faye.Error.channelInvalid = function() {
	  return new this(405, arguments, 'Invalid channel').toString();
	};

	Faye.Error.extUnknown = function() {
	  return new this(406, arguments, 'Unknown extension').toString();
	};

	Faye.Error.publishFailed = function() {
	  return new this(407, arguments, 'Failed to publish').toString();
	};

	Faye.Error.serverError = function() {
	  return new this(500, arguments, 'Internal server error').toString();
	};


	Faye.Deferrable = {
	  then: function(callback, errback) {
	    var self = this;
	    if (!this._promise)
	      this._promise = new Faye.Promise(function(fulfill, reject) {
	        self._fulfill = fulfill;
	        self._reject  = reject;
	      });

	    if (arguments.length === 0)
	      return this._promise;
	    else
	      return this._promise.then(callback, errback);
	  },

	  callback: function(callback, context) {
	    return this.then(function(value) { callback.call(context, value) });
	  },

	  errback: function(callback, context) {
	    return this.then(null, function(reason) { callback.call(context, reason) });
	  },

	  timeout: function(seconds, message) {
	    this.then();
	    var self = this;
	    this._timer = Faye.ENV.setTimeout(function() {
	      self._reject(message);
	    }, seconds * 1000);
	  },

	  setDeferredStatus: function(status, value) {
	    if (this._timer) Faye.ENV.clearTimeout(this._timer);

	    this.then();

	    if (status === 'succeeded')
	      this._fulfill(value);
	    else if (status === 'failed')
	      this._reject(value);
	    else
	      delete this._promise;
	  }
	};

	Faye.Publisher = {
	  countListeners: function(eventType) {
	    return this.listeners(eventType).length;
	  },

	  bind: function(eventType, listener, context) {
	    var slice   = Array.prototype.slice,
	        handler = function() { listener.apply(context, slice.call(arguments)) };

	    this._listeners = this._listeners || [];
	    this._listeners.push([eventType, listener, context, handler]);
	    return this.on(eventType, handler);
	  },

	  unbind: function(eventType, listener, context) {
	    this._listeners = this._listeners || [];
	    var n = this._listeners.length, tuple;

	    while (n--) {
	      tuple = this._listeners[n];
	      if (tuple[0] !== eventType) continue;
	      if (listener && (tuple[1] !== listener || tuple[2] !== context)) continue;
	      this._listeners.splice(n, 1);
	      this.removeListener(eventType, tuple[3]);
	    }
	  }
	};

	Faye.extend(Faye.Publisher, Faye.EventEmitter.prototype);
	Faye.Publisher.trigger = Faye.Publisher.emit;

	Faye.Timeouts = {
	  addTimeout: function(name, delay, callback, context) {
	    this._timeouts = this._timeouts || {};
	    if (this._timeouts.hasOwnProperty(name)) return;
	    var self = this;
	    this._timeouts[name] = Faye.ENV.setTimeout(function() {
	      delete self._timeouts[name];
	      callback.call(context);
	    }, 1000 * delay);
	  },

	  removeTimeout: function(name) {
	    this._timeouts = this._timeouts || {};
	    var timeout = this._timeouts[name];
	    if (!timeout) return;
	    Faye.ENV.clearTimeout(timeout);
	    delete this._timeouts[name];
	  },

	  removeAllTimeouts: function() {
	    this._timeouts = this._timeouts || {};
	    for (var name in this._timeouts) this.removeTimeout(name);
	  }
	};

	Faye.Logging = {
	  LOG_LEVELS: {
	    fatal:  4,
	    error:  3,
	    warn:   2,
	    info:   1,
	    debug:  0
	  },

	  writeLog: function(messageArgs, level) {
	    if (!Faye.logger) return;

	    var args   = Array.prototype.slice.apply(messageArgs),
	        banner = '[Faye',
	        klass  = this.className,

	        message = args.shift().replace(/\?/g, function() {
	          try {
	            return Faye.toJSON(args.shift());
	          } catch (e) {
	            return '[Object]';
	          }
	        });

	    for (var key in Faye) {
	      if (klass) continue;
	      if (typeof Faye[key] !== 'function') continue;
	      if (this instanceof Faye[key]) klass = key;
	    }
	    if (klass) banner += '.' + klass;
	    banner += '] ';

	    if (typeof Faye.logger[level] === 'function')
	      Faye.logger[level](banner + message);
	    else if (typeof Faye.logger === 'function')
	      Faye.logger(banner + message);
	  }
	};

	(function() {
	  for (var key in Faye.Logging.LOG_LEVELS)
	    (function(level) {
	      Faye.Logging[level] = function() {
	        this.writeLog(arguments, level);
	      };
	    })(key);
	})();

	Faye.Grammar = {
	  CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
	  CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
	  ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
	  VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
	};

	Faye.Extensible = {
	  addExtension: function(extension) {
	    this._extensions = this._extensions || [];
	    this._extensions.push(extension);
	    if (extension.added) extension.added(this);
	  },

	  removeExtension: function(extension) {
	    if (!this._extensions) return;
	    var i = this._extensions.length;
	    while (i--) {
	      if (this._extensions[i] !== extension) continue;
	      this._extensions.splice(i,1);
	      if (extension.removed) extension.removed(this);
	    }
	  },

	  pipeThroughExtensions: function(stage, message, request, callback, context) {
	    this.debug('Passing through ? extensions: ?', stage, message);

	    if (!this._extensions) return callback.call(context, message);
	    var extensions = this._extensions.slice();

	    var pipe = function(message) {
	      if (!message) return callback.call(context, message);

	      var extension = extensions.shift();
	      if (!extension) return callback.call(context, message);

	      var fn = extension[stage];
	      if (!fn) return pipe(message);

	      if (fn.length >= 3) extension[stage](message, request, pipe);
	      else                extension[stage](message, pipe);
	    };
	    pipe(message);
	  }
	};

	Faye.extend(Faye.Extensible, Faye.Logging);

	Faye.Channel = Faye.Class({
	  initialize: function(name) {
	    this.id = this.name = name;
	  },

	  push: function(message) {
	    this.trigger('message', message);
	  },

	  isUnused: function() {
	    return this.countListeners('message') === 0;
	  }
	});

	Faye.extend(Faye.Channel.prototype, Faye.Publisher);

	Faye.extend(Faye.Channel, {
	  HANDSHAKE:    '/meta/handshake',
	  CONNECT:      '/meta/connect',
	  SUBSCRIBE:    '/meta/subscribe',
	  UNSUBSCRIBE:  '/meta/unsubscribe',
	  DISCONNECT:   '/meta/disconnect',

	  META:         'meta',
	  SERVICE:      'service',

	  expand: function(name) {
	    var segments = this.parse(name),
	        channels = ['/**', name];

	    var copy = segments.slice();
	    copy[copy.length - 1] = '*';
	    channels.push(this.unparse(copy));

	    for (var i = 1, n = segments.length; i < n; i++) {
	      copy = segments.slice(0, i);
	      copy.push('**');
	      channels.push(this.unparse(copy));
	    }

	    return channels;
	  },

	  isValid: function(name) {
	    return Faye.Grammar.CHANNEL_NAME.test(name) ||
	           Faye.Grammar.CHANNEL_PATTERN.test(name);
	  },

	  parse: function(name) {
	    if (!this.isValid(name)) return null;
	    return name.split('/').slice(1);
	  },

	  unparse: function(segments) {
	    return '/' + segments.join('/');
	  },

	  isMeta: function(name) {
	    var segments = this.parse(name);
	    return segments ? (segments[0] === this.META) : null;
	  },

	  isService: function(name) {
	    var segments = this.parse(name);
	    return segments ? (segments[0] === this.SERVICE) : null;
	  },

	  isSubscribable: function(name) {
	    if (!this.isValid(name)) return null;
	    return !this.isMeta(name) && !this.isService(name);
	  },

	  Set: Faye.Class({
	    initialize: function() {
	      this._channels = {};
	    },

	    getKeys: function() {
	      var keys = [];
	      for (var key in this._channels) keys.push(key);
	      return keys;
	    },

	    remove: function(name) {
	      delete this._channels[name];
	    },

	    hasSubscription: function(name) {
	      return this._channels.hasOwnProperty(name);
	    },

	    subscribe: function(names, callback, context) {
	      var name;
	      for (var i = 0, n = names.length; i < n; i++) {
	        name = names[i];
	        var channel = this._channels[name] = this._channels[name] || new Faye.Channel(name);
	        if (callback) channel.bind('message', callback, context);
	      }
	    },

	    unsubscribe: function(name, callback, context) {
	      var channel = this._channels[name];
	      if (!channel) return false;
	      channel.unbind('message', callback, context);

	      if (channel.isUnused()) {
	        this.remove(name);
	        return true;
	      } else {
	        return false;
	      }
	    },

	    distributeMessage: function(message) {
	      var channels = Faye.Channel.expand(message.channel);

	      for (var i = 0, n = channels.length; i < n; i++) {
	        var channel = this._channels[channels[i]];
	        if (channel) channel.trigger('message', message.data);
	      }
	    }
	  })
	});

	Faye.Publication = Faye.Class(Faye.Deferrable);

	Faye.Subscription = Faye.Class({
	  initialize: function(client, channels, callback, context) {
	    this._client    = client;
	    this._channels  = channels;
	    this._callback  = callback;
	    this._context     = context;
	    this._cancelled = false;
	  },

	  cancel: function() {
	    if (this._cancelled) return;
	    this._client.unsubscribe(this._channels, this._callback, this._context);
	    this._cancelled = true;
	  },

	  unsubscribe: function() {
	    this.cancel();
	  }
	});

	Faye.extend(Faye.Subscription.prototype, Faye.Deferrable);

	Faye.Client = Faye.Class({
	  UNCONNECTED:        1,
	  CONNECTING:         2,
	  CONNECTED:          3,
	  DISCONNECTED:       4,

	  HANDSHAKE:          'handshake',
	  RETRY:              'retry',
	  NONE:               'none',

	  CONNECTION_TIMEOUT: 60,

	  DEFAULT_ENDPOINT:   '/bayeux',
	  INTERVAL:           0,

	  initialize: function(endpoint, options) {
	    this.info('New client created for ?', endpoint);
	    options = options || {};

	    Faye.validateOptions(options, ['interval', 'timeout', 'endpoints', 'proxy', 'retry', 'scheduler', 'websocketExtensions', 'tls', 'ca']);

	    this._endpoint   = endpoint || this.DEFAULT_ENDPOINT;
	    this._channels   = new Faye.Channel.Set();
	    this._dispatcher = new Faye.Dispatcher(this, this._endpoint, options);

	    this._messageId = 0;
	    this._state     = this.UNCONNECTED;

	    this._responseCallbacks = {};

	    this._advice = {
	      reconnect: this.RETRY,
	      interval:  1000 * (options.interval || this.INTERVAL),
	      timeout:   1000 * (options.timeout  || this.CONNECTION_TIMEOUT)
	    };
	    this._dispatcher.timeout = this._advice.timeout / 1000;

	    this._dispatcher.bind('message', this._receiveMessage, this);

	    if (Faye.Event && Faye.ENV.onbeforeunload !== undefined)
	      Faye.Event.on(Faye.ENV, 'beforeunload', function() {
	        if (Faye.indexOf(this._dispatcher._disabled, 'autodisconnect') < 0)
	          this.disconnect();
	      }, this);
	  },

	  addWebsocketExtension: function(extension) {
	    return this._dispatcher.addWebsocketExtension(extension);
	  },

	  disable: function(feature) {
	    return this._dispatcher.disable(feature);
	  },

	  setHeader: function(name, value) {
	    return this._dispatcher.setHeader(name, value);
	  },

	  // Request
	  // MUST include:  * channel
	  //                * version
	  //                * supportedConnectionTypes
	  // MAY include:   * minimumVersion
	  //                * ext
	  //                * id
	  //
	  // Success Response                             Failed Response
	  // MUST include:  * channel                     MUST include:  * channel
	  //                * version                                    * successful
	  //                * supportedConnectionTypes                   * error
	  //                * clientId                    MAY include:   * supportedConnectionTypes
	  //                * successful                                 * advice
	  // MAY include:   * minimumVersion                             * version
	  //                * advice                                     * minimumVersion
	  //                * ext                                        * ext
	  //                * id                                         * id
	  //                * authSuccessful
	  handshake: function(callback, context) {
	    if (this._advice.reconnect === this.NONE) return;
	    if (this._state !== this.UNCONNECTED) return;

	    this._state = this.CONNECTING;
	    var self = this;

	    this.info('Initiating handshake with ?', Faye.URI.stringify(this._endpoint));
	    this._dispatcher.selectTransport(Faye.MANDATORY_CONNECTION_TYPES);

	    this._sendMessage({
	      channel:                  Faye.Channel.HANDSHAKE,
	      version:                  Faye.BAYEUX_VERSION,
	      supportedConnectionTypes: this._dispatcher.getConnectionTypes()

	    }, {}, function(response) {

	      if (response.successful) {
	        this._state = this.CONNECTED;
	        this._dispatcher.clientId  = response.clientId;

	        this._dispatcher.selectTransport(response.supportedConnectionTypes);

	        this.info('Handshake successful: ?', this._dispatcher.clientId);

	        this.subscribe(this._channels.getKeys(), true);
	        if (callback) Faye.Promise.defer(function() { callback.call(context) });

	      } else {
	        this.info('Handshake unsuccessful');
	        Faye.ENV.setTimeout(function() { self.handshake(callback, context) }, this._dispatcher.retry * 1000);
	        this._state = this.UNCONNECTED;
	      }
	    }, this);
	  },

	  // Request                              Response
	  // MUST include:  * channel             MUST include:  * channel
	  //                * clientId                           * successful
	  //                * connectionType                     * clientId
	  // MAY include:   * ext                 MAY include:   * error
	  //                * id                                 * advice
	  //                                                     * ext
	  //                                                     * id
	  //                                                     * timestamp
	  connect: function(callback, context) {
	    if (this._advice.reconnect === this.NONE) return;
	    if (this._state === this.DISCONNECTED) return;

	    if (this._state === this.UNCONNECTED)
	      return this.handshake(function() { this.connect(callback, context) }, this);

	    this.callback(callback, context);
	    if (this._state !== this.CONNECTED) return;

	    this.info('Calling deferred actions for ?', this._dispatcher.clientId);
	    this.setDeferredStatus('succeeded');
	    this.setDeferredStatus('unknown');

	    if (this._connectRequest) return;
	    this._connectRequest = true;

	    this.info('Initiating connection for ?', this._dispatcher.clientId);

	    this._sendMessage({
	      channel:        Faye.Channel.CONNECT,
	      clientId:       this._dispatcher.clientId,
	      connectionType: this._dispatcher.connectionType

	    }, {}, this._cycleConnection, this);
	  },

	  // Request                              Response
	  // MUST include:  * channel             MUST include:  * channel
	  //                * clientId                           * successful
	  // MAY include:   * ext                                * clientId
	  //                * id                  MAY include:   * error
	  //                                                     * ext
	  //                                                     * id
	  disconnect: function() {
	    if (this._state !== this.CONNECTED) return;
	    this._state = this.DISCONNECTED;

	    this.info('Disconnecting ?', this._dispatcher.clientId);
	    var promise = new Faye.Publication();

	    this._sendMessage({
	      channel:  Faye.Channel.DISCONNECT,
	      clientId: this._dispatcher.clientId

	    }, {}, function(response) {
	      if (response.successful) {
	        this._dispatcher.close();
	        promise.setDeferredStatus('succeeded');
	      } else {
	        promise.setDeferredStatus('failed', Faye.Error.parse(response.error));
	      }
	    }, this);

	    this.info('Clearing channel listeners for ?', this._dispatcher.clientId);
	    this._channels = new Faye.Channel.Set();

	    return promise;
	  },

	  // Request                              Response
	  // MUST include:  * channel             MUST include:  * channel
	  //                * clientId                           * successful
	  //                * subscription                       * clientId
	  // MAY include:   * ext                                * subscription
	  //                * id                  MAY include:   * error
	  //                                                     * advice
	  //                                                     * ext
	  //                                                     * id
	  //                                                     * timestamp
	  subscribe: function(channel, callback, context) {
	    if (channel instanceof Array)
	      return Faye.map(channel, function(c) {
	        return this.subscribe(c, callback, context);
	      }, this);

	    var subscription = new Faye.Subscription(this, channel, callback, context),
	        force        = (callback === true),
	        hasSubscribe = this._channels.hasSubscription(channel);

	    if (hasSubscribe && !force) {
	      this._channels.subscribe([channel], callback, context);
	      subscription.setDeferredStatus('succeeded');
	      return subscription;
	    }

	    this.connect(function() {
	      this.info('Client ? attempting to subscribe to ?', this._dispatcher.clientId, channel);
	      if (!force) this._channels.subscribe([channel], callback, context);

	      this._sendMessage({
	        channel:      Faye.Channel.SUBSCRIBE,
	        clientId:     this._dispatcher.clientId,
	        subscription: channel

	      }, {}, function(response) {
	        if (!response.successful) {
	          subscription.setDeferredStatus('failed', Faye.Error.parse(response.error));
	          return this._channels.unsubscribe(channel, callback, context);
	        }

	        var channels = [].concat(response.subscription);
	        this.info('Subscription acknowledged for ? to ?', this._dispatcher.clientId, channels);
	        subscription.setDeferredStatus('succeeded');
	      }, this);
	    }, this);

	    return subscription;
	  },

	  // Request                              Response
	  // MUST include:  * channel             MUST include:  * channel
	  //                * clientId                           * successful
	  //                * subscription                       * clientId
	  // MAY include:   * ext                                * subscription
	  //                * id                  MAY include:   * error
	  //                                                     * advice
	  //                                                     * ext
	  //                                                     * id
	  //                                                     * timestamp
	  unsubscribe: function(channel, callback, context) {
	    if (channel instanceof Array)
	      return Faye.map(channel, function(c) {
	        return this.unsubscribe(c, callback, context);
	      }, this);

	    var dead = this._channels.unsubscribe(channel, callback, context);
	    if (!dead) return;

	    this.connect(function() {
	      this.info('Client ? attempting to unsubscribe from ?', this._dispatcher.clientId, channel);

	      this._sendMessage({
	        channel:      Faye.Channel.UNSUBSCRIBE,
	        clientId:     this._dispatcher.clientId,
	        subscription: channel

	      }, {}, function(response) {
	        if (!response.successful) return;

	        var channels = [].concat(response.subscription);
	        this.info('Unsubscription acknowledged for ? from ?', this._dispatcher.clientId, channels);
	      }, this);
	    }, this);
	  },

	  // Request                              Response
	  // MUST include:  * channel             MUST include:  * channel
	  //                * data                               * successful
	  // MAY include:   * clientId            MAY include:   * id
	  //                * id                                 * error
	  //                * ext                                * ext
	  publish: function(channel, data, options) {
	    Faye.validateOptions(options || {}, ['attempts', 'deadline']);
	    var publication = new Faye.Publication();

	    this.connect(function() {
	      this.info('Client ? queueing published message to ?: ?', this._dispatcher.clientId, channel, data);

	      this._sendMessage({
	        channel:  channel,
	        data:     data,
	        clientId: this._dispatcher.clientId

	      }, options, function(response) {
	        if (response.successful)
	          publication.setDeferredStatus('succeeded');
	        else
	          publication.setDeferredStatus('failed', Faye.Error.parse(response.error));
	      }, this);
	    }, this);

	    return publication;
	  },

	  _sendMessage: function(message, options, callback, context) {
	    message.id = this._generateMessageId();

	    var timeout = this._advice.timeout
	                ? 1.2 * this._advice.timeout / 1000
	                : 1.2 * this._dispatcher.retry;

	    this.pipeThroughExtensions('outgoing', message, null, function(message) {
	      if (!message) return;
	      if (callback) this._responseCallbacks[message.id] = [callback, context];
	      this._dispatcher.sendMessage(message, timeout, options || {});
	    }, this);
	  },

	  _generateMessageId: function() {
	    this._messageId += 1;
	    if (this._messageId >= Math.pow(2,32)) this._messageId = 0;
	    return this._messageId.toString(36);
	  },

	  _receiveMessage: function(message) {
	    var id = message.id, callback;

	    if (message.successful !== undefined) {
	      callback = this._responseCallbacks[id];
	      delete this._responseCallbacks[id];
	    }

	    this.pipeThroughExtensions('incoming', message, null, function(message) {
	      if (!message) return;
	      if (message.advice) this._handleAdvice(message.advice);
	      this._deliverMessage(message);
	      if (callback) callback[0].call(callback[1], message);
	    }, this);
	  },

	  _handleAdvice: function(advice) {
	    Faye.extend(this._advice, advice);
	    this._dispatcher.timeout = this._advice.timeout / 1000;

	    if (this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED) {
	      this._state = this.UNCONNECTED;
	      this._dispatcher.clientId = null;
	      this._cycleConnection();
	    }
	  },

	  _deliverMessage: function(message) {
	    if (!message.channel || message.data === undefined) return;
	    this.info('Client ? calling listeners for ? with ?', this._dispatcher.clientId, message.channel, message.data);
	    this._channels.distributeMessage(message);
	  },

	  _cycleConnection: function() {
	    if (this._connectRequest) {
	      this._connectRequest = null;
	      this.info('Closed connection for ?', this._dispatcher.clientId);
	    }
	    var self = this;
	    Faye.ENV.setTimeout(function() { self.connect() }, this._advice.interval);
	  }
	});

	Faye.extend(Faye.Client.prototype, Faye.Deferrable);
	Faye.extend(Faye.Client.prototype, Faye.Publisher);
	Faye.extend(Faye.Client.prototype, Faye.Logging);
	Faye.extend(Faye.Client.prototype, Faye.Extensible);

	Faye.Dispatcher = Faye.Class({
	  MAX_REQUEST_SIZE: 2048,
	  DEFAULT_RETRY:    5,

	  UP:   1,
	  DOWN: 2,

	  initialize: function(client, endpoint, options) {
	    this._client     = client;
	    this.endpoint    = Faye.URI.parse(endpoint);
	    this._alternates = options.endpoints || {};

	    this.cookies      = Faye.Cookies && new Faye.Cookies.CookieJar();
	    this._disabled    = [];
	    this._envelopes   = {};
	    this.headers      = {};
	    this.retry        = options.retry || this.DEFAULT_RETRY;
	    this._scheduler   = options.scheduler || Faye.Scheduler;
	    this._state       = 0;
	    this.transports   = {};
	    this.wsExtensions = [];

	    this.proxy = options.proxy || {};
	    if (typeof this._proxy === 'string') this._proxy = {origin: this._proxy};

	    var exts = options.websocketExtensions;
	    if (exts) {
	      exts = [].concat(exts);
	      for (var i = 0, n = exts.length; i < n; i++)
	        this.addWebsocketExtension(exts[i]);
	    }

	    this.tls = options.tls || {};
	    this.tls.ca = this.tls.ca || options.ca;

	    for (var type in this._alternates)
	      this._alternates[type] = Faye.URI.parse(this._alternates[type]);

	    this.maxRequestSize = this.MAX_REQUEST_SIZE;
	  },

	  endpointFor: function(connectionType) {
	    return this._alternates[connectionType] || this.endpoint;
	  },

	  addWebsocketExtension: function(extension) {
	    this.wsExtensions.push(extension);
	  },

	  disable: function(feature) {
	    this._disabled.push(feature);
	  },

	  setHeader: function(name, value) {
	    this.headers[name] = value;
	  },

	  close: function() {
	    var transport = this._transport;
	    delete this._transport;
	    if (transport) transport.close();
	  },

	  getConnectionTypes: function() {
	    return Faye.Transport.getConnectionTypes();
	  },

	  selectTransport: function(transportTypes) {
	    Faye.Transport.get(this, transportTypes, this._disabled, function(transport) {
	      this.debug('Selected ? transport for ?', transport.connectionType, Faye.URI.stringify(transport.endpoint));

	      if (transport === this._transport) return;
	      if (this._transport) this._transport.close();

	      this._transport = transport;
	      this.connectionType = transport.connectionType;
	    }, this);
	  },

	  sendMessage: function(message, timeout, options) {
	    options = options || {};

	    var id       = message.id,
	        attempts = options.attempts,
	        deadline = options.deadline && new Date().getTime() + (options.deadline * 1000),
	        envelope = this._envelopes[id],
	        scheduler;

	    if (!envelope) {
	      scheduler = new this._scheduler(message, {timeout: timeout, interval: this.retry, attempts: attempts, deadline: deadline});
	      envelope  = this._envelopes[id] = {message: message, scheduler: scheduler};
	    }

	    this._sendEnvelope(envelope);
	  },

	  _sendEnvelope: function(envelope) {
	    if (!this._transport) return;
	    if (envelope.request || envelope.timer) return;

	    var message   = envelope.message,
	        scheduler = envelope.scheduler,
	        self      = this;

	    if (!scheduler.isDeliverable()) {
	      scheduler.abort();
	      delete this._envelopes[message.id];
	      return;
	    }

	    envelope.timer = Faye.ENV.setTimeout(function() {
	      self.handleError(message);
	    }, scheduler.getTimeout() * 1000);

	    scheduler.send();
	    envelope.request = this._transport.sendMessage(message);
	  },

	  handleResponse: function(reply) {
	    var envelope = this._envelopes[reply.id];

	    if (reply.successful !== undefined && envelope) {
	      envelope.scheduler.succeed();
	      delete this._envelopes[reply.id];
	      Faye.ENV.clearTimeout(envelope.timer);
	    }

	    this.trigger('message', reply);

	    if (this._state === this.UP) return;
	    this._state = this.UP;
	    this._client.trigger('transport:up');
	  },

	  handleError: function(message, immediate) {
	    var envelope = this._envelopes[message.id],
	        request  = envelope && envelope.request,
	        self     = this;

	    if (!request) return;

	    request.then(function(req) {
	      if (req && req.abort) req.abort();
	    });

	    var scheduler = envelope.scheduler;
	    scheduler.fail();

	    Faye.ENV.clearTimeout(envelope.timer);
	    envelope.request = envelope.timer = null;

	    if (immediate) {
	      this._sendEnvelope(envelope);
	    } else {
	      envelope.timer = Faye.ENV.setTimeout(function() {
	        envelope.timer = null;
	        self._sendEnvelope(envelope);
	      }, scheduler.getInterval() * 1000);
	    }

	    if (this._state === this.DOWN) return;
	    this._state = this.DOWN;
	    this._client.trigger('transport:down');
	  }
	});

	Faye.extend(Faye.Dispatcher.prototype, Faye.Publisher);
	Faye.extend(Faye.Dispatcher.prototype, Faye.Logging);

	Faye.Scheduler = function(message, options) {
	  this.message  = message;
	  this.options  = options;
	  this.attempts = 0;
	};

	Faye.extend(Faye.Scheduler.prototype, {
	  getTimeout: function() {
	    return this.options.timeout;
	  },

	  getInterval: function() {
	    return this.options.interval;
	  },

	  isDeliverable: function() {
	    var attempts = this.options.attempts,
	        made     = this.attempts,
	        deadline = this.options.deadline,
	        now      = new Date().getTime();

	    if (attempts !== undefined && made >= attempts)
	      return false;

	    if (deadline !== undefined && now > deadline)
	      return false;

	    return true;
	  },

	  send: function() {
	    this.attempts += 1;
	  },

	  succeed: function() {},

	  fail: function() {},

	  abort: function() {}
	});

	Faye.Transport = Faye.extend(Faye.Class({
	  DEFAULT_PORTS:    {'http:': 80, 'https:': 443, 'ws:': 80, 'wss:': 443},
	  SECURE_PROTOCOLS: ['https:', 'wss:'],
	  MAX_DELAY:        0,

	  batching:  true,

	  initialize: function(dispatcher, endpoint) {
	    this._dispatcher = dispatcher;
	    this.endpoint    = endpoint;
	    this._outbox     = [];
	    this._proxy      = Faye.extend({}, this._dispatcher.proxy);

	    if (!this._proxy.origin && Faye.NodeAdapter) {
	      this._proxy.origin = Faye.indexOf(this.SECURE_PROTOCOLS, this.endpoint.protocol) >= 0
	                         ? (process.env.HTTPS_PROXY || process.env.https_proxy)
	                         : (process.env.HTTP_PROXY  || process.env.http_proxy);
	    }
	  },

	  close: function() {},

	  encode: function(messages) {
	    return '';
	  },

	  sendMessage: function(message) {
	    this.debug('Client ? sending message to ?: ?',
	               this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), message);

	    if (!this.batching) return Faye.Promise.fulfilled(this.request([message]));

	    this._outbox.push(message);
	    this._promise = this._promise || new Faye.Promise();
	    this._flushLargeBatch();

	    if (message.channel === Faye.Channel.HANDSHAKE) {
	      this.addTimeout('publish', 0.01, this._flush, this);
	      return this._promise;
	    }

	    if (message.channel === Faye.Channel.CONNECT)
	      this._connectMessage = message;

	    this.addTimeout('publish', this.MAX_DELAY, this._flush, this);
	    return this._promise;
	  },

	  _flush: function() {
	    this.removeTimeout('publish');

	    if (this._outbox.length > 1 && this._connectMessage)
	      this._connectMessage.advice = {timeout: 0};

	    Faye.Promise.fulfill(this._promise, this.request(this._outbox));
	    delete this._promise;

	    this._connectMessage = null;
	    this._outbox = [];
	  },

	  _flushLargeBatch: function() {
	    var string = this.encode(this._outbox);
	    if (string.length < this._dispatcher.maxRequestSize) return;
	    var last = this._outbox.pop();
	    this._flush();
	    if (last) this._outbox.push(last);
	  },

	  _receive: function(replies) {
	    if (!replies) return;
	    replies = [].concat(replies);

	    this.debug('Client ? received from ? via ?: ?',
	               this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), this.connectionType, replies);

	    for (var i = 0, n = replies.length; i < n; i++)
	      this._dispatcher.handleResponse(replies[i]);
	  },

	  _handleError: function(messages, immediate) {
	    messages = [].concat(messages);

	    this.debug('Client ? failed to send to ? via ?: ?',
	               this._dispatcher.clientId, Faye.URI.stringify(this.endpoint), this.connectionType, messages);

	    for (var i = 0, n = messages.length; i < n; i++)
	      this._dispatcher.handleError(messages[i]);
	  },

	  _getCookies: function() {
	    var cookies = this._dispatcher.cookies,
	        url     = Faye.URI.stringify(this.endpoint);

	    if (!cookies) return '';

	    return Faye.map(cookies.getCookiesSync(url), function(cookie) {
	      return cookie.cookieString();
	    }).join('; ');
	  },

	  _storeCookies: function(setCookie) {
	    var cookies = this._dispatcher.cookies,
	        url     = Faye.URI.stringify(this.endpoint),
	        cookie;

	    if (!setCookie || !cookies) return;
	    setCookie = [].concat(setCookie);

	    for (var i = 0, n = setCookie.length; i < n; i++) {
	      cookie = Faye.Cookies.Cookie.parse(setCookie[i]);
	      cookies.setCookieSync(cookie, url);
	    }
	  }

	}), {
	  get: function(dispatcher, allowed, disabled, callback, context) {
	    var endpoint = dispatcher.endpoint;

	    Faye.asyncEach(this._transports, function(pair, resume) {
	      var connType     = pair[0], klass = pair[1],
	          connEndpoint = dispatcher.endpointFor(connType);

	      if (Faye.indexOf(disabled, connType) >= 0)
	        return resume();

	      if (Faye.indexOf(allowed, connType) < 0) {
	        klass.isUsable(dispatcher, connEndpoint, function() {});
	        return resume();
	      }

	      klass.isUsable(dispatcher, connEndpoint, function(isUsable) {
	        if (!isUsable) return resume();
	        var transport = klass.hasOwnProperty('create') ? klass.create(dispatcher, connEndpoint) : new klass(dispatcher, connEndpoint);
	        callback.call(context, transport);
	      });
	    }, function() {
	      throw new Error('Could not find a usable connection type for ' + Faye.URI.stringify(endpoint));
	    });
	  },

	  register: function(type, klass) {
	    this._transports.push([type, klass]);
	    klass.prototype.connectionType = type;
	  },

	  getConnectionTypes: function() {
	    return Faye.map(this._transports, function(t) { return t[0] });
	  },

	  _transports: []
	});

	Faye.extend(Faye.Transport.prototype, Faye.Logging);
	Faye.extend(Faye.Transport.prototype, Faye.Timeouts);

	Faye.Event = {
	  _registry: [],

	  on: function(element, eventName, callback, context) {
	    var wrapped = function() { callback.call(context) };

	    if (element.addEventListener)
	      element.addEventListener(eventName, wrapped, false);
	    else
	      element.attachEvent('on' + eventName, wrapped);

	    this._registry.push({
	      _element:   element,
	      _type:      eventName,
	      _callback:  callback,
	      _context:     context,
	      _handler:   wrapped
	    });
	  },

	  detach: function(element, eventName, callback, context) {
	    var i = this._registry.length, register;
	    while (i--) {
	      register = this._registry[i];

	      if ((element    && element    !== register._element)   ||
	          (eventName  && eventName  !== register._type)      ||
	          (callback   && callback   !== register._callback)  ||
	          (context      && context      !== register._context))
	        continue;

	      if (register._element.removeEventListener)
	        register._element.removeEventListener(register._type, register._handler, false);
	      else
	        register._element.detachEvent('on' + register._type, register._handler);

	      this._registry.splice(i,1);
	      register = null;
	    }
	  }
	};

	if (Faye.ENV.onunload !== undefined) Faye.Event.on(Faye.ENV, 'unload', Faye.Event.detach, Faye.Event);

	/*
	    json2.js
	    2013-05-26

	    Public Domain.

	    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	    See http://www.JSON.org/js.html


	    This code should be minified before deployment.
	    See http://javascript.crockford.com/jsmin.html

	    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	    NOT CONTROL.


	    This file creates a global JSON object containing two methods: stringify
	    and parse.

	        JSON.stringify(value, replacer, space)
	            value       any JavaScript value, usually an object or array.

	            replacer    an optional parameter that determines how object
	                        values are stringified for objects. It can be a
	                        function or an array of strings.

	            space       an optional parameter that specifies the indentation
	                        of nested structures. If it is omitted, the text will
	                        be packed without extra whitespace. If it is a number,
	                        it will specify the number of spaces to indent at each
	                        level. If it is a string (such as '\t' or '&nbsp;'),
	                        it contains the characters used to indent at each level.

	            This method produces a JSON text from a JavaScript value.

	            When an object value is found, if the object contains a toJSON
	            method, its toJSON method will be called and the result will be
	            stringified. A toJSON method does not serialize: it returns the
	            value represented by the name/value pair that should be serialized,
	            or undefined if nothing should be serialized. The toJSON method
	            will be passed the key associated with the value, and this will be
	            bound to the value

	            For example, this would serialize Dates as ISO strings.

	                Date.prototype.toJSON = function (key) {
	                    function f(n) {
	                        // Format integers to have at least two digits.
	                        return n < 10 ? '0' + n : n;
	                    }

	                    return this.getUTCFullYear()   + '-' +
	                         f(this.getUTCMonth() + 1) + '-' +
	                         f(this.getUTCDate())      + 'T' +
	                         f(this.getUTCHours())     + ':' +
	                         f(this.getUTCMinutes())   + ':' +
	                         f(this.getUTCSeconds())   + 'Z';
	                };

	            You can provide an optional replacer method. It will be passed the
	            key and value of each member, with this bound to the containing
	            object. The value that is returned from your method will be
	            serialized. If your method returns undefined, then the member will
	            be excluded from the serialization.

	            If the replacer parameter is an array of strings, then it will be
	            used to select the members to be serialized. It filters the results
	            such that only members with keys listed in the replacer array are
	            stringified.

	            Values that do not have JSON representations, such as undefined or
	            functions, will not be serialized. Such values in objects will be
	            dropped; in arrays they will be replaced with null. You can use
	            a replacer function to replace those with JSON values.
	            JSON.stringify(undefined) returns undefined.

	            The optional space parameter produces a stringification of the
	            value that is filled with line breaks and indentation to make it
	            easier to read.

	            If the space parameter is a non-empty string, then that string will
	            be used for indentation. If the space parameter is a number, then
	            the indentation will be that many spaces.

	            Example:

	            text = JSON.stringify(['e', {pluribus: 'unum'}]);
	            // text is '["e",{"pluribus":"unum"}]'


	            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
	            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

	            text = JSON.stringify([new Date()], function (key, value) {
	                return this[key] instanceof Date ?
	                    'Date(' + this[key] + ')' : value;
	            });
	            // text is '["Date(---current time---)"]'


	        JSON.parse(text, reviver)
	            This method parses a JSON text to produce an object or array.
	            It can throw a SyntaxError exception.

	            The optional reviver parameter is a function that can filter and
	            transform the results. It receives each of the keys and values,
	            and its return value is used instead of the original value.
	            If it returns what it received, then the structure is not modified.
	            If it returns undefined then the member is deleted.

	            Example:

	            // Parse the text. Values that look like ISO date strings will
	            // be converted to Date objects.

	            myData = JSON.parse(text, function (key, value) {
	                var a;
	                if (typeof value === 'string') {
	                    a =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
	                    if (a) {
	                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
	                            +a[5], +a[6]));
	                    }
	                }
	                return value;
	            });

	            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
	                var d;
	                if (typeof value === 'string' &&
	                        value.slice(0, 5) === 'Date(' &&
	                        value.slice(-1) === ')') {
	                    d = new Date(value.slice(5, -1));
	                    if (d) {
	                        return d;
	                    }
	                }
	                return value;
	            });


	    This is a reference implementation. You are free to copy, modify, or
	    redistribute.
	*/

	/*jslint evil: true, regexp: true */

	/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	    lastIndex, length, parse, prototype, push, replace, slice, stringify,
	    test, toJSON, toString, valueOf
	*/


	// Create a JSON object only if one does not already exist. We create the
	// methods in a closure to avoid creating global variables.

	if (typeof JSON !== 'object') {
	    JSON = {};
	}

	(function () {
	    'use strict';

	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }

	    if (typeof Date.prototype.toJSON !== 'function') {

	        Date.prototype.toJSON = function () {

	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null;
	        };

	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function () {
	                return this.valueOf();
	            };
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;


	    function quote(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {

	// Produce a string from holder[key].

	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.

	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }

	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	// What happens next depends on the value's type.

	        switch (typeof value) {
	        case 'string':
	            return quote(value);

	        case 'number':

	// JSON numbers must be finite. Encode non-finite numbers as null.

	            return isFinite(value) ? String(value) : 'null';

	        case 'boolean':
	        case 'null':

	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce 'null'. The case is included here in
	// the remote chance that this gets fixed someday.

	            return String(value);

	// If the type is 'object', we might be dealing with an object or an array or
	// null.

	        case 'object':

	// Due to a specification blunder in ECMAScript, typeof null is 'object',
	// so watch out for that case.

	            if (!value) {
	                return 'null';
	            }

	// Make an array to hold the partial results of stringifying this object value.

	            gap += indent;
	            partial = [];

	// Is the value an array?

	            if (Object.prototype.toString.apply(value) === '[object Array]') {

	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }

	// Join all of the elements together, separated with commas, and wrap them in
	// brackets.

	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	// If the replacer is an array, use it to select the members to be stringified.

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {

	// Otherwise, iterate through all of the keys in the object.

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.

	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	// If the JSON object does not yet have a stringify method, give it one.

	    Faye.stringify = function (value, replacer, space) {

	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	        var i;
	        gap = '';
	        indent = '';

	// If the space parameter is a number, make an indent string containing that
	// many spaces.

	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }

	// If the space parameter is a string, it will be used as the indent string.

	        } else if (typeof space === 'string') {
	            indent = space;
	        }

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                typeof replacer.length !== 'number')) {
	            throw new Error('JSON.stringify');
	        }

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.

	        return str('', {'': value});
	    };

	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = Faye.stringify;
	    }

	// If the JSON object does not yet have a parse method, give it one.

	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {

	// The parse method takes a text and an optional reviver function, and returns
	// a JavaScript value if the text is a valid JSON text.

	            var j;

	            function walk(holder, key) {

	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.

	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }


	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many characters
	// incorrectly, either silently deleting them, or treating them as line endings.

	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }

	// In the second stage, we run the text against regular expressions that look
	// for non-JSON patterns. We are especially concerned with '()' and 'new'
	// because they can cause invocation, and '=' because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.

	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.

	                j = eval('(' + text + ')');

	// In the optional fourth stage, we recursively walk the new structure, passing
	// each name/value pair to a reviver function for possible transformation.

	                return typeof reviver === 'function'
	                    ? walk({'': j}, '')
	                    : j;
	            }

	// If the text is not JSON parseable, then a SyntaxError is thrown.

	            throw new SyntaxError('JSON.parse');
	        };
	    }
	}());

	Faye.Transport.WebSocket = Faye.extend(Faye.Class(Faye.Transport, {
	  UNCONNECTED:  1,
	  CONNECTING:   2,
	  CONNECTED:    3,

	  batching:     false,

	  isUsable: function(callback, context) {
	    this.callback(function() { callback.call(context, true) });
	    this.errback(function() { callback.call(context, false) });
	    this.connect();
	  },

	  request: function(messages) {
	    this._pending = this._pending || new Faye.Set();
	    for (var i = 0, n = messages.length; i < n; i++) this._pending.add(messages[i]);

	    var promise = new Faye.Promise();

	    this.callback(function(socket) {
	      if (!socket || socket.readyState !== 1) return;
	      socket.send(Faye.toJSON(messages));
	      Faye.Promise.fulfill(promise, socket);
	    }, this);

	    this.connect();

	    return {
	      abort: function() { promise.then(function(ws) { ws.close() }) }
	    };
	  },

	  connect: function() {
	    if (Faye.Transport.WebSocket._unloaded) return;

	    this._state = this._state || this.UNCONNECTED;
	    if (this._state !== this.UNCONNECTED) return;
	    this._state = this.CONNECTING;

	    var socket = this._createSocket();
	    if (!socket) return this.setDeferredStatus('failed');

	    var self = this;

	    socket.onopen = function() {
	      if (socket.headers) self._storeCookies(socket.headers['set-cookie']);
	      self._socket = socket;
	      self._state = self.CONNECTED;
	      self._everConnected = true;
	      self._ping();
	      self.setDeferredStatus('succeeded', socket);
	    };

	    var closed = false;
	    socket.onclose = socket.onerror = function() {
	      if (closed) return;
	      closed = true;

	      var wasConnected = (self._state === self.CONNECTED);
	      socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;

	      delete self._socket;
	      self._state = self.UNCONNECTED;
	      self.removeTimeout('ping');
	      self.setDeferredStatus('unknown');

	      var pending = self._pending ? self._pending.toArray() : [];
	      delete self._pending;

	      if (wasConnected) {
	        self._handleError(pending, true);
	      } else if (self._everConnected) {
	        self._handleError(pending);
	      } else {
	        self.setDeferredStatus('failed');
	      }
	    };

	    socket.onmessage = function(event) {
	      var replies = JSON.parse(event.data);
	      if (!replies) return;

	      replies = [].concat(replies);

	      for (var i = 0, n = replies.length; i < n; i++) {
	        if (replies[i].successful === undefined) continue;
	        self._pending.remove(replies[i]);
	      }
	      self._receive(replies);
	    };
	  },

	  close: function() {
	    if (!this._socket) return;
	    this._socket.close();
	  },

	  _createSocket: function() {
	    var url        = Faye.Transport.WebSocket.getSocketUrl(this.endpoint),
	        headers    = this._dispatcher.headers,
	        extensions = this._dispatcher.wsExtensions,
	        cookie     = this._getCookies(),
	        tls        = this._dispatcher.tls,
	        options    = {extensions: extensions, headers: headers, proxy: this._proxy, tls: tls};

	    if (cookie !== '') options.headers['Cookie'] = cookie;

	    if (Faye.WebSocket)        return new Faye.WebSocket.Client(url, [], options);
	    if (Faye.ENV.MozWebSocket) return new MozWebSocket(url);
	    if (Faye.ENV.WebSocket)    return new WebSocket(url);
	  },

	  _ping: function() {
	    if (!this._socket) return;
	    this._socket.send('[]');
	    this.addTimeout('ping', this._dispatcher.timeout / 2, this._ping, this);
	  }

	}), {
	  PROTOCOLS: {
	    'http:':  'ws:',
	    'https:': 'wss:'
	  },

	  create: function(dispatcher, endpoint) {
	    var sockets = dispatcher.transports.websocket = dispatcher.transports.websocket || {};
	    sockets[endpoint.href] = sockets[endpoint.href] || new this(dispatcher, endpoint);
	    return sockets[endpoint.href];
	  },

	  getSocketUrl: function(endpoint) {
	    endpoint = Faye.copyObject(endpoint);
	    endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
	    return Faye.URI.stringify(endpoint);
	  },

	  isUsable: function(dispatcher, endpoint, callback, context) {
	    this.create(dispatcher, endpoint).isUsable(callback, context);
	  }
	});

	Faye.extend(Faye.Transport.WebSocket.prototype, Faye.Deferrable);
	Faye.Transport.register('websocket', Faye.Transport.WebSocket);

	if (Faye.Event && Faye.ENV.onbeforeunload !== undefined)
	  Faye.Event.on(Faye.ENV, 'beforeunload', function() {
	    Faye.Transport.WebSocket._unloaded = true;
	  });

	Faye.Transport.EventSource = Faye.extend(Faye.Class(Faye.Transport, {
	  initialize: function(dispatcher, endpoint) {
	    Faye.Transport.prototype.initialize.call(this, dispatcher, endpoint);
	    if (!Faye.ENV.EventSource) return this.setDeferredStatus('failed');

	    this._xhr = new Faye.Transport.XHR(dispatcher, endpoint);

	    endpoint = Faye.copyObject(endpoint);
	    endpoint.pathname += '/' + dispatcher.clientId;

	    var socket = new EventSource(Faye.URI.stringify(endpoint)),
	        self   = this;

	    socket.onopen = function() {
	      self._everConnected = true;
	      self.setDeferredStatus('succeeded');
	    };

	    socket.onerror = function() {
	      if (self._everConnected) {
	        self._handleError([]);
	      } else {
	        self.setDeferredStatus('failed');
	        socket.close();
	      }
	    };

	    socket.onmessage = function(event) {
	      self._receive(JSON.parse(event.data));
	    };

	    this._socket = socket;
	  },

	  close: function() {
	    if (!this._socket) return;
	    this._socket.onopen = this._socket.onerror = this._socket.onmessage = null;
	    this._socket.close();
	    delete this._socket;
	  },

	  isUsable: function(callback, context) {
	    this.callback(function() { callback.call(context, true) });
	    this.errback(function() { callback.call(context, false) });
	  },

	  encode: function(messages) {
	    return this._xhr.encode(messages);
	  },

	  request: function(messages) {
	    return this._xhr.request(messages);
	  }

	}), {
	  isUsable: function(dispatcher, endpoint, callback, context) {
	    var id = dispatcher.clientId;
	    if (!id) return callback.call(context, false);

	    Faye.Transport.XHR.isUsable(dispatcher, endpoint, function(usable) {
	      if (!usable) return callback.call(context, false);
	      this.create(dispatcher, endpoint).isUsable(callback, context);
	    }, this);
	  },

	  create: function(dispatcher, endpoint) {
	    var sockets = dispatcher.transports.eventsource = dispatcher.transports.eventsource || {},
	        id      = dispatcher.clientId;

	    var url = Faye.copyObject(endpoint);
	    url.pathname += '/' + (id || '');
	    url = Faye.URI.stringify(url);

	    sockets[url] = sockets[url] || new this(dispatcher, endpoint);
	    return sockets[url];
	  }
	});

	Faye.extend(Faye.Transport.EventSource.prototype, Faye.Deferrable);
	Faye.Transport.register('eventsource', Faye.Transport.EventSource);

	Faye.Transport.XHR = Faye.extend(Faye.Class(Faye.Transport, {
	  encode: function(messages) {
	    return Faye.toJSON(messages);
	  },

	  request: function(messages) {
	    var href = this.endpoint.href,
	        xhr  = Faye.ENV.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest(),
	        self = this;

	    xhr.open('POST', href, true);
	    xhr.setRequestHeader('Content-Type', 'application/json');
	    xhr.setRequestHeader('Pragma', 'no-cache');
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	    var headers = this._dispatcher.headers;
	    for (var key in headers) {
	      if (!headers.hasOwnProperty(key)) continue;
	      xhr.setRequestHeader(key, headers[key]);
	    }

	    var abort = function() { xhr.abort() };
	    if (Faye.ENV.onbeforeunload !== undefined) Faye.Event.on(Faye.ENV, 'beforeunload', abort);

	    xhr.onreadystatechange = function() {
	      if (!xhr || xhr.readyState !== 4) return;

	      var replies    = null,
	          status     = xhr.status,
	          text       = xhr.responseText,
	          successful = (status >= 200 && status < 300) || status === 304 || status === 1223;

	      if (Faye.ENV.onbeforeunload !== undefined) Faye.Event.detach(Faye.ENV, 'beforeunload', abort);
	      xhr.onreadystatechange = function() {};
	      xhr = null;

	      if (!successful) return self._handleError(messages);

	      try {
	        replies = JSON.parse(text);
	      } catch (e) {}

	      if (replies)
	        self._receive(replies);
	      else
	        self._handleError(messages);
	    };

	    xhr.send(this.encode(messages));
	    return xhr;
	  }
	}), {
	  isUsable: function(dispatcher, endpoint, callback, context) {
	    callback.call(context, Faye.URI.isSameOrigin(endpoint));
	  }
	});

	Faye.Transport.register('long-polling', Faye.Transport.XHR);

	Faye.Transport.CORS = Faye.extend(Faye.Class(Faye.Transport, {
	  encode: function(messages) {
	    return 'message=' + encodeURIComponent(Faye.toJSON(messages));
	  },

	  request: function(messages) {
	    var xhrClass = Faye.ENV.XDomainRequest ? XDomainRequest : XMLHttpRequest,
	        xhr      = new xhrClass(),
	        id       = ++Faye.Transport.CORS._id,
	        headers  = this._dispatcher.headers,
	        self     = this,
	        key;

	    xhr.open('POST', Faye.URI.stringify(this.endpoint), true);

	    if (xhr.setRequestHeader) {
	      xhr.setRequestHeader('Pragma', 'no-cache');
	      for (key in headers) {
	        if (!headers.hasOwnProperty(key)) continue;
	        xhr.setRequestHeader(key, headers[key]);
	      }
	    }

	    var cleanUp = function() {
	      if (!xhr) return false;
	      Faye.Transport.CORS._pending.remove(id);
	      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onprogress = null;
	      xhr = null;
	    };

	    xhr.onload = function() {
	      var replies = null;
	      try {
	        replies = JSON.parse(xhr.responseText);
	      } catch (e) {}

	      cleanUp();

	      if (replies)
	        self._receive(replies);
	      else
	        self._handleError(messages);
	    };

	    xhr.onerror = xhr.ontimeout = function() {
	      cleanUp();
	      self._handleError(messages);
	    };

	    xhr.onprogress = function() {};

	    if (xhrClass === Faye.ENV.XDomainRequest)
	      Faye.Transport.CORS._pending.add({id: id, xhr: xhr});

	    xhr.send(this.encode(messages));
	    return xhr;
	  }
	}), {
	  _id:      0,
	  _pending: new Faye.Set(),

	  isUsable: function(dispatcher, endpoint, callback, context) {
	    if (Faye.URI.isSameOrigin(endpoint))
	      return callback.call(context, false);

	    if (Faye.ENV.XDomainRequest)
	      return callback.call(context, endpoint.protocol === Faye.ENV.location.protocol);

	    if (Faye.ENV.XMLHttpRequest) {
	      var xhr = new Faye.ENV.XMLHttpRequest();
	      return callback.call(context, xhr.withCredentials !== undefined);
	    }
	    return callback.call(context, false);
	  }
	});

	Faye.Transport.register('cross-origin-long-polling', Faye.Transport.CORS);

	Faye.Transport.JSONP = Faye.extend(Faye.Class(Faye.Transport, {
	 encode: function(messages) {
	    var url = Faye.copyObject(this.endpoint);
	    url.query.message = Faye.toJSON(messages);
	    url.query.jsonp   = '__jsonp' + Faye.Transport.JSONP._cbCount + '__';
	    return Faye.URI.stringify(url);
	  },

	  request: function(messages) {
	    var head         = document.getElementsByTagName('head')[0],
	        script       = document.createElement('script'),
	        callbackName = Faye.Transport.JSONP.getCallbackName(),
	        endpoint     = Faye.copyObject(this.endpoint),
	        self         = this;

	    endpoint.query.message = Faye.toJSON(messages);
	    endpoint.query.jsonp   = callbackName;

	    var cleanup = function() {
	      if (!Faye.ENV[callbackName]) return false;
	      Faye.ENV[callbackName] = undefined;
	      try { delete Faye.ENV[callbackName] } catch (e) {}
	      script.parentNode.removeChild(script);
	    };

	    Faye.ENV[callbackName] = function(replies) {
	      cleanup();
	      self._receive(replies);
	    };

	    script.type = 'text/javascript';
	    script.src  = Faye.URI.stringify(endpoint);
	    head.appendChild(script);

	    script.onerror = function() {
	      cleanup();
	      self._handleError(messages);
	    };

	    return {abort: cleanup};
	  }
	}), {
	  _cbCount: 0,

	  getCallbackName: function() {
	    this._cbCount += 1;
	    return '__jsonp' + this._cbCount + '__';
	  },

	  isUsable: function(dispatcher, endpoint, callback, context) {
	    callback.call(context, true);
	  }
	});

	Faye.Transport.register('callback-polling', Faye.Transport.JSONP);

	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(10).setImmediate, __webpack_require__(2)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(2).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate, __webpack_require__(10).clearImmediate))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * @module stream
	 * @author Thierry Schellenbach
	 * BSD License
	 */
	var StreamClient = __webpack_require__(12);
	var errors = __webpack_require__(15);
	var request = __webpack_require__(13);

	function connect(apiKey, apiSecret, appId, options) {
	  /**
	   * Create StreamClient
	   * @method connect
	   * @param  {string} apiKey    API key
	   * @param  {string} [apiSecret] API secret (only use this on the server)
	   * @param  {string} [appId]     Application identifier
	   * @param  {object} [options]   Additional options
	   * @param  {string} [options.location] Datacenter location
	   * @return {StreamClient}     StreamClient
	   * @example <caption>Basic usage</caption>
	   * stream.connect(apiKey, apiSecret);
	   * @example <caption>or if you want to be able to subscribe and listen</caption>
	   * stream.connect(apiKey, apiSecret, appId);
	   * @example <caption>or on Heroku</caption>
	   * stream.connect(streamURL);
	   * @example <caption>where streamURL looks like</caption>
	   * "https://thierry:pass@gestream.io/?app=1"
	   */
	  if (typeof (process) !== 'undefined' && process.env.STREAM_URL && !apiKey) {
	    var parts = /https\:\/\/(\w+)\:(\w+)\@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL);
	    apiKey = parts[1];
	    apiSecret = parts[2];
	    var location = parts[3];
	    appId = parts[4];
	    if (options === undefined) {
	      options = {};
	    }

	    if (location !== 'getstream') {
	      options.location = location;
	    }
	  }

	  return new StreamClient(apiKey, apiSecret, appId, options);
	}

	module.exports.connect = connect;
	module.exports.errors = errors;
	module.exports.request = request;
	module.exports.Client = StreamClient;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var request = __webpack_require__(13);
	var StreamFeed = __webpack_require__(14);
	var signing = __webpack_require__(17);
	var errors = __webpack_require__(15);
	var utils = __webpack_require__(16);
	var BatchOperations = __webpack_require__(21);
	var Promise = __webpack_require__(22);
	var qs = __webpack_require__(23);

	/**
	 * @callback requestCallback
	 * @param {object} [errors]
	 * @param {object} response
	 * @param {object} body
	 */

	var StreamClient = function() {
	  /**
	   * Client to connect to Stream api
	   * @class StreamClient
	   */
	  this.initialize.apply(this, arguments);
	};

	StreamClient.prototype = {
	  baseUrl: 'https://api.getstream.io/api/',
	  baseAnalyticsUrl: 'https://analytics.getstream.io/analytics/',

	  initialize: function(apiKey, apiSecret, appId, options) {
	    /**
	     * Initialize a client
	     * @method intialize
	     * @memberof StreamClient.prototype
	     * @param {string} apiKey - the api key
	     * @param {string} [apiSecret] - the api secret
	     * @param {string} [appId] - id of the app
	     * @param {object} [options] - additional options
	     * @param {string} [options.location] - which data center to use
	     * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
	     * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
	     * stream.connect(apiKey, apiSecret)
	     * @example <caption>secret is optional and only used in server side mode</caption>
	     * stream.connect(apiKey, null, appId);
	     */
	    this.apiKey = apiKey;
	    this.apiSecret = apiSecret;
	    this.appId = appId;
	    this.options = options || {};
	    this.version = this.options.version || 'v1.0';
	    this.fayeUrl = this.options.fayeUrl || 'https://faye.getstream.io/faye';
	    this.fayeClient = null;
	    // track a source name for the api calls, ie get started or databrowser
	    this.group = this.options.group || 'unspecified';
	    // track subscriptions made on feeds created by this client
	    this.subscriptions = {};
	    this.expireTokens = this.options.expireTokens ? this.options.expireTokens : false;
	    // which data center to use
	    this.location = this.options.location;
	    if (this.location) {
	      this.baseUrl = 'https://' + this.location + '-api.getstream.io/api/';
	    }

	    if (typeof (process) !== 'undefined' && process.env.LOCAL) {
	      this.baseUrl = 'http://localhost:8000/api/';
	    }

	    if (typeof (process) !== 'undefined' && process.env.LOCAL_FAYE) {
	      this.fayeUrl = 'http://localhost:9999/faye/';
	    }

	    this.handlers = {};
	    this.browser = typeof (window) !== 'undefined';
	    this.node = !this.browser;

	    if (this.browser && this.apiSecret) {
	      throw new errors.FeedError('You are publicly sharing your private key. Dont use the private key while in the browser.');
	    }
	  },

	  on: function(event, callback) {
	    /**
	     * Support for global event callbacks
	     * This is useful for generic error and loading handling
	     * @method on
	     * @memberof StreamClient.prototype
	     * @param {string} event - Name of the event
	     * @param {function} callback - Function that is called when the event fires
	     * @example
	     * client.on('request', callback);
	     * client.on('response', callback);
	     */
	    this.handlers[event] = callback;
	  },

	  off: function(key) {
	    /**
	     * Remove one or more event handlers
	     * @method off
	     * @memberof StreamClient.prototype
	     * @param {string} [key] - Name of the handler
	     * @example
	     * client.off() removes all handlers
	     * client.off(name) removes the specified handler
	     */
	    if (key === undefined) {
	      this.handlers = {};
	    } else {
	      delete this.handlers[key];
	    }
	  },

	  send: function() {
	    /**
	     * Call the given handler with the arguments
	     * @method send
	     * @memberof StreamClient.prototype
	     * @access private
	     */
	    var args = Array.prototype.slice.call(arguments);
	    var key = args[0];
	    args = args.slice(1);
	    if (this.handlers[key]) {
	      this.handlers[key].apply(this, args);
	    }
	  },

	  wrapPromiseTask: function(cb, fulfill, reject) {
	    /**
	     * Wrap a task to be used as a promise
	     * @method wrapPromiseTask
	     * @memberof StreamClient.prototype
	     * @private
	     * @param {requestCallback} cb
	     * @param {function} fulfill
	     * @param {function} reject
	     * @return {function}
	     */
	    var client = this;

	    var callback = this.wrapCallback(cb);
	    return function task(error, response, body) {
	      if (error) {
	        reject({
	          error: error,
	          response: response,
	        });
	      } else if (!/^2/.test('' + response.statusCode)) {
	        reject({
	          error: body,
	          response: response,
	        });
	      } else {
	        fulfill(body);
	      }

	      callback.apply(client, arguments);
	    };
	  },

	  wrapCallback: function(cb) {
	    /**
	     * Wrap callback for HTTP request
	     * @method wrapCallBack
	     * @memberof StreamClient.prototype
	     * @access private
	     */
	    var client = this;

	    function callback() {
	      // first hit the global callback, subsequently forward
	      var args = Array.prototype.slice.call(arguments);
	      var sendArgs = ['response'].concat(args);
	      client.send.apply(client, sendArgs);
	      if (cb !== undefined) {
	        cb.apply(client, args);
	      }
	    }

	    return callback;
	  },

	  userAgent: function() {
	    /**
	     * Get the current user agent
	     * @method userAgent
	     * @memberof StreamClient.prototype
	     * @return {string} current user agent
	     */
	    var description = (this.node) ? 'node' : 'browser';
	    // TODO: get the version here in a way which works in both and browserify
	    var version = 'unknown';
	    return 'stream-javascript-client-' + description + '-' + version;
	  },

	  getReadOnlyToken: function(feedSlug, userId) {
	    /**
	     * Returns a token that allows only read operations
	     *
	     * @method getReadOnlyToken
	     * @memberof StreamClient.prototype
	     * @param {string} feedSlug - The feed slug to get a read only token for
	     * @param {string} userId - The user identifier
	     * @return {string} token
	     * @example
	     * client.getReadOnlyToken('user', '1');
	     */
	    var feedId = '' + feedSlug + userId;
	    return signing.JWTScopeToken(this.apiSecret, '*', 'read', { feedId: feedId, expireTokens: this.expireTokens });
	  },

	  getReadWriteToken: function(feedSlug, userId) {
	    /**
	     * Returns a token that allows read and write operations
	     *
	     * @method getReadWriteToken
	     * @memberof StreamClient.prototype
	     * @param {string} feedSlug - The feed slug to get a read only token for
	     * @param {string} userId - The user identifier
	     * @return {string} token
	     * @example
	     * client.getReadWriteToken('user', '1');
	     */
	    var feedId = '' + feedSlug + userId;
	    return signing.JWTScopeToken(this.apiSecret, '*', '*', { feedId: feedId, expireTokens: this.expireTokens });
	  },

	  feed: function(feedSlug, userId, token, siteId, options) {
	    /**
	     * Returns a feed object for the given feed id and token
	     * @method feed
	     * @memberof StreamClient.prototype
	     * @param {string} feedSlug - The feed slug
	     * @param {string} userId - The user identifier
	     * @param {string} [token] - The token
	     * @param {string} [siteId] - The site identifier
	     * @param {object} [options] - Additional function options
	     * @param {boolean} [options.readOnly] - A boolean indicating whether to generate a read only token for this feed
	     * @return {StreamFeed}
	     * @example
	     * client.feed('user', '1', 'token2');
	     */

	    options = options || {};

	    if (!feedSlug || !userId) {
	      throw new errors.FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
	    }

	    if (feedSlug.indexOf(':') !== -1) {
	      throw new errors.FeedError('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
	    }

	    utils.validateFeedSlug(feedSlug);
	    utils.validateUserId(userId);

	    // raise an error if there is no token
	    if (!this.apiSecret && !token) {
	      throw new errors.FeedError('Missing token, in client side mode please provide a feed secret');
	    }

	    // create the token in server side mode
	    if (this.apiSecret && !token) {
	      var feedId = '' + feedSlug + userId;
	      // use scoped token if read-only access is necessary
	      token = options.readOnly ? this.getReadOnlyToken(feedSlug, userId) : signing.sign(this.apiSecret, feedId);
	    }

	    var feed = new StreamFeed(this, feedSlug, userId, token, siteId);
	    return feed;
	  },

	  enrichUrl: function(relativeUrl) {
	    /**
	     * Combines the base url with version and the relative url
	     * @method enrichUrl
	     * @memberof StreamClient.prototype
	     * @private
	     * @param {string} relativeUrl
	     */
	    var url = this.baseUrl + this.version + '/' + relativeUrl;
	    return url;
	  },

	  enrichKwargs: function(kwargs) {
	    /**
	     * Adds the API key and the signature
	     * @method enrichKwargs
	     * @memberof StreamClient.prototype
	     * @param {object} kwargs
	     * @private
	     */
	    kwargs.url = this.enrichUrl(kwargs.url);
	    if (kwargs.qs === undefined) {
	      kwargs.qs = {};
	    }

	    kwargs.qs['api_key'] = this.apiKey;
	    kwargs.qs.location = this.group;
	    kwargs.json = true;
	    var signature = kwargs.signature || this.signature;
	    kwargs.headers = {};

	    // auto-detect authentication type and set HTTP headers accordingly
	    if (signing.isJWTSignature(signature)) {
	      kwargs.headers['stream-auth-type'] = 'jwt';
	      signature = signature.split(' ').reverse()[0];
	    } else {
	      kwargs.headers['stream-auth-type'] = 'simple';
	    }

	    kwargs.headers.Authorization = signature;
	    kwargs.headers['X-Stream-Client'] = this.userAgent();
	    return kwargs;
	  },

	  signActivity: function(activity) {
	    /**
	     * We automatically sign the to parameter when in server side mode
	     * @method signActivities
	     * @memberof StreamClient.prototype
	     * @private
	     * @param  {object}       [activity] Activity to sign
	     */
	    return this.signActivities([activity])[0];
	  },

	  signActivities: function(activities) {
	    /**
	     * We automatically sign the to parameter when in server side mode
	     * @method signActivities
	     * @memberof StreamClient.prototype
	     * @private
	     * @param {array} Activities
	     */
	    if (!this.apiSecret) {
	      return activities;
	    }

	    for (var i = 0; i < activities.length; i++) {
	      var activity = activities[i];
	      var to = activity.to || [];
	      var signedTo = [];
	      for (var j = 0; j < to.length; j++) {
	        var feedId = to[j];
	        var feedSlug = feedId.split(':')[0];
	        var userId = feedId.split(':')[1];
	        var token = this.feed(feedSlug, userId).token;
	        var signedFeed = feedId + ' ' + token;
	        signedTo.push(signedFeed);
	      }

	      activity.to = signedTo;
	    }

	    return activities;
	  },

	  getFayeAuthorization: function() {
	    /**
	     * Get the authorization middleware to use Faye with getstream.io
	     * @method getFayeAuthorization
	     * @memberof StreamClient.prototype
	     * @private
	     * @return {object} Faye authorization middleware
	     */
	    var apiKey = this.apiKey,
	        self = this;

	    return {
	      incoming: function(message, callback) {
	        callback(message);
	      },

	      outgoing: function(message, callback) {
	        if (message.subscription && self.subscriptions[message.subscription]) {
	          var subscription = self.subscriptions[message.subscription];

	          message.ext = {
	            'user_id': subscription.userId,
	            'api_key': apiKey,
	            'signature': subscription.token,
	          };
	        }

	        callback(message);
	      },
	    };
	  },

	  getFayeClient: function() {
	    /**
	     * Returns this client's current Faye client
	     * @method getFayeClient
	     * @memberof StreamClient.prototype
	     * @private
	     * @return {object} Faye client
	     */
	    var Faye = __webpack_require__(9);
	    if (this.fayeClient === null) {
	      this.fayeClient = new Faye.Client(this.fayeUrl);
	      var authExtension = this.getFayeAuthorization();
	      this.fayeClient.addExtension(authExtension);
	    }

	    return this.fayeClient;
	  },

	  get: function(kwargs, cb) {
	    /**
	     * Shorthand function for get request
	     * @method get
	     * @memberof StreamClient.prototype
	     * @private
	     * @param  {object}   kwargs
	     * @param  {requestCallback} cb     Callback to call on completion
	     * @return {Promise}                Promise object
	     */
	    return new Promise(function(fulfill, reject) {
	      this.send('request', 'get', kwargs, cb);
	      kwargs = this.enrichKwargs(kwargs);
	      kwargs.method = 'GET';
	      var callback = this.wrapPromiseTask(cb, fulfill, reject);
	      request(kwargs, callback);
	    }.bind(this));
	  },

	  post: function(kwargs, cb) {
	    /**
	     * Shorthand function for post request
	     * @method post
	     * @memberof StreamClient.prototype
	     * @private
	     * @param  {object}   kwargs
	     * @param  {requestCallback} cb     Callback to call on completion
	     * @return {Promise}                Promise object
	     */
	    return new Promise(function(fulfill, reject) {
	      this.send('request', 'post', kwargs, cb);
	      kwargs = this.enrichKwargs(kwargs);
	      kwargs.method = 'POST';
	      var callback = this.wrapPromiseTask(cb, fulfill, reject);
	      request(kwargs, callback);
	    }.bind(this));
	  },

	  delete: function(kwargs, cb) {
	    /**
	     * Shorthand function for delete request
	     * @method delete
	     * @memberof StreamClient.prototype
	     * @private
	     * @param  {object}   kwargs
	     * @param  {requestCallback} cb     Callback to call on completion
	     * @return {Promise}                Promise object
	     */
	    return new Promise(function(fulfill, reject) {
	      this.send('request', 'delete', kwargs, cb);
	      kwargs = this.enrichKwargs(kwargs);
	      kwargs.method = 'DELETE';
	      var callback = this.wrapPromiseTask(cb, fulfill, reject);
	      request(kwargs, callback);
	    }.bind(this));
	  },

	};

	if (qs) {
	  StreamClient.prototype.createRedirectUrl = function(targetUrl, userId, events) {
	    /**
	     * Creates a redirect url for tracking the given events in the context of
	     * an email using Stream's analytics platform. Learn more at
	     * getstream.io/personalization
	     * @method createRedirectUrl
	     * @memberof StreamClient.prototype
	     * @param  {string} targetUrl Target url
	     * @param  {string} userId    User id to track
	     * @param  {array} events     List of events to track
	     * @return {string}           The redirect url
	     */
	    var url = __webpack_require__(24);
	    var uri = url.parse(targetUrl);

	    if (!(uri.host || (uri.hostname && uri.port)) && !uri.isUnix) {
	      throw new errors.MissingSchemaError('Invalid URI: "' + url.format(uri) + '"');
	    }

	    var authToken = signing.JWTScopeToken(this.apiSecret, 'redirect_and_track', '*', { userId: userId, expireTokens: this.expireTokens });
	    var analyticsUrl = this.baseAnalyticsUrl + 'redirect/';
	    var kwargs = {
	      'auth_type': 'jwt',
	      'authorization': authToken,
	      'url': targetUrl,
	      'api_key': this.apiKey,
	      'events': JSON.stringify(events),
	    };

	    var qString = utils.rfc3986(qs.stringify(kwargs, null, null, {}));

	    return analyticsUrl + '?' + qString;
	  };
	}

	// If we are in a node environment and batchOperations is available add the methods to the prototype of StreamClient
	if (BatchOperations) {
	  for (var key in BatchOperations) {
	    if (BatchOperations.hasOwnProperty(key)) {
	      StreamClient.prototype[key] = BatchOperations[key];
	    }
	  }
	}

	module.exports = StreamClient;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	// Browser Request
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//     http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	var XHR = XMLHttpRequest
	if (!XHR) throw new Error('missing XMLHttpRequest')
	request.log = {
	  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
	}

	var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

	//
	// request
	//

	function request(options, callback) {
	  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
	  if(typeof callback !== 'function')
	    throw new Error('Bad callback given: ' + callback)

	  if(!options)
	    throw new Error('No options given')

	  var options_onResponse = options.onResponse; // Save this for later.

	  if(typeof options === 'string')
	    options = {'uri':options};
	  else
	    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

	  options.onResponse = options_onResponse // And put it back.

	  if (options.verbose) request.log = getLogger();

	  if(options.url) {
	    options.uri = options.url;
	    delete options.url;
	  }

	  if(!options.uri && options.uri !== "")
	    throw new Error("options.uri is a required argument");

	  if(typeof options.uri != "string")
	    throw new Error("options.uri must be a string");

	  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
	  for (var i = 0; i < unsupported_options.length; i++)
	    if(options[ unsupported_options[i] ])
	      throw new Error("options." + unsupported_options[i] + " is not supported")

	  options.callback = callback
	  options.method = options.method || 'GET';
	  options.headers = options.headers || {};
	  options.body    = options.body || null
	  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

	  if(options.headers.host)
	    throw new Error("Options.headers.host is not supported");

	  if(options.json) {
	    options.headers.accept = options.headers.accept || 'application/json'
	    if(options.method !== 'GET')
	      options.headers['content-type'] = 'application/json'

	    if(typeof options.json !== 'boolean')
	      options.body = JSON.stringify(options.json)
	    else if(typeof options.body !== 'string')
	      options.body = JSON.stringify(options.body)
	  }
	  
	  //BEGIN QS Hack
	  var serialize = function(obj) {
	    var str = [];
	    for(var p in obj)
	      if (obj.hasOwnProperty(p)) {
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	      }
	    return str.join("&");
	  }
	  
	  if(options.qs){
	    var qs = (typeof options.qs == 'string')? options.qs : serialize(options.qs);
	    if(options.uri.indexOf('?') !== -1){ //no get params
	        options.uri = options.uri+'&'+qs;
	    }else{ //existing get params
	        options.uri = options.uri+'?'+qs;
	    }
	  }
	  //END QS Hack
	  
	  //BEGIN FORM Hack
	  var multipart = function(obj) {
	    //todo: support file type (useful?)
	    var result = {};
	    result.boundry = '-------------------------------'+Math.floor(Math.random()*1000000000);
	    var lines = [];
	    for(var p in obj){
	        if (obj.hasOwnProperty(p)) {
	            lines.push(
	                '--'+result.boundry+"\n"+
	                'Content-Disposition: form-data; name="'+p+'"'+"\n"+
	                "\n"+
	                obj[p]+"\n"
	            );
	        }
	    }
	    lines.push( '--'+result.boundry+'--' );
	    result.body = lines.join('');
	    result.length = result.body.length;
	    result.type = 'multipart/form-data; boundary='+result.boundry;
	    return result;
	  }
	  
	  if(options.form){
	    if(typeof options.form == 'string') throw('form name unsupported');
	    if(options.method === 'POST'){
	        var encoding = (options.encoding || 'application/x-www-form-urlencoded').toLowerCase();
	        options.headers['content-type'] = encoding;
	        switch(encoding){
	            case 'application/x-www-form-urlencoded':
	                options.body = serialize(options.form).replace(/%20/g, "+");
	                break;
	            case 'multipart/form-data':
	                var multi = multipart(options.form);
	                //options.headers['content-length'] = multi.length;
	                options.body = multi.body;
	                options.headers['content-type'] = multi.type;
	                break;
	            default : throw new Error('unsupported encoding:'+encoding);
	        }
	    }
	  }
	  //END FORM Hack

	  // If onResponse is boolean true, call back immediately when the response is known,
	  // not when the full request is complete.
	  options.onResponse = options.onResponse || noop
	  if(options.onResponse === true) {
	    options.onResponse = callback
	    options.callback = noop
	  }

	  // XXX Browsers do not like this.
	  //if(options.body)
	  //  options.headers['content-length'] = options.body.length;

	  // HTTP basic authentication
	  if(!options.headers.authorization && options.auth)
	    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

	  return run_xhr(options)
	}

	var req_seq = 0
	function run_xhr(options) {
	  var xhr = new XHR
	    , timed_out = false
	    , is_cors = is_crossDomain(options.uri)
	    , supports_cors = ('withCredentials' in xhr)

	  req_seq += 1
	  xhr.seq_id = req_seq
	  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
	  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

	  if(is_cors && !supports_cors) {
	    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
	    cors_err.cors = 'unsupported'
	    return options.callback(cors_err, xhr)
	  }

	  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
	  function too_late() {
	    timed_out = true
	    var er = new Error('ETIMEDOUT')
	    er.code = 'ETIMEDOUT'
	    er.duration = options.timeout

	    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
	    return options.callback(er, xhr)
	  }

	  // Some states can be skipped over, so remember what is still incomplete.
	  var did = {'response':false, 'loading':false, 'end':false}

	  xhr.onreadystatechange = on_state_change
	  xhr.open(options.method, options.uri, true) // asynchronous
	  if(is_cors)
	    xhr.withCredentials = !! options.withCredentials

	  for (var key in options.headers)
	    xhr.setRequestHeader(key, options.headers[key])

	  xhr.send(options.body)
	  return xhr

	  function on_state_change(event) {
	    if(timed_out)
	      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

	    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

	    if(xhr.readyState === XHR.OPENED) {
	      request.log.debug('Request started', {'id':xhr.id})
	    }

	    else if(xhr.readyState === XHR.HEADERS_RECEIVED)
	      on_response()

	    else if(xhr.readyState === XHR.LOADING) {
	      on_response()
	      on_loading()
	    }

	    else if(xhr.readyState === XHR.DONE) {
	      on_response()
	      on_loading()
	      on_end()
	    }
	  }

	  function on_response() {
	    if(did.response)
	      return

	    did.response = true
	    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
	    clearTimeout(xhr.timeoutTimer)
	    xhr.statusCode = xhr.status // Node request compatibility

	    // Detect failed CORS requests.
	    if(is_cors && xhr.statusCode == 0) {
	      var cors_err = new Error('CORS request rejected: ' + options.uri)
	      cors_err.cors = 'rejected'

	      // Do not process this request further.
	      did.loading = true
	      did.end = true

	      return options.callback(cors_err, xhr)
	    }

	    options.onResponse(null, xhr)
	  }

	  function on_loading() {
	    if(did.loading)
	      return

	    did.loading = true
	    request.log.debug('Response body loading', {'id':xhr.id})
	    // TODO: Maybe simulate "data" events by watching xhr.responseText
	  }

	  function on_end() {
	    if(did.end)
	      return

	    did.end = true
	    request.log.debug('Request done', {'id':xhr.id})

	    xhr.body = xhr.responseText
	    if(options.json) {
	      try        { xhr.body = JSON.parse(xhr.responseText) }
	      catch (er) { return options.callback(er, xhr)        }
	    }

	    options.callback(null, xhr, xhr.body)
	  }

	} // request

	request.withCredentials = false;
	request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

	//
	// defaults
	//

	request.defaults = function(options, requester) {
	  var def = function (method) {
	    var d = function (params, callback) {
	      if(typeof params === 'string')
	        params = {'uri': params};
	      else {
	        params = JSON.parse(JSON.stringify(params));
	      }
	      for (var i in options) {
	        if (params[i] === undefined) params[i] = options[i]
	      }
	      return method(params, callback)
	    }
	    return d
	  }
	  var de = def(request)
	  de.get = def(request.get)
	  de.post = def(request.post)
	  de.put = def(request.put)
	  de.head = def(request.head)
	  return de
	}

	//
	// HTTP method shortcuts
	//

	var shortcuts = [ 'get', 'put', 'post', 'head' ];
	shortcuts.forEach(function(shortcut) {
	  var method = shortcut.toUpperCase();
	  var func   = shortcut.toLowerCase();

	  request[func] = function(opts) {
	    if(typeof opts === 'string')
	      opts = {'method':method, 'uri':opts};
	    else {
	      opts = JSON.parse(JSON.stringify(opts));
	      opts.method = method;
	    }

	    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
	    return request.apply(this, args);
	  }
	})

	//
	// CouchDB shortcut
	//

	request.couch = function(options, callback) {
	  if(typeof options === 'string')
	    options = {'uri':options}

	  // Just use the request API to do JSON.
	  options.json = true
	  if(options.body)
	    options.json = options.body
	  delete options.body

	  callback = callback || noop

	  var xhr = request(options, couch_handler)
	  return xhr

	  function couch_handler(er, resp, body) {
	    if(er)
	      return callback(er, resp, body)

	    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
	      // The body is a Couch JSON object indicating the error.
	      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
	      for (var key in body)
	        er[key] = body[key]
	      return callback(er, resp, body);
	    }

	    return callback(er, resp, body);
	  }
	}

	//
	// Utility
	//

	function noop() {}

	function getLogger() {
	  var logger = {}
	    , levels = ['trace', 'debug', 'info', 'warn', 'error']
	    , level, i

	  for(i = 0; i < levels.length; i++) {
	    level = levels[i]

	    logger[level] = noop
	    if(typeof console !== 'undefined' && console && console[level])
	      logger[level] = formatted(console, level)
	  }

	  return logger
	}

	function formatted(obj, method) {
	  return formatted_logger

	  function formatted_logger(str, context) {
	    if(typeof context === 'object')
	      str += ' ' + JSON.stringify(context)

	    return obj[method].call(obj, str)
	  }
	}

	// Return whether a URL is a cross-domain request.
	function is_crossDomain(url) {
	  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

	  // jQuery #8138, IE may throw an exception when accessing
	  // a field from window.location if document.domain has been set
	  var ajaxLocation
	  try { ajaxLocation = location.href }
	  catch (e) {
	    // Use the href attribute of an A element since IE will modify it given document.location
	    ajaxLocation = document.createElement( "a" );
	    ajaxLocation.href = "";
	    ajaxLocation = ajaxLocation.href;
	  }

	  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
	    , parts = rurl.exec(url.toLowerCase() )

	  var result = !!(
	    parts &&
	    (  parts[1] != ajaxLocParts[1]
	    || parts[2] != ajaxLocParts[2]
	    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
	    )
	  )

	  //console.debug('is_crossDomain('+url+') -> ' + result)
	  return result
	}

	// MIT License from http://phpjs.org/functions/base64_encode:358
	function b64_enc (data) {
	    // Encodes string using MIME base64 algorithm
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    // assume utf8 data
	    // data = this.utf8_encode(data+'');

	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);

	        bits = o1<<16 | o2<<8 | o3;

	        h1 = bits>>18 & 0x3f;
	        h2 = bits>>12 & 0x3f;
	        h3 = bits>>6 & 0x3f;
	        h4 = bits & 0x3f;

	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);

	    enc = tmp_arr.join('');

	    switch (data.length % 3) {
	        case 1:
	            enc = enc.slice(0, -2) + '==';
	        break;
	        case 2:
	            enc = enc.slice(0, -1) + '=';
	        break;
	    }

	    return enc;
	}
	module.exports = request;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(15);
	var utils = __webpack_require__(16);

	var StreamFeed = function() {
	  /**
	   * Manage api calls for specific feeds
	   * The feed object contains convenience functions such add activity, remove activity etc
	   * @class StreamFeed
	   */
	  this.initialize.apply(this, arguments);
	};

	StreamFeed.prototype = {
	  initialize: function(client, feedSlug, userId, token) {
	    /**
	     * Initialize a feed object
	     * @method intialize
	     * @memberof StreamFeed.prototype
	     * @param {StreamClient} client - The stream client this feed is constructed from
	     * @param {string} feedSlug - The feed slug
	     * @param {string} userId - The user id
	     * @param {string} [token] - The authentication token
	     */
	    this.client = client;
	    this.slug = feedSlug;
	    this.userId = userId;
	    this.id = this.slug + ':' + this.userId;
	    this.token = token;

	    this.feedUrl = this.id.replace(':', '/');
	    this.feedTogether = this.id.replace(':', '');
	    this.signature = this.feedTogether + ' ' + this.token;

	    // faye setup
	    this.notificationChannel = 'site-' + this.client.appId + '-feed-' + this.feedTogether;
	  },

	  addActivity: function(activity, callback) {
	    /**
	     * Adds the given activity to the feed and
	     * calls the specified callback
	     * @method addActivity
	     * @memberof StreamFeed.prototype
	     * @param {object} activity - The activity to add
	     * @param {requestCallback} callback - Callback to call on completion
	     * @return {Promise} Promise object
	     */
	    activity = this.client.signActivity(activity);

	    return this.client.post({
	      url: 'feed/' + this.feedUrl + '/',
	      body: activity,
	      signature: this.signature,
	    }, callback);
	  },

	  removeActivity: function(activityId, callback) {
	    /**
	     * Removes the activity by activityId
	     * @method removeActivity
	     * @memberof StreamFeed.prototype
	     * @param  {string}   activityId Identifier of activity to remove
	     * @param  {requestCallback} callback   Callback to call on completion
	     * @return {Promise} Promise object
	     * @example
	     * feed.removeActivity(activityId);
	     * @example
	     * feed.removeActivity({'foreign_id': foreignId});
	     */
	    var identifier = (activityId.foreignId) ? activityId.foreignId : activityId;
	    var params = {};
	    if (activityId.foreignId) {
	      params['foreign_id'] = '1';
	    }

	    return this.client.delete({
	      url: 'feed/' + this.feedUrl + '/' + identifier + '/',
	      qs: params,
	      signature: this.signature,
	    }, callback);
	  },

	  addActivities: function(activities, callback) {
	    /**
	     * Adds the given activities to the feed and calls the specified callback
	     * @method addActivities
	     * @memberof StreamFeed.prototype
	     * @param  {Array}   activities Array of activities to add
	     * @param  {requestCallback} callback   Callback to call on completion
	     * @return {Promise}               XHR request object
	     */
	    activities = this.client.signActivities(activities);
	    var data = {
	      activities: activities,
	    };
	    var xhr = this.client.post({
	      url: 'feed/' + this.feedUrl + '/',
	      body: data,
	      signature: this.signature,
	    }, callback);
	    return xhr;
	  },

	  follow: function(targetSlug, targetUserId, options, callback) {
	    /**
	     * Follows the given target feed
	     * @method follow
	     * @memberof StreamFeed.prototype
	     * @param  {string}   targetSlug   Slug of the target feed
	     * @param  {string}   targetUserId User identifier of the target feed
	     * @param  {object}   options      Additional options
	     * @param  {number}   options.activityCopyLimit Limit the amount of activities copied over on follow
	     * @param  {requestCallback} callback     Callback to call on completion
	     * @return {Promise}  Promise object
	     * @example feed.follow('user', '1');
	     * @example feed.follow('user', '1', callback);
	     * @example feed.follow('user', '1', options, callback);
	     */
	    utils.validateFeedSlug(targetSlug);
	    utils.validateUserId(targetUserId);

	    var activityCopyLimit;
	    var last = arguments[arguments.length - 1];
	    // callback is always the last argument
	    callback = (last.call) ? last : undefined;
	    var target = targetSlug + ':' + targetUserId;

	    // check for additional options
	    if (options && !options.call) {
	      if (options.limit) {
	        activityCopyLimit = options.limit;
	      }
	    }

	    var body = {
	      target: target,
	    };

	    if (activityCopyLimit) {
	      body['activity_copy_limit'] = activityCopyLimit;
	    }

	    return this.client.post({
	      url: 'feed/' + this.feedUrl + '/following/',
	      body: body,
	      signature: this.signature,
	    }, callback);
	  },

	  unfollow: function(targetSlug, targetUserId, callback) {
	    /**
	     * Unfollow the given feed
	     * @method unfollow
	     * @memberof StreamFeed.prototype
	     * @param  {string}   targetSlug   Slug of the target feed
	     * @param  {string}   targetUserId [description]
	     * @param  {requestCallback} callback     Callback to call on completion
	     * @return {object}                XHR request object
	     * @example feed.unfollow('user', '2', callback);
	     */
	    utils.validateFeedSlug(targetSlug);
	    utils.validateUserId(targetUserId);
	    var targetFeedId = targetSlug + ':' + targetUserId;
	    var xhr = this.client.delete({
	      url: 'feed/' + this.feedUrl + '/following/' + targetFeedId + '/',
	      signature: this.signature,
	    }, callback);
	    return xhr;
	  },

	  following: function(options, callback) {
	    /**
	     * List which feeds this feed is following
	     * @method following
	     * @memberof StreamFeed.prototype
	     * @param  {object}   options  Additional options
	     * @param  {string}   options.filter Filter to apply on search operation
	     * @param  {requestCallback} callback Callback to call on completion
	     * @return {Promise} Promise object
	     * @example feed.following({limit:10, filter: ['user:1', 'user:2']}, callback);
	     */
	    if (options !== undefined && options.filter) {
	      options.filter = options.filter.join(',');
	    }

	    return this.client.get({
	      url: 'feed/' + this.feedUrl + '/following/',
	      qs: options,
	      signature: this.signature,
	    }, callback);
	  },

	  followers: function(options, callback) {
	    /**
	     * List the followers of this feed
	     * @method followers
	     * @memberof StreamFeed.prototype
	     * @param  {object}   options  Additional options
	     * @param  {string}   options.filter Filter to apply on search operation
	     * @param  {requestCallback} callback Callback to call on completion
	     * @return {Promise} Promise object
	     * @example
	     * feed.followers({limit:10, filter: ['user:1', 'user:2']}, callback);
	     */
	    if (options !== undefined && options.filter) {
	      options.filter = options.filter.join(',');
	    }

	    return this.client.get({
	      url: 'feed/' + this.feedUrl + '/followers/',
	      qs: options,
	      signature: this.signature,
	    }, callback);
	  },

	  get: function(options, callback) {
	    /**
	     * Reads the feed
	     * @method get
	     * @memberof StreamFeed.prototype
	     * @param  {object}   options  Additional options
	     * @param  {requestCallback} callback Callback to call on completion
	     * @return {Promise} Promise object
	     * @example feed.get({limit: 10, id_lte: 'activity-id'})
	     * @example feed.get({limit: 10, mark_seen: true})
	     */
	    if (options && options['mark_read'] && options['mark_read'].join) {
	      options['mark_read'] = options['mark_read'].join(',');
	    }

	    if (options && options['mark_seen'] && options['mark_seen'].join) {
	      options['mark_seen'] = options['mark_seen'].join(',');
	    }

	    return this.client.get({
	      url: 'feed/' + this.feedUrl + '/',
	      qs: options,
	      signature: this.signature,
	    }, callback);
	  },

	  getFayeClient: function() {
	    /**
	     * Returns the current faye client object
	     * @method getFayeClient
	     * @memberof StreamFeed.prototype
	     * @access private
	     * @return {object} Faye client
	     */
	    return this.client.getFayeClient();
	  },

	  subscribe: function(callback) {
	    /**
	     * Subscribes to any changes in the feed, return a promise
	     * @method subscribe
	     * @memberof StreamFeed.prototype
	     * @param  {function} callback Callback to call on completion
	     * @return {Promise}           Promise object
	     * @example
	     * feed.subscribe(callback).then(function(){
	     * 		console.log('we are now listening to changes');
	     * });
	     */
	    if (!this.client.appId) {
	      throw new errors.SiteError('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
	    }

	    this.client.subscriptions['/' + this.notificationChannel] = {
	      token: this.token,
	      userId: this.notificationChannel,
	    };

	    return this.getFayeClient().subscribe('/' + this.notificationChannel, callback);
	  },
	};

	module.exports = StreamFeed;


/***/ },
/* 15 */
/***/ function(module, exports) {

	var errors = module.exports;

	var canCapture = (typeof Error.captureStackTrace === 'function');
	var canStack = !!(new Error()).stack;

	/**
	 * Abstract error object
	 * @class ErrorAbstract
	 * @access private
	 * @param  {string}      [msg]         Error message
	 * @param  {function}    constructor
	 */
	function ErrorAbstract(msg, constructor) {
	  this.message = msg;

	  Error.call(this, this.message);

	  if (canCapture) {
	    Error.captureStackTrace(this, constructor);
	  } else if (canStack) {
	    this.stack = (new Error()).stack;
	  } else {
	    this.stack = '';
	  }
	}

	errors._Abstract = ErrorAbstract;
	ErrorAbstract.prototype = new Error();

	/**
	 * FeedError
	 * @class FeedError
	 * @access private
	 * @extends ErrorAbstract
	 * @memberof Stream.errors
	 * @param {String} [msg] - An error message that will probably end up in a log.
	 */
	errors.FeedError = function FeedError(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.FeedError.prototype = new ErrorAbstract();

	/**
	 * SiteError
	 * @class SiteError
	 * @access private
	 * @extends ErrorAbstract
	 * @memberof Stream.errors
	 * @param  {string}  [msg]  An error message that will probably end up in a log.
	 */
	errors.SiteError = function SiteError(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.SiteError.prototype = new ErrorAbstract();

	/**
	 * MissingSchemaError
	 * @method MissingSchema
	 * @access private
	 * @extends ErrorAbstract
	 * @memberof Stream.errors
	 * @param  {string} msg
	 */
	errors.MissingSchemaError = function MissingSchemaError(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.MissingSchemaError.prototype = new ErrorAbstract();


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(15);
	var validRe = /^[\w-]+$/;

	function validateFeedId(feedId) {
	  /*
	  	 * Validate that the feedId matches the spec user:1
	  	 */
	  var parts = feedId.split(':');
	  if (parts.length !== 2) {
	    throw new errors.FeedError('Invalid feedId, expected something like user:1 got ' + feedId);
	  }

	  var feedSlug = parts[0];
	  var userId = parts[1];
	  validateFeedSlug(feedSlug);
	  validateUserId(userId);
	  return feedId;
	}

	exports.validateFeedId = validateFeedId;

	function validateFeedSlug(feedSlug) {
	  /*
	  	 * Validate that the feedSlug matches \w
	  	 */
	  var valid = validRe.test(feedSlug);
	  if (!valid) {
	    throw new errors.FeedError('Invalid feedSlug, please use letters, numbers or _ got: ' + feedSlug);
	  }

	  return feedSlug;
	}

	exports.validateFeedSlug = validateFeedSlug;

	function validateUserId(userId) {
	  /*
	  	 * Validate the userId matches \w
	  	 */
	  var valid = validRe.test(userId);
	  if (!valid) {
	    throw new errors.FeedError('Invalid feedSlug, please use letters, numbers or _ got: ' + userId);
	  }

	  return userId;
	}

	exports.validateUserId = validateUserId;

	function rfc3986(str) {
	  return str.replace(/[!'()*]/g, function(c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	  });
	}

	exports.rfc3986 = rfc3986;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var crypto = __webpack_require__(18);
	var jwt = __webpack_require__(19);
	var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
	var Base64 = __webpack_require__(20);

	function makeUrlSafe(s) {
	  /*
	   * Makes the given base64 encoded string urlsafe
	   */
	  var escaped = s.replace(/\+/g, '-').replace(/\//g, '_');
	  return escaped.replace(/^=+/, '').replace(/=+$/, '');
	}

	function decodeBase64Url(base64UrlString) {
	  try {
	    return Base64.atob(toBase64(base64UrlString));
	  } catch (e) {
	    if (e.name === 'InvalidCharacterError') {
	      return undefined;
	    } else {
	      throw e;
	    }
	  }
	}

	function safeJsonParse(thing) {
	  if (typeof (thing) === 'object') return thing;
	  try {
	    return JSON.parse(thing);
	  } catch (e) {
	    return undefined;
	  }
	}

	function padString(string) {
	  var segmentLength = 4;
	  var diff = string.length % segmentLength;
	  if (!diff)
	      return string;
	  var padLength = segmentLength - diff;

	  while (padLength--)
	    string += '=';
	  return string;
	}

	function toBase64(base64UrlString) {
	  var b64str = padString(base64UrlString)
	    .replace(/\-/g, '+')
	    .replace(/_/g, '/');
	  return b64str;
	}

	function headerFromJWS(jwsSig) {
	  var encodedHeader = jwsSig.split('.', 1)[0];
	  return safeJsonParse(decodeBase64Url(encodedHeader));
	}

	exports.headerFromJWS = headerFromJWS;

	exports.sign = function(apiSecret, feedId) {
	  /*
	   * Setup sha1 based on the secret
	   * Get the digest of the value
	   * Base64 encode the result
	   *
	   * Also see
	   * https://github.com/tbarbugli/stream-ruby/blob/master/lib/stream/signer.rb
	   * https://github.com/tschellenbach/stream-python/blob/master/stream/signing.py
	   *
	   * Steps
	   * apiSecret: tfq2sdqpj9g446sbv653x3aqmgn33hsn8uzdc9jpskaw8mj6vsnhzswuwptuj9su
	   * feedId: flat1
	   * digest: Q\xb6\xd5+\x82\xd58\xdeu\x80\xc5\xe3\xb8\xa5bL1\xf1\xa3\xdb
	   * token: UbbVK4LVON51gMXjuKViTDHxo9s
	   */
	  var hashedSecret = new crypto.createHash('sha1').update(apiSecret).digest();
	  var hmac = crypto.createHmac('sha1', hashedSecret);
	  var digest = hmac.update(feedId).digest('base64');
	  var token = makeUrlSafe(digest);
	  return token;
	};

	exports.JWTScopeToken = function(apiSecret, resource, action, opts) {
	  /**
	   * Creates the JWT token for feedId, resource and action using the apiSecret
	   * @method JWTScopeToken
	   * @memberof signing
	   * @private
	   * @param {string} apiSecret - API Secret key
	   * @param {string} resource - JWT payload resource
	   * @param {string} action - JWT payload action
	   * @param {object} [options] - Optional additional options
	   * @param {string} [options.feedId] - JWT payload feed identifier
	   * @param {string} [options.userId] - JWT payload user identifier
	   * @return {string} JWT Token
	   */
	  var options = opts || {},
	      noTimestamp = options.expireTokens ? !options.expireTokens : true;
	  var payload = {
	    resource: resource,
	    action: action,
	  };

	  if (options.feedId) {
	    payload['feed_id'] = options.feedId;
	  }

	  if (options.userId) {
	    payload['user_id'] = options.userId;
	  }

	  var token = jwt.sign(payload, apiSecret, {algorithm: 'HS256', noTimestamp: noTimestamp});
	  return token;
	};

	exports.isJWTSignature = function(signature) {
	  /**
	   * check if token is a valid JWT token
	   * @method isJWTSignature
	   * @memberof signing
	   * @private
	   * @param {string} signature - Signature to check
	   * @return {boolean}
	   */
	  var token = signature.split(' ')[1];
	  return JWS_REGEX.test(token) && !!headerFromJWS(token);
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 19 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	;(function () {

	  var object =  true ? exports : this; // #8: web workers
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	  function InvalidCharacterError(message) {
	    this.message = message;
	  }
	  InvalidCharacterError.prototype = new Error;
	  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  object.btoa || (
	  object.btoa = function (input) {
	    var str = String(input);
	    for (
	      // initialize result and counter
	      var block, charCode, idx = 0, map = chars, output = '';
	      // if the next str index does not exist:
	      //   change the mapping table to "="
	      //   check if d has no fractional digits
	      str.charAt(idx | 0) || (map = '=', idx % 1);
	      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	    ) {
	      charCode = str.charCodeAt(idx += 3/4);
	      if (charCode > 0xFF) {
	        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
	      }
	      block = block << 8 | charCode;
	    }
	    return output;
	  });

	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  object.atob || (
	  object.atob = function (input) {
	    var str = String(input).replace(/=+$/, '');
	    if (str.length % 4 == 1) {
	      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	      // initialize result and counters
	      var bc = 0, bs, buffer, idx = 0, output = '';
	      // get next character
	      buffer = str.charAt(idx++);
	      // character found in table? initialize bit storage and add its ascii value;
	      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	        // and if not first of each 4 characters,
	        // convert the first 8 bits to one ascii character
	        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	    ) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  });

	}());


/***/ },
/* 21 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(9).Promise;

	Promise.prototype.catch = function(onRejected) {
	  return this.then(null, onRejected);
	};

	module.exports = Promise;


/***/ },
/* 23 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 24 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(3);
	var jwt = __webpack_require__(26);
	var url = __webpack_require__(27);
	var qs = __webpack_require__(28);
	var qc = __webpack_require__(29);
	var utils = __webpack_require__(16);
	var errors = __webpack_require__(15);
	var isNodeEnv = typeof window === 'undefined';
	var stream = __webpack_require__(11);

	var signing = signing || __webpack_require__(17);

	console.log('node is set to', isNodeEnv);

	function propertyHeaderJSON(jwt) {
	  var json = signing.isJWTSignature(jwt);
	  return json !== undefined;
	}

	function arbJSON(depth) {
	  var width = Math.floor(Math.random() * (10 - 1) + 1);

	  var result = {};

	  while(width--) {
	    var value = qc.arbString(),
	        maxDepth = Math.floor(Math.random() * (3 - 1) + 1);

	    if(depth) {
	      value = arbJSON(depth-1);
	    } else if(depth === undefined) {
	      value = arbJSON(maxDepth);
	    }

	    result[ qc.arbString() ] = value;
	  }

	  return result;
	}

	function arbNonEmptyString() {
	  var str = qc.arbString();

	  return str === '' ? arbNonEmptyString() : str;
	}

	function arbJWT() {
	  return jwt.sign( arbJSON(), arbNonEmptyString(), arbJSON() );
	}

	describe('Json web token validation', function() {
	  var validSignature = "feedname eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG5Eb2UiLCJhY3Rpb24iOiJyZWFkIn0.dfayorXXS1rAyd97BGCNgrCodPH9X3P80DPMH5b9D_A";
	  var invalidSignature = "feedname eyJhbGiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZS.dfayorXXS1rAyd97BGCNgrCodH38PH5b9D_A";

	  it('should validate valid jwts', function() {
	    expect( signing.isJWTSignature(validSignature) ).to.be(true);
	  });

	  it('should validate unvalid jwts', function() {
	    expect( signing.isJWTSignature(invalidSignature) ).to.be(false);
	  });

	  if(isNodeEnv) {
	    it('should decode valid jwts headers', function() {
	      expect( qc.forAll( propertyHeaderJSON, arbJWT ) ).to.be(true);
	    });
	  }
	});

	describe('Utility functions', function() {
	  it('should validate feed id\'s', function() {
	    expect(utils.validateFeedId('flat:0')).to.be.ok();
	  });

	  it('should throw exception while validating faulty feed id',function() {
	    expect(function() {
	      utils.validateFeedId('b134u92fval')
	    }).to.throwError(function(e) {
	      expect(e).to.be.a(errors.FeedError);
	    });
	  });
	});

	if (isNodeEnv) {
	  describe('Stream Client', function() {
	    var client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');

	    it('should create email redirects', function() {
	      var expectedParts = ['https://analytics.getstream.io/analytics/redirect/',
	        'auth_type=jwt',
	        'url=http%3A%2F%2Fgoogle.com%2F%3Fa%3Db%26c%3Dd',
	        'events=%5B%7B%22foreign_ids%22%3A%5B%22tweet%3A1%22%2C%22tweet%3A2%22%2C%22tweet%3A3%22%2C%22tweet%3A4%22%2C%22tweet%3A5%22%5D%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%2C%7B%22foreign_id%22%3A%22tweet%3A1%22%2C%22label%22%3A%22click%22%2C%22position%22%3A3%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%5D',
	        'api_key=ahj2ndz7gsan',
	      ];
	      var engagement = { 'foreign_id': 'tweet:1', 'label': 'click', 'position': 3, 'user_id': 'tommaso', 'location': 'email', 'feed_id': 'user:global' },
	          impression = {'foreign_ids': ['tweet:1', 'tweet:2', 'tweet:3', 'tweet:4', 'tweet:5'], 'user_id': 'tommaso', 'location': 'email', 'feed_id': 'user:global'},
	          events = [impression, engagement],
	          userId = 'tommaso',
	          targetUrl = 'http://google.com/?a=b&c=d';
	      var redirectUrl = client.createRedirectUrl(targetUrl, userId, events);

	      var queryString = qs.parse(url.parse(redirectUrl).query);
	      var decoded = jwt.verify(queryString.authorization, 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');

	      expect(decoded).to.eql({
	        'resource': 'redirect_and_track',
	        'action': '*',
	        'user_id': userId,
	      });

	      for (var i = 0; i < expectedParts.length; i++) {
	        expect(redirectUrl).to.contain(expectedParts[i]);
	      }
	    });

	    it('should fail creating email redirects on invalid targets', function() {
	      expect(function() {
	        client.createRedirectUrl('google.com', 'tommaso', []);
	      }).to.throwException(errors.MissingSchemaError);
	    });

	  });
	}


/***/ },
/* 26 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 27 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 28 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 29 */
/***/ function(module, exports) {

	function arbBool() {
	  return Math.random() > 0.5 ? true : false;
	}

	exports.arbBool = arbBool;

	function arbDouble() {
	  var sign = Math.random() > 0.5 ? 1 : -1;
	  return sign * Math.random() * Number.MAX_VALUE;
	}

	exports.arbDouble = arbDouble;

	function arbInt() {
	  var sign = Math.random() > 0.5 ? 1 : -1;
	  return sign * Math.floor(Math.random() * Number.MAX_VALUE);
	}

	exports.arbInt = arbInt;

	function arbByte() {
	  return Math.floor(Math.random() * 256);
	}

	exports.arbByte = arbByte;

	function arbChar() {
	  return String.fromCharCode(arbByte());
	}

	exports.arbChar = arbChar;

	function arbArray(generator) {
	  var
	  len = Math.floor(Math.random() * 100),
	  array = [],
	  i;

	  for (i = 0; i < len; i++) {
	    array.push(generator());
	  }

	  return array;
	}

	exports.arbArray = arbArray;

	function arbString() {
	  return arbArray(arbChar).join("");
	}

	exports.arbString = arbString;

	function forAll(property) {
	  var
	  generators = Array.prototype.slice.call(arguments, 1),
	  fn = function (f) { return f(); },
	  i,
	  values;

	  for (i = 0; i < 100; i ++) {
	    values = generators.map(fn);

	    if (!property.apply(null, values)) {
	      return values;
	    }
	  }

	  return true;
	}

	exports.forAll = forAll;


/***/ }
/******/ ]);