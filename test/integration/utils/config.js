const e = module.exports;

e.IS_NODE_ENV = typeof window === 'undefined';

if (e.IS_NODE_ENV) {
  e.API_KEY = process.env.STREAM_API_KEY;
  e.API_SECRET = process.env.STREAM_API_SECRET;
  e.APP_ID = process.env.STREAM_APP_ID;
} else {
  e.API_KEY = window.STREAM_API_KEY;
  e.API_SECRET = window.STREAM_API_SECRET;
  e.APP_ID = window.STREAM_APP_ID;
}

if (!e.API_KEY || !e.API_SECRET || !e.APP_ID) {
  throw new Error('Expected STREAM_API_KEY, STREAM_API_SECRET, and STREAM_APP_ID env vars');
}
