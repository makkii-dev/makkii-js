import * as bip39 from 'bip39';
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';
import KEYSTORE from './lib_keystore';
import { TronUnsignedTx } from './type';

export default class TronKeystoreClient implements IsingleKeystoreClient {

    signTransaction = (tx: TronUnsignedTx, signer: IkeystoreSigner, signerParam: any) => {
        return signer.signTransaction(tx, signerParam);
    }

    generateMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    }

    recoverKeyPairByPrivateKey = (priKey: string) => {
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

    validatePrivateKey = (privateKey: string | Buffer) => {
        throw new Error("[tron] validatePrivateKey not implemented.");
    }

    validateAddress = (address: string) => {
        return KEYSTORE.validateAddress(address);
    }

    getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
        return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
    }

    getAccountFromHardware = (address_index: number, hardware: IHardware)=>{
        throw new Error("[tron] getAccountFromHardware not implemented.");
    }

}