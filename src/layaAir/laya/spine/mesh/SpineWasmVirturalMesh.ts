
import { IRenderElement2D } from "../../RenderDriver/DriverDesign/2DRenderPass/IRenderElement2D";
import { type VertexDeclaration } from "../../RenderEngine/VertexDeclaration";
import { LayaGL } from "../../layagl/LayaGL";
import { type Material } from "../../resource/Material";
import { SpineShaderInit } from "../material/SpineShaderInit";
import { SpineMeshBase } from "./SpineMeshBase";

/**
 * @en SpineWasmVirturalMesh class for handling Spine skeleton mesh rendering using WebAssembly.
 * @zh SpineWasmVirturalMesh ������ʹ�� WebAssembly ���� Spine ����������Ⱦ��
 */
export class SpineWasmVirturalMesh extends SpineMeshBase {

    private _renderElement2D: IRenderElement2D;
    /**
     * @en Create a SpineWasmVirturalMesh instance.
     * @param material Material to be used for rendering.
     * @zh ���� SpineWasmVirturalMesh ʵ����
     * @param material ������Ⱦ�Ĳ��ʡ�
     */
    constructor(material: Material) {
        super(material);
        this._renderElement2D = LayaGL.render2DRenderPassFactory.createRenderElement2D();
        this._renderElement2D.geometry = this.geo;
        this._renderElement2D.nodeCommonMap = ["BaseRender2D","spine2D"];
    }

    /**
     * @en The vertex declaration for the mesh.
     * @zh ����Ķ���������
     */
    get vertexDeclarition(): VertexDeclaration {
        return SpineShaderInit.SpineNormalVertexDeclaration;
    }
}
