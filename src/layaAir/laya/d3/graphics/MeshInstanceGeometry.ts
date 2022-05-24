import { DrawType } from "../../RenderEngine/RenderEnum/DrawType";
import { MeshTopology } from "../../RenderEngine/RenderEnum/RenderPologyMode";
import { GeometryElement } from "../core/GeometryElement";
import { RenderContext3D } from "../core/render/RenderContext3D";
import { SubMesh } from "../resource/models/SubMesh";

export class MeshInstanceGeometry extends GeometryElement {
    private _subMesh:SubMesh;
    constructor(subMesh: SubMesh) {
        super(MeshTopology.Triangles, DrawType.DrawElementInstance);
        this._subMesh = subMesh;
        if(subMesh)
        this.indexFormat = subMesh._mesh.indexFormat;
    }

    set subMesh(value:SubMesh){
        this._subMesh = value;
        if(value)
        this.indexFormat = value._mesh.indexFormat;
    }

    get subMesh():SubMesh{
        return this._subMesh
    }

    /**
     * @internal
     * UpdateGeometry Data
     */
    _updateRenderParams(state: RenderContext3D): void {
        this.clearRenderParams();
		this.setDrawElemenParams(this._subMesh.indexCount, this._subMesh._indexStart * 2);
    }

}