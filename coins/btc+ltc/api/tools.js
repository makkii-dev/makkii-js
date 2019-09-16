import BigNumber from "bignumber.js";
import {getUnspentTx} from "./jsonrpc";
import { validator } from "lib-common-util-js";
import {estimateFeeBTC, estimateFeeLTC} from "../keystore/transaction";

const validateBalanceSufficiency = (account, symbol, amount, extraParams) =>
    new Promise((resolve, reject) => {
        if (!validator.validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        getUnspentTx(account.address, extraParams.network)
            .then(utxos => {
                let balance = BigNumber(0);
                utxos.forEach(utxo => {
                    balance = balance.plus(BigNumber(utxo.amount));
                });

                const fee = symbol === 'LTC' ?estimateFeeLTC: estimateFeeBTC(utxos.length, 2, extraParams.byte_fee|| 10);
                const totalFee = BigNumber(amount)
                    .shiftedBy(8)
                    .plus(fee);
                balance.isGreaterThan(totalFee) ||
                resolve({ result: false, err: 'error_insufficient_amount' });
                balance.isGreaterThan(totalFee) && resolve({ result: true });
            })
            .catch(() => {
                reject({ result: false, err: 'error_insufficient_amount' });
            });
    });


const sendAll = async (address, symbol, network, byte_fee=10) => {
    try {
        const utxos = await getUnspentTx(address, network);
        let balance = BigNumber(0);
        utxos.forEach(utxo => {
            balance = balance.plus(BigNumber(utxo.amount));
        });
        return Math.max(
            balance
                .minus(symbol === 'LTC' ?estimateFeeLTC: estimateFeeBTC(utxos.length, 2, byte_fee|| 10))
                .shiftedBy(-8)
                .toNumber(),
            0,
        );
    } catch (e) {
        return 0;
    }
};

const formatAddress1Line = address => `${address.slice(0, 12)}...${address.slice(-10)}`;

const sameAddress = (address1, address2)=> address1 === address2;
export {
    validateBalanceSufficiency,
    sendAll,
    formatAddress1Line,
    sameAddress
}
