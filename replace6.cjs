const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/Satellite3DVisualizer.jsx', 'utf8');

content = content.replace(
`  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.5 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
  });`,
`  useFrame(({ clock }) => {
    if (meshRef.current) {
      // meshRef is now a group containing two meshes
      const wireframeMesh = meshRef.current.children[1];
      if (wireframeMesh && wireframeMesh.material) {
          wireframeMesh.material.opacity = 0.15 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
      }
    }
  });`
);

fs.writeFileSync('src/components/analytics/Satellite3DVisualizer.jsx', content);
