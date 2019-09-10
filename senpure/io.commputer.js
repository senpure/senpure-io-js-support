io._computeVar32Size = function (value) {
    if ((value & -128) == 0) {
        return 1;
    } else if ((value & -16384) == 0) {
        return 2;
    } else if ((value & -2097152) == 0) {
        return 3;
    } else {
        return (value & -268435456) == 0 ? 4 : 5;
    }
}
io._computeVar64Size = function (value) {
    if ((value & -128) == 0) {
        return 1;
    } else if ((value & -16384) == 0) {
        return 2;
    } else if ((value & -2097152) == 0) {
        return 3;
    } else if ((value & -268435456) == 0) {
        return 4;
    } else if ((value & -34359738368) == 0) {
        return 5;
    } else if ((value & -4398046511104) == 0) {
        return 6;
    } else if ((value & -562949953421312) == 0) {
        return 7;
    } else if ((value & -72057594037927936) == 0) {
        return 8;
    } else {
        return (value & -9223372036854775808) == 0 ? 9 : 10;
    }
}

io.computeBeanFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + value.getSerializedSize();
}

io.computeVar32FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar32Size(value);
}
io.computeVar32Size = function (value) {
    return value >= 0 ? io._computeVar32Size(value) : 5;
}

io.computeVar64FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar64Size(value);
}

io.computeVar64Size = function (value) {
    return value >= 0 ? io._computeVar64Size(value) : 10;
}
io.computeStringFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeStringSize(value);
}
io.computeStringSize = function (value) {
    var buf = Buffer.from(value);
    return buf.length + io.computeVar32Size(buf.length);
}

io.computeBooleanFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeBooleanSize(value);
}
io.computeBooleanSize = function (value) {
    return 1;
}
io.computeFloatFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeFloatSize(value);
}

io.computeFloatSize = function (value) {
    return 4;
}
io.computeDoubleFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeDoubleSize(value);
}

io.computeDoubleSize = function (value) {
    return 8;
}
io.computeSFixed32FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSFixed32Size(value);
}

io.computeSFixed32Size = function (value) {
    return 4;
}

io.computeSFixed64FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSFixed64Size(value);
}

io.computeSFixed64Size = function (value) {
    return 8;
}
io.computeSIntFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSIntFieldSize(value);
}


io.computeSIntSize = function (value) {
    return io.computeVar32Size(io.encodeZigZag32(value));
}
io.computeSLongFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSLongSize(value);
}

io.computeSLongSize = function (value) {
    return io.computeVar32Size(io.encodeZigZag64(value));
}