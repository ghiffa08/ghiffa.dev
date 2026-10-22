import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Interactive 3D Custom PCB Hardware Component.
 * Loads the user's exported PCB model with automatic centering,
 * normalized scaling, PBR lighting, interactive rotation, and idle animation.
 */
export function PcbViewer3D() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, startX: 0, startY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 260;

    // ─── SCENE & CAMERA ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0, 0);

    // ─── RENDERER ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ─── LIGHTING ─────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Warm orange rim light matching card aesthetic
    const rimLight = new THREE.DirectionalLight(0xff944d, 2.0);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-4, 4, 3);
    scene.add(fillLight);

    // ─── ROOT PIVOT GROUP ─────────────────────────────────────────────
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Initial cinematic isometric orientation
    rootGroup.rotation.x = 0.55;
    rootGroup.rotation.y = -0.45;
    rootGroup.rotation.z = 0.15;

    // ─── LOAD CUSTOM PCB GLB ──────────────────────────────────────────
    const loader = new GLTFLoader();
    let loadedModel = null;

    loader.load(
      '/models/pcb.glb',
      (gltf) => {
        loadedModel = gltf.scene;

        // Auto center and normalize scale
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center model inside pivot group
        loadedModel.position.sub(center);

        // Normalize scale to fit the card viewport (target width ~4.2 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetSize = 4.2;
          const scale = targetSize / maxDim;
          loadedModel.scale.set(scale, scale, scale);
        }

        // Enhance material aesthetics (PBR metallic shine on pins, copper, solder mask)
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = Math.min(child.material.roughness, 0.45);
              child.material.metalness = Math.max(child.material.metalness, 0.25);
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        rootGroup.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading custom PCB model:', error);
        setLoading(false);
      }
    );

    // ─── INTERACTION & DRAG-TO-ROTATE ─────────────────────────────────
    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragRotX = 0;
    let dragRotY = 0;

    const onPointerDown = (e) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        dragRotY += deltaX * 0.012;
        dragRotX += deltaY * 0.012;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isMouseDown = false;
    };

    const onPointerLeave = () => {
      isMouseDown = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    // ─── ANIMATION LOOP ───────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse tilt interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Gentle floating oscillation
      const floatY = Math.sin(elapsedTime * 1.6) * 0.1;
      rootGroup.position.y = floatY;

      // Base idle rotation + mouse hover tilt + interactive user drag
      const baseRotX = 0.55;
      const baseRotY = -0.45 + (isMouseDown ? 0 : Math.sin(elapsedTime * 0.7) * 0.12);
      const baseRotZ = 0.15;

      rootGroup.rotation.x = baseRotX + dragRotX - mouseRef.current.y * 0.35;
      rootGroup.rotation.y = baseRotY + dragRotY + mouseRef.current.x * 0.45;
      rootGroup.rotation.z = baseRotZ;

      renderer.render(scene, camera);
    };

    animate();

    // ─── RESIZE LISTENER ──────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-center justify-center select-none overflow-hidden">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Loading Pulse */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-white/60 border-t-white animate-spin mb-2" />
          <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest animate-pulse">
            Loading 3D PCB...
          </span>
        </div>
      )}

      {/* Interactive Status Pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center gap-2 pointer-events-none shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/95 font-medium whitespace-nowrap">
          Interactive 3D PCB Design
        </span>
      </div>
    </div>
  );
}
