import { Spine2DRenderNode } from "../Spine2DRenderNode";
import { AnimationRender, SkinAniRenderData } from "./AnimationRender";
import { IVBIBUpdate } from "./interface/IVBIBUpdate";

/**
 * @en Animation rendering proxy class for managing animation state and rendering.
 * @zh ������Ⱦ�����࣬���ڹ�����״̬����Ⱦ��
 */
export class AnimationRenderProxy {
    /**
     * @en The animation state.
     * @zh ����״̬��
     */
    state: spine.AnimationState;
    /**
     * @en The current animation time.
     * @zh ��ǰ����ʱ�䡣
     */
    currentTime: number;
    /**
     * @en The current frame index.
     * @zh ��ǰ֡������
     */
    currentFrameIndex: number;
    /**
     * @en The animation renderer.
     * @zh ������Ⱦ����
     */
    animator: AnimationRender;
    //vb: VBCreator;
    /**
     * @en The current skin animation render data.
     * @zh ��ǰƤ��������Ⱦ���ݡ�
     */
    currentSKin: SkinAniRenderData;

    /**
     * @en Creates an instance of AnimationRenderProxy.
     * @param animator The animation renderer.
     * @zh ���� AnimationRenderProxy ��ʵ����
     * @param animator ������Ⱦ����
     */
    constructor(animator: AnimationRender) {
        this.animator = animator;
        // this.vb = animator.vb;
        this.reset();
    }
    /**
     * @en Sets the skin index.
     * @param value The skin index to set.
     * @zh ����Ƥ��������
     * @param value Ҫ���õ�Ƥ��������
     */
    set skinIndex(value: number) {
        this.currentSKin = this.animator.skinDataArray[value];
    }

    /**
     * @en Gets the name of the animator.
     * @returns The name of the animator.
     * @zh ��ȡ�����������ơ�
     * @returns �����������ơ�
     */
    get name() {
        return this.animator.name;
    }

    /**
     * @en Resets the animation state.
     * @zh ���ö���״̬��
     */
    reset() {
        this.currentTime = -1;
        this.currentFrameIndex = -2;
    }
    /**
     * @en Renders the animation without matrix transformation.
     * @param slots The slots to render.
     * @param updator The VB/IB updater.
     * @param curTime The current animation time.
     * @zh �����о���任�Ķ�����Ⱦ��
     * @param slots Ҫ��Ⱦ�Ĳ�ۡ�
     * @param updator VB/IB ��������
     * @param curTime ��ǰ����ʱ�䡣
     */
    renderWithOutMat(slots: spine.Slot[], updator: IVBIBUpdate, curTime: number) {
        let beforeFrame = this.currentFrameIndex;
        let nowFrame = this.animator.getFrameIndex(curTime, beforeFrame);
        let currentSKin = this.currentSKin;
        // let vb = currentSKin.vb;
        // let vb = currentSKin.;
        // if (currentSKin.checkVBChange(slots)) {
        //     updator.updateVB(vb.vb, vb.vbLength);
        // }
        updator.renderUpdate(currentSKin , nowFrame);
        
        this.currentTime = curTime;
        this.currentFrameIndex = nowFrame;

        // if (nowFrame != beforeFrame) {
        //     //TODO
        // }
    }

    /**
     * @en Renders the animation with matrix transformation.
     * @param bones The bones to render.
     * @param slots The slots to render.
     * @param updator The VB/IB updater.
     * @param curTime The current animation time.
     * @param boneMat The bone matrix.
     * @zh ���о���任�Ķ�����Ⱦ��
     * @param bones Ҫ��Ⱦ�Ĺ�����
     * @param slots Ҫ��Ⱦ�Ĳ�ۡ�
     * @param updator VB/IB ��������
     * @param curTime ��ǰ����ʱ�䡣
     * @param boneMat ��������
     */
    render(bones: spine.Bone[], slots: spine.Slot[], updator: IVBIBUpdate, curTime: number, boneMat: Float32Array) {
        this.renderWithOutMat(slots, updator, curTime );
        this.currentSKin.updateBoneMat(curTime, this.animator, bones, this.state, boneMat);
    }
}
