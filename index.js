var buf = Buffer.alloc(10);
console.debug(buf.toJSON())
buf.writeInt32BE(100, 0);
console.debug(buf.toJSON())
var buf2=Buffer.allocUnsafe(12);
console.debug(buf2.toJSON())
console.debug(buf2.toJSON())