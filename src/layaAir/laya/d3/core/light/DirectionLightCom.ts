import { Vector3 } from "../../math/Vector3";
import { Scene3D } from "../scene/Scene3D";
import { ShadowCascadesMode } from "./ShadowCascadesMode";
import { Light, LightType } from "./Light";


/**
 * <code>DirectionLight</code> 类用于创建平行光。
 */
export class DirectionLightCom extends Light {
	/** @internal */
	_direction: Vector3 = new Vector3();
	/** @internal */
	_shadowCascadesMode: ShadowCascadesMode = ShadowCascadesMode.NoCascades;
	/** @internal */
	_shadowTwoCascadeSplits: number = 1.0 / 3.0;
	/** @internal */
	_shadowFourCascadeSplits: Vector3 = new Vector3(1.0 / 15, 3.0 / 15.0, 7.0 / 15.0);

	/**
	 * 阴影级联数量。
	 */
	get shadowCascadesMode(): ShadowCascadesMode {
		return this._shadowCascadesMode;
	}

	set shadowCascadesMode(value: ShadowCascadesMode) {
		this._shadowCascadesMode = value;
	}

	/**
	 * 二级级联阴影分割比例。
	 */
	get shadowTwoCascadeSplits(): number {
		return this._shadowTwoCascadeSplits;
	}

	set shadowTwoCascadeSplits(value: number) {
		this._shadowTwoCascadeSplits = value;
	}

	/**
	 * 四级级联阴影分割比例,X、Y、Z依次为其分割比例,Z必须大于Y,Y必须大于X。
	 */
	get shadowFourCascadeSplits(): Vector3 {
		return this._shadowFourCascadeSplits;
	}

	set shadowFourCascadeSplits(value: Vector3) {
		if (value.x > value.y || value.y > value.z || value.z > 1.0)
			throw "DiretionLight:Invalid value.";
		value.cloneTo(this._shadowFourCascadeSplits);
	}

	/**
	 * 创建一个 <code>DirectionLight</code> 实例。
	 */
	constructor() {
		super();
		this._lightType = LightType.Directional;
	}

	/**
	 * @internal
	 * @override
	 */
	protected _addToLightQueue(): void {
		(<Scene3D>this.owner.scene)._directionLights.add(this);
	}

	/**
	 * @internal
	 * @override
	 */
	protected _removeFromLightQueue(): void {
		(<Scene3D>this.owner.scene)._directionLights.remove(this);
	}

	/**
	 * @internal
	 */
	protected _create(): DirectionLightCom {
		return new DirectionLightCom();
	}
}

