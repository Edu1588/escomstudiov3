import bpy

# Limpa cena atual
bpy.ops.wm.read_factory_settings(use_empty=True)

# Importa o robo-agachado.glb
glb_path = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo-agachado.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

armature = bpy.data.objects.get("Armature")
if armature:
    print("Armature carregada com sucesso do GLB!")
    print("Pose atual dos Hips:", armature.pose.bones["mixamorig:Hips"].location)
    print("Ações disponíveis:", [a.name for a in bpy.data.actions])
    
    # Salva as transformações da pose agachada como referência
    crouch_pose = {}
    for pbone in armature.pose.bones:
        crouch_pose[pbone.name] = {
            "location": list(pbone.location),
            "rotation_quaternion": list(pbone.rotation_quaternion),
            "scale": list(pbone.scale)
        }
    
    import json
    with open(r"E:\ANTIGRAVITY\ESCOM_STUDIO\scripts\crouch_pose.json", "w") as f:
        json.dump(crouch_pose, f, indent=2)
    print("Pose agachada salva em scripts/crouch_pose.json!")
