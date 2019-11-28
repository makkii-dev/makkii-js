import BigNumber from 'bignumber.js';
import jsonrpcClient from './jsonrpc';
import keystore from '../lib_keystore';
import { estimateFeeBTC, estimateFeeLTC } from '../lib_keystore/transaction';

export default config => {
  const { broadcastTransaction, getUnspentTx } = jsonrpcClient(config);

  const sendTransaction = async (unsignedTx, signer, signerParams) => {
    const singedTx = await signer.signTransaction(unsignedTx, signerParams);
    const txId = await broadcastTransaction(singedTx);
    const { network = 'BTC' } = signerParams;
    const { utxos, to, from, value: value_, byte_fee } = unsignedTx;
    const value = new BigNumber(value_);
    const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(new BigNumber(el.amount)), new BigNumber(0));
    const fee = config.network.match('LTC') ? estimateFeeLTC : estimateFeeBTC(utxos.length, 2, byte_fee || 10);
    const vout = [
      { addr: to, value: value.toNumber() },
    ];
    if (valueIn.toNumber() > value.shiftedBy(8).toNumber() + fee.toNumber()) {
      vout.push({ addr:from , value: valueIn.minus(value.shiftedBy(8)).minus(fee).shiftedBy(-8).toNumber() });
    }
    const txObj = {
      from: [{ addr: from, value: valueIn.shiftedBy(-8).toNumber() }],
      to: vout,
      fee: fee.shiftedBy(-8).toNumber(),
    };
    return {
      ...txObj,
      hash: txId,
      status: 'PENDING',
    }
  }

  const getTransactionUrlInExplorer = (txHash, network = 'BTC') => `${config.explorer}/${txHash}`;


  const buildTransaction = async (from, to, value, options) => {
    const { byte_fee } = options;
    value = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
    const utxos = await getUnspentTx(from);
    return {
      to,
      from,
      value,
      utxos,
      byte_fee
    }
  }

  return {
    sendTransaction,
    buildTransaction,
    getTransactionUrlInExplorer,
  };
}