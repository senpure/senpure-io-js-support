declare function rightPad(str: string, length: number): string;

declare namespace io {
    /**
     * 计算var32的byte大小
     * @param value
     */
    function computeVar32Size(value: number): number;

    /**
     * 计算出字段的大小
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
     * 计算出字段的大小
     * @param tagVar32Size 已经经过计算的tag var32Size byte大小
     * @param value
     */
    function computeVar64FiledSize(tagVar32Size: number, value: number): number;
}