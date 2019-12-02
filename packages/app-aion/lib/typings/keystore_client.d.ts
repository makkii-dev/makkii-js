/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import { AionUnsignedTx } from './type';
export default class AionKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean;
    signTransaction: (tx: AionUnsignedTx, signer: IkeystoreSigner, signerParams: any) => Promise<any>;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<{
        private_key: string;
        public_key: string;
        address: any;
        index: any;
    }>;
    getAccountFromHardware: (index: number, hardware: IHardware) => Promise<import("@makkii/makkii-core/src/type").LedgerKeypair>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string) => Promise<{
        sign: (digest: any) => Buffer;
        private_key: string;
        public_key: string;
        address: any;
    }>;
    recoverKeyPairByWIF: (WIF: string, options?: any) => never;
    recoverKeyPairByKeyFile: (file: string, password: string) => Promise<unknown>;
    validatePrivateKey: (privateKey: string | Buffer) => any;
    validateAddress: (address: string) => boolean;
}
