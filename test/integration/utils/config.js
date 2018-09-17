var isNodeEnv = typeof window === 'undefined';

var API_KEY = process.env.STREAM_API_KEY,
  API_SECRET = process.env.STREAM_API_SECRET,
  APP_ID = process.env.STREAM_APP_ID;

if (!API_KEY || !API_SECRET || !APP_ID) {
  throw new Error(
    'Expected STREAM_API_KEY, STREAM_API_SECRET, and STREAM_APP_ID env vars',
  );
}

module.exports.API_KEY = API_KEY;
module.exports.API_SECRET = API_SECRET;
module.exports.APP_ID = APP_ID;
module.exports.IS_NODE_ENV = isNodeEnv;
