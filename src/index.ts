/**
 * @module stream
 * @author Thierry Schellenbach
 * BSD License
 */
import StreamClient from './client';
import * as errors from './errors';
import signing from './signing';
import { connect } from './connect';

export { connect, errors, signing, StreamClient as Client };

/* deprecated default export */
export default { connect, errors, signing, Client: StreamClient };
