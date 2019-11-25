import BigNumber from 'bignumber.js';
import jsonrpcClient from './jsonrpc';
import keystore from '../lib_keystore';
import { estimateFeeBTC, estimateFeeLTC } from '../lib_keystore/transaction';

export default config => {
  const { broadcastTransaction, getUnspentTx } = jsonrpcClient(config);
  const sendTransaction = (account, to, value, _extraParams, shouldBroadCast = true) => new Promise((resolve, reject) => {
    value = BigNumber.isBigNumber(value) ? value : BigNumber(value);
    getUnspentTx(account.address)
      .then((utxos) => {
        const { type, derivationIndex } = account;
        let extra_param = { type };
        if (type === '[ledger]') {
          extra_param = {
            ...extra_param,
            derivationIndex,
            sender: account.address,
          };
        }
        const tx = {
          amount: value.shiftedBy(8).toNumber(),
          change_address: account.address,
          to_address: to,
          byte_fee: 10,
          private_key: account.private_key,
          compressed: account.compressed,
          extra_param,
          utxos,
        };
        const valueIn = utxos.reduce((valueIn_, el) => valueIn_.plus(BigNumber(el.amount)), BigNumber(0));
        const fee = config.network.match(/LTC/) ? estimateFeeLTC : estimateFeeBTC(utxos.length, 2, tx.byte_fee || 10);
        keystore.signTransaction(tx, config.network)
          .then((res) => {
            console.log('[keystore sign resp]=>', res);
            const vout = [
              { addr: to, value: value.toNumber() },
            ];
            if (valueIn.toNumber() > value.shiftedBy(8).toNumber() + fee.toNumber()) {
              vout.push({ addr: account.address, value: valueIn.minus(value.shiftedBy(8)).minus(fee).shiftedBy(-8).toNumber() });
            }
            const txObj = {
              from: [{ addr: account.address, value: valueIn.shiftedBy(-8).toNumber() }],
              to: vout,
              fee: fee.shiftedBy(-8).toNumber(),
            };
            if (shouldBroadCast) {
              broadcastTransaction(res.encoded)
                .then((txid) => {
                  const pendingTx = {
                    ...txObj,
                    hash: txid,
                    status: 'PENDING',
                  };
                  resolve({ pendingTx });
                })
                .catch((e) => reject(e));
            } else {
              resolve({ encoded: res.encoded, txObj });
            }
          })
          .catch((e) => reject(e));
      })
      .catch((e) => reject(e));
  });

  const getTransactionUrlInExplorer = (txHash, network = 'BTC') => `${config.explorer}/${txHash}`;

  export {
    sendTransaction,
    getTransactionUrlInExplorer,
  };
}