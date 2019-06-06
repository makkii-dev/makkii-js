import {isValidChecksumAddress} from 'ethereumjs-util';

export const validateAddress = (address) => new Promise((resolve, reject) => {
   resolve(isValidChecksumAddress(address))
});