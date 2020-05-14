"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39 = __importStar(require("bip39"));
const validateAmount = amount => {
    return /^[0-9]?((\.[0-9]+)|([0-9]+(\.[0-9]+)?))$/.test(amount);
};
exports.validateAmount = validateAmount;
const validatePositiveInteger = input => {
    return /^[1-9][0-9]*$/.test(input);
};
exports.validatePositiveInteger = validatePositiveInteger;
const validateMnemonic = mnemonic => {
    const mnemonicFormat = mnemonic
        .trim()
        .split(/\s+/)
        .join(" ");
    return bip39.validateMnemonic(mnemonicFormat);
};
exports.validateMnemonic = validateMnemonic;
//# sourceMappingURL=validator.js.map