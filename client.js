require("./senpure/io.buffer")
var net = require("net")
var client = new net.Socket()
//client.setEncoding('utf8');
client.on("error", function (err) {
    console.log("error ", err)
})

client.on('drain', function (data) {

    console.debug("drain")
})

var lastBufferOperator = null;
client.on('data', function (data) {
    // client.setEncoding('utf8');
    console.debug("收到服务器返回" + data.length + "  ");
    // var buf = Buffer.from(data);
    // console.debug(buf.toJSON());
    var bufferOperator;
    if (lastBufferOperator == null) {
        bufferOperator = io.BufferOperator.from(data);
    } else {
        lastBufferOperator.writeData(data);
        bufferOperator = lastBufferOperator;
        //  lastBufferOperator.
    }
    while (bufferOperator.readableBytes() > 0) {
        bufferOperator.markReaderIndex();
        var preIndex = bufferOperator.getReaderIndex();
        var packageLength = bufferOperator.tryReadVar32();
        if (preIndex == bufferOperator.getReaderIndex()) {
            console.warn("packageLength :" + packageLength + " preIndex:" + preIndex);
            lastBufferOperator = bufferOperator;
            return;
        }
        if (packageLength > bufferOperator.readableBytes()) {
            console.warn("数据不够一个数据包" + bufferOperator.readableBytes() + "/" + packageLength);
            bufferOperator.resetReaderIndex()
            bufferOperator.discardSomeReadBytes();
            lastBufferOperator = bufferOperator;
            return;
        } else {
            //console.debug("string:"+bufferOperator.readString());

            var requestId = bufferOperator.readVar32();
            // console.debug("requestId:" + requestId);
            var messageId = bufferOperator.readVar32();
            // console.debug("messageId:" + messageId);
            bufferOperator.readVar32();
            var success = bufferOperator.readBoolean();
            bufferOperator.readVar32();
            var str = bufferOperator.readString();
            console.debug("success:" + success + ",str:" + str);
        }
    }
    lastBufferOperator = null;
});
client.connect(8007, "127.0.0.1");

client.write("aaa");






