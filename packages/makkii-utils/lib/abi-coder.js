"use strict";
exports.__esModule = true;
var hex_1 = require("./hex");
var utf8_1 = require("./utf8");
var BN = require("bn.js");
function AbiCoder(max_size) {
    function encode(types, values) {
        if (types.length !== values.length) {
            throw new Error("require types.length === values.length");
        }
        var buffer = Buffer.from("");
        types.forEach(function (type, idx) {
            if (type === "address") {
                buffer = Buffer.concat([
                    buffer,
                    addressCoder.encode(values[idx])
                ]);
            }
            else if (type === "uint8") {
                buffer = Buffer.concat([
                    buffer,
                    uint8Coder.encode("" + values[idx])
                ]);
            }
            else if (type === "uint128") {
                buffer = Buffer.concat([
                    buffer,
                    uint128Coder.encode("" + values[idx])
                ]);
            }
            else if (type === "uint256") {
                buffer = Buffer.concat([
                    buffer,
                    uint256Coder.encode("" + values[idx])
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
        var buffer = hex_1.arrayify(buffer_);
        var offset = 0;
        var result = [];
        types.forEach(function (type) {
            if (type === "address") {
                var ret = addressCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint8") {
                var ret = uint8Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint128") {
                var ret = uint128Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "uint256") {
                var ret = uint256Coder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "bytes") {
                var new_offset = maxNumberCoder.decode(buffer, offset).value;
                offset = new_offset.toNumber();
                var ret = bytesCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
            else if (type === "string") {
                var new_offset = maxNumberCoder.decode(buffer, offset).value;
                offset = new_offset.toNumber();
                var ret = stringCoder.decode(buffer, offset);
                offset += ret.consumed;
                result.push(ret.value);
            }
        });
        return result;
    }
    function NumberCoder(size) {
        function encode_(value) {
            if (size > max_size) {
                throw new Error("insufficient for uint" + size * 8 + " Type");
            }
            return hex_1.padZeros(new BN(value)
                .toTwos(size * 8)
                .maskn(size * 8)
                .toBuffer(), max_size);
        }
        function decode_(data, offset) {
            if (size > max_size) {
                throw new Error("insufficient for uint" + size * 8 + " Type");
            }
            if (data.length < offset + max_size) {
                throw new Error("insufficient for uint" + size * 8 + " Type");
            }
            var junkLength = max_size - size;
            var sliced = data.slice(offset + junkLength, offset + max_size);
            var bn = new BN(sliced);
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
        var size = 32;
        function encode_(value) {
            return hex_1.padZeros(hex_1.arrayify(value), size);
        }
        function decode_(data, offset) {
            if (data.length < offset + size) {
                throw new Error("insufficient for address Type");
            }
            var buffer = data.slice(offset, offset + size);
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
            var value = hex_1.arrayify(value_);
            var dataLength = 32 * Math.ceil(value.length / 32);
            var padding = Buffer.alloc(dataLength - value.length, 0);
            return Buffer.concat([
                maxNumberCoder.encode(value.length),
                value,
                padding
            ]);
        }
        function decode_(data, offset) {
            var res = maxNumberCoder.decode(data, offset);
            offset += res.consumed;
            var valuelen = res.value.toNumber();
            var buffer = data.slice(offset, offset + valuelen);
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
            var value = utf8_1.toUtf8Bytes(value_);
            var dataLength = 32 * Math.ceil(value.length / 32);
            var padding = Buffer.alloc(dataLength - value.length, 0);
            return Buffer.concat([
                maxNumberCoder.encode(value.length),
                value,
                padding
            ]);
        }
        function decode_(data, offset) {
            var res = maxNumberCoder.decode(data, offset);
            offset += res.consumed;
            var valuelen = res.value.toNumber();
            var buffer = data.slice(offset, offset + valuelen);
            var str = utf8_1.toUtf8String(buffer);
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
    var maxNumberCoder = NumberCoder(max_size);
    var uint8Coder = NumberCoder(1);
    var uint128Coder = NumberCoder(16);
    var uint256Coder = NumberCoder(32);
    var addressCoder = AddressCoder();
    var bytesCoder = BytesCoder();
    var stringCoder = StringCoder();
    return { encode: encode, decode: decode };
}
var AbiCoderAION = AbiCoder(16);
exports.AbiCoderAION = AbiCoderAION;
var AbiCoderETH = AbiCoder(32);
exports.AbiCoderETH = AbiCoderETH;
