//@ts-nocheck
import { Laya } from "../../../Laya";
import { Node } from "../../display/Node";
import { Event } from "../../events/Event";
import { Loader } from "../../net/Loader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { SkyRenderer } from "../resource/models/SkyRenderer";
import { Shader3D } from "../shader/Shader3D";
import { ShaderData } from "../shader/ShaderData";
import { Sprite3D } from "./Sprite3D";
import { Scene3D } from "./scene/Scene3D";
import { ShaderDefine } from "../shader/ShaderDefine";
import { CommandUniformMap } from "./scene/Scene3DShaderDeclaration";
import { UniformBufferParamsType, UnifromBufferData } from "../graphics/UniformBufferData";
import { ShaderDataType } from "./render/command/SetShaderDataCMD";

/**
 * <code>BaseCamera</code> 类用于创建摄像机的父类。
 */
export class BaseCamera extends Sprite3D {
	/** @internal CameraUniformBlock Map */
	static cameraUniformMap: CommandUniformMap;
	/**Camera Uniform PropertyID */
	/**@internal */
	static CAMERAPOS: number;
	/**@internal */
	static VIEWMATRIX: number;
	/**@internal */
	static PROJECTMATRIX: number;
	/**@internal */
	static VIEWPROJECTMATRIX: number;
	/**@internal */
	static CAMERADIRECTION: number;
	/**@internal */
	static CAMERAUP: number;
	/**@internal */
	static VIEWPORT: number;
	/**@internal */
	static PROJECTION_PARAMS;
	/**@internal */
	static DEPTHTEXTURE: number;
	/**@internal */
	static DEPTHNORMALSTEXTURE: number;
	/**@internal */
	static DEPTHZBUFFERPARAMS: number;
	/**Camera Define*/
	/**@internal */
	static SHADERDEFINE_DEPTH: ShaderDefine;
	/**@internal */
	static SHADERDEFINE_DEPTHNORMALS: ShaderDefine;
	/**渲染模式,延迟光照渲染，暂未开放。*/
	static RENDERINGTYPE_DEFERREDLIGHTING: string = "DEFERREDLIGHTING";
	/**渲染模式,前向渲染。*/
	static RENDERINGTYPE_FORWARDRENDERING: string = "FORWARDRENDERING";
	/**@internal */
	protected static _invertYScaleMatrix: Matrix4x4 = new Matrix4x4(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);//Matrix4x4.createScaling(new Vector3(1, -1, 1), _invertYScaleMatrix);
	/**@internal */
	protected static _invertYProjectionMatrix: Matrix4x4 = new Matrix4x4();
	/**@internal */
	protected static _invertYProjectionViewMatrix: Matrix4x4 = new Matrix4x4();
	/**@internal */
	static _tempMatrix4x40: Matrix4x4 = new Matrix4x4();

	/**
	 * @internal
	 * shaderInfo init
	 */
	static shaderValueInit() {
		BaseCamera.SHADERDEFINE_DEPTH = Shader3D.getDefineByName("DEPTHMAP");
		BaseCamera.SHADERDEFINE_DEPTHNORMALS = Shader3D.getDefineByName("DEPTHNORMALSMAP");
		BaseCamera.cameraUniformMap = CommandUniformMap.createGlobalUniformMap("BaseCamera");
		BaseCamera.CAMERAPOS = Shader3D.propertyNameToID("u_CameraPos");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.CAMERAPOS, "u_CameraPos");
		BaseCamera.VIEWMATRIX = Shader3D.propertyNameToID("u_View");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.VIEWMATRIX, "u_View");
		BaseCamera.PROJECTMATRIX = Shader3D.propertyNameToID("u_Projection");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.PROJECTMATRIX, "u_Projection");
		BaseCamera.VIEWPROJECTMATRIX = Shader3D.propertyNameToID("u_ViewProjection");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.VIEWPROJECTMATRIX, "u_ViewProjection");
		BaseCamera.CAMERADIRECTION = Shader3D.propertyNameToID("u_CameraDirection");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.CAMERADIRECTION, "u_CameraDirection");
		BaseCamera.CAMERAUP = Shader3D.propertyNameToID("u_CameraUp");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.CAMERAUP, "u_CameraUp");
		BaseCamera.VIEWPORT = Shader3D.propertyNameToID("u_Viewport");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.VIEWPORT, "u_Viewport");
		BaseCamera.PROJECTION_PARAMS = Shader3D.propertyNameToID("u_ProjectionParams");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.PROJECTION_PARAMS, "u_ProjectionParams");
		BaseCamera.DEPTHTEXTURE = Shader3D.propertyNameToID("u_CameraDepthTexture");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.DEPTHTEXTURE, "u_CameraDepthTexture");
		BaseCamera.DEPTHNORMALSTEXTURE = Shader3D.propertyNameToID("u_CameraDepthNormalsTexture");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.DEPTHNORMALSTEXTURE, "u_CameraDepthNormalsTexture");
		BaseCamera.DEPTHZBUFFERPARAMS = Shader3D.propertyNameToID("u_ZBufferParams");
		BaseCamera.cameraUniformMap.addShaderUniform(BaseCamera.DEPTHZBUFFERPARAMS, "u_ZBufferParams");
	}

	/**
	 * create BaseCamera UniformBuffer
	 * @internal
	 * @returns 
	 */
	static createSceneUniformBlock() {
		let uniformPara: Map<string, UniformBufferParamsType> = new Map<string, UniformBufferParamsType>();
		uniformPara.set("u_View", UniformBufferParamsType.Matrix4x4);
		uniformPara.set("u_Projection", UniformBufferParamsType.Matrix4x4);
		uniformPara.set("u_ViewProjection", UniformBufferParamsType.Matrix4x4);
		uniformPara.set("u_ProjectionParams", UniformBufferParamsType.Vector4);
		uniformPara.set("u_Viewport", UniformBufferParamsType.Vector4);
		uniformPara.set("u_CameraDirection", UniformBufferParamsType.Vector3);
		uniformPara.set("u_CameraUp", UniformBufferParamsType.Vector3);
		uniformPara.set("u_CameraPos", UniformBufferParamsType.Vector3);
		return new UnifromBufferData(uniformPara);
	}
	/**
	 * Camera Init
	 */
	static __init__() {
		BaseCamera.shaderValueInit();
	}

	/** @internal 渲染顺序。*/
	_renderingOrder: number
	/** @internal */
	_cameraUniformBlock: UnifromBufferData;
	/** 近裁剪面。*/
	protected _nearPlane: number;
	/** 远裁剪面。*/
	protected _farPlane: number;
	/** 视野。*/
	private _fieldOfView: number;
	/** 正交投影的垂直尺寸。*/
	private _orthographicVerticalSize: number;
	/** skyRender */
	private _skyRenderer: SkyRenderer = new SkyRenderer();
	/** 前向量*/
	private _forward: Vector3 = new Vector3();
	/** up向量 */
	private _up: Vector3 = new Vector3();
	/** 是否正交 */
	protected _orthographic: boolean;
	/**@internal 是否使用用户自定义投影矩阵，如果使用了用户投影矩阵，摄像机投影矩阵相关的参数改变则不改变投影矩阵的值，需调用ResetProjectionMatrix方法。*/
	protected _useUserProjectionMatrix: boolean;

	/** @internal 着色器数据*/
	_shaderValues: ShaderData;

	/**摄像机的清除颜色,默认颜色为CornflowerBlue。*/
	clearColor: Vector4 = new Vector4(100 / 255, 149 / 255, 237 / 255, 255 / 255);
	/** 可视层位标记遮罩值,支持混合 例:cullingMask=Math.pow(2,0)|Math.pow(2,1)为第0层和第1层可见。*/
	cullingMask: number;
	/** 渲染时是否用遮挡剔除。 */
	useOcclusionCulling: boolean;

	/**
	 * 天空渲染器。
	 */
	get skyRenderer(): SkyRenderer {
		return this._skyRenderer;
	}

	/**
	 * 视野。
	 */
	get fieldOfView(): number {
		return this._fieldOfView;
	}

	set fieldOfView(value: number) {
		this._fieldOfView = value;
		this._calculateProjectionMatrix();
	}

	/**
	 * 近裁面。
	 */
	get nearPlane(): number {
		return this._nearPlane;
	}

	set nearPlane(value: number) {
		this._nearPlane = value;
		this._calculateProjectionMatrix();
	}

	/**
	 * 远裁面。
	 */
	get farPlane(): number {
		return this._farPlane;
	}

	set farPlane(vaule: number) {
		this._farPlane = vaule;
		this._calculateProjectionMatrix();
	}

	/**
	 * 是否正交投影矩阵。
	 */
	get orthographic(): boolean {
		return this._orthographic;
	}

	set orthographic(vaule: boolean) {
		this._orthographic = vaule;
		this._calculateProjectionMatrix();
	}

	/**
	 * 正交投影垂直矩阵尺寸。
	 */
	get orthographicVerticalSize(): number {
		return this._orthographicVerticalSize;
	}

	set orthographicVerticalSize(vaule: number) {
		this._orthographicVerticalSize = vaule;
		this._calculateProjectionMatrix();
	}

	/**
	 * 渲染顺序
	 */
	get renderingOrder(): number {
		return this._renderingOrder;
	}

	set renderingOrder(value: number) {
		this._renderingOrder = value;
		this._sortCamerasByRenderingOrder();
	}

	/**
	 * 创建一个 <code>BaseCamera</code> 实例。
	 * @param	fieldOfView 视野。
	 * @param	nearPlane 近裁面。
	 * @param	farPlane 远裁面。
	 */
	constructor(nearPlane: number = 0.3, farPlane: number = 1000) {
		super();
		this._shaderValues = new ShaderData(null);

		this._fieldOfView = 60;
		this._useUserProjectionMatrix = false;
		this._orthographic = false;

		this._orthographicVerticalSize = 10;
		this.renderingOrder = 0;

		this._nearPlane = nearPlane;
		this._farPlane = farPlane;

		this.cullingMask = 2147483647/*int.MAX_VALUE*/;
		this.useOcclusionCulling = true;
		if (Config3D._config._uniformBlock) {
			this._cameraUniformBlock = BaseCamera.createSceneUniformBlock();
		}
	}



	/**
	 * @internal
	 */
	protected _calculateProjectionMatrix(): void {
	}

	/**
	 * @internal
	 */
	protected _onScreenSizeChanged(): void {
		this._calculateProjectionMatrix();
	}

	/**
	 * @internal
	 */
	protected _create(): Node {
		return new BaseCamera();
	}

	/**
	 * 通过RenderingOrder属性对摄像机机型排序。
	 * @internal
	 */
	_sortCamerasByRenderingOrder(): void {
		if (this.displayedInStage) {
			var cameraPool: BaseCamera[] = this.scene._cameraPool;//TODO:可优化，从队列中移除再加入
			var n: number = cameraPool.length - 1;
			for (var i: number = 0; i < n; i++) {
				if (cameraPool[i].renderingOrder > cameraPool[n].renderingOrder) {
					var tempCamera: BaseCamera = cameraPool[i];
					cameraPool[i] = cameraPool[n];
					cameraPool[n] = tempCamera;
				}
			}
		}
	}

	/**
	 * @internal
	 */
	_prepareCameraToRender(): void {
		//var cameraSV: ShaderData = this._shaderValues;
		this.transform.getForward(this._forward);
		this.transform.getUp(this._up);
		this._setShaderValue(BaseCamera.CAMERAPOS, ShaderDataType.Vector3, this.transform.position);
		this._setShaderValue(BaseCamera.CAMERADIRECTION, ShaderDataType.Vector3, this._forward);
		this._setShaderValue(BaseCamera.CAMERAUP, ShaderDataType.Vector3, this._up);
	}

	/**
	 * @internal
	 */
	_setShaderValue(index: number, shaderDataType: ShaderDataType, value: any) {
		if (this._cameraUniformBlock && this._cameraUniformBlock._has(index))
			this._cameraUniformBlock._setData(index, shaderDataType, value);
		this._shaderValues.setValueData(index, value);
	}

	/**
	 * @internal
	 */
	_getShaderValue(index: number): any {
		return this._shaderValues.getValueData(index);
	}


	/**
	 * 相机渲染。
	 * @param	shader 着色器。
	 * @param   replacementTag 着色器替换标记。
	 */
	render(shader: Shader3D = null, replacementTag: string = null): void {
	}

	/**
	 * 增加可视图层,layer值为0到31层。
	 * @param layer 图层。
	 */
	addLayer(layer: number): void {
		this.cullingMask |= Math.pow(2, layer);
	}

	/**
	 * 移除可视图层,layer值为0到31层。
	 * @param layer 图层。
	 */
	removeLayer(layer: number): void {
		this.cullingMask &= ~Math.pow(2, layer);
	}

	/**
	 * 增加所有图层。
	 */
	addAllLayers(): void {
		this.cullingMask = 2147483647/*int.MAX_VALUE*/;
	}

	/**
	 * 移除所有图层。
	 */
	removeAllLayers(): void {
		this.cullingMask = 0;
	}

	/**
	 * 重算计算投影矩阵
	 */
	resetProjectionMatrix(): void {
		this._useUserProjectionMatrix = false;
		this._calculateProjectionMatrix();
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	protected _onActive(): void {
		((<Scene3D>this._scene))._addCamera(this);
		super._onActive();
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	protected _onInActive(): void {
		((<Scene3D>this._scene))._removeCamera(this);
		super._onInActive();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @internal
	 */
	_parse(data: any, spriteMap: any): void {
		super._parse(data, spriteMap);

		this.orthographic = data.orthographic;
		(data.orthographicVerticalSize !== undefined) && (this.orthographicVerticalSize = data.orthographicVerticalSize);
		(data.fieldOfView !== undefined) && (this.fieldOfView = data.fieldOfView);
		this.nearPlane = data.nearPlane;
		this.farPlane = data.farPlane;

		var color: any[] = data.clearColor;
		this.clearColor = new Vector4(color[0], color[1], color[2], color[3]);
		var skyboxMaterial: any = data.skyboxMaterial;
		if (skyboxMaterial) {
			this._skyRenderer.material = Loader.getRes(skyboxMaterial.path);
		}
	}

	/**
	 * 删除相机
	 * @inheritDoc
	 * @override
	 * @param 是否删除节点
	 */
	destroy(destroyChild: boolean = true): void {
		//postProcess = null;
		//AmbientLight = null;
		this._skyRenderer.destroy();
		this._skyRenderer = null;

		Laya.stage.off(Event.RESIZE, this, this._onScreenSizeChanged);
		super.destroy(destroyChild);
	}

	/** @deprecated plaease use CameraClearFlags.SolidColor instead.*/
	static CLEARFLAG_SOLIDCOLOR: number = 0;
	/** @deprecated plaease use CameraClearFlags.Sky instead.*/
	static CLEARFLAG_SKY: number = 1;
	/** @deprecated plaease use CameraClearFlags.DepthOnly instead.*/
	static CLEARFLAG_DEPTHONLY: number = 2;
	/** @deprecated plaease use CameraClearFlags.Nothing instead.*/
	static CLEARFLAG_NONE: number = 3;
}

