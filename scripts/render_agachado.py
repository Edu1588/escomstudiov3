import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\hero\robo-agachado.glb")

# Adiciona câmera e luz
bpy.ops.object.camera_add(location=(1.5, -3.0, 1.0), rotation=(1.4, 0, 0.45))
bpy.context.scene.camera = bpy.context.active_object

bpy.ops.object.light_add(type='SUN', location=(5, -5, 10))

bpy.context.scene.render.resolution_x = 640
bpy.context.scene.render.resolution_y = 360
bpy.context.scene.render.filepath = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\home-teste\agachado_render.png"
bpy.ops.render.render(write_still=True)
print("Renderizado agachado_render.png com sucesso!")
