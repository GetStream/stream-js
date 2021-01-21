import jwt, { SignOptions } from 'jsonwebtoken';

// for a claim in jwt
function joinClaimValue(items: string | string[]): string {
  const values = Array.isArray(items) ? items : [items];
  const claims = [];
  for (let i = 0; i < values.length; i += 1) {
    const s = values[i].trim();
    if (s === '*') return s;
    claims.push(s);
  }
  return claims.join(',');
}

/**
 * Creates the JWT token for feedId, resource and action using the apiSecret
 * @method JWTScopeToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string | string[]} resource - JWT payload resource
 * @param {string | string[]} action - JWT payload action
 * @param {object} [options] - Optional additional options
 * @param {string | string[]} [options.feedId] - JWT payload feed identifier
 * @param {string} [options.userId] - JWT payload user identifier
 * @param {boolean} [options.expireTokens] - JWT noTimestamp
 * @return {string} JWT Token
 */
export function JWTScopeToken(
  apiSecret: string,
  resource: string | string[],
  action: string | string[],
  options: { expireTokens?: boolean; feedId?: string | string[]; userId?: string } = {},
) {
  const noTimestamp = options.expireTokens ? !options.expireTokens : true;
  const payload: { action: string; resource: string; feed_id?: string; user_id?: string } = {
    resource: joinClaimValue(resource),
    action: joinClaimValue(action),
  };
  if (options.feedId) payload.feed_id = joinClaimValue(options.feedId);
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
