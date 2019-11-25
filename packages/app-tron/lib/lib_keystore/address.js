"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bs58check = require('bs58check');
exports.validateAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
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
});
//# sourceMappingURL=address.js.map