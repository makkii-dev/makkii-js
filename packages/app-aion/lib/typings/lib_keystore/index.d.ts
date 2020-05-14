/// <reference types="node" />
import { getAccountFromMnemonic } from "./hdkey";
import { toV3 } from "./keyfile";
declare const _default: {
    getAccountFromMnemonic: typeof getAccountFromMnemonic;
    keyPair: (priKey: any) => {
        privateKey: string;
        publicKey: string;
        address: string;
        sign: (digest: any) => Buffer;
    };
    validateAddress: (address: any) => boolean;
    fromV3: (input: any, password: any) => Promise<unknown>;
    toV3: typeof toV3;
    validatePrivateKey: (priKey: any) => any;
};
export default _default;
