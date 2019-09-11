
///<reference path="io.d.ts"/>

declare namespace  CSStrMessage{

    class MessageDecoder extends io.MessageDecoder{
    }
}
declare  class CSStrMessage  extends io.Message{
    static MESSAGE_ID: number;
    constructor();
    getMessageId2():number;
}


