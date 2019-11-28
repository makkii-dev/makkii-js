import * as bip39 from 'bip39';
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware'
import KEYSTORE from './lib_keystore';
import { AionUnsignedTx } from './type';

export default class AionKeystoreClient implements IsingleKeystoreClient {
  ledgerSupport: boolean = true;

  signTransaction = (tx: AionUnsignedTx, signer: IkeystoreSigner, signerParams: any) => {
    return signer.signTransaction(tx, signerParams);
  }

  getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
    return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
  }

  getAccountFromHardware = (index: number, hardware: IHardware) => {
    return hardware.getAccount(index)
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

  recoverKeyPairByWIF = (WIF: string, options?: any) => {
    throw new Error('[AION] recoverKeyPairByWIF not implemented.');
  }

  recoverKeyPairByKeyFile = (file: string, password: string) => {
    return KEYSTORE.fromV3(file, password);
  }

  validatePrivateKey = (privateKey: string | Buffer) => {
    try {
      return KEYSTORE.validatePrivateKey(privateKey);
    } catch (e) {
      return false;
    }
  }

  validateAddress = (address: string) => {
    return KEYSTORE.validateAddress(address);
  }


}
