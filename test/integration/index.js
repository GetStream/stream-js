
var expect = expect || require('expect.js');
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
  this.timeout(4000);
  if (typeof(process) != "undefined" && process.env.LOCAL) {
  	// local testing is slow as we run celery tasks in sync
  	this.timeout(25000);
  }
  if (typeof(document) != "undefined" && document.location.href.indexOf('local=1') != -1) {
  	// local testing via the browser
  	this.timeout(25000);
  }
  if (node) {
	  // we arent in a browser
	  stream = require('../../src/getstream');
  }
  console.log('node is set to ', node);
  errors = stream.errors;
  
  var client, user1, aggregated2, aggregated3, flat3, secret3, notification3;
  
  function beforeEachBrowser() {
  	client = stream.connect('ahj2ndz7gsan');
  	client = stream.connect('ahj2ndz7gsan', null, 519, {'group': 'browserTestCycle', 'location': 'eu-west'});
  	user1 = client.feed('user', '11', 'YHEtoaiaB03gBR9px6vX4HCRVKk');
  	aggregated2 = client.feed('aggregated', '22', 'HxAmzOcePOz0vAIpyEolPl5NEfA');
  	aggregated3 = client.feed('aggregated', '33', 'YxCkg56vpnabvHPNLCHK7Se36FY');
  	flat3 = client.feed('flat', '33', 'MqPLN1eA_7l5iYrJ8zMyImkY8V0');
  	secret3 = client.feed('secret', '33', 'fo8mzeoxsa1if2te5KWJtOF-cZw');
    notification3 = client.feed('notification', '33', 'h2YC_zy7fcHQUAJc5kNhZaH9Kp0');
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
    // TODO: fully test the behaviour of mark read and seen
    function callback(error, response, body) {
      done();
    }
    var params = {limit:2, mark_seen:true, mark_read: ['71ae691c-6681-11e4-8080-8001556e1292']};
    notification3.get(params, callback);
  });
  
  it('fayeGetClient', function (done) {
    var client = user1.getFayeClient();
    done();
  });
  
  it('fayeSubscribe', function (done) {
  	this.timeout(6000);
  	var client = user1.getFayeClient();
  	var subscription = user1.subscribe(function callback() {
  		done();
  	});
  	subscription.then(function() {
	  	// add something to user 1 feed
	    var activity = {'actor': 1, 'verb': 'add', 'object': Math.floor(Math.random() * 40000 + 10000)};
	    user1.addActivity(activity);
	    // verify we get a notification, if not we'll get a timeout
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
