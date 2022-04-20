import { CompareFunction } from "../../../RenderEngine/RenderEnum/CompareFunction";
import { CullMode } from "../../../RenderEngine/RenderEnum/CullMode";
import { DefineDatas } from "../../../RenderEngine/RenderShader/DefineDatas";
import { Camera } from "../../core/Camera";
import { GeometryElement } from "../../core/GeometryElement";
import { Material } from "../../core/material/Material";
import { RenderContext3D } from "../../core/render/RenderContext3D";
import { RenderElement } from "../../core/render/RenderElement";
import { Matrix4x4 } from "../../math/Matrix4x4";
import { Vector3 } from "../../math/Vector3";
import { SkyBox } from "./SkyBox";

/**
 * <code>SkyRenderer</code> 类用于实现天空渲染器。
 */
export class SkyRenderer {
	/** @internal */
	private static _tempMatrix0: Matrix4x4 = new Matrix4x4();
	/** @internal */
	private static _tempMatrix1: Matrix4x4 = new Matrix4x4();

	/** @internal */
	private _material: Material;
	/** @internal */
	private _mesh: GeometryElement;
	/**@internal */
	private _renderElement:RenderElement;


	/**
	 * 材质。
	 */
	get material(): Material {
		return this._material;
	}

	set material(value: Material) {
		if (this._material !== value) {
			(this._material) && (this._material._removeReference());
			(value) && (value._addReference());
			this._material = value;
			value.cull = CullMode.Off;
			value.depthTest = CompareFunction.LessEqual;
			value.depthWrite = false;
			value.stencilWrite = false;
			this._renderElement.material = value;
			this._renderElement.renderSubShader = this._material._shader.getSubShaderAt(0);
		}
	}

	/**
	 * 网格。
	 */
	get mesh(): GeometryElement {
		return this._mesh;
	}

	set mesh(value: GeometryElement) {
		if (this._mesh !== value) {
			this._mesh = value;
			this._renderElement.setGeometry(this._mesh);
		}
	}

	/**
	 * 创建一个新的 <code>SkyRenderer</code> 实例。
	 */
	constructor() {
		this._renderElement = new RenderElement();
		this.mesh = SkyBox.instance;
	}

	

	/**
	 * @internal
	 * 是否可用。
	 */
	_isAvailable(): boolean {
		return this._material && this._mesh ? true : false;
	}

	/**
	 * @internal
	 */
	_render(context: RenderContext3D): void {
		if (this._material && this._mesh) {
			var camera: Camera = context.camera;

			if (camera.orthographic)
			Matrix4x4.createPerspective(camera.fieldOfView, camera.aspectRatio, camera.nearPlane, camera.farPlane, projectionMatrix);

			//无穷投影矩阵算法,DirectX右手坐标系推导
			//http://terathon.com/gdc07_lengyel.pdf

			//xScale  0     0                          0
			//0     yScale  0                          0
			//0       0    	-zfar /(zfar-znear)        -1.0
			//0       0     -znear*zfar /(zfar-znear)  0

			//xScale  0     0       0        mul   [x,y,z,0] =[xScale*x,yScale*y,-z,-z]
			//0     yScale  0       0		
			//0       0    	-1      -1.0	
			//0       0     -0      0

			//[xScale*x,yScale*y,-z,-z]=>[-xScale*x/z,-yScale*y/z,1]

			//xScale  0     0       0      
			//0     yScale  0       0		
			//0       0    	-1+e    -1.0	
			//0       0     -0  0
			var viewMatrix: Matrix4x4 = SkyRenderer._tempMatrix0;
			var projectionMatrix: Matrix4x4 = SkyRenderer._tempMatrix1;
			camera.viewMatrix.cloneTo(viewMatrix);//视图矩阵逆矩阵的转置矩阵，移除平移和缩放
			camera.projectionMatrix.cloneTo(projectionMatrix);
			viewMatrix.setTranslationVector(Vector3._ZERO);
			var epsilon: number = 1e-6;
			var yScale: number = 1.0 / Math.tan(3.1416 * camera.fieldOfView / 180 * 0.5);
			projectionMatrix.elements[0] = yScale / camera.aspectRatio;
			projectionMatrix.elements[5] = yScale;
			projectionMatrix.elements[10] = epsilon - 1.0;
			projectionMatrix.elements[11] = -1.0;
			projectionMatrix.elements[14] = -0;//znear无穷小
			if((camera as any).isWebXR){
				(<Camera>camera)._applyViewProject(context, viewMatrix, camera.projectionMatrix);//TODO:优化 不应设置给Camera直接提交
			}else{
				(<Camera>camera)._applyViewProject(context, viewMatrix, projectionMatrix);//TODO:优化 不应设置给Camera直接提交
			}
			
			context._contextOBJ.applyContext();
			this._renderElement._renderUpdatePre(context);
			this._renderElement._render(context._contextOBJ);
			camera._applyViewProject(context, camera.viewMatrix, camera.projectionMatrix);
		}
	}

	/**
	 * @internal
	 */
	destroy(): void {
		if (this._material) {
			this._material._removeReference();
			this._material = null;
		}

	}

}


