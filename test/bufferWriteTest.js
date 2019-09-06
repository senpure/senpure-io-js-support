
require("../senpure/io.buffer")

var b = Buffer.alloc(8);
b.writeInt32BE(5, 0);
b.writeInt32BE(6, 4);

console.debug(b.readInt32BE(0));
console.debug(b.readInt32BE(4));

var buf = io.BufferOperator.alloc(12);


buf.writeSFixed32(5);
buf.writeSFixed32(6)
buf.writeSFixed32(7)
console.debug(buf.readSFixed32())
console.debug(buf.readSFixed32())
buf.discardSomeReadBytes();
console.debug(buf.buf.toJSON())

var  str="你好离开据了解打发打发";
console.debug(str.length);
console.debug(Buffer.from(str).length)