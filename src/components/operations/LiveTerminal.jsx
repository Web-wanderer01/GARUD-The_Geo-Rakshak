import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export default function LiveTerminal() {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  const generateLog = () => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const systems = ['SAT-LINK', 'MET-SERVER', 'SENSOR-GRID', 'SDRF-NET', 'AI-CORE', 'GEO-SYNC'];
    const actions = [
      'Synchronizing telemetry data...',
      'Handshake established with IMD-Node-4',
      'Scanning for anomaly spikes in Zone-B',
      'Decrypting field report payloads...',
      'Updating probabilistic risk models',
      'Heartbeat OK',
      'Rerouting bandwidth to critical sector',
      'Soil moisture reading nominal',
      'Seismic tremor baseline calculated'
    ];
    
    const sys = systems[Math.floor(Math.random() * systems.length)];
    const act = actions[Math.floor(Math.random() * actions.length)];
    const isWarn = Math.random() > 0.85;
    const isCrit = Math.random() > 0.95;
    
    let color = 'text-green-400';
    if (isWarn) color = 'text-yellow-400';
    if (isCrit) color = 'text-red-400';

    return {
      id: Math.random().toString(),
      text: `[${timestamp}] [${sys}] ${isCrit ? 'CRITICAL: ' : ''}${isWarn && !isCrit ? 'WARN: ' : ''}${act}`,
      color
    };
  };

  const containerRef = useRef(null);

  useEffect(() => {
    // Initial logs
    const initial = [];
    for(let i=0; i<8; i++) initial.push(generateLog());
    setLogs(initial);

    // Stream new logs
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
        return newLogs;
      });
    }, 1500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full font-mono">
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 text-sm">
          <Terminal className="w-4 h-4 text-blue-400" />
          SYSTEM.LOG.STREAM
        </h3>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
      
      <div ref={containerRef} className="p-4 flex-1 overflow-y-auto max-h-[300px] text-xs space-y-1 scroll-smooth">
        {logs.map(log => (
          <div key={log.id} className={`${log.color}`}>
            <span className="opacity-50 mr-2">{'>'}</span> 
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
}
