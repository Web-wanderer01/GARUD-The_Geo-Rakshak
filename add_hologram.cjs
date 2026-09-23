const fs = require('fs');
let content = fs.readFileSync('src/components/demo/Geological3DVisualizer.jsx', 'utf8');

const imports = `import React, { useMemo, useRef } from 'react';
import { Database, Satellite, Cpu, Radio, Smartphone, Activity, Map, Wifi, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const noise = (x, y) => {
  return Math.sin(x * 0.2) * Math.cos(y * 0.2) * 3 
       + Math.sin(x * 0.05) * Math.cos(y * 0.1) * 6
       + Math.sin(x * 0.4 + 2) * Math.cos(y * 0.3 + 1) * 1;
};

const DigitalTwinTerrain = ({ isSimulating }) => {
  const meshRef = useRef();
  const particlesRef = useRef();
  const size = 120;
  const segments = 120;
  
  const { positions, particlePos } = useMemo(() => {
    const pos = [];
    const pPos = [];
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const y = (j / segments - 0.5) * size;
        let z = noise(x, y);
        const valleyDist = Math.abs(y - x * 0.5);
        if (valleyDist < 10) z -= (10 - valleyDist) * 1.2;
        pos.push(x, y, z);
        
        if (Math.random() > 0.98) {
          pPos.push(x, y, z + Math.random() * 10);
        }
      }
    }
    return { positions: new Float32Array(pos), particlePos: new Float32Array(pPos) };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.elapsedTime * 0.05;
      meshRef.current.material.opacity = isSimulating ? (0.3 + Math.sin(clock.elapsedTime * 4) * 0.15) : 0.15;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = clock.elapsedTime * 0.05;
      particlesRef.current.position.z = Math.sin(clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -10, -20]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[size, size, segments, segments]}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </planeGeometry>
        <meshBasicMaterial 
          color={isSimulating ? "#ef4444" : "#0ea5e9"} 
          wireframe 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlePos.length / 3} array={particlePos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.3} color={isSimulating ? "#fca5a5" : "#38bdf8"} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};`;

content = content.replace(/import React from 'react';\nimport \{ Database, Satellite, Cpu, Radio, Smartphone, Activity, Map, Wifi, Zap \} from 'lucide-react';/, imports);

content = content.replace(
  /\{\/\* 3D Isometric Container \*\/\}\n\s*<div className="flex-1 relative flex items-center justify-center \[perspective:1200px\] mt-8">/,
  `{/* 3D Isometric Container */}
      <div className="flex-1 relative flex items-center justify-center [perspective:1200px] mt-8 overflow-hidden rounded-2xl">
        
        {/* Hologram Canvas Background */}
        <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
            <DigitalTwinTerrain isSimulating={isSimulating} />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>
        </div>`
);

content = content.replace(
  /<div className="relative w-full max-w-4xl h-48 flex justify-between items-center transition-all duration-1000 \[transform-style:preserve-3d\] \[transform:rotateX\(60deg\)_rotateZ\(-25deg\)\]">/,
  `<div className="relative w-full max-w-4xl h-48 flex justify-between items-center transition-all duration-1000 [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-25deg)] z-20">`
);

fs.writeFileSync('src/components/demo/Geological3DVisualizer.jsx', content);
