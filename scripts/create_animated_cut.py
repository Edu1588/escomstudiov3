import bpy
import json
import math
from mathutils import Vector, Quaternion, Euler

# 1. Carregar arquivo original do robô oficial
blend_path = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\robolito_preview.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

armature = bpy.data.objects.get("Armature")
if not armature:
    print("ERRO: Armature não encontrada!")
    exit(1)

# Ativar Pose Mode
bpy.context.view_layer.objects.active = armature
bpy.ops.object.mode_set(mode='POSE')

# Ler a pose agachada de referência
with open(r"E:\ANTIGRAVITY\ESCOM_STUDIO\scripts\crouch_pose.json", "r") as f:
    crouch_pose = json.load(f)

# Criar nova Action "Hero_O_Corte"
action = bpy.data.actions.new(name="Hero_O_Corte")
if not armature.animation_data:
    armature.animation_data_create()
armature.animation_data.action = action

# Helper para aplicar e gravar keyframe de pose
def keyframe_all_bones(frame):
    for pbone in armature.pose.bones:
        pbone.keyframe_insert(data_path="location", frame=frame)
        pbone.keyframe_insert(data_path="rotation_quaternion", frame=frame)
        pbone.keyframe_insert(data_path="scale", frame=frame)

# --- FASE 1: FRAME 1 A 25 (POOSE AGACHADA ORIGINAL) ---
bpy.context.scene.frame_set(1)
for bone_name, data in crouch_pose.items():
    if bone_name in armature.pose.bones:
        pb = armature.pose.bones[bone_name]
        pb.location = Vector(data["location"])
        pb.rotation_quaternion = Quaternion(data["rotation_quaternion"])
        pb.scale = Vector(data["scale"])

keyframe_all_bones(1)
keyframe_all_bones(25)

# --- FASE 2: FRAME 25 A 60 (ROBÔ SE LEVANTA EM PÉ FRONTAL) ---
# Na transição de levantar:
# Os joelhos esticam, o quadril (Hips) sobe, o tronco alinha
bpy.context.scene.frame_set(60)

# Reseta ossos para postura de pé atlética
for pb in armature.pose.bones:
    pb.location = Vector((0, 0, 0))
    pb.rotation_quaternion = Quaternion((1, 0, 0, 0))
    pb.scale = Vector((1, 1, 1))

# Ajustes na postura de pé (Mixamo Hips e postura samurai)
hips = armature.pose.bones["mixamorig:Hips"]
hips.location = Vector((0, 0.05, 0.88)) # Eleva o robô do chão para altura natural em pé
hips.rotation_quaternion = Quaternion((0.99, 0.05, 0, 0))

# Pernas ligeiramente abertas e flexionadas em base firme
l_upleg = armature.pose.bones["mixamorig:LeftUpLeg"]
r_upleg = armature.pose.bones["mixamorig:RightUpLeg"]
l_upleg.rotation_quaternion = Euler((math.radians(-10), math.radians(8), math.radians(-5))).to_quaternion()
r_upleg.rotation_quaternion = Euler((math.radians(-10), math.radians(-8), math.radians(5))).to_quaternion()

# Coluna ereta e cabeça olhando para frente
spine = armature.pose.bones["mixamorig:Spine"]
head = armature.pose.bones["mixamorig:Head"]
spine.rotation_quaternion = Euler((math.radians(5), 0, 0)).to_quaternion()
head.rotation_quaternion = Euler((math.radians(-5), 0, 0)).to_quaternion()

# Braço direito preparando a pegada da katana (junto ao quadril/peito)
r_arm = armature.pose.bones["mixamorig:RightArm"]
r_forearm = armature.pose.bones["mixamorig:RightForeArm"]
r_hand = armature.pose.bones["mixamorig:RightHand"]
r_arm.rotation_quaternion = Euler((math.radians(35), math.radians(20), math.radians(-40))).to_quaternion()
r_forearm.rotation_quaternion = Euler((math.radians(0), math.radians(65), math.radians(0))).to_quaternion()
r_hand.rotation_quaternion = Euler((math.radians(15), math.radians(-20), math.radians(0))).to_quaternion()

# Braço esquerdo aberto em guarda atlética
l_arm = armature.pose.bones["mixamorig:LeftArm"]
l_forearm = armature.pose.bones["mixamorig:LeftForeArm"]
l_arm.rotation_quaternion = Euler((math.radians(20), math.radians(-15), math.radians(30))).to_quaternion()
l_forearm.rotation_quaternion = Euler((math.radians(0), math.radians(-40), math.radians(0))).to_quaternion()

keyframe_all_bones(60)

# Frame intermediário para curva de subida suave (Frame 42)
bpy.context.scene.frame_set(42)
hips.location = Vector((0, 0.02, 0.45))
keyframe_all_bones(42)

# --- FASE 3: FRAME 60 A 85 (PREPARAÇÃO DO CORTE / MATERIALIZAÇÃO) ---
bpy.context.scene.frame_set(85)
# Tronco recua ligeiramente para ganhar impulso
spine.rotation_quaternion = Euler((math.radians(-10), math.radians(15), 0)).to_quaternion()
r_arm.rotation_quaternion = Euler((math.radians(60), math.radians(40), math.radians(-60))).to_quaternion()
r_forearm.rotation_quaternion = Euler((math.radians(10), math.radians(90), 0)).to_quaternion()
head.rotation_quaternion = Euler((math.radians(5), math.radians(-10), 0)).to_quaternion()
keyframe_all_bones(85)

# --- FASE 4: FRAME 85 A 110 (O CORTE FRONTAL DIRETO CONTRA A TELA!) ---
bpy.context.scene.frame_set(105)
# Rotação explosiva para a frente em lunge frontal
hips.location = Vector((0, -0.15, 0.78))
spine.rotation_quaternion = Euler((math.radians(25), math.radians(-25), 0)).to_quaternion()

# Braço direito desfere o arco diagonal frontal completo cruzando o peito em direção à câmera
r_arm.rotation_quaternion = Euler((math.radians(45), math.radians(-40), math.radians(60))).to_quaternion()
r_forearm.rotation_quaternion = Euler((math.radians(-20), math.radians(20), math.radians(-30))).to_quaternion()
r_hand.rotation_quaternion = Euler((math.radians(30), math.radians(45), math.radians(20))).to_quaternion()

# Cabeça fixa na câmera
head.rotation_quaternion = Euler((math.radians(10), math.radians(15), 0)).to_quaternion()

keyframe_all_bones(105)

# --- FASE 5: FRAME 105 A 120 (ESTABILIZAÇÃO DO CORTE / SLOW FINISH) ---
bpy.context.scene.frame_set(120)
keyframe_all_bones(120)

bpy.ops.object.mode_set(mode='OBJECT')

# 2. Criar a Katana de Luz presa à mão direita do robô
bpy.ops.mesh.primitive_cube_add(size=1.0)
katana = bpy.context.active_object
katana.name = "KatanaLuz"

# Esculpir dimensões da lâmina da katana (longa, fina e curva)
katana.scale = Vector((0.02, 0.05, 0.95))
bpy.ops.object.transform_apply(scale=True)

# Material Emissivo Azul Morpho Elétrico (#00e5ff)
mat = bpy.data.materials.new(name="Mat_Katana_Azul")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()
node_emission = nodes.new(type='ShaderNodeEmission')
node_emission.inputs['Color'].default_value = (0.0, 0.898, 1.0, 1.0) # #00e5ff
node_emission.inputs['Strength'].default_value = 8.0
node_output = nodes.new(type='ShaderNodeOutputMaterial')
mat.node_tree.links.new(node_emission.outputs['Emission'], node_output.inputs['Surface'])
katana.data.materials.append(mat)

# Prender Katana no osso da mão direita
katana.parent = armature
katana.parent_type = 'BONE'
katana.parent_bone = "mixamorig:RightHand"
katana.location = Vector((0.05, 0.08, 0.35))
katana.rotation_euler = Euler((math.radians(85), 0, math.radians(-15)))

# Animação da Katana: Invisível/Escala 0 no início (agachado), cresce e surge no frame 55-70
katana.scale = Vector((0, 0, 0))
katana.keyframe_insert(data_path="scale", frame=1)
katana.keyframe_insert(data_path="scale", frame=45)

katana.scale = Vector((1, 1, 1))
katana.keyframe_insert(data_path="scale", frame=70)
katana.keyframe_insert(data_path="scale", frame=120)

# Salvar novo arquivo .blend
output_blend = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo_o_corte_animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=output_blend)
print("Arquivo .blend animado salvo em:", output_blend)

# Exportar para GLTF/GLB animado pronto para WebGL Three.js
output_glb = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo_o_corte_animated.glb"
bpy.ops.export_scene.gltf(
    filepath=output_glb,
    export_format='GLB',
    use_selection=False,
    export_animations=True,
    export_current_frame=False,
    export_skins=True,
    export_morph=True,
    export_lights=False,
    export_cameras=False
)
print("Modelo GLB animado exportado com sucesso em:", output_glb)
