import React, { useState, useEffect } from 'react';
import { Activity, Droplets, Wind, AlertTriangle, Cpu, Radio, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import SensorsPage from './SensorsPage';

// Simulate generating timeseries data
const generateData = (length, min, max, volatility = 5) => {
  let data = [];
  let current = min + (max - min) / 2;
  for (let i = length; i >= 0; i--) {
    const time = new Date(Date.now() - i * 1000).toLocaleTimeString([], { hour12: false });
    data.push({ time, value: current });
    current = Math.max(min, Math.min(max, current + (Math.random() - 0.5) * volatility));
  }
  return data;
};

export default function IoTDashboardPage() {
  const [soilData, setSoilData] = useState(generateData(30, 40, 85, 3));
  const [tiltData, setTiltData] = useState(generateData(30, 0, 15, 0.5));
  const [porePressure, setPorePressure] = useState(generateData(30, 10, 60, 2));

  // Live simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString([], { hour12: false });
      
      setSoilData(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(40, Math.min(85, last + (Math.random() - 0.5) * 3));
        return [...prev.slice(1), { time, value: next }];
      });
      
      setTiltData(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(0, Math.min(15, last + (Math.random() - 0.5) * 0.5));
        return [...prev.slice(1), { time, value: next }];
      });

      setPorePressure(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(10, Math.min(60, last + (Math.random() - 0.5) * 2));
        return [...prev.slice(1), { time, value: next }];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentSoil = soilData[soilData.length - 1].value;
  const currentTilt = tiltData[tiltData.length - 1].value;
  
  const getStatusColor = (val, threshold, highIsBad = true) => {
    if (highIsBad) {
      if (val > threshold * 0.9) return 'text-red-500 bg-red-50';
      if (val > threshold * 0.7) return 'text-amber-500 bg-amber-50';
      return 'text-green-500 bg-green-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            IoT Telemetry Node #N-402
          </h1>
          <p className="text-slate-700">Live hardware digital twin for NH-6 Deployment (Sonapur)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text--600 border border-green-200 rounded-lg text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sensors Online
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text--600 border border-blue-200 rounded-lg text-sm font-medium">
            <Radio className="w-4 h-4" />
            LoRaWAN Link
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Soil Moisture
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(currentSoil, 80)}`}>
              {currentSoil > 80 ? 'CRITICAL' : currentSoil > 60 ? 'WARNING' : 'NORMAL'}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-4">{currentSoil.toFixed(1)}<span className="text-lg text-slate-700 font-medium ml-1">%</span></p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilData}>
                <defs>
                  <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSoil)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Inclinometer (Tilt)
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(currentTilt, 10)}`}>
              {currentTilt > 10 ? 'MOVEMENT DETECTED' : 'STABLE'}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-4">{currentTilt.toFixed(2)}<span className="text-lg text-slate-700 font-medium ml-1">°</span></p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tiltData}>
                <defs>
                  <linearGradient id="colorTilt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorTilt)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-slate-900">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Edge AI Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 mb-1">Local Prediction Model</p>
              <div className="flex justify-between items-end">
                <span className="font-mono text-emerald-600">RandomForest_v2</span>
                <span className="text-xs text-slate-700">24ms inference</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-1">Failure Probability (Next 1h)</p>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-right text-xs font-mono text--600">45.2%</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-700 font-mono">Last payload: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Regional Sensor Grid</h2>
        <SensorsPage />
      </section>
    </div>
  );
}
