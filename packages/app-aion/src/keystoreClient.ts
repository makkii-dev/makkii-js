import * as bip39 from 'bip39';
import KEYSTORE from './keystore';
import { keystoreClient, keystoreLedgerClient } from './interfaces/keystoreClient';

export default class AionKeystoreClient implements keystoreClient, keystoreLedgerClient {
  ledgerSupport: boolean = true;

  mnemonic: string;

  constructor() {
    this.mnemonic = '';
  }

  signTransaction = (tx: any) => {
    return KEYSTORE.signTransaction(tx);
  }

  getKey = (address_index: number) => {
    if (!bip39.validateMnemonic(this.mnemonic))
      throw new Error('Set Mnemonic first');
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
    throw new Error('[AION] recoverKeyPairByWIF not implemented.');
  }

  recoverKeyPairBykeyFile = (file: string, password: string) => {
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

  getKeyFromMnemonic = (address_index: number, mnemonic: string) => {
    return KEYSTORE.getKeyFromMnemonic(mnemonic, address_index);
  }

  getKeyByLedger = (index: number) => {
    if (!this.getLedgerStatus()) {
      throw new Error('ledger is not available')
    }
    return KEYSTORE.getKeyByLedger(index);
  }

  signByLedger = (index: number, sender: string, msg: Buffer) => {
    if (!this.getLedgerStatus()) {
      throw new Error('ledger is not available')
    }
    return KEYSTORE.signByLedger(index, sender, msg);
  }

  setLedgerTransport = (transport: any) => {
    KEYSTORE.initWallet(transport);
  }

  getLedgerStatus = () => {
    return KEYSTORE.getWalletStatus();
  }
}
