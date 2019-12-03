import * as bip39 from "bip39";
import {
    IsingleKeystoreClient,
    IkeystoreSigner
} from "@makkii/makkii-core/src/interfaces/keystore_client";
import { IHardware } from "@makkii/makkii-core/src/interfaces/hardware";
import KYSTORE from "./lib_keystore";
import { BtcUnsignedTx, BtcKeypair } from "./type";

/**
 * @category Keystore Client
 */
export default class BtcKeystoreClient implements IsingleKeystoreClient {
    /**
     * only btc btcTest support ledger
     */
    ledgerSupport: boolean = false;

    network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST";

    constructor(network: "BTC" | "BTCTEST" | "LTC" | "LTCTEST") {
        if (!["BTC", "BTCTEST", "LTC", "LTCTEST"].includes(network)) {
            throw new Error(`BtcKeystoreClient Unsupport network: ${network}`);
        }
        this.network = network;
        if (network.match("BTC")) {
            this.ledgerSupport = true;
        }
    }

    /**
     * Get current network
     * @returns {string} network
     */
    getCurrentNetwork = () => {
        return this.network;
    };

    /**
     * Check ledger support
     * @returns {boolean} if support ledger
     */
    checkLedgerSupport = () => {
        return this.ledgerSupport;
    };

    /**
     * Sign transaction by signer
     * @param unsignedTx unsigned transaction build by buildTransaction
     * @param signer localSigner or hardware
     * @param signerParam localSigner: {private_key, compressed} hardware:{derivationIndex}
     * @returns {string} encoded transaction
     */
    signTransaction = (
        tx: BtcUnsignedTx,
        signer: IkeystoreSigner,
        signerParam: any
    ) => {
        const network = this.getCurrentNetwork();
        return signer.signTransaction(tx, { ...signerParam, network });
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
     * @param options
     * - **compressed** *boolean* whether to compress public key
     */
    recoverKeyPairByPrivateKey = (
        priKey: string,
        options?: any
    ): Promise<BtcKeypair> => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPair(priKey, { network, ...options });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({
                    private_key: privateKey,
                    public_key: publicKey,
                    address,
                    ...reset
                });
            }
            return Promise.reject(
                new Error(`${this.network} recover privKey failed`)
            );
        } catch (e) {
            return Promise.reject(
                new Error(`${this.network} recover privKey failed: ${e}`)
            );
        }
    };

    /**
     * Recover key pair by wif
     *
     * @param wif wif string
     *
     */
    recoverKeyPairByWIF = (WIF: string): Promise<BtcKeypair> => {
        const network = this.getCurrentNetwork();
        try {
            const keyPair = KYSTORE.keyPairFromWIF(WIF, {
                network
            });
            if (keyPair) {
                const { privateKey, publicKey, address, ...reset } = keyPair;
                return Promise.resolve({
                    private_key: privateKey,
                    public_key: publicKey,
                    address,
                    ...reset
                });
            }
            return Promise.reject(
                new Error(`${this.network} recover privKey failed`)
            );
        } catch (e) {
            return Promise.reject(
                new Error(`${this.network} recover privKey failed: ${e}`)
            );
        }
    };

    /**
     * Validate private key
     *
     * not implemented
     */
    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error(`${this.network} validatePrivateKey not implemented.`);
    };

    /**
     * Validate address
     * @returns {boolean}
     */
    validateAddress = (address: string) => {
        const network = this.getCurrentNetwork();
        return KYSTORE.validateAddress(address, network);
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
    ): Promise<BtcKeypair> => {
        const network = this.getCurrentNetwork();
        return KYSTORE.getAccountFromMnemonic(mnemonic, address_index, {
            network
        });
    };

    /**
     * Get account from hardware
     *
     * @param index derivation index
     * @param hardware
     *
     */
    getAccountFromHardware = (index: number, hardware: IHardware) => {
        if (!this.checkLedgerSupport()) {
            throw new Error(
                `${this.network} getAccountFromHardware not implemented.`
            );
        }
        const network = this.getCurrentNetwork();
        return hardware.getAccount(index, { network });
    };
}
