const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add the live polling useEffect
const liveEffect = `  const sirenOscillatorRef = useRef(null);
  const audioCtxRef = useRef(null);

  // REAL-TIME IDLE MONITORING: Make the terminal look constantly active!
  useEffect(() => {
    if (isSimulating) return;
    const interval = setInterval(() => {
      const locations = ['Kohima', 'East Khasi Hills', 'Imphal', 'Tawang', 'Dima Hasao', 'Aizawl', 'Gangtok'];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const events = [
        \`[LIVE SENSOR] Soil Moisture at \${loc}: \${Math.floor(Math.random() * 40 + 30)}% - Stable\`,
        \`[LIVE SENSOR] Slope Angle deviation in \${loc}: +\${(Math.random()*0.3).toFixed(2)}° (Within tolerance)\`,
        \`[LIVE FEED] Rainfall 1h at \${loc}: \${(Math.random()*4).toFixed(1)}mm\`,
        \`[SYSTEM] Heartbeat OK. All 54 regional sensors reporting online.\`,
        \`[LIVE FLEET] Auto-Drone NDRF-\${Math.floor(Math.random()*99)} patrolling \${loc} airspace.\`,
        \`[LIVE SENSOR] Minor micro-seismic activity (1.\${Math.floor(Math.random()*9)}M) near \${loc}. Monitoring...\`,
        \`[LIVE SAT] Processing new L-Band SAR imagery for \${loc}...\`
      ];
      const newLog = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => {
        const next = [...prev, newLog];
        // Keep terminal from getting too long
        if (next.length > 40) return next.slice(next.length - 40);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating]);`;

content = content.replace(/  const sirenOscillatorRef = useRef\(null\);\n  const audioCtxRef = useRef\(null\);/, liveEffect);

// Replace "System idle. Awaiting scenario trigger." with "GARUD Live Intelligence Engine Online"
content = content.replace(/System idle\. Awaiting scenario trigger\./, "GARUD Intelligence Engine Online. Monitoring live telemetry...");

fs.writeFileSync(file, content);
