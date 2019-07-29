import {address as BTCAddress} from 'bitcoinjs-lib'

const validateBase58 = (address) => {
    try{
        let res = BTCAddress.fromBase58Check(address);
        return true;
    }catch (e) {
        return false;
    }
};

const validateBench32 = (address) => {
    try{
        let res = BTCAddress.fromBech32(address);
        return true;
    }catch (e) {
        return  false;
    }
};
export const validateAddress = (address) =>new Promise((resolve, reject) => {
    resolve(validateBase58(address)||validateBench32(address));
});