import {isValidAddress} from 'ethereumjs-util';

// eslint-disable-next-line import/prefer-default-export
export const validateAddress = (address) => isValidAddress(address);