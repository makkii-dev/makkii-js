import BigNumber from "bignumber.js";
import {getUnspentTx} from "./jsonrpc";
import {validateAmount} from "../../../utils/validate";

const validateBalanceSufficiency = (account, symbol, amount, extraParams) =>
    new Promise((resolve, reject) => {
        if (!validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        getUnspentTx(account.address, extraParams.network)
            .then(utxos => {
                let balance = BigNumber(0);
                utxos.forEach(utxo => {
                    balance = balance.plus(BigNumber(utxo.amount));
                });

                const BTCfee = BigNumber(148 * utxos.length + 34 * 2 + 10).times(2);
                const LTCfee = BigNumber(40000);
                const fee = symbol === 'LTC' ? LTCfee : BTCfee;
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


const sendAll = async (address, symbol, network) => {
    try {
        const utxos = await getUnspentTx(address, network);
        let balance = BigNumber(0);
        utxos.forEach(utxo => {
            balance = balance.plus(BigNumber(utxo.amount));
        });
        const BTCfee = BigNumber(148 * utxos.length + 34 * 2 + 10).times(2);
        const LTCfee = BigNumber(40000);
        return Math.max(
            balance
                .minus(symbol === 'LTC' ? LTCfee : BTCfee)
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