const validateAmount  = (amount) => {
    return /^[0-9]?((\.[0-9]+)|([0-9]+(\.[0-9]+)?))$/.test(amount);
};

const validatePositiveInteger = (input) => {
    return /^[1-9][0-9]*$/.test(input)
};


export {
    validateAmount,
    validatePositiveInteger,
}