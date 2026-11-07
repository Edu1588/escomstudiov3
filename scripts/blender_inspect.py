import bpy

# Inspeciona o arquivo blend
blend_path = r"E:\ANTIGRAVITY\ESCOM_STUDIO\public\models\robolito_preview.blend"
print("Carregando:", blend_path)

armature_obj = None
for obj in bpy.data.objects:
    print(f"Objeto: {obj.name}, Tipo: {obj.type}")
    if obj.type == 'ARMATURE':
        armature_obj = obj

if armature_obj:
    print("\n=== ARMATURE ENCONTRADA ===")
    print("Nome:", armature_obj.name)
    print("Total de ossos:", len(armature_obj.data.bones))
    print("Nomes dos ossos:", [b.name for b in armature_obj.data.bones[:25]])
    
    print("\n=== ANIMAÇÕES EXISTENTES (ACTIONS) ===")
    for act in bpy.data.actions:
        print(f"Action: {act.name}, Duração: {act.frame_range}")
else:
    print("Nenhuma armature encontrada no arquivo blend!")
