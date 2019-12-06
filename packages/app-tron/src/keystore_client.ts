import * as bip39 from "bip39";
import {
    IsingleKeystoreClient,
    IkeystoreSigner
} from "@makkii/makkii-core/src/interfaces/keystore_client";
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import KEYSTORE from "./lib_keystore";
import { TronUnsignedTx, TronKeypair } from "./type";

/**
 * @category Keystore Client
 */
export default class TronKeystoreClient implements IsingleKeystoreClient {
    /**
     * Sign transaction by signer
     * @param unsignedTx unsigned transaction build by buildTransaction
     * @param signer localSigner or hardware
     * @param signerParam localSigner: {private_key} hardware:{derivationIndex}
     * @returns encoded transaction
     */
    signTransaction = <T extends IkeystoreSigner>(
        tx: TronUnsignedTx,
        signer: T,
        signerParam: any
    ): Promise<any> => {
        return signer.signTransaction(tx, signerParam);
    };

    /**
     * Generate mnemonic by bip39
     * @returns {string} 12 length of mnemonic
     */
    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    };

    /**
     * Recover key pair by private key
     * @param priKey
     */
    recoverKeyPairByPrivateKey = (priKey: string): Promise<TronKeypair> => {
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
     * Validate private key
     *
     * not implemented
     */
    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[tron] validatePrivateKey not implemented.");
    };

    /**
     * Validate address
     * @returns {boolean}
     */
    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    };

    /**
     * Get account from mnemonic
     *
     * @param address_index bip39 path index
     * @param mnemonic
     *
     */
    getAccountFromMnemonic = (
        address_index: number,
        mnemonic: string
    ): Promise<TronKeypair> => {
        return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
    };

    /**
     * Get account from hardware
     *
     * not implemented
     */
    getAccountFromHardware = (_address_index: number, hardware: IHardware) => {
        throw new Error("[tron] getAccountFromHardware not implemented.");
    };
}
