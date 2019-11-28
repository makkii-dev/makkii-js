/// <reference types="node" />
export declare const keyPair: (priKey: any, options: any) => {
    privateKey: string;
    publicKey: string;
    address: string;
    sign: (hash: any) => Buffer;
    toWIF: () => string;
};
export declare const keyPairFromWIF: (WIF: any, options: any) => {
    privateKey: string;
    publicKey: string;
    address: string;
    sign: (hash: any) => Buffer;
    toWIF: () => string;
    compressed: boolean;
};
