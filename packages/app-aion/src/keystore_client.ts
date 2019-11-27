import * as bip39 from 'bip39';
import {IsingleKeystoreFullClient} from '@makkii/makkii-core/src/interfaces/keystore_client'
import KEYSTORE from './lib_keystore';

export default class AionKeystoreClient implements IsingleKeystoreFullClient {
  ledgerSupport: boolean = true;

  mnemonic: string;

  constructor() {
    this.mnemonic = '';
  }

  signTransaction = (tx: any) => {
    return KEYSTORE.signTransaction(tx);
  }

  getAccount = (address_index: number) => {
    if (!bip39.validateMnemonic(this.mnemonic))
      throw new Error('Set Mnemonic first');
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

  getAccountFromMnemonic = (address_index: number, mnemonic: string) => {
    return KEYSTORE.getAccountFromMnemonic(mnemonic, address_index);
  }

  getAccountByLedger = (index: number) => {
    return KEYSTORE.getAccountByLedger(index);
  }

  signByLedger = (index: number, sender: string, msg: Buffer) => {
    return KEYSTORE.signByLedger(index, sender, msg);
  }

  setLedgerTransport = (transport: any) => {
    KEYSTORE.initWallet(transport);
  }

  getLedgerStatus = () => {
    return KEYSTORE.getWalletStatus();
  }
}
