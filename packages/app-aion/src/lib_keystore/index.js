import { getAccountFromMnemonic } from './hdkey';
import { keyPair, validatePrivateKey } from './keyPair';
import { validateAddress } from './address';
import { signTransaction } from './transaction';
import {
  getAccountByLedger, initWallet, getWalletStatus, signByLedger,
} from './ledger';
import { fromV3, toV3 } from './keyfile';

export default {
  getAccountFromMnemonic,
  keyPair,
  validateAddress,
  signTransaction,
  getAccountByLedger,
  fromV3,
  toV3,
  initWallet,
  validatePrivateKey,
  getWalletStatus,
  signByLedger,
};
