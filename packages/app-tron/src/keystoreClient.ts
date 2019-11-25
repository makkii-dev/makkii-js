import * as bip39 from 'bip39';
import { IsingleKeystoreClient } from '@makkii/makkii-core/src/interfaces/keystoreClient'
import KEYSTORE from './lib_keystore';

export default class TronKeystoreClient implements IsingleKeystoreClient {
    mnemonic: string = '';

    constructor() {
        this.mnemonic = '';
    }

    signTransaction = (tx: any) => {
        return KEYSTORE.signTransaction(tx);
    }

    getAccount = (address_index: number) => {
        if (!bip39.validateMnemonic(this.mnemonic)) {
            throw new Error('set mnemonic first')
        }
        return KEYSTORE.getAccountFromMnemonic(this.mnemonic, address_index);
    }

    setMnemonic = (mnemonic: string) => {
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

    recoverKeyPairByKeyFile = (file: string, password: string) => {
        throw new Error("[tron] recoverKeyPairByKeyFile not implemented.");
    }

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[tron] validatePrivateKey not implemented.");
    }

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    }

    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
    }


}