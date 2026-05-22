"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const PixelVoyagerCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 25;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    
    // Determine bounds for container (not necessarily full window)
    let containerWidth = mountRef.current.clientWidth;
    let containerHeight = mountRef.current.clientHeight;

    const isDarkMode = true; // Forcing dark mode behavior for this specific use case

    // Post-processing for bloom effect
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(containerWidth, containerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Starfield ---
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 1500; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Pixel Rocket ---
    const rocket = new THREE.Group();
    const pixelSize = 0.2;
    const pixelGeo = new THREE.BoxGeometry(pixelSize, pixelSize, pixelSize);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00ff41, flatShading: true }); // Green body
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x00aa2b, flatShading: true }); // Darker green wings
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, emissive: 0x87ceeb, emissiveIntensity: 0.5 });
    
    // Body, Wings, Cockpit
    for(let y=-4; y<5; y++) for(let x=-2; x<3; x++) {
        if(Math.abs(x) === 2 && y > 1) continue;
        const pixel = new THREE.Mesh(pixelGeo, bodyMat);
        pixel.position.set(x * pixelSize, y * pixelSize, 0);
        rocket.add(pixel);
    }
    for(let y=-3; y<-1; y++) for(let x=-4; x<-2; x++) {
        const pixelL = new THREE.Mesh(pixelGeo, wingMat);
        pixelL.position.set(x*pixelSize, y*pixelSize, 0);
        rocket.add(pixelL);
        const pixelR = new THREE.Mesh(pixelGeo, wingMat);
        pixelR.position.set(-x*pixelSize, y*pixelSize, 0);
        rocket.add(pixelR);
    }
    const cockpit = new THREE.Mesh(pixelGeo, cockpitMat);
    cockpit.position.set(0, 3 * pixelSize, pixelSize);
    rocket.add(cockpit);
    scene.add(rocket);

    // --- Rocket Trail (Object Pooling for Performance) ---
    const trailPool: THREE.Mesh[] = [];
    let trailIndex = 0;
    const trailSize = 200;
    const trailGeo = new THREE.BoxGeometry(pixelSize * 1.5, pixelSize * 1.5, pixelSize * 1.5);
    for(let i=0; i<trailSize; i++) {
        const trailMat = new THREE.MeshBasicMaterial({ color: 0x00ff41 }); // Green trail
        const particle = new THREE.Mesh(trailGeo, trailMat);
        particle.visible = false;
        scene.add(particle);
        trailPool.push(particle);
    }
    
    // --- Crypto Coins ---
    const coinGroup = new THREE.Group();
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, flatShading: true });
    for(let i=0; i<20; i++) {
        const coin = new THREE.Group();
        for(let p=0; p<15; p++) {
            const pixel = new THREE.Mesh(pixelGeo, coinMat);
            const angle = (p/15) * Math.PI * 2;
            pixel.position.set(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0);
            coin.add(pixel);
        }
        coin.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20);
        coinGroup.add(coin);
    }
    scene.add(coinGroup);

    const mousePos = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 };
    
    const handleMouseMove = (event: MouseEvent) => {
        mousePos.clientX = event.clientX;
        mousePos.clientY = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        if (mountRef.current) {
            const rect = mountRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                let targetX = ((mousePos.clientX - rect.left) / rect.width) * 2 - 1;
                let targetY = -((mousePos.clientY - rect.top) / rect.height) * 2 + 1;
                
                targetX = Math.max(-1.5, Math.min(1.5, targetX));
                targetY = Math.max(-1.5, Math.min(1.5, targetY));

                mouse.x = targetX;
                mouse.y = targetY;
            }
        }

        // Calculate visible dimensions at z=0 for accurate cursor tracking
        const vFov = (camera.fov * Math.PI) / 180;
        const heightAtZ0 = 2 * Math.tan(vFov / 2) * camera.position.z;
        const widthAtZ0 = heightAtZ0 * camera.aspect;

        const targetPosition = new THREE.Vector3(mouse.x * (widthAtZ0 / 2), mouse.y * (heightAtZ0 / 2), 0);
        rocket.position.lerp(targetPosition, 0.08); // slightly faster lerp
        rocket.rotation.y = (targetPosition.x - rocket.position.x) * 0.1;
        rocket.rotation.x = -(targetPosition.y - rocket.position.y) * 0.1;

        // Emit trail particles from pool
        if(Math.random() > 0.3) {
            const particle = trailPool[trailIndex];
            particle.position.copy(rocket.position);
            particle.position.y -= 0.7;
            particle.scale.setScalar(1);
            particle.visible = true;
            (particle as any).life = 1;
            trailIndex = (trailIndex + 1) % trailSize;
        }
        
        // Animate trail
        trailPool.forEach(p => {
            const particle = p as any;
            if(particle.visible) {
                particle.life -= delta * 1.5;
                particle.scale.setScalar(particle.life);
                if(particle.life <= 0) particle.visible = false;
            }
        });

        coinGroup.children.forEach((coin, i) => {
            coin.rotation.z = elapsedTime * (i % 2 === 0 ? 1 : -1);
        });
        
        composer.render();
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        
        containerWidth = mountRef.current.clientWidth || window.innerWidth;
        containerHeight = mountRef.current.clientHeight || window.innerHeight;
        
        if (containerWidth === 0 || containerHeight === 0) return;
        
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
        composer.setSize(containerWidth, containerHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    resizeObserver.observe(mountRef.current);
    window.addEventListener('resize', handleResize);

    // Initial resize to ensure correct bounds
    handleResize();

    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />;
};
