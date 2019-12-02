import { TransactionBuilder } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { networks } from './network';

/** *
 *
 * @param transaction
 * {
 *    private_key?: hex String
 *    to_address: hex String
 *    change_address: hex String
 *    amount: number (satoshi)
 *    utxos: [
 *        {
 *            amount: number (satoshi)
 *            scripts: hex String
 *            hash: hex String
 *            index: number
 *        }
 *        ...
 *    ],
 *    extra_param: {type, sender, derivationIndex}
 * }
 * @param {{network}} {network} one of [BTC, BTCTEST, LTC, LTCTEST]
 * @returns {TransactionBuilder} TransactionBuilder btc transaction builder
 */

export const process_unsignedTx = (transaction, params) => {
  const {
    utxos, value, to_address, change_address, byte_fee,
  } = transaction;
  const { network } = params;
  const mainnet = networks[network];
  const amount = new BigNumber(value);
  const fee = network === 'BTC' || network === 'BTCTEST' ? estimateFeeBTC(utxos.length, 2, byte_fee || 10) : estimateFeeLTC;
  let balance = new BigNumber(0);
  for (let ip = 0; ip < utxos.length; ip += 1) {
    balance = balance.plus(new BigNumber(utxos[ip].amount));
  }
  if (balance.isLessThan(amount.plus(fee))) {
    throw new Error('error_insufficient_amount');
  }
  const needChange = balance.isGreaterThan(amount.plus(fee));
  const txb = new TransactionBuilder(mainnet);
  for (let ip = 0; ip < utxos.length; ip += 1) {
    txb.addInput(utxos[ip].hash, utxos[ip].index, 0xffffffff, Buffer.from(utxos[ip].script, 'hex'));
  }

  txb.addOutput(to_address, amount.toNumber());
  if (needChange) {
    txb.addOutput(change_address, balance.minus(amount).minus(fee).toNumber());
  }
  return txb;
}

export const estimateFeeBTC = (m, n, byte_fee) => new BigNumber(148 * m + 34 * n + 10).times(byte_fee);
export const estimateFeeLTC = new BigNumber(20000);
