const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/Satellite3DVisualizer.jsx', 'utf8');

const lighting = `
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 20, 10]} intensity={2.5} color="#e0f2fe" />
          <directionalLight position={[-10, 10, -10]} intensity={1.0} color="#06b6d4" />
`;

content = content.replace('<ambientLight intensity={0.5} />', lighting);
fs.writeFileSync('src/components/analytics/Satellite3DVisualizer.jsx', content);
