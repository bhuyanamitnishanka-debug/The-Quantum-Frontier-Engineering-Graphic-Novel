import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundFx } from '../services/soundFx';
import { Play, Pause, RotateCcw, Zap, Eye, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface ThreeLatticeSceneProps {
  defectSeverity?: number; // 0 to 100
  onDefectHit?: () => void;
  interactive?: boolean;
}

export const ThreeLatticeScene: React.FC<ThreeLatticeSceneProps> = ({
  defectSeverity = 80,
  onDefectHit,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'chase' | 'driver' | 'defect' | 'orbit'>('chase');
  const [spinState, setSpinState] = useState<'up' | 'down' | 'superposition'>('up');
  const [velocity, setVelocity] = useState<number>(1.2);
  const [isTunneling, setIsTunneling] = useState<boolean>(false);
  const [hasScattered, setHasScattered] = useState<boolean>(false);
  const [currentDefect, setCurrentDefect] = useState<number>(defectSeverity);

  // References to keep animation loop clean
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spinGroupRef = useRef<THREE.Group | null>(null);
  const orbitalRingsRef = useRef<THREE.Group | null>(null);
  const defectGroupRef = useRef<THREE.Group | null>(null);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);
  const trailLineRef = useRef<THREE.Line | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Electron physics state
  const electronState = useRef({
    z: -18,
    speed: velocity,
    scattered: false,
    tunneling: false,
    precessionAngle: 0,
    ringRotX: 0,
    ringRotY: 0,
  });

  useEffect(() => {
    setCurrentDefect(defectSeverity);
  }, [defectSeverity]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 1.8, -25);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x22d3ee, 3, 20);
    cyanPointLight.position.set(0, 0, 0);
    scene.add(cyanPointLight);

    const redDefectLight = new THREE.PointLight(0xef4444, 4, 15);
    redDefectLight.position.set(1.5, 0.5, 4);
    scene.add(redDefectLight);

    // 5. Construct Crystal Lattice Cylinder (Hexagonal Carbon Nanotube / Quantum Conduit)
    const latticeGroup = new THREE.Group();
    const tubeRadius = 3.2;
    const tubeLength = 55;
    const numRings = 42;
    const verticesPerRing = 12;

    const atomGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const atomMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const bondMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.65,
    });

    // Generate atomic nodes in alternating hexagonal stagger
    const ringPositions: THREE.Vector3[][] = [];
    for (let r = 0; r < numRings; r++) {
      const z = -25 + (r / (numRings - 1)) * tubeLength;
      const angleOffset = (r % 2) * (Math.PI / verticesPerRing);
      const ring: THREE.Vector3[] = [];

      for (let v = 0; v < verticesPerRing; v++) {
        const theta = (v / verticesPerRing) * Math.PI * 2 + angleOffset;
        const x = Math.cos(theta) * tubeRadius;
        const y = Math.sin(theta) * tubeRadius;
        const pos = new THREE.Vector3(x, y, z);
        ring.push(pos);

        // Don't render atoms in the defect zone to show missing vacancy!
        const isDefectZone = z > 2 && z < 7 && (theta > 0 && theta < Math.PI * 0.7);
        if (!isDefectZone) {
          const atomMesh = new THREE.Mesh(atomGeom, atomMat);
          atomMesh.position.copy(pos);
          latticeGroup.add(atomMesh);
        }
      }
      ringPositions.push(ring);
    }

    // Connect atoms with bonds (circumferential and longitudinal zig-zag)
    for (let r = 0; r < numRings; r++) {
      const currentRing = ringPositions[r];
      // Ring bonds
      for (let v = 0; v < verticesPerRing; v++) {
        const nextV = (v + 1) % verticesPerRing;
        const p1 = currentRing[v];
        const p2 = currentRing[nextV];
        const inDefect = p1.z > 2 && p1.z < 7 && (p1.x > 0 && p1.y > -0.5);

        if (!inDefect) {
          const bondGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          const line = new THREE.Line(bondGeom, bondMat);
          latticeGroup.add(line);
        }
      }

      // Longitudinal bonds to next ring
      if (r < numRings - 1) {
        const nextRing = ringPositions[r + 1];
        for (let v = 0; v < verticesPerRing; v++) {
          const p1 = currentRing[v];
          const p2 = nextRing[v];
          const inDefect = p1.z > 2 && p1.z < 7 && (p1.x > 0 && p1.y > -0.5);

          if (!inDefect) {
            const bondGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            const line = new THREE.Line(bondGeom, bondMat);
            latticeGroup.add(line);
          }
        }
      }
    }
    scene.add(latticeGroup);

    // 6. Build the Defect Cluster (Crimson fractured atoms and distorted bonds)
    const defectGroup = new THREE.Group();
    defectGroupRef.current = defectGroup;

    const defectAtomGeom = new THREE.DodecahedronGeometry(0.24, 0);
    const defectAtomMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.6,
      roughness: 0.1,
    });

    const brokenBondMat = new THREE.LineBasicMaterial({
      color: 0xf87171,
      transparent: true,
      opacity: 0.85,
    });

    // Scatter 14 jagged broken defect chunks at z = 4
    for (let i = 0; i < 14; i++) {
      const mesh = new THREE.Mesh(defectAtomGeom, defectAtomMat);
      const angle = (i / 14) * Math.PI * 0.75 + 0.2;
      const r = tubeRadius + (Math.random() - 0.5) * 0.9;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = 4 + (Math.random() - 0.5) * 2.8;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      defectGroup.add(mesh);

      // Broken bond spike
      const spikeEnd = new THREE.Vector3(
        x + (Math.random() - 0.5) * 1.2,
        y + (Math.random() - 0.5) * 1.2,
        z + (Math.random() - 0.5) * 1.2
      );
      const spikeGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), spikeEnd]);
      const spikeLine = new THREE.Line(spikeGeom, brokenBondMat);
      defectGroup.add(spikeLine);
    }
    scene.add(defectGroup);

    // 7. Build Rigged 3D Character: "Spin the Electron"
    const spinGroup = new THREE.Group();
    spinGroupRef.current = spinGroup;

    // Electron luminous core
    const coreGeom = new THREE.SphereGeometry(0.38, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    spinGroup.add(coreMesh);

    // Inner bright energy point light attached to character
    const charLight = new THREE.PointLight(0x38bdf8, 2.5, 8);
    spinGroup.add(charLight);

    // Quantum orbital precession rings (Dual orthogonal rings)
    const orbitalGroup = new THREE.Group();
    orbitalRingsRef.current = orbitalGroup;

    const ringGeom = new THREE.TorusGeometry(0.72, 0.024, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });

    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    const ring2 = new THREE.Mesh(ringGeom, ringMat);
    ring2.rotation.x = Math.PI / 2;

    orbitalGroup.add(ring1);
    orbitalGroup.add(ring2);
    spinGroup.add(orbitalGroup);

    // Quantum Spin Vector Arrow (Precession indicator)
    const arrowDir = new THREE.Vector3(0, 1, 0);
    const arrowOrigin = new THREE.Vector3(0, 0, 0);
    const arrowLength = 0.95;
    const arrowColor = 0xa5f3fc;
    const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, arrowColor, 0.25, 0.15);
    spinGroup.add(arrowHelper);

    // Initial position
    spinGroup.position.set(0, 0, -18);
    scene.add(spinGroup);

    // 8. Particle Wake / Electron De Broglie Trail
    const maxTrailPoints = 30;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });
    const trailLine = new THREE.Line(trailGeom, trailMat);
    trailLineRef.current = trailLine;
    scene.add(trailLine);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Mouse drag for orbit mode
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitTheta = 0;
    let orbitPhi = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      orbitTheta -= deltaX * 0.008;
      orbitPhi = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, orbitPhi + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 9. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (electronState.current && spinGroup) {
        // Spin orbital precession
        if (orbitalGroup) {
          orbitalGroup.rotation.x += 2.2 * delta;
          orbitalGroup.rotation.y += 3.4 * delta;
          orbitalGroup.rotation.z += 1.1 * delta;
        }

        // Forward motion
        if (isPlaying) {
          const moveSpeed = electronState.current.speed * (electronState.current.scattered ? 0.3 : 1);
          electronState.current.z += moveSpeed * delta * 7;

          // Check defect collision
          const defectZ = 4.0;
          const distToDefect = Math.abs(electronState.current.z - defectZ);

          if (distToDefect < 1.2 && !electronState.current.scattered && !electronState.current.tunneling) {
            if (currentDefect > 30) {
              // Trigger scattering!
              electronState.current.scattered = true;
              setHasScattered(true);
              soundFx.playScatter();
              if (onDefectHit) onDefectHit();

              // Deflect Spin upward and wobble
              spinGroup.position.y += 0.8;
              coreMat.color.setHex(0xef4444);
              coreMat.emissive.setHex(0xb91c1c);
              ringMat.color.setHex(0xf87171);
            }
          }

          // Loop reset
          if (electronState.current.z > 22) {
            electronState.current.z = -22;
            electronState.current.scattered = false;
            setHasScattered(false);
            coreMat.color.setHex(0x67e8f9);
            coreMat.emissive.setHex(0x06b6d4);
            ringMat.color.setHex(0x38bdf8);
            spinGroup.position.y = 0;
            spinGroup.position.x = 0;
          }

          spinGroup.position.z = electronState.current.z;

          // Slight quantum harmonic bobbing
          if (!electronState.current.scattered) {
            spinGroup.position.y = Math.sin(time * 6) * 0.15;
            spinGroup.position.x = Math.cos(time * 4) * 0.15;
          } else {
            // Chaotic Brownian scattering wobble
            spinGroup.position.y += (Math.sin(time * 25) * 0.08);
            spinGroup.position.x += (Math.cos(time * 22) * 0.08);
          }

          // Update Trail
          const trailPoints = trailPointsRef.current;
          trailPoints.unshift(spinGroup.position.clone());
          if (trailPoints.length > maxTrailPoints) {
            trailPoints.pop();
          }

          const positions = trailLine.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < maxTrailPoints; i++) {
            if (i < trailPoints.length) {
              positions[i * 3] = trailPoints[i].x;
              positions[i * 3 + 1] = trailPoints[i].y;
              positions[i * 3 + 2] = trailPoints[i].z;
            } else {
              positions[i * 3] = spinGroup.position.x;
              positions[i * 3 + 1] = spinGroup.position.y;
              positions[i * 3 + 2] = spinGroup.position.z;
            }
          }
          trailLine.geometry.attributes.position.needsUpdate = true;
        }

        // Camera steering based on selected mode
        if (cameraMode === 'chase') {
          const targetCamZ = spinGroup.position.z - 6.5;
          camera.position.set(
            THREE.MathUtils.lerp(camera.position.x, spinGroup.position.x * 0.4, 0.1),
            THREE.MathUtils.lerp(camera.position.y, spinGroup.position.y + 1.4, 0.1),
            THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.12)
          );
          camera.lookAt(spinGroup.position.x, spinGroup.position.y, spinGroup.position.z + 4);
        } else if (cameraMode === 'driver') {
          camera.position.set(
            spinGroup.position.x,
            spinGroup.position.y + 0.1,
            spinGroup.position.z + 0.2
          );
          camera.lookAt(0, 0, spinGroup.position.z + 12);
        } else if (cameraMode === 'defect') {
          camera.position.set(3.8, 2.2, 0.5);
          camera.lookAt(1.5, 0.5, 4.0);
        } else if (cameraMode === 'orbit') {
          const radius = 12;
          camera.position.x = Math.sin(orbitTheta) * Math.cos(orbitPhi) * radius;
          camera.position.y = Math.sin(orbitPhi) * radius + 1;
          camera.position.z = Math.cos(orbitTheta) * Math.cos(orbitPhi) * radius + (spinGroup.position.z * 0.3);
          camera.lookAt(0, 0, spinGroup.position.z);
        }
      }

      // Pulse defect light
      redDefectLight.intensity = 3.5 + Math.sin(time * 8) * 1.5;

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [isPlaying, cameraMode, currentDefect]);

  // Update speed
  const handleVelocityChange = (v: number) => {
    setVelocity(v);
    if (electronState.current) {
      electronState.current.speed = v;
    }
  };

  // Reset Run
  const handleReset = () => {
    if (electronState.current && spinGroupRef.current) {
      electronState.current.z = -20;
      electronState.current.scattered = false;
      setHasScattered(false);
      trailPointsRef.current = [];
      soundFx.playWhoosh();
    }
  };

  // Quantum Tunneling Surge
  const triggerTunneling = () => {
    if (isTunneling) return;
    setIsTunneling(true);
    electronState.current.tunneling = true;
    soundFx.playTriumph();

    // Visual tunnel surge
    if (spinGroupRef.current) {
      spinGroupRef.current.scale.set(1.5, 1.5, 1.5);
    }

    setTimeout(() => {
      setIsTunneling(false);
      electronState.current.tunneling = false;
      if (spinGroupRef.current) {
        spinGroupRef.current.scale.set(1, 1, 1);
      }
    }, 2800);
  };

  return (
    <div className="relative w-full h-[580px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-900/40 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Holographic HUD Overlay Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-cyan-500/30 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LATTICE: SWCNT (10,10) ARMCHAIR
          </span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-slate-300">
            z = {electronState.current.z.toFixed(1)} Å
          </span>
          <span className="text-slate-500">|</span>
          <span className={`font-mono font-semibold ${hasScattered ? 'text-red-400' : 'text-emerald-400'}`}>
            {hasScattered ? 'CRASH: SCATTERED' : isTunneling ? 'TUNNELING ACTIVE' : 'BALLISTIC FLOW'}
          </span>
        </div>

        {/* Camera Selector Tabs */}
        <div className="pointer-events-auto flex items-center bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => setCameraMode('chase')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              cameraMode === 'chase' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chase
          </button>
          <button
            onClick={() => setCameraMode('driver')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              cameraMode === 'driver' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Driver
          </button>
          <button
            onClick={() => setCameraMode('defect')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              cameraMode === 'defect' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Defect Cam
          </button>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              cameraMode === 'orbit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            360° Orbit
          </button>
        </div>
      </div>

      {/* Collision Alert Banner */}
      {hasScattered && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-500/60 px-4 py-2 rounded-xl text-center shadow-lg animate-bounce pointer-events-none">
          <p className="text-red-400 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 justify-center">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            ELASTIC BACKSCATTERING DETECTED!
          </p>
          <p className="text-red-200 text-xs">
            Ballistic conductance collapsed: G &lt; 0.05 (2e²/h)
          </p>
        </div>
      )}

      {/* Bottom Interactive Control Cockpit */}
      {interactive && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Play/Pause & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                soundFx.playBlip(600);
              }}
              className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold transition-all flex items-center gap-1"
              title={isPlaying ? 'Pause Run' : 'Resume Run'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1"
              title="Reset Run"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quantum Tunneling Trigger */}
            <button
              onClick={triggerTunneling}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium flex items-center gap-1.5 transition-all ${
                isTunneling
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_#f59e0b]'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:brightness-110 shadow-sm'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {isTunneling ? 'TUNNELING!' : 'Phase Barrier Tunnel'}
            </button>
          </div>

          {/* Velocity Slider */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <span className="text-slate-400 font-mono text-[11px]">Speed (v_F):</span>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={velocity}
              onChange={(e) => handleVelocityChange(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <span className="font-mono text-cyan-300 text-[11px] tabular-nums">
              {(velocity * 0.8).toFixed(1)}×10⁶ m/s
            </span>
          </div>

          {/* Spin Orientation State */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Spin:</span>
            <div className="flex bg-slate-800 p-0.5 rounded-md border border-slate-700">
              <button
                onClick={() => {
                  setSpinState('up');
                  soundFx.playBlip(900);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  spinState === 'up' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                |↑⟩ Up
              </button>
              <button
                onClick={() => {
                  setSpinState('down');
                  soundFx.playBlip(750);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  spinState === 'down' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                |↓⟩ Down
              </button>
              <button
                onClick={() => {
                  setSpinState('superposition');
                  soundFx.playBlip(1050);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  spinState === 'superposition' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ψ Sup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
