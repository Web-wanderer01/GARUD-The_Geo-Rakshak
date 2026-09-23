import React, { useState, useEffect } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import { Radio, Activity, Battery, Wifi, AlertTriangle } from 'lucide-react';

const SENSORS = [
  { id:'AC-001', loc:'Jaintia Hills',      state:'Meghalaya',     status:'WARNING',  vib:67, temp:19.2, hum:84, soil:71, bat:78, sig:3 },
  { id:'AC-002', loc:'NH-29 Dimapur',      state:'Nagaland',      status:'NOMINAL',  vib:23, temp:21.5, hum:72, soil:45, bat:91, sig:4 },
  { id:'AC-003', loc:'West Kameng',        state:'Arunachal',     status:'CRITICAL', vib:94, temp:14.8, hum:91, soil:88, bat:62, sig:2 },
  { id:'AC-004', loc:'Dima Hasao',         state:'Assam',         status:'WARNING',  vib:78, temp:22.1, hum:88, soil:79, bat:54, sig:3 },
  { id:'AC-005', loc:'Churachandpur',      state:'Manipur',       status:'NOMINAL',  vib:31, temp:20.4, hum:76, soil:52, bat:88, sig:4 },
  { id:'AC-006', loc:'Champhai',           state:'Mizoram',       status:'NOMINAL',  vib:18, temp:18.9, hum:68, soil:41, bat:95, sig:5 },
  { id:'AC-007', loc:'North Sikkim',       state:'Sikkim',        status:'WARNING',  vib:72, temp:11.2, hum:93, soil:82, bat:71, sig:3 },
  { id:'AC-008', loc:'NH-10 Rangpo',       state:'Sikkim',        status:'CRITICAL', vib:96, temp:16.7, hum:87, soil:91, bat:45, sig:2 },
  { id:'AC-009', loc:'Khonsa',             state:'Arunachal',     status:'NOMINAL',  vib:41, temp:17.3, hum:79, soil:58, bat:82, sig:4 },
  { id:'AC-010', loc:'Barpeta',            state:'Assam',         status:'WARNING',  vib:65, temp:24.6, hum:81, soil:68, bat:67, sig:3 },
  { id:'AC-011', loc:'Ukhrul',             state:'Manipur',       status:'NOMINAL',  vib:27, temp:18.1, hum:74, soil:49, bat:90, sig:4 },
  { id:'AC-012', loc:'Serchhip',           state:'Mizoram',       status:'NOMINAL',  vib:12, temp:19.8, hum:70, soil:38, bat:97, sig:5 },
  { id:'AC-013', loc:'East Jaintia Hills', state:'Meghalaya',     status:'WARNING',  vib:81, temp:20.9, hum:89, soil:76, bat:58, sig:2 },
  { id:'AC-014', loc:'Zunheboto',          state:'Nagaland',      status:'NOMINAL',  vib:35, temp:17.6, hum:77, soil:55, bat:85, sig:4 },
  { id:'AC-015', loc:'Mangan',             state:'Sikkim',        status:'CRITICAL', vib:89, temp:13.4, hum:92, soil:87, bat:41, sig:2 },
  { id:'AC-016', loc:'Tawang',             state:'Arunachal',     status:'NOMINAL',  vib:44, temp:9.1,  hum:82, soil:61, bat:79, sig:3 },
];

const LORA_GW = [
  { id:'LR-GW-01', loc:'Guwahati Hub',    pkt:12847, loss:1.2, solar:94, up:'14d 6h' },
  { id:'LR-GW-02', loc:'Shillong Node',   pkt:8234,  loss:3.8, solar:87, up:'9d 2h' },
  { id:'LR-GW-03', loc:'Imphal Gateway',  pkt:6712,  loss:7.1, solar:71, up:'6d 14h' },
  { id:'LR-GW-04', loc:'Aizawl Relay',    pkt:9104,  loss:2.4, solar:88, up:'11d 8h' },
  { id:'LR-GW-05', loc:'Itanagar Node',   pkt:4321,  loss:14.6,solar:55, up:'3d 19h' },
  { id:'LR-GW-06', loc:'Gangtok Alpine',  pkt:7890,  loss:4.9, solar:79, up:'8d 11h' },
];

const STATUS_STYLE = {
  NOMINAL:  { card:'border-green-200  bg-green-50',  badge:'bg-green-50  text--600  border-green-200',  dot:'bg-green-400' },
  WARNING:  { card:'border-amber-200  bg-amber-50',  badge:'bg-amber-50  text--600  border-amber-200',  dot:'bg-amber-400' },
  CRITICAL: { card:'border-red-200    bg-red-50',    badge:'bg-red-50    text--600    border-red-200 animate-pulse', dot:'bg-red-400 animate-pulse' },
};

export default function SensorsPage() {
  const [sensors, setSensors] = useState(SENSORS);
  const [log, setLog]         = useState([]);
  const [wavePhase, setWavePhase] = useState(0);
  const logRef = React.useRef(null);

  // Live sensor updates every 2s
  useEffect(() => {
    const t = setInterval(() => {
      setSensors(prev => {
        const next = [...prev];
        const idxs = [Math.floor(Math.random()*16), Math.floor(Math.random()*16)];
        idxs.forEach(i => {
          const newVib = Math.max(5, Math.min(100, next[i].vib + (Math.random()*10-5)));
          next[i] = { ...next[i], vib: Math.round(newVib),
            status: newVib > 85 ? 'CRITICAL' : newVib > 60 ? 'WARNING' : 'NOMINAL' };
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // MQTT log stream every 1.5s
  useEffect(() => {
    const t = setInterval(() => {
      const s = SENSORS[Math.floor(Math.random()*SENSORS.length)];
      const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const line = `[${now}] [${s.id}] temp=${(s.temp+(Math.random()-.5)).toFixed(1)}°C soil=${s.soil}% vib=${(s.vib/100+Math.random()*.1).toFixed(2)}g freq=${(8+Math.random()*12).toFixed(1)}Hz bat=${s.bat}%`;
      setLog(prev => [...prev.slice(-19), line]);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  // Waveform animation
  useEffect(() => {
    const t = setInterval(() => setWavePhase(p => p + 0.15), 50);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll log
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [log]);

  const hasCritical = sensors.some(s => s.status === 'CRITICAL');
  const waveColor = hasCritical ? '#ef4444' : sensors.some(s=>s.status==='WARNING') ? '#f59e0b' : '#3b82f6';

  const buildWave = () => {
    const pts = [];
    for (let x = 0; x <= 800; x += 4) {
      const amp = hasCritical ? 30 + Math.random()*20 : 12 + Math.random()*4;
      const freq = hasCritical ? 0.06 : 0.03;
      const y = 50 + amp * Math.sin(x * freq + wavePhase) + (hasCritical ? (Math.random()-0.5)*15 : 0);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="light-dashboard page-enter relative pb-10 bg-slate-50 min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">

        <FadeIn direction="down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">📡 Sensor Telemetry</h1>
              <p className="text-slate-700 text-sm">LoRaWAN & Acoustic Early-Warning Network · NER Region</p>
            </div>
            <div className="flex gap-4 text-sm">
              {['NOMINAL','WARNING','CRITICAL'].map(s => (
                <span key={s} className={`px-3 py-1 rounded-full border text-xs font-bold ${STATUS_STYLE[s].badge}`}>
                  {sensors.filter(x=>x.status===s).length} {s}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Acoustic Waveform */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">🔊 Acoustic Waveform Monitor — NH-10 Corridor</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${hasCritical ? 'bg-red-50 text--600 animate-pulse' : 'bg-blue-50 text--600'}`}>
                {hasCritical ? '⚠ ANOMALY DETECTED' : '● MONITORING'}
              </span>
            </div>
            <svg width="100%" height="100" viewBox="0 0 800 100" preserveAspectRatio="none" className="rounded-lg bg-black/40 border border-slate-200">
              <polyline points={buildWave()} fill="none" stroke={waveColor} strokeWidth="2" />
            </svg>
            <div className="grid grid-cols-3 gap-4 mt-3">
              {[
                { label:'Dominant Freq', value: hasCritical ? '18.7 Hz' : '8.3 Hz' },
                { label:'Peak Amplitude', value: hasCritical ? '0.94g' : '0.21g' },
                { label:'Events Today', value: hasCritical ? '14' : '3' },
              ].map(s => (
                <div key={s.label} className="text-center bg-white rounded-xl p-3 border border-slate-200">
                  <div className={`text-lg font-black ${hasCritical ? 'text--600' : 'text--600'}`}>{s.value}</div>
                  <div className="text-xs text-slate-700">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Sensor Grid */}
        <FadeIn>
          <h2 className="text-lg font-bold text-slate-900">Sensor Grid Matrix</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sensors.map(s => {
              const st = STATUS_STYLE[s.status];
              return (
                <div key={s.id} className={`rounded-xl border p-3 ${st.card}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-700">{s.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${st.badge}`}>{s.status}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">{s.loc}</div>
                  <div className="text-xs text-slate-700 mb-2">{s.state}</div>
                  <div className="mb-1">
                    <div className="flex justify-between text-xs text-slate-700 mb-0.5"><span>Vibration</span><span className="font-mono text-slate-900">{s.vib}/100</span></div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width:`${s.vib}%`, background: s.vib>85?'#ef4444':s.vib>60?'#f59e0b':'#3b82f6' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-700 mt-2">
                    <span>🌡 {s.temp}°C</span><span>💧 {s.hum}%</span><span>🌱 {s.soil}%</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Battery className="w-3 h-3 text-slate-700" />
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width:`${s.bat}%`, background:s.bat<25?'#ef4444':s.bat<50?'#f59e0b':'#10b981' }} />
                    </div>
                    <span className="text-[10px] text-slate-700">{s.bat}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* LoRa Gateway Health */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4">📶 LoRa Gateway Health</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-700 uppercase border-b border-slate-300/50">
                  <th className="text-left pb-2">Gateway</th><th className="text-left pb-2">Location</th>
                  <th className="text-right pb-2">Packets</th><th className="text-right pb-2">Loss %</th>
                  <th className="text-right pb-2">Solar</th><th className="text-right pb-2">Uptime</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-700/30">
                  {LORA_GW.map(gw => (
                    <tr key={gw.id} className="hover:bg-white/5">
                      <td className="py-2 font-mono text-xs text--600">{gw.id}</td>
                      <td className="py-2 text-slate-700">{gw.loc}</td>
                      <td className="py-2 text-right text-slate-200">{gw.pkt.toLocaleString()}</td>
                      <td className={`py-2 text-right font-bold ${gw.loss<5?'text--600':gw.loss<15?'text--600':'text--600'}`}>{gw.loss}%</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-yellow-400" style={{width:`${gw.solar}%`}} /></div>
                          <span className="text-xs text-slate-700">{gw.solar}%</span>
                        </div>
                      </td>
                      <td className="py-2 text-right text-slate-700 text-xs">{gw.up}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* MQTT Log */}
        <FadeIn>
          <div className="bg-black/80 backdrop-blur rounded-2xl border border-green-200 p-4">
            <h2 className="text-sm font-bold text--600 mb-3 uppercase tracking-wider font-mono">▶ MQTT Telemetry Stream</h2>
            <div ref={logRef} className="h-40 overflow-y-auto font-mono text-xs text--600 space-y-0.5 leading-relaxed">
              {log.length === 0 ? <span className="text-green-600">Connecting to broker...</span> : log.map((l,i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
