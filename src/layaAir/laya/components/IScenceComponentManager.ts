/**
 * @en Interface for the overall management of a type of component within a 3D scene.
 * @zh ����3D������ĳ���������ȫ�����Ľӿڡ�
 */
export interface IElementComponentManager {

    /**
     * @en An internal identifier used to find the manager by Scene3D.
     * @zh ��Scene3D�������ҹ��������ڲ����ơ�
     */
    name: string;

    /**
     * @en Initialization method called during Scene3D initialization.
     * @zh ��Scene3D��ʼ���ڼ���õķ�����
     */
    Init(data: any): void;

    /**
     * @en Update method called every frame in the render loop.
     * @zh ����Ⱦѭ����ÿ֡���õĸ��·�����
     */
    update(dt: number): void;
}