import BigNumber from 'bignumber.js';
import jsonrpcClient from './jsonrpc';
import { estimateFeeBTC, estimateFeeLTC } from '../lib_keystore/transaction';

export default config => {
  const { broadcastTransaction, getUnspentTx } = jsonrpcClient(config);

  const sendTransaction = async (unsignedTx, signer, signerParams) => {
    const singedTx = await signer.signTransaction(unsignedTx, signerParams);
    const txId = await broadcastTransaction(singedTx);
    const { to, from, value, fee } = unsignedTx;
    return {
      from,
      to,
      value,
      fee,
      hash: txId,
      status: 'PENDING',
    }
  }

  const getTransactionUrlInExplorer = (txHash) => `${config.explorer}/${txHash}`;


  const buildTransaction = async (from, to, value, options) => {
    const { byte_fee } = options;
    value = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
    const utxos = await getUnspentTx(from);
    const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(new BigNumber(el.amount)), new BigNumber(0));
    const fee = config.network.match('LTC') ? estimateFeeLTC : estimateFeeBTC(utxos.length, 2, byte_fee || 10);
    const vout = [
      { addr: to, value: value.toNumber() },
    ];
    if (valueIn.toNumber() > value.shiftedBy(8).toNumber() + fee.toNumber()) {
      vout.push({ addr:from , value: valueIn.minus(value.shiftedBy(8)).minus(fee).shiftedBy(-8).toNumber() });
    }
    return {
      from: [{ addr: from, value: valueIn.shiftedBy(-8).toNumber() }],
      to: vout,
      fee: fee.shiftedBy(-8).toNumber(),
      to_address: to,
      change_address: from,
      value,
      utxos,
      byte_fee,
      network: config.network
    }
  }

  return {
    sendTransaction,
    buildTransaction,
    getTransactionUrlInExplorer,
  };
}