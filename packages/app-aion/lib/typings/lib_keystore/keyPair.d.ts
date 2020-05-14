/// <reference types="node" />
export declare const validatePrivateKey: (priKey: any) => any;
export declare const keyPair: (priKey: any) => {
    privateKey: string;
    publicKey: string;
    address: string;
    sign: (digest: any) => Buffer;
};
