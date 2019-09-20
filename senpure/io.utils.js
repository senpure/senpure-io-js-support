io.BinaryConstants = {}
io.BinaryConstants.FLOAT32_EPS = 1.401298464324817E-45;
io.BinaryConstants.FLOAT32_MIN = 1.1754943508222875E-38;
io.BinaryConstants.FLOAT32_MAX = 3.4028234663852886E38;
io.BinaryConstants.FLOAT64_EPS = 4.9E-324;
io.BinaryConstants.FLOAT64_MIN = 2.2250738585072014E-308;
io.BinaryConstants.FLOAT64_MAX = 1.7976931348623157E308;
io.BinaryConstants.TWO_TO_20 = 1048576;
io.BinaryConstants.TWO_TO_23 = 8388608;
io.BinaryConstants.TWO_TO_31 = 2147483648;
io.BinaryConstants.TWO_TO_32 = 4294967296;
io.BinaryConstants.TWO_TO_52 = 4503599627370496;
io.BinaryConstants.TWO_TO_53 = 9007199254740992;
io.BinaryConstants.TWO_TO_56 = 0x100000000000000;
io.BinaryConstants.TWO_TO_63 = 0x7fffffffffffffff;
io.BinaryConstants.TWO_TO_64 = 1.8446744073709552E19;
io.utils = {}
io.utils.split64Low = 0;
io.utils.split64High = 0;

io.utils.splitUint64 = function (value) {
    var lowBits = value >>> 0;
    var highBits = Math.floor((value - lowBits) / io.BinaryConstants.TWO_TO_32) >>> 0;
    io.utils.split64High = highBits;
    io.utils.split64Low = lowBits;
};

io.utils.splitInt64 = function (value) {
    var sign = (value < 0);
    value = Math.abs(value);
    //丢弃高32位 == value|0;
    var lowBits = value >>> 0;
    //用除法代替位移获取高32位
    var highBits = Math.floor((value - lowBits) / io.BinaryConstants.TWO_TO_32);
    highBits = highBits >>> 0;
    //负数用反码表示
    if (sign) {
        highBits = ~highBits >>> 0;
        lowBits = ~lowBits >>> 0;
        lowBits += 1;
        if (lowBits > 0xFFFFFFFF) {
            lowBits = 0;
            highBits++;
            if (highBits > 0xFFFFFFFF) {
                highBits = 0;
            }
        }
    }
    io.utils.split64High = highBits;
    io.utils.split64Low = lowBits;
};

io.utils.splitZigzag64 = function (value) {
    var sign = (value < 0);
    value = Math.abs(value) * 2;
    io.utils.splitUint64(value);
    var lowBits = io.utils.split64Low;
    var highBits = io.utils.split64High;
    if (sign) {
        if (lowBits == 0) {
            if (highBits == 0) {
                lowBits = 0xFFFFFFFF;
                highBits = 0xFFFFFFFF;
            } else {
                highBits--;
                lowBits = 0xFFFFFFFF;
            }
        } else {
            lowBits--;
        }
    }
    io.utils.split64High = highBits;
    io.utils.split64Low = lowBits;

}

io.utils.joinUint64 = function (highBits, lowBits) {
    return highBits * io.BinaryConstants.TWO_TO_32 + (lowBits >>> 0);
};

io.utils.joinInt64 = function (highBits, lowBits) {
    var sign = (highBits & 0x80000000);
    if (sign) {
        lowBits = (~lowBits + 1) >>> 0;
        highBits = ~highBits >>> 0;
        if (lowBits == 0) {
            highBits = (highBits + 1) >>> 0;
        }
    }
    var result = io.utils.joinUint64(highBits, lowBits);
    return sign ? -result : result;
};

io.utils.joinZigzag64 = function (bitsHigh, bitsLow) {
    var signFlipMask = -(bitsLow & 1);
    bitsLow = ((bitsLow >>> 1) | (bitsHigh << 31)) ^ signFlipMask;
    bitsHigh = (bitsHigh >>> 1) ^ signFlipMask;
  //  var result = io.utils.joinUint64(bitsHigh, bitsLow);
   // return signFlipMask ? -result : result;
    return io.utils.joinInt64(bitsHigh, bitsLow);
}
