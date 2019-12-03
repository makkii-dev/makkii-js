/// <reference types="node" />
import { getAccountFromMnemonic } from "./hdkey";
declare const _default: {
    keyPair: (priKey: any, options: any) => {
        privateKey: string;
        publicKey: string;
        address: string;
        sign: (hash: any) => Buffer;
        toWIF: () => string;
    };
    validateAddress: (address: any, network: any) => boolean;
    getAccountFromMnemonic: typeof getAccountFromMnemonic;
    keyPairFromWIF: (WIF: any, options: any) => {
        privateKey: string;
        publicKey: string;
        address: string;
        sign: (hash: any) => Buffer;
        toWIF: () => string;
        compressed: boolean;
    };
};
export default _default;
