import { useEffect, useState } from 'react';

/**
 * Detects WebGL availability without triggering Three.js error logging.
 * Returns true if the browser can create a WebGL context.
 */
function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export function useThreeBackground(canvasId = 'three-canvas') {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Detect WebGL support BEFORE importing Three.js to avoid error spam
    if (!isWebGLAvailable()) {
      console.warn('[ThreeBackground] WebGL not available. Skipping 3D render.');
      setSupported(false);
      return;
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Dynamically import Three.js only when WebGL is confirmed available
    let cancelled = false;

    import('three').then((THREE) => {
      if (cancelled) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      } catch (error) {
        console.warn('[ThreeBackground] WebGL context creation failed.', error);
        setSupported(false);
        return;
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometry = new THREE.IcosahedronGeometry(2, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x3B82F6,
        wireframe: true,
        transparent: true,
        opacity: 0.08
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 700;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x111111,
        transparent: true,
        opacity: 0.15
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      camera.position.z = 5;

      let mouseX = 0;
      let mouseY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      const onDocumentMouseMove = (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
      };
      document.addEventListener('mousemove', onDocumentMouseMove);

      let animationFrameId;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const targetX = mouseX * 0.001;
        const targetY = mouseY * 0.001;

        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;

        sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

        particlesMesh.rotation.y = -mouseX * 0.0001;
        particlesMesh.rotation.x = -mouseY * 0.0001;

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Store cleanup references on the canvas element for the unmount handler
      canvas._threeCleanup = () => {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        geometry.dispose();
        material.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();

        renderer.dispose();
        renderer.forceContextLoss();
      };
    });

    return () => {
      cancelled = true;
      const canvas = document.getElementById(canvasId);
      if (canvas?._threeCleanup) {
        canvas._threeCleanup();
        delete canvas._threeCleanup;
      }
    };
  }, [canvasId]);

  return supported;
}
