declare function rightPad(str: string, length: number): string;

declare module 'io' {
    export = io;
}
declare namespace io {
    /**
     * 生成一个请求唯一表示
     */
    function nextRequestId(): number ;

    /**
     * 注册消息解码器
     * @param id sc消息id
     * @param decoder 解码器 主要生成一个新的消息对象
     * @param target 解码对象
     */
    function regMessageDecoder(id: number, decoder: MessageDecoder, target: string);

    class BufferOperator {
        constructor(data: Uint8Array);

        static from(data: Uint8Array): BufferOperator;

        static alloc(capacity: number): BufferOperator;

        /**
         * 丢弃一些度过的bytes
         */
        discardSomeReadBytes(): void;

        /**
         * 获取可读bytes长度
         */
        readableBytes(): number;

        /**
         * 是否可读
         */
        isReadable(): boolean;

        /**
         * 获取读index
         */
        getReaderIndex(): number;

        /**
         * 标记readerIndex
         */
        markReaderIndex(): void;

        /**
         * 将readerIndex置为标记的readerIndex
         */
        resetReaderIndex(): void;

        /**
         * 尝试扩缓存最大空间
         * @param length
         */
        ensureWritable(length: number): void;

        writeVar32(value: number): void;

        writeVar32Field(tag: number, value: number): void;

        writeVar64(value: number): void;

        writeVar64Field(tag: number, value: number): void;

        writeBoolean(value: boolean): void;

        writeBooleanField(tag: number, value: boolean): void;

        writeSInt(value: number): void;

        writeSIntField(tag: number, value: number): void;

        writeSLong(value: number): void;

        writeSLongField(tag: number, value: number): void;

        writeSFixed32(value: number): void;

        writeSFixed32Field(tag: number, value: number): void;

        writeSFixed64(value: number): void;

        writeSFixed64Field(tag: number, value: number): void;

        writeFloat(value: number): void;

        writeFloatField(tag: number, value: number): void;

        writeDouble(value: number): void;

        writeDoubleField(tag: number, value: number): void;

        writeString(value: string): void;

        writeStringField(tag: number, value: string): void;

        writeBeanField(tag: number, value: Bean): void;

        /**
         *读取一个tag
         * @param endIndex 结束位置
         */
        readTag(endIndex: number): number;

        /**
         * 跳过tag数据
         * @param tag
         */
        skipTag(tag: number): void;

        /**
         * 跳过指定长度的数据
         * @param length
         */
        skipBytes(length: number);

        /**
         * 尝试读取一个var32如果没有会调用一次resetReaderIndex()
         * <br>调用该方法之前请主动调用一个 markReaderIndex()
         *
         * @see markReaderIndex
         * @see resetReaderIndex
         */
        tryReadVar32(): number;

        readVar32(): number;

        readVar64(): number;

        readBoolean(): boolean;

        readString(): string;

        readSInt(): number;

        readSLong(): number;

        readSFixed32(): number;

        readSFixed64(): number;

        readFloat(): number;

        readDouble(): number;

        /**
         *读取数据填充一个空的bean
         * @param bean 一个空的bean
         */
        readBean(value: Bean): void;
    }

    class Bean {
        constructor();

        write(buf: BufferOperator): void;

        read(buf: BufferOperator, endIndex: number): void;

        getSerializedSize(): number;

        toString(indent?: string): string;
    }

    class Message extends Bean {
        //static MESSAGE_ID: number;
        getMessageId(): number;
    }


    class MessageDecoder {
        /**
         * 返回一个新的Message
         */
        getEmptyMessage(): Message;
    }

    function encodeZigZag32(value: number): number;

    function encodeZigZag64(value: number): number;

    function decodeZigZag32(value: number): number;

    function decodeZigZag64(value: number): number;

    /**
     * 计算var32的byte大小
     * @param value
     */
    function computeVar32Size(value: number): number;

    /**
     * @param tagVar32Size 已经经过计算的tag var32Size byte大小
     * @param value
     */
    function computeVar32FiledSize(tagVar32Size: number, value: number): number;

    /**
     * 计算var64的byte大小
     * @param value
     */
    function computeVar64Size(value: number): number;

    /**
     *
     * @param tagVar32Size 已经经过计算的tag var32Size byte大小
     * @param value
     */
    function computeVar64FiledSize(tagVar32Size: number, value: number): number;

    /**
     * 计算boolean的byte大小
     * @param value
     */
    function computeBooleanSize(value: boolean): number;

    function computeBooleanFiledSize(tagVar32Size: number, value: boolean): number;

    function computeSIntSize(value: number): number;

    function computeSIntFiledSize(tagVar32Size: number, value: number): number;

    function computeSLongSize(value: number): number;

    function computeSLongFiledSize(tagVar32Size: number, value: number): number;

    function computeSFixed32Size(value: number): number;

    function computeSFixed32FiledSize(tagVar32Size: number, value: number): number;

    function computeSFixed64Size(value: number): number;

    function computeSFixed64FiledSize(tagVar32Size: number, value: number): number;

    function computeFloatSize(value: number): number;

    function computeFloatFiledSize(tagVar32Size: number, value: number): number;

    function computeDoubleSize(value: number): number;

    function computeDoubleFiledSize(tagVar32Size: number, value: number): number;


    function computeStringSize(value: string): number;

    function computeStringFiledSize(tagVar32Size: number, value: string): number;


    function computeBeanSize(value: Bean): number;

    function computeBeanFiledSize(tagVar32Size: number, value: Bean): number;
}