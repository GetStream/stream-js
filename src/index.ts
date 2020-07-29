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

/*
 * typescript does not export the default exports here
 * useful for exposing exported internal types
 */
export * from './client';
export * from './collections';
export * from './feed';
export * from './files';
export * from './images';
export * from './personalization';
export * from './reaction';
export * from './user';
