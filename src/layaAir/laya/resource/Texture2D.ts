import { ILaya } from "../../ILaya";
import { LayaGL } from "../layagl/LayaGL";
import { FilterMode } from "../RenderEngine/RenderEnum/FilterMode";
import { RenderCapable } from "../RenderEngine/RenderEnum/RenderCapable";
import { TextureDimension } from "../RenderEngine/RenderEnum/TextureDimension";
import { TextureFormat } from "../RenderEngine/RenderEnum/TextureFormat";
import { Byte } from "../utils/Byte";
import { HalfFloatUtils } from "../utils/HalfFloatUtils";
import { Handler } from "../utils/Handler";
import { SystemUtils } from "../webgl/SystemUtils";
import { BaseTexture } from "./BaseTexture";
import { DDSTextureInfo } from "./DDSTextureInfo";
import { HDRTextureInfo } from "./HDRTextureInfo";
import { KTXTextureInfo } from "./KTXTextureInfo";


export class Texture2D extends BaseTexture {

	/**Texture2D资源。*/
	static TEXTURE2D: string = "TEXTURE2D";

	/**纯灰色纹理。*/
	static grayTexture: Texture2D = null;
	/**纯白色纹理。*/
	static whiteTexture: Texture2D = null;
	/**纯黑色纹理。*/
	static blackTexture: Texture2D = null;
	/**错误纹理 */
	static erroTextur: Texture2D = null;


	static __init__() {
		var pixels: Uint8Array = new Uint8Array(3);
		pixels[0] = 128;
		pixels[1] = 128;
		pixels[2] = 128;
		Texture2D.grayTexture = new Texture2D(1, 1, TextureFormat.R8G8B8, false, false);
		Texture2D.grayTexture.setPixelsData(pixels, false, false);
		Texture2D.grayTexture.lock = true;//锁住资源防止被资源管理释放
		pixels[0] = 255;
		pixels[1] = 255;
		pixels[2] = 255;
		Texture2D.whiteTexture = new Texture2D(1, 1, TextureFormat.R8G8B8, false, false);
		Texture2D.whiteTexture.setPixelsData(pixels, false, false);
		Texture2D.whiteTexture.lock = true;//锁住资源防止被资源管理释放
		pixels[0] = 0;
		pixels[1] = 0;
		pixels[2] = 0;
		Texture2D.blackTexture = new Texture2D(1, 1, TextureFormat.R8G8B8, false, false);
		Texture2D.blackTexture.setPixelsData(pixels, false, false);
		Texture2D.blackTexture.lock = true;//锁住资源防止被资源管理释放

		Texture2D.erroTextur = Texture2D.whiteTexture;
	}

	// todo  用支持 float 的texture 格式代替
	static _SimpleAnimatorTextureParse(data: ArrayBuffer, propertyParams: any = null, constructParams: any[] = null) {
		var byte: Byte = new Byte(data);
		var version: String = byte.readUTFString();
		var texture: Texture2D;
		var pixelDataArrays: Float32Array | Uint16Array;
		var usePixelData: Float32Array | Uint16Array;
		switch (version) {
			case "LAYAANIMATORTEXTURE:0000":
				var textureWidth: number = byte.readInt32();
				var pixelDataLength: number = byte.readInt32();
				pixelDataArrays = new Float32Array(textureWidth * textureWidth * 4);
				usePixelData = new Float32Array(byte.readArrayBuffer(pixelDataLength * 4));
				pixelDataArrays.set(usePixelData, 0);
				var texture: Texture2D = new Texture2D(textureWidth, textureWidth, TextureFormat.R32G32B32A32, false, false);
				texture.setPixelsData(pixelDataArrays, false, false);
				texture.filterMode = FilterMode.Point;
				break;
			case "LAYACOMPRESSANIMATORTEXTURE:0000":
				var textureWidth: number = byte.readInt32();
				var pixelDataLength: number = byte.readInt32();
				pixelDataArrays = new Uint16Array(byte.readArrayBuffer(pixelDataLength * 2));
				if (!LayaGL.renderEngine.getCapable(RenderCapable.TextureFormat_R16G16B16A16)) {
					console.log("The platform does not support 16-bit floating-point textures");
					if (!LayaGL.renderEngine.getCapable(RenderCapable.TextureFormat_R32G32B32A32))
						console.error("The platform does not support 32-bit floating-point textures");
					usePixelData = new Float32Array(textureWidth * textureWidth * 4);
					for (var i = 0, n = pixelDataArrays.length; i < n; i++) {
						usePixelData[i] = HalfFloatUtils.convertToNumber(pixelDataArrays[i]);
					}
					texture = new Texture2D(textureWidth, textureWidth, TextureFormat.R32G32B32A32, false, false);
					texture.setPixelsData(usePixelData, false, false);
					texture.filterMode = FilterMode.Point;

				} else {
					usePixelData = new Uint16Array(textureWidth * textureWidth * 4);
					usePixelData.set(pixelDataArrays, 0);
					texture = new Texture2D(textureWidth, textureWidth, TextureFormat.R16G16B16A16, false, false);
					texture.setPixelsData(usePixelData, false, false);
					texture.filterMode = FilterMode.Point;
				}
				break;
			default:
				throw "Laya3D:unknow version.";
		}

		return texture;
	}

	static _parseImage(imageSource: any, propertyParams: any = null, constructParams: any[] = null): Texture2D {

		let format = constructParams ? constructParams[2] : TextureFormat.R8G8B8A8;
		let mipmap = constructParams ? constructParams[3] : true;
		let canread = constructParams ? constructParams[4] : false;
		// todo  srgb
		let texture = new Texture2D(imageSource.width, imageSource.height, format, mipmap, canread, false);

		texture.setImageData(imageSource, false, false);

		if (propertyParams) {
			texture.wrapModeU = propertyParams.warpModeU;
			texture.wrapModeV = propertyParams.wrapModeV;
			texture.filterMode = propertyParams.filterMode;
			texture.anisoLevel = propertyParams.anisoLevel;
		}

		if (canread) {
			ILaya.Browser.canvas.size(imageSource.width, imageSource.height);
			ILaya.Browser.canvas.clear();
			ILaya.Browser.context.drawImage(imageSource, 0, 0, imageSource.width, imageSource.height);
			texture._pixels = new Uint8Array(ILaya.Browser.context.getImageData(0, 0, imageSource.width, imageSource.height).data.buffer);
		}

		return texture;
	}

	static _parseDDS(data: ArrayBuffer, propertyParams: any = null, constructParams: any[] = null) {

		let ddsInfo = DDSTextureInfo.getDDSTextureInfo(data);

		let texture = new Texture2D(ddsInfo.width, ddsInfo.height, ddsInfo.format, ddsInfo.mipmapCount > 1, false, false);

		texture.setDDSData(ddsInfo);

		if (propertyParams) {
			texture.wrapModeU = propertyParams.warpModeU;
			texture.wrapModeV = propertyParams.wrapModeV;
			texture.filterMode = propertyParams.filterMode;
			texture.anisoLevel = propertyParams.anisoLevel;
		}

		return texture;
	}

	static _parseKTX(data: ArrayBuffer, propertyParams: any = null, constructParams: any[] = null) {
		let ktxInfo = KTXTextureInfo.getKTXTextureInfo(data);

		let texture = new Texture2D(ktxInfo.width, ktxInfo.height, ktxInfo.format, ktxInfo.mipmapCount > 1, false, false);

		texture.setKTXData(ktxInfo);
		if (propertyParams) {
			texture.wrapModeU = propertyParams.warpModeU;
			texture.wrapModeV = propertyParams.wrapModeV;
			texture.filterMode = propertyParams.filterMode;
			texture.anisoLevel = propertyParams.anisoLevel;
		}
		return texture;
	}

	static _parsePVR(data: ArrayBuffer, propertyParams: any = null, constructParams: any[] = null): Texture2D {
		throw "pvr !";
	}

	static load(url: string, complete: Handler): void {
		ILaya.loader.create(url, complete, null, ILaya.Loader.TEXTURE2D);
	}

	_canRead: boolean = false;
	_pixels: Uint8Array;

	constructor(width: number, height: number, format: TextureFormat, mipmap: boolean = true, canRead: boolean, sRGB: boolean = false) {
		super(width, height, format);
		this._dimension = TextureDimension.Tex2D;
		this._gammaSpace = !sRGB;
		this._canRead = canRead;
		this._texture = LayaGL.textureContext.createTextureInternal(this._dimension, width, height, format, mipmap, sRGB);
		return;
	}

	setImageData(source: HTMLImageElement | HTMLCanvasElement | ImageBitmap, premultiplyAlpha: boolean, invertY: boolean) {
		let texture = this._texture;
		LayaGL.textureContext.setTextureImageData(texture, source, premultiplyAlpha, invertY);
	}

	setPixelsData(source: ArrayBufferView, premultiplyAlpha: boolean, invertY: boolean) {
		let texture = this._texture;
		LayaGL.textureContext.setTexturePixelsData(texture, source, premultiplyAlpha, invertY);
	}

	setSubPixelsData(xOffset: number, yOffset: number, width: number, height: number, pixels: ArrayBufferView, mipmapLevel: number, generateMipmap: boolean, premultiplyAlpha: boolean, invertY: boolean) {
		let texture = this._texture;
		LayaGL.textureContext.setTextureSubPixelsData(texture, pixels, mipmapLevel, generateMipmap, xOffset, yOffset, width, height, premultiplyAlpha, invertY);
	}

	setDDSData(ddsInfo: DDSTextureInfo) {
		let texture = this._texture;
		LayaGL.textureContext.setTextureDDSData(texture, ddsInfo);
	}

	setKTXData(ktxInfo: KTXTextureInfo) {
		let texture = this._texture;
		LayaGL.textureContext.setTextureKTXData(texture, ktxInfo);
	}

	setHDRData(hdrInfo: HDRTextureInfo) {
		let texture = this._texture;
		LayaGL.textureContext.setTextureHDRData(texture, hdrInfo);
	}

	get defaulteTexture(): BaseTexture {
		return Texture2D.grayTexture;
	}

	// TODO  去掉
	getPixels() {
		if (this._canRead && this._pixels) {
			return this._pixels;
		}
		else {
			throw new Error("Texture2D: must set texture canRead is true.");
		}
	}
}