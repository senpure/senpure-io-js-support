require("./senpure/io.consumer")
require("./senpure/io.utils")
require("./senpure/io.buffer")
require("./senpure/io.commputer")
require("./senpure/msg")
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
            var message = io.decodeMessage(bufferOperator, packageLength, bufferOperator.getReaderIndex() + packageLength);
            if (message != null) {

                console.debug(message.toString("    "));
            }
            //console.debug("string:"+bufferOperator.readString());
            // var requestId = bufferOperator.readVar32();
            // console.debug("requestId:" + requestId);
            //  var messageId = bufferOperator.readVar32();
            // console.debug("messageId:" + messageId);
            //  bufferOperator.readVar32();
            //  var _success = bufferOperator.readBoolean();
            //  bufferOperator.readVar32();
            //  var str = bufferOperator.readString();
            //  console.debug("_success:" + _success + ",str:" + str);
        }
    }
    lastBufferOperator = null;
});
client.connect(2222, "127.0.0.1");

var size = 65;
var bus = new Array(size);
for (var i = 0; i < size; i++) {
    var str = new CSStrMessage();
    str.message = "message" + i;
  //  bus[i] = io.encodeMessage(str);
    // client.write(io.encodeMessage(str));
}
var  values=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215,33554431,
    67108863,134217727,268435455,536870911,1073741823,2147483647,4294967295,8589934591,17179869183,34359738367,68719476735,137438953471,274877906943,
    549755813887,1099511627775,2199023255551,4398046511103,8796093022207,17592186044415,35184372088831,70368744177663,140737488355327,281474976710655,
    562949953421311,1125899906842623,2251799813685247,4503599627370495,9007199254740991,18014398509481983,36028797018963967,72057594037927935,
    144115188075855871,288230376151711743,576460752303423487,1152921504606846975,2305843009213693951,
    4611686018427387903,9223372036854775807];

var vs = new Array(values.length);
for (var i = 0; i <values.length ; i++) {
    var m = new CSLongMessage();
    m.value = values[i];
    vs[i] = io.encodeMessage(m);
   // client.write(vs[i]);
}
//client.write(Buffer.concat(vs));
var m = new CSLongMessage();
m.value=4611686018427387903;
client.write(io.encodeMessage(m));







