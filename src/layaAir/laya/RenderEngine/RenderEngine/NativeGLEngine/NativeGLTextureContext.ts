
import { WebGLExtension } from "../WebGLEngine/GLEnum/WebGLExtension";
import { FilterMode } from "../../RenderEnum/FilterMode";
import { RenderCapable } from "../../RenderEnum/RenderCapable";
import { RenderTargetFormat } from "../../RenderEnum/RenderTargetFormat";
import { TextureCompareMode } from "../../RenderEnum/TextureCompareMode";
import { TextureDimension } from "../../RenderEnum/TextureDimension";
import { TextureFormat } from "../../RenderEnum/TextureFormat";
import { InternalTexture } from "../../RenderInterface/InternalTexture";
import { ITextureContext } from "../../RenderInterface/ITextureContext";
import { NativeGLObject } from "./NativeGLObject";
import { NativeWebGLEngine } from "./NativeWebGLEngine";
import { DDSTextureInfo } from "../../DDSTextureInfo";
import { HDRTextureInfo } from "../../HDRTextureInfo";
import { KTXTextureInfo } from "../../KTXTextureInfo";
import { InternalRenderTarget } from "../../RenderInterface/InternalRenderTarget";

export class NativeGLTextureContext extends NativeGLObject implements ITextureContext {
    protected _native: any;

    constructor(engine: NativeWebGLEngine, native: any) {
        super(engine);
        this._native = native;
    }

    createTextureInternal(dimension: TextureDimension, width: number, height: number, format: TextureFormat, gengerateMipmap: boolean, sRGB: boolean): InternalTexture {
        return this._native.createTextureInternal(dimension, width, height, format, gengerateMipmap, sRGB);
    }

    setTextureImageData(texture: InternalTexture, source: HTMLImageElement | HTMLCanvasElement | ImageBitmap, premultiplyAlpha: boolean, invertY: boolean) {
        this._native.setTextureImageData(texture, (source as any)._nativeObj.conchImgId , premultiplyAlpha, invertY);
    }

    setTexturePixelsData(texture: InternalTexture, source: ArrayBufferView, premultiplyAlpha: boolean, invertY: boolean) {
        this._native.setTexturePixelsData(texture, source , premultiplyAlpha, invertY);
    }

    setTextureSubPixelsData(texture: InternalTexture, source: ArrayBufferView, mipmapLevel: number, generateMipmap: boolean, xOffset: number, yOffset: number, width: number, height: number, premultiplyAlpha: boolean, invertY: boolean): void {
        this._native.setTextureSubPixelsData(texture, source, mipmapLevel, generateMipmap, xOffset, yOffset, width, height, premultiplyAlpha, invertY);
    }

  setTextureHDRData(texture: InternalTexture, hdrInfo: HDRTextureInfo): void {
        let sourceData = hdrInfo.readScanLine();

        this.setTexturePixelsData(texture, sourceData, false, false);
    }
    setTextureDDSData(texture: InternalTexture, ddsInfo: DDSTextureInfo) {
        throw new Error("setTextureDDSData Method not implemented.");
    }

    setTextureKTXData(texture: InternalTexture, ktxInfo: KTXTextureInfo) {
        throw new Error("setTextureKTXData Method not implemented.");
    }
    setCubeImageData(texture: InternalTexture, sources: HTMLImageElement[] | HTMLCanvasElement[] | ImageBitmap[], premultiplyAlpha: boolean, invertY: boolean): void {
        var images: any[] = [];
        var length = sources.length;
        for (let index = 0; index < length; index++) {
            images.push((sources[index] as any)._nativeObj);
        }
        this._native.setCubeImageData(texture, images, premultiplyAlpha, invertY);
    }

    setCubePixelsData(texture: InternalTexture, source: ArrayBufferView[], premultiplyAlpha: boolean, invertY: boolean): void {
        this._native.setCubePixelsData(texture, source, premultiplyAlpha, invertY);
    }
    setCubeSubPixelData(texture: InternalTexture, source: ArrayBufferView[], mipmapLevel: number, generateMipmap: boolean, xOffset: number, yOffset: number, width: number, height: number, premultiplyAlpha: boolean, invertY: boolean): void {
        this._native.setCubeSubPixelData(texture, source, mipmapLevel, generateMipmap, xOffset, yOffset, width, height, premultiplyAlpha, invertY);
    }


    setCubeDDSData(texture: InternalTexture, ddsInfo: DDSTextureInfo) {
        throw new Error("setCubeDDSData Method not implemented.");
    }

    setCubeKTXData(texture: InternalTexture, ktxInfo: KTXTextureInfo) {
        throw new Error("setCubeKTXData Method not implemented.");
    }

    setTextureCompareMode(texture: InternalTexture, compareMode: TextureCompareMode): TextureCompareMode {
        return this._native.setTextureCompareMode(texture, compareMode);
    }

    bindRenderTarget(renderTarget: InternalRenderTarget): void {
        this._native.bindRenderTarget(renderTarget);
    }

    bindoutScreenTarget():void{
        throw new Error("bindoutScreenTarget Method not implemented.");
    }

    unbindRenderTarget(renderTarget: InternalRenderTarget): void {
        this._native.unbindRenderTarget(renderTarget);
    }

    createRenderTextureInternal(dimension: TextureDimension, width: number, height: number, format: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean): InternalTexture {
        throw new Error("createRenderTextureInternal Method not implemented.");
        return null;
    }

    createRenderTargetInternal(width: number, height: number, colorFormat: RenderTargetFormat, depthStencilFormat: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean, multiSamples: number): InternalRenderTarget {
        return  this._native.createRenderTargetInternal(width, height, colorFormat, depthStencilFormat ? depthStencilFormat : RenderTargetFormat.None, generateMipmap, sRGB, multiSamples);
    }

    createRenderTargetCubeInternal(size: number, colorFormat: RenderTargetFormat, depthStencilFormat: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean, multiSamples: number): InternalRenderTarget {
        throw new Error("createRenderTargetCubeInternal Method not implemented.");
        return null;
    }
    createRenderTextureCubeInternal(dimension: TextureDimension, size: number, format: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean): InternalTexture {
        throw new Error("createRenderTextureCubeInternal Method not implemented.");
        return null;
    }
    // todo  color 0, 1, 2, 3 ?
    setupRendertargetTextureAttachment(renderTarget: InternalRenderTarget, texture: InternalTexture) {
        throw new Error("setupRendertargetTextureAttachment Method not implemented.");
    }

    // todo 不同 格式
    readRenderTargetPixelData(renderTarget: InternalRenderTarget, xOffset: number, yOffset: number, width: number, height: number, out: ArrayBufferView): ArrayBufferView {
        throw new Error("readRenderTargetPixelData Method not implemented.");
        return null;

    }

    updateVideoTexture(texture: InternalTexture, video: HTMLVideoElement, premultiplyAlpha: boolean, invertY: boolean): void {
        throw new Error("updateVideoTexture Method not implemented.");
    }

}