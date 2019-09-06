if (typeof io == "undefined") {
    io = {}
}

io.requestId = 1;

io.nextRequestId = function () {
    var requestId = io.requestId + 1;
    if (requestId >= 2147483647) {
        requestId = 1;
    }
    io.requestId = requestId;
    return requestId;

}
io.encodeMessage = function (message) {
    var length = message.getSerializedSize();


}