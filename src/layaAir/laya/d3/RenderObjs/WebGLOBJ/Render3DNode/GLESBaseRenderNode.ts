import { ShaderData } from "../../../../RenderEngine/RenderShader/ShaderData";
import { Vector4 } from "../../../../maths/Vector4";
import { Material } from "../../../../resource/Material";
import { IRenderContext3D } from "../../../RenderDriverLayer/IRenderContext3D";
import { IBaseRenderNode } from "../../../RenderDriverLayer/Render3DNode/IBaseRenderNode";
import { ReflectionProbeMode } from "../../../component/Volume/reflectionProbe/ReflectionProbe";
import { RenderableSprite3D } from "../../../core/RenderableSprite3D";
import { Transform3D } from "../../../core/Transform3D";
import { IrradianceMode } from "../../../core/render/BaseRender";
import { BoundFrustum } from "../../../math/BoundFrustum";
import { Bounds } from "../../../math/Bounds";
import { GLESRenderContext3D } from "../GLESRenderContext3D";
import { GLESRenderElementOBJ } from "../GLESRenderElementOBJ";
import { GLESLightmap } from "../RenderModuleData/GLESLightmap";
import { GLESReflectionProbe } from "../RenderModuleData/GLESReflectionProb";
import { GLESVolumetricGI } from "../RenderModuleData/GLESVolumetricGI";

export class GLESBaseRenderNode implements IBaseRenderNode {
    boundsChange: boolean;
    distanceForSort: number;
    sortingFudge: number;
    castShadow: boolean;
    enable: boolean;
    renderbitFlag: number;
    layer: number;
    customCull: boolean;//TODO
    customCullResoult: boolean;//TODO
    staticMask: number;
    lightmapIndex: number;
    lightmapDirtyFlag: number;
    probeReflectionUpdateMark: number;
    reflectionMode: number;
    lightProbUpdateMark: number;
    irradientMode: IrradianceMode;
    renderelements: GLESRenderElementOBJ[];
    lightmapScaleOffset: Vector4;
    lightmap: GLESLightmap;
    probeReflection: GLESReflectionProbe;
    volumetricGI: GLESVolumetricGI;
    shaderData: ShaderData;
    baseGeometryBounds: Bounds;
    transform: Transform3D;
    protected _worldParams: Vector4;
    _commonUniformMap: string[];
    private _bounds: Bounds;
    /**
    * context3D:GLESRenderContext3D
    * @internal
    */
    _renderUpdatePre: (context3D: IRenderContext3D) => void;//属性 

    _calculateBoundingBox: () => void;

    /**
     * get bounds
     */
    get bounds() {
        if (this.boundsChange) {
            this._calculateBoundingBox();
            this.boundsChange = false;
        }
        return this._bounds;
    }

    set bounds(value: Bounds) {
        this._bounds = value;
    }

    constructor() {
        this.renderelements = [];
        this._commonUniformMap = [];
        this._worldParams = new Vector4(1, 0, 0, 0);
        this.lightmapScaleOffset = new Vector4(1, 1, 0, 0);
        this._calculateBoundingBox = this._ownerCalculateBoundingBox;
    }



    /**
     * 视锥检测包围盒
     * @param boundFrustum 
     * @returns 
     */
    _needRender(boundFrustum: BoundFrustum): boolean {
        if (boundFrustum)
            return boundFrustum.intersects(this.bounds);
        else
            return true;
    }

    /**
     * @internal
     * @param value 
     */
    setWorldParams(value: Vector4) {
        value.cloneTo(this._worldParams);
    }

    /**
     * @internal
     * @param value :RenderElementObj
     */
    setRenderelements(value: GLESRenderElementOBJ[]): void {
        this.renderelements.length = 0;
        for (var i = 0; i < value.length; i++) {
            this.renderelements.push(value[i]);
            value[i]._owner = this;
        }
    }

    /**
     * @internal
     * @param index 
     * @param mat 
     * @returns 
     */
    setOneMaterial(index: number, mat: Material): void {
        if (!this.renderelements[index])
            return;
        this.renderelements[index]._materialShaderData = mat.shaderData;
        this.renderelements[index]._materialRenderQueue;
    }

    /**
     * @internal
     * @param value 
     */
    setLightmapScaleOffset(value: Vector4) {
        value && value.cloneTo(this.lightmapScaleOffset);
    }

    /**@internal */
    setCommonUniformMap(value: string[]) {
        this._commonUniformMap.length = 0;
        value.forEach(element => {
            this._commonUniformMap.push(element);
        });
    }

    /**
     * @internal
     * @returns 
     */
    shadowCullPass(): boolean {
        return this.castShadow && this.enable && (this.renderbitFlag == 0);
    }

    /**
     * @internal
     */
    _ownerCalculateBoundingBox() {
        this.baseGeometryBounds._tranform(this.transform.worldMatrix, this._bounds)
    }

    /**
     * @internal
     * 全局贴图
     */
    _applyLightMapParams(): void {
        if (!this.lightmap) {
            var lightMap: GLESLightmap = this.lightmap;
            var shaderValues: ShaderData = this.shaderData;
            shaderValues.setVector(RenderableSprite3D.LIGHTMAPSCALEOFFSET, this.lightmapScaleOffset);
            shaderValues.setTexture(RenderableSprite3D.LIGHTMAP, lightMap.lightmapColor);
            shaderValues.addDefine(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
            if (lightMap.lightmapDirection) {
                shaderValues.setTexture(RenderableSprite3D.LIGHTMAP_DIRECTION, lightMap.lightmapDirection);
                shaderValues.addDefine(RenderableSprite3D.SHADERDEFINE_LIGHTMAP_DIRECTIONAL);
            }
            else {
                shaderValues.removeDefine(RenderableSprite3D.SHADERDEFINE_LIGHTMAP_DIRECTIONAL);
            }
        } else {
            shaderValues.removeDefine(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
            shaderValues.removeDefine(RenderableSprite3D.SHADERDEFINE_LIGHTMAP_DIRECTIONAL);
        }
    }

    /**
    * apply lightProb
    * @returns 
    */
    _applyLightProb() {
        if (this.lightmapIndex >= 0 || !this.volumetricGI) return;
        if (this.volumetricGI.updateMark != this.lightProbUpdateMark) {
            this.lightProbUpdateMark = this.volumetricGI.updateMark;
            this.volumetricGI.applyRenderData(this.shaderData);
        }
    }

    /**
     * apply reflection
     * @returns 
     */
    _applyReflection() {
        if (!this.probeReflection || this.reflectionMode == ReflectionProbeMode.off) return;
        if (this.probeReflection.updateMark != this.probeReflectionUpdateMark) {
            this.probeReflectionUpdateMark = this.probeReflection.updateMark;
            this.probeReflection.applyRenderData(this.shaderData);
        }
    }

    /**
     * destroy
     */
    destroy() {
        this.renderelements.forEach(element => {
            element._destroy();
        });
        this.baseGeometryBounds = null;
        this.transform = null;
        this.lightmapScaleOffset = null;
        this.lightmap = null;
        this.probeReflection = null;
        this.volumetricGI = null;
        this.renderelements.length = 0;
        this.renderelements = null;
        this._commonUniformMap.length = 0;
        this._commonUniformMap = null;
    }

}