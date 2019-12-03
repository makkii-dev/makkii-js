import * as bip39 from "bip39";
import {
    IsingleKeystoreClient,
    IkeystoreSigner
} from "@makkii/makkii-core/src/interfaces/keystore_client";
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import { LedgerKeypair, Keypair } from "@makkii/makkii-core/src/type/index";
import KEYSTORE from "./lib_keystore";
import { EthUnsignedTx } from "./type";

/**
 * Ethereum keystore client that implements IsingleKeystoreClient
 */
export default class EthKeystoreClient implements IsingleKeystoreClient {
    ledgerSupport: boolean = true;

    signTransaction = (
        tx: EthUnsignedTx,
        signer: IkeystoreSigner,
        signerParam: any
    ) => {
        return signer.signTransaction(tx, signerParam);
    };

    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    };

    recoverKeyPairByPrivateKey = (
        priKey: string,
        options?: any
    ): Promise<Keypair> => {
        try {
            const keyPair = KEYSTORE.keyPair(priKey);
            const { privateKey, publicKey, address, ...reset } = keyPair;
            return Promise.resolve({
                private_key: privateKey,
                public_key: publicKey,
                address,
                ...reset
            });
        } catch (e) {
            return Promise.reject(new Error(`recover privKey failed: ${e}`));
        }
    };

    /**
     * throws not implemented error
     */
    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[eth] validatePrivateKey not implemented.");
    };

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    };

    /**
     * Get account from mnemonic
     *
     * @param address_index index in hd wallet
     * @param mnemonic mnemonic phrase
     * @returns account object: { private_key: '', public_key: '', address: '', index: '' }
     */
    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
    };

    getAccountFromHardware = (
        address_index: number,
        hardware: IHardware
    ): Promise<LedgerKeypair> => {
        return hardware.getAccount(address_index);
    };
}
