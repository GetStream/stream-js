/// <reference types="node" />
import FormData from 'form-data';
declare function validateFeedSlug(feedSlug: string): string;
declare function validateUserId(userId: string): string;
declare function rfc3986(str: string): string;
declare function isReadableStream(obj: unknown): obj is NodeJS.ReadStream;
declare function validateFeedId(feedId: string): string;
declare function addFileToFormData(uri: string | File | Buffer | NodeJS.ReadStream, name?: string, contentType?: string): FormData;
declare function replaceStreamObjects<T, V>(obj: T): V;
declare const _default: {
    validateFeedId: typeof validateFeedId;
    validateFeedSlug: typeof validateFeedSlug;
    validateUserId: typeof validateUserId;
    rfc3986: typeof rfc3986;
    isReadableStream: typeof isReadableStream;
    addFileToFormData: typeof addFileToFormData;
    replaceStreamObjects: typeof replaceStreamObjects;
};
export default _default;
//# sourceMappingURL=utils.d.ts.map