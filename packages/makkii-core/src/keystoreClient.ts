import { IkeystoreClient, IsingleKeystoreClient, IsingleKeystoreFullClient } from './interfaces/keystoreClient';


function isIntanceOfKeystoreClient(client: object) {
    const map = [
        "signTransaction",
        "getKey",
        "setMnemonic",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "recoverKeyPairByWIF",
        "recoverKeyPairBykeyFile",
        "validatePrivateKey",
        "validateAddress",
        "getKeyFromMnemonic",
    ];
    return !map.some(i => !(i in client));
}


export default class KeystoreClient implements IkeystoreClient {


    coins: { [coin: string]: IsingleKeystoreClient | IsingleKeystoreFullClient } = {};

    addCoin = (coinType: string, client: IsingleKeystoreClient | IsingleKeystoreFullClient) => {
        if (!isIntanceOfKeystoreClient(client)) {
            throw new Error('not a keystore client!');
        }
        this.coins[coinType.toLowerCase()] = client;
    }

    removeCoin = (coinType: string) => {
        if (this.coins[coinType.toLowerCase()]) {
            delete this.coins[coinType.toLowerCase()]
            return true;
        }
        return false;
    }

    getCoin = (coinType: string) => {
        const coin = this.coins[coinType.toLowerCase()];
        if (!coin) {
            throw new Error(`coin: [${coinType}] is not init or unsupported.`)
        }
        return coin;
    }

    signTransaction = (coinType: string, tx: any) => {
        const coin = this.getCoin(coinType);
        return coin.signTransaction(tx);
    }

    getKey = (coinType: string, address_index: number) => {
        const coin = this.getCoin(coinType);
        return coin.getKey(address_index);
    }

    setMnemonic = (coinType: string, mnemonic: string, passphrase?: string) => {
        const coin = this.getCoin(coinType);
        return coin.setMnemonic(mnemonic, passphrase);
    }

    generateMnemonic = (coinType: string) => {
        const coin = this.getCoin(coinType);
        return coin.generateMnemonic();
    }

    recoverKeyPairByPrivateKey = (coinType: string, priKey: string, options?: any) => {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByPrivateKey(priKey, options);
    }

    recoverKeyPairByWIF = (coinType: string, WIF: string, options?: any) => {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByWIF(WIF, options);
    }

    recoverKeyPairBykeyFile = (coinType: string, file: string, password: string) => {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairBykeyFile(file, password);
    }

    validatePrivateKey = (coinType: string, privateKey: string | Buffer) => {
        const coin = this.getCoin(coinType);
        return coin.validatePrivateKey(privateKey);
    }

    validateAddress = (coinType: string, address: string) => {
        const coin = this.getCoin(coinType);
        return coin.validateAddress(address);
    }

    getKeyFromMnemonic = (coinType: string, ddress_index: number, mnemonic: string) => {
        const coin = this.getCoin(coinType);
        return coin.getKeyFromMnemonic(ddress_index, mnemonic);
    }

    getKeyByLedger = (coinType: string, index: number) => {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getKeyByLedger(index);
        }
        throw new Error(`[${coinType}] getKeyByLedger is not implemented.`)
    }

    signByLedger = (coinType: string, index: number, sender: string, msg: Buffer) => {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.signByLedger(index, sender, msg);
        }
        throw new Error(`[${coinType}] signByLedger is not implemented.`)
    }

    setLedgerTransport = (coinType: string, transport: any) => {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.setLedgerTransport(transport);
        }
        throw new Error(`[${coinType}] setLedgerTransport is not implemented.`)
    }

    getLedgerStatus = (coinType: string) => {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getLedgerStatus();
        }
        throw new Error(`[${coinType}] getLedgerStatus is not implemented.`)
    }


}