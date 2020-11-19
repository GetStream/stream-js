import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Creates the JWT token for feedId, resource and action using the apiSecret
 * @method JWTScopeToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string} resource - JWT payload resource
 * @param {string} action - JWT payload action
 * @param {object} [options] - Optional additional options
 * @param {string} [options.feedId] - JWT payload feed identifier
 * @param {string} [options.userId] - JWT payload user identifier
 * @param {boolean} [options.expireTokens] - JWT noTimestamp
 * @return {string} JWT Token
 */
export function JWTScopeToken(
  apiSecret: string,
  resource: string,
  action: string,
  options: { expireTokens?: boolean; feedId?: string; userId?: string } = {},
) {
  const noTimestamp = options.expireTokens ? !options.expireTokens : true;
  const payload: { action: string; resource: string; feed_id?: string; user_id?: string } = { resource, action };
  if (options.feedId) payload.feed_id = options.feedId;
  if (options.userId) payload.user_id = options.userId;

  return jwt.sign(payload, apiSecret, { algorithm: 'HS256', noTimestamp });
}

/**
 * Creates the JWT token that can be used for a UserSession
 * @method JWTUserSessionToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string} userId - The user_id key in the JWT payload
 * @param {object} [extraData] - Extra that should be part of the JWT token
 * @param {object} [jwtOptions] - Options that can be past to jwt.sign
 * @return {string} JWT Token
 */
export function JWTUserSessionToken(
  apiSecret: string,
  userId: string,
  extraData: Record<string, unknown> = {},
  jwtOptions: SignOptions = {},
) {
  if (typeof userId !== 'string') {
    throw new TypeError('userId should be a string');
  }

  const payload = { user_id: userId, ...extraData };

  const opts: SignOptions = { algorithm: 'HS256', noTimestamp: true, ...jwtOptions };
  return jwt.sign(payload, apiSecret, opts);
}
