# Prompts de frames — "O Corte" (/home-teste)

Uso: gerar frame inicial e final de cada cena para depois interpolar em vídeo (IA image-to-video → frames WebP).
Sempre anexar a imagem de referência do robô/hero no gerador para manter consistência.

## Bloco fixo de estilo (colar em TODOS os prompts)

```
STYLE LOCK: cinematic 3D render, dark tech aesthetic, near-black background (#030405), cold teal/cyan ambient light, neon green accent light (#39FF14), subtle volumetric haze, wet reflective concrete floor with mirror reflections, shallow depth of field, 16:9, 4K, photoreal PBR materials, Unreal Engine 5 / Octane look, no text, no letters, no UI, no watermark, no logo.

CHARACTER LOCK: slim humanoid android; glossy white ceramic helmet-head with two pointed swept-back ear fins, large rounded dark face visor with a small blue eye; white robotic arms, hands and feet with black joints; fitted dark grey/navy t-shirt; loose dark cargo pants. Same character in every frame, same proportions, same outfit.
(Referências do robô: .user_uploaded/media_1793312957878_3efd831d.png, media_1793312938361_9a96ca1d.png, media_1793312934339_9d460dde.png)

SET LOCK: industrial warehouse rendered as a glowing cyan BLUEPRINT wireframe on near-black — steel columns, roof trusses, purlins, rolling gate at the back, technical grid on the floor, dissolving into darkness.
(Placa de fundo: public/home-teste/frames/galpao_blueprint_hero.png — gerada por public/home-teste/blueprint.html + scripts/capture_blueprint.mjs)

BUTTERFLY LOCK: luminous blue morpho butterfly, iridescent electric-blue wings with soft glow and tiny light particles.
```

---

## CENA 1 — HERO → O Corte

### Frame 1A — INICIAL (estado atual do hero, já existe)
```
[STYLE LOCK] [CHARACTER LOCK] [SET LOCK] [BUTTERFLY LOCK]
The android kneels/crouches on one knee on the wet reflective floor, right side of the frame, head gently tilted, contemplating a glowing blue morpho butterfly perched on its extended index finger. Calm, quiet, reverent mood. Camera at low eye level, medium-wide shot, robot occupies the right third, large negative space on the left. Reflection of robot and butterfly on the floor.
```

### Frame 1B — EM PÉ (borboleta virando katana)
```
[STYLE LOCK] [CHARACTER LOCK] [SET LOCK] [BUTTERFLY LOCK]
Same camera, same framing and position as the crouching shot, but the android has now risen and stands fully upright, calm and focused, right side of the frame. Its right hand is raised at chest height; the blue butterfly is dissolving into streams of light particles that stretch and condense along the hand into the beginning of a slim katana blade made of pure light — the transformation is mid-way: wing shapes still visible at the hilt, the blade forming as a thin luminous line turning from electric blue to neon green. The light from the forming blade rim-lights the robot's ceramic hands and visor and reflects on the wet floor. Tension before action, no motion blur yet.
```

### Frame 1C — CORTANDO (final da cena)
```
[STYLE LOCK] [CHARACTER LOCK] [SET LOCK]
Same camera, same framing. The android, now holding a fully formed slim katana of pure neon-green light (#39FF14) with a blue-white hot core, executes a powerful diagonal slash from upper-left to lower-right across the whole frame. Dynamic stance: front knee bent, torso rotated, blade extended at the end of the swing. A razor-thin glowing diagonal cut line crosses the ENTIRE image edge to edge, as if the screen itself is being sliced: the two halves of the image are slightly offset along the cut, with a bright neon seam, tiny sparks and light particles spilling from the cut. The tip of the cut glows brightest. Strong neon green light spill on the floor reflections. Precise, controlled, elegant — not violent.
```

> Dica de vídeo (1A → 1B → 1C): gerar 2 clipes image-to-video curtos (3–5 s) usando 1A→1B e 1B→1C como primeiro/último frame, câmera travada, mesmo enquadramento.

---

## Próximas cenas (a detalhar)
- Cena 2 — O Diagnóstico: inicial (robô emergindo do solo) / final (caminhando lateral, boxes escaneados).
- Cena 3 — A Construção: um par por serviço.
- Cena 4 — A Prova: idle observando.
- Cena 5 — A Catarse: borboleta na lâmina / robô agachado oferecendo a borboleta olhando para a câmera.
