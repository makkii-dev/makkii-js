"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bs58check = require("bs58check");
exports.validateAddress = address => {
    try {
        const buffer = Buffer.from(address);
        if (buffer.length !== 34)
            return false;
        const res = bs58check.decode(address);
        return res.length === 21 && res[0] === 0x41;
    }
    catch (e) {
        return false;
    }
};
//# sourceMappingURL=address.js.map