import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Sparkles, Html } from '@react-three/drei';
import { fetchDEMTile, lat2tile, lon2tile, getSatelliteTileUrl } from '../../services/TerrainService';

// Reusable Mini Terrain Geometry & Material generator
const MiniTerrainMesh = ({ colorTheme, wireframeOpacity = 0.6, lat = 25.57, lng = 92.5 }) => {
  const [terrainData, setTerrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDEMTile(lat, lng, 10).then(data => {
      if (!mounted) return;
      setTerrainData(data);
      const texUrl = getSatelliteTileUrl(lat, lng, 10);
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
          console.error("Failed to load mini texture", err);
          if (mounted) setLoading(false);
        }
      );
    }).catch(e => {
      console.error("Failed to load DEM for mini mesh", e);
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [lat, lng]);

  const { positions, colors, size, segments } = useMemo(() => {
    if (!terrainData) return { positions: new Float32Array(), colors: new Float32Array(), size: 30, segments: 1 };
    
    const { elevations, width, height, minElevation, maxElevation } = terrainData;
    const segmentsX = width - 1;
    const segmentsY = height - 1;
    const pos = [];
    const col = [];
    const size = 30; // Mini size

    const elevationScale = 0.005;
    const baseZ = (minElevation * elevationScale); 
    
    let baseColor = new THREE.Color('#06b6d4'); // Default cyan
    if (colorTheme === 'red') baseColor = new THREE.Color('#ef4444');
    if (colorTheme === 'orange') baseColor = new THREE.Color('#f97316');
    if (colorTheme === 'blue') baseColor = new THREE.Color('#3b82f6');
    if (colorTheme === 'green') baseColor = new THREE.Color('#10b981');

    for (let y = 0; y < height; y+=8) { // Downsample for performance (256/8 = 32 segments)
      for (let x = 0; x < width; x+=8) {
        const idx = y * width + x;
        const elev = elevations[idx];
        
        const posX = (x / segmentsX - 0.5) * size;
        const posY = (y / segmentsY - 0.5) * -size; 
        const posZ = elev * elevationScale - baseZ;
        
        pos.push(posX, posY, posZ);
        
        const c = baseColor.clone();
        const normElev = (elev - minElevation) / (maxElevation - minElevation || 1);
        if (normElev > 0.6) c.lerp(new THREE.Color('#ffffff'), 0.3);
        col.push(c.r, c.g, c.b);
      }
    }
    
    return { positions: new Float32Array(pos), colors: new Float32Array(col), size, segments: Math.floor(width/8) };
  }, [terrainData, colorTheme]);

  if (loading || !terrainData) return null;

  return (
    <group rotation={[-Math.PI / 2.5, 0, Math.PI / 8]} position={[0, -2, 0]}>
      <mesh>
        <planeGeometry args={[size, size, segments-1, segments-1]}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </planeGeometry>
        {texture ? <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} transparent opacity={0.85} side={THREE.DoubleSide} emissive={colorTheme} emissiveIntensity={0.2} /> : <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />}
      </mesh>
      {/* Wireframe Overlay */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[size, size, segments-1, segments-1]}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </planeGeometry>
        <meshBasicMaterial color={colorTheme} wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

// 1. Surface Displacement Scene
const SurfaceScene = ({ isScanning, lat, lng, isExpanded }) => {
  const groupRef = useRef();
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (!isExpanded) groupRef.current.rotation.y = clock.elapsedTime * 0.1;
      
      if (isScanning) {
        groupRef.current.position.x = Math.sin(clock.elapsedTime * 20) * 0.2;
        groupRef.current.position.y = Math.cos(clock.elapsedTime * 15) * 0.2;
      } else {
        groupRef.current.position.lerp(new THREE.Vector3(0,0,0), 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <MiniTerrainMesh colorTheme="red" wireframeOpacity={isScanning ? 0.9 : 0.4} lat={lat} lng={lng} />
      
      {isScanning && (
        <mesh position={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[40, 40, 10, 10]} />
          <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

export const SurfaceDisplacement3D = ({ displacement, isScanning, lat, lng, isExpanded }) => (
  <div className="absolute inset-0 bg-slate-900 overflow-hidden cursor-crosshair">
    <Canvas camera={{ position: [0, 5, 20], fov: 40 }}>
      <SurfaceScene isScanning={isScanning} lat={lat} lng={lng} isExpanded={isExpanded} />
      <OrbitControls enableZoom={isExpanded} enablePan={isExpanded} enableRotate={isExpanded} />
    </Canvas>
    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(2,6,23,1)]"></div>
  </div>
);

// 2. Soil Moisture Scene
const MoistureScene = ({ saturation, isScanning, lat, lng, isExpanded }) => {
  const groupRef = useRef();
  const waterRef = useRef();
  const targetWaterZ = -5 + (saturation / 100) * 10;
  
  useFrame(({ clock }) => {
    if (groupRef.current) if (!isExpanded) groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    
    if (waterRef.current) {
      waterRef.current.position.z = THREE.MathUtils.lerp(waterRef.current.position.z, targetWaterZ, 0.05);
      waterRef.current.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.02;
      waterRef.current.rotation.y = Math.cos(clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <MiniTerrainMesh colorTheme="cyan" wireframeOpacity={0.5} lat={lat} lng={lng} />
      
      <group rotation={[-Math.PI / 2.5, 0, Math.PI / 8]} position={[0, -2, 0]}>
        <mesh ref={waterRef} position={[0, 0, -5]}>
          <planeGeometry args={[35, 35, 4, 4]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={isScanning ? 0.8 : 0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
};

export const SoilMoisture3D = ({ saturation, isScanning, lat, lng, isExpanded }) => (
  <div className="absolute inset-0 bg-slate-900 overflow-hidden cursor-crosshair">
    <Canvas camera={{ position: [0, 5, 20], fov: 40 }}>
      <MoistureScene saturation={saturation} isScanning={isScanning} lat={lat} lng={lng} isExpanded={isExpanded} />
      <OrbitControls enableZoom={isExpanded} enablePan={isExpanded} enableRotate={isExpanded} />
    </Canvas>
    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(2,6,23,1)]"></div>
  </div>
);

// 3. Precipitation Scene
const PrecipScene = ({ intensity, isScanning, lat, lng, isExpanded }) => {
  const groupRef = useRef();
  const cloudRef = useRef();
  const particleCount = Math.min(500, Math.max(50, intensity * 5));
  
  useFrame(({ clock }) => {
    if (groupRef.current) if (!isExpanded) groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    if (cloudRef.current) cloudRef.current.rotation.z = clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      <MiniTerrainMesh colorTheme="blue" wireframeOpacity={0.4} lat={lat} lng={lng} />
      
      <mesh ref={cloudRef} position={[0, 8, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      <Sparkles 
        count={isScanning ? particleCount : particleCount / 4} 
        scale={20} 
        size={isScanning ? 6 : 2} 
        speed={isScanning ? 4 : 1} 
        opacity={0.6} 
        color="#60a5fa" 
        position={[0, 2, 0]} 
      />
    </group>
  );
};

export const Precipitation3D = ({ intensity, isScanning, lat, lng, isExpanded }) => (
  <div className="absolute inset-0 bg-slate-900 overflow-hidden cursor-crosshair">
    <Canvas camera={{ position: [0, 5, 20], fov: 40 }}>
      <PrecipScene intensity={intensity} isScanning={isScanning} lat={lat} lng={lng} isExpanded={isExpanded} />
      <OrbitControls enableZoom={isExpanded} enablePan={isExpanded} enableRotate={isExpanded} />
    </Canvas>
    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(2,6,23,1)]"></div>
  </div>
);

// 4. Vegetation / Slope Integrity Scene
const VegetationScene = ({ slopeIntegrity, isScanning, lat, lng, isExpanded }) => {
  const groupRef = useRef();
  
  useFrame(({ clock }) => {
    if (groupRef.current) if (!isExpanded) groupRef.current.rotation.y = clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      <MiniTerrainMesh colorTheme="green" wireframeOpacity={0.6} lat={lat} lng={lng} />
      
      {/* Scanning laser plane */}
      {isScanning && (
        <mesh position={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[40, 2]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

export const SlopeIntegrity3D = ({ slopeIntegrity, isScanning, lat, lng, isExpanded }) => (
  <div className="absolute inset-0 bg-slate-900 overflow-hidden cursor-crosshair">
    <Canvas camera={{ position: [0, 5, 20], fov: 40 }}>
      <VegetationScene slopeIntegrity={slopeIntegrity} isScanning={isScanning} lat={lat} lng={lng} isExpanded={isExpanded} />
      <OrbitControls enableZoom={isExpanded} enablePan={isExpanded} enableRotate={isExpanded} />
    </Canvas>
    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(2,6,23,1)]"></div>
  </div>
);
