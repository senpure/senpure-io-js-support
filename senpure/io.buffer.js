io.encodeZigZag32 = function (value) {
    return value << 1 ^ value >> 31;
}
io.encodeZigZag64 = function (value) {
    return value << 1 ^ value >> 63;
}
io.decodeZigZag32 = function (value) {
    return value >>> 1 ^ -(value & 1);
}
io.decodeZigZag64 = function (value) {
    return value >>> 1 ^ -(value & 1);
}
io.BufferOperator = function (data) {
    this.buf = Buffer.from(data);
    this.writerIndex = this.buf.byteLength;
    this.readerIndex = 0;
    this.markedReaderIndex = 0;
    this.markedWriterIndex = 0;
    this.ensureInit = false;
}
io.BufferOperator.from = function (data) {
    return new io.BufferOperator(data);
}

io.BufferOperator.alloc = function (capacity) {
    var v = new io.BufferOperator(Buffer.alloc(capacity));
    v.writerIndex = 0;
    return v;
}
io.BufferOperator.prototype.writeData = function (data) {
    var dataBuf = Buffer.from(data);
    this.ensureWritable(data.length);
    //this.buf.write(data,this.writerIndex);
    dataBuf.copy(this.buf, this.writerIndex)
    this.writerIndex += data.length;
}
io.BufferOperator.prototype.discardSomeReadBytes = function () {
    if (this.readerIndex == 0) {
        return;
    }
    if (this.readerIndex == this.writerIndex) {
        this.adjustMarkers(this.readerIndex)
        this.writerIndex = this.readerIndex = 0;
        return;
    }
    if (this.readerIndex >= this.buf.byteLength >>> 1) {
        // var length = this.writerIndex - this.readerIndex;
        //  var targetStartIndex = this.readerIndex;
        // for (var i = 0; i < length; i++) {
        //     this.buf[i] = this.buf[targetStartIndex++];
        // }
        //使用buf.copy方法可能性能更好
        this.buf.copy(this.buf, 0, this.readerIndex)
        this.writerIndex -= this.readerIndex;
        this.adjustMarkers(this.readerIndex)
        this.readerIndex = 0;
    }
}
io.BufferOperator.prototype.adjustMarkers = function (decrement) {
    var markedReaderIndex = this.markedReaderIndex;
    if (markedReaderIndex <= decrement) {
        this.markedReaderIndex = 0;
        var markedWriterIndex = this.markedWriterIndex;
        if (markedWriterIndex <= decrement) {
            this.markedWriterIndex = 0;
        } else {
            this.markedWriterIndex = markedWriterIndex - decrement;
        }
    } else {
        this.markedReaderIndex = markedReaderIndex - decrement;
        this.markedWriterIndex -= decrement;
    }
}

io.BufferOperator.prototype.readableBytes = function () {
    return this.writerIndex - this.readerIndex;
}
io.BufferOperator.prototype.isReadable = function () {
    return this.writerIndex > this.readerIndex;
}

io.BufferOperator.prototype.getReaderIndex = function () {
    return this.readerIndex;
}
io.BufferOperator.prototype.markReaderIndex = function () {
    this.markedReaderIndex = this.readerIndex;
}
io.BufferOperator.prototype.resetReaderIndex = function () {
    this.readerIndex = this.markedReaderIndex;
}
io.BufferOperator.prototype.ensureWritable = function (length) {
    if (length < 1) {
        throw  new Error("扩张长度不能小于1")
    }
    var capacity = this.writerIndex + length;
    if (this.buf.byteLength >= capacity) {
        return
    }
    var buf;
    if (this.ensureInit) {
        buf = Buffer.alloc(capacity);
    } else {
        buf = Buffer.allocUnsafe(capacity);
    }
    this.buf.copy(buf)
    this.buf = buf;

}

io.BufferOperator.prototype.writeByte = function (value) {
    this.ensureWritable(1);
    this.buf.writeUInt8(value, this.writerIndex++);
}
io.BufferOperator.prototype.writeVar32Field = function (tag, value) {
    this.writeVar32(tag);
    this.writeVar32(value);
}
io.BufferOperator.prototype.writeVar32 = function (value) {
    while (true) {
        if ((value & ~0x7F) == 0) {
            this.writeByte(value);
            return;
        } else {
            this.writeByte((value & 0x7F) | 0x80);
            value >>>= 7;
        }
    }
}
io.BufferOperator.prototype.writeVar64Field = function (tag, value) {
    this.writeVar32(tag);
    this.writeVar64(value);
}
io.BufferOperator.prototype.writeVar64 = function (value) {
    while (true) {
        if ((value & ~0x7F) == 0) {
            this.writeByte(value);
            return;
        } else {
            this.writeByte((value & 0x7F) | 0x80);
            value >>>= 7;
        }
    }
}
io.BufferOperator.prototype.writeBooleanField = function (tag, value) {
    this.writeVar32(tag);
    this.writeByte(value ? 1 : 0);
}
io.BufferOperator.prototype.writeBoolean = function (value) {
    this.writeByte(value ? 1 : 0);
}
io.BufferOperator.prototype.writeSIntField = function (tag, value) {
    this.writeVar32(tag);
    this.writeSInt(value);
}
io.BufferOperator.prototype.writeSInt = function (value) {

    this.writeVar32(io.encodeZigZag32(value));
}
io.BufferOperator.prototype.writeSLongField = function (tag, value) {
    this.writeVar32(tag);
    this.writeSLong(value);
}
io.BufferOperator.prototype.writeSLong = function (value) {

    this.writeVar32(io.encodeZigZag64(value));
}
io.BufferOperator.prototype.writeSFixed32Field = function (tag, value) {
    this.writeVar32(tag);
    this.writeSFixed32(value);
}
io.BufferOperator.prototype.writeSFixed32 = function (value) {

    this.ensureWritable(4);
    this.buf.writeInt32BE(value, this.writerIndex);
    this.writerIndex += 4;
}
io.BufferOperator.prototype.writeSFixed64Field = function (tag, value) {
    this.writeVar32(tag);
    this.writeSFixed64(value);
}
io.BufferOperator.prototype.writeSFixed64 = function (value) {
    this.ensureWritable(8);
    this.buf.writeBigInt64BE(value, this.writerIndex);
    this.writerIndex += 8;
}


io.BufferOperator.prototype.writeFloatField = function (tag, value) {

    this.writeVar32(tag);
    this.writeFloat(value);
}
io.BufferOperator.prototype.writeFloat = function (value) {

    this.ensureWritable(4);
    this.buf.writeFloatBE(value, this.writerIndex);
    this.writerIndex += 4;
}

io.BufferOperator.prototype.writeDoubleField = function (tag, value) {

    this.writeVar32(tag);
    this.writeDouble(value);
}

io.BufferOperator.prototype.writeDouble = function (value) {

    this.ensureWritable(8);
    this.buf.writeDoubleBE(value, this.writerIndex);
    this.writerIndex += 8;
}
io.BufferOperator.prototype.writeStringField = function (tag, value) {
    this.writeVar32(tag);
    this.writeString(value);
}


io.BufferOperator.prototype.writeString = function (value) {
    var buf = Buffer.from(value, "utf-8");
    var length = buf.byteLength;
    this.writeVar32(length);
    this.ensureWritable(length);
    buf.copy(this.buf, this.writerIndex);
    this.writerIndex += length;

}
io.BufferOperator.prototype.writeBeanField = function (tag, bean) {
    this.writeVar32(tag);
    this.writeVar32(bean.getSerializedSize());
    bean.write(this);
}

io.BufferOperator.prototype.readTag = function (endIndex) {
    if (this.readerIndex == endIndex) {
        return 0;
    }
    return this.readVar32();
}
io.BufferOperator.prototype.skipTag = function (tag) {
    var tagWriteType = tag & 7;
    switch (tagWriteType) {
        case 0:
            this.readVar64();
            break;
        case 1:
            this.skipBytes(4);
            break;
        case 2:
            this.skipBytes(8);
            break;
        case 3:
            this.skipBytes(this.readVar32());
            break;
    }
}
io.BufferOperator.prototype.skipBytes = function (length) {
    this.readerIndex += length;
}

io.BufferOperator.prototype.readByte = function () {
    return this.buf.readInt8(this.readerIndex++);
}
io.BufferOperator.prototype.tryReadVar32 = function () {
    if (!this.isReadable()) {
        return 0;
    }
    var tmp = this.readByte();
    if (tmp >= 0) {
        return tmp;
    }
    if (!this.isReadable()) {
        this.resetReaderIndex();
        return 0;
    }
    var result = tmp & 0x7f;
    if ((tmp = this.readByte()) >= 0) {
        result |= tmp << 7;
    } else {
        result |= (tmp & 0x7f) << 7;
        if ((tmp = this.readByte()) >= 0) {
            result |= tmp << 14;
        } else {
            if (!this.isReadable()) {
                this.resetReaderIndex();
                return 0;
            }
            result |= (tmp & 0x7f) << 14;
            if ((tmp = this.readByte()) >= 0) {
                result |= tmp << 21;
            } else {
                if (!this.isReadable()) {
                    this.resetReaderIndex();
                    return 0;
                }
                result |= (tmp & 0x7f) << 21;
                result |= (tmp = this.readByte()) << 28;
                if (tmp < 0) {
                    // Discard upper 32 bits.
                    for (var i = 0; i < 5; i++) {
                        if (this.readByte() >= 0) {
                            return result;
                        }
                    }
                }
            }
        }
    }
    return result;
}
io.BufferOperator.prototype.readVar32 = function () {
    var tmp = this.readByte();
    // console.debug("tmp:" + tmp + " ," + tmp.toString(2))
    if (tmp >= 0) {
        return tmp;
    }
    var result = tmp & 0x7f;
    // console.debug("result:" + result + " ," + result.toString(2))
    if ((tmp = this.readByte()) >= 0) {
        //  console.debug("tmp:" + tmp)
        result |= tmp << 7;
        //  console.debug("result:" + result)
    } else {
        //  console.debug("tmp:" + tmp)
        result |= (tmp & 0x7f) << 7;
        // console.debug("result:" + result)
        if ((tmp = this.readByte()) >= 0) {
            result |= tmp << 14;
        } else {
            result |= (tmp & 0x7f) << 14;
            if ((tmp = this.readByte()) >= 0) {
                result |= tmp << 21;
            } else {
                result |= (tmp & 0x7f) << 21;
                result |= (tmp = this.readByte()) << 28;
                if (tmp < 0) {
                    // Discard upper 32 bits.
                    for (var i = 0; i < 5; i++) {
                        if (this.readByte() >= 0) {
                            return result;
                        }
                    }
                }
            }
        }
    }
    return result;
}

io.BufferOperator.prototype.readVar64 = function () {
    var shift = 0;
    var result = 0;
    while (shift < 64) {
        var b = this.readByte();
        result |= (b & 0x7F) << shift;
        if ((b & 0x80) == 0) {
            return result;
        }
        shift += 7;
    }
    return result;

}
io.BufferOperator.prototype.readBoolean = function () {
    return this.readByte() == 1 ? true : false;
}
io.BufferOperator.prototype.readSInt = function () {
    return io.decodeZigZag32(this.readVar32());
}
io.BufferOperator.prototype.readSLong = function () {
    return io.decodeZigZag64(this.readVar64());
}

io.BufferOperator.prototype.readSFixed32 = function () {
    var value = this.buf.readInt32BE(this.readerIndex);
    this.readerIndex += 4;
    return value;
}
io.BufferOperator.prototype.readSFixed64 = function () {
    var value = this.buf.readBigInt64BE(this.readerIndex);
    this.readerIndex += 8;
    return value;
}
io.BufferOperator.prototype.readFloat = function () {
    var value = this.buf.readFloatBE(this.readerIndex);
    this.readerIndex += 4;
    return value;
}

io.BufferOperator.prototype.readDouble = function () {
    var value = this.buf.readDoubleBE(this.readerIndex);
    this.readerIndex += 8;
    return value;
}
io.BufferOperator.prototype.readString = function () {
    var value = this.readVar32();
    var str = this.buf.toString("utf-8", this.readerIndex, this.readerIndex + value);
    this.readerIndex += value;
    return str;
}
io.BufferOperator.prototype.readBean = function (value) {
    value.read(this, this.readVar32() + this.readerIndex());

}

//  var b = Buffer.alloc(4);
// console.debug(b.toJSON())
// var v= new io.BufferOperator(b);
// v.writeVar32(180)
// v.writeVar32(200)
// console.debug(b.toJSON())
// console.debug(v.readVar32())




