/// <reference types="node" />
declare const AbiCoderAION: {
    encode: (types: string[], values: any[]) => Buffer;
    decode: (buffer_: string | Buffer, types: string[]) => any[];
};
declare const AbiCoderETH: {
    encode: (types: string[], values: any[]) => Buffer;
    decode: (buffer_: string | Buffer, types: string[]) => any[];
};
export { AbiCoderAION, AbiCoderETH };
