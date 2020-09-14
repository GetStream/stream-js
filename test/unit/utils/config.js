const e = module.exports;

e.IS_NODE_ENV = typeof window === 'undefined';

if (e.IS_NODE_ENV) {
  e.API_KEY = process.env.STREAM_API_KEY;
  e.API_SECRET = process.env.STREAM_API_SECRET;
} else {
  e.API_KEY = window.STREAM_API_KEY;
  e.API_SECRET = window.STREAM_API_SECRET;
}

if (!e.API_KEY || !e.API_SECRET) {
  throw new Error('Expected STREAM_API_KEY and STREAM_API_SECRET env vars');
}
