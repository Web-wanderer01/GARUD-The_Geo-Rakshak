import React, { useMemo, useRef } from 'react';
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
};

export default function Geological3DVisualizer({ isSimulating, dispatchTarget }) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 p-8 relative flex flex-col min-h-[450px] shadow-2xl mb-8">
      <h3 className="text-slate-200 font-bold mb-4 text-center tracking-widest uppercase text-sm flex items-center justify-center gap-2 relative z-20">
        <Map className="w-5 h-5 text-emerald-400" />
        Virtual 3D Scenario & AI Dispatch Engine
      </h3>
      
      {/* 3D Isometric Container */}
      <div className="flex-1 relative flex items-center justify-center [perspective:1200px] mt-8 overflow-hidden rounded-2xl">
        
        {/* Hologram Canvas Background */}
        <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
            <DigitalTwinTerrain isSimulating={isSimulating} />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>
        </div>
        
        {/* The entire scene rotated into an isometric view */}
        <div className="relative w-full max-w-4xl h-48 flex justify-between items-center transition-all duration-1000 [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-25deg)] z-20 mx-auto">
          
          {/* Ground Plane Grid (Decorative) */}
          <div className="absolute inset-0 border border-cyan-500/30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 to-transparent rounded-3xl"
               style={{ backgroundImage: 'linear-gradient(to right, #06b6d433 1px, transparent 1px), linear-gradient(to bottom, #06b6d433 1px, transparent 1px)', backgroundSize: '40px 40px', boxShadow: 'inset 0 0 40px rgba(6,182,212,0.2)' }}>
          </div>

          {/* NODE 1: GIS Ground Sensors */}
          <div className={`relative flex flex-col items-center [transform:translateZ(20px)_rotateZ(25deg)_rotateX(-60deg)] transition-all duration-1000`}>
             <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 flex flex-col items-center justify-center backdrop-blur-sm ${isSimulating ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)]' : 'bg-slate-800/80 border-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.2)]'}`}>
                <Satellite className={`w-8 h-8 mb-1 ${isSimulating ? 'text-cyan-300 animate-pulse' : 'text-cyan-700'}`} />
                <Database className={`w-5 h-5 ${isSimulating ? 'text-cyan-200' : 'text-cyan-800'}`} />
             </div>
             {/* Glowing scanning grid underneath */}
             <div className={`absolute -bottom-10 w-32 h-32 border border-cyan-400/60 rounded-full [transform:rotateX(75deg)] ${isSimulating ? 'animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'opacity-20'}`} style={{ animationDuration: '4s' }}></div>
          </div>

          {/* Connection Line 1 */}
          <div className="flex-1 mx-2 relative h-12 [transform-style:preserve-3d]">
            <div className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded-full ${isSimulating ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-cyan-900/50'}`}>
               {isSimulating && (
                 <div className="w-1/3 h-full bg-white rounded-full animate-[ping_1.5s_linear_infinite]"></div>
               )}
            </div>
          </div>

          {/* NODE 2: AI Core */}
          <div className={`relative flex flex-col items-center [transform:translateZ(40px)_rotateZ(25deg)_rotateX(-60deg)] transition-all duration-1000`}>
             <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center backdrop-blur-md ${isSimulating ? 'bg-indigo-950/90 border-indigo-400 shadow-[0_0_50px_rgba(99,102,241,1)]' : 'bg-slate-800 border-indigo-900 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
                <Cpu className={`w-12 h-12 md:w-16 md:h-16 ${isSimulating ? 'text-indigo-300 animate-bounce' : 'text-indigo-800'}`} />
             </div>
             {isSimulating && (
               <>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[2px] border-indigo-400/60 rounded-full animate-ping" style={{ animationDuration: '1.5s' }}></div>
                 <Zap className="absolute -top-6 -right-6 text-indigo-300 w-8 h-8 animate-pulse drop-shadow-[0_0_10px_#818cf8]" />
               </>
             )}
          </div>

          {/* Connection Line 2 */}
          <div className="flex-1 mx-2 relative h-12 [transform-style:preserve-3d]">
            <div className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded-full ${isSimulating ? 'bg-blue-400 shadow-[0_0_15px_#60a5fa]' : 'bg-blue-900/50'}`}>
               {isSimulating && (
                 <div className="w-1/3 h-full bg-white rounded-full animate-[ping_1s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
               )}
            </div>
          </div>

          {/* NODE 3: Broadcast Tower & Citizens */}
          <div className={`relative flex flex-col items-center [transform:translateZ(60px)_rotateZ(25deg)_rotateX(-60deg)] transition-all duration-1000`}>
             <div className={`w-24 h-24 md:w-28 md:h-28 rounded-lg border-2 flex items-center justify-center backdrop-blur-sm ${isSimulating ? 'bg-blue-950/80 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,1)]' : 'bg-slate-800 border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}>
                <Radio className={`w-10 h-10 md:w-12 md:h-12 ${isSimulating ? 'text-blue-200 animate-pulse' : 'text-blue-800'}`} />
             </div>
             
             {/* Radiating Broadcast Waves */}
             {isSimulating && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="absolute w-40 h-40 border-2 border-blue-400/80 rounded-full animate-ping shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ animationDuration: '2s' }}></div>
                 <div className="absolute w-64 h-64 border-2 border-blue-400/50 rounded-full animate-ping shadow-[0_0_20px_rgba(59,130,246,0.3)]" style={{ animationDuration: '2s', animationDelay: '0.6s' }}></div>
                 <div className="absolute w-96 h-96 border-2 border-blue-400/30 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1.2s' }}></div>
                 
                 {/* Floating Phones receiving alerts */}
                 <div className="absolute -top-24 right-10 flex flex-col items-center animate-bounce" style={{ animationDelay: '0.1s' }}>
                   <Smartphone className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_15px_#67e8f9]" />
                   <Wifi className="w-3 h-3 text-cyan-200 mt-1 animate-pulse" />
                 </div>
                 <div className="absolute -bottom-24 left-10 flex flex-col items-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                   <Smartphone className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_15px_#67e8f9]" />
                   <Wifi className="w-4 h-4 text-cyan-200 mt-1 animate-pulse" />
                 </div>
                 <div className="absolute top-10 -left-20 flex flex-col items-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                   <Smartphone className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_15px_#67e8f9]" />
                   <Wifi className="w-3 h-3 text-cyan-200 mt-1 animate-pulse" />
                 </div>
               </div>
             )}
          </div>
          
        </div>
      </div>
      
      {/* Legend / Labels below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-20 relative z-20">
         <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] backdrop-blur-md">
            <h4 className="text-cyan-400 font-bold mb-2 flex items-center justify-center gap-2 tracking-wide">
              <span className="bg-cyan-900 text-cyan-200 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-cyan-400">1</span>
              GIS Ground Sensors
            </h4>
            <p className="text-xs text-cyan-100/70">Continuous telemetry collection from IoT sensors (soil moisture, rainfall, seismic activity)</p>
         </div>
         <div className="bg-slate-900/60 p-4 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] backdrop-blur-md">
            <h4 className="text-indigo-400 font-bold mb-2 flex items-center justify-center gap-2 tracking-wide">
              <span className="bg-indigo-900 text-indigo-200 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-indigo-400">2</span>
              AI Analysis Core
            </h4>
            <p className="text-xs text-indigo-100/70">Real-time risk computation, emergency scenario mapping, and automated protocol activation</p>
         </div>
         <div className="bg-slate-900/60 p-4 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-md">
            <h4 className="text-blue-400 font-bold mb-2 flex items-center justify-center gap-2 tracking-wide">
              <span className="bg-blue-900 text-blue-200 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-blue-400">3</span>
              Mass Dissemination
            </h4>
            <p className="text-xs text-blue-100/70">
              Multilingual SMS & Email routed to {dispatchTarget === 'all' ? <strong className="text-cyan-300">EVERY CITIZEN</strong> : <strong className="text-cyan-300">AFFECTED DISTRICT</strong>}
            </p>
         </div>
      </div>
    </div>
  );
}
