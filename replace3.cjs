const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/Satellite3DVisualizer.jsx', 'utf8');

const replacement = `
      <group ref={meshRef}>
        {/* Solid Satellite Imagery Base */}
        <mesh>
          <planeGeometry args={[size, size, segments, segments]}>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          </planeGeometry>
          <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Holographic Wireframe Overlay */}
        <mesh position={[0,0,0.01]}>
          <planeGeometry args={[size, size, segments, segments]}>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          </planeGeometry>
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
`;

content = content.replace(/<mesh ref=\{meshRef\}>[\s\S]*?<\/mesh>/, replacement);

fs.writeFileSync('src/components/analytics/Satellite3DVisualizer.jsx', content);
