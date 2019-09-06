if (typeof io == "undefined") {
    io = {}
}

function CSStrMessage() {

    this.success = false;
    this.message = "aa";
    this.serializedSize = 0;

    this.getMessageId = function () {
        return 5;
    }

}

CSStrMessage.prototype.write = function (buf) {

    buf.writeVar32(8);
    buf.writeBoolean(this.success);
    buf.writeVar32(19);
    buf.writeString(this.message)
}
CSStrMessage.prototype.getSerializedSize = function () {

    var size = this.serializedSize;
    if (size != -1) {
        return size;
    }
    size = 0;
    size += 2;
    if (message != null) {
        size += 3;
    }
    this.serializedSize = size;
    return size;

}