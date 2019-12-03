import { isValidAddress } from "ethereumjs-util";
/**
 * @hidden
 */
export const validateAddress = address => isValidAddress(address);
