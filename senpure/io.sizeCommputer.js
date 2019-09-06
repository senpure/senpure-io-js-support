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
io.computeVar32Size = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar32SizeNoTag(value);
}
io.computeVar32SizeNoTag = function (value) {
    return value >= 0 ? io._computeVar32Size(value) : 5;
}
io.computeVar64Size = function (tagVar32Size, value) {
    return tagVar32Size + io.computeVar64SizeNoTag(value);
}
io.computeVar64SizeNoTag = function (value) {
    return value >= 0 ? io._computeVar64Size(value) : 10;
}

io.computeStringSizeNoTag = function (tagVar32Size, value) {
    return tagVar32Size + io.computeStringSizeNoTag(value);
}

io.computeStringSizeNoTag = function (value) {
    var buf = Buffer.from(value);
    return buf.length + io.computeVar32SizeNoTag(buf.length);
}