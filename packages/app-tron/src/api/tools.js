import BigNumber from "bignumber.js";
import {validator} from "lib-common-util-js";

const formatAddress1Line = address => `${address.slice(0, 12)}...${address.slice(-10)}`;

function validateBalanceSufficiency(account, symbol, amount) {
    return new Promise(resolve => {
        if (!validator.validateAmount(amount)) resolve({ result: false, err: 'error_format_amount' });
        const balance = BigNumber(account.balance);
        const transferAmount = BigNumber(amount);
        if (transferAmount.isGreaterThan(balance)) {
            resolve({ result: false, err: 'error_insufficient_amount' });
        }
        resolve({ result: true });
    });
}

function sameAddress(address1, address2){
    return address1 === address2;
}

export {
    formatAddress1Line,
    validateBalanceSufficiency,
    sameAddress
}