import {
    IkeystoreClient,
    IsingleKeystoreClient,
    IkeystoreSigner
} from "./interfaces/keystore_client";
import { IHardware } from "./interfaces/hardware";

function isInstanceOfKeystoreClient(client: object) {
    const map = [
        "signTransaction",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "validatePrivateKey",
        "validateAddress",
        "getAccountFromMnemonic",
        "getAccountFromHardware"
    ];
    return !map.some(i => !(i in client));
}

/**
 * @category Keystore Client
 */
export default class KeystoreClient implements IkeystoreClient {
    coins: { [coin: string]: IsingleKeystoreClient } = {};

    addCoin = (coinType: string, client: IsingleKeystoreClient) => {
        if (!isInstanceOfKeystoreClient(client)) {
            throw new Error("not a keystore client!");
        }
        this.coins[coinType.toLowerCase()] = client;
    };

    removeCoin = (coinType: string) => {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()];
            return true;
        }
        return false;
    };

    getCoin = (coinType: string) => {
        const coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error(`coin: [${coinType}] is not init or unsupported.`);
        }
        return coin;
    };

    signTransaction = <T extends IkeystoreSigner>(
        coinType: string,
        tx: any,
        signer: T,
        signerParams: any
    ) => {
        const coin = this.getCoin(coinType);
        return coin.signTransaction(tx, signer, signerParams);
    };

    generateMnemonic = (coinType: string) => {
        const coin = this.getCoin(coinType);
        return coin.generateMnemonic();
    };

    recoverKeyPairByPrivateKey = (
        coinType: string,
        priKey: string,
        options?: any
    ) => {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByPrivateKey(priKey, options);
    };

    validatePrivateKey = (coinType: string, privateKey: string | Buffer) => {
        const coin = this.getCoin(coinType);
        return coin.validatePrivateKey(privateKey);
    };

    validateAddress = (coinType: string, address: string) => {
        const coin = this.getCoin(coinType);
        return coin.validateAddress(address);
    };

    getAccountFromMnemonic = (
        coinType: string,
        ddress_index: number,
        mnemonic: string
    ) => {
        const coin = this.getCoin(coinType);
        return coin.getAccountFromMnemonic(ddress_index, mnemonic);
    };

    getAccountFromHardware = (
        coinType: string,
        index: number,
        hardware: IHardware
    ) => {
        const coin = this.getCoin(coinType);
        return coin.getAccountFromHardware(index, hardware);
    };
}
