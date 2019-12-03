import * as bip39 from 'bip39';
import { IsingleKeystoreClient, IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client'
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware'
import KEYSTORE from './lib_keystore';
import { AionUnsignedTx } from './type';

/**
 * Aion keystore client that implements IsingleKeystoreClient interface
 */
export default class AionKeystoreClient implements IsingleKeystoreClient {
  ledgerSupport: boolean = true;

  signTransaction = (tx: AionUnsignedTx, signer: IkeystoreSigner, signerParams: any) => {
    return signer.signTransaction(tx, signerParams);
  }

  /**
   * Get account from mnemonic
   * 
   * @param address_index index in hd wallet
   * @param mnemonic mnemonic phrase
   * @returns account object: { private_key: '', public_key: '', address: '', index: '' }
   */
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

  /**
   * Recover key pair by private key
   * 
   * @param privKey private key
   * @returns key pair object: { private_key: '', public_key: '', address: '' }
   */
  recoverKeyPairByPrivateKey = (priKey: string) => {
    try {
      const keyPair = KEYSTORE.keyPair(priKey);
      const {
        privateKey, publicKey, address, ...rest
      } = keyPair;
      return Promise.resolve({
        private_key: privateKey, public_key: publicKey, address, ...rest,
      });
    } catch (e) {
      return Promise.reject(new Error(`recover privKey failed: ${e}`));
    }
  }

  /**
   * Recover key pair by key file
   * 
   * @param file file content
   * @param password protection password
   * @returns key pair object: { private_key: '', public_key: '', address: '' }
   */
  recoverKeyPairByKeyFile = (file: string, password: string) => {
    return KEYSTORE.fromV3(file, password);
  }

  /**
   * Check if private key is valid
   * 
   * @param privateKey string or Buffer
   * @returns if private key is valid
   */
  validatePrivateKey = (privateKey: string | Buffer) => {
    try {
      return KEYSTORE.validatePrivateKey(privateKey);
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if address is valid
   * 
   * @param address address to be validated
   */
  validateAddress = (address: string) => {
    return KEYSTORE.validateAddress(address);
  }


}
