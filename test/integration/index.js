
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
  
  var client, user1, aggregated2, aggregated3, flat3, secret3;
  
  function beforeEachBrowser() {
  	client = stream.connect('ahj2ndz7gsan');
  	client = stream.connect('ahj2ndz7gsan', null, 96);
  	user1 = client.feed('user:1', '3adMDInYCV0LXEw4eEBmELFAnjU');
  	aggregated2 = client.feed('aggregated:2', '9v6CkZzFnWkFoIkoJz9Gyf-C9Sc');
  	aggregated3 = client.feed('aggregated:3', 'VxFa7ZWqSCjE0JFzDba1Ar9rpvA');
  	flat3 = client.feed('flat:3', 'EGW6PWbZqmSwYZvxv97-qbPTYas');
  	secret3 = client.feed('secret:3', 'WWL6PrHusQLrPursAEcHnIrvOzE');
  }
  
  function beforeEachNode() {
  	client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
  	client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy', 519);
    user1 = client.feed('user:1');
    aggregated2 = client.feed('aggregated:2');
    aggregated3 = client.feed('aggregated:3');
    flat3 = client.feed('flat:3');
    secret3 = client.feed('secret:3');
  }
  
  var before = (node) ? beforeEachNode : beforeEachBrowser;

  beforeEach(before);
  
  it('heroku', function (done) {
  	if (!node) {
  		done();
  	}
  	var url = 'https://thierry:pass@getstream.io/?site=1';
  	process.env.STREAM_URL = url;
  	client = stream.connect();
  	expect(client.key).to.eql('thierry');
  	expect(client.secret).to.eql('pass');
  	expect(client.siteId).to.eql('1');
  	done();
  });
  
  it('heroku_overwrite', function (done) {
  	if (!node) {
  		done();
  	}
  	var url = 'https://thierry:pass@getstream.io/?site=1';
  	process.env.STREAM_URL = url;
  	client = stream.connect('a','b','c');
  	expect(client.key).to.eql('a');
  	expect(client.secret).to.eql('b');
  	expect(client.siteId).to.eql('c');
  	done();
  });
  
  it('signing', function (done) {
  	expect(user1.token).to.be.an('string');
  	done();
  });

  it('get feed', function (done) {
    user1.get({'limit': 1}, function(error, response, body) {
    	expect(response.statusCode).to.eql(200);
		expect(body['results'][0]['id']).to.be.a('string');
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

  it('add activity', function (done) {
    var activity = {'actor': 1, 'verb': 'add', 'object': 1};
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
    activity['to'] = ['flat:3'];
    //flat3
    if (!node) activity['to'] = ['flat:3' + ' ' + flat3.token];
    
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
    function remove(error, response, body) {
    	var activityId = body['id'];
    	expect(response.statusCode).to.eql(201);
    	user1.removeActivity({foreignId: 'add:1'}, function(error, response, body) {
    		expect(response.statusCode).to.eql(200);
    		done();
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
  	function add() {
		var activity = {'actor': 1, 'verb': 'add', 'object': 1};
		user1.addActivity(activity, follow);
	}
	function follow(error, response, body) {
		activityId = body['id'];
		aggregated2.follow('user:1', check);
	}
    function check(error, response, body) {
    	aggregated2.get({'limit': 1}, function(error, response, body) {
    		expect(response.statusCode).to.eql(200);
    		expect(body['results'][0]['activities'][0]['id']).to.eql(activityId);
    		done();
    	});
    }
    add();
  });
  
  it('unfollow', function (done) {
    var activityId = null;
  	function add() {
		var activity = {'actor': 1, 'verb': 'add', 'object': 1};
		user1.addActivity(activity, follow);
	}
	function follow(error, response, body) {
		activityId = body['id'];
		aggregated2.follow('user:1', unfollow);
	}
	function unfollow(error, response, body) {
		aggregated2.unfollow('user:1', check);
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
    	}, 200);
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
  	function callback(error, response, body){
    	expect(error).to.eql(null);
    	expect(body.exception).to.eql(undefined);
    	done();
    }
    user1.following({'feeds': ['flat:3']}, callback);
  });
  
  it('follow private', function (done) {
  	function callback(error, response, body){
  		console.log(arguments);
    	expect(error).to.eql(null);
    	expect(body.exception).to.eql(undefined);
    	done();
   };
   if (node) {
    user1.follow('secret:3', callback);
   } else {
   	user1.follow('secret:3', secret3.token, callback);
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
  		user1.addActivity(activity, get);
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
  		var user1 = client.feed('user:1', 'secret');
  		user1.subscribe();
  	}
    expect(sub).to.throwException(function (e) {
	  	expect(e).to.be.a(errors.SiteError);
	});
	done();
  });
  
});
