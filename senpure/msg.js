CSStrMessage = function () {

    this.message = "aa";
    this.serializedSize = -1;
    this.getMessageId = function () {
        return CSStrMessage.MESSAGE_ID;
    }
}
CSStrMessage.MESSAGE_ID = 1000109;
CSStrMessage.prototype.write = function (buf) {
    buf.writeStringField(11, this.message)
}
CSStrMessage.prototype.read = function (buf, endIndex) {
    while (true) {
        var tag = buf.readTag(endIndex);
        switch (tag) {
            case 0://end
                return;
            case 11://
                this.message = buf.readString();
                break;
            default://skip
                buf.skipTag(tag);
                break;
        }
    }
}

CSStrMessage.prototype.getSerializedSize = function () {
    var size = this.serializedSize;
    if (size != -1) {
        return size;
    }
    size = 0;
    if (this.message != null) {
        size += io.computeStringFieldSize(1, this.message);
    }
    this.serializedSize = size;
    return size;

}

CSStrMessage.prototype.toString = function (indent) {
    var filedPad = 7;
    indent = indent == undefined ? "" : indent;

    var str = "";
    str += "CSStrMessage[1000109]{";
    str += "\n";
    str += "\n";
    str += indent + rightPad("message", filedPad) + " = " + this.message;
    str += "\n";
    str += "}";
    return str;
}
CSStrMessage.MessageDecoder = function () {
    this.getEmptyMessage = function ()  {
        return new CSStrMessage();
    }
}


io.regMessageDecoder(CSStrMessage.MESSAGE_ID, new CSStrMessage.MessageDecoder(), "CSStrMessage");

CSLongMessage = function () {

    this.value = 0;
    this.serializedSize = -1;
    this.getMessageId = function () {
        return CSLongMessage.MESSAGE_ID;
    }
};
CSLongMessage.MESSAGE_ID = 1000107;
CSLongMessage.prototype.write = function (buf) {
    buf.writeVar64Field(8, this.value);
}
CSLongMessage.prototype.read =function (buf, endIndex) {
    while (true) {
        var tag = buf.readTag(endIndex);
        switch (tag) {
            case 0://end
                return;
            case 8:// 1 << 3 | 0
                this.value= buf.readVar64();
                break;
            default://skip
                buf.skipTag(tag);
                break;
        }
    }
};

CSLongMessage.prototype.getSerializedSize = function () {
    var size = this.serializedSize;
    if (size != -1) {
        return size;
    }
    size = 0;
    size += io.computeVar64FieldSize(1, this.value);
    this.serializedSize = size;
    return size;

}

CSLongMessage.prototype.toString = function (indent) {
    var filedPad = 7;
    indent = indent == undefined ? "" : indent;

    var str = "";
    str += "CSStrMessage[1000107]{";
    str += "\n";
    str += indent + rightPad("value", filedPad) + " = " + this.value
    str += "\n";
    str += "}";
    return str;
}
CSLongMessage.MessageDecoder = function () {
    this.getEmptyMessage = function () {
        return new CSLongMessage();
    }
};


io.regMessageDecoder(CSLongMessage.MESSAGE_ID, new CSLongMessage.MessageDecoder(), "CSLongMessage");
console.debug("msg is _success")
