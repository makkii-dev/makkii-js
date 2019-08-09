import BigNumber from "bignumber.js";
import { validator } from "lib-common-util-js";

function formatAddress1Line(address) {
    const pre = address.startsWith('0x') ? 2 : 0;
    return `${address.substring(0, 10 + pre)}...${address.substring(address.length - 10)}`;
}

/***
 *
 * @param account
 *         {
 *             balance: xxx
 *             tokens: {MAK:xxx , ....}
 *             symbol: AION
 *         }
 * @param symbol // current token symbol such as MAK
 * @param amount
 * @param extraParams
 * @returns {Promise<unknown>}
 */
function validateBalanceSufficiency(account, symbol, amount, extraParams) {
    return new Promise(resolve => {
        if (!validator.validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        if (!validator.validateAmount(extraParams.gasPrice))
            resolve({ result: false, err: 'error_invalid_gas_price' });
        if (!validator.validatePositiveInteger(extraParams.gasLimit))
            resolve({ result: false, err: 'error_invalid_gas_limit' });

        const gasLimit = BigNumber(extraParams.gasLimit);
        const gasPrice = BigNumber(extraParams.gasPrice);
        const balance = BigNumber(account.balance);
        const transferAmount = BigNumber(amount);
        if (account.symbol === symbol) {
            if (
                transferAmount
                    .plus(gasPrice.multipliedBy(gasLimit).dividedBy(BigNumber(10).pow(9)))
                    .isGreaterThan(balance)
            ) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        } else {
            if (
                gasPrice
                    .multipliedBy(gasLimit)
                    .dividedBy(BigNumber(10).pow(9))
                    .isGreaterThan(balance)
            ) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
            const totalCoins = account.tokens[symbol].balance;
            if (transferAmount.isGreaterThan(totalCoins)) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        }
        resolve({ result: true });
    });
}

function　sameAddress(address1, address2){
    return address1.toLowerCase() === address2.toLowerCase();
}


export {
    formatAddress1Line,
    validateBalanceSufficiency,
    sameAddress
}