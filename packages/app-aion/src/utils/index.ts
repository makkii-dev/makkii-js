const crypto = require('crypto-browserify')
function hmacSha512(key, str) {
    const hmac = crypto.createHmac('sha512',  Buffer.from(key, 'utf-8'));
    return hmac.update(Buffer.from(str,'utf-8')).digest();
}

const longToByteArray =  (long) => {
    // we want to represent the input as a 8-bytes array
    let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0; index < byteArray.length; index++) {
        let byte = long & 0xff;
        byteArray[ index ] = byte;
        long = (long - byte) / 256
    }

    return byteArray
};

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export {
    hmacSha512,
    longToByteArray,
    crypto,
    ab2str
};
