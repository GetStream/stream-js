
var expect = expect || require('expect.js');
var node = typeof(stream) == 'undefined';

describe('Stream client', function () {
  if (node) {
	  // we arent in a browser
	  stream = require('../../src/getstream');
  }
  console.log('node is set to ', node);
  errors = stream.errors;
  
  var client, user1, aggregated2, aggregated3, flat3;
  
  function beforeEachBrowser() {
  	client = stream.connect('5crf3bhfzesn');
  	user1 = client.feed('user:1', 'X9HxDkjAijyufcDmlRJfBF3HiHo');
  	aggregated2 = client.feed('aggregated:2', 'qvc7nLoReHl7ft6d5dQrdxlqrMk');
  	aggregated3 = client.feed('aggregated:3', 'Pq94Uqiu44OSwBpi-C0v5Y3B_HY');
  	flat3 = client.feed('flat:3', 'ZTdkqyfadYj76h1p0zm18dsJRc0');
  }
  
  function beforeEachNode() {
  	client = stream.connect('5crf3bhfzesn', 'tfq2sdqpj9g446sbv653x3aqmgn33hsn8uzdc9jpskaw8mj6vsnhzswuwptuj9su');
    user1 = client.feed('user:1');
    aggregated2 = client.feed('aggregated:2');
    aggregated3 = client.feed('aggregated:3');
    flat3 = client.feed('flat:3');
  }
  
  var before = (node) ? beforeEachNode : beforeEachBrowser;

  beforeEach(before);

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
    	console.log(e);
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
  
});
