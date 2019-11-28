import BigNumber from "bignumber.js";
import { validator } from "lib-common-util-js";

function formatAddress1Line(address) {
    const pre = address.startsWith('0x') ? 2 : 0;
    return `${address.substring(0, 10 + pre)}...${address.substring(address.length - 10)}`;
}

function validateBalanceSufficiency(account, amount, extraParams) {
    return new Promise(resolve => {
        if (!validator.validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        if (!validator.validateAmount(extraParams.gasPrice))
            resolve({ result: false, err: 'error_invalid_gas_price' });
        if (!validator.validatePositiveInteger(extraParams.gasLimit))
            resolve({ result: false, err: 'error_invalid_gas_limit' });

        const gasLimit = new BigNumber(extraParams.gasLimit);
        const gasPrice = new BigNumber(extraParams.gasPrice);
        const balance = new BigNumber(account.balance);
        const transferAmount = new BigNumber(amount);
        if (extraParams.symbol === 'ETH') {
            if (
                transferAmount
                    .plus(gasPrice.multipliedBy(gasLimit).dividedBy(new BigNumber(10).pow(9)))
                    .isGreaterThan(balance)
            ) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        } else {
            if (
                gasPrice
                    .multipliedBy(gasLimit)
                    .dividedBy(new BigNumber(10).pow(9))
                    .isGreaterThan(balance)
            ) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
            const totalCoins = account.tokens[extraParams.symbol].balance;
            if (transferAmount.isGreaterThan(totalCoins)) {
                resolve({ result: false, err: 'error_insufficient_amount' });
            }
        }
        resolve({ result: true });
    });
}

function addressFormat(address) {
    address = address.toLowerCase();
    address = address.startsWith('0x')?address:`0x${address}`;
    return address;
}

function sameAddress(address1, address2){
    return addressFormat(address1) === addressFormat(address2);
}


export {
    validateBalanceSufficiency,
    formatAddress1Line,
    sameAddress
}