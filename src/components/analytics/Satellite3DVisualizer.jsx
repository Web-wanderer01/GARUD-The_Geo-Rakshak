import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Activity, AlertTriangle, Layers, Maximize2, MapPin } from 'lucide-react';
import { fetchDEMTile, getSatelliteTileUrl } from '../../services/TerrainService';

const TerrainMesh = ({ threatLevel, isScanning, onZoneClick, centerLat = 25.57, centerLng = 92.5, mode = 'ELEVATION' }) => {
  const meshRef = useRef();
  const [terrainData, setTerrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [texture, setTexture] = useState(null);

  // Fetch DEM Data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDEMTile(centerLat, centerLng, 11).then(data => {
      if (!mounted) return;
      setTerrainData(data);
      const texUrl = getSatelliteTileUrl(centerLat, centerLng, 11);
      new THREE.TextureLoader().load(
        texUrl,
        (tex) => {
          if (mounted) {
            setTexture(tex);
            setLoading(false);
          }
        },
        undefined,
        (err) => {
          console.error("Failed to load texture", err);
          if (mounted) setLoading(false);
        }
      );
    }).catch(e => {
      console.error("Failed to load DEM", e);
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [centerLat, centerLng]);

  // Construct Geometry when data arrives
  const { positions, colors, size, segments } = useMemo(() => {
    if (!terrainData) return { positions: new Float32Array(), colors: new Float32Array(), size: 40, segments: 1 };
    
    const { elevations, width, height, minElevation, maxElevation } = terrainData;
    const segmentsX = width - 1;
    const segmentsY = height - 1;
    const pos = [];
    const col = [];
    const size = 60; // Render size in Three.js units

    // Elevation scaling
    const elevationScale = 0.005; // exaggerated height
    const baseZ = (minElevation * elevationScale); 

    const activeThreatColor = new THREE.Color(threatLevel === 'critical' ? '#ef4444' : '#f97316');

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const elev = elevations[idx];
        
        // Map grid to -size/2 to size/2
        const posX = (x / segmentsX - 0.5) * size;
        const posY = (y / segmentsY - 0.5) * -size; // Invert Y for correct orientation
        const posZ = elev * elevationScale - baseZ;
        
        pos.push(posX, posY, posZ);

        // Holographic Coloring based on elevation
        const c = new THREE.Color();
        const normElev = (elev - minElevation) / (maxElevation - minElevation || 1);
        
        // Calculate a pseudo-slope by looking at the right and bottom neighbors if available
        let slope = 0;
        if (x < width - 1 && y < height - 1) {
            const elevX = elevations[y * width + (x + 1)];
            const elevY = elevations[(y + 1) * width + x];
            slope = Math.abs(elev - elevX) + Math.abs(elev - elevY);
        }
        
        const normSlope = Math.min(slope / 50, 1.0); // Normalize slope intensity
        
        if (mode === 'SLOPE') {
            if (normSlope < 0.2) c.setHex(0x10b981); // Flat: Emerald
            else if (normSlope < 0.5) c.setHex(0xf59e0b); // Moderate: Amber
            else c.setHex(0xef4444); // Steep: Red
        } else {
            if (normElev < 0.2) c.setHex(0x064e3b); // Low: dark emerald
            else if (normElev < 0.5) c.setHex(0x0891b2); // Mid: cyan
            else if (normElev < 0.8) c.setHex(0x2563eb); // High: blue
            else c.setHex(0x38bdf8); // Peak: bright sky
        }

        // Add risk overlay color if high threat and high elevation
        if (mode === 'RISK' || threatLevel !== 'safe') {
          if (normElev > 0.6 || normSlope > 0.6) {
             c.lerp(activeThreatColor, 0.6);
          }
        }

        col.push(c.r, c.g, c.b);
      }
    }
    
    return { positions: new Float32Array(pos), colors: new Float32Array(col), size, segments: segmentsX };
  }, [terrainData, threatLevel, mode]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const wireframeMesh = meshRef.current.children[1];
      if (wireframeMesh && wireframeMesh.material) {
          wireframeMesh.material.opacity = 0.05 + Math.sin(clock.elapsedTime * 1.5) * 0.03;
      }
    }
  });

  if (loading || !terrainData) {
    return (
      <Html center>
        <div className="text-cyan-400 font-mono text-xs flex flex-col items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          ACQUIRING DEM TELEMETRY...
        </div>
      </Html>
    );
  }

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -5, 0]}>
      
      <group ref={meshRef}>
        {/* Solid Holographic Base */}
        <mesh>
          <planeGeometry args={[size, size, segments, segments]}>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          </planeGeometry>
          {texture ? <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} transparent opacity={0.85} side={THREE.DoubleSide} emissive="#0ea5e9" emissiveIntensity={0.2} /> : <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />}
        </mesh>
        {/* Glowing Wireframe */}
        <mesh position={[0,0,0.05]}>
          <planeGeometry args={[size, size, segments, segments]}>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          </planeGeometry>
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      
      {/* Black backdrop plane */}
      <mesh position={[0,0,-1]}>
        <planeGeometry args={[size * 1.2, size * 1.2, 1, 1]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* Markers / HUD */}
      <Html position={[-15, 10, 5]} center className="pointer-events-none z-0">
         <div className="text-[9px] font-mono text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-cyan-500/30">
           MAX ELEV: {terrainData.maxElevation.toFixed(0)}m
         </div>
      </Html>
      <Html position={[15, -15, 2]} center className="pointer-events-none z-0">
         <div className="text-[9px] font-mono text-blue-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-blue-500/30">
           MIN ELEV: {terrainData.minElevation.toFixed(0)}m
         </div>
      </Html>
      
      {threatLevel !== 'safe' && (
        <group position={[0, 0, 10]}>
           <mesh>
             <ringGeometry args={[1, 1.5, 32]} />
             <meshBasicMaterial color={threatLevel === 'critical' ? '#ef4444' : '#f97316'} side={THREE.DoubleSide} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
           </mesh>
           <Html position={[0, 0, 2]} center>
             <div className="flex flex-col items-center animate-pulse cursor-pointer group" onClick={() => onZoneClick({id: 'ZONE-A'})}>
               <div className={`text-[9px] font-bold font-mono px-2 py-1 rounded border backdrop-blur-md whitespace-nowrap group-hover:scale-110 transition-transform ${
                 threatLevel === 'critical' ? 'text-red-100 bg-red-950/80 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-orange-100 bg-orange-950/80 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
               }`}>
                 HIGH RISK ZONE
               </div>
             </div>
           </Html>
        </group>
      )}

      <Sparkles count={300} scale={size} size={1.5} speed={0.4} opacity={0.6} color="#06b6d4" />
      
      {isScanning && (
        <mesh position={[0, 0, 30]}>
          <cylinderGeometry args={[size/2, size/2, 60, 32, 1, true]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

const FactorBar = ({ label, value }) => {
  const isHigh = value > 70;
  const isMed = value > 40;
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between text-[10px] font-mono mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={isHigh ? 'text-red-400' : isMed ? 'text-orange-400' : 'text-blue-400'}>{value}%</span>
      </div>
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isHigh ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : isMed ? 'bg-orange-500' : 'bg-blue-500'}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function Satellite3DVisualizer({ targetName, threatLevel, isScanning, riskFactors, lat = 25.57, lng = 92.5 }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState('ELEVATION'); // ELEVATION, SLOPE, RISK

  return (
    <div className={`w-full bg-slate-950 rounded-xl overflow-hidden relative mb-6 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)_inset] group transition-all duration-500 ${isExpanded ? 'h-[80vh] fixed inset-4 z-50 rounded-2xl' : 'h-80 md:h-96'}`}>
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm bg-slate-900/80 px-3 py-1.5 rounded backdrop-blur-md border border-slate-700 shadow-sm">
            <Box className="w-4 h-4 text-cyan-400" />
            TERRAIN INTELLIGENCE SYSTEM
          </div>
          <div className="text-cyan-300 text-xs font-mono mt-2 bg-slate-900/80 inline-block px-2 py-1 rounded border border-slate-700 backdrop-blur-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            TARGET: {targetName?.toUpperCase() || 'DIMA HASAO DISTRICT'}
          </div>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <div className="flex bg-slate-900/80 rounded border border-slate-700 p-1 backdrop-blur-md">
            {['ELEVATION', 'SLOPE', 'RISK'].map(m => (
              <button 
                key={m} 
                onClick={() => setMode(m)}
                className={`text-[9px] font-mono px-2 py-1 rounded ${mode === m ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-slate-900/80 p-2 rounded backdrop-blur-md border border-slate-700 shadow-sm text-slate-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom HUD - Status */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="text-[10px] text-slate-400 font-mono mb-1">DATA SOURCES</div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-emerald-900/50"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> DEM DATA READY</span>
          <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-emerald-900/50"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> GPS STREAM</span>
          <span className="text-[9px] text-blue-400 font-mono flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-blue-900/50"><Activity className="w-3 h-3" /> ORBITAL SYNC</span>
        </div>
      </div>

      {/* RISK ANALYSIS PANEL */}
      {selectedZone && (
        <div className="absolute bottom-4 right-4 w-64 bg-slate-900/90 border border-slate-700 p-4 rounded-xl backdrop-blur-md shadow-2xl z-20 animate-fade-in">
           <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
             <div className="flex items-center gap-2">
               <AlertTriangle className={`w-4 h-4 ${threatLevel === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />
               <h4 className="text-white text-xs font-bold font-mono tracking-wider">RISK ANALYSIS</h4>
             </div>
             <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white">&times;</button>
           </div>
           
           <div className="mb-4">
             <div className="text-[10px] text-slate-400 font-mono">ZONE ID: <span className="text-white">{selectedZone.id}</span></div>
             <div className="text-[10px] text-slate-400 font-mono mt-1">RISK LEVEL: 
               <span className={`ml-2 px-2 py-0.5 rounded font-bold ${threatLevel === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'}`}>
                 {threatLevel.toUpperCase()}
               </span>
             </div>
           </div>

           <div className="text-[9px] text-slate-500 font-bold mb-2">CONTRIBUTING FACTORS:</div>
           {riskFactors && (
             <>
               <FactorBar label="Slope" value={riskFactors.slope} />
               <FactorBar label="Rainfall" value={riskFactors.rainfall} />
               <FactorBar label="Soil Moisture" value={riskFactors.soilMoisture} />
               <FactorBar label="Displacement" value={riskFactors.displacement} />
             </>
           )}
        </div>
      )}

      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(2,6,23,1)]"></div>

      <div className="absolute inset-0 z-0 cursor-move">
        <Canvas camera={{ position: [0, -25, 40], fov: 45 }}>
          <ambientLight intensity={1.5} color="#e0f2fe" />
          <directionalLight position={[10, 20, 30]} intensity={3.5} color="#38bdf8" />
          <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#818cf8" />
          
          <TerrainMesh threatLevel={threatLevel} isScanning={isScanning} onZoneClick={setSelectedZone} centerLat={lat} centerLng={lng} mode={mode} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={100}
            autoRotate={!isExpanded}
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

    </div>
  );
}
