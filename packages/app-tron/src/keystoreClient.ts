import * as bip39 from 'bip39';
import { keystoreClient } from './interfaces/keystoreClient';
import KEYSTORE from './keystore';

export default class TronKeystoreClient implements keystoreClient {
    mnemonic: string = '';

    constructor() {
        this.mnemonic = '';
    }

    signTransaction(tx: any): Promise<any> {
        return KEYSTORE.signTransaction(tx);
    }

    getKey(address_index: number): Promise<any> {
        if (!bip39.validateMnemonic(this.mnemonic)) {
            throw new Error('set mnemonic first')
        }
        return KEYSTORE.getKeyFromMnemonic(this.mnemonic, address_index);
    }

    setMnemonic(mnemonic: string, passphrase?: string): void {
        this.mnemonic = mnemonic;
    }

    generateMnemonic(): string {
        const mnemonic = bip39.generateMnemonic();
        this.mnemonic = mnemonic;
        return mnemonic;
    }

    recoverKeyPairByPrivateKey(priKey: string, options?: any): Promise<any> {
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

    recoverKeyPairByWIF(WIF: string, options?: any): Promise<any> {
        throw new Error("[tron] recoverKeyPairByWIF not implemented.");
    }

    recoverKeyPairBykeyFile(file: string, password: string): Promise<any> {
        throw new Error("[tron] recoverKeyPairBykeyFile not implemented.");
    }

    validatePrivateKey(privateKey: string | Buffer): boolean {
        throw new Error("[tron] validatePrivateKey not implemented.");
    }

    validateAddress(address: string): Promise<any> {
        return KEYSTORE.validateAddress(address);
    }

    getKeyFromMnemonic(address_index: number, mnemonic: string): Promise<any> {
        return KEYSTORE.getKeyFromMnemonic(mnemonic, address_index);
    }


}