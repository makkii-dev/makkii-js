import { keyPair, keyPairFromWIF } from './keypair';
import { validateAddress } from './address';
import { signTransaction } from './transaction';
import { getKeyFromMnemonic } from './hdkey';
import { initWallet, getKeyByLedger, getWalletStatus, signByLedger } from './ledger';

export default {
  keyPair,
  validateAddress,
  signTransaction,
  getKeyFromMnemonic,
  keyPairFromWIF,
  initWallet,
  getKeyByLedger,
  getWalletStatus,
  signByLedger
};
