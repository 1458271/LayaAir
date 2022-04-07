import { VertexMesh } from "laya/d3/graphics/Vertex/VertexMesh";
import { ShaderPass } from "laya/d3/shader/ShaderPass";
import { SubShader } from "laya/d3/shader/SubShader";

import UnityGrassVS from "./shader/GrassShaderVS.vs";
import UnityGrassFS from "./shader/GrassShaderFS.fs";
import { Material } from "laya/d3/core/material/Material";
import { RenderState } from "laya/d3/core/material/RenderState";
import { Vector2 } from "laya/d3/math/Vector2";
import { Vector3 } from "laya/d3/math/Vector3";
import { Vector4 } from "laya/d3/math/Vector4";
import { BaseTexture } from "laya/resource/BaseTexture";
import value from "*.glsl";
import { Loader } from "laya/net/Loader";
import { Shader3D } from "laya/RenderEngine/RenderShader/Shader3D";

export class GrassMaterial extends Material {
    static hasInited: boolean = false;
    /**@internal */
    static WINDAINTENSITY: number;
    /**@internal */
    static WINDAFREQUECY: number;
    /**@internal */
    static WINDATILING: number;
    /**@internal */
    static WINDAWRAP: number;
    /**@internal */
    static WINDBINTENSITY: number;
    /**@internal */
    static WINDBFREQUECY: number;
    /**@internal */
    static WINDBTILING: number;
    /**@internal */
    static WINDBWRAP: number;
    /**@internal */
    static WINDCINTENSITY: number;
    /**@internal */
    static WINDCFREQUECY: number;
    /**@internal */
    static WINDCTILING: number;
    /**@internal */
    static WINDCWRAP: number;
    //grass hight width
    static GRASSHEIGHT: number;
    static GRASSWIDTH: number;
    //grass Bound 必须和草系统里面的UV相同才能得到很好的效果
    static GRASSBOUND: number;
    //地面颜色
    static GROUNDCOLOR: number;
    static ALBEDOTEXTURE: number;

    static __init__(): void {

        GrassMaterial.WINDAINTENSITY= Shader3D.propertyNameToID("u_WindAIntensity");
        GrassMaterial.WINDAFREQUECY= Shader3D.propertyNameToID("u_WindAFrequency");
        GrassMaterial.WINDATILING= Shader3D.propertyNameToID("u_WindATiling");
        GrassMaterial.WINDAWRAP= Shader3D.propertyNameToID("u_WindAWrap");
        GrassMaterial.WINDBINTENSITY= Shader3D.propertyNameToID("u_WindBIntensity");
        GrassMaterial.WINDBFREQUECY= Shader3D.propertyNameToID("u_WindBFrequency");
        GrassMaterial.WINDBTILING= Shader3D.propertyNameToID("u_WindBTiling");
        GrassMaterial.WINDBWRAP= Shader3D.propertyNameToID("u_WindBWrap");
        GrassMaterial.WINDCINTENSITY= Shader3D.propertyNameToID("u_WindCIntensity");
        GrassMaterial.WINDCFREQUECY= Shader3D.propertyNameToID("u_WindCFrequency");
        GrassMaterial.WINDCTILING= Shader3D.propertyNameToID("u_WindCTiling");
        GrassMaterial.WINDCWRAP= Shader3D.propertyNameToID("u_WindCWrap");
        //grass hight width
        GrassMaterial.GRASSHEIGHT= Shader3D.propertyNameToID("u_grassHeight");
        GrassMaterial.GRASSWIDTH= Shader3D.propertyNameToID("u_grassWidth");
        //grass Bound 必须和草系统里面的UV相同才能得到很好的效果
        GrassMaterial.GRASSBOUND= Shader3D.propertyNameToID("u_BoundSize");
        //地面颜色
        GrassMaterial.GROUNDCOLOR= Shader3D.propertyNameToID("u_GroundColor");
        GrassMaterial.ALBEDOTEXTURE= Shader3D.propertyNameToID("u_albedoTexture");

        var attributeMap: any = {
            'a_Position': VertexMesh.MESH_POSITION0,
            'a_Normal': VertexMesh.MESH_NORMAL0,
            'a_Color': VertexMesh.MESH_COLOR0,
            'a_Tangent0': VertexMesh.MESH_TANGENT0,
            'a_privotPosition': VertexMesh.MESH_CUSTOME0
        };
        var shader: Shader3D = Shader3D.add("GrassShader", false, false);
        var subShader: SubShader = new SubShader(attributeMap);
        shader.addSubShader(subShader);
        var pass: ShaderPass = subShader.addShaderPass(UnityGrassVS, UnityGrassFS, "Forward");
        pass.renderState.cull = RenderState.CULL_BACK;
    }

    constructor() {
        if (!GrassMaterial.hasInited) {
            GrassMaterial.__init__();
            GrassMaterial.hasInited = true;
        }
        super();
        this.setShaderName("GrassShader");
        // todo  渲染队列选择
        this.alphaTest = false;
        this.renderQueue = Material.RENDERQUEUE_OPAQUE;
        this.depthWrite = true;
        this.cull = RenderState.CULL_BACK;
        this.blend = RenderState.BLEND_DISABLE;
        this.depthTest = RenderState.DEPTHTEST_LESS;
        this.setWindA(1.77, 4, new Vector2(0.1, 0.1), new Vector2(0.5, 0.5));
        this.setWindB(0.25, 7.7, new Vector2(0.37, 3), new Vector2(0.5, 0.5));
        this.setWindC(0.125, 11.7, new Vector2(0.77, 3), new Vector2(0.5, 0.5));
        this.grassHight = 1.0;
        this.grassWidth = 1.0;
        this.grassGroundColor = new Vector3(0.25, 0.49, 0.23);
        this.grassBoundSize = new Vector4(-105, -105, 210, 210);
        this.albedoTexture = Loader.getRes("res/InstancedIndirectGrassVertexColor.jpg");
    }

    setWindA(windIntensity: number, windFrequency: number, windTiling: Vector2, windWrap: Vector2) {
        this._shaderValues.setNumber(GrassMaterial.WINDAINTENSITY, windIntensity);
        this._shaderValues.setNumber(GrassMaterial.WINDAFREQUECY, windFrequency);
        this._shaderValues.setVector2(GrassMaterial.WINDATILING, windTiling);
        this._shaderValues.setVector2(GrassMaterial.WINDAWRAP, windWrap);
    }

    setWindB(windIntensity: number, windFrequency: number, windTiling: Vector2, windWrap: Vector2) {
        this._shaderValues.setNumber(GrassMaterial.WINDBINTENSITY, windIntensity);
        this._shaderValues.setNumber(GrassMaterial.WINDBFREQUECY, windFrequency);
        this._shaderValues.setVector2(GrassMaterial.WINDBTILING, windTiling);
        this._shaderValues.setVector2(GrassMaterial.WINDBWRAP, windWrap);
    }

    setWindC(windIntensity: number, windFrequency: number, windTiling: Vector2, windWrap: Vector2) {
        this._shaderValues.setNumber(GrassMaterial.WINDCINTENSITY, windIntensity);
        this._shaderValues.setNumber(GrassMaterial.WINDCFREQUECY, windFrequency);
        this._shaderValues.setVector2(GrassMaterial.WINDCTILING, windTiling);
        this._shaderValues.setVector2(GrassMaterial.WINDCWRAP, windWrap);
    }

    set grassHight(value: number) {
        this._shaderValues.setNumber(GrassMaterial.GRASSHEIGHT, value);
    }

    set grassWidth(value: number) {
        this._shaderValues.setNumber(GrassMaterial.GRASSWIDTH, value);
    }

    set grassGroundColor(value: Vector3) {
        this._shaderValues.setVector3(GrassMaterial.GROUNDCOLOR, value);
    }

    set grassBoundSize(value: Vector4) {
        this._shaderValues.setVector(GrassMaterial.GRASSBOUND, value);
    }

    set albedoTexture(value: BaseTexture) {
        this._shaderValues.setTexture(GrassMaterial.ALBEDOTEXTURE, value);
    }

}