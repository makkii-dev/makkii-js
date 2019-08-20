import {broadcastTransaction, getUnspentTx} from "./jsonrpc";
import keystore from "../keystore";
import BigNumber from "bignumber.js";

const sendTransaction = (account, symbol, to, value, extraParams, data, network = 'BTC', shouldBroadCast=true) =>
    new Promise((resolve, reject) => {
        value = BigNumber.isBigNumber(value)? value: BigNumber(value);
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
                        if(shouldBroadCast) {
                            broadcastTransaction(res.encoded, network)
                                .then(txid => {
                                    const pendingTx = {
                                        hash: txid,
                                        from: account.address,
                                        to,
                                        value,
                                        status: 'PENDING',
                                    };
                                    resolve({pendingTx});
                                })
                                .catch(e => reject(e));
                        }else{
                            resolve({encoded: res})
                        }
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