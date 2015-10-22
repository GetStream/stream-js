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
	var unitTests = __webpack_require__(89);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var expect = __webpack_require__(3);
	var Faye = __webpack_require__(9);
	var node = typeof(stream) == 'undefined';

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
	  if (typeof(process) != "undefined" && process.env.LOCAL) {
	    // local testing is slow as we run celery tasks in sync
	    this.timeout(25000);
	    this.localRun = true;
	  }
	  if (typeof(document) != "undefined" && document.location.href.indexOf('local=1') != -1) {
	    // local testing via the browser
	    this.timeout(25000);
	    this.localRun = true;
	  }
	  if (node) {
	    // we arent in a browser
	    stream = __webpack_require__(11);
	  }
	  console.log('node is set to ', node);
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
	  
	  var before = (node) ? beforeEachNode : beforeEachBrowser;

	  beforeEach(before);
	  
	  it('heroku', function (done) {
	    if (!node) {
	      done();
	    }
	    var url = 'https://thierry:pass@getstream.io/?app_id=1';
	    process.env.STREAM_URL = url;
	    client = stream.connect();
	    expect(client.apiKey).to.eql('thierry');
	    expect(client.apiSecret).to.eql('pass');
	    expect(client.appId).to.eql('1');
	    done();
	  });
	  
	  it('heroku legacy', function (done) {
	    if (!node) {
	      done();
	    }
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
	    if (!node) {
	      done();
	    }
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
	    if (!node) {
	      done();
	    }
	    var url = 'https://thierry:pass@getstream.io/?app_id=1';
	    process.env.STREAM_URL = url;
	    client = stream.connect('a','b','c');
	    expect(client.apiKey).to.eql('a');
	    expect(client.apiSecret).to.eql('b');
	    expect(client.appId).to.eql('c');
	    done();
	  });
	  
	  it('location support', function (done) {
	    if (!node) {
	      done();
	    }
	    var options = {};
	    var location = 'us-east';
	    var fullLocation = 'https://us-east-api.getstream.io/api/';
	    options.location = location;
	    client = stream.connect('a','b','c', options);
	    expect(client.baseUrl).to.eql(fullLocation);
	    expect(client.location).to.eql(location);
	    done();
	  });

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
	    if (node) {
	      var userAgent = response.req._headers['user-agent'];
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
	    if (!node) activity['to'] = ['flat:33' + ' ' + flat3.token];
	    
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
	    this.timeout(6000);
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
	    setTimeout(check, 1000);
	     }
	    add();
	  });
	  
	  it('follow without callback', function (done) {
	    aggregated2.follow('user', '111');
	    done();
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
	      }, 1000);
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
	  
	  it('follow private', function (done) {
	    function callback(error, response, body){
	      expect(error).to.eql(null);
	      expect(body.exception).to.eql(undefined);
	      done();
	   };
	   if (node) {
	    user1.follow('secret', '33', callback);
	   } else {
	    user1.follow('secret', '33', secret3.token, callback);
	   }
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
	    var subscription = user1ReadOnly.subscribe(function callback() {
	      done();
	    });
	    subscription.then(function() {
	      done();
	   });
	  });

	  it('fayeSubscribeScopeTampered', function (done) {
	    this.timeout(6000);
	    var client = user1ReadOnly.getFayeClient();
	    var subscription = user1ReadOnly.subscribe(function callback() {
	      done();
	    });
	    subscription.then(function() {
	      done();
	   });
	  });

	  it('fayeSubscribeError', function (done) {
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

	/* WEBPACK VAR INJECTION */(function(process) {
	//     GetStream client library for node and the browser
	//     Author: Thierry Schellenbach
	//     BSD License

	var StreamClient = __webpack_require__(12);
	var errors = __webpack_require__(15);
	var request = __webpack_require__(13);

	function connect(apiKey, apiSecret, appId, options) {
		/*
		 * Usage
		 * stream.connect(apiKey, apiSecret)
		 * or if you want to be able to subscribe and listen
		 * for changes
		 * stream.connect(apiKey, apiSecret, appId)
		 * or on heroku
		 * stream.connect(streamURL)
		 * where streamURL looks like this
		 * https://thierry:pass@getstream.io/?app=1
		 * 
		 */
		if (typeof(process) != "undefined" && process.env.STREAM_URL && !apiKey) {
			var parts = /https\:\/\/(\w+)\:(\w+)\@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL);
			apiKey = parts[1];
			apiSecret = parts[2];
			var location = parts[3];
			appId = parts[4];
			if (options === undefined) {
				options = {};
			}
			if (location != 'getstream') {
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
	var crypto = __webpack_require__(18);
	var utils = __webpack_require__(16);

	var StreamClient = function() {
	    this.initialize.apply(this, arguments);
	};

	StreamClient.prototype = {
	    baseUrl: 'https://api.getstream.io/api/',

	    initialize: function(apiKey, apiSecret, appId, options) {
	        /*
	         * initialize is not directly called by via stream.connect, ie:
	         * stream.connect(apiKey, apiSecret)
	         * secret is optional and only used in server side mode
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
	        // which data center to use
	        this.location = this.options.location;
	        if (this.location) {
	        	this.baseUrl = 'https://' + this.location + '-api.getstream.io/api/';
	        }
	        if (typeof(process) != "undefined" && process.env.LOCAL) {
	            this.baseUrl = 'http://localhost:8000/api/';
	        }
	        if (typeof(process) != "undefined" && process.env.LOCAL_FAYE) {
	            this.fayeUrl = 'http://localhost:9999/faye/';
	        }
	        this.handlers = {};
	        this.browser = typeof(window) != 'undefined';
	        this.node = !this.browser;

	        if (this.browser && this.apiSecret) {
	            throw new errors.FeedError('You are publicly sharing your private key. Dont use the private key while in the browser.');
	        }
	    },

	    on: function(event, callback) {
	        /*
	         * Support for global event callbacks
	         * This is useful for generic error and loading handling
	         *
	         * client.on('request', callback);
	         * client.on('response', callback);
	         *
	         */
	        this.handlers[event] = callback;
	    },

	    off: function(key) {
	        /*
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
	        /*
	         * Call the given handler with the arguments
	         */
	        var args = Array.prototype.slice.call(arguments);
	        var key = args[0];
	        args = args.slice(1);
	        if (this.handlers[key]) {
	            this.handlers[key].apply(this, args);
	        }
	    },

	    wrapCallback: function(cb) {
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
	        var description = (this.node) ? 'node' : 'browser';
	        // TODO: get the version here in a way which works in both and browserify
	        var version = 'unknown';
	        return 'stream-javascript-client-' + description + '-' + version;
	    },

	    getReadOnlyToken: function(feedSlug, userId) {
	        /*
	         * Returns a token that allows only read operations
	         *
	         * client.getReadOnlyToken('user', '1');
	         */
	         var feedId = '' + feedSlug + userId;
	         return signing.JWTScopeToken(this.apiSecret, feedId, '*', 'read');
	    },

	    getReadWriteToken: function(feedSlug, userId) {
	        /*
	         * Returns a token that allows read and write operations
	         *
	         * client.getReadWriteToken('user', '1');
	         */
	         var feedId = '' + feedSlug + userId;
	         return signing.JWTScopeToken(this.apiSecret, feedId, '*', '*');
	    },

	    feed: function(feedSlug, userId, token, siteId, options) {
	        /*
	         * Returns a feed object for the given feed id and token
	         * Example:
	         *
	         * client.feed('user', '1', 'token2');
	         */

	        options = options || {};

	        if (!feedSlug || !userId) {
	            throw new errors.FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
	        }
	        
	        if (feedSlug.indexOf(':') != -1) {
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
	        /*
	         * Combines the base url with version and the relative url
	         */
	        var url = this.baseUrl + this.version + '/' + relativeUrl;
	        return url;
	    },

	    enrichKwargs: function(kwargs) {
	        /*
	         * Adds the API key and the signature
	         */
	        kwargs.url = this.enrichUrl(kwargs.url);
	        if (kwargs.qs === undefined) {
	            kwargs.qs = {};
	        }
	        kwargs.qs.api_key = this.apiKey;
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
	        return this.signActivities([activity])[0];
	    },

	    signActivities: function(activities) {
	        /*
	         * We automatically sign the to parameter when in server side mode
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

	    getFayeAuthorization : function() {
	      var apiKey = this.apiKey,
	          self = this;
	      return {
	        incoming : function(message, callback) {
	          callback(message);
	        },
	        outgoing : function(message, callback) {
	          if( message.subscription && self.subscriptions[message.subscription] ) {
	            var subscription = self.subscriptions[message.subscription];

	            message.ext = {
	              'user_id' : subscription.userId,
	              'api_key' : apiKey,
	              'signature' : subscription.token 
	            };
	          }
	          callback(message);
	        }
	      };
	    },

	    getFayeClient : function() {
	      var Faye = __webpack_require__(9);
	      if (this.fayeClient === null) {
	        this.fayeClient = new Faye.Client(this.fayeUrl);
	        var authExtension = this.getFayeAuthorization();
	        this.fayeClient.addExtension(authExtension);
	      }
	      return this.fayeClient;
	    },

	    /*
	     * Shortcuts for post, get and delete HTTP methods
	     *
	     */

	    get: function(kwargs, cb) {
	        this.send('request', 'get', kwargs, cb);
	        kwargs = this.enrichKwargs(kwargs);
	        kwargs.method = 'GET';
	        var callback = this.wrapCallback(cb);
	        return request(kwargs, callback);
	    },
	    post: function(kwargs, cb) {
	        this.send('request', 'post', kwargs, cb);
	        kwargs = this.enrichKwargs(kwargs);
	        kwargs.method = 'POST';
	        var callback = this.wrapCallback(cb);
	        return request(kwargs, callback);
	    },
	    delete: function(kwargs, cb) {
	        this.send('request', 'delete', kwargs, cb);
	        kwargs = this.enrichKwargs(kwargs);
	        kwargs.method = 'DELETE';
	        var callback = this.wrapCallback(cb);
	        return request(kwargs, callback);
	    }
	};

	module.exports = StreamClient;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Browser Request
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

	// UMD HEADER START 
	(function (root, factory) {
	    if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like enviroments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    } else {
	        // Browser globals (root is window)
	        root.returnExports = factory();
	  }
	}(this, function () {
	// UMD HEADER END

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
	  xhr.send(options.body)
	  return xhr

	  function on_state_change(event) {
	    if(timed_out)
	      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

	    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

	    if(xhr.readyState === XHR.OPENED) {
	      request.log.debug('Request started', {'id':xhr.id})
	      for (var key in options.headers)
	        xhr.setRequestHeader(key, options.headers[key])
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
	    return request;
	//UMD FOOTER START
	}));
	//UMD FOOTER END


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(15);
	var utils = __webpack_require__(16);

	var StreamFeed = function() {
		this.initialize.apply(this, arguments);
	};

	StreamFeed.prototype = {
		/*
		 * The feed object contains convenience functions such add activity
		 * remove activity etc
		 *
		 */
		initialize : function(client, feedSlug, userId, token, siteId) {
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
		addActivity : function(activity, callback) {
			/*
			 * Adds the given activity to the feed and
			 * calls the specified callback
			 */
			activity = this.client.signActivity(activity);
			var xhr = this.client.post({
				'url' : 'feed/' + this.feedUrl + '/',
				'body' : activity,
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		removeActivity : function(activityId, callback) {
			/*
			 * Removes the activity by activityId
			 * feed.removeActivity(activityId);
			 * Or
			 * feed.removeActivity({'foreign_id': foreignId});
			 */
			var identifier = (activityId.foreignId) ? activityId.foreignId : activityId;
			var params = {};
			if (activityId.foreignId) {
				params.foreign_id = '1';
			}
			var xhr = this.client.delete( {
				'url' : 'feed/' + this.feedUrl + '/' + identifier + '/',
				'qs' : params,
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		addActivities : function(activities, callback) {
			/*
			 * Adds the given activities to the feed and
			 * calls the specified callback
			 */
			activities = this.client.signActivities(activities);
			var data = {
				activities : activities
			};
			var xhr = this.client.post({
				'url' : 'feed/' + this.feedUrl + '/',
				'body' : data,
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		follow : function(targetSlug, targetUserId, callbackOrToken, callback) {
			/*
			 * feed.follow('user', '1');
			 * or
			 * feed.follow('user', '1', 'token');
			 * or
			 * feed.follow('user', '1', callback);
			 */
			utils.validateFeedSlug(targetSlug);
			utils.validateUserId(targetUserId);
			var targetToken;
			var last = arguments[arguments.length - 1];
			// callback is always the last argument
			callback = (last.call) ? last : undefined;
			var target = targetSlug + ':' + targetUserId;
			// token is 3rd or 4th
			if (arguments[2] && !arguments[2].call) {
				targetToken = arguments[2];
			} else if (arguments[3] && !arguments[3].call) {
				targetToken = arguments[3];
			}

			// if have a secret, always just generate and send along the token
			if (this.client.apiSecret && !targetToken) {
				targetToken = this.client.feed(targetSlug, targetUserId).token;
			}
			var xhr = this.client.post({
				'url' : 'feed/' + this.feedUrl + '/following/',
				'body' : {
					'target' : target,
					'target_token' : targetToken
				},
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		unfollow : function(targetSlug, targetUserId, callback) {
			/*
			 * Unfollow the given feed, ie:
			 * feed.unfollow('user', '2', callback);
			 */
			utils.validateFeedSlug(targetSlug);
			utils.validateUserId(targetUserId);
			var targetFeedId = targetSlug + ':' + targetUserId;
			var xhr = this.client.delete( {
				'url' : 'feed/' + this.feedUrl + '/following/' + targetFeedId + '/',
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		following : function(options, callback) {
			/*
			 * List which feeds this feed is following
			 * 
			 * feed.following({limit:10, filter: ['user:1', 'user:2']}, callback);
			 */
			if (options !== undefined && options.filter) {
				options.filter = options.filter.join(',');
			}
			var xhr = this.client.get({
				'url' : 'feed/' + this.feedUrl + '/following/',
				'qs' : options,
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		followers : function(options, callback) {
			/*
			 * List the followers of this feed
			 * 
			 * feed.followers({limit:10, filter: ['user:1', 'user:2']}, callback);
			 */
			if (options !== undefined && options.filter) {
				options.filter = options.filter.join(',');
			}
			var xhr = this.client.get({
				'url' : 'feed/' + this.feedUrl + '/followers/',
				'qs' : options,
				'signature' : this.signature
			}, callback);
			return xhr;
		},
		get : function(options, callback) {
			/*
			 * Reads the feed
			 * 
			 * feed.get({limit: 10, id_lte: 'activity-id'})
			 * or
			 * feed.get({limit: 10, mark_seen: true})
			 */
			if (options && options.mark_read && options.mark_read.join) {
				options.mark_read = options.mark_read.join(',');
			}
			if (options && options.mark_seen && options.mark_seen.join) {
				options.mark_seen = options.mark_seen.join(',');
			}

			var xhr = this.client.get({
				'url' : 'feed/' + this.feedUrl + '/',
				'qs' : options,
				'signature' : this.signature
			}, callback);
			return xhr;
		},

	  getFayeClient : function() {
	    return this.client.getFayeClient();
	  },

		subscribe : function(callback) {
			/*
			 * subscribes to any changes in the feed, return a promise
			 * feed.subscribe(callback).then(function(){
			 * 		console.log('we are now listening to changes');
			 * });
			 */
			if (!this.client.appId) {
				throw new errors.SiteError('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
			}

	    this.client.subscriptions['/' + this.notificationChannel] = {
	      'token': this.token,
	      'userId': this.notificationChannel 
	    };

			return this.getFayeClient().subscribe('/' + this.notificationChannel, callback);
		}
	};

	module.exports = StreamFeed; 


/***/ },
/* 15 */
/***/ function(module, exports) {

	var errors = module.exports;

	var canCapture = ( typeof Error.captureStackTrace === 'function');
	var canStack = !!(new Error()).stack;

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
	 * @param {String} [msg] - An error message that will probably end up in a log.
	 */
	errors.FeedError = function FeedError(msg) {
		ErrorAbstract.call(this, msg);
	};
	errors.FeedError.prototype = new ErrorAbstract();

	errors.SiteError = function SiteError(msg) {
		ErrorAbstract.call(this, msg);
	};
	errors.SiteError.prototype = new ErrorAbstract();



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
		if (parts.length != 2) {
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



/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var crypto = __webpack_require__(18);
	var jwt = __webpack_require__(36);
	var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
	var Base64 = __webpack_require__(88);

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
	  } catch(e) {
	    if(e.name === 'InvalidCharacterError') {
	      return undefined;
	    } else {
	      throw e;
	    }
	  } 
	}

	function safeJsonParse(thing) {
	  if (typeof(thing) === "object") return thing;
	  try {
	    return JSON.parse(thing);
	  } catch (e) {
	    return undefined;
	  }
	}

	function padString(string) {
	    var segmentLength = 4;
	    var stringLength = string.length;
	    var diff = string.length % segmentLength;
	    if (!diff)
	        return string;
	    var position = stringLength;
	    var padLength = segmentLength - diff;
	    var paddedStringLength = stringLength + padLength;

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

	exports.JWTScopeToken = function(apiSecret, feedId, resource, action) {
	    /*
	     * Creates the JWT token for feedId, resource and action using the apiSecret
	     */
	    var payload = {feed_id:feedId, resource:resource, action:action};
	    var token = jwt.sign(payload, apiSecret, {algorithm: 'HS256'});
	    return token;
	};

	exports.isJWTSignature = function(signature) {
	    /*
	     * check if token is a valid JWT token
	     */
	    var token = signature.split(' ')[1];
	    return JWS_REGEX.test(token) && !!headerFromJWS(token);
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var rng = __webpack_require__(19)

	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}

	exports.createHash = __webpack_require__(21)

	exports.createHmac = __webpack_require__(33)

	exports.randomBytes = function(size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)))
	    } catch (err) { callback(err) }
	  } else {
	    return new Buffer(rng(size))
	  }
	}

	function each(a, f) {
	  for(var i in a)
	    f(a[i], i)
	}

	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160']
	}

	var p = __webpack_require__(34)(exports)
	exports.pbkdf2 = p.pbkdf2
	exports.pbkdf2Sync = p.pbkdf2Sync


	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials'
	, 'createCipher'
	, 'createCipheriv'
	, 'createDecipher'
	, 'createDecipheriv'
	, 'createSign'
	, 'createVerify'
	, 'createDiffieHellman'
	], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet')
	  }
	})

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {(function() {
	  var g = ('undefined' === typeof window ? global : window) || {}
	  _crypto = (
	    g.crypto || g.msCrypto || __webpack_require__(20)
	  )
	  module.exports = function(size) {
	    // Modern Browsers
	    if(_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */
	    
	      _crypto.getRandomValues(bytes);
	      return bytes;
	    }
	    else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size)
	    }
	    else
	      throw new Error(
	        'secure random number generation not supported by this browser\n'+
	        'use chrome, FireFox or Internet Explorer 11'
	      )
	  }
	}())

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5).Buffer))

/***/ },
/* 20 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(22)

	var md5 = toConstructor(__webpack_require__(30))
	var rmd160 = toConstructor(__webpack_require__(32))

	function toConstructor (fn) {
	  return function () {
	    var buffers = []
	    var m= {
	      update: function (data, enc) {
	        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
	        buffers.push(data)
	        return this
	      },
	      digest: function (enc) {
	        var buf = Buffer.concat(buffers)
	        var r = fn(buf)
	        buffers = null
	        return enc ? r.toString(enc) : r
	      }
	    }
	    return m
	  }
	}

	module.exports = function (alg) {
	  if('md5' === alg) return new md5()
	  if('rmd160' === alg) return new rmd160()
	  return createHash(alg)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var exports = module.exports = function (alg) {
	  var Alg = exports[alg]
	  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
	  return new Alg()
	}

	var Buffer = __webpack_require__(5).Buffer
	var Hash   = __webpack_require__(23)(Buffer)

	exports.sha1 = __webpack_require__(24)(Buffer, Hash)
	exports.sha256 = __webpack_require__(28)(Buffer, Hash)
	exports.sha512 = __webpack_require__(29)(Buffer, Hash)


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function (Buffer) {

	  //prototype class for hash functions
	  function Hash (blockSize, finalSize) {
	    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize
	    this._blockSize = blockSize
	    this._len = 0
	    this._s = 0
	  }

	  Hash.prototype.init = function () {
	    this._s = 0
	    this._len = 0
	  }

	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8"
	      data = new Buffer(data, enc)
	    }

	    var l = this._len += data.length
	    var s = this._s = (this._s || 0)
	    var f = 0
	    var buffer = this._block

	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
	      var ch = (t - f)

	      for (var i = 0; i < ch; i++) {
	        buffer[(s % this._blockSize) + i] = data[i + f]
	      }

	      s += ch
	      f += ch

	      if ((s % this._blockSize) === 0) {
	        this._update(buffer)
	      }
	    }
	    this._s = s

	    return this
	  }

	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8

	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80

	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1)

	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block)
	      this._block.fill(0)
	    }

	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4)

	    var hash = this._update(this._block) || this._hash()

	    return enc ? hash.toString(enc) : hash
	  }

	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass')
	  }

	  return Hash
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	var inherits = __webpack_require__(25).inherits

	module.exports = function (Buffer, Hash) {

	  var A = 0|0
	  var B = 4|0
	  var C = 8|0
	  var D = 12|0
	  var E = 16|0

	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80)

	  var POOL = []

	  function Sha1 () {
	    if(POOL.length)
	      return POOL.pop().init()

	    if(!(this instanceof Sha1)) return new Sha1()
	    this._w = W
	    Hash.call(this, 16*4, 14*4)

	    this._h = null
	    this.init()
	  }

	  inherits(Sha1, Hash)

	  Sha1.prototype.init = function () {
	    this._a = 0x67452301
	    this._b = 0xefcdab89
	    this._c = 0x98badcfe
	    this._d = 0x10325476
	    this._e = 0xc3d2e1f0

	    Hash.prototype.init.call(this)
	    return this
	  }

	  Sha1.prototype._POOL = POOL
	  Sha1.prototype._update = function (X) {

	    var a, b, c, d, e, _a, _b, _c, _d, _e

	    a = _a = this._a
	    b = _b = this._b
	    c = _c = this._c
	    d = _d = this._d
	    e = _e = this._e

	    var w = this._w

	    for(var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j*4)
	        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

	      var t = add(
	        add(rol(a, 5), sha1_ft(j, b, c, d)),
	        add(add(e, W), sha1_kt(j))
	      )

	      e = d
	      d = c
	      c = rol(b, 30)
	      b = a
	      a = t
	    }

	    this._a = add(a, _a)
	    this._b = add(b, _b)
	    this._c = add(c, _c)
	    this._d = add(d, _d)
	    this._e = add(e, _e)
	  }

	  Sha1.prototype._hash = function () {
	    if(POOL.length < 100) POOL.push(this)
	    var H = new Buffer(20)
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a|0, A)
	    H.writeInt32BE(this._b|0, B)
	    H.writeInt32BE(this._c|0, C)
	    H.writeInt32BE(this._d|0, D)
	    H.writeInt32BE(this._e|0, E)
	    return H
	  }

	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if(t < 20) return (b & c) | ((~b) & d);
	    if(t < 40) return b ^ c ^ d;
	    if(t < 60) return (b & c) | (b & d) | (c & d);
	    return b ^ c ^ d;
	  }

	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	           (t < 60) ? -1894007588 : -899497514;
	  }

	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return (x + y ) | 0
	  //lets see how this goes on testling.
	  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  //  return (msw << 16) | (lsw & 0xFFFF);
	  }

	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt));
	  }

	  return Sha1
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(26);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(27);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */

	var inherits = __webpack_require__(25).inherits

	module.exports = function (Buffer, Hash) {

	  var K = [
	      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	    ]

	  var W = new Array(64)

	  function Sha256() {
	    this.init()

	    this._w = W //new Array(64)

	    Hash.call(this, 16*4, 14*4)
	  }

	  inherits(Sha256, Hash)

	  Sha256.prototype.init = function () {

	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0

	    this._len = this._s = 0

	    return this
	  }

	  function S (X, n) {
	    return (X >>> n) | (X << (32 - n));
	  }

	  function R (X, n) {
	    return (X >>> n);
	  }

	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }

	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }

	  function Sigma0256 (x) {
	    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	  }

	  function Sigma1256 (x) {
	    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	  }

	  function Gamma0256 (x) {
	    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	  }

	  function Gamma1256 (x) {
	    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	  }

	  Sha256.prototype._update = function(M) {

	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var T1, T2

	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0

	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16
	        ? M.readInt32BE(j * 4)
	        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]

	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w

	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
	    }

	    this._a = (a + this._a) | 0
	    this._b = (b + this._b) | 0
	    this._c = (c + this._c) | 0
	    this._d = (d + this._d) | 0
	    this._e = (e + this._e) | 0
	    this._f = (f + this._f) | 0
	    this._g = (g + this._g) | 0
	    this._h = (h + this._h) | 0

	  };

	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32)

	    H.writeInt32BE(this._a,  0)
	    H.writeInt32BE(this._b,  4)
	    H.writeInt32BE(this._c,  8)
	    H.writeInt32BE(this._d, 12)
	    H.writeInt32BE(this._e, 16)
	    H.writeInt32BE(this._f, 20)
	    H.writeInt32BE(this._g, 24)
	    H.writeInt32BE(this._h, 28)

	    return H
	  }

	  return Sha256

	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(25).inherits

	module.exports = function (Buffer, Hash) {
	  var K = [
	    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	  ]

	  var W = new Array(160)

	  function Sha512() {
	    this.init()
	    this._w = W

	    Hash.call(this, 128, 112)
	  }

	  inherits(Sha512, Hash)

	  Sha512.prototype.init = function () {

	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0

	    this._al = 0xf3bcc908|0
	    this._bl = 0x84caa73b|0
	    this._cl = 0xfe94f82b|0
	    this._dl = 0x5f1d36f1|0
	    this._el = 0xade682d1|0
	    this._fl = 0x2b3e6c1f|0
	    this._gl = 0xfb41bd6b|0
	    this._hl = 0x137e2179|0

	    this._len = this._s = 0

	    return this
	  }

	  function S (X, Xl, n) {
	    return (X >>> n) | (Xl << (32 - n))
	  }

	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }

	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }

	  Sha512.prototype._update = function(M) {

	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var al, bl, cl, dl, el, fl, gl, hl

	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0

	    al = this._al | 0
	    bl = this._bl | 0
	    cl = this._cl | 0
	    dl = this._dl | 0
	    el = this._el | 0
	    fl = this._fl | 0
	    gl = this._gl | 0
	    hl = this._hl | 0

	    for (var i = 0; i < 80; i++) {
	      var j = i * 2

	      var Wi, Wil

	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4)
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4)

	      } else {
	        var x  = W[j - 15*2]
	        var xl = W[j - 15*2 + 1]
	        var gamma0  = S(x, xl, 1) ^ S(x, xl, 8) ^ (x >>> 7)
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7)

	        x  = W[j - 2*2]
	        xl = W[j - 2*2 + 1]
	        var gamma1  = S(x, xl, 19) ^ S(xl, x, 29) ^ (x >>> 6)
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6)

	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7  = W[j - 7*2]
	        var Wi7l = W[j - 7*2 + 1]

	        var Wi16  = W[j - 16*2]
	        var Wi16l = W[j - 16*2 + 1]

	        Wil = gamma0l + Wi7l
	        Wi  = gamma0  + Wi7 + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0)
	        Wil = Wil + gamma1l
	        Wi  = Wi  + gamma1  + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0)
	        Wil = Wil + Wi16l
	        Wi  = Wi  + Wi16 + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0)

	        W[j] = Wi
	        W[j + 1] = Wil
	      }

	      var maj = Maj(a, b, c)
	      var majl = Maj(al, bl, cl)

	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7)
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7)
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9)
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9)

	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j]
	      var Kil = K[j + 1]

	      var ch = Ch(e, f, g)
	      var chl = Ch(el, fl, gl)

	      var t1l = hl + sigma1l
	      var t1 = h + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0)
	      t1l = t1l + chl
	      t1 = t1 + ch + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0)
	      t1l = t1l + Kil
	      t1 = t1 + Ki + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0)
	      t1l = t1l + Wil
	      t1 = t1 + Wi + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0)

	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl
	      var t2 = sigma0h + maj + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0)

	      h  = g
	      hl = gl
	      g  = f
	      gl = fl
	      f  = e
	      fl = el
	      el = (dl + t1l) | 0
	      e  = (d + t1 + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	      d  = c
	      dl = cl
	      c  = b
	      cl = bl
	      b  = a
	      bl = al
	      al = (t1l + t2l) | 0
	      a  = (t1 + t2 + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0
	    }

	    this._al = (this._al + al) | 0
	    this._bl = (this._bl + bl) | 0
	    this._cl = (this._cl + cl) | 0
	    this._dl = (this._dl + dl) | 0
	    this._el = (this._el + el) | 0
	    this._fl = (this._fl + fl) | 0
	    this._gl = (this._gl + gl) | 0
	    this._hl = (this._hl + hl) | 0

	    this._a = (this._a + a + ((this._al >>> 0) < (al >>> 0) ? 1 : 0)) | 0
	    this._b = (this._b + b + ((this._bl >>> 0) < (bl >>> 0) ? 1 : 0)) | 0
	    this._c = (this._c + c + ((this._cl >>> 0) < (cl >>> 0) ? 1 : 0)) | 0
	    this._d = (this._d + d + ((this._dl >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	    this._e = (this._e + e + ((this._el >>> 0) < (el >>> 0) ? 1 : 0)) | 0
	    this._f = (this._f + f + ((this._fl >>> 0) < (fl >>> 0) ? 1 : 0)) | 0
	    this._g = (this._g + g + ((this._gl >>> 0) < (gl >>> 0) ? 1 : 0)) | 0
	    this._h = (this._h + h + ((this._hl >>> 0) < (hl >>> 0) ? 1 : 0)) | 0
	  }

	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64)

	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset)
	      H.writeInt32BE(l, offset + 4)
	    }

	    writeInt64BE(this._a, this._al, 0)
	    writeInt64BE(this._b, this._bl, 8)
	    writeInt64BE(this._c, this._cl, 16)
	    writeInt64BE(this._d, this._dl, 24)
	    writeInt64BE(this._e, this._el, 32)
	    writeInt64BE(this._f, this._fl, 40)
	    writeInt64BE(this._g, this._gl, 48)
	    writeInt64BE(this._h, this._hl, 56)

	    return H
	  }

	  return Sha512

	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	var helpers = __webpack_require__(31);

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << ((len) % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;

	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;

	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;

	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);

	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}

	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var intSize = 4;
	var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
	var chrsz = 8;

	function toArray(buf, bigEndian) {
	  if ((buf.length % intSize) !== 0) {
	    var len = buf.length + (intSize - (buf.length % intSize));
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }

	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}

	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}

	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}

	module.exports = { hash: hash };

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	module.exports = ripemd160



	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	// Constants table
	var zl = [
	    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
	var zr = [
	    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
	var sl = [
	     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
	var sr = [
	    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

	var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

	var bytesToWords = function (bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << (24 - b % 32);
	  }
	  return words;
	};

	var wordsToBytes = function (words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	  }
	  return bytes;
	};

	var processBlock = function (H, M, offset) {

	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];

	    // Swap
	    M[offset_i] = (
	        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	    );
	  }

	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;

	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = (al +  M[offset+zl[i]])|0;
	    if (i<16){
	        t +=  f1(bl,cl,dl) + hl[0];
	    } else if (i<32) {
	        t +=  f2(bl,cl,dl) + hl[1];
	    } else if (i<48) {
	        t +=  f3(bl,cl,dl) + hl[2];
	    } else if (i<64) {
	        t +=  f4(bl,cl,dl) + hl[3];
	    } else {// if (i<80) {
	        t +=  f5(bl,cl,dl) + hl[4];
	    }
	    t = t|0;
	    t =  rotl(t,sl[i]);
	    t = (t+el)|0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;

	    t = (ar + M[offset+zr[i]])|0;
	    if (i<16){
	        t +=  f5(br,cr,dr) + hr[0];
	    } else if (i<32) {
	        t +=  f4(br,cr,dr) + hr[1];
	    } else if (i<48) {
	        t +=  f3(br,cr,dr) + hr[2];
	    } else if (i<64) {
	        t +=  f2(br,cr,dr) + hr[3];
	    } else {// if (i<80) {
	        t +=  f1(br,cr,dr) + hr[4];
	    }
	    t = t|0;
	    t =  rotl(t,sr[i]) ;
	    t = (t+er)|0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t    = (H[1] + cl + dr)|0;
	  H[1] = (H[2] + dl + er)|0;
	  H[2] = (H[3] + el + ar)|0;
	  H[3] = (H[4] + al + br)|0;
	  H[4] = (H[0] + bl + cr)|0;
	  H[0] =  t;
	};

	function f1(x, y, z) {
	  return ((x) ^ (y) ^ (z));
	}

	function f2(x, y, z) {
	  return (((x)&(y)) | ((~x)&(z)));
	}

	function f3(x, y, z) {
	  return (((x) | (~(y))) ^ (z));
	}

	function f4(x, y, z) {
	  return (((x) & (z)) | ((y)&(~(z))));
	}

	function f5(x, y, z) {
	  return ((x) ^ ((y) |(~(z))));
	}

	function rotl(x,n) {
	  return (x<<n) | (x>>>(32-n));
	}

	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

	  if (typeof message == 'string')
	    message = new Buffer(message, 'utf8');

	  var m = bytesToWords(message);

	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;

	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	  );

	  for (var i=0 ; i<m.length; i += 16) {
	    processBlock(H, m, i);
	  }

	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	      // Shortcut
	    var H_i = H[i];

	    // Swap
	    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	  }

	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}



	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(21)

	var zeroBuffer = new Buffer(128)
	zeroBuffer.fill(0)

	module.exports = Hmac

	function Hmac (alg, key) {
	  if(!(this instanceof Hmac)) return new Hmac(alg, key)
	  this._opad = opad
	  this._alg = alg

	  var blocksize = (alg === 'sha512') ? 128 : 64

	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key

	  if(key.length > blocksize) {
	    key = createHash(alg).update(key).digest()
	  } else if(key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize)
	  }

	  var ipad = this._ipad = new Buffer(blocksize)
	  var opad = this._opad = new Buffer(blocksize)

	  for(var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36
	    opad[i] = key[i] ^ 0x5C
	  }

	  this._hash = createHash(alg).update(ipad)
	}

	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc)
	  return this
	}

	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest()
	  return createHash(this._alg).update(this._opad).update(h).digest(enc)
	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var pbkdf2Export = __webpack_require__(35)

	module.exports = function (crypto, exports) {
	  exports = exports || {}

	  var exported = pbkdf2Export(crypto)

	  exports.pbkdf2 = exported.pbkdf2
	  exports.pbkdf2Sync = exported.pbkdf2Sync

	  return exports
	}


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function(crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest
	      digest = undefined
	    }

	    if ('function' !== typeof callback)
	      throw new Error('No callback provided to pbkdf2')

	    setTimeout(function() {
	      var result

	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest)
	      } catch (e) {
	        return callback(e)
	      }

	      callback(undefined, result)
	    })
	  }

	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations)
	      throw new TypeError('Iterations not a number')

	    if (iterations < 0)
	      throw new TypeError('Bad iterations')

	    if ('number' !== typeof keylen)
	      throw new TypeError('Key length not a number')

	    if (keylen < 0)
	      throw new TypeError('Bad key length')

	    digest = digest || 'sha1'

	    if (!Buffer.isBuffer(password)) password = new Buffer(password)
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)

	    var hLen, l = 1, r, T
	    var DK = new Buffer(keylen)
	    var block1 = new Buffer(salt.length + 4)
	    salt.copy(block1, 0, 0, salt.length)

	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length)

	      var U = crypto.createHmac(digest, password).update(block1).digest()

	      if (!hLen) {
	        hLen = U.length
	        T = new Buffer(hLen)
	        l = Math.ceil(keylen / hLen)
	        r = keylen - (l - 1) * hLen

	        if (keylen > (Math.pow(2, 32) - 1) * hLen)
	          throw new TypeError('keylen exceeds maximum length')
	      }

	      U.copy(T, 0, 0, hLen)

	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest()

	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k]
	        }
	      }

	      var destPos = (i - 1) * hLen
	      var len = (i == l ? r : hLen)
	      T.copy(DK, destPos, 0, len)
	    }

	    return DK
	  }

	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var jws = __webpack_require__(37);
	var ms = __webpack_require__(85);

	var JWT = module.exports;

	var JsonWebTokenError = JWT.JsonWebTokenError = __webpack_require__(86);
	var TokenExpiredError = JWT.TokenExpiredError = __webpack_require__(87);
	var ms = __webpack_require__(85)

	JWT.decode = function (jwt, options) {
	  options = options || {};
	  var decoded = jws.decode(jwt, options);
	  if (!decoded) { return null; }
	  var payload = decoded.payload;

	  //try parse the payload
	  if(typeof payload === 'string') {
	    try {
	      var obj = JSON.parse(payload);
	      if(typeof obj === 'object') {
	        payload = obj;
	      }
	    } catch (e) { }
	  }

	  //return header if `complete` option is enabled.  header includes claims
	  //such as `kid` and `alg` used to select the key within a JWKS needed to
	  //verify the signature
	  if (options.complete === true) {
	    return {
	      header: decoded.header,
	      payload: payload,
	      signature: decoded.signature
	    };
	  }
	  return payload;
	};

	JWT.sign = function(payload, secretOrPrivateKey, options, callback) {
	  options = options || {};

	  var header = {};

	  if (typeof payload === 'object') {
	    header.typ = 'JWT';
	  }

	  header.alg = options.algorithm || 'HS256';

	  if (options.headers) {
	    Object.keys(options.headers).forEach(function (k) {
	      header[k] = options.headers[k];
	    });
	  }

	  var timestamp = Math.floor(Date.now() / 1000);
	  if (!options.noTimestamp) {
	    payload.iat = payload.iat || timestamp;
	  }

	  if (options.expiresInSeconds || options.expiresInMinutes) {
	    var deprecated_line;
	    try {
	      deprecated_line = /.*\((.*)\).*/.exec((new Error()).stack.split('\n')[2])[1];
	    } catch(err) {
	      deprecated_line = '';
	    }

	    console.warn('jsonwebtoken: expiresInMinutes and expiresInSeconds is deprecated. (' + deprecated_line + ')\n' +
	                 'Use "expiresIn" expressed in seconds.');

	    var expiresInSeconds = options.expiresInMinutes ?
	        options.expiresInMinutes * 60 :
	        options.expiresInSeconds;

	    payload.exp = timestamp + expiresInSeconds;
	  } else if (options.expiresIn) {
	    if (typeof options.expiresIn === 'string') {
	      var milliseconds = ms(options.expiresIn);
	      if (typeof milliseconds === 'undefined') {
	        throw new Error('bad "expiresIn" format: ' + options.expiresIn);
	      }
	      payload.exp = timestamp + milliseconds / 1000;
	    } else if (typeof options.expiresIn === 'number' ) {
	      payload.exp = timestamp + options.expiresIn;
	    } else {
	      throw new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60');
	    }
	  }

	  if (options.audience)
	    payload.aud = options.audience;

	  if (options.issuer)
	    payload.iss = options.issuer;

	  if (options.subject)
	    payload.sub = options.subject;

	  var encoding = 'utf8';
	  if (options.encoding) {
	    encoding = options.encoding;
	  }

	  if(typeof callback === 'function') {
	    jws.createSign({
	      header: header,
	      payload: payload,
	      privateKey: secretOrPrivateKey,
	      payload: JSON.stringify(payload)
	    }).on('done', callback);
	  } else {
	    return jws.sign({header: header, payload: payload, secret: secretOrPrivateKey, encoding: encoding});
	  }
	};

	JWT.verify = function(jwtString, secretOrPublicKey, options, callback) {
	  if ((typeof options === 'function') && !callback) {
	    callback = options;
	    options = {};
	  }

	  if (!options) options = {};

	  var done;

	  if (callback) {
	    done = function() {
	      var args = Array.prototype.slice.call(arguments, 0);
	      return process.nextTick(function() {
	        callback.apply(null, args);
	      });
	    };
	  } else {
	    done = function(err, data) {
	      if (err) throw err;
	      return data;
	    };
	  }

	  if (!jwtString){
	    return done(new JsonWebTokenError('jwt must be provided'));
	  }

	  var parts = jwtString.split('.');

	  if (parts.length !== 3){
	    return done(new JsonWebTokenError('jwt malformed'));
	  }

	  if (parts[2].trim() === '' && secretOrPublicKey){
	    return done(new JsonWebTokenError('jwt signature is required'));
	  }

	  if (!secretOrPublicKey) {
	    return done(new JsonWebTokenError('secret or public key must be provided'));
	  }

	  if (!options.algorithms) {
	    options.algorithms = ~secretOrPublicKey.toString().indexOf('BEGIN CERTIFICATE') ||
	                         ~secretOrPublicKey.toString().indexOf('BEGIN PUBLIC KEY') ?
	                          [ 'RS256','RS384','RS512','ES256','ES384','ES512' ] :
	                         ~secretOrPublicKey.toString().indexOf('BEGIN RSA PUBLIC KEY') ?
	                          [ 'RS256','RS384','RS512' ] :
	                          [ 'HS256','HS384','HS512' ];

	  }

	  var decodedToken;
	  try {
	    decodedToken = jws.decode(jwtString);
	  } catch(err) {
	    return done(new JsonWebTokenError('invalid token'));
	  }

	  if (!decodedToken) {
	    return done(new JsonWebTokenError('invalid token'));
	  }

	  var header = decodedToken.header;

	  if (!~options.algorithms.indexOf(header.alg)) {
	    return done(new JsonWebTokenError('invalid algorithm'));
	  }

	  var valid;

	  try {
	    valid = jws.verify(jwtString, header.alg, secretOrPublicKey);
	  } catch (e) {
	    return done(e);
	  }

	  if (!valid)
	    return done(new JsonWebTokenError('invalid signature'));

	  var payload;

	  try {
	    payload = JWT.decode(jwtString);
	  } catch(err) {
	    return done(err);
	  }

	  if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
	    if (typeof payload.exp !== 'number') {
	      return done(new JsonWebTokenError('invalid exp value'));
	    }
	    if (Math.floor(Date.now() / 1000) >= payload.exp)
	      return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
	  }

	  if (options.audience) {
	    var audiences = Array.isArray(options.audience)? options.audience : [options.audience];
	    var target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

	    var match = target.some(function(aud) { return audiences.indexOf(aud) != -1; });

	    if (!match)
	      return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
	  }

	  if (options.issuer) {
	    if (payload.iss !== options.issuer)
	      return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
	  }

	  if (options.maxAge) {
	    var maxAge = ms(options.maxAge);
	    if (typeof payload.iat !== 'number') {
	      return done(new JsonWebTokenError('iat required when maxAge is specified'));
	    }
	    if (Date.now() - (payload.iat * 1000) > maxAge) {
	      return done(new TokenExpiredError('maxAge exceeded', new Date(payload.iat * 1000 + maxAge)));
	    }
	  }

	  return done(null, payload);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*global exports*/
	const SignStream = __webpack_require__(38);
	const VerifyStream = __webpack_require__(84);

	const ALGORITHMS = [
	  'HS256', 'HS384', 'HS512',
	  'RS256', 'RS384', 'RS512',
	  'ES256', 'ES384', 'ES512'
	];

	exports.ALGORITHMS = ALGORITHMS;
	exports.sign = SignStream.sign;
	exports.verify = VerifyStream.verify;
	exports.decode = VerifyStream.decode;
	exports.isValid = VerifyStream.isValid;
	exports.createSign = function createSign(opts) {
	  return new SignStream(opts);
	};
	exports.createVerify = function createVerify(opts) {
	  return new VerifyStream(opts);
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*global module*/
	const base64url = __webpack_require__(39);
	const DataStream = __webpack_require__(40);
	const jwa = __webpack_require__(59);
	const Stream = __webpack_require__(41);
	const toString = __webpack_require__(83);
	const util = __webpack_require__(25);

	function jwsSecuredInput(header, payload, encoding) {
	  encoding = encoding || 'utf8';
	  const encodedHeader = base64url(toString(header), 'binary');
	  const encodedPayload = base64url(toString(payload), encoding);
	  return util.format('%s.%s', encodedHeader, encodedPayload);
	}

	function jwsSign(opts) {
	  const header = opts.header;
	  const payload = opts.payload;
	  const secretOrKey = opts.secret || opts.privateKey;
	  const encoding = opts.encoding;
	  const algo = jwa(header.alg);
	  const securedInput = jwsSecuredInput(header, payload, encoding);
	  const signature = algo.sign(securedInput, secretOrKey);
	  return util.format('%s.%s', securedInput, signature);
	}

	function SignStream(opts) {
	  const secret = opts.secret||opts.privateKey||opts.key;
	  const secretStream = new DataStream(secret);
	  this.readable = true;
	  this.header = opts.header;
	  this.encoding = opts.encoding;
	  this.secret = this.privateKey = this.key = secretStream;
	  this.payload = new DataStream(opts.payload);
	  this.secret.once('close', function () {
	    if (!this.payload.writable && this.readable)
	      this.sign();
	  }.bind(this));

	  this.payload.once('close', function () {
	    if (!this.secret.writable && this.readable)
	      this.sign();
	  }.bind(this));
	}
	util.inherits(SignStream, Stream);

	SignStream.prototype.sign = function sign() {
	  const signature = jwsSign({
	    header: this.header,
	    payload: this.payload.buffer,
	    secret: this.secret.buffer,
	    encoding: this.encoding
	  });
	  this.emit('done', signature);
	  this.emit('data', signature);
	  this.emit('end');
	  this.readable = false;
	  return signature;
	};

	SignStream.sign = jwsSign;

	module.exports = SignStream;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {function fromBase64(base64string) {
	  return (
	    base64string
	      .replace(/=/g, '')
	      .replace(/\+/g, '-')
	      .replace(/\//g, '_')
	  );
	}

	function toBase64(base64UrlString) {
	  if (Buffer.isBuffer(base64UrlString))
	    base64UrlString = base64UrlString.toString();

	  const b64str = padString(base64UrlString)
	    .replace(/\-/g, '+')
	    .replace(/_/g, '/');
	  return b64str;
	}

	function padString(string) {
	  const segmentLength = 4;
	  const stringLength = string.length;
	  const diff = string.length % segmentLength;
	  if (!diff)
	    return string;
	  var position = stringLength;
	  var padLength = segmentLength - diff;
	  const paddedStringLength = stringLength + padLength;
	  const buffer = Buffer(paddedStringLength);
	  buffer.write(string);
	  while (padLength--)
	    buffer.write('=', position++);
	  return buffer.toString();
	}

	function decodeBase64Url(base64UrlString, encoding) {
	  return Buffer(toBase64(base64UrlString), 'base64').toString(encoding);
	}

	function base64url(stringOrBuffer, encoding) {
	  return fromBase64(Buffer(stringOrBuffer, encoding).toString('base64'));
	}

	function toBuffer(base64string) {
	  return Buffer(toBase64(base64string), 'base64');
	}

	base64url.toBase64 = toBase64;
	base64url.fromBase64 = fromBase64;
	base64url.decode = decodeBase64Url;
	base64url.encode = base64url;
	base64url.toBuffer = toBuffer;

	module.exports = base64url;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*global module, process*/
	const Buffer = __webpack_require__(5).Buffer;
	const Stream = __webpack_require__(41);
	const util = __webpack_require__(25);

	function DataStream(data) {
	  this.buffer = Buffer(data||0);
	  this.writable = true;
	  this.readable = true;
	  if (!data)
	    return this;
	  if (typeof data.pipe === 'function')
	    data.pipe(this);
	  else if (data.length) {
	    this.writable = false;
	    process.nextTick(function () {
	      this.buffer = data;
	      this.emit('end', data);
	      this.readable = false;
	      this.emit('close');
	    }.bind(this));
	  }
	}
	util.inherits(DataStream, Stream);

	DataStream.prototype.write = function write(data) {
	  this.buffer = Buffer.concat([this.buffer, Buffer(data)]);
	  this.emit('data', data);
	};

	DataStream.prototype.end = function end(data) {
	  if (data)
	    this.write(data);
	  this.emit('end', data);
	  this.emit('close');
	  this.writable = false;
	  this.readable = false;
	};

	module.exports = DataStream;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(42).EventEmitter;
	var inherits = __webpack_require__(43);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(44);
	Stream.Writable = __webpack_require__(55);
	Stream.Duplex = __webpack_require__(56);
	Stream.Transform = __webpack_require__(57);
	Stream.PassThrough = __webpack_require__(58);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
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
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(45);
	exports.Stream = __webpack_require__(41);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(51);
	exports.Duplex = __webpack_require__(50);
	exports.Transform = __webpack_require__(53);
	exports.PassThrough = __webpack_require__(54);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(46);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(5).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(42).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(41);

	/*<replacement>*/
	var util = __webpack_require__(47);
	util.inherits = __webpack_require__(48);
	/*</replacement>*/

	var StringDecoder;


	/*<replacement>*/
	var debug = __webpack_require__(49);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/


	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(50);

	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(52).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  var Duplex = __webpack_require__(50);

	  if (!(this instanceof Readable))
	    return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      if (!addToFront)
	        state.reading = false;

	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront)
	          state.buffer.unshift(chunk);
	        else
	          state.buffer.push(chunk);

	        if (state.needReadable)
	          emitReadable(stream);
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(52).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;

	  if (!util.isNumber(n) || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended)
	      endReadable(this);
	    else
	      emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0)
	      endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }

	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  var ret;
	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0)
	    endReadable(this);

	  if (!util.isNull(ret))
	    this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync)
	      process.nextTick(function() {
	        emitReadable_(stream);
	      });
	    else
	      emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain &&
	        (!dest._writableState || dest._writableState.needDrain))
	      ondrain();
	  }

	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause',
	            src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain)
	      state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}


	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function() {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function() {
	      resume_(stream, state);
	    });
	  }
	}

	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading)
	    stream.read(0);
	}

	Readable.prototype.pause = function() {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    debug('wrapped data');
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length)
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	function isBuffer(arg) {
	  return Buffer.isBuffer(arg);
	}
	exports.isBuffer = isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 48 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 49 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	module.exports = Duplex;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/


	/*<replacement>*/
	var util = __webpack_require__(47);
	util.inherits = __webpack_require__(48);
	/*</replacement>*/

	var Readable = __webpack_require__(45);
	var Writable = __webpack_require__(51);

	util.inherits(Duplex, Readable);

	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});

	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	module.exports = Writable;

	/*<replacement>*/
	var Buffer = __webpack_require__(5).Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util = __webpack_require__(47);
	util.inherits = __webpack_require__(48);
	/*</replacement>*/

	var Stream = __webpack_require__(41);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(50);

	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = __webpack_require__(50);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (!util.isFunction(cb))
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function() {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function() {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing &&
	        !state.corked &&
	        !state.finished &&
	        !state.bufferProcessing &&
	        state.buffer.length)
	      clearBuffer(this, state);
	  }
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, false, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev)
	    stream._writev(chunk, state.onwrite);
	  else
	    stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      state.pendingcb--;
	      cb(er);
	    });
	  else {
	    state.pendingcb--;
	    cb(er);
	  }

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished &&
	        !state.corked &&
	        !state.bufferProcessing &&
	        state.buffer.length) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++)
	      cbs.push(state.buffer[c].callback);

	    // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });

	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);

	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }

	    if (c < state.buffer.length)
	      state.buffer = state.buffer.slice(c);
	    else
	      state.buffer.length = 0;
	  }

	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));

	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (!util.isNullOrUndefined(chunk))
	    this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else
	      prefinish(stream, state);
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(5).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	module.exports = Transform;

	var Duplex = __webpack_require__(50);

	/*<replacement>*/
	var util = __webpack_require__(47);
	util.inherits = __webpack_require__(48);
	/*</replacement>*/

	util.inherits(Transform, Duplex);


	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (!util.isNullOrUndefined(data))
	    stream.push(data);

	  if (cb)
	    cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}


	function Transform(options) {
	  if (!(this instanceof Transform))
	    return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(options, this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  this.once('prefinish', function() {
	    if (util.isFunction(this._flush))
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}

	Transform.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};

	Transform.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	  var ts = this._transformState;

	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};


	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	  return stream.push(null);
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	module.exports = PassThrough;

	var Transform = __webpack_require__(53);

	/*<replacement>*/
	var util = __webpack_require__(47);
	util.inherits = __webpack_require__(48);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough))
	    return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	  cb(null, chunk);
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(51)


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(50)


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(53)


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(54)


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {const bufferEqual = __webpack_require__(60);
	const base64url = __webpack_require__(61);
	const crypto = __webpack_require__(18);
	const formatEcdsa = __webpack_require__(62);
	const util = __webpack_require__(25);

	const MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512" and "none".'
	const MSG_INVALID_SECRET = 'secret must be a string or buffer';
	const MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
	const MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';

	function typeError(template) {
	  const args = [].slice.call(arguments, 1);
	  const errMsg = util.format.bind(util, template).apply(null, args);
	  return new TypeError(errMsg);
	}

	function bufferOrString(obj) {
	  return Buffer.isBuffer(obj) || typeof obj === 'string';
	}

	function normalizeInput(thing) {
	  if (!bufferOrString(thing))
	    thing = JSON.stringify(thing);
	  return thing;
	}

	function createHmacSigner(bits) {
	  return function sign(thing, secret) {
	    if (!bufferOrString(secret))
	      throw typeError(MSG_INVALID_SECRET);
	    thing = normalizeInput(thing);
	    const hmac = crypto.createHmac('sha' + bits, secret);
	    const sig = (hmac.update(thing), hmac.digest('base64'))
	    return base64url.fromBase64(sig);
	  }
	}

	function createHmacVerifier(bits) {
	  return function verify(thing, signature, secret) {
	    const computedSig = createHmacSigner(bits)(thing, secret);
	    return bufferEqual(Buffer(signature), Buffer(computedSig));
	  }
	}

	function createKeySigner(bits) {
	 return function sign(thing, privateKey) {
	    if (!bufferOrString(privateKey) && !(typeof privateKey === 'object'))
	      throw typeError(MSG_INVALID_SIGNER_KEY);
	    thing = normalizeInput(thing);
	    // Even though we are specifying "RSA" here, this works with ECDSA
	    // keys as well.
	    const signer = crypto.createSign('RSA-SHA' + bits);
	    const sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
	    return base64url.fromBase64(sig);
	  }
	}

	function createKeyVerifier(bits) {
	  return function verify(thing, signature, publicKey) {
	    if (!bufferOrString(publicKey))
	      throw typeError(MSG_INVALID_VERIFIER_KEY);
	    thing = normalizeInput(thing);
	    signature = base64url.toBase64(signature);
	    const verifier = crypto.createVerify('RSA-SHA' + bits);
	    verifier.update(thing);
	    return verifier.verify(publicKey, signature, 'base64');
	  }
	}

	function createECDSASigner(bits) {
	  const inner = createKeySigner(bits);
	  return function sign() {
	    var signature = inner.apply(null, arguments);
	    signature = formatEcdsa.derToJose(signature, 'ES' + bits);
	    return signature;
	  };
	}

	function createECDSAVerifer(bits) {
	  const inner = createKeyVerifier(bits);
	  return function verify(thing, signature, publicKey) {
	    signature = formatEcdsa.joseToDer(signature, 'ES' + bits).toString('base64');
	    const result = inner(thing, signature, publicKey);
	    return result;
	  };
	}

	function createNoneSigner() {
	  return function sign() {
	    return '';
	  }
	}

	function createNoneVerifier() {
	  return function verify(thing, signature) {
	    return signature === '';
	  }
	}

	module.exports = function jwa(algorithm) {
	  const signerFactories = {
	    hs: createHmacSigner,
	    rs: createKeySigner,
	    es: createECDSASigner,
	    none: createNoneSigner,
	  }
	  const verifierFactories = {
	    hs: createHmacVerifier,
	    rs: createKeyVerifier,
	    es: createECDSAVerifer,
	    none: createNoneVerifier,
	  }
	  const match = algorithm.match(/(RS|ES|HS|none)(256|384|512)?/i);
	  if (!match)
	    throw typeError(MSG_INVALID_ALGORITHM, algorithm);
	  const algo = match[1].toLowerCase();
	  const bits = match[2];

	  return {
	    sign: signerFactories[algo](bits),
	    verify: verifierFactories[algo](bits),
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint node:true */
	'use strict';
	var Buffer = __webpack_require__(5).Buffer; // browserify
	var SlowBuffer = __webpack_require__(5).SlowBuffer;

	module.exports = bufferEq;

	function bufferEq(a, b) {

	  // shortcutting on type is necessary for correctness
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    return false;
	  }

	  // buffer sizes should be well-known information, so despite this
	  // shortcutting, it doesn't leak any information about the *contents* of the
	  // buffers.
	  if (a.length !== b.length) {
	    return false;
	  }

	  var c = 0;
	  for (var i = 0; i < a.length; i++) {
	    /*jshint bitwise:false */
	    c |= a[i] ^ b[i]; // XOR
	  }
	  return c === 0;
	}

	bufferEq.install = function() {
	  Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
	    return bufferEq(this, that);
	  };
	};

	var origBufEqual = Buffer.prototype.equal;
	var origSlowBufEqual = SlowBuffer.prototype.equal;
	bufferEq.restore = function() {
	  Buffer.prototype.equal = origBufEqual;
	  SlowBuffer.prototype.equal = origSlowBufEqual;
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {function fromBase64(base64string) {
	  return (
	    base64string
	      .replace(/=/g, '')
	      .replace(/\+/g, '-')
	      .replace(/\//g, '_')
	  );
	}

	function toBase64(base64UrlString) {
	  if (Buffer.isBuffer(base64UrlString))
	    base64UrlString = base64UrlString.toString()

	  const b64str = padString(base64UrlString)
	    .replace(/\-/g, '+')
	    .replace(/_/g, '/');
	  return b64str;
	}

	function padString(string) {
	  const segmentLength = 4;
	  const stringLength = string.length;
	  const diff = string.length % segmentLength;
	  if (!diff)
	    return string;
	  var position = stringLength;
	  var padLength = segmentLength - diff;
	  const paddedStringLength = stringLength + padLength;
	  const buffer = Buffer(paddedStringLength);
	  buffer.write(string);
	  while (padLength--)
	    buffer.write('=', position++);
	  return buffer.toString();
	}

	function decodeBase64Url(base64UrlString, encoding) {
	  return Buffer(toBase64(base64UrlString), 'base64').toString(encoding);
	}

	function base64url(stringOrBuffer) {
	  return fromBase64(Buffer(stringOrBuffer).toString('base64'));
	}

	function toBuffer(base64string) {
	  return Buffer(toBase64(base64string), 'base64');
	}

	base64url.toBase64 = toBase64;
	base64url.fromBase64 = fromBase64;
	base64url.decode = decodeBase64Url;
	base64url.toBuffer = toBuffer;

	module.exports = base64url;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var asn1 = __webpack_require__(63),
		base64Url = __webpack_require__(82).escape;

	var ECDSASigValue = asn1.define('ECDSASigValue', function () {
		this.seq().obj(
			this.key('r').int(),
			this.key('s').int()
		);
	});

	var seq = 0x10,
		int = 0x02;

	function getParamSize (keySize) {
		var result = ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
		return result;
	}

	var paramBytesForAlg = {
		ES256: getParamSize(256),
		ES384: getParamSize(384),
		ES512: getParamSize(521)
	};

	function getParamBytesForAlg (alg) {
		var paramBytes = paramBytesForAlg[alg];
		if (paramBytes) {
			return paramBytes;
		}

		throw new Error('Unknown algorithm "' + alg + '"');
	}

	function bignumToBuf (bn, numBytes) {
		var buf = new Buffer(bn.toString('hex', numBytes), 'hex');
		return buf;
	}

	function signatureAsBuffer (signature) {
		if (Buffer.isBuffer(signature)) {
			return new Buffer(signature);
		} else if ('string' === typeof signature) {
			return new Buffer(signature, 'base64');
		}

		throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
	}

	function derToJose(signature, alg) {
		signature = signatureAsBuffer(signature);
		var paramBytes = getParamBytesForAlg(alg);

		signature = ECDSASigValue.decode(signature, 'der');

		var r = bignumToBuf(signature.r, paramBytes);
		var s = bignumToBuf(signature.s, paramBytes);

		signature = Buffer.concat([r, s], r.length + s.length);
		signature = signature.toString('base64');
		signature = base64Url(signature);

		return signature;
	}

	function reduceBuffer (buf) {
		var padding = 0;
		for (var n = buf.length; padding < n && buf[padding] === 0;) {
			++padding;
		}

		var needsSign = buf[padding] >= 0x80;
		if (needsSign) {
			--padding;

			if (padding < 0) {
				var old = buf;
				buf = new Buffer(1 + buf.length);
				buf[0] = 0;
				old.copy(buf, 1);

				return buf;
			}
		}

		if (padding === 0) {
			return buf;
		}

		buf = buf.slice(padding);
		return buf;
	}

	function joseToDer(signature, alg) {
		signature = signatureAsBuffer(signature);
		var paramBytes = getParamBytesForAlg(alg);

		var signatureBytes = signature.length;
		if (signatureBytes !== paramBytes * 2) {
			throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
		}

		var r = reduceBuffer(signature.slice(0, paramBytes));
		var s = reduceBuffer(signature.slice(paramBytes));

		var rsBytes = 1 + 1 + r.length + 1 + 1 + s.length;

		var oneByteLength = rsBytes < 0x80;

		signature = new Buffer((oneByteLength ? 2 : 3) + rsBytes);

		var offset = 0;
		signature[offset++] = (seq | 0x20) | 0 << 6;
		if (oneByteLength) {
			signature[offset++] = rsBytes;
		} else {
			signature[offset++] = 0x80 | 1;
			signature[offset++] = rsBytes & 0xff;
		}
		signature[offset++] = int | (0 << 6);
		signature[offset++] = r.length;
		r.copy(signature, offset);
		offset += r.length;
		signature[offset++] = int | (0 << 6);
		signature[offset++] = s.length;
		s.copy(signature, offset);

		return signature;
	}

	module.exports = {
		derToJose: derToJose,
		joseToDer: joseToDer
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var asn1 = exports;

	asn1.bignum = __webpack_require__(64);

	asn1.define = __webpack_require__(65).define;
	asn1.base = __webpack_require__(69);
	asn1.constants = __webpack_require__(74);
	asn1.decoders = __webpack_require__(76);
	asn1.encoders = __webpack_require__(79);


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {

	'use strict';

	// Utils

	function assert(val, msg) {
	  if (!val)
	    throw new Error(msg || 'Assertion failed');
	}

	// Could use `inherits` module, but don't want to move from single file
	// architecture yet.
	function inherits(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  var TempCtor = function () {};
	  TempCtor.prototype = superCtor.prototype;
	  ctor.prototype = new TempCtor();
	  ctor.prototype.constructor = ctor;
	}

	// BN

	function BN(number, base, endian) {
	  // May be `new BN(bn)` ?
	  if (number !== null &&
	      typeof number === 'object' &&
	      Array.isArray(number.words)) {
	    return number;
	  }

	  this.sign = false;
	  this.words = null;
	  this.length = 0;

	  // Reduction context
	  this.red = null;

	  if (base === 'le' || base === 'be') {
	    endian = base;
	    base = 10;
	  }

	  if (number !== null)
	    this._init(number || 0, base || 10, endian || 'be');
	}
	if (typeof module === 'object')
	  module.exports = BN;
	else
	  exports.BN = BN;

	BN.BN = BN;
	BN.wordSize = 26;

	BN.prototype._init = function init(number, base, endian) {
	  if (typeof number === 'number') {
	    return this._initNumber(number, base, endian);
	  } else if (typeof number === 'object') {
	    return this._initArray(number, base, endian);
	  }
	  if (base === 'hex')
	    base = 16;
	  assert(base === (base | 0) && base >= 2 && base <= 36);

	  number = number.toString().replace(/\s+/g, '');
	  var start = 0;
	  if (number[0] === '-')
	    start++;

	  if (base === 16)
	    this._parseHex(number, start);
	  else
	    this._parseBase(number, base, start);

	  if (number[0] === '-')
	    this.sign = true;

	  this.strip();

	  if (endian !== 'le')
	    return;

	  this._initArray(this.toArray(), base, endian);
	};

	BN.prototype._initNumber = function _initNumber(number, base, endian) {
	  if (number < 0) {
	    this.sign = true;
	    number = -number;
	  }
	  if (number < 0x4000000) {
	    this.words = [ number & 0x3ffffff ];
	    this.length = 1;
	  } else if (number < 0x10000000000000) {
	    this.words = [
	      number & 0x3ffffff,
	      (number / 0x4000000) & 0x3ffffff
	    ];
	    this.length = 2;
	  } else {
	    assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
	    this.words = [
	      number & 0x3ffffff,
	      (number / 0x4000000) & 0x3ffffff,
	      1
	    ];
	    this.length = 3;
	  }

	  if (endian !== 'le')
	    return;

	  // Reverse the bytes
	  this._initArray(this.toArray(), base, endian);
	};

	BN.prototype._initArray = function _initArray(number, base, endian) {
	  // Perhaps a Uint8Array
	  assert(typeof number.length === 'number');
	  if (number.length <= 0) {
	    this.words = [ 0 ];
	    this.length = 1;
	    return this;
	  }

	  this.length = Math.ceil(number.length / 3);
	  this.words = new Array(this.length);
	  for (var i = 0; i < this.length; i++)
	    this.words[i] = 0;

	  var off = 0;
	  if (endian === 'be') {
	    for (var i = number.length - 1, j = 0; i >= 0; i -= 3) {
	      var w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	      off += 24;
	      if (off >= 26) {
	        off -= 26;
	        j++;
	      }
	    }
	  } else if (endian === 'le') {
	    for (var i = 0, j = 0; i < number.length; i += 3) {
	      var w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	      off += 24;
	      if (off >= 26) {
	        off -= 26;
	        j++;
	      }
	    }
	  }
	  return this.strip();
	};

	function parseHex(str, start, end) {
	  var r = 0;
	  var len = Math.min(str.length, end);
	  for (var i = start; i < len; i++) {
	    var c = str.charCodeAt(i) - 48;

	    r <<= 4;

	    // 'a' - 'f'
	    if (c >= 49 && c <= 54)
	      r |= c - 49 + 0xa;

	    // 'A' - 'F'
	    else if (c >= 17 && c <= 22)
	      r |= c - 17 + 0xa;

	    // '0' - '9'
	    else
	      r |= c & 0xf;
	  }
	  return r;
	}

	BN.prototype._parseHex = function _parseHex(number, start) {
	  // Create possibly bigger array to ensure that it fits the number
	  this.length = Math.ceil((number.length - start) / 6);
	  this.words = new Array(this.length);
	  for (var i = 0; i < this.length; i++)
	    this.words[i] = 0;

	  // Scan 24-bit chunks and add them to the number
	  var off = 0;
	  for (var i = number.length - 6, j = 0; i >= start; i -= 6) {
	    var w = parseHex(number, i, i + 6);
	    this.words[j] |= (w << off) & 0x3ffffff;
	    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	    off += 24;
	    if (off >= 26) {
	      off -= 26;
	      j++;
	    }
	  }
	  if (i + 6 !== start) {
	    var w = parseHex(number, start, i + 6);
	    this.words[j] |= (w << off) & 0x3ffffff;
	    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	  }
	  this.strip();
	};

	function parseBase(str, start, end, mul) {
	  var r = 0;
	  var len = Math.min(str.length, end);
	  for (var i = start; i < len; i++) {
	    var c = str.charCodeAt(i) - 48;

	    r *= mul;

	    // 'a'
	    if (c >= 49)
	      r += c - 49 + 0xa;

	    // 'A'
	    else if (c >= 17)
	      r += c - 17 + 0xa;

	    // '0' - '9'
	    else
	      r += c;
	  }
	  return r;
	}

	BN.prototype._parseBase = function _parseBase(number, base, start) {
	  // Initialize as zero
	  this.words = [ 0 ];
	  this.length = 1;

	  // Find length of limb in base
	  for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base)
	    limbLen++;
	  limbLen--;
	  limbPow = (limbPow / base) | 0;

	  var total = number.length - start;
	  var mod = total % limbLen;
	  var end = Math.min(total, total - mod) + start;

	  var word = 0;
	  for (var i = start; i < end; i += limbLen) {
	    word = parseBase(number, i, i + limbLen, base);

	    this.imuln(limbPow);
	    if (this.words[0] + word < 0x4000000)
	      this.words[0] += word;
	    else
	      this._iaddn(word);
	  }

	  if (mod !== 0) {
	    var pow = 1;
	    var word = parseBase(number, i, number.length, base);

	    for (var i = 0; i < mod; i++)
	      pow *= base;
	    this.imuln(pow);
	    if (this.words[0] + word < 0x4000000)
	      this.words[0] += word;
	    else
	      this._iaddn(word);
	  }
	};

	BN.prototype.copy = function copy(dest) {
	  dest.words = new Array(this.length);
	  for (var i = 0; i < this.length; i++)
	    dest.words[i] = this.words[i];
	  dest.length = this.length;
	  dest.sign = this.sign;
	  dest.red = this.red;
	};

	BN.prototype.clone = function clone() {
	  var r = new BN(null);
	  this.copy(r);
	  return r;
	};

	// Remove leading `0` from `this`
	BN.prototype.strip = function strip() {
	  while (this.length > 1 && this.words[this.length - 1] === 0)
	    this.length--;
	  return this._normSign();
	};

	BN.prototype._normSign = function _normSign() {
	  // -0 = 0
	  if (this.length === 1 && this.words[0] === 0)
	    this.sign = false;
	  return this;
	};

	BN.prototype.inspect = function inspect() {
	  return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
	};

	/*

	var zeros = [];
	var groupSizes = [];
	var groupBases = [];

	var s = '';
	var i = -1;
	while (++i < BN.wordSize) {
	  zeros[i] = s;
	  s += '0';
	}
	groupSizes[0] = 0;
	groupSizes[1] = 0;
	groupBases[0] = 0;
	groupBases[1] = 0;
	var base = 2 - 1;
	while (++base < 36 + 1) {
	  var groupSize = 0;
	  var groupBase = 1;
	  while (groupBase < (1 << BN.wordSize) / base) {
	    groupBase *= base;
	    groupSize += 1;
	  }
	  groupSizes[base] = groupSize;
	  groupBases[base] = groupBase;
	}

	*/

	var zeros = [
	  '',
	  '0',
	  '00',
	  '000',
	  '0000',
	  '00000',
	  '000000',
	  '0000000',
	  '00000000',
	  '000000000',
	  '0000000000',
	  '00000000000',
	  '000000000000',
	  '0000000000000',
	  '00000000000000',
	  '000000000000000',
	  '0000000000000000',
	  '00000000000000000',
	  '000000000000000000',
	  '0000000000000000000',
	  '00000000000000000000',
	  '000000000000000000000',
	  '0000000000000000000000',
	  '00000000000000000000000',
	  '000000000000000000000000',
	  '0000000000000000000000000'
	];

	var groupSizes = [
	  0, 0,
	  25, 16, 12, 11, 10, 9, 8,
	  8, 7, 7, 7, 7, 6, 6,
	  6, 6, 6, 6, 6, 5, 5,
	  5, 5, 5, 5, 5, 5, 5,
	  5, 5, 5, 5, 5, 5, 5
	];

	var groupBases = [
	  0, 0,
	  33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
	  43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
	  16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
	  6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
	  24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
	];

	BN.prototype.toString = function toString(base, padding) {
	  base = base || 10;
	  if (base === 16 || base === 'hex') {
	    var out = '';
	    var off = 0;
	    var padding = padding | 0 || 1;
	    var carry = 0;
	    for (var i = 0; i < this.length; i++) {
	      var w = this.words[i];
	      var word = (((w << off) | carry) & 0xffffff).toString(16);
	      carry = (w >>> (24 - off)) & 0xffffff;
	      if (carry !== 0 || i !== this.length - 1)
	        out = zeros[6 - word.length] + word + out;
	      else
	        out = word + out;
	      off += 2;
	      if (off >= 26) {
	        off -= 26;
	        i--;
	      }
	    }
	    if (carry !== 0)
	      out = carry.toString(16) + out;
	    while (out.length % padding !== 0)
	      out = '0' + out;
	    if (this.sign)
	      out = '-' + out;
	    return out;
	  } else if (base === (base | 0) && base >= 2 && base <= 36) {
	    // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
	    var groupSize = groupSizes[base];
	    // var groupBase = Math.pow(base, groupSize);
	    var groupBase = groupBases[base];
	    var out = '';
	    var c = this.clone();
	    c.sign = false;
	    while (c.cmpn(0) !== 0) {
	      var r = c.modn(groupBase).toString(base);
	      c = c.idivn(groupBase);

	      if (c.cmpn(0) !== 0)
	        out = zeros[groupSize - r.length] + r + out;
	      else
	        out = r + out;
	    }
	    if (this.cmpn(0) === 0)
	      out = '0' + out;
	    if (this.sign)
	      out = '-' + out;
	    return out;
	  } else {
	    assert(false, 'Base should be between 2 and 36');
	  }
	};

	BN.prototype.toJSON = function toJSON() {
	  return this.toString(16);
	};

	BN.prototype.toArray = function toArray(endian) {
	  this.strip();
	  var res = new Array(this.byteLength());
	  res[0] = 0;

	  var q = this.clone();
	  if (endian !== 'le') {
	    // Assume big-endian
	    for (var i = 0; q.cmpn(0) !== 0; i++) {
	      var b = q.andln(0xff);
	      q.ishrn(8);

	      res[res.length - i - 1] = b;
	    }
	  } else {
	    // Assume little-endian
	    for (var i = 0; q.cmpn(0) !== 0; i++) {
	      var b = q.andln(0xff);
	      q.ishrn(8);

	      res[i] = b;
	    }
	  }

	  return res;
	};

	if (Math.clz32) {
	  BN.prototype._countBits = function _countBits(w) {
	    return 32 - Math.clz32(w);
	  };
	} else {
	  BN.prototype._countBits = function _countBits(w) {
	    var t = w;
	    var r = 0;
	    if (t >= 0x1000) {
	      r += 13;
	      t >>>= 13;
	    }
	    if (t >= 0x40) {
	      r += 7;
	      t >>>= 7;
	    }
	    if (t >= 0x8) {
	      r += 4;
	      t >>>= 4;
	    }
	    if (t >= 0x02) {
	      r += 2;
	      t >>>= 2;
	    }
	    return r + t;
	  };
	}

	BN.prototype._zeroBits = function _zeroBits(w) {
	  // Short-cut
	  if (w === 0)
	    return 26;

	  var t = w;
	  var r = 0;
	  if ((t & 0x1fff) === 0) {
	    r += 13;
	    t >>>= 13;
	  }
	  if ((t & 0x7f) === 0) {
	    r += 7;
	    t >>>= 7;
	  }
	  if ((t & 0xf) === 0) {
	    r += 4;
	    t >>>= 4;
	  }
	  if ((t & 0x3) === 0) {
	    r += 2;
	    t >>>= 2;
	  }
	  if ((t & 0x1) === 0)
	    r++;
	  return r;
	};

	// Return number of used bits in a BN
	BN.prototype.bitLength = function bitLength() {
	  var hi = 0;
	  var w = this.words[this.length - 1];
	  var hi = this._countBits(w);
	  return (this.length - 1) * 26 + hi;
	};

	// Number of trailing zero bits
	BN.prototype.zeroBits = function zeroBits() {
	  if (this.cmpn(0) === 0)
	    return 0;

	  var r = 0;
	  for (var i = 0; i < this.length; i++) {
	    var b = this._zeroBits(this.words[i]);
	    r += b;
	    if (b !== 26)
	      break;
	  }
	  return r;
	};

	BN.prototype.byteLength = function byteLength() {
	  return Math.ceil(this.bitLength() / 8);
	};

	// Return negative clone of `this`
	BN.prototype.neg = function neg() {
	  if (this.cmpn(0) === 0)
	    return this.clone();

	  var r = this.clone();
	  r.sign = !this.sign;
	  return r;
	};


	// Or `num` with `this` in-place
	BN.prototype.ior = function ior(num) {
	  this.sign = this.sign || num.sign;

	  while (this.length < num.length)
	    this.words[this.length++] = 0;

	  for (var i = 0; i < num.length; i++)
	    this.words[i] = this.words[i] | num.words[i];

	  return this.strip();
	};


	// Or `num` with `this`
	BN.prototype.or = function or(num) {
	  if (this.length > num.length)
	    return this.clone().ior(num);
	  else
	    return num.clone().ior(this);
	};


	// And `num` with `this` in-place
	BN.prototype.iand = function iand(num) {
	  this.sign = this.sign && num.sign;

	  // b = min-length(num, this)
	  var b;
	  if (this.length > num.length)
	    b = num;
	  else
	    b = this;

	  for (var i = 0; i < b.length; i++)
	    this.words[i] = this.words[i] & num.words[i];

	  this.length = b.length;

	  return this.strip();
	};


	// And `num` with `this`
	BN.prototype.and = function and(num) {
	  if (this.length > num.length)
	    return this.clone().iand(num);
	  else
	    return num.clone().iand(this);
	};


	// Xor `num` with `this` in-place
	BN.prototype.ixor = function ixor(num) {
	  this.sign = this.sign || num.sign;

	  // a.length > b.length
	  var a;
	  var b;
	  if (this.length > num.length) {
	    a = this;
	    b = num;
	  } else {
	    a = num;
	    b = this;
	  }

	  for (var i = 0; i < b.length; i++)
	    this.words[i] = a.words[i] ^ b.words[i];

	  if (this !== a)
	    for (; i < a.length; i++)
	      this.words[i] = a.words[i];

	  this.length = a.length;

	  return this.strip();
	};


	// Xor `num` with `this`
	BN.prototype.xor = function xor(num) {
	  if (this.length > num.length)
	    return this.clone().ixor(num);
	  else
	    return num.clone().ixor(this);
	};


	// Set `bit` of `this`
	BN.prototype.setn = function setn(bit, val) {
	  assert(typeof bit === 'number' && bit >= 0);

	  var off = (bit / 26) | 0;
	  var wbit = bit % 26;

	  while (this.length <= off)
	    this.words[this.length++] = 0;

	  if (val)
	    this.words[off] = this.words[off] | (1 << wbit);
	  else
	    this.words[off] = this.words[off] & ~(1 << wbit);

	  return this.strip();
	};


	// Add `num` to `this` in-place
	BN.prototype.iadd = function iadd(num) {
	  // negative + positive
	  if (this.sign && !num.sign) {
	    this.sign = false;
	    var r = this.isub(num);
	    this.sign = !this.sign;
	    return this._normSign();

	  // positive + negative
	  } else if (!this.sign && num.sign) {
	    num.sign = false;
	    var r = this.isub(num);
	    num.sign = true;
	    return r._normSign();
	  }

	  // a.length > b.length
	  var a;
	  var b;
	  if (this.length > num.length) {
	    a = this;
	    b = num;
	  } else {
	    a = num;
	    b = this;
	  }

	  var carry = 0;
	  for (var i = 0; i < b.length; i++) {
	    var r = a.words[i] + b.words[i] + carry;
	    this.words[i] = r & 0x3ffffff;
	    carry = r >>> 26;
	  }
	  for (; carry !== 0 && i < a.length; i++) {
	    var r = a.words[i] + carry;
	    this.words[i] = r & 0x3ffffff;
	    carry = r >>> 26;
	  }

	  this.length = a.length;
	  if (carry !== 0) {
	    this.words[this.length] = carry;
	    this.length++;
	  // Copy the rest of the words
	  } else if (a !== this) {
	    for (; i < a.length; i++)
	      this.words[i] = a.words[i];
	  }

	  return this;
	};

	// Add `num` to `this`
	BN.prototype.add = function add(num) {
	  if (num.sign && !this.sign) {
	    num.sign = false;
	    var res = this.sub(num);
	    num.sign = true;
	    return res;
	  } else if (!num.sign && this.sign) {
	    this.sign = false;
	    var res = num.sub(this);
	    this.sign = true;
	    return res;
	  }

	  if (this.length > num.length)
	    return this.clone().iadd(num);
	  else
	    return num.clone().iadd(this);
	};

	// Subtract `num` from `this` in-place
	BN.prototype.isub = function isub(num) {
	  // this - (-num) = this + num
	  if (num.sign) {
	    num.sign = false;
	    var r = this.iadd(num);
	    num.sign = true;
	    return r._normSign();

	  // -this - num = -(this + num)
	  } else if (this.sign) {
	    this.sign = false;
	    this.iadd(num);
	    this.sign = true;
	    return this._normSign();
	  }

	  // At this point both numbers are positive
	  var cmp = this.cmp(num);

	  // Optimization - zeroify
	  if (cmp === 0) {
	    this.sign = false;
	    this.length = 1;
	    this.words[0] = 0;
	    return this;
	  }

	  // a > b
	  var a;
	  var b;
	  if (cmp > 0) {
	    a = this;
	    b = num;
	  } else {
	    a = num;
	    b = this;
	  }

	  var carry = 0;
	  for (var i = 0; i < b.length; i++) {
	    var r = a.words[i] - b.words[i] + carry;
	    carry = r >> 26;
	    this.words[i] = r & 0x3ffffff;
	  }
	  for (; carry !== 0 && i < a.length; i++) {
	    var r = a.words[i] + carry;
	    carry = r >> 26;
	    this.words[i] = r & 0x3ffffff;
	  }

	  // Copy rest of the words
	  if (carry === 0 && i < a.length && a !== this)
	    for (; i < a.length; i++)
	      this.words[i] = a.words[i];
	  this.length = Math.max(this.length, i);

	  if (a !== this)
	    this.sign = true;

	  return this.strip();
	};

	// Subtract `num` from `this`
	BN.prototype.sub = function sub(num) {
	  return this.clone().isub(num);
	};

	/*
	// NOTE: This could be potentionally used to generate loop-less multiplications
	function _genCombMulTo(alen, blen) {
	  var len = alen + blen - 1;
	  var src = [
	    'var a = this.words, b = num.words, o = out.words, c = 0, w, ' +
	        'mask = 0x3ffffff, shift = 0x4000000;',
	    'out.length = ' + len + ';'
	  ];
	  for (var k = 0; k < len; k++) {
	    var minJ = Math.max(0, k - alen + 1);
	    var maxJ = Math.min(k, blen - 1);

	    for (var j = minJ; j <= maxJ; j++) {
	      var i = k - j;
	      var mul = 'a[' + i + '] * b[' + j + ']';

	      if (j === minJ) {
	        src.push('w = ' + mul + ' + c;');
	        src.push('c = (w / shift) | 0;');
	      } else {
	        src.push('w += ' + mul + ';');
	        src.push('c += (w / shift) | 0;');
	      }
	      src.push('w &= mask;');
	    }
	    src.push('o[' + k + '] = w;');
	  }
	  src.push('if (c !== 0) {',
	           '  o[' + k + '] = c;',
	           '  out.length++;',
	           '}',
	           'return out;');

	  return src.join('\n');
	}
	*/

	BN.prototype._smallMulTo = function _smallMulTo(num, out) {
	  out.sign = num.sign !== this.sign;
	  out.length = this.length + num.length;

	  var carry = 0;
	  for (var k = 0; k < out.length - 1; k++) {
	    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	    // note that ncarry could be >= 0x3ffffff
	    var ncarry = carry >>> 26;
	    var rword = carry & 0x3ffffff;
	    var maxJ = Math.min(k, num.length - 1);
	    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
	      var i = k - j;
	      var a = this.words[i] | 0;
	      var b = num.words[j] | 0;
	      var r = a * b;

	      var lo = r & 0x3ffffff;
	      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
	      lo = (lo + rword) | 0;
	      rword = lo & 0x3ffffff;
	      ncarry = (ncarry + (lo >>> 26)) | 0;
	    }
	    out.words[k] = rword;
	    carry = ncarry;
	  }
	  if (carry !== 0) {
	    out.words[k] = carry;
	  } else {
	    out.length--;
	  }

	  return out.strip();
	};

	BN.prototype._bigMulTo = function _bigMulTo(num, out) {
	  out.sign = num.sign !== this.sign;
	  out.length = this.length + num.length;

	  var carry = 0;
	  var hncarry = 0;
	  for (var k = 0; k < out.length - 1; k++) {
	    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	    // note that ncarry could be >= 0x3ffffff
	    var ncarry = hncarry;
	    hncarry = 0;
	    var rword = carry & 0x3ffffff;
	    var maxJ = Math.min(k, num.length - 1);
	    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
	      var i = k - j;
	      var a = this.words[i] | 0;
	      var b = num.words[j] | 0;
	      var r = a * b;

	      var lo = r & 0x3ffffff;
	      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
	      lo = (lo + rword) | 0;
	      rword = lo & 0x3ffffff;
	      ncarry = (ncarry + (lo >>> 26)) | 0;

	      hncarry += ncarry >>> 26;
	      ncarry &= 0x3ffffff;
	    }
	    out.words[k] = rword;
	    carry = ncarry;
	    ncarry = hncarry;
	  }
	  if (carry !== 0) {
	    out.words[k] = carry;
	  } else {
	    out.length--;
	  }

	  return out.strip();
	};

	BN.prototype.mulTo = function mulTo(num, out) {
	  var res;
	  if (this.length + num.length < 63)
	    res = this._smallMulTo(num, out);
	  else
	    res = this._bigMulTo(num, out);
	  return res;
	};

	// Multiply `this` by `num`
	BN.prototype.mul = function mul(num) {
	  var out = new BN(null);
	  out.words = new Array(this.length + num.length);
	  return this.mulTo(num, out);
	};

	// In-place Multiplication
	BN.prototype.imul = function imul(num) {
	  if (this.cmpn(0) === 0 || num.cmpn(0) === 0) {
	    this.words[0] = 0;
	    this.length = 1;
	    return this;
	  }

	  var tlen = this.length;
	  var nlen = num.length;

	  this.sign = num.sign !== this.sign;
	  this.length = this.length + num.length;
	  this.words[this.length - 1] = 0;

	  for (var k = this.length - 2; k >= 0; k--) {
	    // Sum all words with the same `i + j = k` and accumulate `carry`,
	    // note that carry could be >= 0x3ffffff
	    var carry = 0;
	    var rword = 0;
	    var maxJ = Math.min(k, nlen - 1);
	    for (var j = Math.max(0, k - tlen + 1); j <= maxJ; j++) {
	      var i = k - j;
	      var a = this.words[i];
	      var b = num.words[j];
	      var r = a * b;

	      var lo = r & 0x3ffffff;
	      carry += (r / 0x4000000) | 0;
	      lo += rword;
	      rword = lo & 0x3ffffff;
	      carry += lo >>> 26;
	    }
	    this.words[k] = rword;
	    this.words[k + 1] += carry;
	    carry = 0;
	  }

	  // Propagate overflows
	  var carry = 0;
	  for (var i = 1; i < this.length; i++) {
	    var w = this.words[i] + carry;
	    this.words[i] = w & 0x3ffffff;
	    carry = w >>> 26;
	  }

	  return this.strip();
	};

	BN.prototype.imuln = function imuln(num) {
	  assert(typeof num === 'number');

	  // Carry
	  var carry = 0;
	  for (var i = 0; i < this.length; i++) {
	    var w = this.words[i] * num;
	    var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
	    carry >>= 26;
	    carry += (w / 0x4000000) | 0;
	    // NOTE: lo is 27bit maximum
	    carry += lo >>> 26;
	    this.words[i] = lo & 0x3ffffff;
	  }

	  if (carry !== 0) {
	    this.words[i] = carry;
	    this.length++;
	  }

	  return this;
	};

	BN.prototype.muln = function muln(num) {
	  return this.clone().imuln(num);
	};

	// `this` * `this`
	BN.prototype.sqr = function sqr() {
	  return this.mul(this);
	};

	// `this` * `this` in-place
	BN.prototype.isqr = function isqr() {
	  return this.mul(this);
	};

	// Shift-left in-place
	BN.prototype.ishln = function ishln(bits) {
	  assert(typeof bits === 'number' && bits >= 0);
	  var r = bits % 26;
	  var s = (bits - r) / 26;
	  var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);

	  if (r !== 0) {
	    var carry = 0;
	    for (var i = 0; i < this.length; i++) {
	      var newCarry = this.words[i] & carryMask;
	      var c = (this.words[i] - newCarry) << r;
	      this.words[i] = c | carry;
	      carry = newCarry >>> (26 - r);
	    }
	    if (carry) {
	      this.words[i] = carry;
	      this.length++;
	    }
	  }

	  if (s !== 0) {
	    for (var i = this.length - 1; i >= 0; i--)
	      this.words[i + s] = this.words[i];
	    for (var i = 0; i < s; i++)
	      this.words[i] = 0;
	    this.length += s;
	  }

	  return this.strip();
	};

	// Shift-right in-place
	// NOTE: `hint` is a lowest bit before trailing zeroes
	// NOTE: if `extended` is present - it will be filled with destroyed bits
	BN.prototype.ishrn = function ishrn(bits, hint, extended) {
	  assert(typeof bits === 'number' && bits >= 0);
	  var h;
	  if (hint)
	    h = (hint - (hint % 26)) / 26;
	  else
	    h = 0;

	  var r = bits % 26;
	  var s = Math.min((bits - r) / 26, this.length);
	  var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	  var maskedWords = extended;

	  h -= s;
	  h = Math.max(0, h);

	  // Extended mode, copy masked part
	  if (maskedWords) {
	    for (var i = 0; i < s; i++)
	      maskedWords.words[i] = this.words[i];
	    maskedWords.length = s;
	  }

	  if (s === 0) {
	    // No-op, we should not move anything at all
	  } else if (this.length > s) {
	    this.length -= s;
	    for (var i = 0; i < this.length; i++)
	      this.words[i] = this.words[i + s];
	  } else {
	    this.words[0] = 0;
	    this.length = 1;
	  }

	  var carry = 0;
	  for (var i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
	    var word = this.words[i];
	    this.words[i] = (carry << (26 - r)) | (word >>> r);
	    carry = word & mask;
	  }

	  // Push carried bits as a mask
	  if (maskedWords && carry !== 0)
	    maskedWords.words[maskedWords.length++] = carry;

	  if (this.length === 0) {
	    this.words[0] = 0;
	    this.length = 1;
	  }

	  this.strip();

	  return this;
	};

	// Shift-left
	BN.prototype.shln = function shln(bits) {
	  return this.clone().ishln(bits);
	};

	// Shift-right
	BN.prototype.shrn = function shrn(bits) {
	  return this.clone().ishrn(bits);
	};

	// Test if n bit is set
	BN.prototype.testn = function testn(bit) {
	  assert(typeof bit === 'number' && bit >= 0);
	  var r = bit % 26;
	  var s = (bit - r) / 26;
	  var q = 1 << r;

	  // Fast case: bit is much higher than all existing words
	  if (this.length <= s) {
	    return false;
	  }

	  // Check bit and return
	  var w = this.words[s];

	  return !!(w & q);
	};

	// Return only lowers bits of number (in-place)
	BN.prototype.imaskn = function imaskn(bits) {
	  assert(typeof bits === 'number' && bits >= 0);
	  var r = bits % 26;
	  var s = (bits - r) / 26;

	  assert(!this.sign, 'imaskn works only with positive numbers');

	  if (r !== 0)
	    s++;
	  this.length = Math.min(s, this.length);

	  if (r !== 0) {
	    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	    this.words[this.length - 1] &= mask;
	  }

	  return this.strip();
	};

	// Return only lowers bits of number
	BN.prototype.maskn = function maskn(bits) {
	  return this.clone().imaskn(bits);
	};

	// Add plain number `num` to `this`
	BN.prototype.iaddn = function iaddn(num) {
	  assert(typeof num === 'number');
	  if (num < 0)
	    return this.isubn(-num);

	  // Possible sign change
	  if (this.sign) {
	    if (this.length === 1 && this.words[0] < num) {
	      this.words[0] = num - this.words[0];
	      this.sign = false;
	      return this;
	    }

	    this.sign = false;
	    this.isubn(num);
	    this.sign = true;
	    return this;
	  }

	  // Add without checks
	  return this._iaddn(num);
	};

	BN.prototype._iaddn = function _iaddn(num) {
	  this.words[0] += num;

	  // Carry
	  for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
	    this.words[i] -= 0x4000000;
	    if (i === this.length - 1)
	      this.words[i + 1] = 1;
	    else
	      this.words[i + 1]++;
	  }
	  this.length = Math.max(this.length, i + 1);

	  return this;
	};

	// Subtract plain number `num` from `this`
	BN.prototype.isubn = function isubn(num) {
	  assert(typeof num === 'number');
	  if (num < 0)
	    return this.iaddn(-num);

	  if (this.sign) {
	    this.sign = false;
	    this.iaddn(num);
	    this.sign = true;
	    return this;
	  }

	  this.words[0] -= num;

	  // Carry
	  for (var i = 0; i < this.length && this.words[i] < 0; i++) {
	    this.words[i] += 0x4000000;
	    this.words[i + 1] -= 1;
	  }

	  return this.strip();
	};

	BN.prototype.addn = function addn(num) {
	  return this.clone().iaddn(num);
	};

	BN.prototype.subn = function subn(num) {
	  return this.clone().isubn(num);
	};

	BN.prototype.iabs = function iabs() {
	  this.sign = false;

	  return this;
	};

	BN.prototype.abs = function abs() {
	  return this.clone().iabs();
	};

	BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
	  // Bigger storage is needed
	  var len = num.length + shift;
	  var i;
	  if (this.words.length < len) {
	    var t = new Array(len);
	    for (var i = 0; i < this.length; i++)
	      t[i] = this.words[i];
	    this.words = t;
	  } else {
	    i = this.length;
	  }

	  // Zeroify rest
	  this.length = Math.max(this.length, len);
	  for (; i < this.length; i++)
	    this.words[i] = 0;

	  var carry = 0;
	  for (var i = 0; i < num.length; i++) {
	    var w = this.words[i + shift] + carry;
	    var right = num.words[i] * mul;
	    w -= right & 0x3ffffff;
	    carry = (w >> 26) - ((right / 0x4000000) | 0);
	    this.words[i + shift] = w & 0x3ffffff;
	  }
	  for (; i < this.length - shift; i++) {
	    var w = this.words[i + shift] + carry;
	    carry = w >> 26;
	    this.words[i + shift] = w & 0x3ffffff;
	  }

	  if (carry === 0)
	    return this.strip();

	  // Subtraction overflow
	  assert(carry === -1);
	  carry = 0;
	  for (var i = 0; i < this.length; i++) {
	    var w = -this.words[i] + carry;
	    carry = w >> 26;
	    this.words[i] = w & 0x3ffffff;
	  }
	  this.sign = true;

	  return this.strip();
	};

	BN.prototype._wordDiv = function _wordDiv(num, mode) {
	  var shift = this.length - num.length;

	  var a = this.clone();
	  var b = num;

	  // Normalize
	  var bhi = b.words[b.length - 1];
	  var bhiBits = this._countBits(bhi);
	  shift = 26 - bhiBits;
	  if (shift !== 0) {
	    b = b.shln(shift);
	    a.ishln(shift);
	    bhi = b.words[b.length - 1];
	  }

	  // Initialize quotient
	  var m = a.length - b.length;
	  var q;

	  if (mode !== 'mod') {
	    q = new BN(null);
	    q.length = m + 1;
	    q.words = new Array(q.length);
	    for (var i = 0; i < q.length; i++)
	      q.words[i] = 0;
	  }

	  var diff = a.clone()._ishlnsubmul(b, 1, m);
	  if (!diff.sign) {
	    a = diff;
	    if (q)
	      q.words[m] = 1;
	  }

	  for (var j = m - 1; j >= 0; j--) {
	    var qj = a.words[b.length + j] * 0x4000000 + a.words[b.length + j - 1];

	    // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
	    // (0x7ffffff)
	    qj = Math.min((qj / bhi) | 0, 0x3ffffff);

	    a._ishlnsubmul(b, qj, j);
	    while (a.sign) {
	      qj--;
	      a.sign = false;
	      a._ishlnsubmul(b, 1, j);
	      if (a.cmpn(0) !== 0)
	        a.sign = !a.sign;
	    }
	    if (q)
	      q.words[j] = qj;
	  }
	  if (q)
	    q.strip();
	  a.strip();

	  // Denormalize
	  if (mode !== 'div' && shift !== 0)
	    a.ishrn(shift);
	  return { div: q ? q : null, mod: a };
	};

	BN.prototype.divmod = function divmod(num, mode) {
	  assert(num.cmpn(0) !== 0);

	  if (this.sign && !num.sign) {
	    var res = this.neg().divmod(num, mode);
	    var div;
	    var mod;
	    if (mode !== 'mod')
	      div = res.div.neg();
	    if (mode !== 'div')
	      mod = res.mod.cmpn(0) === 0 ? res.mod : num.sub(res.mod);
	    return {
	      div: div,
	      mod: mod
	    };
	  } else if (!this.sign && num.sign) {
	    var res = this.divmod(num.neg(), mode);
	    var div;
	    if (mode !== 'mod')
	      div = res.div.neg();
	    return { div: div, mod: res.mod };
	  } else if (this.sign && num.sign) {
	    return this.neg().divmod(num.neg(), mode);
	  }

	  // Both numbers are positive at this point

	  // Strip both numbers to approximate shift value
	  if (num.length > this.length || this.cmp(num) < 0)
	    return { div: new BN(0), mod: this };

	  // Very short reduction
	  if (num.length === 1) {
	    if (mode === 'div')
	      return { div: this.divn(num.words[0]), mod: null };
	    else if (mode === 'mod')
	      return { div: null, mod: new BN(this.modn(num.words[0])) };
	    return {
	      div: this.divn(num.words[0]),
	      mod: new BN(this.modn(num.words[0]))
	    };
	  }

	  return this._wordDiv(num, mode);
	};

	// Find `this` / `num`
	BN.prototype.div = function div(num) {
	  return this.divmod(num, 'div').div;
	};

	// Find `this` % `num`
	BN.prototype.mod = function mod(num) {
	  return this.divmod(num, 'mod').mod;
	};

	// Find Round(`this` / `num`)
	BN.prototype.divRound = function divRound(num) {
	  var dm = this.divmod(num);

	  // Fast case - exact division
	  if (dm.mod.cmpn(0) === 0)
	    return dm.div;

	  var mod = dm.div.sign ? dm.mod.isub(num) : dm.mod;

	  var half = num.shrn(1);
	  var r2 = num.andln(1);
	  var cmp = mod.cmp(half);

	  // Round down
	  if (cmp < 0 || r2 === 1 && cmp === 0)
	    return dm.div;

	  // Round up
	  return dm.div.sign ? dm.div.isubn(1) : dm.div.iaddn(1);
	};

	BN.prototype.modn = function modn(num) {
	  assert(num <= 0x3ffffff);
	  var p = (1 << 26) % num;

	  var acc = 0;
	  for (var i = this.length - 1; i >= 0; i--)
	    acc = (p * acc + this.words[i]) % num;

	  return acc;
	};

	// In-place division by number
	BN.prototype.idivn = function idivn(num) {
	  assert(num <= 0x3ffffff);

	  var carry = 0;
	  for (var i = this.length - 1; i >= 0; i--) {
	    var w = this.words[i] + carry * 0x4000000;
	    this.words[i] = (w / num) | 0;
	    carry = w % num;
	  }

	  return this.strip();
	};

	BN.prototype.divn = function divn(num) {
	  return this.clone().idivn(num);
	};

	BN.prototype.egcd = function egcd(p) {
	  assert(!p.sign);
	  assert(p.cmpn(0) !== 0);

	  var x = this;
	  var y = p.clone();

	  if (x.sign)
	    x = x.mod(p);
	  else
	    x = x.clone();

	  // A * x + B * y = x
	  var A = new BN(1);
	  var B = new BN(0);

	  // C * x + D * y = y
	  var C = new BN(0);
	  var D = new BN(1);

	  var g = 0;

	  while (x.isEven() && y.isEven()) {
	    x.ishrn(1);
	    y.ishrn(1);
	    ++g;
	  }

	  var yp = y.clone();
	  var xp = x.clone();

	  while (x.cmpn(0) !== 0) {
	    while (x.isEven()) {
	      x.ishrn(1);
	      if (A.isEven() && B.isEven()) {
	        A.ishrn(1);
	        B.ishrn(1);
	      } else {
	        A.iadd(yp).ishrn(1);
	        B.isub(xp).ishrn(1);
	      }
	    }

	    while (y.isEven()) {
	      y.ishrn(1);
	      if (C.isEven() && D.isEven()) {
	        C.ishrn(1);
	        D.ishrn(1);
	      } else {
	        C.iadd(yp).ishrn(1);
	        D.isub(xp).ishrn(1);
	      }
	    }

	    if (x.cmp(y) >= 0) {
	      x.isub(y);
	      A.isub(C);
	      B.isub(D);
	    } else {
	      y.isub(x);
	      C.isub(A);
	      D.isub(B);
	    }
	  }

	  return {
	    a: C,
	    b: D,
	    gcd: y.ishln(g)
	  };
	};

	// This is reduced incarnation of the binary EEA
	// above, designated to invert members of the
	// _prime_ fields F(p) at a maximal speed
	BN.prototype._invmp = function _invmp(p) {
	  assert(!p.sign);
	  assert(p.cmpn(0) !== 0);

	  var a = this;
	  var b = p.clone();

	  if (a.sign)
	    a = a.mod(p);
	  else
	    a = a.clone();

	  var x1 = new BN(1);
	  var x2 = new BN(0);

	  var delta = b.clone();

	  while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
	    while (a.isEven()) {
	      a.ishrn(1);
	      if (x1.isEven())
	        x1.ishrn(1);
	      else
	        x1.iadd(delta).ishrn(1);
	    }
	    while (b.isEven()) {
	      b.ishrn(1);
	      if (x2.isEven())
	        x2.ishrn(1);
	      else
	        x2.iadd(delta).ishrn(1);
	    }
	    if (a.cmp(b) >= 0) {
	      a.isub(b);
	      x1.isub(x2);
	    } else {
	      b.isub(a);
	      x2.isub(x1);
	    }
	  }
	  if (a.cmpn(1) === 0)
	    return x1;
	  else
	    return x2;
	};

	BN.prototype.gcd = function gcd(num) {
	  if (this.cmpn(0) === 0)
	    return num.clone();
	  if (num.cmpn(0) === 0)
	    return this.clone();

	  var a = this.clone();
	  var b = num.clone();
	  a.sign = false;
	  b.sign = false;

	  // Remove common factor of two
	  for (var shift = 0; a.isEven() && b.isEven(); shift++) {
	    a.ishrn(1);
	    b.ishrn(1);
	  }

	  do {
	    while (a.isEven())
	      a.ishrn(1);
	    while (b.isEven())
	      b.ishrn(1);

	    var r = a.cmp(b);
	    if (r < 0) {
	      // Swap `a` and `b` to make `a` always bigger than `b`
	      var t = a;
	      a = b;
	      b = t;
	    } else if (r === 0 || b.cmpn(1) === 0) {
	      break;
	    }

	    a.isub(b);
	  } while (true);

	  return b.ishln(shift);
	};

	// Invert number in the field F(num)
	BN.prototype.invm = function invm(num) {
	  return this.egcd(num).a.mod(num);
	};

	BN.prototype.isEven = function isEven() {
	  return (this.words[0] & 1) === 0;
	};

	BN.prototype.isOdd = function isOdd() {
	  return (this.words[0] & 1) === 1;
	};

	// And first word and num
	BN.prototype.andln = function andln(num) {
	  return this.words[0] & num;
	};

	// Increment at the bit position in-line
	BN.prototype.bincn = function bincn(bit) {
	  assert(typeof bit === 'number');
	  var r = bit % 26;
	  var s = (bit - r) / 26;
	  var q = 1 << r;

	  // Fast case: bit is much higher than all existing words
	  if (this.length <= s) {
	    for (var i = this.length; i < s + 1; i++)
	      this.words[i] = 0;
	    this.words[s] |= q;
	    this.length = s + 1;
	    return this;
	  }

	  // Add bit and propagate, if needed
	  var carry = q;
	  for (var i = s; carry !== 0 && i < this.length; i++) {
	    var w = this.words[i];
	    w += carry;
	    carry = w >>> 26;
	    w &= 0x3ffffff;
	    this.words[i] = w;
	  }
	  if (carry !== 0) {
	    this.words[i] = carry;
	    this.length++;
	  }
	  return this;
	};

	BN.prototype.cmpn = function cmpn(num) {
	  var sign = num < 0;
	  if (sign)
	    num = -num;

	  if (this.sign && !sign)
	    return -1;
	  else if (!this.sign && sign)
	    return 1;

	  num &= 0x3ffffff;
	  this.strip();

	  var res;
	  if (this.length > 1) {
	    res = 1;
	  } else {
	    var w = this.words[0];
	    res = w === num ? 0 : w < num ? -1 : 1;
	  }
	  if (this.sign)
	    res = -res;
	  return res;
	};

	// Compare two numbers and return:
	// 1 - if `this` > `num`
	// 0 - if `this` == `num`
	// -1 - if `this` < `num`
	BN.prototype.cmp = function cmp(num) {
	  if (this.sign && !num.sign)
	    return -1;
	  else if (!this.sign && num.sign)
	    return 1;

	  var res = this.ucmp(num);
	  if (this.sign)
	    return -res;
	  else
	    return res;
	};

	// Unsigned comparison
	BN.prototype.ucmp = function ucmp(num) {
	  // At this point both numbers have the same sign
	  if (this.length > num.length)
	    return 1;
	  else if (this.length < num.length)
	    return -1;

	  var res = 0;
	  for (var i = this.length - 1; i >= 0; i--) {
	    var a = this.words[i];
	    var b = num.words[i];

	    if (a === b)
	      continue;
	    if (a < b)
	      res = -1;
	    else if (a > b)
	      res = 1;
	    break;
	  }
	  return res;
	};

	//
	// A reduce context, could be using montgomery or something better, depending
	// on the `m` itself.
	//
	BN.red = function red(num) {
	  return new Red(num);
	};

	BN.prototype.toRed = function toRed(ctx) {
	  assert(!this.red, 'Already a number in reduction context');
	  assert(!this.sign, 'red works only with positives');
	  return ctx.convertTo(this)._forceRed(ctx);
	};

	BN.prototype.fromRed = function fromRed() {
	  assert(this.red, 'fromRed works only with numbers in reduction context');
	  return this.red.convertFrom(this);
	};

	BN.prototype._forceRed = function _forceRed(ctx) {
	  this.red = ctx;
	  return this;
	};

	BN.prototype.forceRed = function forceRed(ctx) {
	  assert(!this.red, 'Already a number in reduction context');
	  return this._forceRed(ctx);
	};

	BN.prototype.redAdd = function redAdd(num) {
	  assert(this.red, 'redAdd works only with red numbers');
	  return this.red.add(this, num);
	};

	BN.prototype.redIAdd = function redIAdd(num) {
	  assert(this.red, 'redIAdd works only with red numbers');
	  return this.red.iadd(this, num);
	};

	BN.prototype.redSub = function redSub(num) {
	  assert(this.red, 'redSub works only with red numbers');
	  return this.red.sub(this, num);
	};

	BN.prototype.redISub = function redISub(num) {
	  assert(this.red, 'redISub works only with red numbers');
	  return this.red.isub(this, num);
	};

	BN.prototype.redShl = function redShl(num) {
	  assert(this.red, 'redShl works only with red numbers');
	  return this.red.shl(this, num);
	};

	BN.prototype.redMul = function redMul(num) {
	  assert(this.red, 'redMul works only with red numbers');
	  this.red._verify2(this, num);
	  return this.red.mul(this, num);
	};

	BN.prototype.redIMul = function redIMul(num) {
	  assert(this.red, 'redMul works only with red numbers');
	  this.red._verify2(this, num);
	  return this.red.imul(this, num);
	};

	BN.prototype.redSqr = function redSqr() {
	  assert(this.red, 'redSqr works only with red numbers');
	  this.red._verify1(this);
	  return this.red.sqr(this);
	};

	BN.prototype.redISqr = function redISqr() {
	  assert(this.red, 'redISqr works only with red numbers');
	  this.red._verify1(this);
	  return this.red.isqr(this);
	};

	// Square root over p
	BN.prototype.redSqrt = function redSqrt() {
	  assert(this.red, 'redSqrt works only with red numbers');
	  this.red._verify1(this);
	  return this.red.sqrt(this);
	};

	BN.prototype.redInvm = function redInvm() {
	  assert(this.red, 'redInvm works only with red numbers');
	  this.red._verify1(this);
	  return this.red.invm(this);
	};

	// Return negative clone of `this` % `red modulo`
	BN.prototype.redNeg = function redNeg() {
	  assert(this.red, 'redNeg works only with red numbers');
	  this.red._verify1(this);
	  return this.red.neg(this);
	};

	BN.prototype.redPow = function redPow(num) {
	  assert(this.red && !num.red, 'redPow(normalNum)');
	  this.red._verify1(this);
	  return this.red.pow(this, num);
	};

	// Prime numbers with efficient reduction
	var primes = {
	  k256: null,
	  p224: null,
	  p192: null,
	  p25519: null
	};

	// Pseudo-Mersenne prime
	function MPrime(name, p) {
	  // P = 2 ^ N - K
	  this.name = name;
	  this.p = new BN(p, 16);
	  this.n = this.p.bitLength();
	  this.k = new BN(1).ishln(this.n).isub(this.p);

	  this.tmp = this._tmp();
	}

	MPrime.prototype._tmp = function _tmp() {
	  var tmp = new BN(null);
	  tmp.words = new Array(Math.ceil(this.n / 13));
	  return tmp;
	};

	MPrime.prototype.ireduce = function ireduce(num) {
	  // Assumes that `num` is less than `P^2`
	  // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
	  var r = num;
	  var rlen;

	  do {
	    this.split(r, this.tmp);
	    r = this.imulK(r);
	    r = r.iadd(this.tmp);
	    rlen = r.bitLength();
	  } while (rlen > this.n);

	  var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
	  if (cmp === 0) {
	    r.words[0] = 0;
	    r.length = 1;
	  } else if (cmp > 0) {
	    r.isub(this.p);
	  } else {
	    r.strip();
	  }

	  return r;
	};

	MPrime.prototype.split = function split(input, out) {
	  input.ishrn(this.n, 0, out);
	};

	MPrime.prototype.imulK = function imulK(num) {
	  return num.imul(this.k);
	};

	function K256() {
	  MPrime.call(
	    this,
	    'k256',
	    'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
	}
	inherits(K256, MPrime);

	K256.prototype.split = function split(input, output) {
	  // 256 = 9 * 26 + 22
	  var mask = 0x3fffff;

	  var outLen = Math.min(input.length, 9);
	  for (var i = 0; i < outLen; i++)
	    output.words[i] = input.words[i];
	  output.length = outLen;

	  if (input.length <= 9) {
	    input.words[0] = 0;
	    input.length = 1;
	    return;
	  }

	  // Shift by 9 limbs
	  var prev = input.words[9];
	  output.words[output.length++] = prev & mask;

	  for (var i = 10; i < input.length; i++) {
	    var next = input.words[i];
	    input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
	    prev = next;
	  }
	  input.words[i - 10] = prev >>> 22;
	  input.length -= 9;
	};

	K256.prototype.imulK = function imulK(num) {
	  // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
	  num.words[num.length] = 0;
	  num.words[num.length + 1] = 0;
	  num.length += 2;

	  // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
	  var hi;
	  var lo = 0;
	  for (var i = 0; i < num.length; i++) {
	    var w = num.words[i];
	    hi = w * 0x40;
	    lo += w * 0x3d1;
	    hi += (lo / 0x4000000) | 0;
	    lo &= 0x3ffffff;

	    num.words[i] = lo;

	    lo = hi;
	  }

	  // Fast length reduction
	  if (num.words[num.length - 1] === 0) {
	    num.length--;
	    if (num.words[num.length - 1] === 0)
	      num.length--;
	  }
	  return num;
	};

	function P224() {
	  MPrime.call(
	    this,
	    'p224',
	    'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
	}
	inherits(P224, MPrime);

	function P192() {
	  MPrime.call(
	    this,
	    'p192',
	    'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
	}
	inherits(P192, MPrime);

	function P25519() {
	  // 2 ^ 255 - 19
	  MPrime.call(
	    this,
	    '25519',
	    '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
	}
	inherits(P25519, MPrime);

	P25519.prototype.imulK = function imulK(num) {
	  // K = 0x13
	  var carry = 0;
	  for (var i = 0; i < num.length; i++) {
	    var hi = num.words[i] * 0x13 + carry;
	    var lo = hi & 0x3ffffff;
	    hi >>>= 26;

	    num.words[i] = lo;
	    carry = hi;
	  }
	  if (carry !== 0)
	    num.words[num.length++] = carry;
	  return num;
	};

	// Exported mostly for testing purposes, use plain name instead
	BN._prime = function prime(name) {
	  // Cached version of prime
	  if (primes[name])
	    return primes[name];

	  var prime;
	  if (name === 'k256')
	    prime = new K256();
	  else if (name === 'p224')
	    prime = new P224();
	  else if (name === 'p192')
	    prime = new P192();
	  else if (name === 'p25519')
	    prime = new P25519();
	  else
	    throw new Error('Unknown prime ' + name);
	  primes[name] = prime;

	  return prime;
	};

	//
	// Base reduction engine
	//
	function Red(m) {
	  if (typeof m === 'string') {
	    var prime = BN._prime(m);
	    this.m = prime.p;
	    this.prime = prime;
	  } else {
	    this.m = m;
	    this.prime = null;
	  }
	}

	Red.prototype._verify1 = function _verify1(a) {
	  assert(!a.sign, 'red works only with positives');
	  assert(a.red, 'red works only with red numbers');
	};

	Red.prototype._verify2 = function _verify2(a, b) {
	  assert(!a.sign && !b.sign, 'red works only with positives');
	  assert(a.red && a.red === b.red,
	         'red works only with red numbers');
	};

	Red.prototype.imod = function imod(a) {
	  if (this.prime)
	    return this.prime.ireduce(a)._forceRed(this);
	  return a.mod(this.m)._forceRed(this);
	};

	Red.prototype.neg = function neg(a) {
	  var r = a.clone();
	  r.sign = !r.sign;
	  return r.iadd(this.m)._forceRed(this);
	};

	Red.prototype.add = function add(a, b) {
	  this._verify2(a, b);

	  var res = a.add(b);
	  if (res.cmp(this.m) >= 0)
	    res.isub(this.m);
	  return res._forceRed(this);
	};

	Red.prototype.iadd = function iadd(a, b) {
	  this._verify2(a, b);

	  var res = a.iadd(b);
	  if (res.cmp(this.m) >= 0)
	    res.isub(this.m);
	  return res;
	};

	Red.prototype.sub = function sub(a, b) {
	  this._verify2(a, b);

	  var res = a.sub(b);
	  if (res.cmpn(0) < 0)
	    res.iadd(this.m);
	  return res._forceRed(this);
	};

	Red.prototype.isub = function isub(a, b) {
	  this._verify2(a, b);

	  var res = a.isub(b);
	  if (res.cmpn(0) < 0)
	    res.iadd(this.m);
	  return res;
	};

	Red.prototype.shl = function shl(a, num) {
	  this._verify1(a);
	  return this.imod(a.shln(num));
	};

	Red.prototype.imul = function imul(a, b) {
	  this._verify2(a, b);
	  return this.imod(a.imul(b));
	};

	Red.prototype.mul = function mul(a, b) {
	  this._verify2(a, b);
	  return this.imod(a.mul(b));
	};

	Red.prototype.isqr = function isqr(a) {
	  return this.imul(a, a);
	};

	Red.prototype.sqr = function sqr(a) {
	  return this.mul(a, a);
	};

	Red.prototype.sqrt = function sqrt(a) {
	  if (a.cmpn(0) === 0)
	    return a.clone();

	  var mod3 = this.m.andln(3);
	  assert(mod3 % 2 === 1);

	  // Fast case
	  if (mod3 === 3) {
	    var pow = this.m.add(new BN(1)).ishrn(2);
	    var r = this.pow(a, pow);
	    return r;
	  }

	  // Tonelli-Shanks algorithm (Totally unoptimized and slow)
	  //
	  // Find Q and S, that Q * 2 ^ S = (P - 1)
	  var q = this.m.subn(1);
	  var s = 0;
	  while (q.cmpn(0) !== 0 && q.andln(1) === 0) {
	    s++;
	    q.ishrn(1);
	  }
	  assert(q.cmpn(0) !== 0);

	  var one = new BN(1).toRed(this);
	  var nOne = one.redNeg();

	  // Find quadratic non-residue
	  // NOTE: Max is such because of generalized Riemann hypothesis.
	  var lpow = this.m.subn(1).ishrn(1);
	  var z = this.m.bitLength();
	  z = new BN(2 * z * z).toRed(this);
	  while (this.pow(z, lpow).cmp(nOne) !== 0)
	    z.redIAdd(nOne);

	  var c = this.pow(z, q);
	  var r = this.pow(a, q.addn(1).ishrn(1));
	  var t = this.pow(a, q);
	  var m = s;
	  while (t.cmp(one) !== 0) {
	    var tmp = t;
	    for (var i = 0; tmp.cmp(one) !== 0; i++)
	      tmp = tmp.redSqr();
	    assert(i < m);
	    var b = this.pow(c, new BN(1).ishln(m - i - 1));

	    r = r.redMul(b);
	    c = b.redSqr();
	    t = t.redMul(c);
	    m = i;
	  }

	  return r;
	};

	Red.prototype.invm = function invm(a) {
	  var inv = a._invmp(this.m);
	  if (inv.sign) {
	    inv.sign = false;
	    return this.imod(inv).redNeg();
	  } else {
	    return this.imod(inv);
	  }
	};

	Red.prototype.pow = function pow(a, num) {
	  var w = [];

	  if (num.cmpn(0) === 0)
	    return new BN(1);

	  var q = num.clone();

	  while (q.cmpn(0) !== 0) {
	    w.push(q.andln(1));
	    q.ishrn(1);
	  }

	  // Skip leading zeroes
	  var res = a;
	  for (var i = 0; i < w.length; i++, res = this.sqr(res))
	    if (w[i] !== 0)
	      break;

	  if (++i < w.length) {
	    for (var q = this.sqr(res); i < w.length; i++, q = this.sqr(q)) {
	      if (w[i] === 0)
	        continue;
	      res = this.mul(res, q);
	    }
	  }

	  return res;
	};

	Red.prototype.convertTo = function convertTo(num) {
	  var r = num.mod(this.m);
	  if (r === num)
	    return r.clone();
	  else
	    return r;
	};

	Red.prototype.convertFrom = function convertFrom(num) {
	  var res = num.clone();
	  res.red = null;
	  return res;
	};

	//
	// Montgomery method engine
	//

	BN.mont = function mont(num) {
	  return new Mont(num);
	};

	function Mont(m) {
	  Red.call(this, m);

	  this.shift = this.m.bitLength();
	  if (this.shift % 26 !== 0)
	    this.shift += 26 - (this.shift % 26);
	  this.r = new BN(1).ishln(this.shift);
	  this.r2 = this.imod(this.r.sqr());
	  this.rinv = this.r._invmp(this.m);

	  this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
	  this.minv.sign = true;
	  this.minv = this.minv.mod(this.r);
	}
	inherits(Mont, Red);

	Mont.prototype.convertTo = function convertTo(num) {
	  return this.imod(num.shln(this.shift));
	};

	Mont.prototype.convertFrom = function convertFrom(num) {
	  var r = this.imod(num.mul(this.rinv));
	  r.red = null;
	  return r;
	};

	Mont.prototype.imul = function imul(a, b) {
	  if (a.cmpn(0) === 0 || b.cmpn(0) === 0) {
	    a.words[0] = 0;
	    a.length = 1;
	    return a;
	  }

	  var t = a.imul(b);
	  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	  var u = t.isub(c).ishrn(this.shift);
	  var res = u;
	  if (u.cmp(this.m) >= 0)
	    res = u.isub(this.m);
	  else if (u.cmpn(0) < 0)
	    res = u.iadd(this.m);

	  return res._forceRed(this);
	};

	Mont.prototype.mul = function mul(a, b) {
	  if (a.cmpn(0) === 0 || b.cmpn(0) === 0)
	    return new BN(0)._forceRed(this);

	  var t = a.mul(b);
	  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	  var u = t.isub(c).ishrn(this.shift);
	  var res = u;
	  if (u.cmp(this.m) >= 0)
	    res = u.isub(this.m);
	  else if (u.cmpn(0) < 0)
	    res = u.iadd(this.m);

	  return res._forceRed(this);
	};

	Mont.prototype.invm = function invm(a) {
	  // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
	  var res = this.imod(a._invmp(this.m).mul(this.r2));
	  return res._forceRed(this);
	};

	})(typeof module === 'undefined' || module, this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var asn1 = __webpack_require__(63);
	var inherits = __webpack_require__(66);

	var api = exports;

	api.define = function define(name, body) {
	  return new Entity(name, body);
	};

	function Entity(name, body) {
	  this.name = name;
	  this.body = body;

	  this.decoders = {};
	  this.encoders = {};
	};

	Entity.prototype._createNamed = function createNamed(base) {
	  var named;
	  try {
	    named = __webpack_require__(67).runInThisContext(
	      '(function ' + this.name + '(entity) {\n' +
	      '  this._initNamed(entity);\n' +
	      '})'
	    );
	  } catch (e) {
	    named = function (entity) {
	      this._initNamed(entity);
	    };
	  }
	  inherits(named, base);
	  named.prototype._initNamed = function initnamed(entity) {
	    base.call(this, entity);
	  };

	  return new named(this);
	};

	Entity.prototype._getDecoder = function _getDecoder(enc) {
	  // Lazily create decoder
	  if (!this.decoders.hasOwnProperty(enc))
	    this.decoders[enc] = this._createNamed(asn1.decoders[enc]);
	  return this.decoders[enc];
	};

	Entity.prototype.decode = function decode(data, enc, options) {
	  return this._getDecoder(enc).decode(data, options);
	};

	Entity.prototype._getEncoder = function _getEncoder(enc) {
	  // Lazily create encoder
	  if (!this.encoders.hasOwnProperty(enc))
	    this.encoders[enc] = this._createNamed(asn1.encoders[enc]);
	  return this.encoders[enc];
	};

	Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
	  return this._getEncoder(enc).encode(data, reporter);
	};


/***/ },
/* 66 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(68);

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	function Context() {}
	Context.prototype = {};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    if (!(context instanceof Context)) {
	        throw new TypeError("needs a 'context' argument.");
	    }
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });
	    
	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    var copy = new Context();
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var base = exports;

	base.Reporter = __webpack_require__(70).Reporter;
	base.DecoderBuffer = __webpack_require__(71).DecoderBuffer;
	base.EncoderBuffer = __webpack_require__(71).EncoderBuffer;
	base.Node = __webpack_require__(72);


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);

	function Reporter(options) {
	  this._reporterState = {
	    obj: null,
	    path: [],
	    options: options || {},
	    errors: []
	  };
	}
	exports.Reporter = Reporter;

	Reporter.prototype.isError = function isError(obj) {
	  return obj instanceof ReporterError;
	};

	Reporter.prototype.save = function save() {
	  var state = this._reporterState;

	  return { obj: state.obj, pathLen: state.path.length };
	};

	Reporter.prototype.restore = function restore(data) {
	  var state = this._reporterState;

	  state.obj = data.obj;
	  state.path = state.path.slice(0, data.pathLen);
	};

	Reporter.prototype.enterKey = function enterKey(key) {
	  return this._reporterState.path.push(key);
	};

	Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
	  var state = this._reporterState;

	  state.path = state.path.slice(0, index - 1);
	  if (state.obj !== null)
	    state.obj[key] = value;
	};

	Reporter.prototype.enterObject = function enterObject() {
	  var state = this._reporterState;

	  var prev = state.obj;
	  state.obj = {};
	  return prev;
	};

	Reporter.prototype.leaveObject = function leaveObject(prev) {
	  var state = this._reporterState;

	  var now = state.obj;
	  state.obj = prev;
	  return now;
	};

	Reporter.prototype.error = function error(msg) {
	  var err;
	  var state = this._reporterState;

	  var inherited = msg instanceof ReporterError;
	  if (inherited) {
	    err = msg;
	  } else {
	    err = new ReporterError(state.path.map(function(elem) {
	      return '[' + JSON.stringify(elem) + ']';
	    }).join(''), msg.message || msg, msg.stack);
	  }

	  if (!state.options.partial)
	    throw err;

	  if (!inherited)
	    state.errors.push(err);

	  return err;
	};

	Reporter.prototype.wrapResult = function wrapResult(result) {
	  var state = this._reporterState;
	  if (!state.options.partial)
	    return result;

	  return {
	    result: this.isError(result) ? null : result,
	    errors: state.errors
	  };
	};

	function ReporterError(path, msg) {
	  this.path = path;
	  this.rethrow(msg);
	};
	inherits(ReporterError, Error);

	ReporterError.prototype.rethrow = function rethrow(msg) {
	  this.message = msg + ' at: ' + (this.path || '(shallow)');
	  Error.captureStackTrace(this, ReporterError);

	  return this;
	};


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);
	var Reporter = __webpack_require__(69).Reporter;
	var Buffer = __webpack_require__(5).Buffer;

	function DecoderBuffer(base, options) {
	  Reporter.call(this, options);
	  if (!Buffer.isBuffer(base)) {
	    this.error('Input not Buffer');
	    return;
	  }

	  this.base = base;
	  this.offset = 0;
	  this.length = base.length;
	}
	inherits(DecoderBuffer, Reporter);
	exports.DecoderBuffer = DecoderBuffer;

	DecoderBuffer.prototype.save = function save() {
	  return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
	};

	DecoderBuffer.prototype.restore = function restore(save) {
	  // Return skipped data
	  var res = new DecoderBuffer(this.base);
	  res.offset = save.offset;
	  res.length = this.offset;

	  this.offset = save.offset;
	  Reporter.prototype.restore.call(this, save.reporter);

	  return res;
	};

	DecoderBuffer.prototype.isEmpty = function isEmpty() {
	  return this.offset === this.length;
	};

	DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
	  if (this.offset + 1 <= this.length)
	    return this.base.readUInt8(this.offset++, true);
	  else
	    return this.error(fail || 'DecoderBuffer overrun');
	}

	DecoderBuffer.prototype.skip = function skip(bytes, fail) {
	  if (!(this.offset + bytes <= this.length))
	    return this.error(fail || 'DecoderBuffer overrun');

	  var res = new DecoderBuffer(this.base);

	  // Share reporter state
	  res._reporterState = this._reporterState;

	  res.offset = this.offset;
	  res.length = this.offset + bytes;
	  this.offset += bytes;
	  return res;
	}

	DecoderBuffer.prototype.raw = function raw(save) {
	  return this.base.slice(save ? save.offset : this.offset, this.length);
	}

	function EncoderBuffer(value, reporter) {
	  if (Array.isArray(value)) {
	    this.length = 0;
	    this.value = value.map(function(item) {
	      if (!(item instanceof EncoderBuffer))
	        item = new EncoderBuffer(item, reporter);
	      this.length += item.length;
	      return item;
	    }, this);
	  } else if (typeof value === 'number') {
	    if (!(0 <= value && value <= 0xff))
	      return reporter.error('non-byte EncoderBuffer value');
	    this.value = value;
	    this.length = 1;
	  } else if (typeof value === 'string') {
	    this.value = value;
	    this.length = Buffer.byteLength(value);
	  } else if (Buffer.isBuffer(value)) {
	    this.value = value;
	    this.length = value.length;
	  } else {
	    return reporter.error('Unsupported type: ' + typeof value);
	  }
	}
	exports.EncoderBuffer = EncoderBuffer;

	EncoderBuffer.prototype.join = function join(out, offset) {
	  if (!out)
	    out = new Buffer(this.length);
	  if (!offset)
	    offset = 0;

	  if (this.length === 0)
	    return out;

	  if (Array.isArray(this.value)) {
	    this.value.forEach(function(item) {
	      item.join(out, offset);
	      offset += item.length;
	    });
	  } else {
	    if (typeof this.value === 'number')
	      out[offset] = this.value;
	    else if (typeof this.value === 'string')
	      out.write(this.value, offset);
	    else if (Buffer.isBuffer(this.value))
	      this.value.copy(out, offset);
	    offset += this.length;
	  }

	  return out;
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var Reporter = __webpack_require__(69).Reporter;
	var EncoderBuffer = __webpack_require__(69).EncoderBuffer;
	var assert = __webpack_require__(73);

	// Supported tags
	var tags = [
	  'seq', 'seqof', 'set', 'setof', 'octstr', 'bitstr', 'objid', 'bool',
	  'gentime', 'utctime', 'null_', 'enum', 'int', 'ia5str', 'utf8str'
	];

	// Public methods list
	var methods = [
	  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
	  'any'
	].concat(tags);

	// Overrided methods list
	var overrided = [
	  '_peekTag', '_decodeTag', '_use',
	  '_decodeStr', '_decodeObjid', '_decodeTime',
	  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

	  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
	  '_encodeNull', '_encodeInt', '_encodeBool'
	];

	function Node(enc, parent) {
	  var state = {};
	  this._baseState = state;

	  state.enc = enc;

	  state.parent = parent || null;
	  state.children = null;

	  // State
	  state.tag = null;
	  state.args = null;
	  state.reverseArgs = null;
	  state.choice = null;
	  state.optional = false;
	  state.any = false;
	  state.obj = false;
	  state.use = null;
	  state.useDecoder = null;
	  state.key = null;
	  state['default'] = null;
	  state.explicit = null;
	  state.implicit = null;

	  // Should create new instance on each method
	  if (!state.parent) {
	    state.children = [];
	    this._wrap();
	  }
	}
	module.exports = Node;

	var stateProps = [
	  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
	  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
	  'implicit'
	];

	Node.prototype.clone = function clone() {
	  var state = this._baseState;
	  var cstate = {};
	  stateProps.forEach(function(prop) {
	    cstate[prop] = state[prop];
	  });
	  var res = new this.constructor(cstate.parent);
	  res._baseState = cstate;
	  return res;
	};

	Node.prototype._wrap = function wrap() {
	  var state = this._baseState;
	  methods.forEach(function(method) {
	    this[method] = function _wrappedMethod() {
	      var clone = new this.constructor(this);
	      state.children.push(clone);
	      return clone[method].apply(clone, arguments);
	    };
	  }, this);
	};

	Node.prototype._init = function init(body) {
	  var state = this._baseState;

	  assert(state.parent === null);
	  body.call(this);

	  // Filter children
	  state.children = state.children.filter(function(child) {
	    return child._baseState.parent === this;
	  }, this);
	  assert.equal(state.children.length, 1, 'Root node can have only one child');
	};

	Node.prototype._useArgs = function useArgs(args) {
	  var state = this._baseState;

	  // Filter children and args
	  var children = args.filter(function(arg) {
	    return arg instanceof this.constructor;
	  }, this);
	  args = args.filter(function(arg) {
	    return !(arg instanceof this.constructor);
	  }, this);

	  if (children.length !== 0) {
	    assert(state.children === null);
	    state.children = children;

	    // Replace parent to maintain backward link
	    children.forEach(function(child) {
	      child._baseState.parent = this;
	    }, this);
	  }
	  if (args.length !== 0) {
	    assert(state.args === null);
	    state.args = args;
	    state.reverseArgs = args.map(function(arg) {
	      if (typeof arg !== 'object' || arg.constructor !== Object)
	        return arg;

	      var res = {};
	      Object.keys(arg).forEach(function(key) {
	        if (key == (key | 0))
	          key |= 0;
	        var value = arg[key];
	        res[value] = key;
	      });
	      return res;
	    });
	  }
	};

	//
	// Overrided methods
	//

	overrided.forEach(function(method) {
	  Node.prototype[method] = function _overrided() {
	    var state = this._baseState;
	    throw new Error(method + ' not implemented for encoding: ' + state.enc);
	  };
	});

	//
	// Public methods
	//

	tags.forEach(function(tag) {
	  Node.prototype[tag] = function _tagMethod() {
	    var state = this._baseState;
	    var args = Array.prototype.slice.call(arguments);

	    assert(state.tag === null);
	    state.tag = tag;

	    this._useArgs(args);

	    return this;
	  };
	});

	Node.prototype.use = function use(item) {
	  var state = this._baseState;

	  assert(state.use === null);
	  state.use = item;

	  return this;
	};

	Node.prototype.optional = function optional() {
	  var state = this._baseState;

	  state.optional = true;

	  return this;
	};

	Node.prototype.def = function def(val) {
	  var state = this._baseState;

	  assert(state['default'] === null);
	  state['default'] = val;
	  state.optional = true;

	  return this;
	};

	Node.prototype.explicit = function explicit(num) {
	  var state = this._baseState;

	  assert(state.explicit === null && state.implicit === null);
	  state.explicit = num;

	  return this;
	};

	Node.prototype.implicit = function implicit(num) {
	  var state = this._baseState;

	  assert(state.explicit === null && state.implicit === null);
	  state.implicit = num;

	  return this;
	};

	Node.prototype.obj = function obj() {
	  var state = this._baseState;
	  var args = Array.prototype.slice.call(arguments);

	  state.obj = true;

	  if (args.length !== 0)
	    this._useArgs(args);

	  return this;
	};

	Node.prototype.key = function key(newKey) {
	  var state = this._baseState;

	  assert(state.key === null);
	  state.key = newKey;

	  return this;
	};

	Node.prototype.any = function any() {
	  var state = this._baseState;

	  state.any = true;

	  return this;
	};

	Node.prototype.choice = function choice(obj) {
	  var state = this._baseState;

	  assert(state.choice === null);
	  state.choice = obj;
	  this._useArgs(Object.keys(obj).map(function(key) {
	    return obj[key];
	  }));

	  return this;
	};

	//
	// Decoding
	//

	Node.prototype._decode = function decode(input) {
	  var state = this._baseState;

	  // Decode root node
	  if (state.parent === null)
	    return input.wrapResult(state.children[0]._decode(input));

	  var result = state['default'];
	  var present = true;

	  var prevKey;
	  if (state.key !== null)
	    prevKey = input.enterKey(state.key);

	  // Check if tag is there
	  if (state.optional) {
	    var tag = null;
	    if (state.explicit !== null)
	      tag = state.explicit;
	    else if (state.implicit !== null)
	      tag = state.implicit;
	    else if (state.tag !== null)
	      tag = state.tag;

	    if (tag === null && !state.any) {
	      // Trial and Error
	      var save = input.save();
	      try {
	        if (state.choice === null)
	          this._decodeGeneric(state.tag, input);
	        else
	          this._decodeChoice(input);
	        present = true;
	      } catch (e) {
	        present = false;
	      }
	      input.restore(save);
	    } else {
	      present = this._peekTag(input, tag, state.any);

	      if (input.isError(present))
	        return present;
	    }
	  }

	  // Push object on stack
	  var prevObj;
	  if (state.obj && present)
	    prevObj = input.enterObject();

	  if (present) {
	    // Unwrap explicit values
	    if (state.explicit !== null) {
	      var explicit = this._decodeTag(input, state.explicit);
	      if (input.isError(explicit))
	        return explicit;
	      input = explicit;
	    }

	    // Unwrap implicit and normal values
	    if (state.use === null && state.choice === null) {
	      if (state.any)
	        var save = input.save();
	      var body = this._decodeTag(
	        input,
	        state.implicit !== null ? state.implicit : state.tag,
	        state.any
	      );
	      if (input.isError(body))
	        return body;

	      if (state.any)
	        result = input.raw(save);
	      else
	        input = body;
	    }

	    // Select proper method for tag
	    if (state.any)
	      result = result;
	    else if (state.choice === null)
	      result = this._decodeGeneric(state.tag, input);
	    else
	      result = this._decodeChoice(input);

	    if (input.isError(result))
	      return result;

	    // Decode children
	    if (!state.any && state.choice === null && state.children !== null) {
	      var fail = state.children.some(function decodeChildren(child) {
	        // NOTE: We are ignoring errors here, to let parser continue with other
	        // parts of encoded data
	        child._decode(input);
	      });
	      if (fail)
	        return err;
	    }
	  }

	  // Pop object
	  if (state.obj && present)
	    result = input.leaveObject(prevObj);

	  // Set key
	  if (state.key !== null && (result !== null || present === true))
	    input.leaveKey(prevKey, state.key, result);

	  return result;
	};

	Node.prototype._decodeGeneric = function decodeGeneric(tag, input) {
	  var state = this._baseState;

	  if (tag === 'seq' || tag === 'set')
	    return null;
	  if (tag === 'seqof' || tag === 'setof')
	    return this._decodeList(input, tag, state.args[0]);
	  else if (tag === 'octstr' || tag === 'bitstr')
	    return this._decodeStr(input, tag);
	  else if (tag === 'ia5str' || tag === 'utf8str')
	    return this._decodeStr(input, tag);
	  else if (tag === 'objid' && state.args)
	    return this._decodeObjid(input, state.args[0], state.args[1]);
	  else if (tag === 'objid')
	    return this._decodeObjid(input, null, null);
	  else if (tag === 'gentime' || tag === 'utctime')
	    return this._decodeTime(input, tag);
	  else if (tag === 'null_')
	    return this._decodeNull(input);
	  else if (tag === 'bool')
	    return this._decodeBool(input);
	  else if (tag === 'int' || tag === 'enum')
	    return this._decodeInt(input, state.args && state.args[0]);
	  else if (state.use !== null)
	    return this._getUse(state.use, input._reporterState.obj)._decode(input);
	  else
	    return input.error('unknown tag: ' + tag);

	  return null;
	};

	Node.prototype._getUse = function _getUse(entity, obj) {

	  var state = this._baseState;
	  // Create altered use decoder if implicit is set
	  state.useDecoder = this._use(entity, obj);
	  assert(state.useDecoder._baseState.parent === null);
	  state.useDecoder = state.useDecoder._baseState.children[0];
	  if (state.implicit !== state.useDecoder._baseState.implicit) {
	    state.useDecoder = state.useDecoder.clone();
	    state.useDecoder._baseState.implicit = state.implicit;
	  }
	  return state.useDecoder;
	};

	Node.prototype._decodeChoice = function decodeChoice(input) {
	  var state = this._baseState;
	  var result = null;
	  var match = false;

	  Object.keys(state.choice).some(function(key) {
	    var save = input.save();
	    var node = state.choice[key];
	    try {
	      var value = node._decode(input);
	      if (input.isError(value))
	        return false;

	      result = { type: key, value: value };
	      match = true;
	    } catch (e) {
	      input.restore(save);
	      return false;
	    }
	    return true;
	  }, this);

	  if (!match)
	    return input.error('Choice not matched');

	  return result;
	};

	//
	// Encoding
	//

	Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
	  return new EncoderBuffer(data, this.reporter);
	};

	Node.prototype._encode = function encode(data, reporter, parent) {
	  var state = this._baseState;
	  if (state['default'] !== null && state['default'] === data)
	    return;

	  var result = this._encodeValue(data, reporter, parent);
	  if (result === undefined)
	    return;

	  if (this._skipDefault(result, reporter, parent))
	    return;

	  return result;
	};

	Node.prototype._encodeValue = function encode(data, reporter, parent) {
	  var state = this._baseState;

	  // Decode root node
	  if (state.parent === null)
	    return state.children[0]._encode(data, reporter || new Reporter());

	  var result = null;
	  var present = true;

	  // Set reporter to share it with a child class
	  this.reporter = reporter;

	  // Check if data is there
	  if (state.optional && data === undefined) {
	    if (state['default'] !== null)
	      data = state['default']
	    else
	      return;
	  }

	  // For error reporting
	  var prevKey;

	  // Encode children first
	  var content = null;
	  var primitive = false;
	  if (state.any) {
	    // Anything that was given is translated to buffer
	    result = this._createEncoderBuffer(data);
	  } else if (state.choice) {
	    result = this._encodeChoice(data, reporter);
	  } else if (state.children) {
	    content = state.children.map(function(child) {
	      if (child._baseState.tag === 'null_')
	        return child._encode(null, reporter, data);

	      if (child._baseState.key === null)
	        return reporter.error('Child should have a key');
	      var prevKey = reporter.enterKey(child._baseState.key);

	      if (typeof data !== 'object')
	        return reporter.error('Child expected, but input is not object');

	      var res = child._encode(data[child._baseState.key], reporter, data);
	      reporter.leaveKey(prevKey);

	      return res;
	    }, this).filter(function(child) {
	      return child;
	    });

	    content = this._createEncoderBuffer(content);
	  } else {
	    if (state.tag === 'seqof' || state.tag === 'setof') {
	      // TODO(indutny): this should be thrown on DSL level
	      if (!(state.args && state.args.length === 1))
	        return reporter.error('Too many args for : ' + state.tag);

	      if (!Array.isArray(data))
	        return reporter.error('seqof/setof, but data is not Array');

	      var child = this.clone();
	      child._baseState.implicit = null;
	      content = this._createEncoderBuffer(data.map(function(item) {
	        var state = this._baseState;

	        return this._getUse(state.args[0], data)._encode(item, reporter);
	      }, child));
	    } else if (state.use !== null) {
	      result = this._getUse(state.use, parent)._encode(data, reporter);
	    } else {
	      content = this._encodePrimitive(state.tag, data);
	      primitive = true;
	    }
	  }

	  // Encode data itself
	  var result;
	  if (!state.any && state.choice === null) {
	    var tag = state.implicit !== null ? state.implicit : state.tag;
	    var cls = state.implicit === null ? 'universal' : 'context';

	    if (tag === null) {
	      if (state.use === null)
	        reporter.error('Tag could be ommited only for .use()');
	    } else {
	      if (state.use === null)
	        result = this._encodeComposite(tag, primitive, cls, content);
	    }
	  }

	  // Wrap in explicit
	  if (state.explicit !== null)
	    result = this._encodeComposite(state.explicit, false, 'context', result);

	  return result;
	};

	Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
	  var state = this._baseState;

	  var node = state.choice[data.type];
	  if (!node) {
	    assert(
	        false,
	        data.type + ' not found in ' +
	            JSON.stringify(Object.keys(state.choice)));
	  }
	  return node._encode(data.value, reporter);
	};

	Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
	  var state = this._baseState;

	  if (tag === 'octstr' || tag === 'bitstr' || tag === 'ia5str')
	    return this._encodeStr(data, tag);
	  else if (tag === 'utf8str')
	    return this._encodeStr(data, tag);
	  else if (tag === 'objid' && state.args)
	    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
	  else if (tag === 'objid')
	    return this._encodeObjid(data, null, null);
	  else if (tag === 'gentime' || tag === 'utctime')
	    return this._encodeTime(data, tag);
	  else if (tag === 'null_')
	    return this._encodeNull();
	  else if (tag === 'int' || tag === 'enum')
	    return this._encodeInt(data, state.args && state.reverseArgs[0]);
	  else if (tag === 'bool')
	    return this._encodeBool(data);
	  else
	    throw new Error('Unsupported tag: ' + tag);
	};


/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = assert;

	function assert(val, msg) {
	  if (!val)
	    throw new Error(msg || 'Assertion failed');
	}

	assert.equal = function assertEqual(l, r, msg) {
	  if (l != r)
	    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var constants = exports;

	// Helper
	constants._reverse = function reverse(map) {
	  var res = {};

	  Object.keys(map).forEach(function(key) {
	    // Convert key to integer if it is stringified
	    if ((key | 0) == key)
	      key = key | 0;

	    var value = map[key];
	    res[value] = key;
	  });

	  return res;
	};

	constants.der = __webpack_require__(75);


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var constants = __webpack_require__(74);

	exports.tagClass = {
	  0: 'universal',
	  1: 'application',
	  2: 'context',
	  3: 'private'
	};
	exports.tagClassByName = constants._reverse(exports.tagClass);

	exports.tag = {
	  0x00: 'end',
	  0x01: 'bool',
	  0x02: 'int',
	  0x03: 'bitstr',
	  0x04: 'octstr',
	  0x05: 'null_',
	  0x06: 'objid',
	  0x07: 'objDesc',
	  0x08: 'external',
	  0x09: 'real',
	  0x0a: 'enum',
	  0x0b: 'embed',
	  0x0c: 'utf8str',
	  0x0d: 'relativeOid',
	  0x10: 'seq',
	  0x11: 'set',
	  0x12: 'numstr',
	  0x13: 'printstr',
	  0x14: 't61str',
	  0x15: 'videostr',
	  0x16: 'ia5str',
	  0x17: 'utctime',
	  0x18: 'gentime',
	  0x19: 'graphstr',
	  0x1a: 'iso646str',
	  0x1b: 'genstr',
	  0x1c: 'unistr',
	  0x1d: 'charstr',
	  0x1e: 'bmpstr'
	};
	exports.tagByName = constants._reverse(exports.tag);


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var decoders = exports;

	decoders.der = __webpack_require__(77);
	decoders.pem = __webpack_require__(78);


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);

	var asn1 = __webpack_require__(63);
	var base = asn1.base;
	var bignum = asn1.bignum;

	// Import DER constants
	var der = asn1.constants.der;

	function DERDecoder(entity) {
	  this.enc = 'der';
	  this.name = entity.name;
	  this.entity = entity;

	  // Construct base tree
	  this.tree = new DERNode();
	  this.tree._init(entity.body);
	};
	module.exports = DERDecoder;

	DERDecoder.prototype.decode = function decode(data, options) {
	  if (!(data instanceof base.DecoderBuffer))
	    data = new base.DecoderBuffer(data, options);

	  return this.tree._decode(data, options);
	};

	// Tree methods

	function DERNode(parent) {
	  base.Node.call(this, 'der', parent);
	}
	inherits(DERNode, base.Node);

	DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
	  if (buffer.isEmpty())
	    return false;

	  var state = buffer.save();
	  var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
	  if (buffer.isError(decodedTag))
	    return decodedTag;

	  buffer.restore(state);

	  return decodedTag.tag === tag || decodedTag.tagStr === tag || any;
	};

	DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
	  var decodedTag = derDecodeTag(buffer,
	                                'Failed to decode tag of "' + tag + '"');
	  if (buffer.isError(decodedTag))
	    return decodedTag;

	  var len = derDecodeLen(buffer,
	                         decodedTag.primitive,
	                         'Failed to get length of "' + tag + '"');

	  // Failure
	  if (buffer.isError(len))
	    return len;

	  if (!any &&
	      decodedTag.tag !== tag &&
	      decodedTag.tagStr !== tag &&
	      decodedTag.tagStr + 'of' !== tag) {
	    return buffer.error('Failed to match tag: "' + tag + '"');
	  }

	  if (decodedTag.primitive || len !== null)
	    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

	  // Indefinite length... find END tag
	  var state = buffer.save();
	  var res = this._skipUntilEnd(
	      buffer,
	      'Failed to skip indefinite length body: "' + this.tag + '"');
	  if (buffer.isError(res))
	    return res;

	  len = buffer.offset - state.offset;
	  buffer.restore(state);
	  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
	};

	DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
	  while (true) {
	    var tag = derDecodeTag(buffer, fail);
	    if (buffer.isError(tag))
	      return tag;
	    var len = derDecodeLen(buffer, tag.primitive, fail);
	    if (buffer.isError(len))
	      return len;

	    var res;
	    if (tag.primitive || len !== null)
	      res = buffer.skip(len)
	    else
	      res = this._skipUntilEnd(buffer, fail);

	    // Failure
	    if (buffer.isError(res))
	      return res;

	    if (tag.tagStr === 'end')
	      break;
	  }
	};

	DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder) {
	  var result = [];
	  while (!buffer.isEmpty()) {
	    var possibleEnd = this._peekTag(buffer, 'end');
	    if (buffer.isError(possibleEnd))
	      return possibleEnd;

	    var res = decoder.decode(buffer, 'der');
	    if (buffer.isError(res) && possibleEnd)
	      break;
	    result.push(res);
	  }
	  return result;
	};

	DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
	  if (tag === 'octstr') {
	    return buffer.raw();
	  } else if (tag === 'bitstr') {
	    var unused = buffer.readUInt8();
	    if (buffer.isError(unused))
	      return unused;

	    return { unused: unused, data: buffer.raw() };
	  } else if (tag === 'ia5str' || tag === 'utf8str') {
	    return buffer.raw().toString();
	  } else {
	    return this.error('Decoding of string type: ' + tag + ' unsupported');
	  }
	};

	DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
	  var identifiers = [];
	  var ident = 0;
	  while (!buffer.isEmpty()) {
	    var subident = buffer.readUInt8();
	    ident <<= 7;
	    ident |= subident & 0x7f;
	    if ((subident & 0x80) === 0) {
	      identifiers.push(ident);
	      ident = 0;
	    }
	  }
	  if (subident & 0x80)
	    identifiers.push(ident);

	  var first = (identifiers[0] / 40) | 0;
	  var second = identifiers[0] % 40;

	  if (relative)
	    result = identifiers;
	  else
	    result = [first, second].concat(identifiers.slice(1));

	  if (values)
	    result = values[result.join(' ')];

	  return result;
	};

	DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
	  var str = buffer.raw().toString();
	  if (tag === 'gentime') {
	    var year = str.slice(0, 4) | 0;
	    var mon = str.slice(4, 6) | 0;
	    var day = str.slice(6, 8) | 0;
	    var hour = str.slice(8, 10) | 0;
	    var min = str.slice(10, 12) | 0;
	    var sec = str.slice(12, 14) | 0;
	  } else if (tag === 'utctime') {
	    var year = str.slice(0, 2) | 0;
	    var mon = str.slice(2, 4) | 0;
	    var day = str.slice(4, 6) | 0;
	    var hour = str.slice(6, 8) | 0;
	    var min = str.slice(8, 10) | 0;
	    var sec = str.slice(10, 12) | 0;
	    if (year < 70)
	      year = 2000 + year;
	    else
	      year = 1900 + year;
	  } else {
	    return this.error('Decoding ' + tag + ' time is not supported yet');
	  }

	  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
	};

	DERNode.prototype._decodeNull = function decodeNull(buffer) {
	  return null;
	};

	DERNode.prototype._decodeBool = function decodeBool(buffer) {
	  var res = buffer.readUInt8();
	  if (buffer.isError(res))
	    return res;
	  else
	    return res !== 0;
	};

	DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
	  // Bigint, return as it is (assume big endian)
	  var raw = buffer.raw();
	  var res = new bignum(raw);

	  if (values)
	    res = values[res.toString(10)] || res;

	  return res;
	};

	DERNode.prototype._use = function use(entity, obj) {
	  if (typeof entity === 'function')
	    entity = entity(obj);
	  return entity._getDecoder('der').tree;
	};

	// Utility methods

	function derDecodeTag(buf, fail) {
	  var tag = buf.readUInt8(fail);
	  if (buf.isError(tag))
	    return tag;

	  var cls = der.tagClass[tag >> 6];
	  var primitive = (tag & 0x20) === 0;

	  // Multi-octet tag - load
	  if ((tag & 0x1f) === 0x1f) {
	    var oct = tag;
	    tag = 0;
	    while ((oct & 0x80) === 0x80) {
	      oct = buf.readUInt8(fail);
	      if (buf.isError(oct))
	        return oct;

	      tag <<= 7;
	      tag |= oct & 0x7f;
	    }
	  } else {
	    tag &= 0x1f;
	  }
	  var tagStr = der.tag[tag];

	  return {
	    cls: cls,
	    primitive: primitive,
	    tag: tag,
	    tagStr: tagStr
	  };
	}

	function derDecodeLen(buf, primitive, fail) {
	  var len = buf.readUInt8(fail);
	  if (buf.isError(len))
	    return len;

	  // Indefinite form
	  if (!primitive && len === 0x80)
	    return null;

	  // Definite form
	  if ((len & 0x80) === 0) {
	    // Short form
	    return len;
	  }

	  // Long form
	  var num = len & 0x7f;
	  if (num >= 4)
	    return buf.error('length octect is too long');

	  len = 0;
	  for (var i = 0; i < num; i++) {
	    len <<= 8;
	    var j = buf.readUInt8(fail);
	    if (buf.isError(j))
	      return j;
	    len |= j;
	  }

	  return len;
	}


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);
	var Buffer = __webpack_require__(5).Buffer;

	var asn1 = __webpack_require__(63);
	var DERDecoder = __webpack_require__(77);

	function PEMDecoder(entity) {
	  DERDecoder.call(this, entity);
	  this.enc = 'pem';
	};
	inherits(PEMDecoder, DERDecoder);
	module.exports = PEMDecoder;

	PEMDecoder.prototype.decode = function decode(data, options) {
	  var lines = data.toString().split(/[\r\n]+/g);

	  var label = options.label.toUpperCase();

	  var re = /^-----(BEGIN|END) ([^-]+)-----$/;
	  var start = -1;
	  var end = -1;
	  for (var i = 0; i < lines.length; i++) {
	    var match = lines[i].match(re);
	    if (match === null)
	      continue;

	    if (match[2] !== label)
	      continue;

	    if (start === -1) {
	      if (match[1] !== 'BEGIN')
	        break;
	      start = i;
	    } else {
	      if (match[1] !== 'END')
	        break;
	      end = i;
	      break;
	    }
	  }
	  if (start === -1 || end === -1)
	    throw new Error('PEM section not found for: ' + label);

	  var base64 = lines.slice(start + 1, end).join('');
	  // Remove excessive symbols
	  base64.replace(/[^a-z0-9\+\/=]+/gi, '');

	  var input = new Buffer(base64, 'base64');
	  return DERDecoder.prototype.decode.call(this, input, options);
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var encoders = exports;

	encoders.der = __webpack_require__(80);
	encoders.pem = __webpack_require__(81);


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);
	var Buffer = __webpack_require__(5).Buffer;

	var asn1 = __webpack_require__(63);
	var base = asn1.base;
	var bignum = asn1.bignum;

	// Import DER constants
	var der = asn1.constants.der;

	function DEREncoder(entity) {
	  this.enc = 'der';
	  this.name = entity.name;
	  this.entity = entity;

	  // Construct base tree
	  this.tree = new DERNode();
	  this.tree._init(entity.body);
	};
	module.exports = DEREncoder;

	DEREncoder.prototype.encode = function encode(data, reporter) {
	  return this.tree._encode(data, reporter).join();
	};

	// Tree methods

	function DERNode(parent) {
	  base.Node.call(this, 'der', parent);
	}
	inherits(DERNode, base.Node);

	DERNode.prototype._encodeComposite = function encodeComposite(tag,
	                                                              primitive,
	                                                              cls,
	                                                              content) {
	  var encodedTag = encodeTag(tag, primitive, cls, this.reporter);

	  // Short form
	  if (content.length < 0x80) {
	    var header = new Buffer(2);
	    header[0] = encodedTag;
	    header[1] = content.length;
	    return this._createEncoderBuffer([ header, content ]);
	  }

	  // Long form
	  // Count octets required to store length
	  var lenOctets = 1;
	  for (var i = content.length; i >= 0x100; i >>= 8)
	    lenOctets++;

	  var header = new Buffer(1 + 1 + lenOctets);
	  header[0] = encodedTag;
	  header[1] = 0x80 | lenOctets;

	  for (var i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
	    header[i] = j & 0xff;

	  return this._createEncoderBuffer([ header, content ]);
	};

	DERNode.prototype._encodeStr = function encodeStr(str, tag) {
	  if (tag === 'octstr')
	    return this._createEncoderBuffer(str);
	  else if (tag === 'bitstr')
	    return this._createEncoderBuffer([ str.unused | 0, str.data ]);
	  else if (tag === 'ia5str' || tag === 'utf8str')
	    return this._createEncoderBuffer(str);
	  return this.reporter.error('Encoding of string type: ' + tag +
	                             ' unsupported');
	};

	DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
	  if (typeof id === 'string') {
	    if (!values)
	      return this.reporter.error('string objid given, but no values map found');
	    if (!values.hasOwnProperty(id))
	      return this.reporter.error('objid not found in values map');
	    id = values[id].split(/[\s\.]+/g);
	    for (var i = 0; i < id.length; i++)
	      id[i] |= 0;
	  } else if (Array.isArray(id)) {
	    id = id.slice();
	    for (var i = 0; i < id.length; i++)
	      id[i] |= 0;
	  }

	  if (!Array.isArray(id)) {
	    return this.reporter.error('objid() should be either array or string, ' +
	                               'got: ' + JSON.stringify(id));
	  }

	  if (!relative) {
	    if (id[1] >= 40)
	      return this.reporter.error('Second objid identifier OOB');
	    id.splice(0, 2, id[0] * 40 + id[1]);
	  }

	  // Count number of octets
	  var size = 0;
	  for (var i = 0; i < id.length; i++) {
	    var ident = id[i];
	    for (size++; ident >= 0x80; ident >>= 7)
	      size++;
	  }

	  var objid = new Buffer(size);
	  var offset = objid.length - 1;
	  for (var i = id.length - 1; i >= 0; i--) {
	    var ident = id[i];
	    objid[offset--] = ident & 0x7f;
	    while ((ident >>= 7) > 0)
	      objid[offset--] = 0x80 | (ident & 0x7f);
	  }

	  return this._createEncoderBuffer(objid);
	};

	function two(num) {
	  if (num < 10)
	    return '0' + num;
	  else
	    return num;
	}

	DERNode.prototype._encodeTime = function encodeTime(time, tag) {
	  var str;
	  var date = new Date(time);

	  if (tag === 'gentime') {
	    str = [
	      two(date.getFullYear()),
	      two(date.getUTCMonth() + 1),
	      two(date.getUTCDate()),
	      two(date.getUTCHours()),
	      two(date.getUTCMinutes()),
	      two(date.getUTCSeconds()),
	      'Z'
	    ].join('');
	  } else if (tag === 'utctime') {
	    str = [
	      two(date.getFullYear() % 100),
	      two(date.getUTCMonth() + 1),
	      two(date.getUTCDate()),
	      two(date.getUTCHours()),
	      two(date.getUTCMinutes()),
	      two(date.getUTCSeconds()),
	      'Z'
	    ].join('');
	  } else {
	    this.reporter.error('Encoding ' + tag + ' time is not supported yet');
	  }

	  return this._encodeStr(str, 'octstr');
	};

	DERNode.prototype._encodeNull = function encodeNull() {
	  return this._createEncoderBuffer('');
	};

	DERNode.prototype._encodeInt = function encodeInt(num, values) {
	  if (typeof num === 'string') {
	    if (!values)
	      return this.reporter.error('String int or enum given, but no values map');
	    if (!values.hasOwnProperty(num)) {
	      return this.reporter.error('Values map doesn\'t contain: ' +
	                                 JSON.stringify(num));
	    }
	    num = values[num];
	  }

	  // Bignum, assume big endian
	  if (typeof num !== 'number' && !Buffer.isBuffer(num)) {
	    var numArray = num.toArray();
	    if (num.sign === false && numArray[0] & 0x80) {
	      numArray.unshift(0);
	    }
	    num = new Buffer(numArray);
	  }

	  if (Buffer.isBuffer(num)) {
	    var size = num.length;
	    if (num.length === 0)
	      size++;

	    var out = new Buffer(size);
	    num.copy(out);
	    if (num.length === 0)
	      out[0] = 0
	    return this._createEncoderBuffer(out);
	  }

	  if (num < 0x80)
	    return this._createEncoderBuffer(num);

	  if (num < 0x100)
	    return this._createEncoderBuffer([0, num]);

	  var size = 1;
	  for (var i = num; i >= 0x100; i >>= 8)
	    size++;

	  var out = new Array(size);
	  for (var i = out.length - 1; i >= 0; i--) {
	    out[i] = num & 0xff;
	    num >>= 8;
	  }
	  if(out[0] & 0x80) {
	    out.unshift(0);
	  }

	  return this._createEncoderBuffer(new Buffer(out));
	};

	DERNode.prototype._encodeBool = function encodeBool(value) {
	  return this._createEncoderBuffer(value ? 0xff : 0);
	};

	DERNode.prototype._use = function use(entity, obj) {
	  if (typeof entity === 'function')
	    entity = entity(obj);
	  return entity._getEncoder('der').tree;
	};

	DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
	  var state = this._baseState;
	  var i;
	  if (state['default'] === null)
	    return false;

	  var data = dataBuffer.join();
	  if (state.defaultBuffer === undefined)
	    state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

	  if (data.length !== state.defaultBuffer.length)
	    return false;

	  for (i=0; i < data.length; i++)
	    if (data[i] !== state.defaultBuffer[i])
	      return false;

	  return true;
	};

	// Utility methods

	function encodeTag(tag, primitive, cls, reporter) {
	  var res;

	  if (tag === 'seqof')
	    tag = 'seq';
	  else if (tag === 'setof')
	    tag = 'set';

	  if (der.tagByName.hasOwnProperty(tag))
	    res = der.tagByName[tag];
	  else if (typeof tag === 'number' && (tag | 0) === tag)
	    res = tag;
	  else
	    return reporter.error('Unknown tag: ' + tag);

	  if (res >= 0x1f)
	    return reporter.error('Multi-octet tag encoding unsupported');

	  if (!primitive)
	    res |= 0x20;

	  res |= (der.tagClassByName[cls || 'universal'] << 6);

	  return res;
	}


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(66);
	var Buffer = __webpack_require__(5).Buffer;

	var asn1 = __webpack_require__(63);
	var DEREncoder = __webpack_require__(80);

	function PEMEncoder(entity) {
	  DEREncoder.call(this, entity);
	  this.enc = 'pem';
	};
	inherits(PEMEncoder, DEREncoder);
	module.exports = PEMEncoder;

	PEMEncoder.prototype.encode = function encode(data, options) {
	  var buf = DEREncoder.prototype.encode.call(this, data);

	  var p = buf.toString('base64');
	  var out = [ '-----BEGIN ' + options.label + '-----' ];
	  for (var i = 0; i < p.length; i += 64)
	    out.push(p.slice(i, i + 64));
	  out.push('-----END ' + options.label + '-----');
	  return out.join('\n');
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var base64url = module.exports;

	base64url.unescape = function unescape (str) {
	  return (str + Array(5 - str.length % 4)
	    .join('='))
	    .replace(/\-/g, '+')
	    .replace(/_/g, '/');
	};

	base64url.escape = function escape (str) {
	  return str.replace(/\+/g, '-')
	    .replace(/\//g, '_')
	    .replace(/=/g, '');
	};

	base64url.encode = function encode (str) {
	  return this.escape(new Buffer(str).toString('base64'));
	};

	base64url.decode = function decode (str) {
	  return new Buffer(this.unescape(str), 'base64').toString();
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/*global module*/
	const Buffer = __webpack_require__(5).Buffer;

	module.exports = function toString(obj) {
	  if (typeof obj === 'string')
	    return obj;
	  if (typeof obj === 'number' || Buffer.isBuffer(obj))
	    return obj.toString();
	  return JSON.stringify(obj);
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/*global module*/
	const base64url = __webpack_require__(39);
	const DataStream = __webpack_require__(40);
	const jwa = __webpack_require__(59);
	const Stream = __webpack_require__(41);
	const toString = __webpack_require__(83);
	const util = __webpack_require__(25);
	const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

	function isObject(thing) {
	  return Object.prototype.toString.call(thing) === '[object Object]';
	}

	function safeJsonParse(thing) {
	  if (isObject(thing))
	    return thing;
	  try { return JSON.parse(thing); }
	  catch (e) { return undefined; }
	}

	function headerFromJWS(jwsSig) {
	  const encodedHeader = jwsSig.split('.', 1)[0];
	  return safeJsonParse(base64url.decode(encodedHeader, 'binary'));
	}

	function securedInputFromJWS(jwsSig) {
	  return jwsSig.split('.', 2).join('.');
	}

	function signatureFromJWS(jwsSig) {
	  return jwsSig.split('.')[2];
	}

	function payloadFromJWS(jwsSig, encoding) {
	  encoding = encoding || 'utf8';
	  const payload = jwsSig.split('.')[1];
	  return base64url.decode(payload, encoding);
	}

	function isValidJws(string) {
	  return JWS_REGEX.test(string) && !!headerFromJWS(string);
	}

	function jwsVerify(jwsSig, algorithm, secretOrKey) {
	  if (!algorithm) {
	    var err = new Error("Missing algorithm parameter for jws.verify");
	    err.code = "MISSING_ALGORITHM";
	    throw err;
	  }
	  jwsSig = toString(jwsSig);
	  const signature = signatureFromJWS(jwsSig);
	  const securedInput = securedInputFromJWS(jwsSig);
	  const algo = jwa(algorithm);
	  return algo.verify(securedInput, signature, secretOrKey);
	}

	function jwsDecode(jwsSig, opts) {
	  opts = opts || {};
	  jwsSig = toString(jwsSig);

	  if (!isValidJws(jwsSig))
	    return null;

	  const header = headerFromJWS(jwsSig);

	  if (!header)
	    return null;

	  var payload = payloadFromJWS(jwsSig);
	  if (header.typ === 'JWT' || opts.json)
	    payload = JSON.parse(payload, opts.encoding);

	  return {
	    header: header,
	    payload: payload,
	    signature: signatureFromJWS(jwsSig)
	  };
	}

	function VerifyStream(opts) {
	  opts = opts || {};
	  const secretOrKey = opts.secret||opts.publicKey||opts.key;
	  const secretStream = new DataStream(secretOrKey);
	  this.readable = true;
	  this.algorithm = opts.algorithm;
	  this.encoding = opts.encoding;
	  this.secret = this.publicKey = this.key = secretStream;
	  this.signature = new DataStream(opts.signature);
	  this.secret.once('close', function () {
	    if (!this.signature.writable && this.readable)
	      this.verify();
	  }.bind(this));

	  this.signature.once('close', function () {
	    if (!this.secret.writable && this.readable)
	      this.verify();
	  }.bind(this));
	}
	util.inherits(VerifyStream, Stream);
	VerifyStream.prototype.verify = function verify() {
	  const valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
	  const obj = jwsDecode(this.signature.buffer, this.encoding);
	  this.emit('done', valid, obj);
	  this.emit('data', valid);
	  this.emit('end');
	  this.readable = false;
	  return valid;
	};

	VerifyStream.decode = jwsDecode;
	VerifyStream.isValid = isValidJws;
	VerifyStream.verify = jwsVerify;

	module.exports = VerifyStream;


/***/ },
/* 85 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 86 */
/***/ function(module, exports) {

	var JsonWebTokenError = function (message, error) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'JsonWebTokenError';
	  this.message = message;
	  if (error) this.inner = error;
	};

	JsonWebTokenError.prototype = Object.create(Error.prototype);
	JsonWebTokenError.prototype.constructor = JsonWebTokenError;

	module.exports = JsonWebTokenError;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var JsonWebTokenError = __webpack_require__(86);

	var TokenExpiredError = function (message, expiredAt) {
	  JsonWebTokenError.call(this, message);
	  this.name = 'TokenExpiredError';
	  this.expiredAt = expiredAt;
	};

	TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);

	TokenExpiredError.prototype.constructor = TokenExpiredError;

	module.exports = TokenExpiredError;

/***/ },
/* 88 */
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
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(3);
	var jwt = __webpack_require__(36);
	var qc = __webpack_require__(90);
	var node = typeof(stream) == 'undefined';

	var signing = signing || __webpack_require__(17);

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

	  it('should decode valid jwts headers', function() {
	    expect( qc.forAll( propertyHeaderJSON, arbJWT ) ).to.be(true);
	  });  
	});



/***/ },
/* 90 */
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