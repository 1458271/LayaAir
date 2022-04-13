import { ILaya } from "../../../ILaya"
import { Texture2D } from "../../resource/Texture2D"
import { Camera } from "../core/Camera"
import { CommandBuffer } from "../core/render/command/CommandBuffer"
import { PostProcessEffect } from "../core/render/PostProcessEffect"
import { PostProcessRenderContext } from "../core/render/PostProcessRenderContext"
import { Viewport } from "../math/Viewport"
import { RenderContext3D } from "../core/render/RenderContext3D"
import { RenderTexture } from "../resource/RenderTexture"
import { ShaderDefine } from "../../RenderEngine/RenderShader/ShaderDefine"
import { Shader3D } from "../../RenderEngine/RenderShader/Shader3D"
import { ShaderData } from "../../RenderEngine/RenderShader/ShaderData"
import { LayaGL } from "../../layagl/LayaGL"

/**
 * <code>PostProcess</code> 类用于创建后期处理组件。
 */
export class PostProcess {
	/**@internal */
	static SHADERDEFINE_BLOOM_LOW: ShaderDefine;
	/**@internal */
	static SHADERDEFINE_BLOOM: ShaderDefine;
	/**@internal */
	static SHADERDEFINE_FINALPASS: ShaderDefine;
	/**@internal */
	static SHADERVALUE_MAINTEX: number;
	/**@internal */
	static SHADERVALUE_BLOOMTEX: number;
	/**@internal */
	static SHADERVALUE_AUTOEXPOSURETEX: number;
	/**@internal */
	static SHADERVALUE_BLOOM_DIRTTEX: number;
	/**@internal */
	static SHADERVALUE_BLOOMTEX_TEXELSIZE: number;
	/**@internal */
	static SHADERVALUE_BLOOM_DIRTTILEOFFSET: number;
	/**@internal */
	static SHADERVALUE_BLOOM_SETTINGS: number;
	/**@internal */
	static SHADERVALUE_BLOOM_COLOR: number;

	/**
	 * @internal
	 */
	static __init__(): void {
		PostProcess.SHADERDEFINE_BLOOM_LOW = Shader3D.getDefineByName("BLOOM_LOW");
		PostProcess.SHADERDEFINE_BLOOM = Shader3D.getDefineByName("BLOOM");
		PostProcess.SHADERDEFINE_FINALPASS = Shader3D.getDefineByName("FINALPASS");
		PostProcess.SHADERVALUE_MAINTEX = Shader3D.propertyNameToID("u_MainTex");
		PostProcess.SHADERVALUE_BLOOMTEX = Shader3D.propertyNameToID("u_BloomTex");
		PostProcess.SHADERVALUE_AUTOEXPOSURETEX = Shader3D.propertyNameToID("u_AutoExposureTex");
		PostProcess.SHADERVALUE_BLOOM_DIRTTEX = Shader3D.propertyNameToID("u_Bloom_DirtTex");
		PostProcess.SHADERVALUE_BLOOMTEX_TEXELSIZE = Shader3D.propertyNameToID("u_BloomTex_TexelSize");
		PostProcess.SHADERVALUE_BLOOM_DIRTTILEOFFSET = Shader3D.propertyNameToID("u_Bloom_DirtTileOffset");
		PostProcess.SHADERVALUE_BLOOM_SETTINGS = Shader3D.propertyNameToID("u_Bloom_Settings");
		PostProcess.SHADERVALUE_BLOOM_COLOR = Shader3D.propertyNameToID("u_Bloom_Color");


	}

	/**@internal */
	private _compositeShader: Shader3D = Shader3D.find("PostProcessComposite");
	/**@internal */
	private _compositeShaderData: ShaderData = LayaGL.renderOBJCreate.createShaderData(null);
	/**@internal */
	private _effects: PostProcessEffect[] = [];
	/**@internal */
	private _enable: boolean = true;
	/**@internal */
	_context: PostProcessRenderContext | null = null;


	/**
	 * 创建一个 <code>PostProcess</code> 实例。
	 */
	constructor() {
		this._context = new PostProcessRenderContext();
		this._context.compositeShaderData = this._compositeShaderData;
		this._context.command = new CommandBuffer();
	}

	get enable(): boolean {
		return this._enable;
	}

	set enable(value: boolean) {
		this._enable = value;
	}

	set commandContext(oriContext: RenderContext3D) {
		this._context.command._context = oriContext;
	}


	/**
	 *@internal
	 */
	_init(camera: Camera): void {
		this._context!.camera = camera;
		this._context!.command!._camera = camera;
	}

	/**
	 * @internal
	 */
	_render(): void {
		var camera = this._context!.camera;
		var viewport: Viewport = camera!.viewport;

		var cameraTarget: RenderTexture = camera!._internalRenderTexture;
		var screenTexture: RenderTexture = RenderTexture.createFromPool(cameraTarget.width, cameraTarget.height, camera._getRenderTextureFormat(), null, false, 1);
		var Indirect: RenderTexture[] = [RenderTexture.createFromPool(cameraTarget.width, cameraTarget.height, camera._getRenderTextureFormat(), null,false,1),RenderTexture.createFromPool(cameraTarget.width, cameraTarget.height, camera._getRenderTextureFormat(), null,false,1)];
		//var screenTexture: RenderTexture = cameraTarget;
		this._context!.command!.clear();
		this._context!.source = screenTexture;
		this._context!.indirectTarget = screenTexture;
		this._context!.destination = cameraTarget;
		this._context!.compositeShaderData!.clearDefine();

		this._context.command.blitScreenTriangle(cameraTarget, screenTexture);

		this._context!.compositeShaderData!.setTexture(PostProcess.SHADERVALUE_AUTOEXPOSURETEX, Texture2D.whiteTexture);//TODO:

		for (var i: number = 0, n: number = this._effects.length; i < n; i++){
			this._effects[i].render(this._context!);
			if(i==n-2){//last effect:destination RenderTexture is CameraTarget
				this._context.indirectTarget = this._context.destination;
				this._context.destination = cameraTarget;
			}else{
				this._context.indirectTarget = this._context.destination;
				this._context.destination = Indirect[(i+1)%2];
			}
		}
			

		this._compositeShaderData.addDefine(PostProcess.SHADERDEFINE_FINALPASS);
		//dithering.Render(context);

		var offScreenTex: RenderTexture = camera!._offScreenRenderTexture;
		var dest = offScreenTex ? offScreenTex : null;//TODO:如果不画到RenderTarget上,最后一次为null直接画到屏幕上
		this._context!.destination = dest;
		var canvasWidth: number = camera!._getCanvasWidth(), canvasHeight: number = camera!._getCanvasHeight();
		camera!._screenOffsetScale.setValue(viewport.x / canvasWidth, viewport.y / canvasHeight, viewport.width / canvasWidth, viewport.height / canvasHeight);


		if (dest)
			this._context!.command!.blitScreenTriangle(screenTexture, dest, camera!._screenOffsetScale, this._compositeShader, this._compositeShaderData, 0);

		//context.source = context.destination;
		//context.destination = finalDestination;

		//释放临时纹理
		RenderTexture.recoverToPool(screenTexture);
		var tempRenderTextures: RenderTexture[] = this._context!.deferredReleaseTextures;
		for (i = 0, n = tempRenderTextures.length; i < n; i++)
			RenderTexture.recoverToPool(tempRenderTextures[i]);
		tempRenderTextures.length = 0;
	}

	/**
	 * 添加后期处理效果。
	 */
	addEffect(effect: PostProcessEffect): void {
		this._effects.push(effect);
	}

	/**
	 * 移除后期处理效果。
	 */
	removeEffect(effect: PostProcessEffect): void {
		var index: number = this._effects.indexOf(effect);
		if (index !== -1)
			this._effects.splice(index, 1);
	}

	/**
	 * 调用指令集
	 * @internal
	 */
	_applyPostProcessCommandBuffers(): void {
		this._context!.command!._apply();
	}

}


