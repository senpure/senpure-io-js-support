io._computeVar32Size = function (value) {
    if ((value & -128) === 0) {
        return 1;
    } else if ((value & -16384) === 0) {
        return 2;
    } else if ((value & -2097152) === 0) {
        return 3;
    } else {
        return (value & -268435456) === 0 ? 4 : 5;
    }
};
io._computeVar64Size = function (value) {
    if (value < 0) {
        return 10;
    } else if (value < 128) {
        return 1;
    } else if (value < 16384) {
        return 2;
    } else if (value < 2097152) {
        return 3;
    } else if (value < 268435456) {
        return 4;
    } else if (value < 34359738368) {
        return 5;
    } else if (value < 4398046511104) {
        return 6;
    } else if (value < 562949953421312) {
        return 7;
        //56
    } else if (value < 0x100000000000000) {
        return 8;
        //63
    } else if (value <= 0x7fffffffffffffff) {
        return 9;
    }
};

io.computeBeanFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + value.getSerializedSize();
};

io.computeVar32FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar32Size(value);
};
io.computeVar32Size = function (value) {
    return value >= 0 ? io._computeVar32Size(value) : 5;
};

io.computeVar64FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar64Size(value);
};

io.computeVar64Size = function (value) {
    return value >= 0 ? io._computeVar64Size(value) : 10;
};
io.computeStringFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeStringSize(value);
};
io.computeStringSize = function (value) {
    var buf = Buffer.from(value);
    return buf.length + io.computeVar32Size(buf.length);
};

io.computeBooleanFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeBooleanSize(value);
};
io.computeBooleanSize = function (value) {
    return 1;
};
io.computeFloatFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeFloatSize(value);
};

io.computeFloatSize = function (value) {
    return 4;
};
io.computeDoubleFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeDoubleSize(value);
};

io.computeDoubleSize = function (value) {
    return 8;
}
io.computeFixed32FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeFixed32Size(value);
};

io.computeFixed32Size = function (value) {
    return 4;
};

io.computeFixed64FieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeFixed64Size(value);
};

io.computeFixed64Size = function (value) {
    return 8;
};
io.computeSIntFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSIntFieldSize(value);
};


io.computeSIntSize = function (value) {
    return io.computeVar32Size(io.encodeZigZag32(value));
};
io.computeSLongFieldSize = function (tagVar32Size, value) {
    return tagVar32Size + io.computeSLongSize(value);
};

io.computeSLongSize = function (value) {
    if (value >= -64 && value < 64) {
        return 1;
    } else if (value >= -8192 && value < 8192) {
        return 2;
    } else if (value >= -1048576 && value < 1048576) {
        return 3;
    } else if (value >= -134217728 && value < 134217728) {
        return 4;
    } else if (value >= -17179869184 && value < 17179869184) {
        return 5;
    } else if (value >= -2199023255552 && value < 2199023255552) {
        return 6;
    } else if (value >= -281474976710656 && value < 281474976710656) {
        return 7;
    } else if (value >= -36028797018963968 && value < 36028797018963968) {
        return 8;
    } else if (value >= -4611686018427387904 && value < 4611686018427387904) {
        return 9;
    } else {
        return 10;
    }
};