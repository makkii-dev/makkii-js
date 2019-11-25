import BigNumber from 'bignumber.js';
import { hexutil } from '../lib_api/node_modules/lib-common-util-js';
import { signByLedger } from './ledger';
import { inputAddressFormatter } from './address';
import { keyPair } from './keyPair';

const blake2b = require('blake2b')
const nacl = require('tweetnacl')
const rlp = require('aion-rlp')
const BN = require('bn.js')
/** *
 *
 * @param transaction
 * {
 *     amount:
 *     nonce:
 *     gasLimit:
 *     gasPrice:
 *     to:
 *     private_key:
 *     timestamp:
 *     data:
 *     extra_param: {type, sender derivationIndex}
 * }
 * @returns {Promise<any> | Promise<*>} {encoded: hex String: signature: hex string}
 */
// eslint-disable-next-line import/prefer-default-export
export const signTransaction = (transaction) => new Promise((resolve, reject) => {
  const { private_key, extra_param } = transaction;
  // format tx
  let tx;
  try {
    tx = txInputFormatter(transaction);
  } catch (e) {
    reject(e);
  }
  const unsignedTransaction = {
    nonce: tx.nonce,
    to: tx.to || '0x',
    data: tx.data,
    amount: numberToHex(tx.amount) || '0x',
    timestamp: tx.timestamp || Math.floor(new Date().getTime() * 1000),
    type: tx.type || 1,
    gasLimit: tx.gasLimit,
    gasPrice: tx.gasPrice,
  };


  const rlpEncoded = rlp.encode([
    unsignedTransaction.nonce,
    unsignedTransaction.to.toLowerCase(),
    unsignedTransaction.amount,
    unsignedTransaction.data,
    unsignedTransaction.timestamp,
    toAionLong(unsignedTransaction.gasLimit),
    toAionLong(unsignedTransaction.gasPrice),
    toAionLong(unsignedTransaction.type),
  ]);
    // ledger
  if (extra_param && extra_param.type === '[ledger]') {
    signByLedger(extra_param.derivationIndex, extra_param.sender, Object.values(rlpEncoded)).then(({ signature, publicKey }) => {
      console.log('signByLedger res=>', { signature, publicKey });
      const fullSignature = Buffer.concat([Buffer.from(hexutil.stripZeroXHexString(publicKey), 'hex'),
        Buffer.from(hexutil.stripZeroXHexString(signature), 'hex')]);
      // add the keystore fullSignature
      const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

      // re-encode with signature included
      const rawTransaction = rlp.encode(rawTx);

      resolve({ encoded: rawTransaction.toString('hex'), signature: Buffer.from(signature).toString('hex') });
    }).catch((e) => {
      reject(e);
    });
  } else {
    // recover keypair
    let ecKey;
    try {
      ecKey = keyPair(private_key);
    } catch (e) {
      reject(new Error('invalid private key'));
    }

    // hash encoded message
    const rawHash = blake2b(32).update(rlpEncoded).digest();
    // sign
    const signature = ecKey.sign(rawHash);
    // verify signature
    if (nacl.sign.detached.verify(rawHash, signature, Buffer.from(hexutil.hexString2Array(ecKey.publicKey))) === false) {
      throw new Error('Could not verify signature.');
    }

    const fullSignature = Buffer.concat([Buffer.from(hexutil.hexString2Array(ecKey.publicKey)), signature]);
    // add the keystore fullSignature
    const rawTx = rlp.decode(rlpEncoded).concat(fullSignature);

    // re-encode with signature included
    const rawTransaction = rlp.encode(rawTx);

    resolve({ encoded: rawTransaction.toString('hex'), signature: hexutil.toHex(signature) });
  }
});


const txInputFormatter = (options) => {
  if (options.to) { // it might be contract creation
    options.to = inputAddressFormatter(options.to);
  }

  if (options.data && options.input) {
    throw new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
  }

  if (!options.data && options.input) {
    options.data = options.input;
    delete options.input;
  }

  if (options.data && !hexutil.isHex(options.data)) {
    throw new Error('The data field must be HEX encoded data.');
  }

  // allow both
  if (options.gas || options.gasLimit) {
    options.gasLimit = options.gas || options.gasLimit;
  }

  ['gasPrice', 'gasLimit', 'nonce'].filter((key) => options[key] !== undefined).forEach((key) => {
    options[key] = numberToHex(options[key]);
  });

  return options;
};


const toAionLong = (val) => {
  let num;
  if (
    val === undefined
        || val === null
        || val === ''
        || val === '0x'
  ) {
    return null;
  }

  if (typeof val === 'string') {
    if (hexutil.isHex(val.toLowerCase())) {
      num = new BN(hexutil.removeLeadingZeroX(val.toLowerCase()), 16);
    } else {
      num = new BN(val, 10);
    }
  }

  if (typeof val === 'number') {
    num = new BN(val);
  }

  return new rlp.AionLong(num);
};


const numberToHex = function (value) {
  value = BigNumber.isBigNumber(value) ? value : BigNumber(value);
  return `0x${value.toString(16)}`;
};
