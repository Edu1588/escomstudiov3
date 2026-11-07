import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { clone as clonarComEsqueleto } from "three/examples/jsm/utils/SkeletonUtils.js";

const URL_FLORESTA = "/models/hero/floresta.glb";
const URL_ROBO = "/models/ROBO_NOVO_NOVEMBRO.glb";
const URL_GALPAO = "/models/hero/galpao.glb";

const PECAS_CABECA = ["12", "14", "55", "57", "13", "38", "3", "46", "48", "53", "20", "35", "19", "29", "45", "36", "42"];
const PECA_OLHO = "tripo_part_53";
const PECA_BORBOLETA_LARANJA = "tripo_part_9";
const NOME_BORBOLETA = "butterfly_6";

const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const suave = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const SHADER_CHAO_MOLHADO = {
  name: "ChaoMolhado",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    opacidade: { value: 0.58 },
    raio: { value: 0.5 },
    tempo: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix; varying vec4 vUvR; varying vec2 vUv;
    void main(){ vUv = uv; vUvR = textureMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color; uniform sampler2D tDiffuse; uniform float opacidade; uniform float raio; uniform float tempo;
    varying vec4 vUvR; varying vec2 vUv;
    float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float suave(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(ruido(i), ruido(i + vec2(1, 0)), f.x), mix(ruido(i + vec2(0, 1)), ruido(i + vec2(1, 1)), f.x), f.y); }
    void main(){
      vec2 d = vec2(suave(vUv * 60.0 + tempo * 0.15), suave(vUv * 60.0 + 7.3 - tempo * 0.1)) - 0.5;
      vec4 uvr = vUvR; uvr.xy += d * 0.012 * uvr.w;
      vec3 refl = texture2DProj(tDiffuse, uvr).rgb * color;
      float poca = smoothstep(0.35, 0.75, suave(vUv * 6.0));
      float borda = 1.0 - smoothstep(raio * 0.55, raio, distance(vUv, vec2(0.5)));
      gl_FragColor = vec4(refl, opacidade * borda * mix(0.45, 1.0, poca));
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

function texturaRadial(paradas: [number, string][], tam = 128): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = tam;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(tam / 2, tam / 2, 0, tam / 2, tam / 2, tam / 2);
  for (const [p, cor] of paradas) gr.addColorStop(p, cor);
  g.fillStyle = gr;
  g.fillRect(0, 0, tam, tam);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Moldes {
  floresta: GLTF;
  robo: THREE.Group;
  borboleta: THREE.Object3D;
  bateAsas: THREE.AnimationClip | null;
}

let cacheMoldes: Promise<Moldes> | null = null;

function carregarMoldes(onProgress?: (pct: number) => void): Promise<Moldes> {
  if (cacheMoldes) return cacheMoldes;
  const loader = new GLTFLoader();
  const bytes: Record<"a" | "b", [number, number]> = { a: [0, 3.1e6], b: [0, 6.2e6] };
  const informar = () => {
    const pct = Math.min(95, Math.round(((bytes.a[0] + bytes.b[0]) / (bytes.a[1] + bytes.b[1])) * 95));
    onProgress?.(pct);
  };
  const carregar = (url: string, k: "a" | "b") =>
    new Promise<GLTF>((res, rej) =>
      loader.load(
        url,
        res,
        (ev) => {
          bytes[k] = [ev.loaded, ev.lengthComputable && ev.total ? ev.total : bytes[k][1]];
          informar();
        },
        rej
      )
    );
  cacheMoldes = Promise.all([carregar(URL_FLORESTA, "a"), carregar(URL_ROBO, "b")]).then(([floresta, robo]) => ({
    floresta,
    robo: montarMoldeRobo(robo.scene),
    ...montarMoldeBorboleta(floresta),
  }));
  cacheMoldes.catch(() => {
    cacheMoldes = null;
  });
  return cacheMoldes;
}

function montarMoldeBorboleta(floresta: GLTF) {
  floresta.scene.updateMatrixWorld(true);
  const original = floresta.scene.getObjectByName(NOME_BORBOLETA)!;
  const copia = clonarComEsqueleto(original);
  original.getWorldQuaternion(copia.quaternion);
  original.getWorldScale(copia.scale);
  copia.position.set(0, 0, 0);
  copia.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.frustumCulled = false;
  });
  const nomes = new Set<string>();
  copia.traverse((o) => nomes.add(o.name));
  const clip = floresta.animations[0];
  const trilhas = clip ? clip.tracks.filter((t) => nomes.has(THREE.PropertyBinding.parseTrackName(t.name).nodeName)) : [];
  return {
    borboleta: copia,
    bateAsas: trilhas.length ? new THREE.AnimationClip("bate-asas", clip!.duration, trilhas) : null,
  };
}

function montarMoldeRobo(cenaRobo: THREE.Group): THREE.Group {
  const _p = new THREE.Vector3();
  cenaRobo.updateMatrixWorld(true);

  const skinned: THREE.SkinnedMesh[] = [];
  cenaRobo.traverse((o) => {
    if ((o as THREE.SkinnedMesh).isSkinnedMesh) skinned.push(o as THREE.SkinnedMesh);
  });
  const v = new THREE.Vector3(),
    w = new THREE.Vector3(),
    n = new THREE.Vector3();
  for (const o of skinned) {
    const g = o.geometry.clone(),
      P = g.attributes.position,
      N = g.attributes.normal;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i);
      if (N) {
        n.fromBufferAttribute(N, i);
        w.copy(v).addScaledVector(n, 1e-3);
        o.applyBoneTransform(i, w);
      }
      o.applyBoneTransform(i, v);
      if (N) {
        w.sub(v).normalize();
        N.setXYZ(i, w.x, w.y, w.z);
      }
      P.setXYZ(i, v.x, v.y, v.z);
    }
    g.deleteAttribute("skinIndex");
    g.deleteAttribute("skinWeight");
    g.computeBoundingBox();
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, o.material);
    m.name = o.name;
    m.position.copy(o.position);
    m.quaternion.copy(o.quaternion);
    m.scale.copy(o.scale);
    o.parent!.add(m);
    o.parent!.remove(o);
    o.geometry.dispose();
  }

  const R = new THREE.Group();
  R.name = "robo";
  cenaRobo.updateMatrixWorld(true);
  const malhas: THREE.Mesh[] = [];
  cenaRobo.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) malhas.push(o as THREE.Mesh);
  });
  malhas.forEach((m) => {
    R.attach(m);
    (m.material as THREE.MeshStandardMaterial).envMapIntensity = 0.6;
  });
  R.updateMatrixWorld(true);

  const laranja = R.getObjectByName(PECA_BORBOLETA_LARANJA) as THREE.Mesh | undefined;
  if (laranja) {
    const pb = new THREE.Box3();
    const P = laranja.geometry.attributes.position;
    for (let i = 0; i < P.count; i += 2) {
      pb.expandByPoint(_p.fromBufferAttribute(P, i).applyMatrix4(laranja.matrixWorld));
    }
    const c = pb.getCenter(new THREE.Vector3());
    let melhor = new THREE.Vector3(),
      d2 = Infinity;
    for (const m of malhas) {
      if (m === laranja) continue;
      const Pm = m.geometry.attributes.position;
      for (let i = 0; i < Pm.count; i++) {
        _p.fromBufferAttribute(Pm, i).applyMatrix4(m.matrixWorld);
        const d = _p.distanceToSquared(c);
        if (d < d2) {
          d2 = d;
          melhor = _p.clone();
        }
      }
    }
    R.userData.pousoLocal = melhor;
    laranja.removeFromParent();
    laranja.geometry.dispose();
  } else {
    R.userData.pousoLocal = new THREE.Vector3(0.24, 0.44, 0.22);
  }

  const cabeca = new THREE.Group();
  cabeca.name = "cabeca";
  const pecas = PECAS_CABECA.map((k) => R.getObjectByName("tripo_part_" + k) as THREE.Mesh).filter(Boolean);
  if (pecas.length > 0) {
    const b = new THREE.Box3();
    pecas.forEach((o) => b.union(o.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld)));
    const cc = b.getCenter(new THREE.Vector3());
    cabeca.position.set(cc.x, b.min.y + (b.max.y - b.min.y) * 0.16, cc.z);
    R.add(cabeca);
    cabeca.updateMatrixWorld(true);
    pecas.forEach((o) => cabeca.attach(o));
  } else {
    const boxTotal = new THREE.Box3().setFromObject(R);
    const cc = boxTotal.getCenter(new THREE.Vector3());
    cabeca.position.set(cc.x, boxTotal.min.y + (boxTotal.max.y - boxTotal.min.y) * 0.85, cc.z);
    R.add(cabeca);
    cabeca.updateMatrixWorld(true);
  }

  const olho = R.getObjectByName(PECA_OLHO) as THREE.Mesh | undefined;
  if (olho) {
    const mat = olho.material as THREE.MeshStandardMaterial;
    const img = mat.map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
    const uv = olho.geometry.attributes.uv;
    const centro = new THREE.Vector3();
    let qtd = 0;
    if (img && uv) {
      const cv = document.createElement("canvas");
      cv.width = img.width;
      cv.height = img.height;
      const g = cv.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data,
        P = olho.geometry.attributes.position;
      for (let i = 0; i < uv.count; i++) {
        const x = clamp(Math.floor(uv.getX(i) * cv.width), 0, cv.width - 1);
        const y = clamp(Math.floor((mat.map!.flipY ? 1 - uv.getY(i) : uv.getY(i)) * cv.height), 0, cv.height - 1);
        const k = (y * cv.width + x) * 4;
        if (d[k + 2] > 170 && d[k + 1] > 120 && d[k] < 120 && d[k + 2] - d[k] > 90) {
          centro.add(_p.fromBufferAttribute(P, i));
          qtd++;
        }
      }
    }
    olho.userData.centroOlho = qtd ? centro.divideScalar(qtd) : olho.geometry.boundingBox!.getCenter(new THREE.Vector3());
  }
  return R;
}

const OLHO_AZUL = new THREE.Color("#00E5FF"),
  OLHO_AMARELO = new THREE.Color("#ffb52e");
const _corOlho = new THREE.Color();
const corDoOlho = (calor: number) => _corOlho.copy(OLHO_AZUL).lerp(OLHO_AMARELO, Math.min(1, Math.max(0, calor)));

function criarRobo(molde: THREE.Group) {
  const R = molde.clone(true);
  const cabeca = R.getObjectByName("cabeca") as THREE.Group;
  const pousoLocal = (molde.userData.pousoLocal as THREE.Vector3).clone();
  const descartaveis: { dispose: () => void }[] = [];

  const olho = R.getObjectByName(PECA_OLHO) as THREE.Mesh | undefined;
  let matOlho: THREE.MeshStandardMaterial | null = null,
    halo: THREE.Sprite | null = null;
  const uCalorOlho = { value: 0 };
  if (olho) {
    matOlho = (olho.material as THREE.MeshStandardMaterial).clone();
    matOlho.emissive = new THREE.Color("#00E5FF");
    matOlho.emissiveMap = matOlho.map;
    matOlho.emissiveIntensity = 1.25;
    matOlho.color = new THREE.Color("#0b2a44");
    matOlho.onBeforeCompile = (sh) => {
      sh.uniforms.uCalor = uCalorOlho;
      sh.uniforms.uAmarelo = { value: OLHO_AMARELO };
      sh.fragmentShader =
        "uniform float uCalor;\nuniform vec3 uAmarelo;\n" +
        sh.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
        {
          vec3 tx = texture2D(emissiveMap, vEmissiveMapUv).rgb;
          float ciano = smoothstep(0.12, 0.35, min(tx.g, tx.b) - tx.r);
          float lum = max(totalEmissiveRadiance.r, max(totalEmissiveRadiance.g, totalEmissiveRadiance.b));
          totalEmissiveRadiance = mix(totalEmissiveRadiance, uAmarelo * lum, ciano * uCalor);
        }`
        );
    };
    olho.material = matOlho;
    const tex = texturaRadial(
      [
        [0, "rgba(160,245,255,1)"],
        [0.25, "rgba(0,229,255,.65)"],
        [1, "rgba(0,180,255,0)"],
      ],
      64
    );
    halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.45,
        fog: false,
      })
    );
    halo.position.copy(molde.getObjectByName(PECA_OLHO)!.userData.centroOlho as THREE.Vector3);
    halo.scale.setScalar(0.075);
    olho.add(halo);
    descartaveis.push(matOlho, tex, halo.material);
  }
  const olhoNoMundo = (alvo: THREE.Vector3) => (halo ? halo.getWorldPosition(alvo) : cabeca.getWorldPosition(alvo));
  const acenderOlho = (k: number, t: number, clarao = 0, calor = 0) => {
    const c = corDoOlho(calor * (1 - clarao));
    if (matOlho) {
      matOlho.emissiveIntensity = 1.15 + k * 0.7 + clarao * 1.2 + Math.sin(t * 2) * 0.05 * k;
      uCalorOlho.value = Math.min(1, Math.max(0, calor * (1 - clarao)));
    }
    if (halo) {
      (halo.material as THREE.SpriteMaterial).color.copy(c);
      (halo.material as THREE.SpriteMaterial).opacity = Math.min(1, 0.35 + k * 0.55 + clarao * 0.4);
      halo.scale.setScalar(0.075 + k * 0.035 + clarao * clarao * 0.55);
    }
  };

  const refDir = (() => {
    R.updateMatrixWorld(true);
    const dedo = pousoLocal.clone().sub(cabeca.position);
    const pitch = 0.5 * Math.atan2(dedo.y, Math.hypot(dedo.x, dedo.z));
    if (!halo) return { yaw: Math.atan2(dedo.x, dedo.z), pitch };
    const rosto = R.worldToLocal(halo.getWorldPosition(new THREE.Vector3())).sub(cabeca.position);
    return { yaw: Math.atan2(rosto.x, rosto.z), pitch };
  })();
  const qCab = new THREE.Quaternion(),
    qAlvo = new THREE.Quaternion(),
    e = new THREE.Euler(0, 0, 0, "YXZ"),
    inv = new THREE.Quaternion();
  const _v = new THREE.Vector3(),
    _d = new THREE.Vector3();
  const olharPara = (ponto: THREE.Vector3, dt: number, rapidez = 6) => {
    cabeca.getWorldPosition(_v);
    R.getWorldQuaternion(inv).invert();
    const d = _d.copy(ponto).sub(_v).applyQuaternion(inv);
    let dy = Math.atan2(d.x, d.z) - refDir.yaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    const dp = Math.atan2(d.y, Math.hypot(d.x, d.z)) - refDir.pitch;
    e.set(-clamp(dp, -0.55, 0.6), clamp(dy, -1.05, 1.05), 0);
    qAlvo.setFromEuler(e);
    qCab.slerp(qAlvo, 1 - Math.exp(-dt * rapidez));
    cabeca.quaternion.copy(qCab);
  };

  return {
    R,
    cabeca,
    pousoLocal,
    olhoNoMundo,
    acenderOlho,
    olharPara,
    dispose: () => descartaveis.forEach((x) => x.dispose()),
  };
}

function criarBorboleta(moldes: Moldes, escala: number, cena: THREE.Object3D, reduzir: boolean) {
  const obj = clonarComEsqueleto(moldes.borboleta);
  obj.scale.copy(moldes.borboleta.scale).multiplyScalar(escala);
  cena.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  if (moldes.bateAsas && !reduzir) mixer.clipAction(moldes.bateAsas).play();
  const Q_ORIG = moldes.borboleta.quaternion.clone();
  const EIXO_CORPO = new THREE.Vector3(1, 0, 0).applyQuaternion(Q_ORIG);
  const RUMO_ORIG = (() => {
    const d = EIXO_CORPO.clone().setY(0).normalize();
    return Math.atan2(d.x, d.z);
  })();
  const EIXO_Y = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3(),
    vel = new THREE.Vector3();
  const _v = new THREE.Vector3(),
    _q = new THREE.Quaternion(),
    _q2 = new THREE.Quaternion(),
    _q3 = new THREE.Quaternion(),
    eixoInclina = new THREE.Vector3();
  let rumo = 0,
    primeira = true;

  const atualizar = (
    dt: number,
    alvo: THREE.Vector3,
    rapidez: number,
    pousando: number,
    rumoPouso: number,
    praCamera: THREE.Vector3
  ) => {
    mixer.update(dt);
    if (primeira) {
      pos.copy(alvo);
      rumo = rumoPouso;
      primeira = false;
    }
    _v.copy(alvo).sub(pos);
    const passo = 1 - Math.exp(-dt * rapidez);
    vel.copy(_v).multiplyScalar(passo / Math.max(dt, 1e-4));
    pos.addScaledVector(_v, passo);
    if (pousando > 0.95 && _v.length() < 0.05 * escala) pos.copy(alvo);
    obj.position.copy(pos);
    const hv = Math.hypot(vel.x, vel.z);
    let rumoAlvo = rumo;
    if (pousando > 0.6) rumoAlvo = rumoPouso;
    else if (hv > 1.5 * escala) rumoAlvo = Math.atan2(vel.x, vel.z);
    const dr = Math.atan2(Math.sin(rumoAlvo - rumo), Math.cos(rumoAlvo - rumo));
    const giro = dr * (1 - Math.exp(-dt * 6));
    rumo += giro;
    const inclinaCurva = clamp((-giro / Math.max(dt, 1e-3)) * 0.12, -0.5, 0.5) * (1 - pousando);
    const arfa = clamp((vel.y / escala) * 0.01, -0.35, 0.35) * (1 - pousando);
    eixoInclina.crossVectors(EIXO_Y, praCamera).normalize();
    _q.setFromAxisAngle(eixoInclina, 0.9 + arfa)
      .multiply(_q2.setFromAxisAngle(EIXO_Y, rumo - RUMO_ORIG + Math.PI))
      .multiply(_q3.setFromAxisAngle(EIXO_CORPO, inclinaCurva))
      .multiply(Q_ORIG);
    obj.quaternion.copy(_q);
  };
  return {
    objeto: obj,
    pos,
    vel,
    atualizar,
    dispose: () => {
      mixer.stopAllAction();
      obj.removeFromParent();
    },
  };
}

function criarPurpurina(cena: THREE.Object3D, escala: number, reduzir: boolean) {
  const N = 220;
  const geo = new THREE.BufferGeometry();
  const pPos = new Float32Array(N * 3),
    pCor = new Float32Array(N * 3),
    pVel = new Float32Array(N * 3);
  const pVida = new Float32Array(N),
    pVidaMax = new Float32Array(N).fill(1),
    pBase = new Float32Array(N * 3),
    pFase = new Float32Array(N);
  geo.setAttribute("position", new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("color", new THREE.BufferAttribute(pCor, 3).setUsage(THREE.DynamicDrawUsage));
  const tex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(0,229,255,.8)");
    gr.addColorStop(1, "rgba(0,229,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    g.globalCompositeOperation = "lighter";
    g.fillStyle = "rgba(255,255,255,.65)";
    g.fillRect(31, 6, 2, 52);
    g.fillRect(6, 31, 52, 2);
    return new THREE.CanvasTexture(c);
  })();
  const mat = new THREE.PointsMaterial({
    size: 0.55 * escala,
    map: tex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pontos = new THREE.Points(geo, mat);
  pontos.frustumCulled = false;
  cena.add(pontos);
  const PALETA = [
    [0, 0.9, 1],
    [0.55, 0.95, 1],
    [1, 1, 1],
    [0.2, 0.75, 1],
  ];
  let proxima = 0,
    acumula = 0;
  const atualizar = (dt: number, t: number, origem: THREE.Vector3, velB: THREE.Vector3, pousada: number) => {
    if (reduzir) return;
    const pulso = Math.max(0, Math.sin(t * 9)) ** 6;
    acumula += dt * (lerp(26, 5, pousada) + (Math.hypot(velB.x, velB.z) / escala) * 0.35 + pulso * 40);
    while (acumula >= 1) {
      acumula--;
      const i = proxima;
      proxima = (proxima + 1) % N;
      const a = Math.random() * Math.PI * 2,
        r = (0.4 + Math.random() * 1.6) * escala;
      pPos[i * 3] = origem.x + Math.cos(a) * r;
      pPos[i * 3 + 1] = origem.y + (Math.random() - 0.3) * 0.6 * escala;
      pPos[i * 3 + 2] = origem.z + Math.sin(a) * r;
      pVel[i * 3] = -velB.x * 0.12 + (Math.random() - 0.5) * 0.8 * escala;
      pVel[i * 3 + 1] = (-0.4 - Math.random() * 0.9) * escala;
      pVel[i * 3 + 2] = -velB.z * 0.12 + (Math.random() - 0.5) * 0.8 * escala;
      pVidaMax[i] = pVida[i] = 1.1 + Math.random() * 1.3;
      const c = PALETA[(Math.random() * PALETA.length) | 0];
      pBase[i * 3] = c[0];
      pBase[i * 3 + 1] = c[1];
      pBase[i * 3 + 2] = c[2];
      pFase[i] = Math.random() * 20;
    }
    for (let i = 0; i < N; i++) {
      if (pVida[i] <= 0) {
        pCor[i * 3] = pCor[i * 3 + 1] = pCor[i * 3 + 2] = 0;
        continue;
      }
      pVida[i] -= dt;
      pVel[i * 3] *= 0.985;
      pVel[i * 3 + 2] *= 0.985;
      pVel[i * 3 + 1] -= 0.25 * escala * dt;
      pPos[i * 3] += pVel[i * 3] * dt;
      pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt;
      pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      const vida = Math.max(pVida[i], 0) / pVidaMax[i];
      const k = Math.min(1, vida * 2.5) * vida ** 0.4 * (0.45 + 0.55 * Math.abs(Math.sin(t * 14 + pFase[i]))) * 0.9;
      pCor[i * 3] = pBase[i * 3] * k;
      pCor[i * 3 + 1] = pBase[i * 3 + 1] * k;
      pCor[i * 3 + 2] = pBase[i * 3 + 2] * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };
  return {
    atualizar,
    dispose: () => {
      geo.dispose();
      mat.dispose();
      tex.dispose();
      pontos.removeFromParent();
    },
  };
}

const COR_TRACO = new THREE.Color("#6ee7ff");
const ESCALA_ROBO = 1.25;
const LUGAR = new THREE.Vector3(-2, 0, 2.5);
const K = ESCALA_ROBO / 30;

function materialTraco(opacidade: number) {
  const u = { uCorte: { value: -1 }, uBrilho: { value: 1 } };
  const m = new THREE.LineBasicMaterial({
    color: COR_TRACO,
    transparent: true,
    opacity: opacidade,
    depthWrite: false,
  });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uCorte = u.uCorte;
    sh.uniforms.uBrilho = u.uBrilho;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vY;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvY = (modelMatrix * vec4(transformed, 1.0)).y;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vY;\nuniform float uCorte;\nuniform float uBrilho;")
      .replace(
        "#include <opaque_fragment>",
        `
        if (vY > uCorte) discard;
        float borda = 1.0 - smoothstep(0.0, 0.25, uCorte - vY);
        outgoingLight += vec3(0.0, 0.9, 1.0) * borda * 1.6 * uBrilho;
        #include <opaque_fragment>`
      );
  };
  return { m, u };
}

function initEscomBlueprintHero() {
  const container = document.getElementById("escom-hero-3d-stage");
  if (!container) return;

  const statusPct = document.getElementById("escom-hero-pct");
  const heroSection = container.closest(".escom-blueprint-hero") as HTMLElement | null;

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, celular ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  container.appendChild(renderer.domElement);

  const frente = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  frente.setPixelRatio(renderer.getPixelRatio());
  frente.outputColorSpace = THREE.SRGBColorSpace;
  frente.setClearColor(0x000000, 0);
  frente.autoClear = false;
  frente.domElement.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:30";
  (heroSection ?? container.parentElement ?? container).appendChild(frente.domElement);

  const CAMADA_FRENTE = 1,
    CAMADA_MASCARA = 2;
  const soProfundidade = new THREE.MeshBasicMaterial({ colorWrite: false });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#030507");
  const camera = new THREE.PerspectiveCamera(36, 1, 0.02, 200);
  const CAM = new THREE.Vector3(0.6, 1.05, -0.15);
  const ALVO = new THREE.Vector3(LUGAR.x, 0.52, LUGAR.z);
  camera.position.copy(CAM);
  camera.lookAt(ALVO);

  scene.add(new THREE.HemisphereLight("#c9d6e8", "#050608", 1.25));
  const chave = new THREE.DirectionalLight("#ffffff", 2.4);
  chave.position.set(-3, 5, 4);
  scene.add(chave);
  const contra = new THREE.DirectionalLight("#00E5FF", 3.4);
  contra.position.set(2, 3, -4);
  scene.add(contra);
  const recorte = new THREE.DirectionalLight("#9fdcff", 1.7);
  recorte.position.set(-4, 1.5, -2);
  scene.add(recorte);

  // Grade de planta técnica no piso (blueprint grid)
  const grade = new THREE.GridHelper(40, 160, 0x007799, 0x0c2430);
  (grade.material as THREE.Material).transparent = true;
  (grade.material as THREE.Material).opacity = 0.62;
  grade.position.y = 0.002;
  scene.add(grade);

  const enquadre = { dx: 0, dy: 0, dyCentro: 0 };
  function ajustar() {
    const w = container!.clientWidth || window.innerWidth,
      h = container!.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    const retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 52 : 36;
    enquadre.dx = retrato ? 0 : camera.aspect < 1.6 ? -0.2 : -0.24;
    enquadre.dy = retrato ? 0.22 : 0.03;
    enquadre.dyCentro = retrato ? 0.12 : 0.02;
    camera.setViewOffset(w, h, enquadre.dx * w, enquadre.dy * h, w, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    frente.setSize(w, h, false);
  }
  const ro = new ResizeObserver(ajustar);
  ro.observe(container);
  ajustar();

  let pM = 0,
    pG = 0;
  const informar = () => {
    const p = Math.min(99, Math.round(pM * 0.85 + pG * 0.15));
    if (statusPct) statusPct.textContent = `SYS.BLUEPRINT // ${p}%`;
  };

  const galpaoP = new Promise<THREE.Group>((res, rej) =>
    new GLTFLoader().load(
      URL_GALPAO,
      (g) => res(g.scene),
      (ev) => {
        if (ev.lengthComputable && ev.total) {
          pG = (ev.loaded / ev.total) * 100;
          informar();
        }
      },
      rej
    )
  );

  Promise.all([
    carregarMoldes((p) => {
      pM = (p / 95) * 100;
      informar();
    }),
    galpaoP,
  ])
    .then(([moldes, galpao]) => iniciar(moldes, galpao))
    .catch((err) => {
      console.error("Erro ao carregar Hero Blueprint 3D:", err);
    });

  function iniciar(moldes: Moldes, galpao: THREE.Group) {
    /* ---------- Galpão em Blueprint de Fundo ---------- */
    galpao.scale.multiplyScalar(100);
    galpao.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && (/mdl_001/.test(o.name) || /^unit/.test(o.name))) o.visible = false;
    });
    scene.add(galpao);
    galpao.updateMatrixWorld(true);
    const tracoGalpao = materialTraco(0.0);
    const solidosGalpao: THREE.Material[] = [];
    galpao.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.visible) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mt) => {
        mt.transparent = true;
        mt.opacity = 0;
        mt.depthWrite = false;
        solidosGalpao.push(mt);
      });
      const linhas = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 28), tracoGalpao.m);
      m.add(linhas);
    });

    /* ---------- Robô Agachado (Tripo) ---------- */
    const robo = criarRobo(moldes.robo);
    const R = robo.R;
    R.scale.setScalar(ESCALA_ROBO);
    R.position.copy(LUGAR);
    R.rotation.y = Math.atan2(CAM.x - LUGAR.x, CAM.z - LUGAR.z) - 0.6;
    scene.add(R);
    R.updateMatrixWorld(true);
    {
      const b = new THREE.Box3().setFromObject(R);
      R.position.y -= b.min.y + 0.004;
      R.updateMatrixWorld(true);
    }
    const tracoRobo = materialTraco(0.9);
    const solidosRobo: THREE.Material[] = [];
    const malhasRobo: THREE.Mesh[] = [];
    R.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) malhasRobo.push(o as THREE.Mesh);
    });
    for (const m of malhasRobo) {
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mt) => {
        mt.transparent = true;
        mt.opacity = 0;
        solidosRobo.push(mt);
      });
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 32), tracoRobo.m));
    }
    const caixa = new THREE.Box3().setFromObject(R);
    R.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !(o as THREE.Sprite).isSprite) o.layers.enable(CAMADA_MASCARA);
    });

    /* ---------- Borboleta Azul + Purpurina ---------- */
    const antes = new Set(scene.children);
    const borboleta = criarBorboleta(moldes, K, scene, reduzir);
    const purpurina = criarPurpurina(scene, K, reduzir);
    scene.children
      .filter((o) => !antes.has(o))
      .forEach((o) => o.traverse((x) => x.layers.set(CAMADA_FRENTE)));

    const dedo = new THREE.Vector3();
    const pontoDoDedo = (t: number) => {
      dedo.copy(robo.pousoLocal).applyMatrix4(R.matrixWorld);
      dedo.y += (0.35 + (reduzir ? 0 : Math.sin(t * 1.3) * 0.06)) * K;
      return dedo;
    };
    pontoDoDedo(0);
    const RUMO_DEDO = (() => {
      const d = robo.cabeca.getWorldPosition(new THREE.Vector3()).sub(dedo).setY(0);
      return Math.atan2(d.x, d.z);
    })();
    const centroRobo = caixa.getCenter(new THREE.Vector3());
    const DIST = CAM.distanceTo(centroRobo);
    const topoRobo = caixa.max.y,
      topoGalpao = 9;

    /* ---------- Chão Molhado com Reflexo ---------- */
    const espelho = new Reflector(new THREE.PlaneGeometry(10, 10), {
      textureWidth: celular ? 512 : 1024,
      textureHeight: celular ? 512 : 1024,
      color: 0xb8c8d8,
      clipBias: 0.003,
      shader: SHADER_CHAO_MOLHADO,
    });
    const matEspelho = espelho.material as THREE.ShaderMaterial;
    matEspelho.transparent = true;
    matEspelho.depthWrite = false;
    matEspelho.uniforms.opacidade.value = 0;
    espelho.rotation.x = -Math.PI / 2;
    espelho.position.set(LUGAR.x, 0.006, LUGAR.z);
    scene.add(espelho);

    /* ---------- Interação Mouse & Scroll ---------- */
    const ponteiro = { x: 0, y: 0, cx: 0, cy: 0, ultimo: -99 };
    const aoMover = (e: PointerEvent) => {
      ponteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
      ponteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
      ponteiro.cx = e.clientX;
      ponteiro.cy = e.clientY;
      ponteiro.ultimo = performance.now() / 1000;
    };
    window.addEventListener("pointermove", aoMover, { passive: true });

    const _ndc = new THREE.Vector2(),
      _ray = new THREE.Raycaster(),
      mundoMouse = new THREE.Vector3(),
      alvoB = new THREE.Vector3(),
      praCam = new THREE.Vector3();
    const ponteiroNoMundo = () => {
      const r = container!.getBoundingClientRect();
      _ndc.set(((ponteiro.cx - r.left) / r.width) * 2 - 1, -((ponteiro.cy - r.top) / r.height) * 2 + 1);
      _ray.setFromCamera(_ndc, camera);
      mundoMouse.copy(_ray.ray.origin).addScaledVector(_ray.ray.direction, DIST * 0.92);
      mundoMouse.y = clamp(mundoMouse.y, centroRobo.y - 4 * K, centroRobo.y + 3);
      return mundoMouse;
    };

    const timer = new THREE.Timer();
    timer.connect(document);
    const camAlvo = new THREE.Vector3(),
      mira = new THREE.Vector3(),
      olho = new THREE.Vector3(),
      olhar = new THREE.Vector3();
    let calorOlho = 0;
    let t0 = -1;

    const quadro = () => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05),
        t = timer.getElapsed();
      const agora = performance.now() / 1000;
      if (t0 < 0) t0 = agora;
      // Velocidade de abertura: varredura blueprint em 0..2.8s e solidificação imediata
      const s = reduzir ? 99 : (agora - t0) * 1.45;

      // 1) Varredura desenhando o traço do robô e do galpão em blueprint
      tracoRobo.u.uCorte.value = lerp(-0.05, topoRobo + 0.05, suave(0, 2.2, s));
      tracoGalpao.u.uCorte.value = lerp(-0.05, topoGalpao, suave(0.2, 3.0, s));
      // Mantém o galpão em blueprint bem visível (0.44 de opacidade final em azul ciano)
      tracoGalpao.m.opacity = lerp(0, 0.62, suave(0, 0.6, s)) - lerp(0, 0.18, suave(4.0, 5.8, s));
      tracoRobo.u.uBrilho.value = 1 - suave(2.0, 2.8, s);
      tracoGalpao.u.uBrilho.value = 1 - suave(2.8, 3.6, s);

      // 2) O robô ganha forma sólida; o traço dele some gradualmente mantendo leve contorno técnico
      const kRobo = suave(1.8, 3.2, s);
      solidosRobo.forEach((mt) => {
        mt.opacity = kRobo;
        mt.transparent = kRobo < 0.999;
        mt.depthWrite = kRobo > 0.5;
      });
      tracoRobo.m.opacity = 0.9 * (1 - suave(2.8, 4.0, s));

      // 3) O galpão pulsa sutilmente e permanece como planta técnica (blueprint) no fundo
      const kGalpao = suave(2.2, 3.2, s) * (1 - suave(3.6, 5.0, s));
      solidosGalpao.forEach((mt) => {
        mt.opacity = kGalpao * 0.45;
      });
      matEspelho.uniforms.opacidade.value = 0.65 * suave(2.4, 3.8, s);
      if (!reduzir) matEspelho.uniforms.tempo.value = t;

      // Enquadramento: robô à direita no desktop, texto à esquerda
      const kLado = reduzir ? 1 : suave(1.6, 3.4, s);
      {
        const w = container!.clientWidth || window.innerWidth,
          h = container!.clientHeight || window.innerHeight;
        camera.setViewOffset(w, h, enquadre.dx * kLado * w, lerp(enquadre.dyCentro, enquadre.dy, kLado) * h, w, h);
        camera.updateProjectionMatrix();
      }

      if (statusPct) {
        const pctTotal = Math.min(100, Math.round(suave(0, 3.2, s) * 100));
        statusPct.textContent = pctTotal < 100 ? `BLUEPRINT SCAN // ${pctTotal}%` : `BLUEPRINT // ONLINE`;
      }

      // Câmera: rolagem aproxima e sobe um pouco; mouse dá paralaxe suave
      const rol = clamp(window.scrollY / Math.max(1, window.innerHeight), 0, 1);
      camAlvo.copy(CAM).lerp(ALVO, 0.35 * rol);
      camAlvo.y += 0.12 * rol;
      camAlvo.x += ponteiro.x * 0.12;
      camAlvo.y -= ponteiro.y * 0.06;
      camera.position.lerp(camAlvo, 1 - Math.exp(-dt * 3));
      mira.copy(ALVO);
      camera.lookAt(mira);

      // Borboleta: pousada no dedo ou seguindo o mouse com purpurina
      pontoDoDedo(t);
      const mexeu = agora - ponteiro.ultimo < 4;
      const segue = mexeu && !reduzir && kRobo > 0.85 && rol < 0.15;
      if (segue) {
        alvoB.copy(ponteiroNoMundo());
        alvoB.x += Math.sin(t * 2.1) * 2.2 * K;
        alvoB.y += Math.sin(t * 3.3) * 1.6 * K;
        alvoB.z += Math.cos(t * 1.7) * 1.8 * K;
      } else {
        alvoB.copy(dedo);
      }
      const pousando = segue ? 0 : clamp(1 - borboleta.pos.distanceTo(dedo) / (12 * K), 0, 1);
      praCam.copy(camera.position).sub(borboleta.pos).setY(0).normalize();
      borboleta.atualizar(dt, alvoB, segue ? 3.2 : 4.2, pousando, RUMO_DEDO, praCam);
      purpurina.atualizar(dt, t, borboleta.pos, borboleta.vel, pousando);
      borboleta.objeto.visible = kRobo > 0.4;

      // Cabeça do robô acompanha a borboleta e olho ciano/âmbar reage à distância
      robo.olhoNoMundo(olho);
      olhar.copy(kRobo > 0.4 ? borboleta.pos : camera.position);
      robo.olharPara(olhar, dt, 5);
      calorOlho = lerp(calorOlho, suave(3 * K, 26 * K, borboleta.pos.distanceTo(dedo)), 1 - Math.exp(-dt * 3));
      robo.acenderOlho(0.65 + 0.4 * kRobo + (pousando > 0.85 ? 0.35 : 0), t, 0, calorOlho);

      renderer.render(scene, camera);
      const fundo = scene.background;
      scene.background = null;
      frente.clear();
      camera.layers.set(CAMADA_MASCARA);
      scene.overrideMaterial = soProfundidade;
      frente.render(scene, camera);
      camera.layers.set(CAMADA_FRENTE);
      scene.overrideMaterial = null;
      frente.render(scene, camera);
      camera.layers.set(0);
      scene.background = fundo;
    };

    const comecar = () => {
      quadro();
      renderer.setAnimationLoop(quadro);
      const io = new IntersectionObserver(
        ([entry]) => {
          renderer.setAnimationLoop(entry.isIntersecting ? quadro : null);
        },
        { threshold: 0.01 }
      );
      io.observe(heroSection ?? container!);
    };
    renderer.compileAsync(scene, camera).then(comecar, comecar);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEscomBlueprintHero);
} else {
  initEscomBlueprintHero();
}
