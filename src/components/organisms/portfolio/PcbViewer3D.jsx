import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { PcbSkeleton } from '../../atoms/PcbSkeleton';

function checkWebGLSupport() {
  try {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * 3D Custom PCB Hardware Showcase.
 * Loads the user's exported PCB model, properly centers and scales it,
 * keeps it stationary by default, and allows the user to drag to rotate.
 */
export function PcbViewer3D() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window));
  const [hasWebGL, setHasWebGL] = useState(() => checkWebGLSupport());

  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || !hasWebGL) return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // ─── SCENE & CAMERA ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Camera positioned to view PCB with comfortable perspective
    camera.position.set(0, 2.4, 4.2);
    camera.lookAt(0, 0, 0);

    // ─── RENDERER ─────────────────────────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGLRenderer context creation failed:', e);
      setHasWebGL(false);
      return;
    }
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
    // Allow full 360-degree orbital rotation to inspect both top components and bottom logo uniku
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    // Anchor target is locked precisely to the true geometric center of the PCB board
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

    // Bottom light so the underside (silkscreen & logo uniku) is well illuminated
    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.4);
    bottomLight.position.set(0, -6, 0);
    scene.add(bottomLight);

    // ─── ROOT & INNER GROUPS ──────────────────────────────────────────
    const rootGroup = new THREE.Group();
    // Default initial pose: tilt forward (0.48) and rotate diagonally (0.85) matching showcase screenshot
    rootGroup.rotation.x = 0.48;
    rootGroup.rotation.y = 0.85;
    scene.add(rootGroup);

    // Lay PCB flat (+Z up so components face upward)
    const innerGroup = new THREE.Group();
    innerGroup.rotation.x = -Math.PI / 2;
    rootGroup.add(innerGroup);

    // ─── LOAD PCB GLB ─────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let isDisposed = false;

    loader.load(
      '/models/pcb.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Find the actual PCB board substrate mesh (the largest flat mesh)
        // so the anchor/pivot is locked precisely at the center of the board
        let boardMesh = null;
        let maxArea = 0;
        model.traverse((child) => {
          if (child.isMesh) {
            const b = new THREE.Box3().setFromObject(child);
            const s = b.getSize(new THREE.Vector3());
            const area = s.x * s.y;
            if (area > maxArea) {
              maxArea = area;
              boardMesh = child;
            }
          }
        });

        const boardBox = new THREE.Box3().setFromObject(boardMesh || model);
        const center = boardBox.getCenter(new THREE.Vector3());
        const size = boardBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y);

        // Optimal scale so all diagonal edges remain fully within bounds at any rotation angle
        const targetSize = 3.2;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        model.scale.set(scale, scale, scale);
        // Correct centering so the exact geometric center of the PCB board substrate sits at (0, 0, 0)
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
      const newWidth = container.clientWidth || 320;
      const newHeight = container.clientHeight || 260;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [inView]);

  if (hasWebGL === false) {
    return (
      <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-2 sm:mt-3 -translate-y-2 sm:-translate-y-3 flex items-center justify-center select-none">
        <PcbSkeleton />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-2 sm:mt-3 -translate-y-2 sm:-translate-y-3 flex items-center justify-center select-none">
      {/* 3D Canvas with drag-to-rotate cursor */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-all duration-700 ease-out group-hover:-translate-y-2 ${loading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        style={{ touchAction: 'pan-y' }}
      />

      {/* PCB Hardware Skeleton Loader (No spinner) */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
          <PcbSkeleton />
        </div>
      )}
    </div>
  );
}

export default PcbViewer3D;
