import { ESpineRenderType } from "../SpineSkeleton";
import { AttachmentParse } from "./AttachmentParse";

/**
 * @en Utility class for Spine slot operations.
 * @zh Spine ��۲�����ʵ�ù����ࡣ
 */
export class SlotUtils {
    /**
     * @en Check the type of attachment and determine the appropriate render type.
     * @param attachment The spine attachment to check.
     * @zh ��鸽�������Ͳ�ȷ���ʵ�����Ⱦ���͡�
     * @param attachment Ҫ���� Spine ������
     */
    static checkAttachment(attachment: spine.Attachment) {
        //let attachment = slot.getAttachment();
        if (attachment == null) return ESpineRenderType.rigidBody;
        if (attachment instanceof window.spine.RegionAttachment) {
            return ESpineRenderType.rigidBody;
        }
        else if (attachment instanceof window.spine.MeshAttachment) {
            //return false;
            let mesh = attachment as spine.MeshAttachment;
            if (!mesh.bones) {
                return ESpineRenderType.rigidBody
            }
            else {
                return ESpineRenderType.boneGPU;
            }
        }
        else {
            return ESpineRenderType.normal;
        }
    }

    /**
     * @en Append index array from attachment parse to the target index array.
     * @param attachmentParse The attachment parse containing the source index array.
     * @param indexArray The target index array to append to.
     * @param size The size to offset each index by.
     * @param offset The starting offset in the target index array.
     * @zh �����������е���������׷�ӵ�Ŀ���������顣
     * @param attachmentParse ����Դ��������ĸ���������
     * @param indexArray Ҫ׷�ӵ���Ŀ���������顣
     * @param size ÿ��������ƫ������
     * @param offset Ŀ�����������е���ʼƫ������
     */    
	static appendIndexArray(attachmentParse: AttachmentParse, indexArray: Uint16Array | Uint8Array | Uint32Array, size: number, offset: number) {
        if (!attachmentParse.attachment || !attachmentParse.indexArray) return offset;
        let slotindexArray = attachmentParse.indexArray;
        for (let j = 0, n = slotindexArray.length; j < n; j++) {
            indexArray[offset] = slotindexArray[j] + size;
            offset++;
        }
        return offset;
    }
}