"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hex_1 = require("./hex");
const utf8_1 = require("./utf8");
const BN = require("bn.js");
function AbiCoder(max_size) {
    function encode(types, values) {
        if (types.length !== values.length) {
            throw new Error("require types.length === values.length");
        }
        let buffer = Buffer.from("");
        types.forEach((type, idx) => {
            if (type === "address") {
                buffer = Buffer.concat([
                    buffer,
                    addressCoder.encode(values[idx])
                ]);
            }
            else if (type === "uint8") {
                buffer = Buffer.concat([
                    buffer,
                    uint8Coder.encode(`${values[idx]}`)
                ]);
            }
            else if (type === "uint128") {
                buffer = Buffer.concat([
                    buffer,
                    uint128Coder.encode(`${values[idx]}`)
                ]);
            }
            else if (type === "uint256") {
                buffer = Buffer.concat([
                    buffer,
                    uint256Coder.encode(`${values[idx]}`)
                ]);
            }
            else if (type === "bytes") {
                buffer = Buffer.concat([
                    buffer,
                    maxNumberCoder.encode(buffer.length + 16)
                ]);
                buffer = Buffer.concat([
                    buffer,
                    bytesCoder.encode(values[idx])
                ]);
            }
            else if (type === "string") {
                buffer = Buffer.concat([
                    buffer,
                    maxNumberCoder.encode(buffer.length + 16)
                ]);
                buffer = Buffer.concat([
                    buffer,
                    stringCoder.encode(values[idx])
                ]);
            }
        });
        return buffer;
    }
    function decode(buffer_, types) {
        const buffer = hex_1.arrayify(buffer_);
        let offset = 0;
        const result = [];
        types.forEach(type => {
            if (type === "address") {
                const ret = addressCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint8") {
                const ret = uint8Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint128") {
                const ret = uint128Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint256") {
                const ret = uint256Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "bytes") {
                const new_offset = maxNumberCoder.decode(buffer, offset).value;
                offset = new_offset.toNumber();
                const ret = bytesCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "string") {
                const new_offset = maxNumberCoder.decode(buffer, offset).value;
                offset = new_offset.toNumber();
                const ret = stringCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
        });
        return result;
    }
    function NumberCoder(size) {
        function encode_(value) {
            if (size > max_size) {
                throw new Error(`insufficient for uint${size * 8} Type`);
            }
            return hex_1.padZeros(new BN(value)
                .toTwos(size * 8)
                .maskn(size * 8)
                .toBuffer(), max_size);
        }
        function decode_(data, offset) {
            if (size > max_size) {
                throw new Error(`insufficient for uint${size * 8} Type`);
            }
            if (data.length < offset + max_size) {
                throw new Error(`insufficient for uint${size * 8} Type`);
            }
            const junkLength = max_size - size;
            const sliced = data.slice(offset + junkLength, offset + max_size);
            const bn = new BN(sliced);
            return {
                value: bn,
                consumed: max_size
            };
        }
        return {
            encode: encode_,
            decode: decode_
        };
    }
    function AddressCoder() {
        const size = 32;
        function encode_(value) {
            return hex_1.padZeros(hex_1.arrayify(value), size);
        }
        function decode_(data, offset) {
            if (data.length < offset + size) {
                throw new Error(`insufficient for address Type`);
            }
            const buffer = data.slice(offset, offset + size);
            return {
                value: hex_1.toHex(buffer),
                consumed: size
            };
        }
        return {
            encode: encode_,
            decode: decode_
        };
    }
    function BytesCoder() {
        function encode_(value_) {
            const value = hex_1.arrayify(value_);
            const dataLength = 32 * Math.ceil(value.length / 32);
            const padding = Buffer.alloc(dataLength - value.length, 0);
            return Buffer.concat([
                maxNumberCoder.encode(value.length),
                value,
                padding
            ]);
        }
        function decode_(data, offset) {
            const res = maxNumberCoder.decode(data, offset);
            offset += res.consumed;
            const valuelen = res.value.toNumber();
            const buffer = data.slice(offset, offset + valuelen);
            return {
                value: buffer,
                consumed: 32 * Math.ceil(valuelen / 32)
            };
        }
        return {
            encode: encode_,
            decode: decode_
        };
    }
    function StringCoder() {
        function encode_(value_) {
            const value = utf8_1.toUtf8Bytes(value_);
            const dataLength = 32 * Math.ceil(value.length / 32);
            const padding = Buffer.alloc(dataLength - value.length, 0);
            return Buffer.concat([
                maxNumberCoder.encode(value.length),
                value,
                padding
            ]);
        }
        function decode_(data, offset) {
            const res = maxNumberCoder.decode(data, offset);
            offset += res.consumed;
            const valuelen = res.value.toNumber();
            const buffer = data.slice(offset, offset + valuelen);
            const str = utf8_1.toUtf8String(buffer);
            return {
                value: str,
                consumed: 32 * Math.ceil(valuelen / 32)
            };
        }
        return {
            encode: encode_,
            decode: decode_
        };
    }
    const maxNumberCoder = NumberCoder(max_size);
    const uint8Coder = NumberCoder(1);
    const uint128Coder = NumberCoder(16);
    const uint256Coder = NumberCoder(32);
    const addressCoder = AddressCoder();
    const bytesCoder = BytesCoder();
    const stringCoder = StringCoder();
    return { encode, decode };
}
const AbiCoderAION = AbiCoder(16);
exports.AbiCoderAION = AbiCoderAION;
const AbiCoderETH = AbiCoder(32);
exports.AbiCoderETH = AbiCoderETH;
//# sourceMappingURL=abi-coder.js.map