import { IndexFormat } from "../../RenderEngine/RenderEnum/IndexFormat";
import { SpineMeshBase } from "../mesh/SpineMeshBase";
import { MultiRenderData } from "./MultiRenderData";

/**
 * @en Creator class for index buffer (IB) in spine rendering.
 * @zh Spine��Ⱦ�����ڴ���������������IB�����ࡣ
 */
export class IBCreator {
    type:IndexFormat;
    size:number;
   /**
     * @en The index buffer array.
     * @zh �������������顣
     */
    ib: Uint16Array|Uint32Array|Uint8Array;
    /**
     * @en The actual length of the index buffer.
     * @zh ������������ʵ�ʳ��ȡ�
     */
    ibLength: number;
    maxIndexCount:number
    /**
     * @en The output render data for multiple renders.
     * @zh ���ڶ�����Ⱦ�������Ⱦ���ݡ�
     */
    outRenderData: MultiRenderData;

    get realIb(): Uint16Array|Uint32Array|Uint8Array {
        return this.ib;
    }

    constructor(type:IndexFormat , maxIndexCount : number ) {
        this.type = type;
        this.maxIndexCount = maxIndexCount;
        // this.ib = new Uint16Array(SpineMeshBase.maxVertex * 3);
        switch (type) {
            case IndexFormat.UInt16:
                this.size = 2;
                this.ib = new Uint16Array(maxIndexCount);
                break;
            case IndexFormat.UInt8:
                this.size = 1;
                this.ib = new Uint8Array(maxIndexCount);
                break;
                
            case IndexFormat.UInt32:
                this.size = 4
                this.ib = new Uint32Array(maxIndexCount);
                break;
        }
        this.ibLength = 0;
    }
}