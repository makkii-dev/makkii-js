/// <reference types="node" />
export declare type Arrayish = string | ArrayLike<number>;
declare function appendHexStart(str: string): string;
declare function hexStringToInt(str: string): number;
declare function hexToAscii(hex: string): string;
declare function stripZeroXHexString(str: string): string;
declare function isHex(val: string): boolean;
declare function removeLeadingZeroX(val: string): string;
declare function hexString2Array(str: string): any[];
declare function padZeros(arr_: Arrayish, len: number): Buffer;
declare function arrayify(arr: Arrayish): Buffer;
declare function toHex(value: any): string;
export { arrayify, toHex, padZeros, appendHexStart, hexStringToInt, hexToAscii, stripZeroXHexString, isHex, removeLeadingZeroX, hexString2Array };
