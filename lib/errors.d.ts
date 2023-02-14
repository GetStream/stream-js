import { AxiosResponse } from 'axios';
/**
 * Abstract error object
 * @class ErrorAbstract
 * @access private
 * @param  {string}      [msg]         Error message
 */
declare class ErrorAbstract extends Error {
    message: string;
    constructor(msg: string);
}
/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
export declare class FeedError extends ErrorAbstract {
}
/**
 * SiteError
 * @class SiteError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string}  [msg]  An error message that will probably end up in a log.
 */
export declare class SiteError extends ErrorAbstract {
}
/**
 * MissingSchemaError
 * @method MissingSchemaError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 */
export declare class MissingSchemaError extends ErrorAbstract {
}
/**
 * StreamApiError
 * @method StreamApiError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 * @param  {object} data
 * @param  {object} response
 */
export declare class StreamApiError<T> extends ErrorAbstract {
    error: unknown;
    response: AxiosResponse<T>;
    constructor(msg: string, data: unknown, response: AxiosResponse<T>);
}
export {};
//# sourceMappingURL=errors.d.ts.map