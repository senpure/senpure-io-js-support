if (typeof io == "undefined") {
    io = {}
}
rightPad = function (str, length) {
    var strLength = str.length;
    for (var i = strLength; i < length; i++) {
        str += " ";
    }
    return str;
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
io.messageDecoder = {};
io.regMessageDecoder = function (id, clazz, target) {
    if (io.messageDecoder[id] != null) {
        throw  new Error("id [" + id + " ] duplicate exist messageDecoder" + io.messageDecoder[id + "target"]
            + "  ||  new messageDecoder" + target)
    }
    console.debug("reg decoder " + id + " to decoding " + target)
    io.messageDecoder[id] = clazz;
    io.messageDecoder[id + "target"] = target;
}

io.encodeMessage = function (message) {
    var requestId = io.nextRequestId();
    var messageId = message.getMessageId();
    var headLength = io.computeVar32Size(requestId);
    headLength += io.computeVar32Size(messageId);
    //  console.debug("requestId:" + requestId + ",messageId:" + messageId + ", headLength:" + headLength)
    var packageLength = headLength + message.getSerializedSize();
    //console.debug("packageLength:" + packageLength)
    var bufNeedSize = io.computeVar32Size(packageLength) + packageLength;
    // console.debug("bufNeedSize:" + bufNeedSize)
    var buf = io.BufferOperator.alloc(bufNeedSize);
    buf.writeVar32(packageLength);
    buf.writeVar32(requestId);
    buf.writeVar32(messageId)
    message.write(buf);
    return buf.buf;
}

io.decodeMessage = function (buf, packageSize, endIndex) {
    var requestId = buf.readVar32();
    var messageId = buf.readVar32();
    var decoder = io.messageDecoder[messageId];
    if (decoder == null) {
        console.warn(messageId + " has not decoder")
        var headSize = io.computeVar32Size(requestId) + io.computeVar32Size(messageId);
        buf.skipBytes(packageSize - headSize);
        return null;
    }
    var message = decoder.getEmptyMessage();
    message.read(buf, endIndex);
    return message;
    //console.debug(message)
}


