import { keyPair, keyPairFromWIF } from './keypair';
import { validateAddress } from './address';
import { getAccountFromMnemonic } from './hdkey';

export default {
  keyPair,
  validateAddress,
  getAccountFromMnemonic,
  keyPairFromWIF
};
