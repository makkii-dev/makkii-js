import * as bip39 from "bip39";

const validateAmount = amount => {
    return /^[0-9]?((\.[0-9]+)|([0-9]+(\.[0-9]+)?))$/.test(amount);
};

const validatePositiveInteger = input => {
    return /^[1-9][0-9]*$/.test(input);
};

const validateMnemonic = mnemonic => {
    const mnemonicFormat = mnemonic
        .trim()
        .split(/\s+/)
        .join(" ");
    return bip39.validateMnemonic(mnemonicFormat);
};

export { validateAmount, validatePositiveInteger, validateMnemonic };
