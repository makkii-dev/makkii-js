export const validateAddress = (address) =>new Promise((resolve, reject) => {
    let reg = /^[0-9a-fA-F]{64}$/;
    address = address.startsWith('0x') ? address.substring(2) : address;
    resolve(reg.test(address));
});
