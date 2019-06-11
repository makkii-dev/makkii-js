import {isValidAddress} from 'ethereumjs-util';

export const validateAddress = (address) => new Promise((resolve, reject) => {
   resolve(isValidAddress(address))
});