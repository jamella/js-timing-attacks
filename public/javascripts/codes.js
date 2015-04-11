function hashCode(str) {
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function encodeByte(byte, bits) {
    for (var i = 0; i < 8; i++) {
        if (byte & Math.pow(2, i)) {
            bits.push(true)
        } else {
            bits.push(false);
        }
    }
}

function encode(src) {
    var bits = [];
    encodeByte(src.length, bits);
    for (var i = 0; i < src.length; i++) {
        encodeByte(src.charCodeAt(i), bits);
    }
    encodeByte(hashCode(src) & 255, bits);
    return bits;
}

function decodeByte(bits) {
    var num = 0;
    for (var i = 0; i < 8; i++) {
        if (bits.shift()) {
            num += Math.pow(2, i);
        }
    }
    return num;
}

function decode(bits) {
    var src = '';
    var len = decodeByte(bits);
    for (var i = 0; i < len; i++) {
        src += String.fromCharCode(decodeByte(bits));
    }
    var b = decodeByte(bits);
    if (b !== (hashCode(src) & 255)) {
        console.log("incorrect hash:" + src);
        return undefined;
    }
    return src;
}

function diff(bits, leaked) {
    var n = 0;
    for (var i = 0; i < bits.length; i++) {
        if (bits[i] === leaked[i]) n++;
    }
    console.log("error rate = " + (1.0 - n / bits.length));
}

if (typeof window === 'undefined') {
    module.exports = {
        encode: encode,
        decode: decode,
        diff: diff
    };
}
