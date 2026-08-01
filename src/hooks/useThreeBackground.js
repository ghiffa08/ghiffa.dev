import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CONFIG = {
  sphereSize: 2,
  sphereSegments: 1,
  sphereColor: 0x3B82F6,
  sphereOpacity: 0.12,
  sphereRotSpeed: 0.002,
  spherePulseSpeed: 1.2,
  spherePulseAmount: 0.04,
  mouseInfluence: 0.04,
};

export function useThreeBackground(canvasId = 'three-canvas') {
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Check WebGL support FIRST and save context
    const gl =
      canvas.getContext('webgl2', { alpha: true }) ||
      canvas.getContext('webgl', { alpha: true });
    if (!gl) return;
    initializedRef.current = true;

    let renderer, scene, camera, sphere;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      });
      rendererRef.current = renderer;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ─── SPHERE ────────────────────────────────
      const geometry = new THREE.IcosahedronGeometry(
        CONFIG.sphereSize,
        CONFIG.sphereSegments
      );
      const material = new THREE.MeshBasicMaterial({
        color: CONFIG.sphereColor,
        wireframe: true,
        transparent: true,
        opacity: CONFIG.sphereOpacity,
      });
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // ─── MOUSE TRACKING ─────────────────────────
      let mouseX = 0,
        mouseY = 0;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;

      const onMove = (e) => {
        mouseX = (e.clientX - halfW) / halfW;
        mouseY = (e.clientY - halfH) / halfH;
      };
      document.addEventListener('mousemove', onMove, { passive: true });

      // ─── ANIMATION LOOP ─────────────────────────
      const timer = new THREE.Timer();
      timer.connect(document);

      const animate = (timestamp) => {
        animFrameRef.current = requestAnimationFrame(animate);
        timer.update(timestamp);
        const t = timer.getElapsed();

        // Sphere: rotation + pulse
        sphere.rotation.x += CONFIG.sphereRotSpeed * 0.6;
        sphere.rotation.y += CONFIG.sphereRotSpeed;
        sphere.rotation.z += CONFIG.sphereRotSpeed * 0.3;

        // Mouse parallax on sphere (smooth override)
        const targetRotX = mouseY * CONFIG.mouseInfluence;
        const targetRotY = mouseX * CONFIG.mouseInfluence;
        sphere.rotation.x +=
          (targetRotX - sphere.rotation.x + CONFIG.sphereRotSpeed * 0.6) * 0.05;
        sphere.rotation.y +=
          (targetRotY - sphere.rotation.y + CONFIG.sphereRotSpeed) * 0.05;

        // Gentle scale pulse
        const pulse =
          1 + Math.sin(t * CONFIG.spherePulseSpeed) * CONFIG.spherePulseAmount;
        sphere.scale.set(pulse, pulse, pulse);

        renderer.render(scene, camera);
      };
      animate();

      // ─── RESIZE ─────────────────────────────────
      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // ─── CLEANUP ────────────────────────────────
      return () => {
        document.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);

        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        sphere?.geometry.dispose();
        sphere?.material.dispose();

        rendererRef.current?.dispose();
        rendererRef.current = null;
        initializedRef.current = false;
      };
    } catch (err) {
      console.error('ThreeBackground:', err);
      initializedRef.current = false;
    }
  }, [canvasId]);
}