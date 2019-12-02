/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
export default class BtcKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean;
    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST';
    constructor(network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST');
    getCurrentNetwork: () => "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    checkLedgerSupport: () => boolean;
    signTransaction: (tx: any, signer: IkeystoreSigner, signerParam: any) => Promise<any>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string, options?: any) => Promise<{
        sign: (hash: any) => Buffer;
        toWIF: () => string;
        private_key: string;
        public_key: string;
        address: string;
    }>;
    recoverKeyPairByWIF: (WIF: string, options?: any) => Promise<{
        sign: (hash: any) => Buffer;
        toWIF: () => string;
        compressed: boolean;
        private_key: string;
        public_key: string;
        address: string;
    }>;
    validatePrivateKey: (privateKey: string | Buffer) => never;
    validateAddress: (address: string) => boolean;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<{
        private_key: string;
        public_key: string;
        address: string;
        index: any;
    }>;
    getAccountFromHardware: (index: number, hardware: IHardware) => Promise<import("@makkii/makkii-core/src/type").LedgerKeypair>;
}
