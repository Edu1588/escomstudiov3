import bpy
import json

bpy.ops.wm.read_factory_settings(use_empty=True)
glb_path = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo-agachado.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

armature = bpy.data.objects.get("Armature")
print("Analisando ações...")
for act in bpy.data.actions:
    print(f"\nAção: {act.name}")
    armature.animation_data.action = act
    bpy.context.scene.frame_set(1)
    hips = armature.pose.bones["mixamorig:Hips"]
    head = armature.pose.bones["mixamorig:Head"]
    r_hand = armature.pose.bones["mixamorig:RightHand"]
    print(f"Frame 1 -> Hips loc: {hips.location}, Head loc: {head.location}")
