/// <reference types="node" />
import { IsingleKeystoreClient, IkeystoreSigner } from "@makkii/makkii-core/src/interfaces/keystore_client";
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { TronUnsignedTx, TronKeypair } from "./type";
export default class TronKeystoreClient implements IsingleKeystoreClient {
    signTransaction: <T extends IkeystoreSigner>(tx: TronUnsignedTx, signer: T, signerParam: any) => Promise<any>;
    generateMnemonic: () => string;
    recoverKeyPairByPrivateKey: (priKey: string) => Promise<TronKeypair>;
    validatePrivateKey: (privateKey: string | Buffer) => never;
    validateAddress: (address: string) => boolean;
    getAccountFromMnemonic: (address_index: number, mnemonic: string) => Promise<TronKeypair>;
    getAccountFromHardware: (_address_index: number, hardware: IHardware) => never;
}
