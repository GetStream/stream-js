(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

module.exports = request
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

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){

var StreamClient = require('./lib/client');


function connect(apiKey, apiSecret) {
	return new StreamClient(apiKey, apiSecret);
}

module.exports.connect = connect;

},{"./lib/client":4}],4:[function(require,module,exports){
var request = require('request');
var StreamFeed = require('./feed');
var signing = require('./signing');
var errors = require('./errors');


var StreamClient = function () {
    this.initialize.apply(this, arguments);
};

StreamClient.prototype = {
	baseUrl: 'https://getstream.io',
	
    initialize: function (key, secret, fayeUrl) {
    	/*
    	 * API key and secret
    	 * Secret is optional
    	 */
    	this.key = key;
    	this.secret = secret;
        this.fayeUrl = fayeUrl ? fayeUrl : 'https://getstream.io/faye';
    },
    
    feed: function(feedId, token, siteId) {
    	/*
    	 * Returns a feed object for the given feed id and token
    	 * Example:
    	 * 
    	 * client.feed('user1', 'token2');
    	 */
    	var match = feedId.match(/\:/g);
    	if (match === null || match.length != 1) {
    		throw new errors.FeedError('Wrong feed format ' + feedId + ' correct format is flat:1');
    	}
    	
    	if (!token && this.secret) {
    		token = signing.sign(this.secret, feedId.replace(':', ''));
    	}
    	
    	var feed = new StreamFeed(this, feedId, token, siteId);
    	return feed;
    },

    enrichUrl: function(relativeUrl) {
    	var url = this.baseUrl + relativeUrl;
    	if (url.indexOf('?') != -1) {
    		url += '&api_key=' + this.key;
    	} else {
    		url += '?api_key=' + this.key;
    	}
    	return url;
    },
    
    enrichKwargs: function(kwargs) {
    	kwargs.url = this.enrichUrl(kwargs.url);
    	kwargs.json = true;
    	var secret = kwargs.secret || this.secret;
    	kwargs.headers = {};
    	kwargs.headers.Authorization = secret;
    	return kwargs;
    },
    /*
     * Shortcuts for post, get and delete HTTP methods
     */
    get: function(kwargs, cb) {
    	kwargs = this.enrichKwargs(kwargs);
    	kwargs.method = 'GET';
    	return request.get(kwargs, cb);
    },
    post: function(kwargs, cb) {
    	kwargs = this.enrichKwargs(kwargs);
    	kwargs.method = 'POST';
    	return request(kwargs, cb);
    },
    delete: function(kwargs, cb) {
    	kwargs = this.enrichKwargs(kwargs);
    	kwargs.method = 'DELETE';
    	return request(kwargs, cb);
    }
};

module.exports = StreamClient;

},{"./errors":5,"./feed":6,"./signing":7,"request":1}],5:[function(require,module,exports){
var errors = module.exports;

var canCapture = (typeof Error.captureStackTrace === 'function');
var canStack = !!(new Error()).stack;

function ErrorAbstract(msg, constructor) {
  this.message = msg;

  Error.call(this, this.message);

  if (canCapture) {
    Error.captureStackTrace(this, constructor);
  }
  else if (canStack) {
    this.stack = (new Error()).stack;
  }
  else {
    this.stack = '';
  }
}
errors._Abstract = ErrorAbstract;
ErrorAbstract.prototype = new Error();

/**
 * Connection Error
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.FeedError = function FeedError(msg) {
  ErrorAbstract.call(this, msg);
};
errors.FeedError.prototype = new ErrorAbstract();


},{}],6:[function(require,module,exports){

var StreamFeed = function () {
    this.initialize.apply(this, arguments);
};

StreamFeed.prototype = {
	/*
	 * The feed object contains convenience functions such add activity
	 * remove activity etc
	 * 
	 */
	initialize: function(client, feed, token, siteId) {
		this.client = client;
		this.feed = feed;
		this.token = token;
		this.feedUrl = feed.replace(':', '/');
		this.feedTogether = feed.replace(':', '');
		this.feedToken = this.feedTogether + ' ' + this.token;
        this.fayeClient = null;
        this.notificationChannel = 'site-' + siteId + '-feed-' + this.feedTogether;
	},
	addActivity: function(activity, callback) {
		/*
		 * Adds the given activity to the feed and
		 * calls the specified callback
		 */
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'form': activity,
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	removeActivity: function(activityId, callback) {
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/' + activityId + '/', 
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	follow: function(target, callback) {
		var xhr = this.client.post({
			'url': '/api/feed/'+ this.feedUrl + '/follows/', 
			'form': {'target': target},
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	unfollow: function(target, callback) {
		var xhr = this.client.delete({
			'url': '/api/feed/'+ this.feedUrl + '/follows/' + target + '/', 
			'secret': this.feedToken
		}, callback);
		return xhr;
	},
	get: function(argumentHash, callback) {
		var xhr = this.client.get({
			'url': '/api/feed/'+ this.feedUrl + '/', 
			'qs': argumentHash,
			'secret': this.feedToken
		}, callback);
		return xhr;
	},

    getFayeAuthorization: function(){
        var api_key = this.client.key;
        var user_id = this.notificationChannel;
        var signature = this.token;
        return {
          incoming: function(message, callback) {
            callback(message);
          },
          outgoing: function(message, callback) {
            message.ext = {'user_id': user_id, 'api_key':api_key, 'signature': signature};
            callback(message);
          }
        };
    },

    getFayeClient: function(){
        if (this.fayeClient === null){
            this.fayeClient = new Faye.Client(this.client.fayeUrl);
            var authExtension = this.getFayeAuthorization();
            this.fayeClient.addExtension(authExtension);
        }
        return this.fayeClient;
    },

    subscribe: function(callback){
        return this.getFayeClient().subscribe('/'+this.notificationChannel, callback);
    }
};


module.exports = StreamFeed;
},{}],7:[function(require,module,exports){

var crypto = require('crypto');


function urlsafe_b64_encode(s) {
	var escaped = s.replace('+', '-').replace('/', '_');
	return escaped.replace(/^=+/, '').replace(/=+$/, '');
}


exports.sign = function(secret, value) {
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
	 * secret: tfq2sdqpj9g446sbv653x3aqmgn33hsn8uzdc9jpskaw8mj6vsnhzswuwptuj9su
	 * value: flat1
	 * digest: Q\xb6\xd5+\x82\xd58\xdeu\x80\xc5\xe3\xb8\xa5bL1\xf1\xa3\xdb
	 * result: UbbVK4LVON51gMXjuKViTDHxo9s
	 */
	var key = new crypto.createHash('sha1').update(secret).digest();
	var hmac = crypto.createHmac('sha1', key);
	var signature = hmac.update(value).digest('base64');
	var urlsafe = urlsafe_b64_encode(signature);
	return urlsafe;
};
},{"crypto":2}]},{},[3])