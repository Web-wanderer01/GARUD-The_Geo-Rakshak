import React, { useRef, useState } from 'react';
import { Mountain, Droplets, ArrowDownRight, ArrowDown } from 'lucide-react';
import FadeIn from '../common/FadeIn';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function TerrainModel({ isSimulating }) {
  const slideRef = useRef();
  
  // Animation hook for the landslide mesh
  useFrame((state, delta) => {
    if (isSimulating && slideRef.current) {
      // Animate sliding down and forward
      if (slideRef.current.position.y > -0.5) {
        slideRef.current.position.y -= delta * 0.4; // Slide down
        slideRef.current.position.x -= delta * 0.2; // Slide forward/left
        slideRef.current.rotation.z += delta * 0.1; // Slight tilt
      }
    } else if (!isSimulating && slideRef.current) {
      // Reset position
      slideRef.current.position.y = 0;
      slideRef.current.position.x = 0;
      slideRef.current.rotation.z = 0;
    }
  });

  return (
    <group position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]}>
      {/* Stable Bedrock */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      
      {/* Stable Terrain Backing */}
      <mesh position={[1, 0.5, -1]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* The Landslide Wedge (Detaches and slides) */}
      <mesh ref={slideRef} position={[0, 0, 0]}>
        {/* Simple wedge geometry made from a stretched box, rotated */}
        <boxGeometry args={[1.9, 1.2, 1.9]} />
        <meshStandardMaterial 
          color={isSimulating ? "#78350f" : "#451a03"} 
          roughness={0.7} 
          metalness={0.1}
        />
        {/* Grass Top */}
        <mesh position={[0, 0.61, 0]}>
          <boxGeometry args={[1.9, 0.05, 1.9]} />
          <meshStandardMaterial color="#166534" roughness={1} />
        </mesh>
      </mesh>
      
      {/* Rain effect (particle proxy) */}
      {isSimulating && (
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[4, 0.1, 4]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

export default function LandslideMechanics3D({ isSimulating }) {
  return (
    <FadeIn>
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Mountain className="text-amber-500 w-5 h-5" />
          <h3 className="text-white font-bold tracking-wide">GEOLOGICAL FAILURE MECHANICS</h3>
          <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-mono border border-blue-500/30">
            Powered by React Three Fiber
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* True 3D WebGL Canvas */}
          <div className="w-full md:w-1/2 min-h-[300px] bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden cursor-move">
            <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <TerrainModel isSimulating={isSimulating} />
              <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              <OrbitControls enableZoom={false} autoRotate={!isSimulating} autoRotateSpeed={0.5} />
            </Canvas>
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
              [DRAG TO ROTATE 3D MODEL]
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
             <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSimulating ? 'bg-blue-900/50 text-blue-400 border border-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                   <h4 className={`font-bold ${isSimulating ? 'text-blue-400' : 'text-slate-400'}`}>1. Soil Saturation</h4>
                   <p className="text-sm text-slate-400 mt-1">
                     Heavy precipitation rapidly infiltrates the porous topsoil, displacing air in the soil matrix. The water increases the internal pore pressure, acting as a lubricant.
                   </p>
                </div>
             </div>

             <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSimulating ? 'bg-red-900/50 text-red-400 border border-red-500' : 'bg-slate-800 text-slate-500'}`} style={{ transitionDelay: '1s' }}>
                  <ArrowDown className="w-5 h-5" />
                </div>
                <div>
                   <h4 className={`font-bold ${isSimulating ? 'text-red-400' : 'text-slate-400'}`}>2. Loss of Shear Strength</h4>
                   <p className="text-sm text-slate-400 mt-1">
                     As pore water pressure rises, the effective stress between soil particles decreases. Friction is lost at the bedrock boundary, creating a critical <strong>Failure Plane</strong>.
                   </p>
                </div>
             </div>

             <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSimulating ? 'bg-orange-900/50 text-orange-400 border border-orange-500' : 'bg-slate-800 text-slate-500'}`} style={{ transitionDelay: '2s' }}>
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                   <h4 className={`font-bold ${isSimulating ? 'text-orange-400' : 'text-slate-400'}`}>3. Gravitational Slide</h4>
                   <p className="text-sm text-slate-400 mt-1">
                     The gravitational force acting on the saturated mass now exceeds the resisting shear strength. The entire structural block detaches and accelerates downslope.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
