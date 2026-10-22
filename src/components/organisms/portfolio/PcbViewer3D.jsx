import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * 3D Custom PCB Hardware Showcase.
 * Loads the user's exported PCB model, properly centers and scales it,
 * keeps it stationary by default, and allows the user to drag to rotate.
 */
export function PcbViewer3D() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // ─── SCENE & CAMERA ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // Isometric angle showing top components & side profiles clearly
    camera.position.set(2.4, 2.5, 3.8);
    camera.lookAt(0, 0, 0);

    // ─── RENDERER ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ─── ORBIT CONTROLS (DRAG TO ROTATE, STATIONARY BY DEFAULT) ───────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // Disable scroll zoom so page scroll works naturally
    controls.enablePan = false;  // Keep model centered
    controls.rotateSpeed = 0.85;
    controls.minPolarAngle = Math.PI * 0.15; // Don't flip to straight top view
    controls.maxPolarAngle = Math.PI * 0.55; // Don't go underneath
    controls.target.set(0, 0, 0);
    controls.update();

    // ─── LIGHTING ─────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff9944, 2.2);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // ─── ROOT & INNER GROUPS ──────────────────────────────────────────
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Lay PCB flat (+Z up so components face upward)
    const innerGroup = new THREE.Group();
    innerGroup.rotation.x = -Math.PI / 2;
    rootGroup.add(innerGroup);

    // ─── LOAD PCB GLB ─────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let isDisposed = false;

    loader.load(
      '/models/pcb.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Calculate bounding box and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scale to fill showcase area prominently
        const targetSize = 3.8;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        model.scale.set(scale, scale, scale);
        // Correct centering accounting for scale
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Enhance materials
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = Math.min(child.material.roughness ?? 0.5, 0.4);
            child.material.metalness = Math.max(child.material.metalness ?? 0.2, 0.3);
            child.material.side = THREE.DoubleSide;
          }
        });

        innerGroup.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading custom PCB model:', error);
        setLoading(false);
      }
    );

    // ─── RENDER LOOP (STATIONARY UNLESS DRAGGED) ──────────────────────
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update(); // Handles damping deceleration after dragging
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
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-center justify-center select-none overflow-hidden">
      {/* 3D Canvas with drag-to-rotate cursor */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ touchAction: 'pan-y' }}
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-white/60 border-t-white animate-spin mb-2" />
          <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest animate-pulse">
            Loading 3D PCB...
          </span>
        </div>
      )}
    </div>
  );
}
