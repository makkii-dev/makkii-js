import { ECPair, TransactionBuilder } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { hexutil } from 'lib-common-util-js';
import { networks } from './network';
import { getKeyByLedger, wallet } from './ledger';
import { getRawTx } from '../api/jsonrpc';

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
 * @param network: one of [BTC, BTCTEST, LTC, LTCTEST]
 * @returns {Promise<any>} {encoded: hex String}
 */
export const signTransaction = async (transaction, network = 'BTC') => {
  const {
    private_key, compressed, utxos, amount: amount_, to_address, change_address, byte_fee, extra_param,
  } = transaction;
  const mainnet = networks[network];
  const amount = new BigNumber(amount_);
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
  if (extra_param && extra_param.type === '[ledger]') {
    const { sender, derivationIndex } = extra_param;
    // account type is ledger
    const { address, publicKey } = await getKeyByLedger(derivationIndex, network);
    if (sender !== address) { throw new Error('ledger.wrong_device'); }
    const coinType = network.startsWith('BTC') ? 0 : 2;
    const tx = txb.buildIncomplete();
    const inputs = [];
    const paths = [];
    for (let ip = 0; ip < utxos.length; ip += 1) {
      // eslint-disable-next-line no-await-in-loop
      const preTxhex = await getRawTx(utxos[ip].hash, network);
      const preTx = wallet.splitTransaction(preTxhex);
      inputs.push(
        [
          preTx,
          utxos[ip].index,
        ],
      );
      paths.push(`m/49'/${coinType}'/0'/0/${derivationIndex}`);
    }
    const tx2 = wallet.splitTransaction(tx.toHex());
    const outputScriptHex = wallet.serializeTransactionOutputs(tx2).toString('hex');
    const encoded = await wallet.createPaymentTransactionNew(inputs, paths, undefined, outputScriptHex, 0, 1, false);
    return { encoded };
  }

  const keyPair = ECPair.fromPrivateKey(Buffer.from(hexutil.removeLeadingZeroX(private_key), 'hex'), {
    network: mainnet,
    compressed,
  });


  for (let ip = 0; ip < utxos.length; ip += 1) {
    txb.sign(ip, keyPair);
  }
  const tx = txb.build();
  return { encoded: tx.toHex() };
};

export const estimateFeeBTC = (m, n, byte_fee) => BigNumber(148 * m + 34 * n + 10).times(byte_fee);
export const estimateFeeLTC = BigNumber(20000);
