require("./senpure/io.consumer");
require("./senpure/io.utils");
require("./senpure/io.buffer");
require("./senpure/io.commputer");
//require("./senpure/msg")
require("./senpure/protocol");
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
            console.info("packageLength :" + packageLength + " preIndex:" + preIndex);
            lastBufferOperator = bufferOperator;
            return;
        }
        if (packageLength > bufferOperator.readableBytes()) {
            console.info("数据不够一个数据包" + bufferOperator.readableBytes() + "/" + packageLength);
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

var values = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215, 33554431,
    67108863, 134217727, 268435455, 536870911, 1073741823, 2147483647, 4294967295, 8589934591, 17179869183, 34359738367, 68719476735, 137438953471, 274877906943,
    549755813887, 1099511627775, 2199023255551, 4398046511103, 8796093022207, 17592186044415, 35184372088831, 70368744177663, 140737488355327, 281474976710655,
    562949953421311, 1125899906842623, 2251799813685247, 4503599627370495, 9007199254740991, 18014398509481983, 36028797018963967, 72057594037927935,
    144115188075855871, 288230376151711743, 576460752303423487, 1152921504606846975, 2305843009213693951,
    4611686018427387903, 9223372036854775807];

var vs = new Array(values.length);
for (var i = 0; i < values.length; i++) {
    var m = new Example.CSSampleStrMessage();
    m.value = "100869";
    // client.write(io.encodeMessage(m));
}
//client.write(Buffer.concat(vs));
var m = new Example.CSEchoMessage();
var echo = new Example.Echo();
echo.booleanValue = true;
echo.booleanValues.push(false);
echo.getBooleanValues().push(true);

echo.intValue = -10086;
echo.intValues.push(500);
echo.intValues.push(5001);
echo.longValue = -10086;
echo.longValues.push(5080);
echo.longValues.push(50801);

echo.sintValue = 15;
echo.sintValues.push(20);
echo.sintValues.push(-29990);
echo.slongValue = 1599999;
echo.slongValues.push(209999999);
echo.slongValues.push(-29990);
echo.floatValue = 1.2;
echo.floatValues.push(-2.02);
echo.floatValues.push(500.02);
echo.setDoubleValue(53.5);
echo.doubleValues.push(83021);
echo.doubleValues.push(-83021);

echo.fixed32Value = 5;
echo.fixed32Values.push(503);
echo.fixed32Values.push(-503);
echo.fixed64Value = -2225;
echo.fixed64Values.push(503);
echo.fixed64Values.push(-503);

echo.stringValue = "str a bc";
echo.stringValues.push("str 789");
echo.stringValues.push("str 7897");

var bean = new Example.EchoBean();
bean.value = 55;
echo.beanValue = bean;
echo.beanValues.push(new Example.EchoBean());

echo.enumValue = Example.EchoEnum.Y;
echo.enumValues.push(Example.EchoEnum.Y);
echo.enumValues.push(Example.EchoEnum.X);

//2222
echo.booleanValue2 = true;
echo.booleanValues2.push(false);
echo.booleanValues2.push(true);

echo.intValue2 = -10086;
echo.intValues2.push(500);
echo.intValues2.push(5001);
echo.longValue2 = -10086;
echo.longValues2.push(5080);
echo.longValues2.push(50801);

echo.sintValue2 = 15;
echo.sintValues2.push(20);
echo.sintValues2.push(-29990);
echo.slongValue2 = 1599999;
echo.slongValues2.push(209999999);
echo.slongValues2.push(-29990);
echo.floatValue2 = 1.2;
echo.floatValues2.push(-2.02);
echo.floatValues2.push(500.02);

echo.doubleValue2 = 5.5;
echo.doubleValues2.push(83021);
echo.doubleValues2.push(-83021);

echo.fixed32Value2 = 5;
echo.fixed32Values2.push(503);
echo.fixed32Values2.push(-503);
echo.fixed64Value2 = -2225;
echo.fixed64Values2.push(503);
echo.fixed64Values2.push(-503);

echo.stringValue2 = "str a bc";
echo.stringValues2.push("str 789");
echo.stringValues2.push("str 7897");

var bean2 = new Example.EchoBean();
bean2.value = 55;
echo.beanValue2 = bean2;
echo.beanValues2.push(new Example.EchoBean());

echo.enumValue2 = Example.EchoEnum.Y;
echo.enumValues2.push(Example.EchoEnum.Y);
echo.enumValues2.push(Example.EchoEnum.X);

m.echo = echo;
//console.debug(echo.toString("   "));
client.write(io.encodeMessage(m));









