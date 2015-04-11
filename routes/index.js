var express = require('express');
var router = express.Router();
var codes = require('../public/javascripts/codes');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Leaking information through timing' });
});

router.post('/leak', function(req, res, next) {
    console.log(req.body);
    res.send({ success: true });
});

var sessions = {};

router.post('/init', function(req, res, next) {
    sessions[req.body.ses] = {
        buffer: new Array(16 + req.body.l * 8),
        times: {},
        start: Date.now(),
        got: 0
    };
    res.send({success: true});
});

router.post('/from', function(req, res, next) {
    var ses = sessions[req.body.ses];
    if (ses.start && !ses.delay) ses.delay = Date.now() - ses.start;
    if (ses && !ses.times) console.log(ses);
    ses.times[req.body.i] = Date.now();
    res.send({success: true});
});

router.post('/to', function(req, res, next) {
    var ses = sessions[req.body.ses];
    if (ses.start && !ses.delay) ses.delay = Date.now() - ses.start;

    var start = ses.times[req.body.i];
    if (start === undefined) {
        ses.buffer[req.body.i] = false;
    } else {
        var diff = Date.now() - start;
        if (diff / ses.delay > 0.5) {
            ses.buffer[req.body.i] = true;
        } else {
            ses.buffer[req.body.i] = false;
        }
    }
    if (++ses.got === ses.buffer.length) {
        codes.diff(ses.buffer, codes.encode("tomato"));
        var msg = codes.decode(ses.buffer);
        console.log("decoded: " + msg);
        return res.send({success: true, msg: msg});
    }
    res.send({success: true});
});

module.exports = router;
