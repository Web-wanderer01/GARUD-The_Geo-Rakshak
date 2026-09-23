const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// 1. Add terminalContainerRef
content = content.replace('const logsEndRef = useRef(null);', 'const logsEndRef = useRef(null);\n  const terminalContainerRef = useRef(null);');

// 2. Change useEffect to use scrollTop
const oldUseEffect = `  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);`;

const newUseEffect = `  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, progress]);`;

content = content.replace(oldUseEffect, newUseEffect);

// 3. Attach ref to container
content = content.replace('<div className="flex-1 p-6 overflow-y-auto text-sm">', '<div ref={terminalContainerRef} className="flex-1 p-6 overflow-y-auto text-sm">');

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
