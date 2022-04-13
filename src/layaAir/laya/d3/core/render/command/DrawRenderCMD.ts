import { IRenderElement } from "../../../../RenderEngine/RenderInterface/RenderPipelineInterface/IRenderElement";
import { DefineDatas } from "../../../../RenderEngine/RenderShader/DefineDatas";
import { Material } from "../../material/Material";
import { BaseRender } from "../BaseRender";
import { RenderContext3D } from "../RenderContext3D";
import { RenderElement } from "../RenderElement";
import { Command } from "./Command";
import { CommandBuffer } from "./CommandBuffer";

export class DrawRenderCMD extends Command {
    /**@internal */
    private static _pool: any[] = [];
    /**@internal */
    private static _compileDefine: DefineDatas = new DefineDatas();
    private static _elemntpool: IRenderElement[] = [];
    /**
     * @internal
     */
    static create(render: BaseRender, material: Material, subShaderIndex: number, commandBuffer: CommandBuffer): DrawRenderCMD {
        var cmd: DrawRenderCMD;
        cmd = DrawRenderCMD._pool.length > 0 ? DrawRenderCMD._pool.pop() : new DrawRenderCMD();
        cmd._render = render;
        cmd._material = material;
        cmd._subShaderIndex = subShaderIndex;
        cmd._commandBuffer = commandBuffer;
        return cmd;
    }
    /**@internal */
    private _material: Material;
    /**@internal */
    private _render: BaseRender;
    /**@internal */
    private _subShaderIndex: number;
    
    /**
	 * @internal
	 */
    private _elementRender(renderElement:RenderElement,context: RenderContext3D): void {
        renderElement.renderSubShader =  this._material._shader.getSubShaderAt(this._subShaderIndex);
        renderElement.material = this._material;
        renderElement._renderUpdatePre(context);
        renderElement._render(context._contextOBJ);
    }

    /**
	 * @inheritDoc
	 * @override
	 */
	run(): void {
		if(!this._material)
			throw "This render command material cannot be empty";
		this.setContext(this._commandBuffer._context);
		var context = this._context;
        context._contextOBJ.applyContext();
		var renderElements = this._render._renderElements;
		for(var i:number = 0,n = renderElements.length;i<n;i++){
			var renderelement = renderElements[i];
			//change Material
            let mat = renderelement.material;
            this._elementRender(renderelement,context);
            //Recover Material
            renderelement.material = mat;
		}
	}


    /**
     * @inheritDoc
     * @override
     */
    recover(): void {
        DrawRenderCMD._pool.push(this);

    }

}