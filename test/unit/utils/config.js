var isNodeEnv = typeof window === 'undefined';

var LOCAL_RUN = false;

var API_KEY = 'q56mdvdzreye',
  API_SECRET =
    'spmf6x2b2v2tqg93sfp5t393wfcxru58zm7jr3ynf7dmmndw5y8chux25hs63znf';

if (LOCAL_RUN && isNodeEnv) {
  module.exports.API_KEY = process.env.STREAM_API_KEY || API_KEY;
  module.exports.API_SECRET = process.env.STREAM_API_SECRET || API_SECRET;
} else {
  module.exports.API_KEY = API_KEY;
  module.exports.API_SECRET = API_SECRET;
}

module.exports.IS_NODE_ENV = isNodeEnv;
