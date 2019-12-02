/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import { BtcUnsignedTx, BtcrecoverOptions, BtcKeypair } from './type';
export default class BtcKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean;
    network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST';
    constructor(network: 'BTC' | 'BTCTEST' | 'LTC' | 'LTCTEST');
    getCurrentNetwork: () => "BTC" | "BTCTEST" | "LTC" | "LTCTEST";
    checkLedgerSupport: () => boolean;
    signTransaction: (tx: BtcUnsignedTx, signer: IkeystoreSigner, signerParam: any) => Promise<any>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string, options?: BtcrecoverOptions) => Promise<BtcKeypair>;
    recoverKeyPairByWIF: (WIF: string, options?: BtcrecoverOptions) => Promise<BtcKeypair>;
    validatePrivateKey: (privateKey: string | Buffer) => never;
    validateAddress: (address: string) => boolean;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<BtcKeypair>;
    getAccountFromHardware: (index: number, hardware: IHardware) => Promise<import("@makkii/makkii-core/src/type").LedgerKeypair>;
}
