import { SimpleSingletonList } from "../../../d3/component/SimpleSingletonList";
import { BaseRender } from "../../../d3/core/render/BaseRender";

export interface ISceneRenderManager {

    list: SimpleSingletonList;
    /**
     * add one BaseRender
     * @param object 
     */
    addRenderObject(object: BaseRender): void;
    /**
     * remove RenderObject
     * @param object 
     */
    removeRenderObject(object: BaseRender): void;
    /**
     * 移除某个动态的渲染节点
     * @param object 
     */
    removeMotionObject(object: BaseRender): void;
    /**
     * 增加运动物体
     * @param object 
     */
    addMotionObject(object: BaseRender): void;
    /**
     * 更新运动物体
     * @param object 
     */
    updateMotionObjects(): void;
    /**
     * release Manager Node
     */
    destroy(): void;
}