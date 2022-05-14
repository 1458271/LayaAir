import { BoundFrustum } from "../../../../d3/math/BoundFrustum";
import { Matrix4x4 } from "../../../../d3/math/Matrix4x4";
import { NativeMemory } from "../CommonMemory/NativeMemory";


export class NativeBoundFrustum extends BoundFrustum {
    private static MemoryBlock_size = 17;
    private static Stride_UpdateFlag = 16;
    /**native Share Memory */
    private nativeMemory: NativeMemory;
    private float32Array: Float32Array;
    private int32Array: Int32Array;

	_nativeObj: any;
   	/**
	 * 创建一个 <code>BoundFrustum</code> 实例。
	 * @param	matrix 锥截体的描述4x4矩阵。
	 */
	constructor(matrix: Matrix4x4) {
        super(matrix);
        this.nativeMemory = new NativeMemory(NativeBoundFrustum.MemoryBlock_size * 4);
        this.float32Array = this.nativeMemory.float32Array;
        this.int32Array = this.nativeMemory.int32Array;
        this._nativeObj = new (window as any).conchBoundFrustum(this.nativeMemory._buffer);
		this.matrix = matrix;
	}

    set matrix(matrix: Matrix4x4) {
		matrix.cloneTo(this._matrix);
        //update Native Data  native拿到Frustumnative 需要更新plane
        this.float32Array.set(this._matrix.elements);
        this.int32Array[NativeBoundFrustum.Stride_UpdateFlag] = 1;
		BoundFrustum.getPlanesFromMatrix(this._matrix, this._near, this._far, this._left, this._right, this._top, this._bottom);
	}
}