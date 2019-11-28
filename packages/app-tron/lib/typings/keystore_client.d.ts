/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import { TronUnsignedTx } from './type';
export default class TronKeystoreClient implements IsingleKeystoreClient {
    signTransaction: (tx: TronUnsignedTx, signer: IkeystoreSigner, signerParam: any) => Promise<any>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string) => Promise<{
        sign: (hash: any) => any;
        private_key: any;
        public_key: string;
        address: string;
    }>;
    validatePrivateKey: (privateKey: string | Buffer) => never;
    validateAddress: (address: string) => boolean;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<{
        private_key: any;
        public_key: string;
        address: string;
        index: any;
    }>;
    getAccountFromHardware: (address_index: number, hardware: IHardware) => never;
}
