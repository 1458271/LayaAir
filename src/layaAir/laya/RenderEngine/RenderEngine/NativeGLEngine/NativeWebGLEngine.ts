import { Color } from "../../../d3/math/Color";
import { Vector4 } from "../../../d3/math/Vector4";
import { CommandEncoder } from "../../../layagl/CommandEncoder";
import { BaseTexture } from "../../../resource/BaseTexture";
import { BufferTargetType, BufferUsage } from "../../RenderEnum/BufferTargetType";
import { RenderCapable } from "../../RenderEnum/RenderCapable";
import { RenderClearFlag } from "../../RenderEnum/RenderClearFlag";
import { RenderParams } from "../../RenderEnum/RenderParams";
import { IRender2DContext } from "../../RenderInterface/IRender2DContext";
import { IRenderBuffer } from "../../RenderInterface/IRenderBuffer";
import { IRenderDrawContext } from "../../RenderInterface/IRenderDrawContext";
import { IRenderEngine } from "../../RenderInterface/IRenderEngine";
import { IRenderShaderInstance } from "../../RenderInterface/IRenderShaderInstance";
import { IRenderVertexState } from "../../RenderInterface/IRenderVertexState";
import { ITextureContext } from "../../RenderInterface/ITextureContext";
import { Shader3D } from "../../RenderShader/Shader3D";
import { ShaderVariable } from "../../RenderShader/ShaderVariable";
import { RenderStateCommand } from "../../RenderStateCommand";
import { NativeGL2TextureContext } from "./NativeGL2TextureContext";
import { WebGLMode } from "../WebGLEngine/GLEnum/WebGLMode";
import { NativeGLRender2DContext } from "./NativeGLRender2DContext";
import { NativeGLTextureContext } from "./NativeGLTextureContext";
import { NativeGLVertexState } from "./NativeGLVertexState";
import { WebGlConfig } from "../WebGLEngine/WebGLConfig";
import { IRenderOBJCreate } from "../../RenderInterface/IRenderOBJCreate";
import { NativeRenderOBJCreateUtil } from "./NativeOBJ/NativeRenderOBJCreateUtil";
import { NativeGLRenderDrawContext } from "./NativeGLRenderDrawContext";


/**
 * @private 封装Webgl
 */
export class NativeWebGLEngine implements IRenderEngine {

  private _gl: WebGLRenderingContext | WebGL2RenderingContext;

  private _config: WebGlConfig;

  /**@internal ShaderDebugMode*/
  _isShaderDebugMode: boolean = true;
  
  private _GLTextureContext: NativeGLTextureContext;
  //Gl Draw
  private _GLRenderDrawContext: NativeGLRenderDrawContext;

  private _GL2DRenderContext: NativeGLRender2DContext;

  _nativeObj: any;

  constructor(config: WebGlConfig, webglMode: WebGLMode = WebGLMode.Auto) {
    this._nativeObj = new (window as any).conchWebGLEngine(webglMode);
  }

  /**
   * GL Context
   * @member {WebGLRenderingContext}
   */
  get gl() {
    return this._gl;
  }

  get isWebGL2() {
    return this._nativeObj.isWebGL2;
  }

  get webglConfig() {
    return this._config;
  }

  /**
   * create GL
   * @param canvas 
   */
  initRenderEngine(canvas: any) {
    this._nativeObj.initRenderEngine();
    /*let names;
    let gl;
    switch (this._webglMode) {
      case WebGLMode.Auto:
        names = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl"];
        break;
      case WebGLMode.WebGL1:
        names = ["webgl", "experimental-webgl"];
        break;
      case WebGLMode.WebGL2:
        names = ["webgl2", "experimental-webgl2"];
        break;
    }
    for (var i: number = 0; i < names.length; i++) {
      try {
        gl = canvas.getContext(names[i], this._config);
      } catch (e) {
      }
      if (gl) {
        if (names[i] === 'webgl2' || names[i] === 'experimental-webgl2') {
          this._isWebGL2 = true;
        }
        break;
      }
    }*/
    //this._isWebGL2 = false;
    //this._gl = gl;
    this._GLRenderDrawContext = new NativeGLRenderDrawContext(this);

    if (this.isWebGL2) {
      this._GLTextureContext = new NativeGL2TextureContext(this, new (window as any).conchGL2TextureContext);
    }
    else {
      this._GLTextureContext = new NativeGLTextureContext(this, new (window as any).conchGLTextureContext);
    }
  }

  bindTexture(texture: BaseTexture) {
    throw new Error("Method not implemented.");
  }
    //set render State
  applyRenderState(stateData: any) {
    this._nativeObj.applyRenderState(stateData);
  }

  applyRenderStateCMD(cmd: RenderStateCommand): void {
    this._nativeObj.applyRenderStateCommand((cmd as any)._nativeObj);
  }

  //get capable of webgl
  getCapable(capatableType: RenderCapable): boolean {
    return this._nativeObj.getCapable(capatableType);
  }

  viewport(x: number, y: number, width: number, height: number): void {
    this._nativeObj.viewport(x, y, width, height);
  }

  scissor(x: number, y: number, width: number, height: number) {
    this._nativeObj.scissor(x, y, width, height);
  }

  scissorTest(value: boolean) {
    this._nativeObj.scissorTest(value);
  }

  clearRenderTexture(clearFlag: RenderClearFlag, clearcolor: Color = null, clearDepth: number = 1) {
    if (clearcolor)
      this._nativeObj.clearRenderTexture(clearFlag, true, clearcolor.r, clearcolor.g, clearcolor.b, clearcolor.a, clearDepth);
    else
      this._nativeObj.clearRenderTexture(clearFlag, false, Color.BLACK.r, Color.BLACK.g, Color.BLACK.b, Color.BLACK.a, clearDepth);
  }

  copySubFrameBuffertoTex(texture: BaseTexture, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number) {
    throw new Error("Method not implemented.");
  }

  colorMask(r: boolean, g: boolean, b: boolean, a: boolean): void {
    this._nativeObj.colorMask(r, g, b, a);
  }

  getParams(params: RenderParams): number {
    return this._nativeObj.getParams(params);
  }


  createBuffer(targetType: BufferTargetType, bufferUsageType: BufferUsage): IRenderBuffer {
    //TODO SourceManager
    return new (window as any).conchGLBuffer( this._nativeObj,targetType,bufferUsageType);
  }

  createShaderInstance(vs: string, ps: string, attributeMap: { [key: string]: number }): IRenderShaderInstance {
    throw new Error("Method not implemented.");
  }

  createVertexState(): IRenderVertexState {
    return new NativeGLVertexState(this);
  }

  getTextureContext(): ITextureContext {
    return this._GLTextureContext;
  }

  //TODO 先写完测试，这种封装过于死板
  getDrawContext(): IRenderDrawContext {
    return this._GLRenderDrawContext;
  }

  get2DRenderContext(): IRender2DContext {
    return this._GL2DRenderContext;
  }

  getCreateRenderOBJContext(): IRenderOBJCreate {
    return new NativeRenderOBJCreateUtil();
  }

  propertyNameToID(name: string): number {
    return this._nativeObj.propertyNameToID(name);
  }

  uploadUniforms(shader: IRenderShaderInstance, commandEncoder: CommandEncoder, shaderData: any, uploadUnTexture: boolean): number {
    throw new Error("Method not implemented.");
  }
  uploadCustomUniforms(shader: IRenderShaderInstance, custom: any[], index: number, data: any): number {
    throw new Error("Method not implemented.");
  }
}


