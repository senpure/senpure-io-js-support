var a = Buffer.alloc(4);
a.writeInt32BE(500, 0);
var b = Buffer.alloc(4);
b.writeInt32BE(600, 0);

var c = Buffer.concat([a, b]);
console.debug(c.toJSON())

