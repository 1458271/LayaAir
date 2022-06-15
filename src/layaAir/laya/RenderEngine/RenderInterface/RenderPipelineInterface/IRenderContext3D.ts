import { Vector4 } from "../../../d3/math/Vector4";
import { Viewport } from "../../../d3/math/Viewport";
import { ShaderData } from "../../RenderShader/ShaderData";
import { IRenderTarget } from "../IRenderTarget";
import { IRenderElement } from "./IRenderElement";

  export interface IRenderContext3D{
    //dest Texture
    destTarget:IRenderTarget;
    //viewPort
    viewPort:Viewport;
    //scissor
    scissor:Vector4;
    //is invert Y
    invertY:boolean;
    //pipeLineMode
    pipelineMode:string;
    //Camera Shader Data
    cameraShaderData:ShaderData;
    //Scene cache
    sceneID:number;
    //scene Shader Data
    sceneShaderData:ShaderData;
    //Camera Update Mark
    cameraUpdateMark:number;
    //Global ShaderData
    globalShaderData:ShaderData;
    /**设置IRenderContext */
    applyContext(cameraUpdateMark:number):void;
    /**draw one element by context */
    drawRenderElement(renderelemt:IRenderElement):void;
  }
  