/// <reference types="node" />
import { IkeystoreClient, IsingleKeystoreClient, IkeystoreSigner } from "./interfaces/keystore_client";
import { IHardware } from "./interfaces/hardware";
export default class KeystoreClient implements IkeystoreClient {
    coins: {
        [coin: string]: IsingleKeystoreClient;
    };
    addCoin: (coinType: string, client: IsingleKeystoreClient) => void;
    removeCoin: (coinType: string) => boolean;
    getCoin: (coinType: string) => IsingleKeystoreClient;
    signTransaction: <T extends IkeystoreSigner>(coinType: string, tx: any, signer: T, signerParams: any) => Promise<any>;
    generateMnemonic: (coinType: string) => string;
    recoverKeyPairByPrivateKey: (coinType: string, priKey: string, options?: any) => Promise<any>;
    validatePrivateKey: (coinType: string, privateKey: string | Buffer) => boolean;
    validateAddress: (coinType: string, address: string) => boolean;
    getAccountFromMnemonic: (coinType: string, ddress_index: number, mnemonic: string) => Promise<any>;
    getAccountFromHardware: (coinType: string, index: number, hardware: IHardware) => Promise<any>;
}
