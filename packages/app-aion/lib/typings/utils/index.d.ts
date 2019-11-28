declare const crypto: any;
declare function hmacSha512(key: any, str: any): any;
declare const longToByteArray: (long: any) => number[];
declare function ab2str(buf: any): any;
export { hmacSha512, longToByteArray, crypto, ab2str };
