var isNodeEnv = typeof window === 'undefined';

var API_KEY = process.env.STREAM_API_KEY
  , API_SECRET = process.env.STREAM_API_SECRET;

if (! API_KEY || ! API_SECRET) {
    throw new Error('Expected STREAM_API_KEY and STREAM_API_SECRET env vars');
}

module.exports.API_KEY = API_KEY;
module.exports.API_SECRET = API_SECRET;
module.exports.IS_NODE_ENV = isNodeEnv;