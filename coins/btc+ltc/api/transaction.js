import {broadcastTransaction, getUnspentTx} from "./jsonrpc";
import keystore from "../keystore";

const sendTransaction = (account, symbol, to, value, extraParams, data, network = 'BTC') =>
    new Promise((resolve, reject) => {
        getUnspentTx(account.address, network)
            .then(utxos => {
                const tx = {
                    amount: value.shiftedBy(8).toNumber(),
                    change_address: account.address,
                    to_address: to,
                    byte_fee: 2,
                    private_key: account.private_key,
                    utxos,
                };
                keystore.signTransaction(tx, network)
                    .then(res => {
                        console.log('[keystore sign resp]=>', res);
                        broadcastTransaction(res.encoded, network)
                            .then(txid => {
                                const pendingTx = {
                                    hash: txid,
                                    from: account.address,
                                    to,
                                    value,
                                    status: 'PENDING',
                                };
                                resolve({ pendingTx });
                            })
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });

const getTransactionUrlInExplorer = (txHash, network = 'BTC') =>
    `https://chain.so/tx/${network}/${txHash}`;

export {
    sendTransaction,
    getTransactionUrlInExplorer
}