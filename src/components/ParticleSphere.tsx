import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ParticleSphereProps {
  particlesCount?: number;
  particleSize?: number;
  speed?: number;
  radius?: number;
  repelStrength?: number;
  repelRadius?: number;
  sphereColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParticleSphere({
  particlesCount = 8000,
  particleSize = 2.4,
  speed = 0.003,
  radius = 90,
  repelStrength = 22,
  repelRadius = 55,
  sphereColor = "#00d1ff",
  className = "",
  style,
}: ParticleSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 260);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Base Fibonacci Sphere Particles
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const basePositions: THREE.Vector3[] = [];
    const currentPositions = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const baseColor = new THREE.Color(sphereColor);
    const accentColor = new THREE.Color("#ffffff");
    const tealColor = new THREE.Color("#00e6a5");

    for (let i = 0; i < particlesCount; i++) {
      const y = 1 - (i / (particlesCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * r * radius;
      const posY = y * radius;
      const z = Math.sin(theta) * r * radius;

      basePositions.push(new THREE.Vector3(x, posY, z));

      const idx = i * 3;
      originalPositions[idx] = x;
      originalPositions[idx + 1] = posY;
      originalPositions[idx + 2] = z;

      currentPositions[idx] = x;
      currentPositions[idx + 1] = posY;
      currentPositions[idx + 2] = z;

      // Subtle cyan-teal-white cyber glow gradient
      const rand = Math.random();
      const c = rand > 0.85 ? accentColor : rand > 0.5 ? tealColor : baseColor;
      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(currentPositions, 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circle particle texture for sharp anti-aliased points
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(0, 209, 255, 0.85)");
      gradient.addColorStop(1, "rgba(0, 209, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: particleSize,
      map: particleTexture,
      transparent: true,
      opacity: 0.92,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    const sphereGroup = new THREE.Group();
    sphereGroup.add(particles);
    scene.add(sphereGroup);

    // 3. Mouse Hover Interaction (Raycasting & 3D Vector Repulsion)
    const mouse = new THREE.Vector2(-999, -999);
    const mouse3D = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Intersection plane

    let isMouseOver = false;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelX = 0;
    let rotVelY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        isMouseOver = true;
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
        if (intersectPoint) {
          mouse3D.copy(intersectPoint);
        }
      } else {
        isMouseOver = false;
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        sphereGroup.rotation.y += deltaX * 0.006;
        sphereGroup.rotation.x += deltaY * 0.006;
        rotVelY = deltaX * 0.002;
        rotVelX = deltaY * 0.002;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      rotVelX = 0;
      rotVelY = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerLeave = () => {
      isMouseOver = false;
      isDragging = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);

    // Click Ripple / Scatter Force
    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
      const clickPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, clickPoint);

      if (clickPoint) {
        // Apply immediate shockwave impulse
        const posAttr = geometry.attributes.position;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < particlesCount; i++) {
          const idx = i * 3;
          const px = array[idx];
          const py = array[idx + 1];
          const pz = array[idx + 2];

          const pWorld = new THREE.Vector3(px, py, pz).applyMatrix4(
            sphereGroup.matrixWorld
          );
          const dist = pWorld.distanceTo(clickPoint);

          if (dist < repelRadius * 1.6) {
            const dir = pWorld.clone().sub(clickPoint).normalize();
            const impulse = ((repelRadius * 1.6 - dist) / (repelRadius * 1.6)) * 40;
            array[idx] += dir.x * impulse;
            array[idx + 1] += dir.y * impulse;
            array[idx + 2] += dir.z * impulse;
          }
        }
        posAttr.needsUpdate = true;
      }
    };

    container.addEventListener("click", onClick);

    // 4. Animation Loop
    let animationFrameId: number;
    const invGroupMatrix = new THREE.Matrix4();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation
      if (!isDragging) {
        sphereGroup.rotation.y += speed;
        sphereGroup.rotation.y += rotVelY;
        sphereGroup.rotation.x += rotVelX;
        rotVelY *= 0.94;
        rotVelX *= 0.94;
      }

      sphereGroup.updateMatrixWorld(true);
      invGroupMatrix.copy(sphereGroup.matrixWorld).invert();

      // Transform mouse 3D position into local sphere space
      const localMouse = mouse3D.clone().applyMatrix4(invGroupMatrix);

      const posAttr = geometry.attributes.position;
      const array = posAttr.array as Float32Array;

      // Displace particles on mouse hover & restore smoothly
      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        const ox = originalPositions[idx];
        const oy = originalPositions[idx + 1];
        const oz = originalPositions[idx + 2];

        let cx = array[idx];
        let cy = array[idx + 1];
        let cz = array[idx + 2];

        if (isMouseOver) {
          const dx = cx - localMouse.x;
          const dy = cy - localMouse.y;
          const dz = cz - localMouse.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          const rRadiusSq = repelRadius * repelRadius;

          if (distSq < rRadiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repelRadius) * repelStrength;
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;

            // Push outward
            cx += nx * force * 0.35;
            cy += ny * force * 0.35;
            cz += nz * force * 0.35;
          }
        }

        // Smooth spring return to original Fibonacci position
        cx += (ox - cx) * 0.08;
        cy += (oy - cy) * 0.08;
        cz += (oz - cz) * 0.08;

        array[idx] = cx;
        array[idx + 1] = cy;
        array[idx + 2] = cz;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 450;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("click", onClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
    };
  }, [particlesCount, particleSize, speed, radius, repelStrength, repelRadius, sphereColor]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={style}
    />
  );
}
