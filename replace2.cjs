const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/Satellite3DVisualizer.jsx', 'utf8');

// Replace the color generation loop
const newColorLogic = `
        const c = new THREE.Color();
        // Base satellite imagery colors based on elevation (z) and slope
        if (z < 1) {
            c.setHex(0x2d4c1e); // Dense forest green
        } else if (z < 3) {
            c.setHex(0x4a5d23); // Lighter vegetation
        } else if (z < 6) {
            c.setHex(0x8b7355); // Rocky brown/dirt
        } else {
            c.setHex(0xdcdcdc); // Snow/ice caps on peaks
        }
        
        // Darken steep slopes to simulate shadows/cliffs
        if (slope > 0.5) {
            c.lerp(new THREE.Color('#1a1a1a'), 0.4);
        }

        // Apply Holographic Risk Overlay
        if (slope > 0.6 && threatLevel !== 'safe') {
           // Blend the risk color on top of the satellite imagery
           c.lerp(activeThreatColor, 0.7);
        }
`;

content = content.replace(/const c = new THREE\.Color\('#06b6d4'\);[\s\S]*?col\.push\(c\.r, c\.g, c\.b\);/, newColorLogic + '\n        col.push(c.r, c.g, c.b);');

fs.writeFileSync('src/components/analytics/Satellite3DVisualizer.jsx', content);
