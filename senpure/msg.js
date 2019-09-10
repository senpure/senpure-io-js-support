CSStrMessage = function () {

    this.success = false;
    this.message = "aa";
    this.serializedSize = -1;
    this.getMessageId = function () {
        return CSStrMessage.MESSAGE_ID;
    }
}
CSStrMessage.MESSAGE_ID = 101;
CSStrMessage.prototype.write = function (buf) {
    buf.writeBooleanField(8, this.success);
    buf.writeStringField(19, this.message)
}
CSStrMessage.prototype.read = function (buf, endIndex) {
    while (true) {
        var tag = buf.readTag(endIndex);
        switch (tag) {
            case 0://end
                return;
            case 8:// 1 << 3 | 0
                this.success = buf.readBoolean();
                break;
            case 19:// 2 << 3 | 3
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
    size += io.computeBooleanFieldSize(1, this.success);
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
    str += "CSStrMessage[101]{";
    str += "\n";
    str += indent + rightPad("success", filedPad) + " = " + this.success;
    str += "\n";
    str += indent + rightPad("message", filedPad) + " = " + this.message;
    str += "\n";
    str += "}";
    return str;
}
CSStrMessage.messageDecoder = function () {
    this.getEmptyMessage = function () {
        return new CSStrMessage();
    }
}
io.regMessageDecoder(CSStrMessage.MESSAGE_ID, new CSStrMessage.messageDecoder, "CSStrMessage");
console.debug("msg is success")
