
import { TextureDimension } from "../d3/WebGL/InternalTexture";
import { RenderTargetFormat } from "../resource/RenderTarget";
import { WebGLInternalTex } from "../d3/WebGL/WebGLInternalTex";
import { LayaGL } from "../layagl/LayaGL";
import { HDRTextureInfo } from "../resource/HDRTextureInfo";
import { KTXTextureInfo } from "../resource/KTXTextureInfo";
import { TextureFormat } from "../resource/TextureFormat";
import { LayaWebGLContext } from "./LayaWebGLContext";
import { WebGLContext } from "./WebGLContext";
import { CompareMode } from "../resource/CompareMode";
import { WebGLInternalRT } from "../d3/WebGL/WebGLInternalRT";
import { InternalRenderTarget } from "../d3/WebGL/InternalRenderTarget";
import { FilterMode } from "../resource/FilterMode";

export class LayaWebGL2Context extends LayaWebGLContext {

    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }


    glTextureParam(format: TextureFormat, useSRGB: boolean) {
        let gl = this.gl;

        let layaGPU = LayaGL.layaGPUInstance;

        this._glParam.internalFormat = null;
        this._glParam.format = null;
        this._glParam.type = null;
        switch (format) {
            case TextureFormat.R8G8B8:
                this._glParam.internalFormat = useSRGB ? gl.SRGB8 : gl.RGB8;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.R8G8B8A8:
                this._glParam.internalFormat = useSRGB ? gl.SRGB8_ALPHA8 : gl.RGBA8;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.R5G6B5:
                this._glParam.internalFormat = gl.RGB565;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.UNSIGNED_SHORT_5_6_5;
                break;
            case TextureFormat.R32G32B32A32:
                this._glParam.internalFormat = gl.RGBA32F;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.FLOAT;
                break;
            case TextureFormat.R32G32B32:
                this._glParam.internalFormat = gl.RGB32F;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.FLOAT;
                break;
            case TextureFormat.R16G16B16:
                this._glParam.internalFormat = gl.RGB16F;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.HALF_FLOAT;
                break;
            case TextureFormat.R16G16B16A16:
                this._glParam.internalFormat = gl.RGBA16F;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.HALF_FLOAT;
                break;
            case TextureFormat.DXT1:
                this._glParam.internalFormat = useSRGB ? layaGPU._compressdTextureS3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT : layaGPU._compressedTextureS3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                // this._glParam.format = gl.RGBA;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.DXT3:
                this._glParam.internalFormat = useSRGB ? layaGPU._compressdTextureS3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT : layaGPU._compressedTextureS3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.DXT5:
                this._glParam.internalFormat = useSRGB ? layaGPU._compressdTextureS3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT : layaGPU._compressedTextureS3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ETC1RGB:
                this._glParam.internalFormat = layaGPU._compressedTextureEtc1.COMPRESSED_RGB_ETC1_WEBGL;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ETC2RGBA:
                this._glParam.internalFormat = layaGPU._compressedTextureETC.COMPRESSED_RGBA8_ETC2_EAC;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ETC2RGB:
                this._glParam.internalFormat = layaGPU._compressedTextureETC.COMPRESSED_RGB8_ETC2;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ETC2SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureETC.COMPRESSED_SRGB8_ETC2;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ETC2SRGB_Alpha8:
                this._glParam.internalFormat = layaGPU._compressedTextureETC.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC4x4:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_RGBA_ASTC_4x4_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC6x6:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_RGBA_ASTC_6x6_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break
            case TextureFormat.ASTC8x8:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_RGBA_ASTC_8x8_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break
            case TextureFormat.ASTC10x10:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_RGBA_ASTC_10x10_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break
            case TextureFormat.ASTC12x12:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_RGBA_ASTC_12x12_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break
            case TextureFormat.ASTC4x4SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC6x6SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC8x8SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC10x10SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.ASTC12x12SRGB:
                this._glParam.internalFormat = layaGPU._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;
                // this._glParam.format = this._glParam.internalFormat;
                // this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            default:
                throw "Unknown Texture Format.";
        }

        return this._glParam;
    }

    glRenderBufferParam(format: RenderTargetFormat, useSRGB: boolean): { internalFormat: number; attachment: number; } {
        let gl = <WebGL2RenderingContext>this.gl;
        let layaGPU = LayaGL.layaGPUInstance;
        switch (format) {
            case RenderTargetFormat.DEPTH_16:
                return { internalFormat: gl.DEPTH_COMPONENT16, attachment: gl.DEPTH_ATTACHMENT };
            case RenderTargetFormat.DEPTHSTENCIL_24_8:
                return { internalFormat: gl.DEPTH24_STENCIL8, attachment: gl.DEPTH_STENCIL_ATTACHMENT };
            case RenderTargetFormat.DEPTH_32:
                return { internalFormat: gl.DEPTH_COMPONENT32F, attachment: gl.DEPTH_ATTACHMENT };
            case RenderTargetFormat.STENCIL_8:
                return { internalFormat: gl.STENCIL_INDEX8, attachment: gl.STENCIL_ATTACHMENT };
            case RenderTargetFormat.R8G8B8:
                return { internalFormat: gl.RGB8, attachment: gl.COLOR_ATTACHMENT0 };
            case RenderTargetFormat.R8G8B8A8:
                return { internalFormat: gl.RGBA8, attachment: gl.COLOR_ATTACHMENT0 };
            case RenderTargetFormat.R16G16B16:
                return { internalFormat: gl.RGB16F, attachment: gl.COLOR_ATTACHMENT0 };
            case RenderTargetFormat.R16G16B16A16:
                return { internalFormat: gl.RGBA16F, attachment: gl.COLOR_ATTACHMENT0 };
            case RenderTargetFormat.R32G32B32:
                return { internalFormat: gl.RGB32F, attachment: gl.COLOR_ATTACHMENT0 };
            case RenderTargetFormat.R32G32B32A32:
                return { internalFormat: gl.RGBA32F, attachment: gl.COLOR_ATTACHMENT0 };
            default:
                return null;
        }
    }

    glRenderTextureParam(format: RenderTargetFormat, useSRGB: boolean) {
        let gl = this.gl;

        let layaGPU = LayaGL.layaGPUInstance;

        this._glParam.internalFormat = null;
        this._glParam.format = null;
        this._glParam.type = null;

        switch (format) {
            case RenderTargetFormat.R8G8B8:
                this._glParam.internalFormat = useSRGB ? gl.SRGB8 : gl.RGB8;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case RenderTargetFormat.R8G8B8A8:
                this._glParam.internalFormat = useSRGB ? gl.SRGB8_ALPHA8 : gl.RGBA8;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.UNSIGNED_BYTE;
                break;
            case RenderTargetFormat.R16G16B16:
                this._glParam.internalFormat = gl.RGB16F;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.HALF_FLOAT;
                break;
            case RenderTargetFormat.R16G16B16A16:
                this._glParam.internalFormat = gl.RGBA16F;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.HALF_FLOAT;
                break;
            case RenderTargetFormat.R32G32B32:
                this._glParam.internalFormat = gl.RGB32F;
                this._glParam.format = gl.RGB;
                this._glParam.type = gl.FLOAT;
                break;
            case RenderTargetFormat.R32G32B32A32:
                this._glParam.internalFormat = gl.RGBA32F;
                this._glParam.format = gl.RGBA;
                this._glParam.type = gl.FLOAT;
                break;
            case RenderTargetFormat.DEPTH_16:
                this._glParam.internalFormat = gl.DEPTH_COMPONENT16;
                this._glParam.format = gl.DEPTH_COMPONENT;
                this._glParam.type = gl.UNSIGNED_INT;
                break;
            case RenderTargetFormat.DEPTHSTENCIL_24_8:
                this._glParam.internalFormat = gl.DEPTH24_STENCIL8;
                this._glParam.format = this._glParam.internalFormat;
                this._glParam.type = gl.UNSIGNED_INT_24_8;
                break;
            case RenderTargetFormat.DEPTH_32:
                this._glParam.internalFormat = gl.DEPTH_COMPONENT32F;
                this._glParam.format = this._glParam.internalFormat;
                this._glParam.type = gl.UNSIGNED_INT;
                break;
            case RenderTargetFormat.STENCIL_8:
                break;
            default:
                throw "depht texture format wrong."
        }

        return this._glParam;
    }

    setTextureImageData(texture: WebGLInternalTex, source: HTMLImageElement | HTMLCanvasElement | ImageBitmap, premultiplyAlpha: boolean, invertY: boolean) {
        if (texture.width != source.width || texture.height != source.height) {
            // todo ?
            console.warn("setTextureImageData: size not match");
        }

        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let width = texture.width;
        let height = texture.height;
        let mipmapCount = texture.mipmapCount;

        let gl = <WebGL2RenderingContext>texture._gl;
        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);

        gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        gl.texSubImage2D(target, 0, 0, 0, width, height, format, type, source);

        if (texture.mipmap) {
            gl.generateMipmap(texture.target);
        }

        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }

    setTexturePixelsData(texture: WebGLInternalTex, source: ArrayBufferView, premultiplyAlpha: boolean, invertY: boolean) {

        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let width = texture.width;
        let height = texture.height;
        let mipmapCount = texture.mipmapCount;

        let fourSize = width % 4 == 0 && height % 4 == 0;
        let gl = <WebGL2RenderingContext>texture._gl;
        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);
        gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        if (source) {
            gl.texSubImage2D(target, 0, 0, 0, width, height, format, type, source);
            if (texture.mipmap) {
                gl.generateMipmap(texture.target);
            }
        }
        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

    setTextureHDRData(texture: WebGLInternalTex, hdrInfo: HDRTextureInfo): void {
        let sourceData = hdrInfo.readScanLine();

        this.setTexturePixelsData(texture, sourceData, false, false);
    }

    setTextureKTXData(texture: WebGLInternalTex, ktxInfo: KTXTextureInfo) {

        //todo?
        let premultiplyAlpha = false;
        let invertY = false;

        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let mipmapCount = texture.mipmapCount;
        // todo texture size 与 ddsInfo size
        let width = texture.width;
        let height = texture.height;

        let source = ktxInfo.source;
        let compressed = ktxInfo.compress;
        let fourSize = width % 4 == 0 && height % 4 == 0;

        let gl = <WebGL2RenderingContext>texture._gl;
        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);

        if (!compressed) {
            gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        }

        let mipmapWidth = width;
        let mipmapHeight = height;
        let dataOffset = ktxInfo.headerOffset + ktxInfo.bytesOfKeyValueData;
        for (let index = 0; index < mipmapCount; index++) {
            let imageSize = new Int32Array(source, dataOffset, 1)[0];

            dataOffset += 4;
            let sourceData = new Uint8Array(source, dataOffset, imageSize);

            compressed && gl.compressedTexImage2D(target, index, internalFormat, mipmapWidth, mipmapHeight, 0, sourceData);

            !compressed && gl.texSubImage2D(target, index, 0, 0, mipmapWidth, mipmapHeight, format, type, sourceData);

            dataOffset += imageSize;
            dataOffset += 3 - ((imageSize + 3) % 4);

            mipmapWidth = Math.max(1, mipmapWidth * 0.5);
            mipmapHeight = Math.max(1, mipmapHeight * 0.5);

        }
        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

    setCubeImageData(texture: WebGLInternalTex, sources: HTMLImageElement[] | HTMLCanvasElement[] | ImageBitmap[], premultiplyAlpha: boolean, invertY: boolean): void {
        let gl = <WebGL2RenderingContext>texture._gl;

        const cubeFace = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, // back
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, // front
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, // right
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X, // left
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, // up
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, // down
        ]

        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let width = texture.width;
        let height = texture.height;
        let mipmapCount = texture.mipmapCount;

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);

        gl.texStorage2D(target, mipmapCount, internalFormat, width, height);

        for (let index = 0; index < cubeFace.length; index++) {
            let t = cubeFace[index];
            // gl.texSubImage2D(t, 0, 0, 0, format, type, sources[index]);
            gl.texSubImage2D(t, 0, 0, 0, format, type, sources[index]);
        }

        if (texture.mipmap) {
            gl.generateMipmap(texture.target);
        }

        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }

    setCubePixelsData(texture: WebGLInternalTex, source: ArrayBufferView[], premultiplyAlpha: boolean, invertY: boolean): void {
        let gl = <WebGL2RenderingContext>texture._gl;

        const cubeFace = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, // back
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, // front
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, // right
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X, // left
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, // up
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, // down
        ];

        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let width = texture.width;
        let height = texture.height;
        let mipmapCount = texture.mipmapCount;

        let fourSize = width % 4 == 0;
        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);
        gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        if (source) {
            for (let index = 0; index < cubeFace.length; index++) {
                let t = cubeFace[index];
                gl.texSubImage2D(t, 0, 0, 0, width, height, format, type, source[index]);
            }
            if (texture.mipmap) {
                gl.generateMipmap(texture.target);
            }
        }


        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

    setCubeKTXData(texture: WebGLInternalTex, ktxInfo: KTXTextureInfo): void {
        //todo?
        let premultiplyAlpha = false;
        let invertY = false;

        let gl = <WebGL2RenderingContext>texture._gl;

        // ktx 标准顺序
        const cubeFace = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, // right
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X, // left
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, // up
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, // down
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, // back
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, // front
        ]



        let target = texture.target;
        let internalFormat = texture.internalFormat;
        let format = texture.format;
        let type = texture.type;
        let mipmapCount = texture.mipmapCount;
        // todo texture size 与 ddsInfo size
        let width = texture.width;
        let height = texture.height;

        let source = ktxInfo.source;
        let compressed = ktxInfo.compress;

        let mipmapWidth = width;
        let mipmapHeight = height;
        let dataOffset = ktxInfo.headerOffset + ktxInfo.bytesOfKeyValueData;

        let fourSize = width % 4 == 0 && height % 4 == 0;

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        WebGLContext.bindTexture(gl, texture.target, texture.resource);

        if (!compressed) {
            gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        }

        for (let index = 0; index < mipmapCount; index++) {
            let imageSize = new Int32Array(source, dataOffset, 1)[0];

            dataOffset += 4;
            // todo  cube 在一起？

            for (let face = 0; face < 6; face++) {
                let t = cubeFace[face];
                let sourceData = new Uint8Array(source, dataOffset, imageSize);

                compressed && gl.compressedTexImage2D(t, index, internalFormat, mipmapWidth, mipmapHeight, 0, sourceData);

                !compressed && gl.texSubImage2D(target, index, 0, 0, width, height, format, type, sourceData);

                dataOffset += imageSize;
                dataOffset += 3 - ((imageSize + 3) % 4);
            }


            mipmapWidth = Math.max(1, mipmapWidth * 0.5);
            mipmapHeight = Math.max(1, mipmapHeight * 0.5);
        }

        WebGLContext.bindTexture(gl, texture.target, null);

        premultiplyAlpha && gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        invertY && gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        fourSize || gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);

    }

    setTextureCompareMode(texture: WebGLInternalTex, compareMode: CompareMode): CompareMode {
        let gl = <WebGL2RenderingContext>texture._gl;
        switch (compareMode) {
            case CompareMode.GEQUAL:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.GEQUAL:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.GEQUAL);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.LESS:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.LESS);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.GREATER:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.GREATER);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.EQUAL:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.EQUAL);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.NOTEQUAL:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.NOTEQUAL);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.ALWAYS:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.ALWAYS);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.NEVER:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.NEVER);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
                break;
            case CompareMode.None:
            default:
                texture._setTexParameteri(gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
                texture._setTexParameteri(gl.TEXTURE_COMPARE_MODE, gl.NONE);
                break;
        }
        return compareMode;

    }

    createRenderbuffer(width: number, height: number, internalFormat: number, samples: number): WebGLRenderbuffer {
        // todo  多个 gl
        let gl = this.gl;

        let renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

        if (samples > 1) {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, internalFormat, width, height);
        }
        else {
            gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return renderbuffer;
    }

    createRenderColorTextureInternal(dimension: TextureDimension, width: number, height: number, format: RenderTargetFormat, gengerateMipmap: boolean, sRGB: boolean): WebGLInternalTex {
        let useSRGBExt = false;

        gengerateMipmap = this.supportGenerateMipmap(format);

        let gammaCorrection = 1.0;
        if (!useSRGBExt && sRGB) {
            gammaCorrection = 2.2;
        }

        let target = this.getTarget(dimension);
        let internalTex = new WebGLInternalTex(target, width, height, dimension, gengerateMipmap, useSRGBExt, gammaCorrection);

        let glParam = this.glRenderTextureParam(format, useSRGBExt);

        internalTex.internalFormat = glParam.internalFormat;
        internalTex.format = glParam.format;
        internalTex.type = glParam.type;

        let internalFormat = internalTex.internalFormat;
        let glFormat = internalTex.format;
        let type = internalTex.type;

        let gl = <WebGL2RenderingContext>internalTex._gl;

        WebGLContext.bindTexture(gl, internalTex.target, internalTex.resource);

        gl.texStorage2D(target, internalTex.mipmapCount, internalFormat, width, height);

        WebGLContext.bindTexture(gl, internalTex.target, null);

        if (format == RenderTargetFormat.DEPTH_16 || format == RenderTargetFormat.DEPTH_32 || format == RenderTargetFormat.DEPTHSTENCIL_24_8) {
            internalTex.filterMode = FilterMode.Point;
        }

        return internalTex;
    }

    createRenderTargetInternal(width: number, height: number, colorFormat: RenderTargetFormat, depthStencilFormat: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean, multiSamples: number): WebGLInternalRT {
        let texture = this.createRenderColorTextureInternal(TextureDimension.Tex2D, width, height, colorFormat, generateMipmap, sRGB);

        let renderTarget = new WebGLInternalRT(colorFormat, depthStencilFormat, false, texture.mipmap, multiSamples);

        renderTarget._textures.push(texture);

        let gl = <WebGLRenderingContext>renderTarget._gl;

        if (renderTarget._samples > 1) {
            let msaaFramebuffer = renderTarget._msaaFramebuffer;
            let renderbufferParam = this.glRenderBufferParam(colorFormat, false);
            let msaaRenderbuffer = renderTarget._msaaRenderbuffer = this.createRenderbuffer(width, height, renderbufferParam.internalFormat, renderTarget._samples);
            gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFramebuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, renderbufferParam.attachment, gl.RENDERBUFFER, msaaRenderbuffer);
            // depth
            let depthBufferParam = this.glRenderBufferParam(depthStencilFormat, false);
            if (depthBufferParam) {
                let depthbuffer = this.createRenderbuffer(width, height, depthBufferParam.internalFormat, renderTarget._samples);
                renderTarget._depthbuffer = depthbuffer;
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, depthBufferParam.attachment, gl.RENDERBUFFER, depthbuffer);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            let framebuffer = renderTarget._framebuffer;
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            // color
            let colorAttachment = this.glRenderTargetAttachment(colorFormat);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment, gl.TEXTURE_2D, texture.resource, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else {
            let framebuffer = renderTarget._framebuffer;

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            // color
            let colorAttachment = this.glRenderTargetAttachment(colorFormat);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment, gl.TEXTURE_2D, texture.resource, 0);

            // depth
            let depthBufferParam = this.glRenderBufferParam(depthStencilFormat, false);
            if (depthBufferParam) {
                let depthbuffer = this.createRenderbuffer(width, height, depthBufferParam.internalFormat, renderTarget._samples);
                renderTarget._depthbuffer = depthbuffer;
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, depthBufferParam.attachment, gl.RENDERBUFFER, depthbuffer);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        return renderTarget;

    }

    createRenderTargetCubeInternal(size: number, colorFormat: RenderTargetFormat, depthStencilFormat: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean, multiSamples: number): WebGLInternalRT {
        let texture = this.createRenderTextureCubeInternal(TextureDimension.Cube, size, colorFormat, generateMipmap, sRGB);

        let renderTarget = new WebGLInternalRT(colorFormat, depthStencilFormat, true, texture.mipmap, multiSamples);
        renderTarget.colorFormat = colorFormat;
        renderTarget.depthStencilFormat = depthStencilFormat;
        renderTarget._textures.push(texture);

        let gl = <WebGLRenderingContext>renderTarget._gl;

        if (renderTarget._samples > 1) {
            let msaaFramebuffer = renderTarget._msaaFramebuffer;
            let renderbufferParam = this.glRenderBufferParam(colorFormat, false);
            let msaaRenderbuffer = renderTarget._msaaRenderbuffer = this.createRenderbuffer(size, size, renderbufferParam.internalFormat, renderTarget._samples);
            gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFramebuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, renderbufferParam.attachment, gl.RENDERBUFFER, msaaRenderbuffer);
            // depth
            let depthBufferParam = this.glRenderBufferParam(depthStencilFormat, false);
            if (depthBufferParam) {
                let depthbuffer = this.createRenderbuffer(size, size, depthBufferParam.internalFormat, renderTarget._samples);
                renderTarget._depthbuffer = depthbuffer;
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, depthBufferParam.attachment, gl.RENDERBUFFER, depthbuffer);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else {
            let framebuffer = renderTarget._framebuffer;

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            // color
            let colorAttachment = this.glRenderTargetAttachment(colorFormat);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment, gl.TEXTURE_2D, texture.resource, 0);

            // depth
            let depthBufferParam = this.glRenderBufferParam(depthStencilFormat, false);
            if (depthBufferParam) {
                let depthbuffer = this.createRenderbuffer(size, size, depthBufferParam.internalFormat, renderTarget._samples);
                renderTarget._depthbuffer = depthbuffer;
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, depthBufferParam.attachment, gl.RENDERBUFFER, depthbuffer);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }


        return renderTarget;
    }

    createRenderTextureCubeInternal(dimension: TextureDimension, size: number, format: RenderTargetFormat, generateMipmap: boolean, sRGB: boolean): WebGLInternalTex {
        let useSRGBExt = false;

        generateMipmap = generateMipmap && this.supportGenerateMipmap(format);

        let gammaCorrection = 1.0;
        if (!useSRGBExt && sRGB) {
            gammaCorrection = 2.2;
        }

        let target = this.getTarget(dimension);
        let internalTex = new WebGLInternalTex(target, size, size, dimension, generateMipmap, useSRGBExt, gammaCorrection);

        let glParam = this.glRenderTextureParam(format, useSRGBExt);

        internalTex.internalFormat = glParam.internalFormat;
        internalTex.format = glParam.format;
        internalTex.type = glParam.type;


        let internalFormat = internalTex.internalFormat;
        let glFormat = internalTex.format;
        let type = internalTex.type;

        let gl = <WebGL2RenderingContext>internalTex._gl;

        WebGLContext.bindTexture(gl, internalTex.target, internalTex.resource);

        gl.texStorage2D(target, internalTex.mipmapCount, internalFormat, size, size);

        WebGLContext.bindTexture(gl, internalTex.target, null);

        return internalTex;

    }

    bindRenderTarget(renderTarget: WebGLInternalRT): void {
        let gl = <WebGL2RenderingContext>renderTarget._gl;

        if (renderTarget._isCube) {
            let framebuffer = renderTarget._framebuffer;
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            let texture = <WebGLInternalTex>renderTarget._textures[0];
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, texture.resource, 0);
        }

        if (renderTarget._samples > 1) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget._msaaFramebuffer);
        }
        else {
            let framebuffer = renderTarget._framebuffer;

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        }
    }

    unbindRenderTarget(renderTarget: WebGLInternalRT): void {
        let gl = <WebGL2RenderingContext>renderTarget._gl;
        if (renderTarget._samples > 1) {

            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, renderTarget._msaaFramebuffer);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, renderTarget._framebuffer);

            let texture = renderTarget._textures[0];

            // todo 不用clear ?
            // gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]);
            // gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);

            // todo  blit mask
            let biltMask = gl.COLOR_BUFFER_BIT;
            if (renderTarget._depthTexture) {
                biltMask |= gl.DEPTH_BUFFER_BIT;
            }

            gl.blitFramebuffer(0, 0, texture.width, texture.height, 0, 0, texture.width, texture.height, biltMask, gl.NEAREST);
        }

        if (renderTarget._generateMipmap) {
            renderTarget._textures.forEach(tex => {
                let target = (<WebGLInternalTex>tex).target;
                WebGLContext.bindTexture(gl, target, tex.resource);
                gl.generateMipmap(target);
                WebGLContext.bindTexture(gl, target, null);
            });
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

}