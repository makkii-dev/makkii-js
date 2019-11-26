import { IkeystoreClient, IsingleKeystoreClient, IsingleKeystoreFullClient } from './interfaces/keystore_client';


function isIntanceOfKeystoreClient(client: object) {
    const map = [
        "signTransaction",
        "getAccount",
        "setMnemonic",
        "generateMnemonic",
        "recoverKeyPairByPrivateKey",
        "recoverKeyPairByWIF",
        "recoverKeyPairByKeyFile",
        "validatePrivateKey",
        "validateAddress",
        "getAccountFromMnemonic",
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

    getAccount = (coinType: string, address_index: number) => {
        const coin = this.getCoin(coinType);
        return coin.getAccount(address_index);
    }

    setMnemonic = (coinType: string, mnemonic: string) => {
        const coin = this.getCoin(coinType);
        return coin.setMnemonic(mnemonic);
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

    recoverKeyPairByKeyFile = (coinType: string, file: string, password: string) => {
        const coin = this.getCoin(coinType);
        return coin.recoverKeyPairByKeyFile(file, password);
    }

    validatePrivateKey = (coinType: string, privateKey: string | Buffer) => {
        const coin = this.getCoin(coinType);
        return coin.validatePrivateKey(privateKey);
    }

    validateAddress = (coinType: string, address: string) => {
        const coin = this.getCoin(coinType);
        return coin.validateAddress(address);
    }

    getAccountFromMnemonic = (coinType: string, ddress_index: number, mnemonic: string) => {
        const coin = this.getCoin(coinType);
        return coin.getAccountFromMnemonic(ddress_index, mnemonic);
    }

    getAccountByLedger = (coinType: string, index: number) => {
        const coin = this.getCoin(coinType);
        if ('ledgerSupport' in coin && !!coin.ledgerSupport) {
            return coin.getAccountByLedger(index);
        }
        throw new Error(`[${coinType}] getAccountByLedger is not implemented.`)
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