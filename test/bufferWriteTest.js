require("../senpure/io.buffer")



var str = "你好离开据了解打发打发";
console.debug(str.length);
console.debug(Buffer.from(str).length)

var buf = io.BufferOperator.alloc(12)
console.debug(buf.buf)
var str="778899";
buf.writeString(str)
console.debug(buf.buf)
//buf.buf.write(str);
console.debug(buf.buf)
console.debug("read:"+buf.readString())

var b = Buffer.from("abc");
console.debug(b)
console.debug(b.toString("utf-8",1,2))

io.computeVar32Size()
io.computeVar64FiledSize()
io.computeVar32FiledSize()