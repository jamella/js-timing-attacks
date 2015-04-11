$(function() {
    $('#leaktime').click(function(evt) {
        evt.preventDefault();
        var src = $('#txt').val();
        leakTime(src, 0);
        return false;
    });
    $('#leaknet').click(function(evt) {
        evt.preventDefault();
        var src = $('#txt').val();
        leakNet(src, 0);
        return false;
    });
});

