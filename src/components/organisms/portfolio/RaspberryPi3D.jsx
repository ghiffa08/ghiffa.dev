import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D Raspberry Pi 4 Model B Hardware Component.
 * Built with Three.js procedural geometries and PBR materials.
 * Features realistic PCB, Broadcom SoC, 40-pin GPIO header, USB 3.0/2.0 ports,
 * Ethernet jack, micro-HDMI, and pulsing status LEDs.
 */
export function RaspberryPi3D() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 280;

    // ─── SCENE & CAMERA ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 5.8);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(4, 7, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    // Warm orange rim light matching card aesthetic
    const rimLight = new THREE.DirectionalLight(0xffa256, 1.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const softFillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    softFillLight.position.set(-3, 4, 3);
    scene.add(softFillLight);

    // ─── RASPBERRY PI MAIN GROUP ──────────────────────────────────────
    const piGroup = new THREE.Group();
    scene.add(piGroup);

    // 1. PCB Main Board (Raspberry Pi Classic Forest Green)
    const pcbGeo = new THREE.BoxGeometry(4.4, 0.09, 2.9);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x115028,
      roughness: 0.35,
      metalness: 0.12
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    pcb.receiveShadow = true;
    piGroup.add(pcb);

    // 2. Corner Mounting Holes (4 with golden copper ring pads)
    const holePositions = [
      [-1.9, 0.05, -1.15],
      [1.9, 0.05, -1.15],
      [-1.9, 0.05, 1.15],
      [1.9, 0.05, 1.15]
    ];
    const holePadMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });
    const holeHollowMat = new THREE.MeshBasicMaterial({ color: 0x092613 });
    const holeRingGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16);
    const holeInnerGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.11, 16);

    holePositions.forEach(([hx, hy, hz]) => {
      const ring = new THREE.Mesh(holeRingGeo, holePadMat);
      ring.position.set(hx, hy, hz);
      piGroup.add(ring);

      const inner = new THREE.Mesh(holeInnerGeo, holeHollowMat);
      inner.position.set(hx, hy, hz);
      piGroup.add(inner);
    });

    // 3. Broadcom BCM2711 SoC CPU (Metallic Silver Heatspreader)
    const cpuGeo = new THREE.BoxGeometry(0.85, 0.08, 0.85);
    const cpuMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.88,
      roughness: 0.22
    });
    const cpu = new THREE.Mesh(cpuGeo, cpuMat);
    cpu.position.set(-0.45, 0.08, 0.05);
    cpu.castShadow = true;
    piGroup.add(cpu);

    // CPU Die Center Plate
    const cpuCoreGeo = new THREE.BoxGeometry(0.55, 0.03, 0.55);
    const cpuCoreMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.5,
      roughness: 0.4
    });
    const cpuCore = new THREE.Mesh(cpuCoreGeo, cpuCoreMat);
    cpuCore.position.set(-0.45, 0.13, 0.05);
    piGroup.add(cpuCore);

    // 4. LPDDR4 SDRAM RAM Chip (Black Matte Package)
    const ramGeo = new THREE.BoxGeometry(0.6, 0.06, 0.6);
    const ramMat = new THREE.MeshStandardMaterial({
      color: 0x1e2022,
      roughness: 0.65,
      metalness: 0.15
    });
    const ram = new THREE.Mesh(ramGeo, ramMat);
    ram.position.set(0.55, 0.07, 0.05);
    ram.castShadow = true;
    piGroup.add(ram);

    // 5. 40-Pin GPIO Header (Dual Row Gold Pins on Black Plastic)
    const gpioBaseGeo = new THREE.BoxGeometry(2.7, 0.12, 0.28);
    const gpioBaseMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.7
    });
    const gpioBase = new THREE.Mesh(gpioBaseGeo, gpioBaseMat);
    gpioBase.position.set(-0.4, 0.1, -1.18);
    piGroup.add(gpioBase);

    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1
    });

    const pinInstanced = new THREE.InstancedMesh(pinGeo, pinMat, 40);
    const dummy = new THREE.Object3D();
    let pinIndex = 0;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 20; col++) {
        const px = -1.6 + col * 0.126;
        const pz = -1.24 + row * 0.12;
        dummy.position.set(px, 0.24, pz);
        dummy.updateMatrix();
        pinInstanced.setMatrixAt(pinIndex++, dummy.matrix);
      }
    }
    piGroup.add(pinInstanced);

    // 6. Ethernet Port (RJ45 Metallic Socket at Right Edge)
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.85,
      roughness: 0.25
    });
    const ethGeo = new THREE.BoxGeometry(0.95, 0.65, 0.75);
    const ethernet = new THREE.Mesh(ethGeo, metalMat);
    ethernet.position.set(1.75, 0.36, 0.85);
    ethernet.castShadow = true;
    piGroup.add(ethernet);

    // Ethernet Socket Hole
    const ethHoleGeo = new THREE.BoxGeometry(0.1, 0.45, 0.55);
    const darkHoleMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const ethHole = new THREE.Mesh(ethHoleGeo, darkHoleMat);
    ethHole.position.set(2.23, 0.36, 0.85);
    piGroup.add(ethHole);

    // 7. USB 3.0 Dual Ports (Blue inserts on Right Edge)
    const usb3Geo = new THREE.BoxGeometry(0.85, 0.72, 0.65);
    const usb3 = new THREE.Mesh(usb3Geo, metalMat);
    usb3.position.set(1.8, 0.4, 0.0);
    usb3.castShadow = true;
    piGroup.add(usb3);

    // Blue tongue inserts for USB 3.0
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
    const usb3Tab1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), blueMat);
    usb3Tab1.position.set(2.23, 0.52, 0.0);
    piGroup.add(usb3Tab1);
    const usb3Tab2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), blueMat);
    usb3Tab2.position.set(2.23, 0.28, 0.0);
    piGroup.add(usb3Tab2);

    // 8. USB 2.0 Dual Ports (Black inserts on Right Edge, Top)
    const usb2Geo = new THREE.BoxGeometry(0.85, 0.72, 0.65);
    const usb2 = new THREE.Mesh(usb2Geo, metalMat);
    usb2.position.set(1.8, 0.4, -0.75);
    usb2.castShadow = true;
    piGroup.add(usb2);

    const blackTabMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const usb2Tab1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), blackTabMat);
    usb2Tab1.position.set(2.23, 0.52, -0.75);
    piGroup.add(usb2Tab1);
    const usb2Tab2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), blackTabMat);
    usb2Tab2.position.set(2.23, 0.28, -0.75);
    piGroup.add(usb2Tab2);

    // 9. Dual Micro-HDMI Ports (Bottom Edge)
    const hdmiGeo = new THREE.BoxGeometry(0.3, 0.15, 0.35);
    const hdmi1 = new THREE.Mesh(hdmiGeo, metalMat);
    hdmi1.position.set(-0.25, 0.11, 1.35);
    piGroup.add(hdmi1);
    const hdmi2 = new THREE.Mesh(hdmiGeo, metalMat);
    hdmi2.position.set(0.5, 0.11, 1.35);
    piGroup.add(hdmi2);

    // 10. USB-C Power Port (Bottom Edge, Left)
    const usbcGeo = new THREE.BoxGeometry(0.42, 0.16, 0.35);
    const usbc = new THREE.Mesh(usbcGeo, metalMat);
    usbc.position.set(-1.3, 0.11, 1.35);
    piGroup.add(usbc);

    // 11. 3.5mm AV Jack (Bottom Edge, Right)
    const avGeo = new THREE.BoxGeometry(0.35, 0.26, 0.5);
    const avJack = new THREE.Mesh(avGeo, gpioBaseMat);
    avJack.position.set(1.0, 0.17, 1.25);
    piGroup.add(avJack);

    // 12. Display & Camera Flat Cable Sockets (DSI & CSI)
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6 });
    const dsi = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.75), ribbonMat);
    dsi.position.set(-1.9, 0.12, 0.0);
    piGroup.add(dsi);
    const csi = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.75), ribbonMat);
    csi.position.set(0.0, 0.12, 0.85);
    piGroup.add(csi);

    // 13. Decoupling Capacitors & Surface Mount Elements (Gold/Silver accent details)
    const smdMatGold = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const smdMatSilver = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.9, roughness: 0.2 });
    const smdGeo = new THREE.BoxGeometry(0.12, 0.05, 0.08);

    const smdPositions = [
      [-0.45, 0.06, -0.55],
      [-0.25, 0.06, -0.55],
      [0.2, 0.06, -0.4],
      [0.35, 0.06, -0.4],
      [-1.1, 0.06, 0.4],
      [-0.9, 0.06, 0.7],
      [-0.7, 0.06, 0.85],
      [0.85, 0.06, -0.3],
      [1.0, 0.06, -0.3],
      [-1.4, 0.06, 0.0]
    ];

    smdPositions.forEach(([sx, sy, sz], idx) => {
      const smd = new THREE.Mesh(smdGeo, idx % 2 === 0 ? smdMatGold : smdMatSilver);
      smd.position.set(sx, sy, sz);
      piGroup.add(smd);
    });

    // 14. Activity and Power LEDs (Pulsing Green ACT & Solid Red PWR)
    const ledGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const redLedMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
    const pwrLed = new THREE.Mesh(ledGeo, redLedMat);
    pwrLed.position.set(1.9, 0.09, -1.25);
    piGroup.add(pwrLed);

    const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const actLed = new THREE.Mesh(ledGeo, greenLedMat);
    actLed.position.set(1.75, 0.09, -1.25);
    piGroup.add(actLed);

    const actPointLight = new THREE.PointLight(0x22c55e, 1.2, 2.5);
    actPointLight.position.set(1.75, 0.2, -1.25);
    piGroup.add(actPointLight);

    // ─── INITIAL ORIENTATION ──────────────────────────────────────────
    // Cinematic isometric angle
    piGroup.rotation.x = 0.58;
    piGroup.rotation.y = -0.48;
    piGroup.rotation.z = 0.2;
    piGroup.position.set(0, -0.15, 0);

    // ─── MOUSE EVENT LISTENERS ────────────────────────────────────────
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ─── ANIMATION LOOP ───────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Subtle float up and down
      const floatOffset = Math.sin(elapsedTime * 1.8) * 0.12;
      piGroup.position.y = -0.15 + floatOffset;

      // Idle rotation + mouse tilt
      const baseRotX = 0.58;
      const baseRotY = -0.48 + Math.sin(elapsedTime * 0.8) * 0.1;
      const baseRotZ = 0.2;

      piGroup.rotation.x = baseRotX - mouseRef.current.y * 0.4;
      piGroup.rotation.y = baseRotY + mouseRef.current.x * 0.55;
      piGroup.rotation.z = baseRotZ + mouseRef.current.x * 0.15;

      // Realistic Raspberry Pi ACT LED flicker (heartbeat/disk I/O)
      const flicker = Math.sin(elapsedTime * 8) > 0.3 ? 1.4 : (Math.sin(elapsedTime * 15) > 0 ? 0.3 : 0.05);
      actPointLight.intensity = flicker;
      greenLedMat.color.setHex(flicker > 0.5 ? 0x4ade80 : 0x14532d);

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
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[300px] xl:h-[320px] flex items-center justify-center select-none">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Floating Status Pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center gap-2 pointer-events-none shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/90 font-medium">
          Raspberry Pi 4 &bull; IoT / Hardware
        </span>
      </div>
    </div>
  );
}
