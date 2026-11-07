import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";
import "./VisibilitySection.css";

type Pt = [number, number, number];
type Faces = { r: Pt[]; l: Pt[]; t: Pt[] };
type FacePolys = { r: SVGPolygonElement; l: SVGPolygonElement; t: SVGPolygonElement };

interface Lot {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  park: boolean;
  name: string;
  site: boolean;
  bad: boolean;
  g?: SVGGElement;
  pool?: SVGEllipseElement;
  tag?: SVGGElement;
}

interface Lane { axis: "x" | "y"; c: number; dir: 1 | -1 }
interface Car { lane: Lane; body: FacePolys; cab: FacePolys; lamp: SVGCircleElement; s: number; v: number }
interface Person { sx: number; sy: number; tx: number; ty: number; t: number; v: number; dot: SVGCircleElement; halo: SVGCircleElement }

const NS = "http://www.w3.org/2000/svg";
const U = 40;
const C = U * Math.cos(Math.PI / 6);
const S = U * 0.5;
const H = U * 0.92;
const MIN = -0.8;
const MAX = 11.8;
const ROADS = [3, 7];
const BLOCKS = [0, 4, 8];

const NAMES = [
  "Padaria", "Barbearia", "Farmácia", "Oficina", "Pizzaria", "Salão", "Mercado", "Lanchonete", "Floricultura", "Papelaria",
  "Advocacia", "Sorveteria", "Lavanderia", "Açougue", "Hamburgueria", "Estética", "Fisioterapia", "Idiomas", "Cafeteria", "Moda",
  "Autopeças", "Chaveiro", "Imobiliária", "Contabilidade", "Doceria", "Vidraçaria", "Clínica vet.",
];
// Lotes: "quarteirão x, quarteirão y, lote x, lote y"
const SPECIAL: Record<string, { name?: string; site?: boolean; bad?: boolean }> = {
  "1,1,1,1": { name: "Dentista", site: true },
  "0,0,1,1": { name: "Restaurante", site: true },
  "1,2,1,1": { name: "Academia", site: true },
  "0,2,1,0": { name: "Pet shop", site: true },
  "2,0,0,1": { name: "Ótica", site: true },
  "0,1,1,0": { name: "Dentista", bad: true },
  "2,1,0,1": { name: "Dentista", bad: true },
  "1,0,0,0": { bad: true },
  "0,2,0,1": { bad: true },
  "2,0,1,0": { bad: true },
  "2,1,0,0": { bad: true },
  "0,1,0,0": { bad: true },
};
const PARKS = new Set(["1,0,1,1", "0,2,1,1", "2,2,1,1", "2,1,1,0"]);
const CAR_COLORS: [string, string, string][] = [
  ["#3a3a3a", "#262626", "#303030"],
  ["#d9d9d0", "#9a9a92", "#bdbdb4"],
  ["#2f3b44", "#1d262c", "#27323a"],
  ["#4a2c2c", "#2e1b1b", "#3c2424"],
];

const P = (x: number, y: number, z = 0): [number, number] => [(x - y) * C, (x + y) * S - z * H];
const pts = (arr: Pt[]) => arr.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e;
}

const boxFaces = (x: number, y: number, z0: number, w: number, d: number, h: number): Faces => {
  const z1 = z0 + h;
  return {
    r: [[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x + w, y, z1]],
    l: [[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x, y + d, z1]],
    t: [[x, y, z1], [x + w, y, z1], [x + w, y + d, z1], [x, y + d, z1]],
  };
};

function buildScene(
  svg: SVGSVGElement,
  labels: { on: string; off: string },
  small: boolean,
  reduceMotion: boolean,
  onPick: (b: Lot | null, how: "hover" | "tap") => void,
) {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const layer = (id: string) => svg.querySelector<SVGGElement>(`[data-layer="${id}"]`)!;
  const $ground = layer("ground"), $pools = layer("pools"), $cars = layer("cars"), $buildings = layer("buildings"), $people = layer("people"), $tags = layer("tags");
  [$ground, $pools, $cars, $buildings, $people, $tags].forEach((g) => g.replaceChildren());

  const drawBox = (g: Element, x: number, y: number, z0: number, w: number, d: number, h: number) => {
    const f = boxFaces(x, y, z0, w, d, h);
    el("polygon", { class: "vz-r", points: pts(f.r) }, g);
    el("polygon", { class: "vz-l", points: pts(f.l) }, g);
    el("polygon", { class: "vz-t", points: pts(f.t) }, g);
  };

  // Chão, ruas e quarteirões
  el("polygon", { points: pts([[MIN, MIN, 0], [MAX, MIN, 0], [MAX, MAX, 0], [MIN, MAX, 0]]), fill: "#070707", stroke: "rgba(255,255,255,.08)" }, $ground);
  for (const r of ROADS) {
    el("polygon", { points: pts([[MIN, r, 0], [MAX, r, 0], [MAX, r + 1, 0], [MIN, r + 1, 0]]), fill: "#111" }, $ground);
    el("polygon", { points: pts([[r, MIN, 0], [r + 1, MIN, 0], [r + 1, MAX, 0], [r, MAX, 0]]), fill: "#111" }, $ground);
  }
  for (const r of ROADS) {
    const [ax, ay] = P(MIN, r + 0.5), [bx, by] = P(MAX, r + 0.5), [cx, cy] = P(r + 0.5, MIN), [dx, dy] = P(r + 0.5, MAX);
    el("line", { x1: ax, y1: ay, x2: bx, y2: by, stroke: "rgba(255,255,255,.14)", "stroke-dasharray": "6 9" }, $ground);
    el("line", { x1: cx, y1: cy, x2: dx, y2: dy, stroke: "rgba(255,255,255,.14)", "stroke-dasharray": "6 9" }, $ground);
  }
  for (const bx of BLOCKS) for (const by of BLOCKS) {
    el("polygon", { points: pts([[bx - 0.05, by - 0.05, 0], [bx + 3.05, by - 0.05, 0], [bx + 3.05, by + 3.05, 0], [bx - 0.05, by + 3.05, 0]]), fill: "#0d0d0d", stroke: "rgba(255,255,255,.06)" }, $ground);
  }

  // Lotes
  const used = new Set(Object.values(SPECIAL).map((s) => s.name).filter(Boolean));
  const pool = NAMES.filter((n) => !used.has(n));
  const OFF = [0.12, 1.62], SIZE = 1.26;
  const lots: Lot[] = [];
  let ni = 0;
  for (const bx of [0, 1, 2]) for (const by of [0, 1, 2]) for (const lx of [0, 1]) for (const ly of [0, 1]) {
    const key = `${bx},${by},${lx},${ly}`;
    const x = BLOCKS[bx] + OFF[lx], y = BLOCKS[by] + OFF[ly];
    if (PARKS.has(key)) {
      lots.push({ x, y, w: SIZE, d: SIZE, h: 0, park: true, name: "", site: false, bad: false });
      continue;
    }
    const sp = SPECIAL[key] ?? {};
    lots.push({ x, y, w: SIZE, d: SIZE, h: 1.45 + Math.floor(rnd() * 4) * 0.42, park: false, name: sp.name ?? pool[ni++ % pool.length], site: !!sp.site, bad: !!sp.bad });
  }
  lots.sort((a, b) => a.x + a.y - (b.x + b.y));

  const tree = (g: Element, x: number, y: number) => {
    const [tx, ty] = P(x, y, 0);
    el("ellipse", { cx: tx, cy: ty + 2, rx: 9, ry: 4.5, fill: "rgba(0,0,0,.55)" }, g);
    el("rect", { x: tx - 1.2, y: ty - 12, width: 2.4, height: 12, fill: "#2a1f17" }, g);
    el("circle", { cx: tx, cy: ty - 17, r: 9, fill: "#13261b" }, g);
    el("circle", { cx: tx - 3, cy: ty - 20, r: 5, fill: "#1a3324" }, g);
  };

  const k = small ? 1.35 : 1;
  const makeTag = (b: Lot, label: string, kind: "good" | "bad") => {
    const [ax, ay] = P(b.x + b.w / 2, b.y + b.d / 2, b.h);
    const fsz = 11 * k, rh = 24 * k, lift = 16 * k;
    const tg = el("g", { class: `vz-tag vz-${kind}` }, $tags);
    const inner = el("g", { transform: `translate(${ax.toFixed(1)},${ay.toFixed(1)})` }, tg);
    el("line", { x1: 0, y1: 0, x2: 0, y2: -lift, "stroke-width": 1 }, inner);
    el("circle", { cx: 0, cy: 0, r: 2.4, fill: kind === "good" ? "#00d1ff" : "rgba(255,255,255,.35)" }, inner);
    const tw = label.length * fsz * 0.68 + 22 * k;
    el("rect", { x: -tw / 2, y: -lift - rh, width: tw, height: rh, rx: rh / 2 }, inner);
    el("text", { x: 0, y: -lift - rh / 2 + fsz * 0.36, "text-anchor": "middle", "font-size": fsz.toFixed(1) }, inner).textContent = label;
    return tg;
  };

  const shops: Lot[] = [];
  for (const b of lots) {
    const g = el("g", { class: "vz-b" }, $buildings);
    b.g = g;
    if (b.park) {
      el("polygon", { points: pts([[b.x, b.y, 0], [b.x + b.w, b.y, 0], [b.x + b.w, b.y + b.d, 0], [b.x, b.y + b.d, 0]]), fill: "#0c1510" }, g);
      tree(g, b.x + 0.35, b.y + 0.4);
      tree(g, b.x + 0.95, b.y + 0.55);
      tree(g, b.x + 0.5, b.y + 0.98);
      continue;
    }
    const { x, y, w, d, h } = b, yf = y + d + 0.004;
    drawBox(g, x, y, 0, w, d, h);
    el("polygon", { class: "vz-glass", points: pts([[x + 0.1, yf, 0.06], [x + w - 0.42, yf, 0.06], [x + w - 0.42, yf, 0.8], [x + 0.1, yf, 0.8]]) }, g);
    el("polygon", { class: "vz-door", points: pts([[x + w - 0.36, yf, 0], [x + w - 0.12, yf, 0], [x + w - 0.12, yf, 0.72], [x + w - 0.36, yf, 0.72]]) }, g);
    el("polygon", { class: "vz-sign", points: pts([[x + 0.06, yf + 0.01, 0.9], [x + w - 0.06, yf + 0.01, 0.9], [x + w - 0.06, yf + 0.01, 1.16], [x + 0.06, yf + 0.01, 1.16]]) }, g);
    const [ex, ey] = P(x, yf + 0.01, 1.16);
    const fs = Math.min(0.15, 1 / (b.name.length * 0.62));
    el("text", {
      class: "vz-signtxt",
      transform: `matrix(${C.toFixed(3)},${S.toFixed(3)},0,${H.toFixed(3)},${ex.toFixed(1)},${ey.toFixed(1)})`,
      x: (w / 2).toFixed(3), y: (0.13 + fs * 0.36).toFixed(3), "text-anchor": "middle", "font-size": fs.toFixed(3),
    }, g).textContent = b.name.toUpperCase();
    for (let z = 1.42; z + 0.3 < h - 0.12; z += 0.5) {
      for (let i = 0; i < 3; i++) {
        const a0 = 0.16 + i * 0.36, a1 = a0 + 0.2;
        el("polygon", { class: "vz-win", points: pts([[x + a0, yf, z], [x + a1, yf, z], [x + a1, yf, z + 0.28], [x + a0, yf, z + 0.28]]) }, g);
        el("polygon", { class: "vz-win", points: pts([[x + w + 0.004, y + a0, z], [x + w + 0.004, y + a1, z], [x + w + 0.004, y + a1, z + 0.28], [x + w + 0.004, y + a0, z + 0.28]]) }, g);
      }
    }
    if (rnd() < 0.6) {
      const ug = el("g", { class: "vz-unit" }, g);
      drawBox(ug, x + 0.25 + rnd() * 0.4, y + 0.25 + rnd() * 0.4, h, 0.3, 0.26, 0.16);
    }
    const [px, py] = P(x + w / 2, y + d / 2, 0);
    b.pool = el("ellipse", { class: "vz-pool", cx: px, cy: py + 6, rx: C * 2.2, ry: S * 2.2, fill: "url(#vz-pool-grad)" }, $pools);
    if (b.site) b.tag = makeTag(b, labels.on, "good");
    if (b.bad) b.tag = makeTag(b, labels.off, "bad");
    g.classList.add("vz-pick");
    g.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") onPick(b, "hover"); });
    g.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") onPick(null, "hover"); });
    g.addEventListener("click", (e) => { e.stopPropagation(); onPick(b, "tap"); });
    shops.push(b);
  }
  const lit = shops.filter((b) => b.site);

  // Carros
  const lanes: Lane[] = [];
  for (const r of ROADS) lanes.push({ axis: "x", c: r + 0.3, dir: 1 }, { axis: "x", c: r + 0.7, dir: -1 }, { axis: "y", c: r + 0.3, dir: -1 }, { axis: "y", c: r + 0.7, dir: 1 });
  const cars: Car[] = [];
  lanes.forEach((lane, i) => {
    for (let n = 0; n < (i % 3 === 0 ? 2 : 1); n++) {
      const g = el("g", { class: "vz-car" }, $cars);
      const col = CAR_COLORS[Math.floor(rnd() * CAR_COLORS.length)];
      const body = { r: el("polygon", { class: "vz-r", fill: col[2] }, g), l: el("polygon", { class: "vz-l", fill: col[1] }, g), t: el("polygon", { class: "vz-t", fill: col[0] }, g) };
      const cab = { r: el("polygon", { class: "vz-r", fill: "#121212" }, g), l: el("polygon", { class: "vz-l", fill: "#0a0a0a" }, g), t: el("polygon", { class: "vz-t", fill: col[0] }, g) };
      cars.push({ lane, body, cab, lamp: el("circle", { class: "vz-lamp", r: 1.6 }, g), s: MIN + rnd() * (MAX - MIN), v: 0.55 + rnd() * 0.6 });
    }
  });
  const setBox = (p: FacePolys, x: number, y: number, z0: number, w: number, d: number, h: number) => {
    const f = boxFaces(x, y, z0, w, d, h);
    p.r.setAttribute("points", pts(f.r));
    p.l.setAttribute("points", pts(f.l));
    p.t.setAttribute("points", pts(f.t));
  };
  const placeCar = (c: Car) => {
    const { lane, s } = c, L = 0.56, W = 0.26;
    let lamp: [number, number];
    if (lane.axis === "x") {
      setBox(c.body, s, lane.c - W / 2, 0.02, L, W, 0.16);
      setBox(c.cab, s + (lane.dir > 0 ? 0.12 : 0.16), lane.c - W / 2 + 0.03, 0.18, 0.28, W - 0.06, 0.12);
      lamp = P(lane.dir > 0 ? s + L : s, lane.c, 0.1);
    } else {
      setBox(c.body, lane.c - W / 2, s, 0.02, W, L, 0.16);
      setBox(c.cab, lane.c - W / 2 + 0.03, s + (lane.dir > 0 ? 0.12 : 0.16), 0.18, W - 0.06, 0.28, 0.12);
      lamp = P(lane.c, lane.dir > 0 ? s + L : s, 0.1);
    }
    c.lamp.setAttribute("cx", String(lamp[0]));
    c.lamp.setAttribute("cy", String(lamp[1]));
    c.lamp.style.opacity = lane.dir > 0 ? "1" : "0.25";
  };
  cars.forEach(placeCar);

  // Clientes indo até os comércios com site
  const people: Person[] = [];
  const spawn = () => {
    const on = lit.filter((b) => b.g?.classList.contains("vz-lit"));
    if (!on.length) return;
    const b = on[Math.floor(rnd() * on.length)];
    const tx = b.x + b.w - 0.24, ty = b.y + b.d + 0.05;
    const road = ROADS.reduce((best, r) => (Math.abs(r + 0.5 - ty) < Math.abs(best + 0.5 - ty) ? r : best), ROADS[0]);
    people.push({
      sx: tx + (rnd() - 0.5) * 3.2, sy: road + 0.5 + (rnd() - 0.5) * 0.6, tx, ty, t: 0, v: 0.18 + rnd() * 0.14,
      dot: el("circle", { r: 2.6, fill: "#00d1ff" }, $people),
      halo: el("circle", { r: 6, fill: "rgba(0,209,255,.18)" }, $people),
    });
  };

  // Revelação: o resto apaga e os comércios com site acendem um a um.
  // O escalonamento é feito com transition-delay (variável --vz-d), sem setTimeout: celulares atrasam timers em segundo plano.
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    const delay = (ms: number) => `${reduceMotion ? 0 : ms}ms`;
    shops.forEach((b) => { if (!b.site) b.g?.setAttribute("class", "vz-b vz-pick vz-off"); });
    lit.forEach((b, i) => {
      const d = delay(500 + i * 380);
      for (const node of [b.g, b.pool, b.tag]) node?.style.setProperty("--vz-d", d);
      b.g?.setAttribute("class", "vz-b vz-pick vz-lit");
      b.pool?.classList.add("vz-on");
      b.tag?.classList.add("vz-on");
    });
    shops.forEach((b) => {
      if (!b.bad) return;
      b.tag?.style.setProperty("--vz-d", delay(500 + lit.length * 380));
      b.tag?.classList.add("vz-on");
    });
  };

  let visible = false, acc = 0;
  const tick = (dt: number) => {
    if (!visible || reduceMotion) return;
    for (const c of cars) {
      c.s += c.lane.dir * c.v * dt;
      if (c.s > MAX) c.s = MIN - 0.6;
      if (c.s < MIN - 0.6) c.s = MAX;
      placeCar(c);
    }
    if (revealed) {
      acc += dt * 6;
      while (acc > 1) { spawn(); acc -= 1; }
    }
    for (let i = people.length - 1; i >= 0; i--) {
      const p = people[i];
      p.t += p.v * dt * 1.6;
      const e = 1 - Math.pow(1 - Math.min(1, p.t), 2);
      const [x, y] = P(p.sx + (p.tx - p.sx) * e, p.sy + (p.ty - p.sy) * e, 0.05);
      const op = p.t < 0.15 ? p.t / 0.15 : p.t > 0.85 ? Math.max(0, (1 - p.t) / 0.15) : 1;
      for (const n of [p.dot, p.halo]) {
        n.setAttribute("cx", String(x));
        n.setAttribute("cy", String(y));
        n.setAttribute("opacity", String(op));
      }
      if (p.t >= 1) { p.dot.remove(); p.halo.remove(); people.splice(i, 1); }
    }
  };

  return {
    reveal,
    setVisible: (v: boolean) => { visible = v; },
    tick,
  };
}

// Sites fictícios mostrados no popup dos comércios que têm site
const SITES: Record<string, { brand: string; url: string; tagline: string; cta: string; accent: string; items: [string, string, string] }> = {
  Dentista: { brand: "Clínica Sorriso", url: "clinicasorriso.com.br", tagline: "Seu sorriso em boas mãos.", cta: "Agendar avaliação", accent: "#2aa891", items: ["Clareamento", "Implantes", "Ortodontia"] },
  Restaurante: { brand: "Cantina do Bairro", url: "cantinadobairro.com.br", tagline: "Comida caseira todo dia.", cta: "Ver cardápio", accent: "#d0502f", items: ["Almoço", "Delivery", "Reservas"] },
  Academia: { brand: "Forma Academia", url: "formaacademia.com.br", tagline: "Treine perto de casa.", cta: "Agendar aula", accent: "#7b4fd0", items: ["Musculação", "Funcional", "Pilates"] },
  "Pet shop": { brand: "Pet Amigo", url: "petamigo.com.br", tagline: "Banho e tosa com carinho.", cta: "Agendar banho", accent: "#d39a12", items: ["Banho", "Tosa", "Rações"] },
  "Ótica": { brand: "Ótica Visão", url: "oticavisao.com.br", tagline: "Enxergue melhor hoje.", cta: "Ver armações", accent: "#2f7fd6", items: ["Exame", "Óculos", "Lentes"] },
};
const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

interface PopupState { lot: Lot; left: number; top: number; pinned: boolean }

function SiteMock({ lot, v }: { lot: Lot; v: { popupGoogle: string; noSiteTitle: string; noSiteDesc: string } }) {
  const s = SITES[lot.name];
  const bar = (url: string, dark: boolean) => (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 ${dark ? "bg-[#202020]" : "bg-[#e6e4dc]"}`}>
      <span className="size-1.5 rounded-full bg-[#ff5f57]" />
      <span className="size-1.5 rounded-full bg-[#febc2e]" />
      <span className="size-1.5 rounded-full bg-[#28c840]" />
      <span className={`ml-1.5 flex-1 truncate rounded px-2 py-0.5 font-mono text-[9px] ${dark ? "bg-black/60 text-white/45" : "bg-white text-black/55"}`}>{url}</span>
    </div>
  );
  if (lot.site && s) {
    return (
      <div className="w-[250px] overflow-hidden rounded-lg bg-[#f7f6f1] text-[#111] shadow-[0_24px_60px_rgba(0,0,0,.65),0_0_0_1px_rgba(0,209,255,.55),0_0_30px_rgba(0,209,255,.25)]">
        {bar(s.url, false)}
        <div className="flex items-center justify-between px-3 pt-2.5">
          <span className="font-serif text-[14px] font-semibold" style={{ color: s.accent }}>{s.brand}</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-black/45">Menu ☰</span>
        </div>
        <div className="mx-3 mt-2 rounded-md px-3 py-3" style={{ background: `linear-gradient(135deg, ${s.accent}2e, ${s.accent}08)` }}>
          <p className="font-serif text-[19px] leading-[1.1]">{s.tagline}</p>
          <span className="mt-2.5 inline-block rounded px-2.5 py-1 text-[9px] font-bold text-white" style={{ background: s.accent }}>{s.cta}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 px-3 py-2.5">
          {s.items.map((it) => (
            <div key={it} className="rounded border border-black/10 bg-white px-1 py-2 text-center text-[8.5px] font-semibold">{it}</div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-black/10 px-3 py-1.5 text-[8.5px] text-black/55">
          <span className="text-[#f2a51a]">★★★★★</span>
          <span className="font-semibold text-[#0a8fb0]">{v.popupGoogle}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-[250px] overflow-hidden rounded-lg border border-white/15 bg-[#131313] text-white shadow-[0_24px_60px_rgba(0,0,0,.7)]">
      {bar(`www.${slug(lot.name)}.com.br`, true)}
      <div className="px-4 py-5 text-center">
        <p className="font-mono text-[34px] leading-none text-white/15">404</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80">{v.noSiteTitle}</p>
        <p className="mt-1.5 text-[11px] leading-snug text-white/45">{v.noSiteDesc.replace("{nome}", lot.name.toLowerCase())}</p>
      </div>
    </div>
  );
}

export function VisibilitySection({
  Eyebrow,
}: {
  Eyebrow: React.ComponentType<{ children: React.ReactNode; light?: boolean; cyan?: boolean }>;
}) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cityRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const v = t.visibility;

  useEffect(() => {
    const section = sectionRef.current, svg = svgRef.current, city = cityRef.current;
    if (!section || !svg || !city) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 1023px)").matches;

    const POP_W = 250, POP_H = 235, GAP = 18;
    const onPick = (b: Lot | null, how: "hover" | "tap") => {
      if (!b) { setPopup((p) => (p && !p.pinned ? null : p)); return; }
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const [ax, ay] = P(b.x + b.w / 2, b.y + b.d / 2, b.h);
      const rect = city.getBoundingClientRect();
      const px = ctm.a * ax + ctm.c * ay + ctm.e - rect.left;
      const py = ctm.b * ax + ctm.d * ay + ctm.f - rect.top;
      const left = Math.min(Math.max(px, POP_W / 2 + 8), rect.width - POP_W / 2 - 8);
      // Acima do prédio quando cabe; senão abaixo. Sempre dentro da área da cidade (no celular ela corta o que passa da borda).
      let top = py - GAP - POP_H;
      if (top < 4) top = py + 24;
      top = Math.max(4, Math.min(top, rect.height - POP_H - 4));
      setPopup((p) => {
        if (how === "tap" && p?.pinned && p.lot === b) return null;
        return { lot: b, left, top, pinned: how === "tap" };
      });
    };
    const closePinned = () => setPopup((p) => (p?.pinned ? null : p));
    document.addEventListener("click", closePinned);

    const scene = buildScene(svg, { on: v.tagOn, off: v.tagOff }, small, reduceMotion, onPick);

    // Gatilho pela posição na rolagem (mais confiável que IntersectionObserver em alguns navegadores embutidos)
    const check = () => {
      const r = section.getBoundingClientRect(), vh = window.innerHeight;
      scene.setVisible(r.bottom > 0 && r.top < vh);
      if (r.top < vh * 0.55 && r.bottom > vh * 0.45) scene.reveal();
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();

    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      scene.tick(Math.min(0.05, (now - last) / 1000));
      last = now;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      document.removeEventListener("click", closePinned);
      setPopup(null);
    };
  }, [v.tagOn, v.tagOff]);

  return (
    <section
      id="visibilidade"
      ref={sectionRef}
      aria-labelledby="vz-title"
      className="vz-section relative overflow-hidden border-t border-white/15 bg-[#000000] text-white grid grid-cols-1 lg:grid-cols-12 items-center gap-2 lg:gap-8 px-5 pt-16 pb-10 md:px-12 md:py-28 xl:pl-[14vw] xl:pr-12 lg:min-h-[100svh]"
    >
      <div className="relative z-10 lg:col-span-4">
        <Eyebrow cyan>{v.eyebrow}</Eyebrow>
        <h2 id="vz-title" className="mt-8 md:mt-12 font-serif text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-6xl leading-[1.05] font-light text-white">
          {v.titleA} <em className="italic text-cyan">{v.titleEm}</em> {v.titleB}
        </h2>
        <a
          href="#diagnostico"
          className="mt-8 md:mt-10 inline-flex items-center gap-3 max-md:w-full max-md:justify-center bg-cyan px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-black transition-all hover:translate-x-1 hover:bg-[#ecece3]"
        >
          {v.cta}
          <ArrowRight className="size-4" />
        </a>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          <span className="hidden lg:inline">{v.hintHover}</span>
          <span className="lg:hidden">{v.hintTap}</span>
        </p>
      </div>

      <div ref={cityRef} className={`vz-city relative lg:col-span-8 ${popup ? "z-30" : "z-[1]"}`}>
        {popup && (
          <div
            className="vz-popup pointer-events-none absolute z-20"
            style={{ left: popup.left, top: popup.top, transform: "translateX(-50%)" }}
            role="status"
          >
            <SiteMock lot={popup.lot} v={v} />
          </div>
        )}
        <svg ref={svgRef} viewBox="-445 -170 890 660" role="img" aria-label={v.ariaLabel}>
          <defs>
            <filter id="vz-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="vz-pool-grad">
              <stop offset="0" stopColor="#00d1ff" stopOpacity=".55" />
              <stop offset=".55" stopColor="#00d1ff" stopOpacity=".12" />
              <stop offset="1" stopColor="#00d1ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g data-layer="ground" />
          <g data-layer="pools" />
          <g data-layer="cars" />
          <g data-layer="buildings" />
          <g data-layer="people" />
          <g data-layer="tags" />
        </svg>
      </div>
    </section>
  );
}
