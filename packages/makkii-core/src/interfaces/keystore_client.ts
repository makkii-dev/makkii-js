import { SignedTx } from "../type";
import { IHardware } from "./hardware";

/**
 * Interface that handle key store operations.
 *
 * @category Keystore
 */
export interface IsingleKeystoreClient {
    /**
     * Sign transaction.
     *
     * @param tx transaction object
     * @param signer singer that implement [[IkeystoreSigner]] interface
     * @param signerParams sign parameters
     * @returns signed transaction
     */
    signTransaction(
        tx: any,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<any>;

    /**
     * Randomly generate 12 words mnemonic.
     *
     * @returns 12 words mnemonic
     */
    generateMnemonic(): string;

    /**
     * Get specified account from mnemonic phrase
     *
     * @param address_index address index in hierachy determinist wallet
     * @param mnemonic mnemonic phrase
     * @returns account
     */
    getAccountFromMnemonic(
        address_index: number,
        mnemonic: string
    ): Promise<any>;

    /**
     * Get account from hardware wallet.
     *
     * @param index indexPath in hardwallet wallet
     * @param hardware harware wallet that implements IHardware interface
     * @returns account
     */
    getAccountFromHardware(index: number, hardware: IHardware): Promise<any>;

    /**
     * Recover account from private key.
     *
     * @param priKey private key
     * @param options options that affect recovery algorithm
     * @returns key pair
     */
    recoverKeyPairByPrivateKey(priKey: string, options?: any): Promise<any>;

    /**
     * Check if private key is valid.
     *
     * @param privateKey private key
     * @returns if private key is valid
     */
    validatePrivateKey(privateKey: string | Buffer): boolean;

    /**
     * Check if address is valid.
     *
     * @param address address to validate
     * @return  if address is valid.
     */
    validateAddress(address: string): boolean;
}

/**
 * Interface for sign transaction.
 *
 * @category Keystore
 */
export interface IkeystoreSigner {
    /**
     * Sign transaction.
     *
     * @param tx transaction object to sign
     * @param params sign parameters such as private key or index path
     * @returns signed transaction
     */
    signTransaction(tx: any, params: any): Promise<SignedTx>;
}

/**
 * Keystore interface that manages multiple keystore clients and expose all functions.
 *
 * @category Keystore
 */
export interface IkeystoreClient {
    /**
     * Register keystore client.
     *
     * @param coinType a key name for the added keystore client, you will specify the coinType for other operations.
     */
    addCoin(coinType: string, client: IsingleKeystoreClient): void;

    /**
     * Remove a registered keystore client
     *
     * @param coinType keystore client key name
     * @returns if remoe keystore client successfully.
     */
    removeCoin(coinType: string): boolean;

    /**
     * Sign transaction.
     *
     * @param coinType coin type name you specified in addCoin
     * @param tx transaction object to sign
     * @param signer signer that implement [[IkeystoreSigner]] interface
     * @param signerParams sign parameters
     * @returns signed transaction
     */
    signTransaction(
        coinType: string,
        tx: any,
        signer: IkeystoreSigner,
        signerParams: any
    ): Promise<any>;

    /**
     * Randomly generate 12 words mnemonic phrases.
     *
     * @param coinType coin type name you specified in addCoin
     * @returns 12 words mnemonic phrases
     */
    generateMnemonic(coinType: string): string;

    /**
     * Recover key pair from private key
     *
     * @param coinType coin type name you specified in addCoin
     * @param priKey private key
     * @param options options required by recovery algorithm
     * @returns recovered account
     */
    recoverKeyPairByPrivateKey(
        coinType: string,
        priKey: string,
        options?: any
    ): Promise<any>;

    /**
     * Check if private key is valid.
     *
     * @param coinType coin type name you specified in addCoin
     * @param privateKey private key
     * @returns if private key is valid.
     */
    validatePrivateKey(coinType: string, privateKey: string | Buffer): boolean;

    /**
     * Check if an address is valid
     *
     * @param coinType coin type name you specified in addCoin
     * @param address address to be validated
     * @returns if an address is valid.
     */
    validateAddress(coinType: string, address: string): boolean;

    /**
     * Get specified account from mnemonic phrase
     *
     * @param coinType coin type name you specified in addCoin
     * @param address_index address index in hierachy determinist wallet
     * @param mnemonic mnemonic phrase
     * @returns account
     */
    getAccountFromMnemonic(
        coinType: string,
        ddress_index: number,
        mnemonic: string
    ): Promise<any>;

    /**
     * Get account from hardware wallet.
     *
     * @param coinType coin type name you specified in addCoin
     * @param index indexPath in hardwallet wallet
     * @param hardware harware wallet that implements IHardware interface
     * @returns account
     */
    getAccountFromHardware(
        coinType: string,
        index: number,
        hardware: IHardware
    ): Promise<any>;
}
