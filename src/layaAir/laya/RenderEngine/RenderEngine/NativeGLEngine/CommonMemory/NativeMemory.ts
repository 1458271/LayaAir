import { CommonMemoryAllocater } from "./CommonMemoryAllocater";

export class NataiveMemory {
    static NativeSourceID:number = 0;
    /**@internal 共享内存数据 */
    protected _buffer: ArrayBuffer;
    /**@internal 显示数据 */
    protected _bufferData: Float32Array | Uint16Array | Uint8Array | Int32Array;
    /**数据长度 */
    protected _byteLength: number;
    /**销毁标记 */
    protected _destroyed: boolean;
    /**数据资源 */
    protected _id:number;
    /**
     * 实例化一个共享内存
     * @param size byteLength
     */
    constructor(size: number) {
        this._buffer = CommonMemoryAllocater.creatBlock(size);
        this._byteLength = size;
        this._id
    }

    /**
     * Float32Array Data
     */
    get float32Array(): Float32Array {
        if (!(this._bufferData instanceof Float32Array))
            this._bufferData = new Float32Array(this._buffer);
        return <Float32Array>this._bufferData;
    }

    /**
     * Uint16Array Data
     */
    get uint16Array(): Uint16Array {
        if (!(this._bufferData instanceof Uint16Array))
            this._bufferData = new Uint16Array(this._buffer);
        return <Uint16Array>this._bufferData;
    }

    /**
     * Uint8Array Data
     */
    get uint8Array(): Uint8Array {
        if (!(this._bufferData instanceof Uint8Array))
            this._bufferData = new Uint8Array(this._buffer);
        return <Uint8Array>this._bufferData;
    }

    /**
     * Int32Array Data
     */
    get int32Array(): Int32Array {
        if (!(this._bufferData instanceof Int32Array))
            this._bufferData = new Int32Array(this._buffer);
        return <Int32Array>this._bufferData;
    }

    /**
     * 设置数据
     * @param data 数据
     * @param stride 字节偏移
     * //TODO 字节对齐
     */
    setData(data:Uint8Array|Uint16Array|Uint32Array|Int32Array|Float32Array,stride:number):void{
        if(data instanceof Uint8Array){
           this.uint8Array.set(data,stride/2);
            return;
        }
        else if(data instanceof Uint16Array){
           this.uint16Array.set(data,stride/2);
            return;
        }else{
           this.float32Array.set(data,stride/4);
            return;
        }
    }

    /**
     * 设置多个参数
     * @param offset 
     * @param args 
     * 考虑字节对齐
     */
    setDataByParams(offset:number,...args: number[]):void{
        if(args)
        {
            for(let i=0,n:number=args.length;i<n;i++)
            this._bufferData[i+offset]=args[i];
        }
    }

    /**
     * 扩充buffer
     * @param size 
     * @returns 
     */
    expand(size: number) {
        if(size<=this._byteLength)
            return;
        this._byteLength = size;
        CommonMemoryAllocater.freeMemoryBlock(this._buffer);
        this.clear();
        this._buffer = CommonMemoryAllocater.creatBlock(size);
    }

    /**
     * 删除
     * @returns 
     */
    destroy() {
        if(this._destroyed)
            return;
        this.clear();
        CommonMemoryAllocater.freeMemoryBlock(this._buffer);
        this._destroyed = true;
    }

    /**
     * 清楚
     */
    clear(): void {
        this._bufferData = null;
    }
}