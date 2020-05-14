"use strict";
exports.__esModule = true;
function addressFormat(address) {
    address = address.toLowerCase();
    address = address.startsWith("0x") ? address : "0x" + address;
    return address;
}
function sameAddress(address1, address2) {
    return addressFormat(address1) === addressFormat(address2);
}
exports.sameAddress = sameAddress;
