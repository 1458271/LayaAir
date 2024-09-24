import { Shader3D, ShaderFeatureType } from "../../RenderEngine/RenderShader/Shader3D";
import spineVertex from "../files/SpineVertex.glsl"
import spineFragment from "../files/SpineFragment.glsl"
import { LayaGL } from "../../layagl/LayaGL";
import { ShaderDataType } from "../../RenderDriver/DriverDesign/RenderDevice/ShaderData";
import spineStandardVS from "../files/SpineStandard.vs"
import spineStandardFS from "../files/SpineStandard.fs"
import { SubShader } from "../../RenderEngine/RenderShader/SubShader";
import { Laya } from "../../../Laya";
import { ShaderDefine } from "../../RenderDriver/RenderModuleData/Design/ShaderDefine";
import { Material } from "../../resource/Material";
import { RenderState } from "../../RenderDriver/RenderModuleData/Design/RenderState";
import { VertexDeclaration } from "../../RenderEngine/VertexDeclaration";
import { VertexElement } from "../../renders/VertexElement";
import { VertexElementFormat } from "../../renders/VertexElementFormat";
import { SpineMeshUtils } from "../mesh/SpineMeshUtils";
/**
 * @en SpineShaderInit class handles the initialization and management of Spine shader-related components.
 * @zh SpineShaderInit �����ڴ��� Spine ��ɫ���������ĳ�ʼ���͹���
 */
export class SpineShaderInit {

    static SpineFastVertexDeclaration: VertexDeclaration;

    /**
     * @en Vertex declaration for normal Spine rendering.
     * @zh ������ͨ Spine ��Ⱦ�Ķ���������
     */
    static SpineNormalVertexDeclaration: VertexDeclaration;

    // static SpineRBVertexDeclaration: VertexDeclaration;


    /**
     * @en Vertex declaration for instance normal matrix.
     * @zh ʵ�����߾���Ķ���������
     */
    static instanceNMatrixDeclaration:VertexDeclaration;
    
    /**
     * @en Vertex declaration for instance simple animator.
     * @zh ʵ���򵥶������Ķ���������
     */
    static instanceSimpleAnimatorDeclaration:VertexDeclaration;

    /**
     * @en Set the blend mode for Spine material.
     * @param value The blend mode value.
     * @param mat The material to set the blend mode for.
     * @zh ���� Spine ���ʵĻ��ģʽ��
     * @param value ���ģʽֵ��
     * @param mat Ҫ���û��ģʽ�Ĳ��ʡ�
     */
    static SetSpineBlendMode(value: number, mat: Material) {
        switch (value) {
            case 1: //light 
            case 3: //screen
                mat.blendSrc = RenderState.BLENDPARAM_ONE;
                mat.blendDst = RenderState.BLENDPARAM_ONE;
                break;
            case 2://multiply
                mat.blendSrc = RenderState.BLENDPARAM_DST_COLOR;
                mat.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;

                break;
            default://nomal
                mat.blendSrc = RenderState.BLENDPARAM_ONE;
                mat.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
        }
    }

    /**
     * @en Initialize the Spine material with default settings.
     * @param mat The material to initialize.
     * @zh ʹ��Ĭ�����ó�ʼ�� Spine ���ʡ�
     * @param mat Ҫ��ʼ���Ĳ��ʡ�
     */
    static initSpineMaterial(mat: Material) {
        mat.alphaTest = false;
        mat.depthWrite = false;
        mat.cull = RenderState.CULL_NONE;
        mat.blend = RenderState.BLEND_ENABLE_ALL;
        mat.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
        mat.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
        mat.depthTest = RenderState.DEPTHTEST_OFF;
    }

    /**
     * @en Property ID for bone matrix.
     * @zh ������������� ID��
     */
    static BONEMAT: number;

    // static NMatrix: number;

    // static Color: number;

    // static Size: number;

    /**
     * @internal
     * @en Simple animator texture.
     * @zh �򵥶���������
     */
    static SIMPLE_SIMPLEANIMATORTEXTURE: number;
    /**
     * @internal
     * @en Simple animator parameters.
     * @zh �򵥶�����������
     */
    static SIMPLE_SIMPLEANIMATORPARAMS: number;
    /**
     * @internal
     * @en Simple animator texture size.
     * @zh �򵥶���������ߴ硣
     */
    static SIMPLE_SIMPLEANIMATORTEXTURESIZE: number;

    /**
     * @en Property ID for Spine texture.
     * @zh Spine ��������� ID��
     */
    static SpineTexture: number;

    /**
     * @en Shader define for fast Spine rendering.
     * @zh ���� Spine ��Ⱦ����ɫ�����塣
     */
    static SPINE_FAST: ShaderDefine;

    /**
     * @en Shader define for Spine rendering with runtime blending.
     * @zh ����ʱ��� Spine ��Ⱦ����ɫ�����塣
     */
    static SPINE_RB: ShaderDefine;

    static SPINE_UV: ShaderDefine;

    static SPINE_COLOR: ShaderDefine;

    static SPINE_SIMPLE:ShaderDefine;

    /**
     * @en Shader define for GPU instance rendering.
     * @zh GPU ʵ����Ⱦ����ɫ�����塣
     */
    static SPINE_GPU_INSTANCE:ShaderDefine;

    /**
     * @en TextureSV Mesh Descript.
     * @zh ���� Spine ��������������
     */
    public static readonly textureSpineAttribute: { [name: string]: [number, ShaderDataType] } = {
        'a_uv': [0, ShaderDataType.Vector2],
        'a_color': [1, ShaderDataType.Vector4],
        'a_position': [2, ShaderDataType.Vector2],
        "a_weight": [3, ShaderDataType.Float],
        "a_BoneId": [4, ShaderDataType.Float],

        'a_PosWeightBoneID_2': [5, ShaderDataType.Vector4],
        'a_PosWeightBoneID_3': [6, ShaderDataType.Vector4],
        'a_PosWeightBoneID_4': [7, ShaderDataType.Vector4],

        'a_NMatrix_0': [8, ShaderDataType.Vector3],
        'a_NMatrix_1': [9, ShaderDataType.Vector3],
        'a_SimpleTextureParams': [10, ShaderDataType.Vector4],
        //todo
        // "a_color2":[11,ShaderDataType.Vector4],
    }


    /**
     * @en Initialize Spine shader-related components.
     * @zh ��ʼ�� Spine ��ɫ����������
     */
    static init() {
        Shader3D.addInclude("SpineVertex.glsl", spineVertex);
        Shader3D.addInclude("SpineFragment.glsl", spineFragment);
        SpineShaderInit.BONEMAT = Shader3D.propertyNameToID("u_sBone");
        // SpineShaderInit.NMatrix = Shader3D.propertyNameToID("u_NMatrix");
        // SpineShaderInit.Color = Shader3D.propertyNameToID("u_color");
        // SpineShaderInit.Size = Shader3D.propertyNameToID("u_size");
        SpineShaderInit.SpineTexture = Shader3D.propertyNameToID("u_spineTexture");
        SpineShaderInit.SPINE_FAST = Shader3D.getDefineByName("SPINE_FAST");
        SpineShaderInit.SPINE_RB = Shader3D.getDefineByName("SPINE_RB");
        SpineShaderInit.SPINE_UV = Shader3D.getDefineByName("COLOR");
        SpineShaderInit.SPINE_COLOR = Shader3D.getDefineByName("UV");
        
        SpineShaderInit.SIMPLE_SIMPLEANIMATORPARAMS = Shader3D.propertyNameToID("u_SimpleAnimatorParams");
        SpineShaderInit.SIMPLE_SIMPLEANIMATORTEXTURE = Shader3D.propertyNameToID("u_SimpleAnimatorTexture");
        SpineShaderInit.SIMPLE_SIMPLEANIMATORTEXTURESIZE = Shader3D.propertyNameToID("u_SimpleAnimatorTextureSize");
        
        SpineShaderInit.SPINE_SIMPLE = Shader3D.getDefineByName("SPINE_SIMPLE");
        SpineShaderInit.SPINE_GPU_INSTANCE = Shader3D.getDefineByName("GPU_INSTANCE");
        

        const commandUniform = LayaGL.renderDeviceFactory.createGlobalUniformMap("Spine2D");
        commandUniform.addShaderUniform(SpineShaderInit.BONEMAT, "u_sBone", ShaderDataType.Buffer);
        // commandUniform.addShaderUniform(SpineShaderInit.NMatrix, "u_NMatrix", ShaderDataType.Buffer);
        // commandUniform.addShaderUniform(SpineShaderInit.Color, "u_color", ShaderDataType.Color);
        // commandUniform.addShaderUniform(SpineShaderInit.Size, "u_size", ShaderDataType.Vector2);
        
        commandUniform.addShaderUniform(SpineShaderInit.SIMPLE_SIMPLEANIMATORPARAMS, "u_SimpleAnimatorParams", ShaderDataType.Vector4);
        commandUniform.addShaderUniform(SpineShaderInit.SIMPLE_SIMPLEANIMATORTEXTURE, "u_SimpleAnimatorTexture", ShaderDataType.Texture2D);
        commandUniform.addShaderUniform(SpineShaderInit.SIMPLE_SIMPLEANIMATORTEXTURESIZE, "u_SimpleAnimatorTextureSize", ShaderDataType.Float);

        // commandUniform.addShaderUniform(SpineShaderInit.SpineTexture, "u_spineTexture", ShaderDataType.Texture2D);

        let shader = Shader3D.add("SpineStandard", true, false);
        shader.shaderType = ShaderFeatureType.D2;
        let uniformMap = {
            "u_spineTexture": ShaderDataType.Texture2D
        }
        let subShader = new SubShader(SpineShaderInit.textureSpineAttribute , uniformMap);
        shader.addSubShader(subShader);
        let shadingPass = subShader.addShaderPass(spineStandardVS, spineStandardFS);


        // SpineShaderInit.SpineFastVertexDeclaration = new VertexDeclaration(88, [
        //     new VertexElement(0, VertexElementFormat.Vector2, 0),
        //     new VertexElement(8, VertexElementFormat.Vector4, 1),
        //     new VertexElement(24, VertexElementFormat.Vector2, 2),
        //     new VertexElement(32, VertexElementFormat.Single, 3),
        //     new VertexElement(36, VertexElementFormat.Single, 4),
        //     new VertexElement(40, VertexElementFormat.Vector4, 5),
        //     new VertexElement(56, VertexElementFormat.Vector4, 6),
        //     new VertexElement(72, VertexElementFormat.Vector4, 7)
        // ]);

        // SpineShaderInit.SpineRBVertexDeclaration = new VertexDeclaration(36, [
        //     new VertexElement(0, VertexElementFormat.Vector2, 0),
        //     new VertexElement(8, VertexElementFormat.Vector4, 1),
        //     new VertexElement(24, VertexElementFormat.Vector2, 2),
        //     new VertexElement(32, VertexElementFormat.Single, 4)
        // ])

        SpineShaderInit.SpineNormalVertexDeclaration = SpineMeshUtils.getVertexDeclaration("UV,COLOR,POSITION")
        // SpineShaderInit.SpineNormalVertexDeclaration = new VertexDeclaration(32, [
        //     new VertexElement(0, VertexElementFormat.Vector2, 0),
        //     new VertexElement(8, VertexElementFormat.Vector4, 1),
        //     new VertexElement(24, VertexElementFormat.Vector2, 2)
        // ])


        SpineShaderInit.instanceNMatrixDeclaration = new VertexDeclaration(24 , [
            new VertexElement(0, VertexElementFormat.Vector3, 8),
            new VertexElement(12, VertexElementFormat.Vector3, 9),
        ])

        SpineShaderInit.instanceSimpleAnimatorDeclaration = new VertexDeclaration(16 , [
            new VertexElement(0, VertexElementFormat.Vector4, 10),
        ])
    }
}

Laya.addAfterInitCallback(SpineShaderInit.init);