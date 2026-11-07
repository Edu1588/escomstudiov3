"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, RotateCcw, Palette, Compass } from "lucide-react";

interface CarModelProps {
  bodyColor: string;
}

function CarModel({ bodyColor }: CarModelProps) {
  const { scene } = useGLTF("/18_mclaren_senna_crxw_widebody_kit_animated-v1.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Aplica cor na lataria (Car_paint)
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat.name.toLowerCase().includes("car_paint")) {
              (mat as THREE.MeshStandardMaterial).color.set(bodyColor);
              (mat as THREE.MeshStandardMaterial).roughness = 0.2;
              (mat as THREE.MeshStandardMaterial).metalness = 0.85;
            }
          });
        } else if (mesh.material && mesh.material.name.toLowerCase().includes("car_paint")) {
          (mesh.material as THREE.MeshStandardMaterial).color.set(bodyColor);
          (mesh.material as THREE.MeshStandardMaterial).roughness = 0.2;
          (mesh.material as THREE.MeshStandardMaterial).metalness = 0.85;
        }
      }
    });
  }, [scene, bodyColor]);

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} rotation={[0, -Math.PI / 3.5, 0]} scale={[0.9, 0.9, 0.9]}>
      <primitive object={scene} />
    </group>
  );
}

export interface CarShowcase3DProps {
  className?: string;
}

const CAR_COLORS = [
  { name: "Papaya Orange", hex: "#ff6b00" },
  { name: "Cyber Cyan", hex: "#00d1ff" },
  { name: "Obsidian Black", hex: "#111113" },
  { name: "Liquid Silver", hex: "#c8ccd0" },
  { name: "Electric Emerald", hex: "#00e6a5" },
];

export function CarShowcase3D({ className = "" }: CarShowcase3DProps) {
  const [selectedColor, setSelectedColor] = useState<string>("#ff6b00");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);

  const resetView = (angle: "hero" | "side" | "rear") => {
    if (!controlsRef.current) return;
    if (angle === "hero") {
      controlsRef.current.setAzimuthalAngle(-Math.PI / 4);
      controlsRef.current.setPolarAngle(Math.PI / 2.3);
    } else if (angle === "side") {
      controlsRef.current.setAzimuthalAngle(Math.PI / 2);
      controlsRef.current.setPolarAngle(Math.PI / 2.2);
    } else if (angle === "rear") {
      controlsRef.current.setAzimuthalAngle(Math.PI);
      controlsRef.current.setPolarAngle(Math.PI / 2.3);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[460px] md:min-h-[560px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0d14] via-[#06080d] to-[#030407] border border-white/10 ${className}`}>
      {/* HUD Superior / Controles */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider pointer-events-auto">
          <span className="size-2 rounded-full bg-[#ff6b00] animate-pulse" />
          <span>McLaren Senna CRXW · Widebody</span>
        </div>

        {/* Seletores de Ângulo de Câmera */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto">
          <button
            type="button"
            onClick={() => resetView("hero")}
            className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            3/4 Front
          </button>
          <button
            type="button"
            onClick={() => resetView("side")}
            className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Perfil
          </button>
          <button
            type="button"
            onClick={() => resetView("rear")}
            className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Traseira
          </button>
        </div>
      </div>

      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [3.8, 1.6, 4.5], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 15, 8]} intensity={1.6} color="#ffffff" castShadow />
        <directionalLight position={[-10, 8, -6]} intensity={0.8} color="#00d1ff" />
        <directionalLight position={[0, -5, -5]} intensity={0.3} color="#ffffff" />
        <spotLight position={[0, 10, 0]} intensity={1.2} angle={0.6} penumbra={0.8} />

        <Environment preset="city" />

        <Suspense
          fallback={
            null
          }
        >
          <CarModel bodyColor={selectedColor} />
        </Suspense>

        <ContactShadows
          position={[0, -0.2, 0]}
          opacity={0.65}
          scale={15}
          blur={2.2}
          far={3.8}
        />

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2 - 0.04}
          minPolarAngle={Math.PI / 3.2}
        />
      </Canvas>

      {/* HUD Inferior: Paleta de Cores & Botão de Rotação */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Seletor de Cores da Carroceria */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/10 pointer-events-auto">
          <Palette className="size-3.5 text-white/50 ml-2" />
          <div className="flex items-center gap-1.5 px-1">
            {CAR_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setSelectedColor(c.hex)}
                title={c.name}
                aria-label={c.name}
                style={{ backgroundColor: c.hex }}
                className={`size-5 rounded-full transition-all border ${
                  selectedColor === c.hex
                    ? "scale-125 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                    : "border-black/50 opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Toggle Auto-Rotate */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-mono uppercase tracking-wider transition-all pointer-events-auto ${
            autoRotate
              ? "bg-cyan/15 text-cyan border-cyan/40"
              : "bg-black/60 text-white/60 border-white/10 hover:text-white"
          }`}
        >
          <Compass className={`size-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          <span>{autoRotate ? "Auto-Giro Ativo" : "Giro Livre 360°"}</span>
        </button>
      </div>
    </div>
  );
}

export default CarShowcase3D;
