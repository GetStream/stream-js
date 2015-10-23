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
	var unitTests = __webpack_require__(104);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var expect = __webpack_require__(3);
	var Faye = __webpack_require__(9);
	var erros = __webpack_require__(11);
	var node = typeof(stream) == 'undefined';

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
	    stream = __webpack_require__(12);
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

	  if(node) {
	    // Server side specific tests

	    it('supports application level authentication', function(done) {
	      this.timeout(6000);  

	      client.makeSignedRequest({
	        url: 'test/auth/digest/'
	      }, wrapCB(200, done));
	    });

	    it('fails application level authentication with wrong keys', function(done) {
	      this.timeout(6000);
	      var client = stream.connect('aap','noot');

	      client.makeSignedRequest({
	        url: 'test/auth/digest/'
	      }, function(error, response, body) {
	        if(error) done(error);
	        if(body.exception === 'ApiKeyException') done();
	      });
	    });

	    it('supports adding activity to multiple feeds', function(done) {
	      this.timeout(6000);

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
	  } else {
	    // Client side specific tests

	    it('shouldn\'t support signed requests on the client', function() {
	      expect(client.makeSignedRequest).to.be(undefined);
	    });
	  }
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	//     GetStream client library for node and the browser
	//     Author: Thierry Schellenbach
	//     BSD License

	var StreamClient = __webpack_require__(13);
	var errors = __webpack_require__(11);
	var request = __webpack_require__(14);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var request = __webpack_require__(14);
	var StreamFeed = __webpack_require__(15);
	var signing = __webpack_require__(17);
	var httpSignature = __webpack_require__(21);
	var errors = __webpack_require__(11);
	var crypto = __webpack_require__(18);
	var utils = __webpack_require__(16);
	var BatchOperations = __webpack_require__(103);

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
	        this.browser = typeof(window) !== 'undefined';
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
	    },

	};

	// If we are in a node environment and batchOperations is available add the methods to the prototype of StreamClient
	if(BatchOperations) {
	  for(var key in BatchOperations) {
	    if(BatchOperations.hasOwnProperty(key)) {
	      StreamClient.prototype[key] = BatchOperations[key];
	    }
	  }
	}

	module.exports = StreamClient;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(11);
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(11);
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
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2015 Joyent, Inc.

	var parser = __webpack_require__(22);
	var signer = __webpack_require__(86);
	var verify = __webpack_require__(102);
	var utils = __webpack_require__(46);



	///--- API

	module.exports = {

	  parse: parser.parseRequest,
	  parseRequest: parser.parseRequest,

	  sign: signer.signRequest,
	  signRequest: signer.signRequest,
	  createSigner: signer.createSigner,
	  isSigner: signer.isSigner,

	  sshKeyToPEM: utils.sshKeyToPEM,
	  sshKeyFingerprint: utils.fingerprint,
	  pemToRsaSSHKey: utils.pemToRsaSSHKey,

	  verify: verify.verifySignature,
	  verifySignature: verify.verifySignature,
	  verifyHMAC: verify.verifyHMAC
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = __webpack_require__(23);
	var util = __webpack_require__(25);
	var utils = __webpack_require__(46);



	///--- Globals

	var HASH_ALGOS = utils.HASH_ALGOS;
	var PK_ALGOS = utils.PK_ALGOS;
	var HttpSignatureError = utils.HttpSignatureError;
	var InvalidAlgorithmError = utils.InvalidAlgorithmError;
	var validateAlgorithm = utils.validateAlgorithm;

	var State = {
	  New: 0,
	  Params: 1
	};

	var ParamsState = {
	  Name: 0,
	  Quote: 1,
	  Value: 2,
	  Comma: 3
	};


	///--- Specific Errors


	function ExpiredRequestError(message) {
	  HttpSignatureError.call(this, message, ExpiredRequestError);
	}
	util.inherits(ExpiredRequestError, HttpSignatureError);


	function InvalidHeaderError(message) {
	  HttpSignatureError.call(this, message, InvalidHeaderError);
	}
	util.inherits(InvalidHeaderError, HttpSignatureError);


	function InvalidParamsError(message) {
	  HttpSignatureError.call(this, message, InvalidParamsError);
	}
	util.inherits(InvalidParamsError, HttpSignatureError);


	function MissingHeaderError(message) {
	  HttpSignatureError.call(this, message, MissingHeaderError);
	}
	util.inherits(MissingHeaderError, HttpSignatureError);

	function StrictParsingError(message) {
	  HttpSignatureError.call(this, message, StrictParsingError);
	}
	util.inherits(StrictParsingError, HttpSignatureError);

	///--- Exported API

	module.exports = {

	  /**
	   * Parses the 'Authorization' header out of an http.ServerRequest object.
	   *
	   * Note that this API will fully validate the Authorization header, and throw
	   * on any error.  It will not however check the signature, or the keyId format
	   * as those are specific to your environment.  You can use the options object
	   * to pass in extra constraints.
	   *
	   * As a response object you can expect this:
	   *
	   *     {
	   *       "scheme": "Signature",
	   *       "params": {
	   *         "keyId": "foo",
	   *         "algorithm": "rsa-sha256",
	   *         "headers": [
	   *           "date" or "x-date",
	   *           "digest"
	   *         ],
	   *         "signature": "base64"
	   *       },
	   *       "signingString": "ready to be passed to crypto.verify()"
	   *     }
	   *
	   * @param {Object} request an http.ServerRequest.
	   * @param {Object} options an optional options object with:
	   *                   - clockSkew: allowed clock skew in seconds (default 300).
	   *                   - headers: required header names (def: date or x-date)
	   *                   - algorithms: algorithms to support (default: all).
	   *                   - strict: should enforce latest spec parsing
	   *                             (default: false).
	   * @return {Object} parsed out object (see above).
	   * @throws {TypeError} on invalid input.
	   * @throws {InvalidHeaderError} on an invalid Authorization header error.
	   * @throws {InvalidParamsError} if the params in the scheme are invalid.
	   * @throws {MissingHeaderError} if the params indicate a header not present,
	   *                              either in the request headers from the params,
	   *                              or not in the params from a required header
	   *                              in options.
	   * @throws {StrictParsingError} if old attributes are used in strict parsing
	   *                              mode.
	   * @throws {ExpiredRequestError} if the value of date or x-date exceeds skew.
	   */
	  parseRequest: function parseRequest(request, options) {
	    assert.object(request, 'request');
	    assert.object(request.headers, 'request.headers');
	    if (options === undefined) {
	      options = {};
	    }
	    if (options.headers === undefined) {
	      options.headers = [request.headers['x-date'] ? 'x-date' : 'date'];
	    }
	    assert.object(options, 'options');
	    assert.arrayOfString(options.headers, 'options.headers');
	    assert.optionalNumber(options.clockSkew, 'options.clockSkew');

	    if (!request.headers.authorization)
	      throw new MissingHeaderError('no authorization header present in ' +
	                                   'the request');

	    options.clockSkew = options.clockSkew || 300;


	    var i = 0;
	    var state = State.New;
	    var substate = ParamsState.Name;
	    var tmpName = '';
	    var tmpValue = '';

	    var parsed = {
	      scheme: '',
	      params: {},
	      signingString: '',

	      get algorithm() {
	        return this.params.algorithm.toUpperCase();
	      },

	      get keyId() {
	        return this.params.keyId;
	      }
	    };

	    var authz = request.headers.authorization;
	    for (i = 0; i < authz.length; i++) {
	      var c = authz.charAt(i);

	      switch (Number(state)) {

	      case State.New:
	        if (c !== ' ') parsed.scheme += c;
	        else state = State.Params;
	        break;

	      case State.Params:
	        switch (Number(substate)) {

	        case ParamsState.Name:
	          var code = c.charCodeAt(0);
	          // restricted name of A-Z / a-z
	          if ((code >= 0x41 && code <= 0x5a) || // A-Z
	              (code >= 0x61 && code <= 0x7a)) { // a-z
	            tmpName += c;
	          } else if (c === '=') {
	            if (tmpName.length === 0)
	              throw new InvalidHeaderError('bad param format');
	            substate = ParamsState.Quote;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        case ParamsState.Quote:
	          if (c === '"') {
	            tmpValue = '';
	            substate = ParamsState.Value;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        case ParamsState.Value:
	          if (c === '"') {
	            parsed.params[tmpName] = tmpValue;
	            substate = ParamsState.Comma;
	          } else {
	            tmpValue += c;
	          }
	          break;

	        case ParamsState.Comma:
	          if (c === ',') {
	            tmpName = '';
	            substate = ParamsState.Name;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        default:
	          throw new Error('Invalid substate');
	        }
	        break;

	      default:
	        throw new Error('Invalid substate');
	      }

	    }

	    if (!parsed.params.headers || parsed.params.headers === '') {
	      if (request.headers['x-date']) {
	        parsed.params.headers = ['x-date'];
	      } else {
	        parsed.params.headers = ['date'];
	      }
	    } else {
	      parsed.params.headers = parsed.params.headers.split(' ');
	    }

	    // Minimally validate the parsed object
	    if (!parsed.scheme || parsed.scheme !== 'Signature')
	      throw new InvalidHeaderError('scheme was not "Signature"');

	    if (!parsed.params.keyId)
	      throw new InvalidHeaderError('keyId was not specified');

	    if (!parsed.params.algorithm)
	      throw new InvalidHeaderError('algorithm was not specified');

	    if (!parsed.params.signature)
	      throw new InvalidHeaderError('signature was not specified');

	    // Check the algorithm against the official list
	    parsed.params.algorithm = parsed.params.algorithm.toLowerCase();
	    try {
	      validateAlgorithm(parsed.params.algorithm);
	    } catch (e) {
	      if (e instanceof InvalidAlgorithmError)
	        throw (new InvalidParamsError(parsed.params.algorithm + ' is not ' +
	          'supported'));
	      else
	        throw (e);
	    }

	    // Build the signingString
	    for (i = 0; i < parsed.params.headers.length; i++) {
	      var h = parsed.params.headers[i].toLowerCase();
	      parsed.params.headers[i] = h;

	      if (h === 'request-line') {
	        if (!options.strict) {
	          /*
	           * We allow headers from the older spec drafts if strict parsing isn't
	           * specified in options.
	           */
	          parsed.signingString +=
	            request.method + ' ' + request.url + ' HTTP/' + request.httpVersion;
	        } else {
	          /* Strict parsing doesn't allow older draft headers. */
	          throw (new StrictParsingError('request-line is not a valid header ' +
	            'with strict parsing enabled.'));
	        }
	      } else if (h === '(request-target)') {
	        parsed.signingString +=
	          '(request-target): ' + request.method.toLowerCase() + ' ' +
	          request.url;
	      } else {
	        var value = request.headers[h];
	        if (value === undefined)
	          throw new MissingHeaderError(h + ' was not in the request');
	        parsed.signingString += h + ': ' + value;
	      }

	      if ((i + 1) < parsed.params.headers.length)
	        parsed.signingString += '\n';
	    }

	    // Check against the constraints
	    var date;
	    if (request.headers.date || request.headers['x-date']) {
	        if (request.headers['x-date']) {
	          date = new Date(request.headers['x-date']);
	        } else {
	          date = new Date(request.headers.date);
	        }
	      var now = new Date();
	      var skew = Math.abs(now.getTime() - date.getTime());

	      if (skew > options.clockSkew * 1000) {
	        throw new ExpiredRequestError('clock skew of ' +
	                                      (skew / 1000) +
	                                      's was greater than ' +
	                                      options.clockSkew + 's');
	      }
	    }

	    options.headers.forEach(function (hdr) {
	      // Remember that we already checked any headers in the params
	      // were in the request, so if this passes we're good.
	      if (parsed.params.headers.indexOf(hdr) < 0)
	        throw new MissingHeaderError(hdr + ' was not a signed header');
	    });

	    if (options.algorithms) {
	      if (options.algorithms.indexOf(parsed.params.algorithm) === -1)
	        throw new InvalidParamsError(parsed.params.algorithm +
	                                     ' is not a supported algorithm');
	    }

	    return parsed;
	  }

	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer) {// Copyright (c) 2012, Mark Cavage. All rights reserved.

	var assert = __webpack_require__(24);
	var Stream = __webpack_require__(28).Stream;
	var util = __webpack_require__(25);



	///--- Globals

	var NDEBUG = process.env.NODE_NDEBUG || false;
	var UUID_REGEXP = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;



	///--- Messages

	var ARRAY_TYPE_REQUIRED = '%s ([%s]) required';
	var TYPE_REQUIRED = '%s (%s) is required';



	///--- Internal

	function capitalize(str) {
	        return (str.charAt(0).toUpperCase() + str.slice(1));
	}

	function uncapitalize(str) {
	        return (str.charAt(0).toLowerCase() + str.slice(1));
	}

	function _() {
	        return (util.format.apply(util, arguments));
	}


	function _assert(arg, type, name, stackFunc) {
	        if (!NDEBUG) {
	                name = name || type;
	                stackFunc = stackFunc || _assert.caller;
	                var t = typeof (arg);

	                if (t !== type) {
	                        throw new assert.AssertionError({
	                                message: _(TYPE_REQUIRED, name, type),
	                                actual: t,
	                                expected: type,
	                                operator: '===',
	                                stackStartFunction: stackFunc
	                        });
	                }
	        }
	}


	function _instanceof(arg, type, name, stackFunc) {
	        if (!NDEBUG) {
	                name = name || type;
	                stackFunc = stackFunc || _instanceof.caller;

	                if (!(arg instanceof type)) {
	                        throw new assert.AssertionError({
	                                message: _(TYPE_REQUIRED, name, type.name),
	                                actual: _getClass(arg),
	                                expected: type.name,
	                                operator: 'instanceof',
	                                stackStartFunction: stackFunc
	                        });
	                }
	        }
	}

	function _getClass(object) {
	        return (Object.prototype.toString.call(object).slice(8, -1));
	};



	///--- API

	function array(arr, type, name) {
	        if (!NDEBUG) {
	                name = name || type;

	                if (!Array.isArray(arr)) {
	                        throw new assert.AssertionError({
	                                message: _(ARRAY_TYPE_REQUIRED, name, type),
	                                actual: typeof (arr),
	                                expected: 'array',
	                                operator: 'Array.isArray',
	                                stackStartFunction: array.caller
	                        });
	                }

	                for (var i = 0; i < arr.length; i++) {
	                        _assert(arr[i], type, name, array);
	                }
	        }
	}


	function bool(arg, name) {
	        _assert(arg, 'boolean', name, bool);
	}


	function buffer(arg, name) {
	        if (!Buffer.isBuffer(arg)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name || '', 'Buffer'),
	                        actual: typeof (arg),
	                        expected: 'buffer',
	                        operator: 'Buffer.isBuffer',
	                        stackStartFunction: buffer
	                });
	        }
	}


	function func(arg, name) {
	        _assert(arg, 'function', name);
	}


	function number(arg, name) {
	        _assert(arg, 'number', name);
	        if (!NDEBUG && (isNaN(arg) || !isFinite(arg))) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, 'number'),
	                        actual: arg,
	                        expected: 'number',
	                        operator: 'isNaN',
	                        stackStartFunction: number
	                });
	        }
	}


	function object(arg, name) {
	        _assert(arg, 'object', name);
	}


	function stream(arg, name) {
	        _instanceof(arg, Stream, name);
	}


	function date(arg, name) {
	        _instanceof(arg, Date, name);
	}

	function regexp(arg, name) {
	        _instanceof(arg, RegExp, name);
	}


	function string(arg, name) {
	        _assert(arg, 'string', name);
	}


	function uuid(arg, name) {
	        string(arg, name);
	        if (!NDEBUG && !UUID_REGEXP.test(arg)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, 'uuid'),
	                        actual: 'string',
	                        expected: 'uuid',
	                        operator: 'test',
	                        stackStartFunction: uuid
	                });
	        }
	}


	///--- Exports

	module.exports = {
	        bool: bool,
	        buffer: buffer,
	        date: date,
	        func: func,
	        number: number,
	        object: object,
	        regexp: regexp,
	        stream: stream,
	        string: string,
	        uuid: uuid
	};


	Object.keys(module.exports).forEach(function (k) {
	        if (k === 'buffer')
	                return;

	        var name = 'arrayOf' + capitalize(k);

	        if (k === 'bool')
	                k = 'boolean';
	        if (k === 'func')
	                k = 'function';
	        module.exports[name] = function (arg, name) {
	                array(arg, k, name);
	        };
	});

	Object.keys(module.exports).forEach(function (k) {
	        var _name = 'optional' + capitalize(k);
	        var s = uncapitalize(k.replace('arrayOf', ''));
	        if (s === 'bool')
	                s = 'boolean';
	        if (s === 'func')
	                s = 'function';

	        if (k.indexOf('arrayOf') !== -1) {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          array(arg, s, name);
	                  }
	          };
	        } else {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          _assert(arg, s, name);
	                  }
	          };
	        }
	});


	// Reexport built-in assertions
	Object.keys(assert).forEach(function (k) {
	        if (k === 'AssertionError') {
	                module.exports[k] = assert[k];
	                return;
	        }

	        module.exports[k] = function () {
	                if (!NDEBUG) {
	                        assert[k].apply(assert[k], arguments);
	                }
	        };
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(5).Buffer))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var util = __webpack_require__(25);

	var pSlice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	  else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = stackStartFunction.name;
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function replacer(key, value) {
	  if (util.isUndefined(value)) {
	    return '' + value;
	  }
	  if (util.isNumber(value) && !isFinite(value)) {
	    return value.toString();
	  }
	  if (util.isFunction(value) || util.isRegExp(value)) {
	    return value.toString();
	  }
	  return value;
	}

	function truncate(s, n) {
	  if (util.isString(s)) {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}

	function getMessage(self) {
	  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(JSON.stringify(self.expected, replacer), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;

	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }

	    return true;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!util.isObject(actual) && !util.isObject(expected)) {
	    return actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
	  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b)) {
	    return a === b;
	  }
	  var aIsArgs = isArguments(a),
	      bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  var ka = objectKeys(a),
	      kb = objectKeys(b),
	      key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
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
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (util.isString(expected)) {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) { if (err) {throw err;}};

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};


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

	var EE = __webpack_require__(29).EventEmitter;
	var inherits = __webpack_require__(30);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(31);
	Stream.Writable = __webpack_require__(42);
	Stream.Duplex = __webpack_require__(43);
	Stream.Transform = __webpack_require__(44);
	Stream.PassThrough = __webpack_require__(45);

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
/* 29 */
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
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(32);
	exports.Stream = __webpack_require__(28);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(38);
	exports.Duplex = __webpack_require__(37);
	exports.Transform = __webpack_require__(40);
	exports.PassThrough = __webpack_require__(41);


/***/ },
/* 32 */
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
	var isArray = __webpack_require__(33);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(5).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(29).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(28);

	/*<replacement>*/
	var util = __webpack_require__(34);
	util.inherits = __webpack_require__(35);
	/*</replacement>*/

	var StringDecoder;


	/*<replacement>*/
	var debug = __webpack_require__(36);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/


	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(37);

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
	      StringDecoder = __webpack_require__(39).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  var Duplex = __webpack_require__(37);

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
	    StringDecoder = __webpack_require__(39).StringDecoder;
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
/* 33 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 37 */
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
	var util = __webpack_require__(34);
	util.inherits = __webpack_require__(35);
	/*</replacement>*/

	var Readable = __webpack_require__(32);
	var Writable = __webpack_require__(38);

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
/* 38 */
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
	var util = __webpack_require__(34);
	util.inherits = __webpack_require__(35);
	/*</replacement>*/

	var Stream = __webpack_require__(28);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(37);

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
	  var Duplex = __webpack_require__(37);

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
/* 39 */
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
/* 40 */
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

	var Duplex = __webpack_require__(37);

	/*<replacement>*/
	var util = __webpack_require__(34);
	util.inherits = __webpack_require__(35);
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

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	module.exports = PassThrough;

	var Transform = __webpack_require__(40);

	/*<replacement>*/
	var util = __webpack_require__(34);
	util.inherits = __webpack_require__(35);
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38)


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(37)


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(40)


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(41)


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = __webpack_require__(23);
	var sshpk = __webpack_require__(47);
	var util = __webpack_require__(25);

	var HASH_ALGOS = {
	  'sha1': true,
	  'sha256': true,
	  'sha512': true
	};

	var PK_ALGOS = {
	  'rsa': true,
	  'dsa': true,
	  'ecdsa': true
	};

	function HttpSignatureError(message, caller) {
	  if (Error.captureStackTrace)
	    Error.captureStackTrace(this, caller || HttpSignatureError);

	  this.message = message;
	  this.name = caller.name;
	}
	util.inherits(HttpSignatureError, Error);

	function InvalidAlgorithmError(message) {
	  HttpSignatureError.call(this, message, InvalidAlgorithmError);
	}
	util.inherits(InvalidAlgorithmError, HttpSignatureError);

	function validateAlgorithm(algorithm) {
	  var alg = algorithm.toLowerCase().split('-');

	  if (alg.length !== 2) {
	    throw (new InvalidAlgorithmError(alg[0].toUpperCase() + ' is not a ' +
	      'valid algorithm'));
	  }

	  if (alg[0] !== 'hmac' && !PK_ALGOS[alg[0]]) {
	    throw (new InvalidAlgorithmError(alg[0].toUpperCase() + ' type keys ' +
	      'are not supported'));
	  }

	  if (!HASH_ALGOS[alg[1]]) {
	    throw (new InvalidAlgorithmError(alg[1].toUpperCase() + ' is not a ' +
	      'supported hash algorithm'));
	  }

	  return (alg);
	}

	///--- API

	module.exports = {

	  HASH_ALGOS: HASH_ALGOS,
	  PK_ALGOS: PK_ALGOS,

	  HttpSignatureError: HttpSignatureError,
	  InvalidAlgorithmError: InvalidAlgorithmError,

	  validateAlgorithm: validateAlgorithm,

	  /**
	   * Converts an OpenSSH public key (rsa only) to a PKCS#8 PEM file.
	   *
	   * The intent of this module is to interoperate with OpenSSL only,
	   * specifically the node crypto module's `verify` method.
	   *
	   * @param {String} key an OpenSSH public key.
	   * @return {String} PEM encoded form of the RSA public key.
	   * @throws {TypeError} on bad input.
	   * @throws {Error} on invalid ssh key formatted data.
	   */
	  sshKeyToPEM: function sshKeyToPEM(key) {
	    assert.string(key, 'ssh_key');

	    var k = sshpk.parseKey(key, 'ssh');
	    return (k.toString('pem'));
	  },


	  /**
	   * Generates an OpenSSH fingerprint from an ssh public key.
	   *
	   * @param {String} key an OpenSSH public key.
	   * @return {String} key fingerprint.
	   * @throws {TypeError} on bad input.
	   * @throws {Error} if what you passed doesn't look like an ssh public key.
	   */
	  fingerprint: function fingerprint(key) {
	    assert.string(key, 'ssh_key');

	    var k = sshpk.parseKey(key, 'ssh');
	    return (k.fingerprint('md5').toString('hex'));
	  },

	  /**
	   * Converts a PKGCS#8 PEM file to an OpenSSH public key (rsa)
	   *
	   * The reverse of the above function.
	   */
	  pemToRsaSSHKey: function pemToRsaSSHKey(pem, comment) {
	    assert.equal('string', typeof (pem), 'typeof pem');

	    var k = sshpk.parseKey(pem, 'pem');
	    k.comment = comment;
	    return (k.toString('ssh'));
	  }
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2015 Joyent, Inc.

	var Key = __webpack_require__(48);
	var Fingerprint = __webpack_require__(66);
	var Signature = __webpack_require__(68);
	var PrivateKey = __webpack_require__(70);
	var errs = __webpack_require__(67);

	module.exports = {
		/* top-level classes */
		Key: Key,
		parseKey: Key.parse,
		Fingerprint: Fingerprint,
		parseFingerprint: Fingerprint.parse,
		Signature: Signature,
		parseSignature: Signature.parse,
		PrivateKey: PrivateKey,
		parsePrivateKey: PrivateKey.parse,

		/* errors */
		FingerprintFormatError: errs.FingerprintFormatError,
		InvalidAlgorithmError: errs.InvalidAlgorithmError,
		KeyParseError: errs.KeyParseError,
		SignatureParseError: errs.SignatureParseError
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = Key;

	var assert = __webpack_require__(49);
	var algs = __webpack_require__(50);
	var crypto = __webpack_require__(51);
	var Fingerprint = __webpack_require__(66);
	var Signature = __webpack_require__(68);
	var errs = __webpack_require__(67);
	var utils = __webpack_require__(69);
	var PrivateKey = __webpack_require__(70);

	var InvalidAlgorithmError = errs.InvalidAlgorithmError;
	var KeyParseError = errs.KeyParseError;

	var formats = {};
	formats['auto'] = __webpack_require__(71);
	formats['pem'] = __webpack_require__(72);
	formats['pkcs1'] = __webpack_require__(79);
	formats['pkcs8'] = __webpack_require__(80);
	formats['rfc4253'] = __webpack_require__(82);
	formats['ssh'] = __webpack_require__(84);
	formats['ssh-private'] = __webpack_require__(81);
	formats['openssh'] = formats['ssh-private'];

	function Key(opts) {
		assert.object(opts, 'options');
		assert.arrayOfObject(opts.parts, 'options.parts');
		assert.string(opts.type, 'options.type');
		assert.optionalString(opts.comment, 'options.comment');

		var algInfo = algs.info[opts.type];
		if (typeof (algInfo) !== 'object')
			throw (new InvalidAlgorithmError(opts.type));

		var partLookup = {};
		for (var i = 0; i < opts.parts.length; ++i) {
			var part = opts.parts[i];
			partLookup[part.name] = part;
		}

		this.type = opts.type;
		this.parts = opts.parts;
		this.part = partLookup;
		this.comment = undefined;
		this.source = opts.source;

		/* for speeding up hashing/fingerprint operations */
		this._rfc4253Cache = opts._rfc4253Cache;
		this._hashCache = {};

		var sz;
		this.curve = undefined;
		if (this.type === 'ecdsa') {
			var curve = this.part.curve.data.toString();
			this.curve = curve;
			sz = algs.curves[curve].size;
		} else if (this.type === 'ed25519') {
			sz = 256;
			this.curve = 'curve25519';
		} else {
			var szPart = this.part[algInfo.sizePart];
			sz = szPart.data.length;
			sz = sz * 8 - utils.countZeros(szPart.data);
		}
		this.size = sz;
	}

	Key.formats = formats;

	Key.prototype.toBuffer = function (format) {
		if (format === undefined)
			format = 'ssh';
		assert.string(format, 'format');
		assert.object(formats[format], 'formats[format]');

		if (format === 'rfc4253') {
			if (this._rfc4253Cache === undefined)
				this._rfc4253Cache = formats['rfc4253'].write(this);
			return (this._rfc4253Cache);
		}

		return (formats[format].write(this));
	};

	Key.prototype.toString = function (format) {
		return (this.toBuffer(format).toString());
	};

	Key.prototype.hash = function (algo) {
		assert.string(algo, 'algorithm');
		algo = algo.toLowerCase();
		assert.ok(algs.hashAlgs[algo]);

		if (this._hashCache[algo])
			return (this._hashCache[algo]);

		var hash = crypto.createHash(algo).
		    update(this.toBuffer('rfc4253')).digest();
		/* Workaround for node 0.8 */
		if (typeof (hash) === 'string')
			hash = new Buffer(hash, 'binary');
		this._hashCache[algo] = hash;
		return (hash);
	};

	Key.prototype.fingerprint = function (algo) {
		if (algo === undefined)
			algo = 'sha256';
		assert.string(algo, 'algorithm');
		var opts = {
			hash: this.hash(algo),
			algorithm: algo
		};
		return (new Fingerprint(opts));
	};

	Key.prototype.defaultHashAlgorithm = function () {
		var hashAlgo = 'sha1';
		if (this.type === 'rsa')
			hashAlgo = 'sha256';
		if (this.type === 'dsa' && this.size > 1024)
			hashAlgo = 'sha256';
		if (this.type === 'ecdsa') {
			if (this.size <= 256)
				hashAlgo = 'sha256';
			else if (this.size <= 384)
				hashAlgo = 'sha384';
			else
				hashAlgo = 'sha512';
		}
		return (hashAlgo);
	};

	Key.prototype.createVerify = function (hashAlgo) {
		if (hashAlgo === undefined)
			hashAlgo = this.defaultHashAlgorithm();
		assert.string(hashAlgo, 'hash algorithm');
		var v, nm, err;
		try {
			nm = this.type.toUpperCase() + '-';
			if (this.type === 'ecdsa')
				nm = 'ecdsa-with-';
			nm += hashAlgo.toUpperCase();
			v = crypto.createVerify(nm);
		} catch (e) {
			err = e;
		}
		if (v === undefined || (err instanceof Error &&
		    err.message.match(/Unknown message digest/))) {
			nm = 'RSA-';
			nm += hashAlgo.toUpperCase();
			v = crypto.createVerify(nm);
		}
		assert.ok(v, 'failed to create verifier');
		var oldVerify = v.verify.bind(v);
		var key = this.toBuffer('pkcs8');
		v.verify = function (signature, fmt) {
			if (typeof (signature) === 'object' &&
			    signature instanceof Signature)
				return (oldVerify(key, signature.toBuffer('asn1')));
			return (oldVerify(key, signature, fmt));
		};
		return (v);
	};

	Key.parse = function (data, format, name) {
		if (typeof (data) !== 'string')
			assert.buffer(data, 'data');
		if (format === undefined)
			format = 'auto';
		assert.string(format, 'format');
		if (name === undefined)
			name = '(unnamed)';

		assert.object(formats[format], 'formats[format]');

		try {
			var k = formats[format].read(data);
			if (k instanceof PrivateKey)
				k = k.toPublic();
			if (!k.comment)
				k.comment = name;
			return (k);
		} catch (e) {
			throw (new KeyParseError(name, format, e));
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer) {// Copyright (c) 2012, Mark Cavage. All rights reserved.

	var assert = __webpack_require__(24);
	var Stream = __webpack_require__(28).Stream;
	var util = __webpack_require__(25);



	///--- Globals

	var NDEBUG = process.env.NODE_NDEBUG || false;
	var UUID_REGEXP = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;



	///--- Messages

	var ARRAY_TYPE_REQUIRED = '%s ([%s]) required';
	var TYPE_REQUIRED = '%s (%s) is required';



	///--- Internal

	function capitalize(str) {
	        return (str.charAt(0).toUpperCase() + str.slice(1));
	}

	function uncapitalize(str) {
	        return (str.charAt(0).toLowerCase() + str.slice(1));
	}

	function _() {
	        return (util.format.apply(util, arguments));
	}


	function _assert(arg, type, name, stackFunc) {
	        if (!NDEBUG) {
	                name = name || type;
	                stackFunc = stackFunc || _assert.caller;
	                var t = typeof (arg);

	                if (t !== type) {
	                        throw new assert.AssertionError({
	                                message: _(TYPE_REQUIRED, name, type),
	                                actual: t,
	                                expected: type,
	                                operator: '===',
	                                stackStartFunction: stackFunc
	                        });
	                }
	        }
	}


	function _instanceof(arg, type, name, stackFunc) {
	        if (!NDEBUG) {
	                name = name || type;
	                stackFunc = stackFunc || _instanceof.caller;

	                if (!(arg instanceof type)) {
	                        throw new assert.AssertionError({
	                                message: _(TYPE_REQUIRED, name, type.name),
	                                actual: _getClass(arg),
	                                expected: type.name,
	                                operator: 'instanceof',
	                                stackStartFunction: stackFunc
	                        });
	                }
	        }
	}

	function _getClass(object) {
	        return (Object.prototype.toString.call(object).slice(8, -1));
	};



	///--- API

	function array(arr, type, name) {
	        if (!NDEBUG) {
	                name = name || type;

	                if (!Array.isArray(arr)) {
	                        throw new assert.AssertionError({
	                                message: _(ARRAY_TYPE_REQUIRED, name, type),
	                                actual: typeof (arr),
	                                expected: 'array',
	                                operator: 'Array.isArray',
	                                stackStartFunction: array.caller
	                        });
	                }

	                for (var i = 0; i < arr.length; i++) {
	                        _assert(arr[i], type, name, array);
	                }
	        }
	}


	function bool(arg, name) {
	        _assert(arg, 'boolean', name, bool);
	}


	function buffer(arg, name) {
	        if (!Buffer.isBuffer(arg)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name || '', 'Buffer'),
	                        actual: typeof (arg),
	                        expected: 'buffer',
	                        operator: 'Buffer.isBuffer',
	                        stackStartFunction: buffer
	                });
	        }
	}


	function func(arg, name) {
	        _assert(arg, 'function', name);
	}


	function number(arg, name) {
	        _assert(arg, 'number', name);
	        if (!NDEBUG && (isNaN(arg) || !isFinite(arg))) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, 'number'),
	                        actual: arg,
	                        expected: 'number',
	                        operator: 'isNaN',
	                        stackStartFunction: number
	                });
	        }
	}


	function object(arg, name) {
	        _assert(arg, 'object', name);
	}


	function stream(arg, name) {
	        _instanceof(arg, Stream, name);
	}


	function date(arg, name) {
	        _instanceof(arg, Date, name);
	}

	function regexp(arg, name) {
	        _instanceof(arg, RegExp, name);
	}


	function string(arg, name) {
	        _assert(arg, 'string', name);
	}


	function uuid(arg, name) {
	        string(arg, name);
	        if (!NDEBUG && !UUID_REGEXP.test(arg)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, 'uuid'),
	                        actual: 'string',
	                        expected: 'uuid',
	                        operator: 'test',
	                        stackStartFunction: uuid
	                });
	        }
	}


	///--- Exports

	module.exports = {
	        bool: bool,
	        buffer: buffer,
	        date: date,
	        func: func,
	        number: number,
	        object: object,
	        regexp: regexp,
	        stream: stream,
	        string: string,
	        uuid: uuid
	};


	Object.keys(module.exports).forEach(function (k) {
	        if (k === 'buffer')
	                return;

	        var name = 'arrayOf' + capitalize(k);

	        if (k === 'bool')
	                k = 'boolean';
	        if (k === 'func')
	                k = 'function';
	        module.exports[name] = function (arg, name) {
	                array(arg, k, name);
	        };
	});

	Object.keys(module.exports).forEach(function (k) {
	        var _name = 'optional' + capitalize(k);
	        var s = uncapitalize(k.replace('arrayOf', ''));
	        if (s === 'bool')
	                s = 'boolean';
	        if (s === 'func')
	                s = 'function';

	        if (k.indexOf('arrayOf') !== -1) {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          array(arg, s, name);
	                  }
	          };
	        } else {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          _assert(arg, s, name);
	                  }
	          };
	        }
	});


	// Reexport built-in assertions
	Object.keys(assert).forEach(function (k) {
	        if (k === 'AssertionError') {
	                module.exports[k] = assert[k];
	                return;
	        }

	        module.exports[k] = function () {
	                if (!NDEBUG) {
	                        assert[k].apply(assert[k], arguments);
	                }
	        };
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(5).Buffer))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	var algInfo = {
		'dsa': {
			parts: ['p', 'q', 'g', 'y'],
			sizePart: 'p'
		},
		'rsa': {
			parts: ['e', 'n'],
			sizePart: 'n'
		},
		'ecdsa': {
			parts: ['curve', 'Q'],
			sizePart: 'Q'
		},
		'ed25519': {
			parts: ['Q'],
			sizePart: 'Q'
		}
	};

	var algPrivInfo = {
		'dsa': {
			parts: ['p', 'q', 'g', 'y', 'x']
		},
		'rsa': {
			parts: ['n', 'e', 'd', 'iqmp', 'p', 'q']
		},
		'ecdsa': {
			parts: ['curve', 'Q', 'd']
		},
		'ed25519': {
			parts: ['Q', 'd']
		}
	};

	var hashAlgs = {
		'md5': true,
		'sha1': true,
		'sha256': true,
		'sha384': true,
		'sha512': true
	};

	/*
	 * Taken from
	 * http://csrc.nist.gov/groups/ST/toolkit/documents/dss/NISTReCur.pdf
	 */
	var curves = {
		'nistp256': {
			size: 256,
			pkcs8oid: '1.2.840.10045.3.1.7',
			p: new Buffer(('00' +
			    'ffffffff 00000001 00000000 00000000' +
			    '00000000 ffffffff ffffffff ffffffff').
			    replace(/ /g, ''), 'hex'),
			b: new Buffer((
			    '5ac635d8 aa3a93e7 b3ebbd55 769886bc' +
			    '651d06b0 cc53b0f6 3bce3c3e 27d2604b').
			    replace(/ /g, ''), 'hex'),
			s: new Buffer(('00' +
			    'c49d3608 86e70493 6a6678e1 139d26b7' +
			    '819f7e90').
			    replace(/ /g, ''), 'hex'),
			n: new Buffer(('00' +
			    'ffffffff 00000000 ffffffff ffffffff' +
			    'bce6faad a7179e84 f3b9cac2 fc632551').
			    replace(/ /g, ''), 'hex'),
			G: new Buffer(('04' +
			    '6b17d1f2 e12c4247 f8bce6e5 63a440f2' +
			    '77037d81 2deb33a0 f4a13945 d898c296' +
			    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16' +
			    '2bce3357 6b315ece cbb64068 37bf51f5').
			    replace(/ /g, ''), 'hex')
		},
		'nistp384': {
			size: 384,
			pkcs8oid: '1.3.132.0.34',
			p: new Buffer(('00' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff ffffffff fffffffe' +
			    'ffffffff 00000000 00000000 ffffffff').
			    replace(/ /g, ''), 'hex'),
			b: new Buffer((
			    'b3312fa7 e23ee7e4 988e056b e3f82d19' +
			    '181d9c6e fe814112 0314088f 5013875a' +
			    'c656398d 8a2ed19d 2a85c8ed d3ec2aef').
			    replace(/ /g, ''), 'hex'),
			s: new Buffer(('00' +
			    'a335926a a319a27a 1d00896a 6773a482' +
			    '7acdac73').
			    replace(/ /g, ''), 'hex'),
			n: new Buffer(('00' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff c7634d81 f4372ddf' +
			    '581a0db2 48b0a77a ecec196a ccc52973').
			    replace(/ /g, ''), 'hex'),
			G: new Buffer(('04' +
			    'aa87ca22 be8b0537 8eb1c71e f320ad74' +
			    '6e1d3b62 8ba79b98 59f741e0 82542a38' +
			    '5502f25d bf55296c 3a545e38 72760ab7' +
			    '3617de4a 96262c6f 5d9e98bf 9292dc29' +
			    'f8f41dbd 289a147c e9da3113 b5f0b8c0' +
			    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f').
			    replace(/ /g, ''), 'hex')
		},
		'nistp521': {
			size: 521,
			pkcs8oid: '1.3.132.0.35',
			p: new Buffer((
			    '01ffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffff').replace(/ /g, ''), 'hex'),
			b: new Buffer(('51' +
			    '953eb961 8e1c9a1f 929a21a0 b68540ee' +
			    'a2da725b 99b315f3 b8b48991 8ef109e1' +
			    '56193951 ec7e937b 1652c0bd 3bb1bf07' +
			    '3573df88 3d2c34f1 ef451fd4 6b503f00').
			    replace(/ /g, ''), 'hex'),
			s: new Buffer(('00' +
			    'd09e8800 291cb853 96cc6717 393284aa' +
			    'a0da64ba').replace(/ /g, ''), 'hex'),
			n: new Buffer(('01ff' +
			    'ffffffff ffffffff ffffffff ffffffff' +
			    'ffffffff ffffffff ffffffff fffffffa' +
			    '51868783 bf2f966b 7fcc0148 f709a5d0' +
			    '3bb5c9b8 899c47ae bb6fb71e 91386409').
			    replace(/ /g, ''), 'hex'),
			G: new Buffer(('04' +
			    '00c6 858e06b7 0404e9cd 9e3ecb66 2395b442' +
			         '9c648139 053fb521 f828af60 6b4d3dba' +
			         'a14b5e77 efe75928 fe1dc127 a2ffa8de' +
			         '3348b3c1 856a429b f97e7e31 c2e5bd66' +
			    '0118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9' +
			         '98f54449 579b4468 17afbd17 273e662c' +
			         '97ee7299 5ef42640 c550b901 3fad0761' +
			         '353c7086 a272c240 88be9476 9fd16650').
			    replace(/ /g, ''), 'hex')
		}
	};

	module.exports = {
		info: algInfo,
		privInfo: algPrivInfo,
		hashAlgs: hashAlgs,
		curves: curves
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var rng = __webpack_require__(52)

	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}

	exports.createHash = __webpack_require__(54)

	exports.createHmac = __webpack_require__(63)

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

	var p = __webpack_require__(64)(exports)
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {(function() {
	  var g = ('undefined' === typeof window ? global : window) || {}
	  _crypto = (
	    g.crypto || g.msCrypto || __webpack_require__(53)
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
/* 53 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(55)

	var md5 = toConstructor(__webpack_require__(60))
	var rmd160 = toConstructor(__webpack_require__(62))

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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var exports = module.exports = function (alg) {
	  var Alg = exports[alg]
	  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
	  return new Alg()
	}

	var Buffer = __webpack_require__(5).Buffer
	var Hash   = __webpack_require__(56)(Buffer)

	exports.sha1 = __webpack_require__(57)(Buffer, Hash)
	exports.sha256 = __webpack_require__(58)(Buffer, Hash)
	exports.sha512 = __webpack_require__(59)(Buffer, Hash)


/***/ },
/* 56 */
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
/* 57 */
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
/* 58 */
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
/* 59 */
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	var helpers = __webpack_require__(61);

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
/* 61 */
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
/* 62 */
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
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(54)

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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var pbkdf2Export = __webpack_require__(65)

	module.exports = function (crypto, exports) {
	  exports = exports || {}

	  var exported = pbkdf2Export(crypto)

	  exports.pbkdf2 = exported.pbkdf2
	  exports.pbkdf2Sync = exported.pbkdf2Sync

	  return exports
	}


/***/ },
/* 65 */
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
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = Fingerprint;

	var assert = __webpack_require__(49);
	var algs = __webpack_require__(50);
	var crypto = __webpack_require__(51);
	var errs = __webpack_require__(67);
	var Key = __webpack_require__(48);

	var FingerprintFormatError = errs.FingerprintFormatError;
	var InvalidAlgorithmError = errs.InvalidAlgorithmError;

	function Fingerprint(opts) {
		assert.object(opts, 'options');
		assert.buffer(opts.hash, 'options.hash');
		assert.string(opts.algorithm, 'options.algorithm');

		this.algorithm = opts.algorithm.toLowerCase();
		if (algs.hashAlgs[this.algorithm] !== true)
			throw (new InvalidAlgorithmError(this.algorithm));

		this.hash = opts.hash;
	}

	Fingerprint.prototype.toString = function (format) {
		if (format === undefined) {
			if (this.algorithm === 'md5')
				format = 'hex';
			else
				format = 'base64';
		}
		assert.string(format);

		switch (format) {
		case 'hex':
			return (addColons(this.hash.toString('hex')));
		case 'base64':
			return (sshBase64Format(this.algorithm,
			    this.hash.toString('base64')));
		default:
			throw (new FingerprintFormatError(undefined, format));
		}
	};

	Fingerprint.prototype.matches = function (key) {
		assert.object(key, 'key');
		/* Defer until runtime due to circular deps */
		if (Key === undefined)
			Key = __webpack_require__(48);
		assert.ok(key instanceof Key, 'key');

		var theirHash = key.hash(this.algorithm);
		var theirHash2 = crypto.createHash(this.algorithm).
		    update(theirHash).digest('base64');

		if (this.hash2 === undefined)
			this.hash2 = crypto.createHash(this.algorithm).
			    update(this.hash).digest('base64');

		return (this.hash2 === theirHash2);
	};

	Fingerprint.parse = function (fp, enAlgs) {
		assert.string(fp, 'fingerprint');

		var alg, hash;
		assert.optionalArrayOfString(enAlgs, 'algorithms');

		var parts = fp.split(':');
		if (parts.length == 2) {
			alg = parts[0].toLowerCase();
			/*JSSTYLED*/
			var base64RE = /^[A-Za-z0-9+\/=]+$/;
			if (!base64RE.test(parts[1]))
				throw (new FingerprintFormatError(fp));
			try {
				hash = new Buffer(parts[1], 'base64');
			} catch (e) {
				throw (new FingerprintFormatError(fp));
			}
		} else if (parts.length > 2) {
			alg = 'md5';
			if (parts[0].toLowerCase() === 'md5')
				parts = parts.slice(1);
			parts = parts.join('');
			/*JSSTYLED*/
			var md5RE = /^[a-fA-F0-9]+$/;
			if (!md5RE.test(parts))
				throw (new FingerprintFormatError(fp));
			try {
				hash = new Buffer(parts, 'hex');
			} catch (e) {
				throw (new FingerprintFormatError(fp));
			}
		}

		if (alg === undefined)
			throw (new FingerprintFormatError(fp));

		if (enAlgs !== undefined) {
			enAlgs = enAlgs.map(function (a) { return a.toLowerCase(); });
			if (enAlgs.indexOf(alg) === -1)
				throw (new InvalidAlgorithmError(alg));
		}

		return (new Fingerprint({algorithm: alg, hash: hash}));
	};

	function addColons(s) {
		/*JSSTYLED*/
		return (s.replace(/(.{2})(?=.)/g, '$1:'));
	}

	function base64Strip(s) {
		/*JSSTYLED*/
		return (s.replace(/=*$/, ''));
	}

	function sshBase64Format(alg, h) {
		return (alg.toUpperCase() + ':' + base64Strip(h));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2015 Joyent, Inc.

	var assert = __webpack_require__(49);
	var util = __webpack_require__(25);

	function FingerprintFormatError(fp, format) {
		if (Error.captureStackTrace)
			Error.captureStackTrace(this, FingerprintFormatError);
		this.name = 'FingerprintFormatError';
		this.fingerprint = fp;
		this.format = format;
		this.message = 'Fingerprint format is not supported, or is invalid: ';
		if (fp !== undefined)
			this.message += ' fingerprint = ' + fp;
		if (format !== undefined)
			this.message += ' format = ' + format;
	}
	util.inherits(FingerprintFormatError, Error);

	function InvalidAlgorithmError(alg) {
		if (Error.captureStackTrace)
			Error.captureStackTrace(this, InvalidAlgorithmError);
		this.name = 'InvalidAlgorithmError';
		this.algorithm = alg;
		this.message = 'Algorithm "' + alg + '" is not supported';
	}
	util.inherits(InvalidAlgorithmError, Error);

	function KeyParseError(name, format, innerErr) {
		if (Error.captureStackTrace)
			Error.captureStackTrace(this, KeyParseError);
		this.name = 'KeyParseError';
		this.format = format;
		this.keyName = name;
		this.innerErr = innerErr;
		this.message = 'Failed to parse ' + name + ' as a valid ' + format +
		    ' format key: ' + innerErr.message;
	}
	util.inherits(KeyParseError, Error);

	function SignatureParseError(type, format, innerErr) {
		if (Error.captureStackTrace)
			Error.captureStackTrace(this, SignatureParseError);
		this.name = 'SignatureParseError';
		this.type = type;
		this.format = format;
		this.innerErr = innerErr;
		this.message = 'Failed to parse the given data as a ' + type +
		    ' signature in ' + format + ' format: ' + innerErr.message;
	}
	util.inherits(SignatureParseError, Error);

	module.exports = {
		FingerprintFormatError: FingerprintFormatError,
		InvalidAlgorithmError: InvalidAlgorithmError,
		KeyParseError: KeyParseError,
		SignatureParseError: SignatureParseError
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = Signature;

	var assert = __webpack_require__(49);
	var algs = __webpack_require__(50);
	var crypto = __webpack_require__(51);
	var errs = __webpack_require__(67);
	var utils = __webpack_require__(69);
	var asn1 = __webpack_require__(73);
	var SSHBuffer = __webpack_require__(83);

	var InvalidAlgorithmError = errs.InvalidAlgorithmError;
	var SignatureParseError = errs.SignatureParseError;

	function Signature(opts) {
		assert.object(opts, 'options');
		assert.arrayOfObject(opts.parts, 'options.parts');
		assert.string(opts.type, 'options.type');

		var partLookup = {};
		for (var i = 0; i < opts.parts.length; ++i) {
			var part = opts.parts[i];
			partLookup[part.name] = part;
		}

		this.type = opts.type;
		this.hashAlgorithm = opts.hashAlgo;
		this.parts = opts.parts;
		this.part = partLookup;
	}

	Signature.prototype.toBuffer = function (format) {
		if (format === undefined)
			format = 'asn1';
		assert.string(format, 'format');

		var buf;

		switch (this.type) {
		case 'rsa':
			if (format === 'ssh') {
				buf = new SSHBuffer({});
				buf.writeString('ssh-rsa');
				buf.writePart(this.part.sig);
				return (buf.toBuffer());
			} else {
				return (this.part.sig.data);
			}

		case 'dsa':
		case 'ecdsa':
			var r, s;
			if (format === 'asn1') {
				var der = new asn1.BerWriter();
				der.startSequence();
				r = utils.mpNormalize(this.part.r.data);
				s = utils.mpNormalize(this.part.s.data);
				der.writeBuffer(r, asn1.Ber.Integer);
				der.writeBuffer(s, asn1.Ber.Integer);
				der.endSequence();
				return (der.buffer);
			} else if (format === 'ssh' && this.type === 'dsa') {
				buf = new SSHBuffer({});
				buf.writeString('ssh-dss');
				r = this.part.r.data;
				if (r[0] === 0x00)
					r = r.slice(1);
				s = this.part.s.data;
				buf.writeBuffer(Buffer.concat([r, s]));
				return (buf.toBuffer());
			} else if (format === 'ssh' && this.type === 'ecdsa') {
				var inner = new SSHBuffer({});
				r = this.part.r;
				if (r[0] === 0x00)
					r = r.slice(1);
				inner.writePart(r);
				inner.writePart(this.part.s);

				buf = new SSHBuffer({});
				/* XXX: find a more proper way to do this? */
				var curve;
				var sz = this.part.r.data.length * 8;
				if (sz === 256)
					curve = 'nistp256';
				else if (sz === 384)
					curve = 'nistp384';
				else if (sz === 528)
					curve = 'nistp521';
				buf.writeString('ecdsa-sha2-' + curve);
				buf.writeBuffer(inner.toBuffer());
				return (buf.toBuffer());
			}
			throw (new Error('Invalid signature format'));
		default:
			throw (new Error('Invalid signature data'));
		}
	};

	Signature.prototype.toString = function (format) {
		assert.optionalString(format, 'format');
		return (this.toBuffer(format).toString('base64'));
	};

	Signature.parse = function (data, type, format) {
		if (typeof (data) === 'string')
			data = new Buffer(data, 'base64');
		assert.buffer(data, 'data');
		assert.string(format, 'format');
		assert.string(type, 'type');

		var opts = {};
		opts.type = type.toLowerCase();
		opts.parts = [];

		try {
			switch (opts.type) {
			case 'rsa':
				return (parseRSA(data, type, format, opts));

			case 'dsa':
			case 'ecdsa':
				if (format === 'asn1')
					return (parseDSAasn1(data, type, format, opts));
				else if (opts.type === 'dsa')
					return (parseDSA(data, type, format, opts));
				else
					return (parseECDSA(data, type, format, opts));

			default:
				throw (new InvalidAlgorithmError(type));
			}

		} catch (e) {
			if (e instanceof InvalidAlgorithmError)
				throw (e);
			throw (new SignatureParseError(type, format, e));
		}
	};

	function parseRSA(data, type, format, opts) {
		if (format === 'ssh') {
			try {
				var buf = new SSHBuffer({buffer: data});
				var head = buf.readString();
			} catch (e) {
				/* fall through */
			}
			if (head === 'ssh-rsa') {
				var sig = buf.readPart();
				assert.ok(buf.atEnd(), 'extra trailing bytes');
				sig.name = 'sig';
				opts.parts.push(sig);
				return (new Signature(opts));
			}
		}
		opts.parts.push({name: 'sig', data: data});
		return (new Signature(opts));
	}

	function parseDSAasn1(data, type, format, opts) {
		var der = new asn1.BerReader(data);
		der.readSequence();
		var r = der.readString(asn1.Ber.Integer, true);
		var s = der.readString(asn1.Ber.Integer, true);

		opts.parts.push({name: 'r', data: utils.mpNormalize(r)});
		opts.parts.push({name: 's', data: utils.mpNormalize(s)});

		return (new Signature(opts));
	}

	function parseDSA(data, type, format, opts) {
		if (data.length != 40) {
			var buf = new SSHBuffer({buffer: data});
			var d = buf.readBuffer();
			if (d.toString('ascii') === 'ssh-dss')
				d = buf.readBuffer();
			assert.ok(buf.atEnd(), 'extra trailing bytes');
			assert.strictEqual(d.length, 40, 'invalid inner length');
			data = d;
		}
		opts.parts.push({name: 'r', data: data.slice(0, 20)});
		opts.parts.push({name: 's', data: data.slice(20, 40)});
		return (new Signature(opts));
	}

	function parseECDSA(data, type, format, opts) {
		var buf = new SSHBuffer({buffer: data});

		var r, s;
		var inner = buf.readBuffer();
		if (inner.toString('ascii').match(/^ecdsa-/)) {
			inner = buf.readBuffer();
			assert.ok(buf.atEnd(), 'extra trailing bytes on outer');
			buf = new SSHBuffer({buffer: inner});
			r = buf.readPart();
		} else {
			r = {data: inner};
		}

		s = buf.readPart();
		assert.ok(buf.atEnd(), 'extra trailing bytes');

		r.name = 'r';
		s.name = 's';

		opts.parts.push(r);
		opts.parts.push(s);
		return (new Signature(opts));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		bufferSplit: bufferSplit,
		addRSAMissing: addRSAMissing,
		calculateDSAPublic: calculateDSAPublic,
		mpNormalize: mpNormalize,
		ecNormalize: ecNormalize,
		countZeros: countZeros
	};

	var assert = __webpack_require__(49);
	var PrivateKey = __webpack_require__(70);

	/* Count leading zero bits on a buffer */
	function countZeros(buf) {
		var o = 0, obit = 8;
		while (o < buf.length) {
			var mask = (1 << obit);
			if ((buf[o] & mask) === mask)
				break;
			obit--;
			if (obit < 0) {
				o++;
				obit = 8;
			}
		}
		return (o*8 + (8 - obit) - 1);
	}

	function bufferSplit(buf, chr) {
		assert.buffer(buf);
		assert.string(chr);

		var parts = [];
		var lastPart = 0;
		var matches = 0;
		for (var i = 0; i < buf.length; ++i) {
			if (buf[i] === chr.charCodeAt(matches))
				++matches;
			else if (buf[i] === chr.charCodeAt(0))
				matches = 1;
			else
				matches = 0;

			if (matches >= chr.length) {
				var newPart = i + 1;
				parts.push(buf.slice(lastPart, newPart - matches));
				lastPart = newPart;
				matches = 0;
			}
		}
		if (lastPart <= buf.length)
			parts.push(buf.slice(lastPart, buf.length));

		return (parts);
	}

	function ecNormalize(buf, addZero) {
		assert.buffer(buf);
		if (buf[0] === 0x00 && buf[1] === 0x04) {
			if (addZero)
				return (buf);
			return (buf.slice(1));
		} else if (buf[0] === 0x04) {
			if (!addZero)
				return (buf);
		} else {
			while (buf[0] === 0x00)
				buf = buf.slice(1);
			if (buf[0] === 0x02 || buf[0] === 0x03)
				throw (new Error('Compressed elliptic curve points ' +
				    'are not supported'));
			if (buf[0] !== 0x04)
				throw (new Error('Not a valid elliptic curve point'));
			if (!addZero)
				return (buf);
		}
		var b = new Buffer(buf.length + 1);
		b[0] = 0x0;
		buf.copy(b, 1);
		return (b);
	}

	function mpNormalize(buf) {
		assert.buffer(buf);
		while (buf.length > 1 && buf[0] === 0x00 && (buf[1] & 0x80) === 0x00)
			buf = buf.slice(1);
		if ((buf[0] & 0x80) === 0x80) {
			var b = new Buffer(buf.length + 1);
			b[0] = 0x00;
			buf.copy(b, 1);
			buf = b;
		}
		return (buf);
	}

	function bigintToMpBuf(bigint) {
		var hex = bigint.toString(16);
		if (hex.length % 2 == 1)
			hex = '0' + hex;
		var buf = new Buffer(hex, 'hex');
		buf = mpNormalize(buf);
		return (buf);
	}

	function calculateDSAPublic(g, p, x) {
		assert.buffer(g);
		assert.buffer(p);
		assert.buffer(x);
		try {
			var bigInt = __webpack_require__(85);
		} catch (e) {
			throw (new Error('To load a PKCS#8 format DSA private key, ' +
			    'the node big-integer library is required.'));
		}
		g = bigInt(g.toString('hex'), 16);
		p = bigInt(p.toString('hex'), 16);
		x = bigInt(x.toString('hex'), 16);
		var y = modexp(g, x, p);
		var ybuf = bigintToMpBuf(y);
		return (ybuf);

		/* Bruce Schneier's modular exponentiation algorithm */
		function modexp(base, exp, mod) {
			var res = bigInt(1);
			base = base.mod(mod);
			while (exp.gt(0)) {
				if (exp.isOdd())
					res = res.times(base).mod(mod);
				exp = exp.shiftRight(1);
				base = base.square().mod(mod);
			}
			return (res);
		}
	}

	function addRSAMissing(key) {
		assert.object(key);
		assert.ok(key instanceof PrivateKey);
		try {
			var bigInt = __webpack_require__(85);
		} catch (e) {
			throw (new Error('To write a PEM private key from ' +
			    'this source, the node big-integer lib is required.'));
		}

		var d = bigInt(key.part.d.data.toString('hex'), 16);
		var buf;

		if (!key.part.dmodp) {
			var p = bigInt(key.part.p.data.toString('hex'), 16);
			var dmodp = d.mod(p.minus(1));

			buf = bigintToMpBuf(dmodp);
			key.part.dmodp = {name: 'dmodp', data: buf};
			key.parts.push(key.part.dmodp);
		}
		if (!key.part.dmodq) {
			var q = bigInt(key.part.q.data.toString('hex'), 16);
			var dmodq = d.mod(q.minus(1));

			buf = bigintToMpBuf(dmodq);
			key.part.dmodq = {name: 'dmodq', data: buf};
			key.parts.push(key.part.dmodq);
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = PrivateKey;

	var assert = __webpack_require__(49);
	var algs = __webpack_require__(50);
	var crypto = __webpack_require__(51);
	var Fingerprint = __webpack_require__(66);
	var Signature = __webpack_require__(68);
	var errs = __webpack_require__(67);
	var util = __webpack_require__(25);

	var Key = __webpack_require__(48);

	var InvalidAlgorithmError = errs.InvalidAlgorithmError;
	var KeyParseError = errs.KeyParseError;

	var formats = {};
	formats['auto'] = __webpack_require__(71);
	formats['pem'] = __webpack_require__(72);
	formats['pkcs1'] = __webpack_require__(79);
	formats['pkcs8'] = __webpack_require__(80);
	formats['rfc4253'] = __webpack_require__(82);
	formats['ssh-private'] = __webpack_require__(81);
	formats['openssh'] = formats['ssh-private'];
	formats['ssh'] = formats['ssh-private'];

	function PrivateKey(opts) {
		assert.object(opts, 'options');
		Key.call(this, opts);

		this._pubCache = undefined;
	}
	util.inherits(PrivateKey, Key);

	PrivateKey.formats = formats;

	PrivateKey.prototype.toBuffer = function (format) {
		if (format === undefined)
			format = 'pkcs1';
		assert.string(format, 'format');
		assert.object(formats[format], 'formats[format]');

		return (formats[format].write(this));
	};

	PrivateKey.prototype.hash = function (algo) {
		return (this.toPublic().hash(algo));
	};

	PrivateKey.prototype.toPublic = function () {
		if (this._pubCache)
			return (this._pubCache);

		var algInfo = algs.info[this.type];
		var pubParts = [];
		for (var i = 0; i < algInfo.parts.length; ++i) {
			var p = algInfo.parts[i];
			pubParts.push(this.part[p]);
		}

		this._pubCache = new Key({
			type: this.type,
			source: this,
			parts: pubParts
		});
		if (this.comment)
			this._pubCache.comment = this.comment;
		return (this._pubCache);
	};

	PrivateKey.prototype.createVerify = function (hashAlgo) {
		return (this.toPublic().createVerify(hashAlgo));
	};

	PrivateKey.prototype.createSign = function (hashAlgo) {
		if (hashAlgo === undefined)
			hashAlgo = this.defaultHashAlgorithm();
		assert.string(hashAlgo, 'hash algorithm');
		var v, nm, err;
		try {
			nm = this.type.toUpperCase() + '-';
			if (this.type === 'ecdsa')
				nm = 'ecdsa-with-';
			nm += hashAlgo.toUpperCase();
			v = crypto.createSign(nm);
		} catch (e) {
			err = e;
		}
		if (v === undefined || (err instanceof Error &&
		    err.message.match(/Unknown message digest/))) {
			nm = 'RSA-';
			nm += hashAlgo.toUpperCase();
			v = crypto.createSign(nm);
		}
		assert.ok(v, 'failed to create verifier');
		var oldSign = v.sign.bind(v);
		var key = this.toBuffer('pkcs1');
		var type = this.type;
		v.sign = function () {
			var sig = oldSign(key);
			if (typeof (sig) === 'string')
				sig = new Buffer(sig, 'binary');
			sig = Signature.parse(sig, type, 'asn1');
			sig.hashAlgorithm = hashAlgo;
			return (sig);
		};
		return (v);
	};

	PrivateKey.parse = function (data, format, name) {
		if (typeof (data) !== 'string')
			assert.buffer(data, 'data');
		if (format === undefined)
			format = 'auto';
		assert.string(format, 'format');
		if (name === undefined)
			name = '(unnamed)';

		assert.object(formats[format], 'formats[format]');

		try {
			var k = formats[format].read(data);
			assert.ok(k instanceof PrivateKey);
			if (!k.comment)
				k.comment = name;
			return (k);
		} catch (e) {
			throw (new KeyParseError(name, format, e));
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		write: write
	};

	var assert = __webpack_require__(49);
	var utils = __webpack_require__(69);
	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);

	var pem = __webpack_require__(72);
	var ssh = __webpack_require__(84);
	var rfc4253 = __webpack_require__(82);

	function read(buf) {
		if (typeof (buf) === 'string') {
			if (buf.trim().match(/^[-]+[ ]*BEGIN/))
				return (pem.read(buf));
			if (buf.match(/^\s*ssh-[a-z]/))
				return (ssh.read(buf));
			if (buf.match(/^\s*ecdsa-/))
				return (ssh.read(buf));
			buf = new Buffer(buf, 'binary');
		} else {
			assert.buffer(buf);
			if (findPEMHeader(buf))
				return (pem.read(buf));
			if (findSSHHeader(buf))
				return (ssh.read(buf));
		}
		if (buf.readUInt32BE(0) < buf.length)
			return (rfc4253.read(buf));
		throw (new Error('Failed to auto-detect format of key'));
	}

	function findSSHHeader(buf) {
		var offset = 0;
		while (offset < buf.length &&
		    (buf[offset] === 32 || buf[offset] === 10 || buf[offset] === 9))
			++offset;
		if (offset + 4 <= buf.length &&
		    buf.slice(offset, offset + 4).toString('ascii') === 'ssh-')
			return (true);
		if (offset + 6 <= buf.length &&
		    buf.slice(offset, offset + 6).toString('ascii') === 'ecdsa-')
			return (true);
		return (false);
	}

	function findPEMHeader(buf) {
		var offset = 0;
		while (offset < buf.length &&
		    (buf[offset] === 32 || buf[offset] === 10))
			++offset;
		if (buf[offset] !== 45)
			return (false);
		while (offset < buf.length &&
		    (buf[offset] === 45))
			++offset;
		while (offset < buf.length &&
		    (buf[offset] === 32))
			++offset;
		if (offset + 5 > buf.length ||
		    buf.slice(offset, offset + 5).toString('ascii') !== 'BEGIN')
			return (false);
		return (true);
	}

	function write(key) {
		throw (new Error('"auto" format cannot be used for writing'));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		write: write
	};

	var assert = __webpack_require__(49);
	var asn1 = __webpack_require__(73);
	var algs = __webpack_require__(50);
	var utils = __webpack_require__(69);
	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);

	var pkcs1 = __webpack_require__(79);
	var pkcs8 = __webpack_require__(80);
	var sshpriv = __webpack_require__(81);
	var rfc4253 = __webpack_require__(82);

	/*
	 * For reading we support both PKCS#1 and PKCS#8. If we find a private key,
	 * we just take the public component of it and use that.
	 */
	function read(buf, forceType) {
		var input = buf;
		if (typeof (buf) !== 'string') {
			assert.buffer(buf, 'buf');
			buf = buf.toString('ascii');
		}

		var lines = buf.trim().split('\n');

		var m = lines[0].match(/*JSSTYLED*/
		    /[-]+[ ]*BEGIN ([A-Z0-9]+ )?(PUBLIC|PRIVATE) KEY[ ]*[-]+/);
		assert.ok(m, 'invalid PEM header');

		var m2 = lines[lines.length - 1].match(/*JSSTYLED*/
		    /[-]+[ ]*END ([A-Z0-9]+ )?(PUBLIC|PRIVATE) KEY[ ]*[-]+/);
		assert.ok(m2, 'invalid PEM footer');

		/* Begin and end banners must match key type */
		assert.equal(m[2], m2[2]);
		var type = m[2].toLowerCase();

		var alg;
		if (m[1]) {
			/* They also must match algorithms, if given */
			assert.equal(m[1], m2[1], 'PEM header and footer mismatch');
			alg = m[1].trim();
		}

		var headers = {};
		while (true) {
			lines = lines.slice(1);
			m = lines[0].match(/*JSSTYLED*/
			    /^([A-Za-z0-9-]+): (.+)$/);
			if (!m)
				break;
			headers[m[1].toLowerCase()] = m[2];
		}
		if (headers['proc-type']) {
			var parts = headers['proc-type'].split(',');
			if (parts[0] === '4' && parts[1] === 'ENCRYPTED') {
				throw (new Error('PEM key is encrypted ' +
				    '(password-protected). Please use the ' +
				    'SSH agent or decrypt the key.'));
			}
		}

		/* Chop off the first and last lines */
		lines = lines.slice(0, -1).join('');
		buf = new Buffer(lines, 'base64');

		/* The new OpenSSH internal format abuses PEM headers */
		if (alg && alg.toLowerCase() === 'openssh')
			return (sshpriv.readSSHPrivate(type, buf));
		if (alg && alg.toLowerCase() === 'ssh2')
			return (rfc4253.readType(type, buf));

		var der = new asn1.BerReader(buf);
		der.originalInput = input;

		/*
		 * All of the PEM file types start with a sequence tag, so chop it
		 * off here
		 */
		der.readSequence();

		/* PKCS#1 type keys name an algorithm in the banner explicitly */
		if (alg) {
			if (forceType)
				assert.strictEqual(forceType, 'pkcs1');
			return (pkcs1.readPkcs1(alg, type, der));
		} else {
			if (forceType)
				assert.strictEqual(forceType, 'pkcs8');
			return (pkcs8.readPkcs8(alg, type, der));
		}
	}

	function write(key, type) {
		assert.object(key);

		var alg = {'ecdsa': 'EC', 'rsa': 'RSA', 'dsa': 'DSA'}[key.type];
		var header;

		var der = new asn1.BerWriter();

		if (key instanceof PrivateKey) {
			if (type && type === 'pkcs8') {
				header = 'PRIVATE KEY';
				pkcs8.writePkcs8(der, key);
			} else {
				if (type)
					assert.strictEqual(type, 'pkcs1');
				header = alg + ' PRIVATE KEY';
				pkcs1.writePkcs1(der, key);
			}

		} else if (key instanceof Key) {
			if (type && type === 'pkcs1') {
				header = alg + ' PUBLIC KEY';
				pkcs1.writePkcs1(der, key);
			} else {
				if (type)
					assert.strictEqual(type, 'pkcs8');
				header = 'PUBLIC KEY';
				pkcs8.writePkcs8(der, key);
			}

		} else {
			throw (new Error('key is not a Key or PrivateKey'));
		}

		var tmp = der.buffer.toString('base64');
		var len = tmp.length + (tmp.length / 64) +
		    18 + 16 + header.length*2 + 10;
		var buf = new Buffer(len);
		var o = 0;
		o += buf.write('-----BEGIN ' + header + '-----\n', o);
		for (var i = 0; i < tmp.length; ) {
			var limit = i + 64;
			if (limit > tmp.length)
				limit = tmp.length;
			o += buf.write(tmp.slice(i, limit), o);
			buf[o++] = 10;
			i = limit;
		}
		o += buf.write('-----END ' + header + '-----\n', o);

		return (buf.slice(0, o));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	// If you have no idea what ASN.1 or BER is, see this:
	// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

	var Ber = __webpack_require__(74);



	///--- Exported API

	module.exports = {

	  Ber: Ber,

	  BerReader: Ber.Reader,

	  BerWriter: Ber.Writer

	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var errors = __webpack_require__(75);
	var types = __webpack_require__(76);

	var Reader = __webpack_require__(77);
	var Writer = __webpack_require__(78);


	///--- Exports

	module.exports = {

	  Reader: Reader,

	  Writer: Writer

	};

	for (var t in types) {
	  if (types.hasOwnProperty(t))
	    module.exports[t] = types[t];
	}
	for (var e in errors) {
	  if (errors.hasOwnProperty(e))
	    module.exports[e] = errors[e];
	}


/***/ },
/* 75 */
/***/ function(module, exports) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


	module.exports = {

	  newInvalidAsn1Error: function(msg) {
	    var e = new Error();
	    e.name = 'InvalidAsn1Error';
	    e.message = msg || '';
	    return e;
	  }

	};


/***/ },
/* 76 */
/***/ function(module, exports) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


	module.exports = {
	  EOC: 0,
	  Boolean: 1,
	  Integer: 2,
	  BitString: 3,
	  OctetString: 4,
	  Null: 5,
	  OID: 6,
	  ObjectDescriptor: 7,
	  External: 8,
	  Real: 9, // float
	  Enumeration: 10,
	  PDV: 11,
	  Utf8String: 12,
	  RelativeOID: 13,
	  Sequence: 16,
	  Set: 17,
	  NumericString: 18,
	  PrintableString: 19,
	  T61String: 20,
	  VideotexString: 21,
	  IA5String: 22,
	  UTCTime: 23,
	  GeneralizedTime: 24,
	  GraphicString: 25,
	  VisibleString: 26,
	  GeneralString: 28,
	  UniversalString: 29,
	  CharacterString: 30,
	  BMPString: 31,
	  Constructor: 32,
	  Context: 128
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var assert = __webpack_require__(24);

	var ASN1 = __webpack_require__(76);
	var errors = __webpack_require__(75);


	///--- Globals

	var newInvalidAsn1Error = errors.newInvalidAsn1Error;



	///--- API

	function Reader(data) {
	  if (!data || !Buffer.isBuffer(data))
	    throw new TypeError('data must be a node Buffer');

	  this._buf = data;
	  this._size = data.length;

	  // These hold the "current" state
	  this._len = 0;
	  this._offset = 0;
	}

	Object.defineProperty(Reader.prototype, 'length', {
	  enumerable: true,
	  get: function () { return (this._len); }
	});

	Object.defineProperty(Reader.prototype, 'offset', {
	  enumerable: true,
	  get: function () { return (this._offset); }
	});

	Object.defineProperty(Reader.prototype, 'remain', {
	  get: function () { return (this._size - this._offset); }
	});

	Object.defineProperty(Reader.prototype, 'buffer', {
	  get: function () { return (this._buf.slice(this._offset)); }
	});


	/**
	 * Reads a single byte and advances offset; you can pass in `true` to make this
	 * a "peek" operation (i.e., get the byte, but don't advance the offset).
	 *
	 * @param {Boolean} peek true means don't move offset.
	 * @return {Number} the next byte, null if not enough data.
	 */
	Reader.prototype.readByte = function(peek) {
	  if (this._size - this._offset < 1)
	    return null;

	  var b = this._buf[this._offset] & 0xff;

	  if (!peek)
	    this._offset += 1;

	  return b;
	};


	Reader.prototype.peek = function() {
	  return this.readByte(true);
	};


	/**
	 * Reads a (potentially) variable length off the BER buffer.  This call is
	 * not really meant to be called directly, as callers have to manipulate
	 * the internal buffer afterwards.
	 *
	 * As a result of this call, you can call `Reader.length`, until the
	 * next thing called that does a readLength.
	 *
	 * @return {Number} the amount of offset to advance the buffer.
	 * @throws {InvalidAsn1Error} on bad ASN.1
	 */
	Reader.prototype.readLength = function(offset) {
	  if (offset === undefined)
	    offset = this._offset;

	  if (offset >= this._size)
	    return null;

	  var lenB = this._buf[offset++] & 0xff;
	  if (lenB === null)
	    return null;

	  if ((lenB & 0x80) == 0x80) {
	    lenB &= 0x7f;

	    if (lenB == 0)
	      throw newInvalidAsn1Error('Indefinite length not supported');

	    if (lenB > 4)
	      throw newInvalidAsn1Error('encoding too long');

	    if (this._size - offset < lenB)
	      return null;

	    this._len = 0;
	    for (var i = 0; i < lenB; i++)
	      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

	  } else {
	    // Wasn't a variable length
	    this._len = lenB;
	  }

	  return offset;
	};


	/**
	 * Parses the next sequence in this BER buffer.
	 *
	 * To get the length of the sequence, call `Reader.length`.
	 *
	 * @return {Number} the sequence's tag.
	 */
	Reader.prototype.readSequence = function(tag) {
	  var seq = this.peek();
	  if (seq === null)
	    return null;
	  if (tag !== undefined && tag !== seq)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + seq.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`
	  if (o === null)
	    return null;

	  this._offset = o;
	  return seq;
	};


	Reader.prototype.readInt = function() {
	  return this._readTag(ASN1.Integer);
	};


	Reader.prototype.readBoolean = function() {
	  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
	};


	Reader.prototype.readEnumeration = function() {
	  return this._readTag(ASN1.Enumeration);
	};


	Reader.prototype.readString = function(tag, retbuf) {
	  if (!tag)
	    tag = ASN1.OctetString;

	  var b = this.peek();
	  if (b === null)
	    return null;

	  if (b !== tag)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + b.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`

	  if (o === null)
	    return null;

	  if (this.length > this._size - o)
	    return null;

	  this._offset = o;

	  if (this.length === 0)
	    return retbuf ? new Buffer(0) : '';

	  var str = this._buf.slice(this._offset, this._offset + this.length);
	  this._offset += this.length;

	  return retbuf ? str : str.toString('utf8');
	};

	Reader.prototype.readOID = function(tag) {
	  if (!tag)
	    tag = ASN1.OID;

	  var b = this.readString(tag, true);
	  if (b === null)
	    return null;

	  var values = [];
	  var value = 0;

	  for (var i = 0; i < b.length; i++) {
	    var byte = b[i] & 0xff;

	    value <<= 7;
	    value += byte & 0x7f;
	    if ((byte & 0x80) == 0) {
	      values.push(value);
	      value = 0;
	    }
	  }

	  value = values.shift();
	  values.unshift(value % 40);
	  values.unshift((value / 40) >> 0);

	  return values.join('.');
	};


	Reader.prototype._readTag = function(tag) {
	  assert.ok(tag !== undefined);

	  var b = this.peek();

	  if (b === null)
	    return null;

	  if (b !== tag)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + b.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`
	  if (o === null)
	    return null;

	  if (this.length > 4)
	    throw newInvalidAsn1Error('Integer too long: ' + this.length);

	  if (this.length > this._size - o)
	    return null;
	  this._offset = o;

	  var fb = this._buf[this._offset];
	  var value = 0;

	  for (var i = 0; i < this.length; i++) {
	    value <<= 8;
	    value |= (this._buf[this._offset++] & 0xff);
	  }

	  if ((fb & 0x80) == 0x80 && i !== 4)
	    value -= (1 << (i * 8));

	  return value >> 0;
	};



	///--- Exported API

	module.exports = Reader;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var assert = __webpack_require__(24);
	var ASN1 = __webpack_require__(76);
	var errors = __webpack_require__(75);


	///--- Globals

	var newInvalidAsn1Error = errors.newInvalidAsn1Error;

	var DEFAULT_OPTS = {
	  size: 1024,
	  growthFactor: 8
	};


	///--- Helpers

	function merge(from, to) {
	  assert.ok(from);
	  assert.equal(typeof(from), 'object');
	  assert.ok(to);
	  assert.equal(typeof(to), 'object');

	  var keys = Object.getOwnPropertyNames(from);
	  keys.forEach(function(key) {
	    if (to[key])
	      return;

	    var value = Object.getOwnPropertyDescriptor(from, key);
	    Object.defineProperty(to, key, value);
	  });

	  return to;
	}



	///--- API

	function Writer(options) {
	  options = merge(DEFAULT_OPTS, options || {});

	  this._buf = new Buffer(options.size || 1024);
	  this._size = this._buf.length;
	  this._offset = 0;
	  this._options = options;

	  // A list of offsets in the buffer where we need to insert
	  // sequence tag/len pairs.
	  this._seq = [];
	}

	Object.defineProperty(Writer.prototype, 'buffer', {
	  get: function () {
	    if (this._seq.length)
	      throw new InvalidAsn1Error(this._seq.length + ' unended sequence(s)');

	    return (this._buf.slice(0, this._offset));
	  }
	});

	Writer.prototype.writeByte = function(b) {
	  if (typeof(b) !== 'number')
	    throw new TypeError('argument must be a Number');

	  this._ensure(1);
	  this._buf[this._offset++] = b;
	};


	Writer.prototype.writeInt = function(i, tag) {
	  if (typeof(i) !== 'number')
	    throw new TypeError('argument must be a Number');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Integer;

	  var sz = 4;

	  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000 >> 0)) &&
	         (sz > 1)) {
	    sz--;
	    i <<= 8;
	  }

	  if (sz > 4)
	    throw new InvalidAsn1Error('BER ints cannot be > 0xffffffff');

	  this._ensure(2 + sz);
	  this._buf[this._offset++] = tag;
	  this._buf[this._offset++] = sz;

	  while (sz-- > 0) {
	    this._buf[this._offset++] = ((i & 0xff000000) >>> 24);
	    i <<= 8;
	  }

	};


	Writer.prototype.writeNull = function() {
	  this.writeByte(ASN1.Null);
	  this.writeByte(0x00);
	};


	Writer.prototype.writeEnumeration = function(i, tag) {
	  if (typeof(i) !== 'number')
	    throw new TypeError('argument must be a Number');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Enumeration;

	  return this.writeInt(i, tag);
	};


	Writer.prototype.writeBoolean = function(b, tag) {
	  if (typeof(b) !== 'boolean')
	    throw new TypeError('argument must be a Boolean');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Boolean;

	  this._ensure(3);
	  this._buf[this._offset++] = tag;
	  this._buf[this._offset++] = 0x01;
	  this._buf[this._offset++] = b ? 0xff : 0x00;
	};


	Writer.prototype.writeString = function(s, tag) {
	  if (typeof(s) !== 'string')
	    throw new TypeError('argument must be a string (was: ' + typeof(s) + ')');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.OctetString;

	  var len = Buffer.byteLength(s);
	  this.writeByte(tag);
	  this.writeLength(len);
	  if (len) {
	    this._ensure(len);
	    this._buf.write(s, this._offset);
	    this._offset += len;
	  }
	};


	Writer.prototype.writeBuffer = function(buf, tag) {
	  if (typeof(tag) !== 'number')
	    throw new TypeError('tag must be a number');
	  if (!Buffer.isBuffer(buf))
	    throw new TypeError('argument must be a buffer');

	  this.writeByte(tag);
	  this.writeLength(buf.length);
	  this._ensure(buf.length);
	  buf.copy(this._buf, this._offset, 0, buf.length);
	  this._offset += buf.length;
	};


	Writer.prototype.writeStringArray = function(strings) {
	  if ((!strings instanceof Array))
	    throw new TypeError('argument must be an Array[String]');

	  var self = this;
	  strings.forEach(function(s) {
	    self.writeString(s);
	  });
	};

	// This is really to solve DER cases, but whatever for now
	Writer.prototype.writeOID = function(s, tag) {
	  if (typeof(s) !== 'string')
	    throw new TypeError('argument must be a string');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.OID;

	  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
	    throw new Error('argument is not a valid OID string');

	  function encodeOctet(bytes, octet) {
	    if (octet < 128) {
	        bytes.push(octet);
	    } else if (octet < 16384) {
	        bytes.push((octet >>> 7) | 0x80);
	        bytes.push(octet & 0x7F);
	    } else if (octet < 2097152) {
	      bytes.push((octet >>> 14) | 0x80);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    } else if (octet < 268435456) {
	      bytes.push((octet >>> 21) | 0x80);
	      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    } else {
	      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    }
	  }

	  var tmp = s.split('.');
	  var bytes = [];
	  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
	  tmp.slice(2).forEach(function(b) {
	    encodeOctet(bytes, parseInt(b, 10));
	  });

	  var self = this;
	  this._ensure(2 + bytes.length);
	  this.writeByte(tag);
	  this.writeLength(bytes.length);
	  bytes.forEach(function(b) {
	    self.writeByte(b);
	  });
	};


	Writer.prototype.writeLength = function(len) {
	  if (typeof(len) !== 'number')
	    throw new TypeError('argument must be a Number');

	  this._ensure(4);

	  if (len <= 0x7f) {
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xff) {
	    this._buf[this._offset++] = 0x81;
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xffff) {
	    this._buf[this._offset++] = 0x82;
	    this._buf[this._offset++] = len >> 8;
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xffffff) {
	    this._buf[this._offset++] = 0x83;
	    this._buf[this._offset++] = len >> 16;
	    this._buf[this._offset++] = len >> 8;
	    this._buf[this._offset++] = len;
	  } else {
	    throw new InvalidAsn1ERror('Length too long (> 4 bytes)');
	  }
	};

	Writer.prototype.startSequence = function(tag) {
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Sequence | ASN1.Constructor;

	  this.writeByte(tag);
	  this._seq.push(this._offset);
	  this._ensure(3);
	  this._offset += 3;
	};


	Writer.prototype.endSequence = function() {
	  var seq = this._seq.pop();
	  var start = seq + 3;
	  var len = this._offset - start;

	  if (len <= 0x7f) {
	    this._shift(start, len, -2);
	    this._buf[seq] = len;
	  } else if (len <= 0xff) {
	    this._shift(start, len, -1);
	    this._buf[seq] = 0x81;
	    this._buf[seq + 1] = len;
	  } else if (len <= 0xffff) {
	    this._buf[seq] = 0x82;
	    this._buf[seq + 1] = len >> 8;
	    this._buf[seq + 2] = len;
	  } else if (len <= 0xffffff) {
	    this._shift(start, len, 1);
	    this._buf[seq] = 0x83;
	    this._buf[seq + 1] = len >> 16;
	    this._buf[seq + 2] = len >> 8;
	    this._buf[seq + 3] = len;
	  } else {
	    throw new InvalidAsn1Error('Sequence too long');
	  }
	};


	Writer.prototype._shift = function(start, len, shift) {
	  assert.ok(start !== undefined);
	  assert.ok(len !== undefined);
	  assert.ok(shift);

	  this._buf.copy(this._buf, start + shift, start, start + len);
	  this._offset += shift;
	};

	Writer.prototype._ensure = function(len) {
	  assert.ok(len);

	  if (this._size - this._offset < len) {
	    var sz = this._size * this._options.growthFactor;
	    if (sz - this._offset < len)
	      sz += len;

	    var buf = new Buffer(sz);

	    this._buf.copy(buf, 0, 0, this._offset);
	    this._buf = buf;
	    this._size = sz;
	  }
	};



	///--- Exported API

	module.exports = Writer;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		readPkcs1: readPkcs1,
		write: write,
		writePkcs1: writePkcs1
	};

	var assert = __webpack_require__(49);
	var asn1 = __webpack_require__(73);
	var algs = __webpack_require__(50);
	var utils = __webpack_require__(69);

	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);
	var pem = __webpack_require__(72);

	function read(buf) {
		return (pem.read(buf, 'pkcs1'));
	}

	function write(key) {
		return (pem.write(key, 'pkcs1'));
	}

	/* Helper to read in a single mpint */
	function readMPInt(der, nm) {
		assert.strictEqual(der.peek(), asn1.Ber.Integer,
		    nm + ' is not an Integer');
		return (utils.mpNormalize(der.readString(asn1.Ber.Integer, true)));
	}

	function readPkcs1(alg, type, der) {
		switch (alg) {
		case 'RSA':
			if (type === 'public')
				return (readPkcs1RSAPublic(der));
			else if (type === 'private')
				return (readPkcs1RSAPrivate(der));
			throw (new Error('Unknown key type: ' + type));
		case 'DSA':
			if (type === 'public')
				return (readPkcs1DSAPublic(der));
			else if (type === 'private')
				return (readPkcs1DSAPrivate(der));
			throw (new Error('Unknown key type: ' + type));
		case 'EC':
		case 'ECDSA':
			if (type === 'private')
				return (readPkcs1ECDSAPrivate(der));
			else if (type === 'public')
				return (readPkcs1ECDSAPublic(der));
			throw (new Error('Unknown key type: ' + type));
		default:
			throw (new Error('Unknown key algo: ' + alg));
		}
	}

	function readPkcs1RSAPublic(der) {
		// modulus and exponent
		var n = readMPInt(der, 'modulus');
		var e = readMPInt(der, 'exponent');

		// now, make the key
		var key = {
			type: 'rsa',
			parts: [
				{ name: 'e', data: e },
				{ name: 'n', data: n }
			]
		};

		return (new Key(key));
	}

	function readPkcs1RSAPrivate(der) {
		var version = readMPInt(der, 'version');
		assert.strictEqual(version[0], 0);

		// modulus then public exponent
		var n = readMPInt(der, 'modulus');
		var e = readMPInt(der, 'public exponent');
		var d = readMPInt(der, 'private exponent');
		var p = readMPInt(der, 'prime1');
		var q = readMPInt(der, 'prime2');
		var dmodp = readMPInt(der, 'exponent1');
		var dmodq = readMPInt(der, 'exponent2');
		var iqmp = readMPInt(der, 'iqmp');

		// now, make the key
		var key = {
			type: 'rsa',
			parts: [
				{ name: 'n', data: n },
				{ name: 'e', data: e },
				{ name: 'd', data: d },
				{ name: 'iqmp', data: iqmp },
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'dmodp', data: dmodp },
				{ name: 'dmodq', data: dmodq }
			]
		};

		return (new PrivateKey(key));
	}

	function readPkcs1DSAPrivate(der) {
		var version = readMPInt(der, 'version');
		assert.strictEqual(version.readUInt8(0), 0);

		var p = readMPInt(der, 'p');
		var q = readMPInt(der, 'q');
		var g = readMPInt(der, 'g');
		var y = readMPInt(der, 'y');
		var x = readMPInt(der, 'x');

		// now, make the key
		var key = {
			type: 'dsa',
			parts: [
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'g', data: g },
				{ name: 'y', data: y },
				{ name: 'x', data: x }
			]
		};

		return (new PrivateKey(key));
	}

	function readPkcs1DSAPublic(der) {
		var y = readMPInt(der, 'y');
		var p = readMPInt(der, 'p');
		var q = readMPInt(der, 'q');
		var g = readMPInt(der, 'g');

		var key = {
			type: 'dsa',
			parts: [
				{ name: 'y', data: y },
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'g', data: g }
			]
		};

		return (new Key(key));
	}

	function readPkcs1ECDSAPublic(der) {
		der.readSequence();

		var oid = der.readOID();
		assert.strictEqual(oid, '1.2.840.10045.2.1', 'must be ecPublicKey');

		var curveOid = der.readOID();

		var curve;
		var curves = Object.keys(algs.curves);
		for (var j = 0; j < curves.length; ++j) {
			var c = curves[j];
			var cd = algs.curves[c];
			if (cd.pkcs8oid === curveOid) {
				curve = c;
				break;
			}
		}
		assert.string(curve, 'a known ECDSA named curve');

		var Q = der.readString(asn1.Ber.BitString, true);
		Q = utils.ecNormalize(Q);

		var key = {
			type: 'ecdsa',
			parts: [
				{ name: 'curve', data: new Buffer(curve) },
				{ name: 'Q', data: Q }
			]
		};

		return (new Key(key));
	}

	function readPkcs1ECDSAPrivate(der) {
		var version = readMPInt(der, 'version');
		assert.strictEqual(version.readUInt8(0), 1);

		// private key
		var d = der.readString(asn1.Ber.OctetString, true);

		der.readSequence(0xa0);
		var curveOid = der.readOID();

		var curve;
		var curves = Object.keys(algs.curves);
		for (var j = 0; j < curves.length; ++j) {
			var c = curves[j];
			var cd = algs.curves[c];
			if (cd.pkcs8oid === curveOid) {
				curve = c;
				break;
			}
		}
		assert.string(curve, 'a known ECDSA named curve');

		der.readSequence(0xa1);
		var Q = der.readString(asn1.Ber.BitString, true);
		Q = utils.ecNormalize(Q);

		var key = {
			type: 'ecdsa',
			parts: [
				{ name: 'curve', data: new Buffer(curve) },
				{ name: 'Q', data: Q },
				{ name: 'd', data: d }
			]
		};

		return (new PrivateKey(key));
	}

	function writePkcs1(der, key) {
		der.startSequence();

		switch (key.type) {
		case 'rsa':
			if (key instanceof PrivateKey)
				writePkcs1RSAPrivate(der, key);
			else
				writePkcs1RSAPublic(der, key);
			break;
		case 'dsa':
			if (key instanceof PrivateKey)
				writePkcs1DSAPrivate(der, key);
			else
				writePkcs1DSAPublic(der, key);
			break;
		case 'ecdsa':
			if (key instanceof PrivateKey)
				writePkcs1ECDSAPrivate(der, key);
			else
				writePkcs1ECDSAPublic(der, key);
			break;
		default:
			throw (new Error('Unknown key algo: ' + key.type));
		}

		der.endSequence();
	}

	function writePkcs1RSAPublic(der, key) {
		der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
	}

	function writePkcs1RSAPrivate(der, key) {
		var ver = new Buffer(1);
		ver[0] = 0;
		der.writeBuffer(ver, asn1.Ber.Integer);

		der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.d.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		if (!key.part.dmodp || !key.part.dmodq)
			utils.addRSAMissing(key);
		der.writeBuffer(key.part.dmodp.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.dmodq.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.iqmp.data, asn1.Ber.Integer);
	}

	function writePkcs1DSAPrivate(der, key) {
		var ver = new Buffer(1);
		ver[0] = 0;
		der.writeBuffer(ver, asn1.Ber.Integer);

		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.x.data, asn1.Ber.Integer);
	}

	function writePkcs1DSAPublic(der, key) {
		der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
	}

	function writePkcs1ECDSAPublic(der, key) {
		der.startSequence();

		der.writeOID('1.2.840.10045.2.1'); /* ecPublicKey */
		var curve = key.part.curve.data.toString();
		var curveOid = algs.curves[curve].pkcs8oid;
		assert.string(curveOid, 'a known ECDSA named curve');
		der.writeOID(curveOid);

		der.endSequence();

		var Q = utils.ecNormalize(key.part.Q.data, true);
		der.writeBuffer(Q, asn1.Ber.BitString);
	}

	function writePkcs1ECDSAPrivate(der, key) {
		var ver = new Buffer(1);
		ver[0] = 1;
		der.writeBuffer(ver, asn1.Ber.Integer);

		der.writeBuffer(key.part.d.data, asn1.Ber.OctetString);

		der.startSequence(0xa0);
		var curve = key.part.curve.data.toString();
		var curveOid = algs.curves[curve].pkcs8oid;
		assert.string(curveOid, 'a known ECDSA named curve');
		der.writeOID(curveOid);
		der.endSequence();

		der.startSequence(0xa1);
		var Q = utils.ecNormalize(key.part.Q.data, true);
		der.writeBuffer(Q, asn1.Ber.BitString);
		der.endSequence();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		readPkcs8: readPkcs8,
		write: write,
		writePkcs8: writePkcs8
	};

	var assert = __webpack_require__(49);
	var asn1 = __webpack_require__(73);
	var algs = __webpack_require__(50);
	var utils = __webpack_require__(69);
	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);
	var pem = __webpack_require__(72);

	function read(buf) {
		return (pem.read(buf, 'pkcs8'));
	}

	function write(key) {
		return (pem.write(key, 'pkcs8'));
	}

	/* Helper to read in a single mpint */
	function readMPInt(der, nm) {
		assert.strictEqual(der.peek(), asn1.Ber.Integer,
		    nm + ' is not an Integer');
		return (utils.mpNormalize(der.readString(asn1.Ber.Integer, true)));
	}

	function readPkcs8(alg, type, der) {
		/* Private keys in pkcs#8 format have a weird extra int */
		if (der.peek() === asn1.Ber.Integer) {
			assert.strictEqual(type, 'private',
			    'unexpected Integer at start of public key');
			der.readString(asn1.Ber.Integer, true);
		}

		der.readSequence();

		var oid = der.readOID();
		switch (oid) {
		case '1.2.840.113549.1.1.1':
			if (type === 'public')
				return (readPkcs8RSAPublic(der));
			else
				return (readPkcs8RSAPrivate(der));
		case '1.2.840.10040.4.1':
			if (type === 'public')
				return (readPkcs8DSAPublic(der));
			else
				return (readPkcs8DSAPrivate(der));
		case '1.2.840.10045.2.1':
			if (type === 'public')
				return (readPkcs8ECDSAPublic(der));
			else
				return (readPkcs8ECDSAPrivate(der));
		default:
			throw (new Error('Unknown key type OID ' + oid));
		}
	}

	function readPkcs8RSAPublic(der) {
		// Null -- XXX this probably isn't good practice
		der.readByte();
		der.readByte();

		// bit string sequence
		der.readSequence(asn1.Ber.BitString);
		der.readByte();
		der.readSequence();

		// modulus
		var n = readMPInt(der, 'modulus');
		var e = readMPInt(der, 'exponent');

		// now, make the key
		var key = {
			type: 'rsa',
			source: der.originalInput,
			parts: [
				{ name: 'e', data: e },
				{ name: 'n', data: n }
			]
		};

		return (new Key(key));
	}

	function readPkcs8RSAPrivate(der) {
		der.readByte();
		der.readByte();

		der.readSequence(asn1.Ber.OctetString);
		der.readSequence();

		var ver = readMPInt(der, 'version');
		assert.equal(ver[0], 0x0, 'unknown RSA private key version');

		// modulus then public exponent
		var n = readMPInt(der, 'modulus');
		var e = readMPInt(der, 'public exponent');
		var d = readMPInt(der, 'private exponent');
		var p = readMPInt(der, 'prime1');
		var q = readMPInt(der, 'prime2');
		var dmodp = readMPInt(der, 'exponent1');
		var dmodq = readMPInt(der, 'exponent2');
		var iqmp = readMPInt(der, 'iqmp');

		// now, make the key
		var key = {
			type: 'rsa',
			parts: [
				{ name: 'n', data: n },
				{ name: 'e', data: e },
				{ name: 'd', data: d },
				{ name: 'iqmp', data: iqmp },
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'dmodp', data: dmodp },
				{ name: 'dmodq', data: dmodq }
			]
		};

		return (new PrivateKey(key));
	}

	function readPkcs8DSAPublic(der) {
		der.readSequence();

		var p = readMPInt(der, 'p');
		var q = readMPInt(der, 'q');
		var g = readMPInt(der, 'g');

		// bit string sequence
		der.readSequence(asn1.Ber.BitString);
		der.readByte();

		var y = readMPInt(der, 'y');

		// now, make the key
		var key = {
			type: 'dsa',
			parts: [
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'g', data: g },
				{ name: 'y', data: y }
			]
		};

		return (new Key(key));
	}

	function readPkcs8DSAPrivate(der) {
		der.readSequence();

		var p = readMPInt(der, 'p');
		var q = readMPInt(der, 'q');
		var g = readMPInt(der, 'g');

		der.readSequence(asn1.Ber.OctetString);
		var x = readMPInt(der, 'x');

		/* The pkcs#8 format does not include the public key */
		var y = utils.calculateDSAPublic(g, p, x);

		var key = {
			type: 'dsa',
			parts: [
				{ name: 'p', data: p },
				{ name: 'q', data: q },
				{ name: 'g', data: g },
				{ name: 'y', data: y },
				{ name: 'x', data: x }
			]
		};

		return (new PrivateKey(key));
	}

	function readECDSACurve(der) {
		var curveName, curveNames;
		var j, c, cd;

		if (der.peek() === asn1.Ber.OID) {
			var oid = der.readOID();

			curveNames = Object.keys(algs.curves);
			for (j = 0; j < curveNames.length; ++j) {
				c = curveNames[j];
				cd = algs.curves[c];
				if (cd.pkcs8oid === oid) {
					curveName = c;
					break;
				}
			}

		} else {
			// ECParameters sequence
			der.readSequence();
			var version = der.readString(asn1.Ber.Integer, true);
			assert.strictEqual(version[0], 1, 'ECDSA key not version 1');

			var curve = {};

			// FieldID sequence
			der.readSequence();
			var fieldTypeOid = der.readOID();
			assert.strictEqual(fieldTypeOid, '1.2.840.10045.1.1',
			    'ECDSA key is not from a prime-field');
			var p = curve.p = der.readString(asn1.Ber.Integer, true);
			/*
			 * p always starts with a 1 bit, so count the zeros to get its
			 * real size.
			 */
			curve.size = p.length * 8 - utils.countZeros(p);

			// Curve sequence
			der.readSequence();
			curve.a = der.readString(asn1.Ber.OctetString, true);
			curve.b = der.readString(asn1.Ber.OctetString, true);
			if (der.peek() === asn1.Ber.BitString)
				curve.s = der.readString(asn1.Ber.BitString, true);

			// Combined Gx and Gy
			curve.G = der.readString(asn1.Ber.OctetString, true);
			assert.strictEqual(curve.G[0], 0x4,
			    'uncompressed G is required');

			curve.n = der.readString(asn1.Ber.Integer, true);
			curve.h = der.readString(asn1.Ber.Integer, true);
			assert.strictEqual(curve.h[0], 0x1, 'a cofactor=1 curve is ' +
			    'required');

			curveNames = Object.keys(algs.curves);
			for (j = 0; j < curveNames.length; ++j) {
				c = curveNames[j];
				cd = algs.curves[c];
				var ks = Object.keys(cd);
				var equal = true;
				for (var i = 0; i < ks.length; ++i) {
					var k = ks[i];
					if (typeof (cd[k]) === 'object') {
						if (!cd[k].equals(curve[k])) {
							equal = false;
							break;
						}
					} else {
						if (cd[k] !== curve[k]) {
							equal = false;
							break;
						}
					}
				}
				if (equal) {
					curveName = c;
					break;
				}
			}
		}
		return (curveName);
	}

	function readPkcs8ECDSAPrivate(der) {
		var curveName = readECDSACurve(der);
		assert.string(curveName, 'a known elliptic curve');

		der.readSequence(asn1.Ber.OctetString);
		der.readSequence();

		var version = readMPInt(der, 'version');
		assert.equal(version[0], 1, 'unknown version of ECDSA key');

		var d = der.readString(asn1.Ber.OctetString, true);
		der.readSequence(0xa1);

		var Q = der.readString(asn1.Ber.BitString, true);
		Q = utils.ecNormalize(Q);

		var key = {
			type: 'ecdsa',
			parts: [
				{ name: 'curve', data: new Buffer(curveName) },
				{ name: 'Q', data: Q },
				{ name: 'd', data: d }
			]
		};

		return (new PrivateKey(key));
	}

	function readPkcs8ECDSAPublic(der) {
		var curveName = readECDSACurve(der);
		assert.string(curveName, 'a known elliptic curve');

		var Q = der.readString(asn1.Ber.BitString, true);
		Q = utils.ecNormalize(Q);

		var key = {
			type: 'ecdsa',
			parts: [
				{ name: 'curve', data: new Buffer(curveName) },
				{ name: 'Q', data: Q }
			]
		};

		return (new Key(key));
	}

	function writePkcs8(der, key) {
		der.startSequence();

		if (key instanceof PrivateKey) {
			var sillyInt = new Buffer(1);
			sillyInt[0] = 0x0;
			der.writeBuffer(sillyInt, asn1.Ber.Integer);
		}

		der.startSequence();
		switch (key.type) {
		case 'rsa':
			der.writeOID('1.2.840.113549.1.1.1');
			if (key instanceof PrivateKey)
				writePkcs8RSAPrivate(key, der);
			else
				writePkcs8RSAPublic(key, der);
			break;
		case 'dsa':
			der.writeOID('1.2.840.10040.4.1');
			if (key instanceof PrivateKey)
				writePkcs8DSAPrivate(key, der);
			else
				writePkcs8DSAPublic(key, der);
			break;
		case 'ecdsa':
			der.writeOID('1.2.840.10045.2.1');
			if (key instanceof PrivateKey)
				writePkcs8ECDSAPrivate(key, der);
			else
				writePkcs8ECDSAPublic(key, der);
			break;
		default:
			throw (new Error('Unsupported key type: ' + key.type));
		}

		der.endSequence();
	}

	function writePkcs8RSAPrivate(key, der) {
		der.writeNull();
		der.endSequence();

		der.startSequence(asn1.Ber.OctetString);
		der.startSequence();

		var version = new Buffer(1);
		version[0] = 0;
		der.writeBuffer(version, asn1.Ber.Integer);

		der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.d.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		if (!key.part.dmodp || !key.part.dmodq)
			utils.addRSAMissing(key);
		der.writeBuffer(key.part.dmodp.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.dmodq.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.iqmp.data, asn1.Ber.Integer);

		der.endSequence();
		der.endSequence();
	}

	function writePkcs8RSAPublic(key, der) {
		der.writeNull();
		der.endSequence();

		der.startSequence(asn1.Ber.BitString);
		der.writeByte(0x00);

		der.startSequence();
		der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
		der.endSequence();

		der.endSequence();
	}

	function writePkcs8DSAPrivate(key, der) {
		der.startSequence();
		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
		der.endSequence();

		der.endSequence();

		der.startSequence(asn1.Ber.OctetString);
		der.writeBuffer(key.part.x.data, asn1.Ber.Integer);
		der.endSequence();
	}

	function writePkcs8DSAPublic(key, der) {
		der.startSequence();
		der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
		der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
		der.endSequence();
		der.endSequence();

		der.startSequence(asn1.Ber.BitString);
		der.writeByte(0x00);
		der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
		der.endSequence();
	}

	function writeECDSACurve(key, der) {
		var curve = algs.curves[key.curve];
		if (curve.pkcs8oid) {
			/* This one has a name in pkcs#8, so just write the oid */
			der.writeOID(curve.pkcs8oid);

		} else {
			// ECParameters sequence
			der.startSequence();

			var version = new Buffer(1);
			version.writeUInt8(1, 0);
			der.writeBuffer(version, asn1.Ber.Integer);

			// FieldID sequence
			der.startSequence();
			der.writeOID('1.2.840.10045.1.1'); // prime-field
			der.writeBuffer(curve.p, asn1.Ber.Integer);
			der.endSequence();

			// Curve sequence
			der.startSequence();
			var a = curve.p;
			if (a[0] === 0x0)
				a = a.slice(1);
			der.writeBuffer(a, asn1.Ber.OctetString);
			der.writeBuffer(curve.b, asn1.Ber.OctetString);
			der.writeBuffer(curve.s, asn1.Ber.BitString);
			der.endSequence();

			der.writeBuffer(curve.G, asn1.Ber.OctetString);
			der.writeBuffer(curve.n, asn1.Ber.Integer);
			var h = curve.h;
			if (!h) {
				h = new Buffer(1);
				h[0] = 1;
			}
			der.writeBuffer(h, asn1.Ber.Integer);

			// ECParameters
			der.endSequence();
		}
	}

	function writePkcs8ECDSAPublic(key, der) {
		writeECDSACurve(key, der);
		der.endSequence();

		var Q = utils.ecNormalize(key.part.Q.data, true);
		der.writeBuffer(Q, asn1.Ber.BitString);
	}

	function writePkcs8ECDSAPrivate(key, der) {
		writeECDSACurve(key, der);
		der.endSequence();

		der.startSequence(asn1.Ber.OctetString);
		der.startSequence();

		var version = new Buffer(1);
		version[0] = 1;
		der.writeBuffer(version, asn1.Ber.Integer);

		der.writeBuffer(key.part.d.data, asn1.Ber.OctetString);

		der.startSequence(0xa1);
		var Q = utils.ecNormalize(key.part.Q.data, true);
		der.writeBuffer(Q, asn1.Ber.BitString);
		der.endSequence();

		der.endSequence();
		der.endSequence();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		readSSHPrivate: readSSHPrivate,
		write: write
	};

	var assert = __webpack_require__(49);
	var asn1 = __webpack_require__(73);
	var algs = __webpack_require__(50);
	var utils = __webpack_require__(69);
	var crypto = __webpack_require__(51);

	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);
	var pem = __webpack_require__(72);
	var rfc4253 = __webpack_require__(82);
	var SSHBuffer = __webpack_require__(83);

	function read(buf) {
		return (pem.read(buf));
	}

	var MAGIC = 'openssh-key-v1';

	function readSSHPrivate(type, buf) {
		buf = new SSHBuffer({buffer: buf});

		var magic = buf.readCString();
		assert.strictEqual(magic, MAGIC, 'bad magic string');

		var cipher = buf.readString();
		var kdf = buf.readString();

		/* We only support unencrypted keys. */
		if (cipher !== 'none' || kdf !== 'none') {
			throw (new Error('OpenSSH-format key is encrypted ' +
			     '(password-protected). Please use the SSH agent ' +
			     'or decrypt the key.'));
		}

		/* Skip over kdfoptions. */
		buf.readString();

		var nkeys = buf.readInt();
		if (nkeys !== 1) {
			throw (new Error('OpenSSH-format key file contains ' +
			    'multiple keys: this is unsupported.'));
		}

		var pubKey = buf.readBuffer();

		if (type === 'public') {
			assert.ok(buf.atEnd(), 'excess bytes left after key');
			return (rfc4253.read(pubKey));
		}

		var privKeyBlob = buf.readBuffer();
		assert.ok(buf.atEnd(), 'excess bytes left after key');

		buf = new SSHBuffer({buffer: privKeyBlob});

		var checkInt1 = buf.readInt();
		var checkInt2 = buf.readInt();
		assert.strictEqual(checkInt1, checkInt2, 'checkints do not match');

		var key = rfc4253.readPartial('private', buf.remainder());

		var len = key.toBuffer('rfc4253').length;
		buf.skip(len);

		var comment = buf.readString();
		key.comment = comment;

		return (key);
	}

	function write(key) {
		var pubKey;
		if (key instanceof PrivateKey)
			pubKey = key.toPublic();
		else
			pubKey = key;

		var privBuf;
		if (key instanceof PrivateKey) {
			privBuf = new SSHBuffer({});
			var checkInt = crypto.randomBytes(4).readUInt32BE(0);
			privBuf.writeInt(checkInt);
			privBuf.writeInt(checkInt);
			privBuf.write(key.toBuffer('rfc4253'));
			privBuf.writeString(key.comment || '');

			var n = 1;
			while (privBuf._offset % 8 !== 0)
				privBuf.writeChar(n++);
		}

		var buf = new SSHBuffer({});

		buf.writeCString(MAGIC);
		buf.writeString('none');	/* cipher */
		buf.writeString('none');	/* kdf */
		buf.writeBuffer(new Buffer(0));	/* kdfoptions */

		buf.writeInt(1);		/* nkeys */
		buf.writeBuffer(pubKey.toBuffer('rfc4253'));

		if (privBuf)
			buf.writeBuffer(privBuf.toBuffer());

		buf = buf.toBuffer();

		var header;
		if (key instanceof PrivateKey)
			header = 'OPENSSH PRIVATE KEY';
		else
			header = 'OPENSSH PUBLIC KEY';

		var tmp = buf.toString('base64');
		var len = tmp.length + (tmp.length / 70) +
		    18 + 16 + header.length*2 + 10;
		buf = new Buffer(len);
		var o = 0;
		o += buf.write('-----BEGIN ' + header + '-----\n', o);
		for (var i = 0; i < tmp.length; ) {
			var limit = i + 70;
			if (limit > tmp.length)
				limit = tmp.length;
			o += buf.write(tmp.slice(i, limit), o);
			buf[o++] = 10;
			i = limit;
		}
		o += buf.write('-----END ' + header + '-----\n', o);

		return (buf.slice(0, o));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read.bind(undefined, false, undefined),
		readType: read.bind(undefined, false),
		write: write,
		/* semi-private api, used by sshpk-agent */
		readPartial: read.bind(undefined, true),

		/* shared with ssh format */
		readInternal: read,
		keyTypeToAlg: keyTypeToAlg,
		algToKeyType: algToKeyType
	};

	var assert = __webpack_require__(49);
	var algs = __webpack_require__(50);
	var utils = __webpack_require__(69);
	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);
	var SSHBuffer = __webpack_require__(83);

	function algToKeyType(alg) {
		assert.string(alg);
		if (alg === 'ssh-dss')
			return ('dsa');
		else if (alg === 'ssh-rsa')
			return ('rsa');
		else if (alg === 'ssh-ed25519')
			return ('ed25519');
		else if (alg.match(/^ecdsa-sha2-/))
			return ('ecdsa');
		else
			throw (new Error('Unknown algorithm ' + alg));
	}

	function keyTypeToAlg(key) {
		assert.object(key);
		if (key.type === 'dsa')
			return ('ssh-dss');
		else if (key.type === 'rsa')
			return ('ssh-rsa');
		else if (key.type === 'ed25519')
			return ('ssh-ed25519');
		else if (key.type === 'ecdsa')
			return ('ecdsa-sha2-' + key.part.curve.data.toString());
		else
			throw (new Error('Unknown key type ' + key.type));
	}

	function read(partial, type, buf) {
		if (typeof (buf) === 'string')
			buf = new Buffer(buf);
		assert.buffer(buf, 'buf');

		var key = {};

		var parts = key.parts = [];
		var sshbuf = new SSHBuffer({buffer: buf});

		var alg = sshbuf.readString();
		assert.ok(!sshbuf.atEnd(), 'key must have at least one part');

		key.type = algToKeyType(alg);

		var partCount = algs.info[key.type].parts.length;
		if (type && type === 'private')
			partCount = algs.privInfo[key.type].parts.length;

		while (!sshbuf.atEnd() && parts.length < partCount)
			parts.push(sshbuf.readPart());
		while (!partial && !sshbuf.atEnd())
			parts.push(sshbuf.readPart());

		assert.ok(parts.length >= 1,
		    'key must have at least one part');
		assert.ok(partial || sshbuf.atEnd(),
		    'leftover bytes at end of key');

		var Constructor = Key;
		var algInfo = algs.info[key.type];
		if (type === 'private' || algInfo.parts.length !== parts.length) {
			algInfo = algs.privInfo[key.type];
			Constructor = PrivateKey;
		}
		assert.strictEqual(algInfo.parts.length, parts.length);

		if (key.type === 'ecdsa') {
			var res = /^ecdsa-sha2-(.+)$/.exec(alg);
			assert.ok(res !== null);
			assert.strictEqual(res[1], parts[0].data.toString());
		}

		var normalized = true;
		for (var i = 0; i < algInfo.parts.length; ++i) {
			if (parts[i].name !== 'curve') {
				var p = parts[i];
				var nd = utils.mpNormalize(p.data);
				if (nd !== p.data) {
					p.data = nd;
					normalized = false;
				}
			}
			parts[i].name = algInfo.parts[i];
		}

		if (normalized)
			key._rfc4253Cache = sshbuf.toBuffer();

		return (new Constructor(key));
	}

	function write(key) {
		assert.object(key);

		var alg = keyTypeToAlg(key);
		var i;

		var algInfo = algs.info[key.type];
		if (key instanceof PrivateKey)
			algInfo = algs.privInfo[key.type];
		var parts = algInfo.parts;

		var buf = new SSHBuffer({});

		buf.writeString(alg);

		for (i = 0; i < parts.length; ++i) {
			var data = key.part[parts[i]].data;
			data = utils.mpNormalize(data);
			buf.writeBuffer(data);
		}

		return (buf.toBuffer());
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = SSHBuffer;

	var assert = __webpack_require__(49);

	function SSHBuffer(opts) {
		assert.object(opts, 'options');
		if (opts.buffer !== undefined)
			assert.buffer(opts.buffer, 'options.buffer');

		this._size = opts.buffer ? opts.buffer.length : 1024;
		this._buffer = opts.buffer || (new Buffer(this._size));
		this._offset = 0;
	}

	SSHBuffer.prototype.toBuffer = function () {
		return (this._buffer.slice(0, this._offset));
	};

	SSHBuffer.prototype.atEnd = function () {
		return (this._offset >= this._buffer.length);
	};

	SSHBuffer.prototype.remainder = function () {
		return (this._buffer.slice(this._offset));
	};

	SSHBuffer.prototype.skip = function (n) {
		this._offset += n;
	};

	SSHBuffer.prototype.expand = function () {
		this._size *= 2;
		var buf = new Buffer(this._size);
		this._buffer.copy(buf, 0);
		this._buffer = buf;
	};

	SSHBuffer.prototype.readPart = function () {
		return ({data: this.readBuffer()});
	};

	SSHBuffer.prototype.readBuffer = function () {
		var len = this._buffer.readUInt32BE(this._offset);
		this._offset += 4;
		assert.ok(this._offset + len <= this._buffer.length,
		    'length out of bounds at +0x' + this._offset.toString(16));
		var buf = this._buffer.slice(this._offset, this._offset + len);
		this._offset += len;
		return (buf);
	};

	SSHBuffer.prototype.readString = function () {
		return (this.readBuffer().toString());
	};

	SSHBuffer.prototype.readCString = function () {
		var offset = this._offset;
		while (offset < this._buffer.length &&
		    this._buffer[offset] !== 0x00)
			offset++;
		assert.ok(offset < this._buffer.length, 'c string does not terminate');
		var str = this._buffer.slice(this._offset, offset).toString();
		this._offset = offset + 1;
		return (str);
	};

	SSHBuffer.prototype.readInt = function () {
		var v = this._buffer.readUInt32BE(this._offset);
		this._offset += 4;
		return (v);
	};

	SSHBuffer.prototype.readChar = function () {
		var v = this._buffer[this._offset++];
		return (v);
	};

	SSHBuffer.prototype.writeBuffer = function (buf) {
		while (this._offset + 4 + buf.length > this._size)
			this.expand();
		this._buffer.writeUInt32BE(buf.length, this._offset);
		this._offset += 4;
		buf.copy(this._buffer, this._offset);
		this._offset += buf.length;
	};

	SSHBuffer.prototype.writeString = function (str) {
		this.writeBuffer(new Buffer(str, 'utf8'));
	};

	SSHBuffer.prototype.writeCString = function (str) {
		while (this._offset + 1 + str.length > this._size)
			this.expand();
		this._buffer.write(str, this._offset);
		this._offset += str.length;
		this._buffer[this._offset++] = 0;
	};

	SSHBuffer.prototype.writeInt = function (v) {
		while (this._offset + 4 > this._size)
			this.expand();
		this._buffer.writeUInt32BE(v, this._offset);
		this._offset += 4;
	};

	SSHBuffer.prototype.writeChar = function (v) {
		while (this._offset + 1 > this._size)
			this.expand();
		this._buffer[this._offset++] = v;
	};

	SSHBuffer.prototype.writePart = function (p) {
		this.writeBuffer(p.data);
	};

	SSHBuffer.prototype.write = function (buf) {
		while (this._offset + buf.length > this._size)
			this.expand();
		buf.copy(this._buffer, this._offset);
		this._offset += buf.length;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	module.exports = {
		read: read,
		write: write
	};

	var assert = __webpack_require__(49);
	var rfc4253 = __webpack_require__(82);
	var utils = __webpack_require__(69);
	var Key = __webpack_require__(48);
	var PrivateKey = __webpack_require__(70);

	var sshpriv = __webpack_require__(81);

	/*JSSTYLED*/
	var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([\n \t]+([^\n]+))?$/;
	/*JSSTYLED*/
	var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/ \t\n]+[=]*)/;

	function read(buf) {
		if (typeof (buf) !== 'string') {
			assert.buffer(buf, 'buf');
			buf = buf.toString('ascii');
		}

		var trimmed = buf.trim().replace(/[\\\r]/g, '');
		var m = trimmed.match(SSHKEY_RE);
		if (!m)
			m = trimmed.match(SSHKEY_RE2);
		assert.ok(m, 'key must match regex');

		var type = rfc4253.algToKeyType(m[1]);
		var kbuf = new Buffer(m[2], 'base64');

		/*
		 * This is a bit tricky. If we managed to parse the key and locate the
		 * key comment with the regex, then do a non-partial read and assert
		 * that we have consumed all bytes. If we couldn't locate the key
		 * comment, though, there may be whitespace shenanigans going on that
		 * have conjoined the comment to the rest of the key. We do a partial
		 * read in this case to try to make the best out of a sorry situation.
		 */
		var key;
		if (m[4]) {
			try {
				key = rfc4253.read(kbuf);

			} catch (e) {
				m = trimmed.match(SSHKEY_RE2);
				assert.ok(m, 'key must match regex');
				kbuf = new Buffer(m[2], 'base64');
				key = rfc4253.readPartial('public', kbuf);
			}
		} else {
			key = rfc4253.readPartial('public', kbuf);
		}

		assert.strictEqual(type, key.type);

		if (m[4] && m[4].length > 0)
			key.comment = m[4];

		return (key);
	}

	function write(key) {
		assert.object(key);
		if (key instanceof PrivateKey)
			throw (new Error('Private keys are not supported'));

		var parts = [];
		var alg = rfc4253.keyTypeToAlg(key);
		parts.push(alg);

		var buf = rfc4253.write(key);
		parts.push(buf.toString('base64'));

		if (key.comment)
			parts.push(key.comment);

		return (new Buffer(parts.join(' ')));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var bigInt = (function (undefined) {
	    "use strict";

	    var BASE = 1e7,
	        LOG_BASE = 7,
	        MAX_INT = 9007199254740992,
	        MAX_INT_ARR = smallToArray(MAX_INT),
	        LOG_MAX_INT = Math.log(MAX_INT);

	    function BigInteger(value, sign) {
	        this.value = value;
	        this.sign = sign;
	        this.isSmall = false;
	    }

	    function SmallInteger(value) {
	        this.value = value;
	        this.sign = value < 0;
	        this.isSmall = true;
	    }

	    function isPrecise(n) {
	        return -MAX_INT < n && n < MAX_INT;
	    }

	    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
	        if (n < 1e7)
	            return [n];
	        if (n < 1e14)
	            return [n % 1e7, Math.floor(n / 1e7)];
	        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
	    }

	    function arrayToSmall(arr) { // If BASE changes this function may need to change
	        trim(arr);
	        var length = arr.length;
	        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
	            switch (length) {
	                case 0: return 0;
	                case 1: return arr[0];
	                case 2: return arr[0] + arr[1] * BASE;
	                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
	            }
	        }
	        return arr;
	    }

	    function trim(v) {
	        var i = v.length;
	        while (v[--i] === 0);
	        v.length = i + 1;
	    }

	    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
	        var x = new Array(length);
	        var i = -1;
	        while (++i < length) {
	            x[i] = 0;
	        }
	        return x;
	    }

	    function truncate(n) {
	        if (n > 0) return Math.floor(n);
	        return Math.ceil(n);
	    }

	    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
	        var l_a = a.length,
	            l_b = b.length,
	            r = new Array(l_a),
	            carry = 0,
	            base = BASE,
	            sum, i;
	        for (i = 0; i < l_b; i++) {
	            sum = a[i] + b[i] + carry;
	            carry = sum >= base ? 1 : 0;
	            r[i] = sum - carry * base;
	        }
	        while (i < l_a) {
	            sum = a[i] + carry;
	            carry = sum === base ? 1 : 0;
	            r[i++] = sum - carry * base;
	        }
	        if (carry > 0) r.push(carry);
	        return r;
	    }

	    function addAny(a, b) {
	        if (a.length >= b.length) return add(a, b);
	        return add(b, a);
	    }

	    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
	        var l = a.length,
	            r = new Array(l),
	            base = BASE,
	            sum, i;
	        for (i = 0; i < l; i++) {
	            sum = a[i] - base + carry;
	            carry = Math.floor(sum / base);
	            r[i] = sum - carry * base;
	            carry += 1;
	        }
	        while (carry > 0) {
	            r[i++] = carry % base;
	            carry = Math.floor(carry / base);
	        }
	        return r;
	    }

	    BigInteger.prototype.add = function (v) {
	        var value, n = parseValue(v);
	        if (this.sign !== n.sign) {
	            return this.subtract(n.negate());
	        }
	        var a = this.value, b = n.value;
	        if (n.isSmall) {
	            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
	        }
	        return new BigInteger(addAny(a, b), this.sign);
	    };
	    BigInteger.prototype.plus = BigInteger.prototype.add;

	    SmallInteger.prototype.add = function (v) {
	        var n = parseValue(v);
	        var a = this.value;
	        if (a < 0 !== n.sign) {
	            return this.subtract(n.negate());
	        }
	        var b = n.value;
	        if (n.isSmall) {
	            if (isPrecise(a + b)) return new SmallInteger(a + b);
	            b = smallToArray(Math.abs(b));
	        }
	        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
	    };
	    SmallInteger.prototype.plus = SmallInteger.prototype.add;

	    function subtract(a, b) { // assumes a and b are arrays with a >= b
	        var a_l = a.length,
	            b_l = b.length,
	            r = new Array(a_l),
	            borrow = 0,
	            base = BASE,
	            i, difference;
	        for (i = 0; i < b_l; i++) {
	            difference = a[i] - borrow - b[i];
	            if (difference < 0) {
	                difference += base;
	                borrow = 1;
	            } else borrow = 0;
	            r[i] = difference;
	        }
	        for (i = b_l; i < a_l; i++) {
	            difference = a[i] - borrow;
	            if (difference < 0) difference += base;
	            else {
	                r[i++] = difference;
	                break;
	            }
	            r[i] = difference;
	        }
	        for (; i < a_l; i++) {
	            r[i] = a[i];
	        }
	        trim(r);
	        return r;
	    }

	    function subtractAny(a, b, sign) {
	        var value, isSmall;
	        if (compareAbs(a, b) >= 0) {
	            value = subtract(a,b);
	        } else {
	            value = subtract(b, a);
	            sign = !sign;
	        }
	        value = arrayToSmall(value);
	        if (typeof value === "number") {
	            if (sign) value = -value;
	            return new SmallInteger(value);
	        }
	        return new BigInteger(value, sign);
	    }

	    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
	        var l = a.length,
	            r = new Array(l),
	            carry = -b,
	            base = BASE,
	            i, difference;
	        for (i = 0; i < l; i++) {
	            difference = a[i] + carry;
	            carry = Math.floor(difference / base);
	            difference %= base;
	            r[i] = difference < 0 ? difference + base : difference;
	        }
	        r = arrayToSmall(r);
	        if (typeof r === "number") {
	            if (sign) r = -r;
	            return new SmallInteger(r);
	        } return new BigInteger(r, sign);
	    }

	    BigInteger.prototype.subtract = function (v) {
	        var n = parseValue(v);
	        if (this.sign !== n.sign) {
	            return this.add(n.negate());
	        }
	        var a = this.value, b = n.value;
	        if (n.isSmall)
	            return subtractSmall(a, Math.abs(b), this.sign);
	        return subtractAny(a, b, this.sign);
	    };
	    BigInteger.prototype.minus = BigInteger.prototype.subtract;

	    SmallInteger.prototype.subtract = function (v) {
	        var n = parseValue(v);
	        var a = this.value;
	        if (a < 0 !== n.sign) {
	            return this.add(n.negate());
	        }
	        var b = n.value;
	        if (n.isSmall) {
	            return new SmallInteger(a - b);
	        }
	        return subtractSmall(b, Math.abs(a), a >= 0);
	    };
	    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

	    BigInteger.prototype.negate = function () {
	        return new BigInteger(this.value, !this.sign);
	    };
	    SmallInteger.prototype.negate = function () {
	        var sign = this.sign;
	        var small = new SmallInteger(-this.value);
	        small.sign = !sign;
	        return small;
	    };

	    BigInteger.prototype.abs = function () {
	        return new BigInteger(this.value, false);
	    };
	    SmallInteger.prototype.abs = function () {
	        return new SmallInteger(Math.abs(this.value));
	    };

	    function multiplyLong(a, b) {
	        var a_l = a.length,
	            b_l = b.length,
	            l = a_l + b_l,
	            r = createArray(l),
	            base = BASE,
	            product, carry, i, a_i, b_j;
	        for (i = 0; i < a_l; ++i) {
	            a_i = a[i];
	            for (var j = 0; j < b_l; ++j) {
	                b_j = b[j];
	                product = a_i * b_j + r[i + j];
	                carry = Math.floor(product / base);
	                r[i + j] = product - carry * base;
	                r[i + j + 1] += carry;
	            }
	        }
	        trim(r);
	        return r;
	    }

	    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
	        var l = a.length,
	            r = new Array(l),
	            base = BASE,
	            carry = 0,
	            product, i;
	        for (i = 0; i < l; i++) {
	            product = a[i] * b + carry;
	            carry = Math.floor(product / base);
	            r[i] = product - carry * base;
	        }
	        while (carry > 0) {
	            r[i++] = carry % base;
	            carry = Math.floor(carry / base);
	        }
	        return r;
	    }

	    function shiftLeft(x, n) {
	        var r = [];
	        while (n-- > 0) r.push(0);
	        return r.concat(x);
	    }

	    function multiplyKaratsuba(x, y) {
	        var n = Math.max(x.length, y.length);
	        
	        if (n <= 400) return multiplyLong(x, y);
	        n = Math.ceil(n / 2);

	        var b = x.slice(n),
	            a = x.slice(0, n),
	            d = y.slice(n),
	            c = y.slice(0, n);

	        var ac = multiplyKaratsuba(a, c),
	            bd = multiplyKaratsuba(b, d),
	            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

	        return addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
	    }

	    BigInteger.prototype.multiply = function (v) {
	        var value, n = parseValue(v),
	            a = this.value, b = n.value,
	            sign = this.sign !== n.sign,
	            abs;
	        if (n.isSmall) {
	            if (b === 0) return CACHE[0];
	            if (b === 1) return this;
	            if (b === -1) return this.negate();
	            abs = Math.abs(b);
	            if (abs < BASE) {
	                return new BigInteger(multiplySmall(a, abs), sign);
	            }
	            b = smallToArray(abs);
	        }
	        if (a.length + b.length > 4000) // Karatsuba is only faster for sufficiently large inputs
	            return new BigInteger(multiplyKaratsuba(a, b), sign);
	        return new BigInteger(multiplyLong(a, b), sign);
	    };

	    BigInteger.prototype.times = BigInteger.prototype.multiply;

	    function multiplySmallAndArray(a, b, sign) { // a >= 0
	        if (a < BASE) {
	            return new BigInteger(multiplySmall(b, a), sign);
	        }
	        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
	    }
	    SmallInteger.prototype["_multiplyBySmall"] = function (a) {
	            if (isPrecise(a.value * this.value)) {
	                return new SmallInteger(a.value * this.value);
	            }
	            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
	    };
	    BigInteger.prototype["_multiplyBySmall"] = function (a) {
	            if (a.value === 0) return CACHE[0];
	            if (a.value === 1) return this;
	            if (a.value === -1) return this.negate();
	            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
	    };
	    SmallInteger.prototype.multiply = function (v) {
	        return parseValue(v)["_multiplyBySmall"](this);
	    };
	    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

	    function square(a) {
	        var l = a.length,
	            r = createArray(l + l),
	            base = BASE,
	            product, carry, i, a_i, a_j;
	        for (i = 0; i < l; i++) {
	            a_i = a[i];
	            for (var j = 0; j < l; j++) {
	                a_j = a[j];
	                product = a_i * a_j + r[i + j];
	                carry = Math.floor(product / base);
	                r[i + j] = product - carry * base;
	                r[i + j + 1] += carry;
	            }
	        }
	        trim(r);
	        return r;
	    }

	    BigInteger.prototype.square = function () {
	        return new BigInteger(square(this.value), false);
	    };

	    SmallInteger.prototype.square = function () {
	        var value = this.value * this.value;
	        if (isPrecise(value)) return new SmallInteger(value);
	        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
	    };

	    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
	        var a_l = a.length,
	            b_l = b.length,
	            base = BASE,
	            result = createArray(b.length),
	            divisorMostSignificantDigit = b[b_l - 1],
	            // normalization
	            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
	            remainder = multiplySmall(a, lambda),
	            divisor = multiplySmall(b, lambda),
	            quotientDigit, shift, carry, borrow, i, l, q;
	        if (remainder.length <= a_l) remainder.push(0);
	        divisor.push(0);
	        divisorMostSignificantDigit = divisor[b_l - 1];
	        for (shift = a_l - b_l; shift >= 0; shift--) {
	            quotientDigit = base - 1;
	            quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
	            carry = 0;
	            borrow = 0;
	            l = divisor.length;
	            for (i = 0; i < l; i++) {
	                carry += quotientDigit * divisor[i];
	                q = Math.floor(carry / base);
	                borrow += remainder[shift + i] - (carry - q * base);
	                carry = q;
	                if (borrow < 0) {
	                    remainder[shift + i] = borrow + base;
	                    borrow = -1;
	                } else {
	                    remainder[shift + i] = borrow;
	                    borrow = 0;
	                }
	            }
	            while (borrow !== 0) {
	                quotientDigit -= 1;
	                carry = 0;
	                for (i = 0; i < l; i++) {
	                    carry += remainder[shift + i] - base + divisor[i];
	                    if (carry < 0) {
	                        remainder[shift + i] = carry + base;
	                        carry = 0;
	                    } else {
	                        remainder[shift + i] = carry;
	                        carry = 1;
	                    }
	                }
	                borrow += carry;
	            }
	            result[shift] = quotientDigit;
	        }
	        // denormalization
	        remainder = divModSmall(remainder, lambda)[0];
	        return [arrayToSmall(result), arrayToSmall(remainder)];
	    }

	    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
	        // Performs faster than divMod1 on larger input sizes.
	        var a_l = a.length,
	            b_l = b.length,
	            result = [],
	            part = [],
	            base = BASE,
	            guess, xlen, highx, highy, check;
	        while (a_l) {
	            part.unshift(a[--a_l]);
	            if (compareAbs(part, b) < 0) {
	                result.push(0);
	                continue;
	            }
	            xlen = part.length;
	            highx = part[xlen - 1] * base + part[xlen - 2];
	            highy = b[b_l - 1] * base + b[b_l - 2];
	            if (xlen > b_l) {
	                highx = (highx + 1) * base;
	            }
	            guess = Math.ceil(highx / highy);
	            do {
	                check = multiplySmall(b, guess);
	                if (compareAbs(check, part) <= 0) break;
	                guess--;
	            } while (guess);
	            result.push(guess);
	            part = subtract(part, check);
	        }
	        result.reverse();
	        return [arrayToSmall(result), arrayToSmall(part)];
	    }

	    function divModSmall(value, lambda) {
	        var length = value.length,
	            quotient = createArray(length),
	            base = BASE,
	            i, q, remainder, divisor;
	        remainder = 0;
	        for (i = length - 1; i >= 0; --i) {
	            divisor = remainder * base + value[i];
	            q = truncate(divisor / lambda);
	            remainder = divisor - q * lambda;
	            quotient[i] = q | 0;
	        }
	        return [quotient, remainder | 0];
	    }

	    function divModAny(self, v) {
	        var value, n = parseValue(v);
	        var a = self.value, b = n.value;
	        var quotient;
	        if (b === 0) throw new Error("Cannot divide by zero");
	        if (self.isSmall) {
	            if (n.isSmall) {
	                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
	            }
	            return [CACHE[0], self];
	        }
	        if (n.isSmall) {
	            if (b === 1) return [self, CACHE[0]];
	            if (b == -1) return [self.negate(), CACHE[0]];
	            var abs = Math.abs(b);
	            if (abs < BASE) {
	                value = divModSmall(a, abs);
	                quotient = arrayToSmall(value[0]);
	                var remainder = value[1];
	                if (self.sign) remainder = -remainder;
	                if (typeof quotient === "number") {
	                    if (self.sign !== n.sign) quotient = -quotient;
	                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
	                }
	                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
	            }
	            b = smallToArray(abs);
	        }
	        var comparison = compareAbs(a, b);
	        if (comparison === -1) return [CACHE[0], self];
	        if (comparison === 0) return [CACHE[self.sign === n.sign ? 1 : -1], CACHE[0]];

	        // divMod1 is faster on smaller input sizes
	        if (a.length + b.length <= 200)
	            value = divMod1(a, b);
	        else value = divMod2(a, b);

	        quotient = value[0];
	        var qSign = self.sign !== n.sign,
	            mod = value[1],
	            mSign = self.sign;
	        if (typeof quotient === "number") {
	            if (qSign) quotient = -quotient;
	            quotient = new SmallInteger(quotient);
	        } else quotient = new BigInteger(quotient, qSign);
	        if (typeof mod === "number") {
	            if (mSign) mod = -mod;
	            mod = new SmallInteger(mod);
	        } else mod = new BigInteger(mod, mSign);
	        return [quotient, mod];
	    }

	    BigInteger.prototype.divmod = function (v) {
	        var result = divModAny(this, v);
	        return {
	            quotient: result[0],
	            remainder: result[1]
	        };
	    };
	    SmallInteger.prototype.divmod = BigInteger.prototype.divmod;

	    BigInteger.prototype.divide = function (v) {
	        return divModAny(this, v)[0];
	    };
	    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

	    BigInteger.prototype.mod = function (v) {
	        return divModAny(this, v)[1];
	    };
	    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

	    BigInteger.prototype.pow = function (v) {
	        var n = parseValue(v),
	            a = this.value,
	            b = n.value,
	            value, x, y;
	        if (b === 0) return CACHE[1];
	        if (a === 0) return CACHE[0];
	        if (a === 1) return CACHE[1];
	        if (a === -1) return n.isEven() ? CACHE[1] : CACHE[-1];
	        if (n.sign) {
	            return CACHE[0];
	        }
	        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
	        if (this.isSmall) {
	            if (isPrecise(value = Math.pow(a, b)))
	                return new SmallInteger(truncate(value));
	        }
	        x = this;
	        y = CACHE[1];
	        while (true) {
	            if (b & 1 === 1) {
	                y = y.times(x);
	                --b;
	            }
	            if (b === 0) break;
	            b /= 2;
	            x = x.square();
	        }
	        return y;
	    };
	    SmallInteger.prototype.pow = BigInteger.prototype.pow;

	    BigInteger.prototype.modPow = function (exp, mod) {
	        exp = parseValue(exp);
	        mod = parseValue(mod);
	        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
	        var r = CACHE[1],
	            base = this.mod(mod);
	        if (base.isZero()) return CACHE[0];
	        while (exp.isPositive()) {
	            if (exp.isOdd()) r = r.multiply(base).mod(mod);
	            exp = exp.divide(2);
	            base = base.square().mod(mod);
	        }
	        return r;
	    };
	    SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

	    function compareAbs(a, b) {
	        if (a.length !== b.length) {
	            return a.length > b.length ? 1 : -1;
	        }
	        for (var i = a.length - 1; i >= 0; i--) {
	            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
	        }
	        return 0;
	    }

	    BigInteger.prototype.compareAbs = function (v) {
	        var n = parseValue(v),
	            a = this.value,
	            b = n.value;
	        if (n.isSmall) return 1;
	        return compareAbs(a, b);
	    };
	    SmallInteger.prototype.compareAbs = function (v) {
	        var n = parseValue(v),
	            a = Math.abs(this.value),
	            b = n.value;
	        if (n.isSmall) {
	            b = Math.abs(b);
	            return a === b ? 0 : a > b ? 1 : -1;
	        }
	        return -1;
	    };

	    BigInteger.prototype.compare = function (v) {
	        var n = parseValue(v),
	            a = this.value,
	            b = n.value;
	        if (this.sign !== n.sign) {
	            return n.sign ? 1 : -1;
	        }
	        if (n.isSmall) {
	            return this.sign ? -1 : 1;
	        }
	        return compareAbs(a, b) * (this.sign ? -1 : 1);
	    };
	    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

	    SmallInteger.prototype.compare = function (v) {
	        var n = parseValue(v),
	            a = this.value,
	            b = n.value;
	        if (n.isSmall) {
	            return a == b ? 0 : a > b ? 1 : -1;
	        }
	        if (a < 0 !== n.sign) {
	            return a < 0 ? -1 : 1;
	        }
	        return a < 0 ? 1 : -1;
	    };
	    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

	    BigInteger.prototype.equals = function (v) {
	        return this.compare(v) === 0;
	    };
	    SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

	    BigInteger.prototype.notEquals = function (v) {
	        return this.compare(v) !== 0;
	    };
	    SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

	    BigInteger.prototype.greater = function (v) {
	        return this.compare(v) > 0;
	    };
	    SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

	    BigInteger.prototype.lesser = function (v) {
	        return this.compare(v) < 0;
	    };
	    SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

	    BigInteger.prototype.greaterOrEquals = function (v) {
	        return this.compare(v) >= 0;
	    };
	    SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

	    BigInteger.prototype.lesserOrEquals = function (v) {
	        return this.compare(v) <= 0;
	    };
	    SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

	    BigInteger.prototype.isEven = function () {
	        return (this.value[0] & 1) === 0;
	    };
	    SmallInteger.prototype.isEven = function () {
	        return (this.value & 1) === 0;
	    };

	    BigInteger.prototype.isOdd = function () {
	        return (this.value[0] & 1) === 1;
	    };
	    SmallInteger.prototype.isOdd = function () {
	        return (this.value & 1) === 1;
	    };

	    BigInteger.prototype.isPositive = function () {
	        return !this.sign;
	    };
	    SmallInteger.prototype.isPositive = function () {
	        return this.value > 0;
	    };

	    BigInteger.prototype.isNegative = function () {
	        return this.sign;
	    };
	    SmallInteger.prototype.isNegative = function () {
	        return this.value < 0;
	    };

	    BigInteger.prototype.isUnit = function () {
	        return false;
	    };
	    SmallInteger.prototype.isUnit = function () {
	        return Math.abs(this.value) === 1;
	    };

	    BigInteger.prototype.isZero = function () {
	        return false;
	    };
	    SmallInteger.prototype.isZero = function () {
	        return this.value === 0;
	    };
	    BigInteger.prototype.isDivisibleBy = function (v) {
	        var n = parseValue(v);
	        var value = n.value;
	        if (value === 0) return false;
	        if (value === 1) return true;
	        if (value === 2) return this.isEven();
	        return this.mod(n).equals(CACHE[0]);
	    };
	    SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

	    function isBasicPrime(v) {
	        var n = v.abs();
	        if (n.isUnit()) return false;
	        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
	        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
	        if (n.lesser(25)) return true;
	        // we don't know if it's prime: let the other functions figure it out
	    };

	    BigInteger.prototype.isPrime = function () {
	        var isPrime = isBasicPrime(this);
	        if (isPrime !== undefined) return isPrime;
	        var n = this.abs(),
	            nPrev = n.prev();
	        var a = [2, 3, 5, 7, 11, 13, 17, 19],
	            b = nPrev,
	            d, t, i, x;
	        while (b.isEven()) b = b.divide(2);
	        for (i = 0; i < a.length; i++) {
	            x = bigInt(a[i]).modPow(b, n);
	            if (x.equals(CACHE[1]) || x.equals(nPrev)) continue;
	            for (t = true, d = b; t && d.lesser(nPrev) ; d = d.multiply(2)) {
	                x = x.square().mod(n);
	                if (x.equals(nPrev)) t = false;
	            }
	            if (t) return false;
	        }
	        return true;
	    };
	    SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

	    BigInteger.prototype.isProbablePrime = function (iterations) {
	        var isPrime = isBasicPrime(this);
	        if (isPrime !== undefined) return isPrime;
	        var n = this.abs();
	        var t = iterations === undefined ? 5 : iterations;
	        // use the Fermat primality test
	        for (var i = 0; i < t; i++) {
	            var a = bigInt.randBetween(2, n.minus(2));
	            if (!a.modPow(n.prev(), n).isUnit()) return false; // definitely composite
	        }
	        return true; // large chance of being prime
	    };
	    SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

	    BigInteger.prototype.next = function () {
	        var value = this.value;
	        if (this.sign) {
	            return subtractSmall(value, 1, this.sign);
	        }
	        return new BigInteger(addSmall(value, 1), this.sign);
	    };
	    SmallInteger.prototype.next = function () {
	        var value = this.value;
	        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
	        return new BigInteger(MAX_INT_ARR, false);
	    };

	    BigInteger.prototype.prev = function () {
	        var value = this.value;
	        if (this.sign) {
	            return new BigInteger(addSmall(value, 1), true);
	        }
	        return subtractSmall(value, 1, this.sign);
	    };
	    SmallInteger.prototype.prev = function () {
	        var value = this.value;
	        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
	        return new BigInteger(MAX_INT_ARR, true);
	    };

	    var powersOfTwo = [1];
	    while (powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
	    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

	    function shift_isSmall(n) {
	        return ((typeof n === "number" || typeof n === "string") && +Math.abs(n) <= BASE) ||
	            (n instanceof BigInteger && n.value.length <= 1);
	    }

	    BigInteger.prototype.shiftLeft = function (n) {
	        if (!shift_isSmall(n)) {
	            if (n.isNegative()) return this.shiftRight(n.abs());
	            return this.times(CACHE[2].pow(n));
	        }
	        n = +n;
	        if (n < 0) return this.shiftRight(-n);
	        var result = this;
	        while (n >= powers2Length) {
	            result = result.multiply(highestPower2);
	            n -= powers2Length - 1;
	        }
	        return result.multiply(powersOfTwo[n]);
	    };
	    SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

	    BigInteger.prototype.shiftRight = function (n) {
	        var remQuo;
	        if (!shift_isSmall(n)) {
	            if (n.isNegative()) return this.shiftLeft(n.abs());
	            remQuo = this.divmod(CACHE[2].pow(n));
	            return remQuo.remainder.isNegative() ? remQuo.quotient.prev() : remQuo.quotient;
	        }
	        n = +n;
	        if (n < 0) return this.shiftLeft(-n);
	        var result = this;
	        while (n >= powers2Length) {
	            if (result.isZero()) return result;
	            remQuo = divModAny(result, highestPower2);
	            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
	            n -= powers2Length - 1;
	        }
	        remQuo = divModAny(result, powersOfTwo[n]);
	        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
	    };
	    SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

	    function bitwise(x, y, fn) {
	        y = parseValue(y);
	        var xSign = x.isNegative(), ySign = y.isNegative();
	        var xRem = xSign ? x.not() : x,
	            yRem = ySign ? y.not() : y;
	        var xBits = [], yBits = [];
	        var xStop = false, yStop = false;
	        while (!xStop || !yStop) {
	            if (xRem.isZero()) { // virtual sign extension for simulating two's complement
	                xStop = true;
	                xBits.push(xSign ? 1 : 0);
	            }
	            else if (xSign) xBits.push(xRem.isEven() ? 1 : 0); // two's complement for negative numbers
	            else xBits.push(xRem.isEven() ? 0 : 1);

	            if (yRem.isZero()) {
	                yStop = true;
	                yBits.push(ySign ? 1 : 0);
	            }
	            else if (ySign) yBits.push(yRem.isEven() ? 1 : 0);
	            else yBits.push(yRem.isEven() ? 0 : 1);

	            xRem = xRem.over(2);
	            yRem = yRem.over(2);
	        }
	        var result = [];
	        for (var i = 0; i < xBits.length; i++) result.push(fn(xBits[i], yBits[i]));
	        var sum = bigInt(result.pop()).negate().times(bigInt(2).pow(result.length));
	        while (result.length) {
	            sum = sum.add(bigInt(result.pop()).times(bigInt(2).pow(result.length)));
	        }
	        return sum;
	    }

	    BigInteger.prototype.not = function () {
	        return this.negate().prev();
	    };
	    SmallInteger.prototype.not = BigInteger.prototype.not;

	    BigInteger.prototype.and = function (n) {
	        return bitwise(this, n, function (a, b) { return a & b; });
	    };
	    SmallInteger.prototype.and = BigInteger.prototype.and;

	    BigInteger.prototype.or = function (n) {
	        return bitwise(this, n, function (a, b) { return a | b; });
	    };
	    SmallInteger.prototype.or = BigInteger.prototype.or;

	    BigInteger.prototype.xor = function (n) {
	        return bitwise(this, n, function (a, b) { return a ^ b; });
	    };
	    SmallInteger.prototype.xor = BigInteger.prototype.xor;

	    function max(a, b) {
	        a = parseValue(a);
	        b = parseValue(b);
	        return a.greater(b) ? a : b;
	    }
	    function min(a,b) {
	        a = parseValue(a);
	        b = parseValue(b);
	        return a.lesser(b) ? a : b;
	    }
	    function gcd(a, b) {
	        a = parseValue(a).abs();
	        b = parseValue(b).abs();
	        if (a.equals(b)) return a;
	        if (a.isZero()) return b;
	        if (b.isZero()) return a;
	        if (a.isEven()) {
	            if (b.isOdd()) {
	                return gcd(a.divide(2), b);
	            }
	            return gcd(a.divide(2), b.divide(2)).multiply(2);
	        }
	        if (b.isEven()) {
	            return gcd(a, b.divide(2));
	        }
	        if (a.greater(b)) {
	            return gcd(a.subtract(b).divide(2), b);
	        }
	        return gcd(b.subtract(a).divide(2), a);
	    }
	    function lcm(a, b) {
	        a = parseValue(a).abs();
	        b = parseValue(b).abs();
	        return a.multiply(b).divide(gcd(a, b));
	    }
	    function randBetween(a, b) {
	        a = parseValue(a);
	        b = parseValue(b);
	        var low = min(a, b), high = max(a, b);
	        var range = high.subtract(low);
	        if (range.isSmall) return low.add(Math.round(Math.random() * range));
	        var length = range.value.length - 1;
	        var result = [], restricted = true;
	        for (var i = length; i >= 0; i--) {
	            var top = restricted ? range.value[i] : BASE;
	            var digit = truncate(Math.random() * top);
	            result.unshift(digit);
	            if (digit < top) restricted = false;
	        }
	        result = arrayToSmall(result);
	        return low.add(new BigInteger(result, false, typeof result === "number"));
	    }
	    var parseBase = function (text, base) {
	        var val = CACHE[0], pow = CACHE[1],
	            length = text.length;
	        if (2 <= base && base <= 36) {
	            if (length <= LOG_MAX_INT / Math.log(base)) {
	                return new SmallInteger(parseInt(text, base));
	            }
	        }
	        base = parseValue(base);
	        var digits = [];
	        var i;
	        var isNegative = text[0] === "-";
	        for (i = isNegative ? 1 : 0; i < text.length; i++) {
	            var c = text[i].toLowerCase(),
	                charCode = c.charCodeAt(0);
	            if (48 <= charCode && charCode <= 57) digits.push(parseValue(c));
	            else if (97 <= charCode && charCode <= 122) digits.push(parseValue(c.charCodeAt(0) - 87));
	            else if (c === "<") {
	                var start = i;
	                do { i++; } while (text[i] !== ">");
	                digits.push(parseValue(text.slice(start + 1, i)));
	            }
	            else throw new Error(c + " is not a valid character");
	        }
	        digits.reverse();
	        for (i = 0; i < digits.length; i++) {
	            val = val.add(digits[i].times(pow));
	            pow = pow.times(base);
	        }
	        return isNegative ? val.negate() : val;
	    };

	    function stringify(digit) {
	        var v = digit.value;
	        if (typeof v === "number") v = [v];
	        if (v.length === 1 && v[0] <= 36) {
	            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(v[0]);
	        }
	        return "<" + v + ">";
	    }
	    function toBase(n, base) {
	        base = bigInt(base);
	        if (base.isZero()) {
	            if (n.isZero()) return "0";
	            throw new Error("Cannot convert nonzero numbers to base 0.");
	        }
	        if (base.equals(-1)) {
	            if (n.isZero()) return "0";
	            if (n.isNegative()) return new Array(1 - n).join("10");
	            return "1" + new Array(+n).join("01");
	        }
	        var minusSign = "";
	        if (n.isNegative() && base.isPositive()) {
	            minusSign = "-";
	            n = n.abs();
	        }
	        if (base.equals(1)) {
	            if (n.isZero()) return "0";
	            return minusSign + new Array(+n + 1).join(1);
	        }
	        var out = [];
	        var left = n, divmod;
	        while (left.isNegative() || left.compareAbs(base) >= 0) {
	            divmod = left.divmod(base);
	            left = divmod.quotient;
	            var digit = divmod.remainder;
	            if (digit.isNegative()) {
	                digit = base.minus(digit).abs();
	                left = left.next();
	            }
	            out.push(stringify(digit));
	        }
	        out.push(stringify(left));
	        return minusSign + out.reverse().join("");
	    }

	    BigInteger.prototype.toString = function (radix) {
	        if (radix === undefined) radix = 10;
	        if (radix !== 10) return toBase(this, radix);
	        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
	        while (--l >= 0) {
	            digit = String(v[l]);
	            str += zeros.slice(digit.length) + digit;
	        }
	        var sign = this.sign ? "-" : "";
	        return sign + str;
	    };
	    SmallInteger.prototype.toString = function (radix) {
	        if (radix === undefined) radix = 10;
	        if (radix != 10) return toBase(this, radix);
	        return String(this.value);
	    };

	    BigInteger.prototype.valueOf = function () {
	        return +this.toString();
	    };
	    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

	    SmallInteger.prototype.valueOf = function () {
	        return this.value;
	    };
	    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
	    
	    function parseStringValue(v) {
	            if (isPrecise(+v)) {
	                var x = +v;
	                if (x === truncate(x))
	                    return new SmallInteger(x);
	                throw "Invalid integer: " + v;
	            }
	            var sign = v[0] === "-";
	            if (sign) v = v.slice(1);
	            var split = v.split(/e/i);
	            if (split.length > 2) throw new Error("Invalid integer: " + text.join("e"));
	            if (split.length === 2) {
	                var exp = split[1];
	                if (exp[0] === "+") exp = exp.slice(1);
	                exp = +exp;
	                if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
	                var text = split[0];
	                var decimalPlace = text.indexOf(".");
	                if (decimalPlace >= 0) {
	                    exp -= text.length - decimalPlace;
	                    text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
	                }
	                if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
	                text += (new Array(exp + 1)).join("0");
	                v = text;
	            }
	            var isValid = /^([0-9][0-9]*)$/.test(v);
	            if (!isValid) throw new Error("Invalid integer: " + v);
	            var r = [], max = v.length, l = LOG_BASE, min = max - l;
	            while (max > 0) {
	                r.push(+v.slice(min, max));
	                min -= l;
	                if (min < 0) min = 0;
	                max -= l;
	            }
	            trim(r);
	            return new BigInteger(r, sign);
	    }
	    
	    function parseNumberValue(v) {
	            if (isPrecise(v)) return new SmallInteger(v);
	            return parseStringValue(v.toString());
	    }

	    function parseValue(v) {
	        if (typeof v === "number") {
	            return parseNumberValue(v);
	        }
	        if (typeof v === "string") {
	            return parseStringValue(v);
	        }
	        return v;
	    }
	    // Pre-define numbers in range [-999,999]
	    var CACHE = function (v, radix) {
	        if (typeof v === "undefined") return CACHE[0];
	        if (typeof radix !== "undefined") return +radix === 10 ? parseValue(v) : parseBase(v, radix);
	        return parseValue(v);
	    };
	    for (var i = 0; i < 1000; i++) {
	        CACHE[i] = new SmallInteger(i);
	        if (i > 0) CACHE[-i] = new SmallInteger(-i);
	    }
	    // Backwards compatibility
	    CACHE.one = CACHE[1];
	    CACHE.zero = CACHE[0];
	    CACHE.minusOne = CACHE[-1];
	    CACHE.max = max;
	    CACHE.min = min;
	    CACHE.gcd = gcd;
	    CACHE.lcm = lcm;
	    CACHE.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger; };
	    CACHE.randBetween = randBetween;
	    return CACHE;
	})();

	// Node.js check
	if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
	    module.exports = bigInt;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = __webpack_require__(23);
	var crypto = __webpack_require__(51);
	var http = __webpack_require__(87);
	var util = __webpack_require__(25);
	var sshpk = __webpack_require__(47);
	var jsprim = __webpack_require__(97);
	var utils = __webpack_require__(46);

	var sprintf = __webpack_require__(25).format;

	var HASH_ALGOS = utils.HASH_ALGOS;
	var PK_ALGOS = utils.PK_ALGOS;
	var InvalidAlgorithmError = utils.InvalidAlgorithmError;
	var HttpSignatureError = utils.HttpSignatureError;
	var validateAlgorithm = utils.validateAlgorithm;

	///--- Globals

	var AUTHZ_FMT =
	  'Signature keyId="%s",algorithm="%s",headers="%s",signature="%s"';

	///--- Specific Errors

	function MissingHeaderError(message) {
	  HttpSignatureError.call(this, message, MissingHeaderError);
	}
	util.inherits(MissingHeaderError, HttpSignatureError);

	function StrictParsingError(message) {
	  HttpSignatureError.call(this, message, StrictParsingError);
	}
	util.inherits(StrictParsingError, HttpSignatureError);

	/* See createSigner() */
	function RequestSigner(options) {
	  assert.object(options, 'options');

	  var alg = [];
	  if (options.algorithm !== undefined) {
	    assert.string(options.algorithm, 'options.algorithm');
	    alg = validateAlgorithm(options.algorithm);
	  }
	  this.rs_alg = alg;

	  /*
	   * RequestSigners come in two varieties: ones with an rs_signFunc, and ones
	   * with an rs_signer.
	   *
	   * rs_signFunc-based RequestSigners have to build up their entire signing
	   * string within the rs_lines array and give it to rs_signFunc as a single
	   * concat'd blob. rs_signer-based RequestSigners can add a line at a time to
	   * their signing state by using rs_signer.update(), thus only needing to
	   * buffer the hash function state and one line at a time.
	   */
	  if (options.sign !== undefined) {
	    assert.func(options.sign, 'options.sign');
	    this.rs_signFunc = options.sign;

	  } else if (alg[0] === 'hmac' && options.key !== undefined) {
	    assert.string(options.keyId, 'options.keyId');
	    this.rs_keyId = options.keyId;

	    if (typeof (options.key) !== 'string' && !Buffer.isBuffer(options.key))
	      throw (new TypeError('options.key for HMAC must be a string or Buffer'));

	    /*
	     * Make an rs_signer for HMACs, not a rs_signFunc -- HMACs digest their
	     * data in chunks rather than requiring it all to be given in one go
	     * at the end, so they are more similar to signers than signFuncs.
	     */
	    this.rs_signer = crypto.createHmac(alg[1].toUpperCase(), options.key);
	    this.rs_signer.sign = function () {
	      var digest = this.digest('base64');
	      return ({
	        hashAlgorithm: alg[1],
	        toString: function () { return (digest); }
	      });
	    };

	  } else if (options.key !== undefined) {
	    var key = options.key;
	    if (typeof (key) === 'string' || Buffer.isBuffer(key))
	      key = sshpk.parsePrivateKey(key);

	    assert.ok(key instanceof sshpk.PrivateKey,
	      'options.key must be a sshpk.PrivateKey');
	    this.rs_key = key;

	    assert.string(options.keyId, 'options.keyId');
	    this.rs_keyId = options.keyId;

	    if (!PK_ALGOS[key.type]) {
	      throw (new InvalidAlgorithmError(key.type.toUpperCase() + ' type ' +
	        'keys are not supported'));
	    }

	    if (alg[0] !== undefined && key.type !== alg[0]) {
	      throw (new InvalidAlgorithmError('options.key must be a ' +
	        alg[0].toUpperCase() + ' key, was given a ' +
	        key.type.toUpperCase() + ' key instead'));
	    }

	    this.rs_signer = key.createSign(alg[1]);

	  } else {
	    throw (new TypeError('options.sign (func) or options.key is required'));
	  }

	  this.rs_headers = [];
	  this.rs_lines = [];
	}

	/**
	 * Adds a header to be signed, with its value, into this signer.
	 *
	 * @param {String} header
	 * @param {String} value
	 * @return {String} value written
	 */
	RequestSigner.prototype.writeHeader = function (header, value) {
	  assert.string(header, 'header');
	  header = header.toLowerCase();
	  assert.string(value, 'value');

	  this.rs_headers.push(header);

	  if (this.rs_signFunc) {
	    this.rs_lines.push(header + ': ' + value);

	  } else {
	    var line = header + ': ' + value;
	    if (this.rs_headers.length > 0)
	      line = '\n' + line;
	    this.rs_signer.update(line);
	  }

	  return (value);
	};

	/**
	 * Adds a default Date header, returning its value.
	 *
	 * @return {String}
	 */
	RequestSigner.prototype.writeDateHeader = function () {
	  return (this.writeHeader('date', jsprim.rfc1123(new Date())));
	};

	/**
	 * Adds the request target line to be signed.
	 *
	 * @param {String} method, HTTP method (e.g. 'get', 'post', 'put')
	 * @param {String} path
	 */
	RequestSigner.prototype.writeTarget = function (method, path) {
	  assert.string(method, 'method');
	  assert.string(path, 'path');
	  method = method.toLowerCase();
	  this.writeHeader('(request-target)', method + ' ' + path);
	};

	/**
	 * Calculate the value for the Authorization header on this request
	 * asynchronously.
	 *
	 * @param {Func} callback (err, authz)
	 */
	RequestSigner.prototype.sign = function (cb) {
	  assert.func(cb, 'callback');

	  if (this.rs_headers.length < 1)
	    throw (new Error('At least one header must be signed'));

	  var alg, authz;
	  if (this.rs_signFunc) {
	    var data = this.rs_lines.join('\n');
	    var self = this;
	    this.rs_signFunc(data, function (err, sig) {
	      if (err) {
	        cb(err);
	        return;
	      }
	      try {
	        assert.object(sig, 'signature');
	        assert.string(sig.keyId, 'signature.keyId');
	        assert.string(sig.algorithm, 'signature.algorithm');
	        assert.string(sig.signature, 'signature.signature');
	        alg = validateAlgorithm(sig.algorithm);

	        authz = sprintf(AUTHZ_FMT,
	          sig.keyId,
	          sig.algorithm,
	          self.rs_headers.join(' '),
	          sig.signature);
	      } catch (e) {
	        cb(e);
	        return;
	      }
	      cb(null, authz);
	    });

	  } else {
	    try {
	      var sigObj = this.rs_signer.sign();
	    } catch (e) {
	      cb(e);
	      return;
	    }
	    alg = (this.rs_alg[0] || this.rs_key.type) + '-' + sigObj.hashAlgorithm;
	    var signature = sigObj.toString();
	    authz = sprintf(AUTHZ_FMT,
	      this.rs_keyId,
	      alg,
	      this.rs_headers.join(' '),
	      signature);
	    cb(null, authz);
	  }
	};

	///--- Exported API

	module.exports = {
	  /**
	   * Identifies whether a given object is a request signer or not.
	   *
	   * @param {Object} object, the object to identify
	   * @returns {Boolean}
	   */
	  isSigner: function (obj) {
	    if (typeof (obj) === 'object' && obj instanceof RequestSigner)
	      return (true);
	    return (false);
	  },

	  /**
	   * Creates a request signer, used to asynchronously build a signature
	   * for a request (does not have to be an http.ClientRequest).
	   *
	   * @param {Object} options, either:
	   *                   - {String} keyId
	   *                   - {String|Buffer} key
	   *                   - {String} algorithm (optional, required for HMAC)
	   *                 or:
	   *                   - {Func} sign (data, cb)
	   * @return {RequestSigner}
	   */
	  createSigner: function createSigner(options) {
	    return (new RequestSigner(options));
	  },

	  /**
	   * Adds an 'Authorization' header to an http.ClientRequest object.
	   *
	   * Note that this API will add a Date header if it's not already set. Any
	   * other headers in the options.headers array MUST be present, or this
	   * will throw.
	   *
	   * You shouldn't need to check the return type; it's just there if you want
	   * to be pedantic.
	   *
	   * The optional flag indicates whether parsing should use strict enforcement
	   * of the version draft-cavage-http-signatures-04 of the spec or beyond.
	   * The default is to be loose and support
	   * older versions for compatibility.
	   *
	   * @param {Object} request an instance of http.ClientRequest.
	   * @param {Object} options signing parameters object:
	   *                   - {String} keyId required.
	   *                   - {String} key required (either a PEM or HMAC key).
	   *                   - {Array} headers optional; defaults to ['date'].
	   *                   - {String} algorithm optional (unless key is HMAC);
	   *                              default is the same as the sshpk default
	   *                              signing algorithm for the type of key given
	   *                   - {String} httpVersion optional; defaults to '1.1'.
	   *                   - {Boolean} strict optional; defaults to 'false'.
	   * @return {Boolean} true if Authorization (and optionally Date) were added.
	   * @throws {TypeError} on bad parameter types (input).
	   * @throws {InvalidAlgorithmError} if algorithm was bad or incompatible with
	   *                                 the given key.
	   * @throws {sshpk.KeyParseError} if key was bad.
	   * @throws {MissingHeaderError} if a header to be signed was specified but
	   *                              was not present.
	   */
	  signRequest: function signRequest(request, options) {
	    assert.object(request, 'request');
	    assert.object(options, 'options');
	    assert.optionalString(options.algorithm, 'options.algorithm');
	    assert.string(options.keyId, 'options.keyId');
	    assert.optionalArrayOfString(options.headers, 'options.headers');
	    assert.optionalString(options.httpVersion, 'options.httpVersion');

	    if (!request.getHeader('Date'))
	      request.setHeader('Date', jsprim.rfc1123(new Date()));
	    if (!options.headers)
	      options.headers = ['date'];
	    if (!options.httpVersion)
	      options.httpVersion = '1.1';

	    var alg = [];
	    if (options.algorithm) {
	      options.algorithm = options.algorithm.toLowerCase();
	      alg = validateAlgorithm(options.algorithm);
	    }

	    var i;
	    var stringToSign = '';
	    for (i = 0; i < options.headers.length; i++) {
	      if (typeof (options.headers[i]) !== 'string')
	        throw new TypeError('options.headers must be an array of Strings');

	      var h = options.headers[i].toLowerCase();

	      if (h === 'request-line') {
	        if (!options.strict) {
	          /**
	           * We allow headers from the older spec drafts if strict parsing isn't
	           * specified in options.
	           */
	          stringToSign +=
	            request.method + ' ' + request.path + ' HTTP/' +
	            options.httpVersion;
	        } else {
	          /* Strict parsing doesn't allow older draft headers. */
	          throw (new StrictParsingError('request-line is not a valid header ' +
	            'with strict parsing enabled.'));
	        }
	      } else if (h === '(request-target)') {
	        stringToSign +=
	          '(request-target): ' + request.method.toLowerCase() + ' ' +
	          request.path;
	      } else {
	        var value = request.getHeader(h);
	        if (value === undefined || value === '') {
	          throw new MissingHeaderError(h + ' was not in the request');
	        }
	        stringToSign += h + ': ' + value;
	      }

	      if ((i + 1) < options.headers.length)
	        stringToSign += '\n';
	    }

	    var signature;
	    if (alg[0] === 'hmac') {
	      if (typeof (options.key) !== 'string' && !Buffer.isBuffer(options.key))
	        throw (new TypeError('options.key must be a string or Buffer'));

	      var hmac = crypto.createHmac(alg[1].toUpperCase(), options.key);
	      hmac.update(stringToSign);
	      signature = hmac.digest('base64');

	    } else {
	      var key = options.key;
	      if (typeof (key) === 'string' || Buffer.isBuffer(key))
	        key = sshpk.parsePrivateKey(options.key);

	      assert.ok(key instanceof sshpk.PrivateKey,
	        'options.key must be a sshpk.PrivateKey');

	      if (!PK_ALGOS[key.type]) {
	        throw (new InvalidAlgorithmError(key.type.toUpperCase() + ' type ' +
	          'keys are not supported'));
	      }

	      if (alg[0] !== undefined && key.type !== alg[0]) {
	        throw (new InvalidAlgorithmError('options.key must be a ' +
	          alg[0].toUpperCase() + ' key, was given a ' +
	          key.type.toUpperCase() + ' key instead'));
	      }

	      var signer = key.createSign(alg[1]);
	      signer.update(stringToSign);
	      var sigObj = signer.sign();
	      if (!HASH_ALGOS[sigObj.hashAlgorithm]) {
	        throw (new InvalidAlgorithmError(sigObj.hashAlgorithm.toUpperCase() +
	          ' is not a supported hash algorithm'));
	      }
	      options.algorithm = key.type + '-' + sigObj.hashAlgorithm;
	      signature = sigObj.toString();
	      assert.notStrictEqual(signature, '', 'empty signature produced');
	    }

	    request.setHeader('Authorization', sprintf(AUTHZ_FMT,
	                                               options.keyId,
	                                               options.algorithm,
	                                               options.headers.join(' '),
	                                               signature));

	    return true;
	  }

	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var http = module.exports;
	var EventEmitter = __webpack_require__(29).EventEmitter;
	var Request = __webpack_require__(88);
	var url = __webpack_require__(92)

	http.request = function (params, cb) {
	    if (typeof params === 'string') {
	        params = url.parse(params)
	    }
	    if (!params) params = {};
	    if (!params.host && !params.port) {
	        params.port = parseInt(window.location.port, 10);
	    }
	    if (!params.host && params.hostname) {
	        params.host = params.hostname;
	    }

	    if (!params.protocol) {
	        if (params.scheme) {
	            params.protocol = params.scheme + ':';
	        } else {
	            params.protocol = window.location.protocol;
	        }
	    }

	    if (!params.host) {
	        params.host = window.location.hostname || window.location.host;
	    }
	    if (/:/.test(params.host)) {
	        if (!params.port) {
	            params.port = params.host.split(':')[1];
	        }
	        params.host = params.host.split(':')[0];
	    }
	    if (!params.port) params.port = params.protocol == 'https:' ? 443 : 80;
	    
	    var req = new Request(new xhrHttp, params);
	    if (cb) req.on('response', cb);
	    return req;
	};

	http.get = function (params, cb) {
	    params.method = 'GET';
	    var req = http.request(params, cb);
	    req.end();
	    return req;
	};

	http.Agent = function () {};
	http.Agent.defaultMaxSockets = 4;

	var xhrHttp = (function () {
	    if (typeof window === 'undefined') {
	        throw new Error('no window object present');
	    }
	    else if (window.XMLHttpRequest) {
	        return window.XMLHttpRequest;
	    }
	    else if (window.ActiveXObject) {
	        var axs = [
	            'Msxml2.XMLHTTP.6.0',
	            'Msxml2.XMLHTTP.3.0',
	            'Microsoft.XMLHTTP'
	        ];
	        for (var i = 0; i < axs.length; i++) {
	            try {
	                var ax = new(window.ActiveXObject)(axs[i]);
	                return function () {
	                    if (ax) {
	                        var ax_ = ax;
	                        ax = null;
	                        return ax_;
	                    }
	                    else {
	                        return new(window.ActiveXObject)(axs[i]);
	                    }
	                };
	            }
	            catch (e) {}
	        }
	        throw new Error('ajax not supported in this browser')
	    }
	    else {
	        throw new Error('ajax not supported in this browser');
	    }
	})();

	http.STATUS_CODES = {
	    100 : 'Continue',
	    101 : 'Switching Protocols',
	    102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
	    200 : 'OK',
	    201 : 'Created',
	    202 : 'Accepted',
	    203 : 'Non-Authoritative Information',
	    204 : 'No Content',
	    205 : 'Reset Content',
	    206 : 'Partial Content',
	    207 : 'Multi-Status',               // RFC 4918
	    300 : 'Multiple Choices',
	    301 : 'Moved Permanently',
	    302 : 'Moved Temporarily',
	    303 : 'See Other',
	    304 : 'Not Modified',
	    305 : 'Use Proxy',
	    307 : 'Temporary Redirect',
	    400 : 'Bad Request',
	    401 : 'Unauthorized',
	    402 : 'Payment Required',
	    403 : 'Forbidden',
	    404 : 'Not Found',
	    405 : 'Method Not Allowed',
	    406 : 'Not Acceptable',
	    407 : 'Proxy Authentication Required',
	    408 : 'Request Time-out',
	    409 : 'Conflict',
	    410 : 'Gone',
	    411 : 'Length Required',
	    412 : 'Precondition Failed',
	    413 : 'Request Entity Too Large',
	    414 : 'Request-URI Too Large',
	    415 : 'Unsupported Media Type',
	    416 : 'Requested Range Not Satisfiable',
	    417 : 'Expectation Failed',
	    418 : 'I\'m a teapot',              // RFC 2324
	    422 : 'Unprocessable Entity',       // RFC 4918
	    423 : 'Locked',                     // RFC 4918
	    424 : 'Failed Dependency',          // RFC 4918
	    425 : 'Unordered Collection',       // RFC 4918
	    426 : 'Upgrade Required',           // RFC 2817
	    428 : 'Precondition Required',      // RFC 6585
	    429 : 'Too Many Requests',          // RFC 6585
	    431 : 'Request Header Fields Too Large',// RFC 6585
	    500 : 'Internal Server Error',
	    501 : 'Not Implemented',
	    502 : 'Bad Gateway',
	    503 : 'Service Unavailable',
	    504 : 'Gateway Time-out',
	    505 : 'HTTP Version Not Supported',
	    506 : 'Variant Also Negotiates',    // RFC 2295
	    507 : 'Insufficient Storage',       // RFC 4918
	    509 : 'Bandwidth Limit Exceeded',
	    510 : 'Not Extended',               // RFC 2774
	    511 : 'Network Authentication Required' // RFC 6585
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var Stream = __webpack_require__(28);
	var Response = __webpack_require__(89);
	var Base64 = __webpack_require__(90);
	var inherits = __webpack_require__(91);

	var Request = module.exports = function (xhr, params) {
	    var self = this;
	    self.writable = true;
	    self.xhr = xhr;
	    self.body = [];
	    
	    self.uri = (params.protocol || 'http:') + '//'
	        + params.host
	        + (params.port ? ':' + params.port : '')
	        + (params.path || '/')
	    ;
	    
	    if (typeof params.withCredentials === 'undefined') {
	        params.withCredentials = true;
	    }

	    try { xhr.withCredentials = params.withCredentials }
	    catch (e) {}
	    
	    if (params.responseType) try { xhr.responseType = params.responseType }
	    catch (e) {}
	    
	    xhr.open(
	        params.method || 'GET',
	        self.uri,
	        true
	    );

	    xhr.onerror = function(event) {
	        self.emit('error', new Error('Network error'));
	    };

	    self._headers = {};
	    
	    if (params.headers) {
	        var keys = objectKeys(params.headers);
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            if (!self.isSafeRequestHeader(key)) continue;
	            var value = params.headers[key];
	            self.setHeader(key, value);
	        }
	    }
	    
	    if (params.auth) {
	        //basic auth
	        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
	    }

	    var res = new Response;
	    res.on('close', function () {
	        self.emit('close');
	    });
	    
	    res.on('ready', function () {
	        self.emit('response', res);
	    });

	    res.on('error', function (err) {
	        self.emit('error', err);
	    });
	    
	    xhr.onreadystatechange = function () {
	        // Fix for IE9 bug
	        // SCRIPT575: Could not complete the operation due to error c00c023f
	        // It happens when a request is aborted, calling the success callback anyway with readyState === 4
	        if (xhr.__aborted) return;
	        res.handle(xhr);
	    };
	};

	inherits(Request, Stream);

	Request.prototype.setHeader = function (key, value) {
	    this._headers[key.toLowerCase()] = value
	};

	Request.prototype.getHeader = function (key) {
	    return this._headers[key.toLowerCase()]
	};

	Request.prototype.removeHeader = function (key) {
	    delete this._headers[key.toLowerCase()]
	};

	Request.prototype.write = function (s) {
	    this.body.push(s);
	};

	Request.prototype.destroy = function (s) {
	    this.xhr.__aborted = true;
	    this.xhr.abort();
	    this.emit('close');
	};

	Request.prototype.end = function (s) {
	    if (s !== undefined) this.body.push(s);

	    var keys = objectKeys(this._headers);
	    for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        var value = this._headers[key];
	        if (isArray(value)) {
	            for (var j = 0; j < value.length; j++) {
	                this.xhr.setRequestHeader(key, value[j]);
	            }
	        }
	        else this.xhr.setRequestHeader(key, value)
	    }

	    if (this.body.length === 0) {
	        this.xhr.send('');
	    }
	    else if (typeof this.body[0] === 'string') {
	        this.xhr.send(this.body.join(''));
	    }
	    else if (isArray(this.body[0])) {
	        var body = [];
	        for (var i = 0; i < this.body.length; i++) {
	            body.push.apply(body, this.body[i]);
	        }
	        this.xhr.send(body);
	    }
	    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
	        var len = 0;
	        for (var i = 0; i < this.body.length; i++) {
	            len += this.body[i].length;
	        }
	        var body = new(this.body[0].constructor)(len);
	        var k = 0;
	        
	        for (var i = 0; i < this.body.length; i++) {
	            var b = this.body[i];
	            for (var j = 0; j < b.length; j++) {
	                body[k++] = b[j];
	            }
	        }
	        this.xhr.send(body);
	    }
	    else if (isXHR2Compatible(this.body[0])) {
	        this.xhr.send(this.body[0]);
	    }
	    else {
	        var body = '';
	        for (var i = 0; i < this.body.length; i++) {
	            body += this.body[i].toString();
	        }
	        this.xhr.send(body);
	    }
	};

	// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
	Request.unsafeHeaders = [
	    "accept-charset",
	    "accept-encoding",
	    "access-control-request-headers",
	    "access-control-request-method",
	    "connection",
	    "content-length",
	    "cookie",
	    "cookie2",
	    "content-transfer-encoding",
	    "date",
	    "expect",
	    "host",
	    "keep-alive",
	    "origin",
	    "referer",
	    "te",
	    "trailer",
	    "transfer-encoding",
	    "upgrade",
	    "user-agent",
	    "via"
	];

	Request.prototype.isSafeRequestHeader = function (headerName) {
	    if (!headerName) return false;
	    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
	};

	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    return keys;
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

	var indexOf = function (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (xs[i] === x) return i;
	    }
	    return -1;
	};

	var isXHR2Compatible = function (obj) {
	    if (typeof Blob !== 'undefined' && obj instanceof Blob) return true;
	    if (typeof ArrayBuffer !== 'undefined' && obj instanceof ArrayBuffer) return true;
	    if (typeof FormData !== 'undefined' && obj instanceof FormData) return true;
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var Stream = __webpack_require__(28);
	var util = __webpack_require__(25);

	var Response = module.exports = function (res) {
	    this.offset = 0;
	    this.readable = true;
	};

	util.inherits(Response, Stream);

	var capable = {
	    streaming : true,
	    status2 : true
	};

	function parseHeaders (res) {
	    var lines = res.getAllResponseHeaders().split(/\r?\n/);
	    var headers = {};
	    for (var i = 0; i < lines.length; i++) {
	        var line = lines[i];
	        if (line === '') continue;
	        
	        var m = line.match(/^([^:]+):\s*(.*)/);
	        if (m) {
	            var key = m[1].toLowerCase(), value = m[2];
	            
	            if (headers[key] !== undefined) {
	            
	                if (isArray(headers[key])) {
	                    headers[key].push(value);
	                }
	                else {
	                    headers[key] = [ headers[key], value ];
	                }
	            }
	            else {
	                headers[key] = value;
	            }
	        }
	        else {
	            headers[line] = true;
	        }
	    }
	    return headers;
	}

	Response.prototype.getResponse = function (xhr) {
	    var respType = String(xhr.responseType).toLowerCase();
	    if (respType === 'blob') return xhr.responseBlob || xhr.response;
	    if (respType === 'arraybuffer') return xhr.response;
	    return xhr.responseText;
	}

	Response.prototype.getHeader = function (key) {
	    return this.headers[key.toLowerCase()];
	};

	Response.prototype.handle = function (res) {
	    if (res.readyState === 2 && capable.status2) {
	        try {
	            this.statusCode = res.status;
	            this.headers = parseHeaders(res);
	        }
	        catch (err) {
	            capable.status2 = false;
	        }
	        
	        if (capable.status2) {
	            this.emit('ready');
	        }
	    }
	    else if (capable.streaming && res.readyState === 3) {
	        try {
	            if (!this.statusCode) {
	                this.statusCode = res.status;
	                this.headers = parseHeaders(res);
	                this.emit('ready');
	            }
	        }
	        catch (err) {}
	        
	        try {
	            this._emitData(res);
	        }
	        catch (err) {
	            capable.streaming = false;
	        }
	    }
	    else if (res.readyState === 4) {
	        if (!this.statusCode) {
	            this.statusCode = res.status;
	            this.emit('ready');
	        }
	        this._emitData(res);
	        
	        if (res.error) {
	            this.emit('error', this.getResponse(res));
	        }
	        else this.emit('end');
	        
	        this.emit('close');
	    }
	};

	Response.prototype._emitData = function (res) {
	    var respBody = this.getResponse(res);
	    if (respBody.toString().match(/ArrayBuffer/)) {
	        this.emit('data', new Uint8Array(respBody, this.offset));
	        this.offset = respBody.byteLength;
	        return;
	    }
	    if (respBody.length > this.offset) {
	        this.emit('data', respBody.slice(this.offset));
	        this.offset = respBody.length;
	    }
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 90 */
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
	    for (
	      // initialize result and counter
	      var block, charCode, idx = 0, map = chars, output = '';
	      // if the next input index does not exist:
	      //   change the mapping table to "="
	      //   check if d has no fractional digits
	      input.charAt(idx | 0) || (map = '=', idx % 1);
	      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	    ) {
	      charCode = input.charCodeAt(idx += 3/4);
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
	    input = input.replace(/=+$/, '');
	    if (input.length % 4 == 1) {
	      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	      // initialize result and counters
	      var bc = 0, bs, buffer, idx = 0, output = '';
	      // get next character
	      buffer = input.charAt(idx++);
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
/* 91 */
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
/* 92 */
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

	var punycode = __webpack_require__(93);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(94);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(95);
	exports.encode = exports.stringify = __webpack_require__(96);


/***/ },
/* 95 */
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

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 96 */
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

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * lib/jsprim.js: utilities for primitive JavaScript types
	 */

	var mod_assert = __webpack_require__(24);
	var mod_util = __webpack_require__(25);

	var mod_extsprintf = __webpack_require__(98);
	var mod_verror = __webpack_require__(99);
	var mod_jsonschema = __webpack_require__(100);

	/*
	 * Public interface
	 */
	exports.deepCopy = deepCopy;
	exports.deepEqual = deepEqual;
	exports.isEmpty = isEmpty;
	exports.forEachKey = forEachKey;
	exports.pluck = pluck;
	exports.flattenObject = flattenObject;
	exports.flattenIter = flattenIter;
	exports.validateJsonObject = validateJsonObjectJS;
	exports.validateJsonObjectJS = validateJsonObjectJS;
	exports.randElt = randElt;
	exports.extraProperties = extraProperties;
	exports.mergeObjects = mergeObjects;

	exports.startsWith = startsWith;
	exports.endsWith = endsWith;

	exports.iso8601 = iso8601;
	exports.rfc1123 = rfc1123;
	exports.parseDateTime = parseDateTime;

	exports.hrtimediff = hrtimeDiff;
	exports.hrtimeDiff = hrtimeDiff;
	exports.hrtimeAccum = hrtimeAccum;
	exports.hrtimeAdd = hrtimeAdd;
	exports.hrtimeNanosec = hrtimeNanosec;
	exports.hrtimeMicrosec = hrtimeMicrosec;
	exports.hrtimeMillisec = hrtimeMillisec;


	/*
	 * Deep copy an acyclic *basic* Javascript object.  This only handles basic
	 * scalars (strings, numbers, booleans) and arbitrarily deep arrays and objects
	 * containing these.  This does *not* handle instances of other classes.
	 */
	function deepCopy(obj)
	{
		var ret, key;
		var marker = '__deepCopy';

		if (obj && obj[marker])
			throw (new Error('attempted deep copy of cyclic object'));

		if (obj && obj.constructor == Object) {
			ret = {};
			obj[marker] = true;

			for (key in obj) {
				if (key == marker)
					continue;

				ret[key] = deepCopy(obj[key]);
			}

			delete (obj[marker]);
			return (ret);
		}

		if (obj && obj.constructor == Array) {
			ret = [];
			obj[marker] = true;

			for (key = 0; key < obj.length; key++)
				ret.push(deepCopy(obj[key]));

			delete (obj[marker]);
			return (ret);
		}

		/*
		 * It must be a primitive type -- just return it.
		 */
		return (obj);
	}

	function deepEqual(obj1, obj2)
	{
		if (typeof (obj1) != typeof (obj2))
			return (false);

		if (obj1 === null || obj2 === null || typeof (obj1) != 'object')
			return (obj1 === obj2);

		if (obj1.constructor != obj2.constructor)
			return (false);

		var k;
		for (k in obj1) {
			if (!obj2.hasOwnProperty(k))
				return (false);

			if (!deepEqual(obj1[k], obj2[k]))
				return (false);
		}

		for (k in obj2) {
			if (!obj1.hasOwnProperty(k))
				return (false);
		}

		return (true);
	}

	function isEmpty(obj)
	{
		var key;
		for (key in obj)
			return (false);
		return (true);
	}

	function forEachKey(obj, callback)
	{
		for (var key in obj)
			callback(key, obj[key]);
	}

	function pluck(obj, key)
	{
		mod_assert.equal(typeof (key), 'string');
		return (pluckv(obj, key));
	}

	function pluckv(obj, key)
	{
		if (obj === null || typeof (obj) !== 'object')
			return (undefined);

		if (obj.hasOwnProperty(key))
			return (obj[key]);

		var i = key.indexOf('.');
		if (i == -1)
			return (undefined);

		var key1 = key.substr(0, i);
		if (!obj.hasOwnProperty(key1))
			return (undefined);

		return (pluckv(obj[key1], key.substr(i + 1)));
	}

	/*
	 * Invoke callback(row) for each entry in the array that would be returned by
	 * flattenObject(data, depth).  This is just like flattenObject(data,
	 * depth).forEach(callback), except that the intermediate array is never
	 * created.
	 */
	function flattenIter(data, depth, callback)
	{
		doFlattenIter(data, depth, [], callback);
	}

	function doFlattenIter(data, depth, accum, callback)
	{
		var each;
		var key;

		if (depth === 0) {
			each = accum.slice(0);
			each.push(data);
			callback(each);
			return;
		}

		mod_assert.ok(data !== null);
		mod_assert.equal(typeof (data), 'object');
		mod_assert.equal(typeof (depth), 'number');
		mod_assert.ok(depth >= 0);

		for (key in data) {
			each = accum.slice(0);
			each.push(key);
			doFlattenIter(data[key], depth - 1, each, callback);
		}
	}

	function flattenObject(data, depth)
	{
		if (depth === 0)
			return ([ data ]);

		mod_assert.ok(data !== null);
		mod_assert.equal(typeof (data), 'object');
		mod_assert.equal(typeof (depth), 'number');
		mod_assert.ok(depth >= 0);

		var rv = [];
		var key;

		for (key in data) {
			flattenObject(data[key], depth - 1).forEach(function (p) {
				rv.push([ key ].concat(p));
			});
		}

		return (rv);
	}

	function startsWith(str, prefix)
	{
		return (str.substr(0, prefix.length) == prefix);
	}

	function endsWith(str, suffix)
	{
		return (str.substr(
		    str.length - suffix.length, suffix.length) == suffix);
	}

	function iso8601(d)
	{
		if (typeof (d) == 'number')
			d = new Date(d);
		mod_assert.ok(d.constructor === Date);
		return (mod_extsprintf.sprintf('%4d-%02d-%02dT%02d:%02d:%02d.%03dZ',
		    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
		    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
		    d.getUTCMilliseconds()));
	}

	var RFC1123_MONTHS = [
	    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var RFC1123_DAYS = [
	    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function rfc1123(date) {
		return (mod_extsprintf.sprintf('%s, %02d %s %04d %02d:%02d:%02d GMT',
		    RFC1123_DAYS[date.getUTCDay()], date.getUTCDate(),
		    RFC1123_MONTHS[date.getUTCMonth()], date.getUTCFullYear(),
		    date.getUTCHours(), date.getUTCMinutes(),
		    date.getUTCSeconds()));
	}

	/*
	 * Parses a date expressed as a string, as either a number of milliseconds since
	 * the epoch or any string format that Date accepts, giving preference to the
	 * former where these two sets overlap (e.g., small numbers).
	 */
	function parseDateTime(str)
	{
		/*
		 * This is irritatingly implicit, but significantly more concise than
		 * alternatives.  The "+str" will convert a string containing only a
		 * number directly to a Number, or NaN for other strings.  Thus, if the
		 * conversion succeeds, we use it (this is the milliseconds-since-epoch
		 * case).  Otherwise, we pass the string directly to the Date
		 * constructor to parse.
		 */
		var numeric = +str;
		if (!isNaN(numeric)) {
			return (new Date(numeric));
		} else {
			return (new Date(str));
		}
	}

	function validateJsonObjectJS(schema, input)
	{
		var report = mod_jsonschema.validate(input, schema);

		if (report.errors.length === 0)
			return (null);

		/* Currently, we only do anything useful with the first error. */
		var error = report.errors[0];

		/* The failed property is given by a URI with an irrelevant prefix. */
		var propname = error['property'];
		var reason = error['message'].toLowerCase();
		var i, j;

		/*
		 * There's at least one case where the property error message is
		 * confusing at best.  We work around this here.
		 */
		if ((i = reason.indexOf('the property ')) != -1 &&
		    (j = reason.indexOf(' is not defined in the schema and the ' +
		    'schema does not allow additional properties')) != -1) {
			i += 'the property '.length;
			if (propname === '')
				propname = reason.substr(i, j - i);
			else
				propname = propname + '.' + reason.substr(i, j - i);

			reason = 'unsupported property';
		}

		var rv = new mod_verror.VError('property "%s": %s', propname, reason);
		rv.jsv_details = error;
		return (rv);
	}

	function randElt(arr)
	{
		mod_assert.ok(Array.isArray(arr) && arr.length > 0,
		    'randElt argument must be a non-empty array');

		return (arr[Math.floor(Math.random() * arr.length)]);
	}

	function assertHrtime(a)
	{
		mod_assert.ok(a[0] >= 0 && a[1] >= 0,
		    'negative numbers not allowed in hrtimes');
		mod_assert.ok(a[1] < 1e9, 'nanoseconds column overflow');
	}

	/*
	 * Compute the time elapsed between hrtime readings A and B, where A is later
	 * than B.  hrtime readings come from Node's process.hrtime().  There is no
	 * defined way to represent negative deltas, so it's illegal to diff B from A
	 * where the time denoted by B is later than the time denoted by A.  If this
	 * becomes valuable, we can define a representation and extend the
	 * implementation to support it.
	 */
	function hrtimeDiff(a, b)
	{
		assertHrtime(a);
		assertHrtime(b);
		mod_assert.ok(a[0] > b[0] || (a[0] == b[0] && a[1] >= b[1]),
		    'negative differences not allowed');

		var rv = [ a[0] - b[0], 0 ];

		if (a[1] >= b[1]) {
			rv[1] = a[1] - b[1];
		} else {
			rv[0]--;
			rv[1] = 1e9 - (b[1] - a[1]);
		}

		return (rv);
	}

	/*
	 * Convert a hrtime reading from the array format returned by Node's
	 * process.hrtime() into a scalar number of nanoseconds.
	 */
	function hrtimeNanosec(a)
	{
		assertHrtime(a);

		return (Math.floor(a[0] * 1e9 + a[1]));
	}

	/*
	 * Convert a hrtime reading from the array format returned by Node's
	 * process.hrtime() into a scalar number of microseconds.
	 */
	function hrtimeMicrosec(a)
	{
		assertHrtime(a);

		return (Math.floor(a[0] * 1e6 + a[1] / 1e3));
	}

	/*
	 * Convert a hrtime reading from the array format returned by Node's
	 * process.hrtime() into a scalar number of milliseconds.
	 */
	function hrtimeMillisec(a)
	{
		assertHrtime(a);

		return (Math.floor(a[0] * 1e3 + a[1] / 1e6));
	}

	/*
	 * Add two hrtime readings A and B, overwriting A with the result of the
	 * addition.  This function is useful for accumulating several hrtime intervals
	 * into a counter.  Returns A.
	 */
	function hrtimeAccum(a, b)
	{
		assertHrtime(a);
		assertHrtime(b);

		/*
		 * Accumulate the nanosecond component.
		 */
		a[1] += b[1];
		if (a[1] >= 1e9) {
			/*
			 * The nanosecond component overflowed, so carry to the seconds
			 * field.
			 */
			a[0]++;
			a[1] -= 1e9;
		}

		/*
		 * Accumulate the seconds component.
		 */
		a[0] += b[0];

		return (a);
	}

	/*
	 * Add two hrtime readings A and B, returning the result as a new hrtime array.
	 * Does not modify either input argument.
	 */
	function hrtimeAdd(a, b)
	{
		assertHrtime(a);

		var rv = [ a[0], a[1] ];

		return (hrtimeAccum(rv, b));
	}


	/*
	 * Check an object for unexpected properties.  Accepts the object to check, and
	 * an array of allowed property names (strings).  Returns an array of key names
	 * that were found on the object, but did not appear in the list of allowed
	 * properties.  If no properties were found, the returned array will be of
	 * zero length.
	 */
	function extraProperties(obj, allowed)
	{
		mod_assert.ok(typeof (obj) === 'object' && obj !== null,
		    'obj argument must be a non-null object');
		mod_assert.ok(Array.isArray(allowed),
		    'allowed argument must be an array of strings');
		for (var i = 0; i < allowed.length; i++) {
			mod_assert.ok(typeof (allowed[i]) === 'string',
			    'allowed argument must be an array of strings');
		}

		return (Object.keys(obj).filter(function (key) {
			return (allowed.indexOf(key) === -1);
		}));
	}

	/*
	 * Given three sets of properties "provided" (may be undefined), "overrides"
	 * (required), and "defaults" (may be undefined), construct an object containing
	 * the union of these sets with "overrides" overriding "provided", and
	 * "provided" overriding "defaults".  None of the input objects are modified.
	 */
	function mergeObjects(provided, overrides, defaults)
	{
		var rv, k;

		rv = {};
		if (defaults) {
			for (k in defaults)
				rv[k] = defaults[k];
		}

		if (provided) {
			for (k in provided)
				rv[k] = provided[k];
		}

		if (overrides) {
			for (k in overrides)
				rv[k] = overrides[k];
		}

		return (rv);
	}


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * extsprintf.js: extended POSIX-style sprintf
	 */

	var mod_assert = __webpack_require__(24);
	var mod_util = __webpack_require__(25);

	/*
	 * Public interface
	 */
	exports.sprintf = jsSprintf;

	/*
	 * Stripped down version of s[n]printf(3c).  We make a best effort to throw an
	 * exception when given a format string we don't understand, rather than
	 * ignoring it, so that we won't break existing programs if/when we go implement
	 * the rest of this.
	 *
	 * This implementation currently supports specifying
	 *	- field alignment ('-' flag),
	 * 	- zero-pad ('0' flag)
	 *	- always show numeric sign ('+' flag),
	 *	- field width
	 *	- conversions for strings, decimal integers, and floats (numbers).
	 *	- argument size specifiers.  These are all accepted but ignored, since
	 *	  Javascript has no notion of the physical size of an argument.
	 *
	 * Everything else is currently unsupported, most notably precision, unsigned
	 * numbers, non-decimal numbers, and characters.
	 */
	function jsSprintf(fmt)
	{
		var regex = [
		    '([^%]*)',				/* normal text */
		    '%',				/* start of format */
		    '([\'\\-+ #0]*?)',			/* flags (optional) */
		    '([1-9]\\d*)?',			/* width (optional) */
		    '(\\.([1-9]\\d*))?',		/* precision (optional) */
		    '[lhjztL]*?',			/* length mods (ignored) */
		    '([diouxXfFeEgGaAcCsSp%jr])'	/* conversion */
		].join('');

		var re = new RegExp(regex);
		var args = Array.prototype.slice.call(arguments, 1);
		var flags, width, precision, conversion;
		var left, pad, sign, arg, match;
		var ret = '';
		var argn = 1;

		mod_assert.equal('string', typeof (fmt));

		while ((match = re.exec(fmt)) !== null) {
			ret += match[1];
			fmt = fmt.substring(match[0].length);

			flags = match[2] || '';
			width = match[3] || 0;
			precision = match[4] || '';
			conversion = match[6];
			left = false;
			sign = false;
			pad = ' ';

			if (conversion == '%') {
				ret += '%';
				continue;
			}

			if (args.length === 0)
				throw (new Error('too few args to sprintf'));

			arg = args.shift();
			argn++;

			if (flags.match(/[\' #]/))
				throw (new Error(
				    'unsupported flags: ' + flags));

			if (precision.length > 0)
				throw (new Error(
				    'non-zero precision not supported'));

			if (flags.match(/-/))
				left = true;

			if (flags.match(/0/))
				pad = '0';

			if (flags.match(/\+/))
				sign = true;

			switch (conversion) {
			case 's':
				if (arg === undefined || arg === null)
					throw (new Error('argument ' + argn +
					    ': attempted to print undefined or null ' +
					    'as a string'));
				ret += doPad(pad, width, left, arg.toString());
				break;

			case 'd':
				arg = Math.floor(arg);
				/*jsl:fallthru*/
			case 'f':
				sign = sign && arg > 0 ? '+' : '';
				ret += sign + doPad(pad, width, left,
				    arg.toString());
				break;

			case 'j': /* non-standard */
				if (width === 0)
					width = 10;
				ret += mod_util.inspect(arg, false, width);
				break;

			case 'r': /* non-standard */
				ret += dumpException(arg);
				break;

			default:
				throw (new Error('unsupported conversion: ' +
				    conversion));
			}
		}

		ret += fmt;
		return (ret);
	}

	function doPad(chr, width, left, str)
	{
		var ret = str;

		while (ret.length < width) {
			if (left)
				ret += chr;
			else
				ret = chr + ret;
		}

		return (ret);
	}

	/*
	 * This function dumps long stack traces for exceptions having a cause() method.
	 * See node-verror for an example.
	 */
	function dumpException(ex)
	{
		var ret;

		if (!(ex instanceof Error))
			throw (new Error(jsSprintf('invalid type for %%r: %j', ex)));

		/* Note that V8 prepends "ex.stack" with ex.toString(). */
		ret = 'EXCEPTION: ' + ex.constructor.name + ': ' + ex.stack;

		if (ex.cause && typeof (ex.cause) === 'function') {
			var cex = ex.cause();
			if (cex) {
				ret += '\nCaused by: ' + dumpException(cex);
			}
		}

		return (ret);
	}


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * verror.js: richer JavaScript errors
	 */

	var mod_assert = __webpack_require__(24);
	var mod_util = __webpack_require__(25);

	var mod_extsprintf = __webpack_require__(98);

	/*
	 * Public interface
	 */
	exports.VError = VError;
	exports.WError = WError;
	exports.MultiError = MultiError;

	/*
	 * Like JavaScript's built-in Error class, but supports a "cause" argument and a
	 * printf-style message.  The cause argument can be null.
	 */
	function VError(options)
	{
		var args, causedBy, ctor, tailmsg;

		if (options instanceof Error || typeof (options) === 'object') {
			args = Array.prototype.slice.call(arguments, 1);
		} else {
			args = Array.prototype.slice.call(arguments, 0);
			options = undefined;
		}

		tailmsg = args.length > 0 ?
		    mod_extsprintf.sprintf.apply(null, args) : '';
		this.jse_shortmsg = tailmsg;
		this.jse_summary = tailmsg;

		if (options) {
			causedBy = options.cause;

			if (!causedBy || !(options.cause instanceof Error))
				causedBy = options;

			if (causedBy && (causedBy instanceof Error)) {
				this.jse_cause = causedBy;
				this.jse_summary += ': ' + causedBy.message;
			}
		}

		this.message = this.jse_summary;
		Error.call(this, this.jse_summary);

		if (Error.captureStackTrace) {
			ctor = options ? options.constructorOpt : undefined;
			ctor = ctor || arguments.callee;
			Error.captureStackTrace(this, ctor);
		}
	}

	mod_util.inherits(VError, Error);
	VError.prototype.name = 'VError';

	VError.prototype.toString = function ve_toString()
	{
		var str = (this.hasOwnProperty('name') && this.name ||
			this.constructor.name || this.constructor.prototype.name);
		if (this.message)
			str += ': ' + this.message;

		return (str);
	};

	VError.prototype.cause = function ve_cause()
	{
		return (this.jse_cause);
	};


	/*
	 * Represents a collection of errors for the purpose of consumers that generally
	 * only deal with one error.  Callers can extract the individual errors
	 * contained in this object, but may also just treat it as a normal single
	 * error, in which case a summary message will be printed.
	 */
	function MultiError(errors)
	{
		mod_assert.ok(errors.length > 0);
		this.ase_errors = errors;

		VError.call(this, errors[0], 'first of %d error%s',
		    errors.length, errors.length == 1 ? '' : 's');
	}

	mod_util.inherits(MultiError, VError);



	/*
	 * Like JavaScript's built-in Error class, but supports a "cause" argument which
	 * is wrapped, not "folded in" as with VError.	Accepts a printf-style message.
	 * The cause argument can be null.
	 */
	function WError(options)
	{
		Error.call(this);

		var args, cause, ctor;
		if (typeof (options) === 'object') {
			args = Array.prototype.slice.call(arguments, 1);
		} else {
			args = Array.prototype.slice.call(arguments, 0);
			options = undefined;
		}

		if (args.length > 0) {
			this.message = mod_extsprintf.sprintf.apply(null, args);
		} else {
			this.message = '';
		}

		if (options) {
			if (options instanceof Error) {
				cause = options;
			} else {
				cause = options.cause;
				ctor = options.constructorOpt;
			}
		}

		Error.captureStackTrace(this, ctor || this.constructor);
		if (cause)
			this.cause(cause);

	}

	mod_util.inherits(WError, Error);
	WError.prototype.name = 'WError';


	WError.prototype.toString = function we_toString()
	{
		var str = (this.hasOwnProperty('name') && this.name ||
			this.constructor.name || this.constructor.prototype.name);
		if (this.message)
			str += ': ' + this.message;
		if (this.we_cause && this.we_cause.message)
			str += '; caused by ' + this.we_cause.toString();

		return (str);
	};

	WError.prototype.cause = function we_cause(c)
	{
		if (c instanceof Error)
			this.we_cause = c;

		return (this.we_cause);
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * JSONSchema Validator - Validates JavaScript objects using JSON Schemas
	 *	(http://www.json.com/json-schema-proposal/)
	 *
	 * Copyright (c) 2007 Kris Zyp SitePen (www.sitepen.com)
	 * Licensed under the MIT (MIT-LICENSE.txt) license.
	To use the validator call the validate function with an instance object and an optional schema object.
	If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
	that schema will be used to validate and the schema parameter is not necessary (if both exist,
	both validations will occur).
	The validate method will return an array of validation errors. If there are no errors, then an
	empty list will be returned. A validation error will have two properties:
	"property" which indicates which property had the error
	"message" which indicates what the error was
	 */
	({define: true?__webpack_require__(101):function(deps, factory){module.exports = factory();}}).
	define([], function(){
	var exports = validate;
	// setup primitive classes to be JSON Schema types
	exports.Integer = {type:"integer"};
	var primitiveConstructors = {
		String: String,
		Boolean: Boolean,
		Number: Number,
		Object: Object,
		Array: Array,
		Date: Date
	}
	exports.validate = validate;
	function validate(/*Any*/instance,/*Object*/schema) {
			// Summary:
			//  	To use the validator call JSONSchema.validate with an instance object and an optional schema object.
			// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
			// 		that schema will be used to validate and the schema parameter is not necessary (if both exist,
			// 		both validations will occur).
			// 		The validate method will return an object with two properties:
			// 			valid: A boolean indicating if the instance is valid by the schema
			// 			errors: An array of validation errors. If there are no errors, then an
			// 					empty list will be returned. A validation error will have two properties:
			// 						property: which indicates which property had the error
			// 						message: which indicates what the error was
			//
			return validate(instance, schema, {changing: false});//, coerce: false, existingOnly: false});
		};
	exports.checkPropertyChange = function(/*Any*/value,/*Object*/schema, /*String*/property) {
			// Summary:
			// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
			// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
			// 		not check for self-validation, it is assumed that the passed in value is already internally valid.
			// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for
			// 		information.
			//
			return validate(value, schema, {changing: property || "property"});
		};
	var validate = exports._validate = function(/*Any*/instance,/*Object*/schema,/*Object*/options) {

		if (!options) options = {};
		var _changing = options.changing;

		function getType(schema){
			return schema.type || (primitiveConstructors[schema.name] == schema && schema.name.toLowerCase());
		}
		var errors = [];
		// validate a value against a property definition
		function checkProp(value, schema, path,i){

			var l;
			path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
			function addError(message){
				errors.push({property:path,message:message});
			}

			if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function') && !(schema && getType(schema))){
				if(typeof schema == 'function'){
					if(!(value instanceof schema)){
						addError("is not an instance of the class/constructor " + schema.name);
					}
				}else if(schema){
					addError("Invalid schema/property definition " + schema);
				}
				return null;
			}
			if(_changing && schema.readonly){
				addError("is a readonly field, it can not be changed");
			}
			if(schema['extends']){ // if it extends another schema, it must pass that schema as well
				checkProp(value,schema['extends'],path,i);
			}
			// validate a value against a type definition
			function checkType(type,value){
				if(type){
					if(typeof type == 'string' && type != 'any' &&
							(type == 'null' ? value !== null : typeof value != type) &&
							!(value instanceof Array && type == 'array') &&
							!(value instanceof Date && type == 'date') &&
							!(type == 'integer' && value%1===0)){
						return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
					}
					if(type instanceof Array){
						var unionErrors=[];
						for(var j = 0; j < type.length; j++){ // a union type
							if(!(unionErrors=checkType(type[j],value)).length){
								break;
							}
						}
						if(unionErrors.length){
							return unionErrors;
						}
					}else if(typeof type == 'object'){
						var priorErrors = errors;
						errors = [];
						checkProp(value,type,path);
						var theseErrors = errors;
						errors = priorErrors;
						return theseErrors;
					}
				}
				return [];
			}
			if(value === undefined){
				if(schema.required){
					addError("is missing and it is required");
				}
			}else{
				errors = errors.concat(checkType(getType(schema),value));
				if(schema.disallow && !checkType(schema.disallow,value).length){
					addError(" disallowed value was matched");
				}
				if(value !== null){
					if(value instanceof Array){
						if(schema.items){
							var itemsIsArray = schema.items instanceof Array;
							var propDef = schema.items;
							for (i = 0, l = value.length; i < l; i += 1) {
								if (itemsIsArray)
									propDef = schema.items[i];
								if (options.coerce)
									value[i] = options.coerce(value[i], propDef);
								errors.concat(checkProp(value[i],propDef,path,i));
							}
						}
						if(schema.minItems && value.length < schema.minItems){
							addError("There must be a minimum of " + schema.minItems + " in the array");
						}
						if(schema.maxItems && value.length > schema.maxItems){
							addError("There must be a maximum of " + schema.maxItems + " in the array");
						}
					}else if(schema.properties || schema.additionalProperties){
						errors.concat(checkObj(value, schema.properties, path, schema.additionalProperties));
					}
					if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
						addError("does not match the regex pattern " + schema.pattern);
					}
					if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
						addError("may only be " + schema.maxLength + " characters long");
					}
					if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
						addError("must be at least " + schema.minLength + " characters long");
					}
					if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum &&
							schema.minimum > value){
						addError("must have a minimum value of " + schema.minimum);
					}
					if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum &&
							schema.maximum < value){
						addError("must have a maximum value of " + schema.maximum);
					}
					if(schema['enum']){
						var enumer = schema['enum'];
						l = enumer.length;
						var found;
						for(var j = 0; j < l; j++){
							if(enumer[j]===value){
								found=1;
								break;
							}
						}
						if(!found){
							addError("does not have a value in the enumeration " + enumer.join(", "));
						}
					}
					if(typeof schema.maxDecimal == 'number' &&
						(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
						addError("may only have " + schema.maxDecimal + " digits of decimal places");
					}
				}
			}
			return null;
		}
		// validate an object against a schema
		function checkObj(instance,objTypeDef,path,additionalProp){

			if(typeof objTypeDef =='object'){
				if(typeof instance != 'object' || instance instanceof Array){
					errors.push({property:path,message:"an object is required"});
				}
				
				for(var i in objTypeDef){ 
					if(objTypeDef.hasOwnProperty(i)){
						var value = instance[i];
						// skip _not_ specified properties
						if (value === undefined && options.existingOnly) continue;
						var propDef = objTypeDef[i];
						// set default
						if(value === undefined && propDef["default"]){
							value = instance[i] = propDef["default"];
						}
						if(options.coerce && i in instance){
							value = instance[i] = options.coerce(value, propDef);
						}
						checkProp(value,propDef,path,i);
					}
				}
			}
			for(i in instance){
				if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
					if (options.filter) {
						delete instance[i];
						continue;
					} else {
						errors.push({property:path,message:(typeof value) + "The property " + i +
							" is not defined in the schema and the schema does not allow additional properties"});
					}
				}
				var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
				if(requires && !(requires in instance)){
					errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
				}
				value = instance[i];
				if(additionalProp && (!(objTypeDef && typeof objTypeDef == 'object') || !(i in objTypeDef))){
					if(options.coerce){
						value = instance[i] = options.coerce(value, additionalProp);
					}
					checkProp(value,additionalProp,path,i);
				}
				if(!_changing && value && value.$schema){
					errors = errors.concat(checkProp(value,value.$schema,path,i));
				}
			}
			return errors;
		}
		if(schema){
			checkProp(instance,schema,'',_changing || '');
		}
		if(!_changing && instance && instance.$schema){
			checkProp(instance,instance.$schema,'','');
		}
		return {valid:!errors.length,errors:errors};
	};
	exports.mustBeValid = function(result){
		//	summary:
		//		This checks to ensure that the result is valid and will throw an appropriate error message if it is not
		// result: the result returned from checkPropertyChange or validate
		if(!result.valid){
			throw new TypeError(result.errors.map(function(error){return "for property " + error.property + ': ' + error.message;}).join(", \n"));
		}
	}

	return exports;
	});


/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2015 Joyent, Inc.

	var assert = __webpack_require__(23);
	var crypto = __webpack_require__(51);
	var sshpk = __webpack_require__(47);
	var utils = __webpack_require__(46);

	var HASH_ALGOS = utils.HASH_ALGOS;
	var PK_ALGOS = utils.PK_ALGOS;
	var InvalidAlgorithmError = utils.InvalidAlgorithmError;
	var HttpSignatureError = utils.HttpSignatureError;
	var validateAlgorithm = utils.validateAlgorithm;

	///--- Exported API

	module.exports = {
	  /**
	   * Verify RSA/DSA signature against public key.  You are expected to pass in
	   * an object that was returned from `parse()`.
	   *
	   * @param {Object} parsedSignature the object you got from `parse`.
	   * @param {String} pubkey RSA/DSA private key PEM.
	   * @return {Boolean} true if valid, false otherwise.
	   * @throws {TypeError} if you pass in bad arguments.
	   * @throws {InvalidAlgorithmError}
	   */
	  verifySignature: function verifySignature(parsedSignature, pubkey) {
	    assert.object(parsedSignature, 'parsedSignature');
	    if (typeof (pubkey) === 'string' || Buffer.isBuffer(pubkey))
	      pubkey = sshpk.parseKey(pubkey);
	    assert.ok(pubkey instanceof sshpk.Key, 'pubkey must be a sshpk.Key');

	    var alg = validateAlgorithm(parsedSignature.algorithm);
	    if (alg[0] === 'hmac' || alg[0] !== pubkey.type)
	      return (false);

	    var v = pubkey.createVerify(alg[1]);
	    v.update(parsedSignature.signingString);
	    return (v.verify(parsedSignature.params.signature, 'base64'));
	  },

	  /**
	   * Verify HMAC against shared secret.  You are expected to pass in an object
	   * that was returned from `parse()`.
	   *
	   * @param {Object} parsedSignature the object you got from `parse`.
	   * @param {String} secret HMAC shared secret.
	   * @return {Boolean} true if valid, false otherwise.
	   * @throws {TypeError} if you pass in bad arguments.
	   * @throws {InvalidAlgorithmError}
	   */
	  verifyHMAC: function verifyHMAC(parsedSignature, secret) {
	    assert.object(parsedSignature, 'parsedHMAC');
	    assert.string(secret, 'secret');

	    var alg = validateAlgorithm(parsedSignature.algorithm);
	    if (alg[0] !== 'hmac')
	      return (false);

	    var hashAlg = alg[1].toUpperCase();

	    var hmac = crypto.createHmac(hashAlg, secret);
	    hmac.update(parsedSignature.signingString);

	    /*
	     * Now double-hash to avoid leaking timing information - there's
	     * no easy constant-time compare in JS, so we use this approach
	     * instead. See for more info:
	     * https://www.isecpartners.com/blog/2011/february/double-hmac-
	     * verification.aspx
	     */
	    var h1 = crypto.createHmac(hashAlg, secret);
	    h1.update(hmac.digest());
	    h1 = h1.digest();
	    var h2 = crypto.createHmac(hashAlg, secret);
	    h2.update(new Buffer(parsedSignature.params.signature, 'base64'));
	    h2 = h2.digest();

	    /* Node 0.8 returns strings from .digest(). */
	    if (typeof (h1) === 'string')
	      return (h1 === h2);
	    /* And node 0.10 lacks the .equals() method on Buffers. */
	    if (Buffer.isBuffer(h1) && !h1.equals)
	      return (h1.toString('binary') === h2.toString('binary'));

	    return (h1.equals(h2));
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var httpSignature = __webpack_require__(21);
	var request = __webpack_require__(14);

	module.exports = {
	    addToMany: function(activity, feeds, callback) {
	      var req = this.makeSignedRequest({
	        url: 'feed/add_to_many/',
	        body: {
	          'activity': activity,
	          'feeds': feeds
	        }
	      }, callback);

	      return req;
	    },

	    followMany: function(follows, callback)  { 
	      var req = this.makeSignedRequest({
	        url: 'follow_many/',
	        body: follows
	      }, callback); 

	      return req;
	    },

	    makeSignedRequest: function(kwargs, cb) {
	      if(!this.apiSecret) {
	        throw new errors.SiteError('Missing secret, which is needed to perform signed requests, use var client = stream.connect(key, secret);');
	      }

	      this.send('request', 'post', kwargs, cb);

	      kwargs.url = this.enrichUrl(kwargs.url);
	      kwargs.json = true;
	      kwargs.method = 'POST';
	      kwargs.headers = { 'X-Api-Key' : this.apiKey };

	      var callback = this.wrapCallback(cb);
	      var req = request(kwargs, callback);

	      httpSignature.sign(req, {
	        algorithm: 'hmac-sha256',
	        key: this.apiSecret,
	        keyId: this.apiKey
	      });
	    
	      return request;
	    }
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var expect = __webpack_require__(3);
	var jwt = __webpack_require__(105);
	var qc = __webpack_require__(106);
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

	  if(node) {
	    it('should decode valid jwts headers', function() {
	      expect( qc.forAll( propertyHeaderJSON, arbJWT ) ).to.be(true);
	    });  
	  }
	});



/***/ },
/* 105 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 106 */
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