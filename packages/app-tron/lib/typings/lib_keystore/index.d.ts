import { getAccountFromMnemonic } from "./hdkey";
declare const _default: {
    getAccountFromMnemonic: typeof getAccountFromMnemonic;
    keyPair: (priKey: any) => {
        privateKey: any;
        publicKey: string;
        address: string;
        sign: (hash: any) => any;
    };
    validateAddress: (address: any) => boolean;
};
export default _default;
