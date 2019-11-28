"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ledger_1 = require("./ledger");
exports.default = (hardware) => {
    if (hardware === 'ledger') {
        return new ledger_1.default();
    }
    throw new Error(`unsupport hardware: ${hardware}`);
};
//# sourceMappingURL=index.js.map