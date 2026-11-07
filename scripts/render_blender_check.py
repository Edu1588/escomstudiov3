import bpy

# Abre o blend que geramos
blend_path = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo_o_corte_animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

armature = bpy.data.objects.get("Armature")
print("Action ativa:", armature.animation_data.action.name)
print("Frame range:", armature.animation_data.action.frame_range)

# Configura câmera para renderizar um preview rápido no frame 1, frame 60 e frame 105
cam = bpy.data.objects.get("MainCamera")
if not cam:
    bpy.ops.object.camera_add(location=(0, -2.5, 1.0), rotation=(1.5708, 0, 0))
    cam = bpy.context.active_object
    bpy.context.scene.camera = cam

bpy.context.scene.render.resolution_x = 640
bpy.context.scene.render.resolution_y = 360

for f in [1, 60, 105]:
    bpy.context.scene.frame_set(f)
    out_path = rf"E:\ANTIGRAVITY\ESCOM_STUDIO\public\home-teste\blender_f{f}.png"
    bpy.context.scene.render.filepath = out_path
    bpy.ops.render.render(write_still=True)
    print(f"Renderizado frame {f} em:", out_path)
