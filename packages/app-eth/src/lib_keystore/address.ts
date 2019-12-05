import { isValidAddress } from "ethereumjs-util";
/**
 * @hidden
 * @private
 */
export const validateAddress = address => isValidAddress(address);
