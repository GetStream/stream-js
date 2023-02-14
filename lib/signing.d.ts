import { SignOptions } from 'jsonwebtoken';
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
export declare function JWTScopeToken(apiSecret: string, resource: string | string[], action: string | string[], options?: {
    expireTokens?: boolean;
    feedId?: string | string[];
    userId?: string;
}): string;
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
export declare function JWTUserSessionToken(apiSecret: string, userId: string, extraData?: Record<string, unknown>, jwtOptions?: SignOptions): string;
//# sourceMappingURL=signing.d.ts.map