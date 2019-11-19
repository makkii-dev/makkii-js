import * as bip39 from 'bip39';
import { keystoreClient } from './interfaces/keystoreClient';
import KEYSTORE from './keystore';

export default class TronKeystoreClient implements keystoreClient {
    mnemonic: string = '';

    constructor() {
        this.mnemonic = '';
    }

    signTransaction = (tx: any) => {
        return KEYSTORE.signTransaction(tx);
    }

    getKey = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic)) {
            throw new Error('set mnemonic first')
        }
        return KEYSTORE.getKeyFromMnemonic(this.mnemonic, address_index);
    }

    setMnemonic = (mnemonic: string, passphrase?: string) => {
        this.mnemonic = mnemonic;
    }

    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    }

    recoverKeyPairByPrivateKey = (priKey: string, options?: any) => {
        try {
            const keyPair = KEYSTORE.keyPair(priKey);
            const {
                privateKey, publicKey, address, ...reset
            } = keyPair;
            return Promise.resolve({
                private_key: privateKey, public_key: publicKey, address, ...reset,
            });
        } catch (e) {
            return Promise.reject(new Error(`recover privKey failed: ${e}`));
        }
    }

    recoverKeyPairByWIF = (WIF: string, options?: any) => {
        throw new Error("[tron] recoverKeyPairByWIF not implemented.");
    }

    recoverKeyPairBykeyFile = (file: string, password: string) => {
        throw new Error("[tron] recoverKeyPairBykeyFile not implemented.");
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[tron] validatePrivateKey not implemented.");
    }

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    }

    getKeyFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getKeyFromMnemonic(mnemonic, address_index);
    }


}