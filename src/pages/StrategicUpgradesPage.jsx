import React, { useState, useEffect } from 'react';
import { acousticSensors, loraNodes, riverGauges, droneCorridors, uavPoints } from '../data/strategicUpgrades';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Radio, Activity, Waves, Navigation, AlertTriangle, CheckCircle, Battery, ArrowUp, ArrowDown, Minus, Shield, Zap, Globe, Mic, Satellite, Volume2 } from 'lucide-react';

// ── Utilities ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    CRITICAL:   'bg-red-500 text-slate-900 animate-pulse',
    ALERT:      'bg-amber-500 text-slate-900',
    MONITORING: 'bg-blue-500 text-slate-900',
    ACTIVE:     'bg-emerald-500 text-slate-900',
    STANDBY:    'bg-amber-500 text-slate-900',
    LOW_BATTERY:'bg-orange-500 text-slate-900 animate-pulse',
    AIRBORNE:   'bg-cyan-500 text-slate-900',
    RISING:     'bg-red-400 text-slate-900',
    STABLE:     'bg-slate-400 text-slate-900',
    FALLING:    'bg-emerald-400 text-slate-900',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[status] || 'bg-slate-500 text-slate-900'}`}>{status}</span>;
};

const GlowCard = ({ children, className = '', urgent = false }) => (
  <div className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
    urgent
      ? 'border-red-200 bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
      : 'border-blue-200 bg-slate-50 hover:border-blue-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
  } ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, subtitle, color = 'text--600' }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="text-4xl">{icon}</div>
    <div>
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
      <p className="text-slate-700 text-sm mt-1">{subtitle}</p>
    </div>
  </div>
);

// ── Acoustic Sensor Section ──────────────────────────────────────
function AcousticSensorSection() {
  const [sensors, setSensors] = useState(acousticSensors);

  // Simulate live vibration updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(s => ({
        ...s,
        vibration: Math.max(5, Math.min(100, s.vibration + (Math.random() * 6 - 3))),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FadeIn>
      <GlowCard className="mb-8">
        <SectionHeader icon="🔊" title="Sky Eye: Acoustic Landslide Early Warning" subtitle="Real-time vibration sensing on critical NER highway slopes. 15–30 min advance warning before major collapses." color="text--600" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {sensors.map(s => (
            <div key={s.id} className={`rounded-xl p-3 border transition-all ${
              s.status === 'CRITICAL' ? 'border-red-200 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' :
              s.status === 'ALERT'    ? 'border-amber-200 bg-amber-50' :
              'border-slate-600/40 bg-white'
            }`}>
              {s.status === 'CRITICAL' && (
                <div className="text-xs font-black text--600 mb-1 uppercase tracking-widest">⚠ LANDSLIDE WARNING</div>
              )}
              <div className="text-xs font-bold text-slate-900 truncate mb-1">{s.id}: {s.name}</div>
              <div className="text-[10px] text-slate-700 mb-2">{s.highway} · {s.riskZone}</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500" style={{
                    width: `${s.vibration}%`,
                    background: s.vibration > 80 ? '#ef4444' : s.vibration > 60 ? '#f59e0b' : '#3b82f6'
                  }} />
                </div>
                <span className="text-xs font-mono text-slate-900 w-8">{Math.round(s.vibration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-700">{s.frequency} Hz</span>
                <StatusBadge status={s.status} />
              </div>
              <div className="text-[10px] text-slate-700 mt-1">Last event: {s.lastEvent}</div>
            </div>
          ))}
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sensors.map(s => ({ name: s.id, vibration: Math.round(s.vibration), threshold: s.threshold }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b' }} />
              <Bar dataKey="vibration" fill="#f59e0b" radius={[4,4,0,0]} name="Vibration Level" />
              <Bar dataKey="threshold" fill="#ef444430" radius={[4,4,0,0]} name="Alert Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlowCard>
    </FadeIn>
  );
}

// ── LoRaWAN Section ──────────────────────────────────────────────
function LoRaWANSection() {
  const [activePacket, setActivePacket] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePacket(prev => (prev + 1) % loraNodes.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const avgBattery = Math.round(loraNodes.reduce((a,n) => a + n.batteryPct, 0) / loraNodes.length);
  const totalCoverage = loraNodes.reduce((a,n) => a + n.coverageKm * n.coverageKm * Math.PI, 0);
  const activeNodes = loraNodes.filter(n => n.status === 'ACTIVE').length;

  return (
    <FadeIn>
      <GlowCard className="mb-8">
        <SectionHeader icon="📡" title="Zero-Failure Comms: LoRaWAN Mesh Network" subtitle="Low-power long-range mesh nodes in remote NER villages. Peer-to-peer SOS relay even during complete cellular blackout." color="text--600" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Nodes', value: loraNodes.length, icon: Radio },
            { label: 'Active', value: activeNodes, icon: CheckCircle },
            { label: 'Avg Battery', value: `${avgBattery}%`, icon: Battery },
            { label: 'Coverage', value: `~${Math.round(totalCoverage/1000)}k km²`, icon: Globe },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-3 border border-slate-300/50 text-center">
              <stat.icon className="w-5 h-5 text--600 mx-auto mb-1" />
              <div className="text-xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-700">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Node grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {loraNodes.map((node, idx) => (
            <div key={node.id} className={`rounded-xl p-3 border transition-all ${
              idx === activePacket ? 'border-cyan-200 bg-cyan-50 shadow-[0_0_12px_rgba(34,211,238,0.2)]' :
              node.status === 'LOW_BATTERY' ? 'border-orange-500/40 bg-orange-950/10' :
              'border-slate-300 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{node.id}</span>
                <StatusBadge status={node.status} />
              </div>
              <div className="text-xs text-slate-700 mb-1 truncate">{node.name}</div>
              <div className="text-[10px] text-slate-700 mb-2">{node.state}</div>
              <div className="flex items-center gap-1 mb-1">
                <Battery className="w-3 h-3 text-slate-700" />
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{
                    width: `${node.batteryPct}%`,
                    background: node.batteryPct < 20 ? '#ef4444' : node.batteryPct < 50 ? '#f59e0b' : '#10b981'
                  }} />
                </div>
                <span className="text-[10px] text-slate-900">{node.batteryPct}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-700">
                <span>Ping: {node.lastPing}</span>
                <span>{node.coverageKm}km</span>
                <span className="text--600">{node.type}</span>
              </div>
              {idx === activePacket && (
                <div className="mt-1 text-[10px] text--600 animate-pulse">● Transmitting...</div>
              )}
            </div>
          ))}
        </div>
      </GlowCard>
    </FadeIn>
  );
}

// ── River Gauges Section ─────────────────────────────────────────
function RiverGaugesSection() {
  const [gauges, setGauges] = useState(riverGauges);

  useEffect(() => {
    const interval = setInterval(() => {
      setGauges(prev => prev.map(g => ({
        ...g,
        level: Math.max(0.5, g.level + g.riseRate * 0.1 + (Math.random() * 0.04 - 0.02)),
        alert: g.level / g.threshold > 0.85,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FadeIn>
      <GlowCard className="mb-8">
        <SectionHeader icon="🌊" title="Earth Pulse: Smart River Gauges & GLOF Detection" subtitle="AI-enabled ultrasonic water level sensors on Bhutan and Tibet border rivers. Detects Glacial Lake Outburst Floods (GLOFs) 30–60 min in advance." color="text--600" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gauges.map(g => {
            const pct = Math.min(100, (g.level / g.threshold) * 100);
            const isAlert = pct > 85;
            const TrendIcon = g.trend === 'RISING' ? ArrowUp : g.trend === 'FALLING' ? ArrowDown : Minus;
            const trendColor = g.trend === 'RISING' ? 'text--600' : g.trend === 'FALLING' ? 'text-emerald-400' : 'text-slate-700';
            return (
              <div key={g.id} className={`rounded-xl p-4 border ${isAlert ? 'border-red-200 bg-red-50' : 'border-slate-300 bg-white'}`}>
                {isAlert && <div className="text-xs font-black text--600 mb-2 animate-pulse">⚠ FLOOD ALERT</div>}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{g.id}: {g.river}</span>
                  <StatusBadge status={g.glofRisk === 'HIGH' ? 'ALERT' : g.glofRisk === 'MODERATE' ? 'MONITORING' : 'ACTIVE'} />
                </div>
                <div className="text-xs text-slate-700 mb-3">{g.name}</div>
                {/* Vertical gauge */}
                <div className="flex items-end gap-4">
                  <div className="relative w-8 h-24 bg-slate-200 rounded-lg overflow-hidden border border-slate-600">
                    <div className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-1000" style={{
                      height: `${pct}%`,
                      background: pct > 90 ? 'linear-gradient(to top, #ef4444, #f87171)' : pct > 75 ? 'linear-gradient(to top, #f59e0b, #fcd34d)' : 'linear-gradient(to top, #3b82f6, #93c5fd)'
                    }} />
                    <div className="absolute w-full border-t border-dashed border-red-200" style={{ bottom: `${(g.threshold / g.threshold) * 100}%` }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-slate-900">{g.level.toFixed(1)}m</span>
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    </div>
                    <div className="text-xs text-slate-700">Threshold: {g.threshold}m</div>
                    <div className="text-xs text-slate-700">Rise: {g.riseRate > 0 ? '+' : ''}{g.riseRate.toFixed(2)} m/hr</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                        <span>Level</span><span>{Math.round(pct)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-1000" style={{
                          width: `${pct}%`,
                          background: pct > 85 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#3b82f6'
                        }} />
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold">
                      GLOF Risk: <span className={g.glofRisk === 'HIGH' ? 'text--600' : g.glofRisk === 'MODERATE' ? 'text--600' : 'text-emerald-400'}>{g.glofRisk}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlowCard>
    </FadeIn>
  );
}

// ── Drone Corridors Section ──────────────────────────────────────
function DroneCorrridorsSection() {
  const [dronePos, setDronePos] = useState({});

  useEffect(() => {
    // Animate active drones along their path
    const init = {};
    droneCorridors.forEach(dc => { if (dc.status === 'ACTIVE') init[dc.id] = 0; });
    setDronePos(init);

    const interval = setInterval(() => {
      setDronePos(prev => {
        const next = { ...prev };
        droneCorridors.forEach(dc => {
          if (dc.status === 'ACTIVE') {
            next[dc.id] = ((prev[dc.id] || 0) + 2) % 100;
          }
        });
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const activeDrones = droneCorridors.filter(d => d.status === 'ACTIVE').reduce((a, d) => a + d.drones, 0);
  const standbyDrones = droneCorridors.filter(d => d.status === 'STANDBY').reduce((a, d) => a + d.drones, 0);

  return (
    <FadeIn>
      <GlowCard className="mb-8">
        <SectionHeader icon="🚁" title="Aero-Relief: Autonomous BVLOS Drone Corridors" subtitle="Pre-approved flight corridors for autonomous cargo drones. Delivers blood, anti-venom, and medicine to cut-off districts in under 2 hours." color="text-emerald-400" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 border border-emerald-500/30 text-center">
            <div className="text-2xl font-black text-emerald-400">{activeDrones}</div>
            <div className="text-xs text-slate-700">Drones Active</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-amber-200 text-center">
            <div className="text-2xl font-black text--600">{standbyDrones}</div>
            <div className="text-xs text-slate-700">On Standby</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-blue-200 text-center">
            <div className="text-2xl font-black text--600">{droneCorridors.length}</div>
            <div className="text-xs text-slate-700">Corridors</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {droneCorridors.map(dc => (
            <div key={dc.id} className={`rounded-xl p-4 border ${
              dc.status === 'ACTIVE' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-amber-200 bg-amber-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900 truncate">{dc.name}</span>
                <StatusBadge status={dc.status} />
              </div>
              <div className="text-xs text-slate-700 mb-3">
                📍 {dc.from} → {dc.to}
              </div>
              {/* Flight path visualization */}
              <div className="relative h-6 bg-white rounded-lg mb-3 overflow-hidden border border-slate-300/50">
                <div className="absolute inset-0 flex items-center px-2">
                  <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: dc.color + '80' }} />
                </div>
                {dc.status === 'ACTIVE' && (
                  <div className="absolute top-1/2 -translate-y-1/2 text-sm transition-all duration-200" style={{ left: `${dronePos[dc.id] || 0}%` }}>
                    🚁
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded p-1">
                  <div className="font-bold text-slate-900">{dc.drones}</div>
                  <div className="text-slate-700">Drones</div>
                </div>
                <div className="bg-white rounded p-1">
                  <div className="font-bold text-slate-900">{dc.rangeKm}km</div>
                  <div className="text-slate-700">Range</div>
                </div>
                <div className="bg-white rounded p-1">
                  <div className="font-bold text-slate-900">{dc.etaMin}min</div>
                  <div className="text-slate-700">ETA</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-700">📦 {dc.payload}</div>
            </div>
          ))}
        </div>
      </GlowCard>
    </FadeIn>
  );
}

// ── Tribal IVR Section ───────────────────────────────────────────
function TribalIVRSection() {
  const [selectedLang, setSelectedLang] = useState('Khasi');
  const [playing, setPlaying] = useState(false);

  const languages = [
    { name: 'Khasi', region: 'Meghalaya', speakers: '1.4M', ussd: '*123*1#' },
    { name: 'Garo', region: 'Meghalaya', speakers: '1.1M', ussd: '*123*2#' },
    { name: 'Mizo', region: 'Mizoram', speakers: '0.8M', ussd: '*123*3#' },
    { name: 'Ao Naga', region: 'Nagaland', speakers: '0.2M', ussd: '*123*4#' },
    { name: 'Konyak', region: 'Nagaland', speakers: '0.3M', ussd: '*123*5#' },
    { name: 'Nyishi', region: 'Arunachal', speakers: '0.5M', ussd: '*123*6#' },
    { name: 'Bodo', region: 'Assam', speakers: '1.5M', ussd: '*123*7#' },
    { name: 'Meitei', region: 'Manipur', speakers: '1.8M', ussd: '*123*8#' },
  ];

  const ivrMenu = {
    Khasi: ['1 - Shong Rymphaw (Flood Alert)', '2 - Wa Kynmaw (Evacuation Routes)', '3 - Balang Marwein (Medical Help)', '4 - Khun Pdiang (Report Landslide)'],
    Garo: ['1 - Dak·kang Chengchi (Flood Alert)', '2 - Songenga Angan (Evacuation)', '3 - Dok·ko Daban (Medical Help)', '4 - Nam·bo Gari (Report Landslide)'],
    Mizo: ['1 - Tuipui Hlim (Flood Alert)', '2 - Rawn Dan (Evacuation)', '3 - Zairawl Tur (Medical Help)', '4 - Phung Buatsaih (Report Landslide)'],
    default: ['1 - Flood Alert', '2 - Evacuation Routes', '3 - Medical Help', '4 - Report Incident'],
  };

  const currentLang = languages.find(l => l.name === selectedLang) || languages[0];
  const menu = ivrMenu[selectedLang] || ivrMenu.default;

  return (
    <FadeIn>
      <GlowCard className="mb-8">
        <SectionHeader icon="🗣️" title="Tribal Dialect IVR & USSD System" subtitle="Hyper-local voice AI in 8+ tribal languages. Works on basic 2G feature phones — no internet required. 45M+ people covered." color="text--600" />

        <div className="flex flex-wrap gap-2 mb-6">
          {languages.map(l => (
            <button key={l.name} onClick={() => setSelectedLang(l.name)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selectedLang === l.name ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white text-slate-700 border border-slate-600/50 hover:border-purple-200'
              }`}>
              {l.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <div className="text-sm font-bold text--600 mb-3">📞 IVR Menu — {selectedLang}</div>
            <div className="space-y-2">
              {menu.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text--600 flex items-center justify-center text-xs font-bold">{i+1}</div>
                  <span className="text-sm text-slate-200">{item.split(' - ')[1] || item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setPlaying(true); setTimeout(() => setPlaying(false), 3000); }}
              className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" /> {playing ? 'Playing...' : 'Play Demo Audio'}
            </button>
            {playing && (
              <div className="mt-3 flex items-center gap-1 justify-center">
                {Array.from({length:20}).map((_, i) => (
                  <div key={i} className="w-1 bg-purple-400 rounded animate-bounce" style={{
                    height: `${Math.random() * 20 + 4}px`,
                    animationDelay: `${i * 0.05}s`
                  }} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 border border-cyan-200">
            <div className="text-sm font-bold text-cyan-700 mb-3">📱 USSD Code — Works on 2G</div>
            <div className="font-mono text-2xl text--600 mb-3 text-center py-4 bg-black/30 rounded-lg">{currentLang.ussd}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-700"><span>Region:</span><span className="text-slate-900">{currentLang.region}</span></div>
              <div className="flex justify-between text-slate-700"><span>Speakers:</span><span className="text-slate-900">{currentLang.speakers}</span></div>
              <div className="flex justify-between text-slate-700"><span>Network needed:</span><span className="text-emerald-400 font-bold">2G only</span></div>
              <div className="flex justify-between text-slate-700"><span>Internet needed:</span><span className="text-emerald-400 font-bold">❌ No</span></div>
            </div>
          </div>
        </div>
      </GlowCard>
    </FadeIn>
  );
}

// ── Pilot Proposals Section ──────────────────────────────────────
function PilotProposalsSection() {
  const [expanded, setExpanded] = useState(null);

  const proposals = [
    {
      id: 'pilot-1',
      title: 'Acoustic Early Warning System for NH-10 (Sikkim)',
      icon: '🔊',
      cost: '₹2.8 Crore',
      timeline: '6 months',
      stakeholders: 'NDMA, BRO, IMD, NIDM, Sikkim SDMA',
      techStack: 'MEMS acoustic sensors, LoRa backhaul, Raspberry Pi edge AI, Firebase real-time DB',
      color: 'border-amber-200',
      blueprint: `## Phase 1 (Month 1-2): Site Survey & Procurement
- Geological survey of NH-10 km 40–120 (highest risk zones identified by NDMA 2023 report)
- Procurement of 24 MEMS acoustic sensors (ADXL355 + custom enclosure)
- LoRaWAN gateway installation at Rangpo, Singtam, Mangan, Chungthang

## Phase 2 (Month 3-4): Deployment & Calibration
- Sensor installation at 8 critical slope positions
- Edge AI model training on regional slope-failure acoustic signatures
- Integration with GARUD command dashboard

## Phase 3 (Month 5-6): Testing & Handover
- 30-day trial with simulated events
- Training of BRO operators and SDRF teams
- SOP creation for 15-minute warning → road closure protocol

## Expected Outcome
- **15–30 minute advance warning** before major collapses
- **Prevent NH-10 blockage** (Sikkim's lifeline to rest of India)
- Protect ~**4,000 daily vehicles** including supply convoys`,
    },
    {
      id: 'pilot-2',
      title: 'LoRaWAN Mesh Network for Dima Hasao (Assam)',
      icon: '📡',
      cost: '₹1.4 Crore',
      timeline: '4 months',
      stakeholders: 'ASDMA, DoT, BSNL, Village Development Councils',
      techStack: 'RAK Wireless LoRa gateways, SX1276 end nodes, TTN server, GARUD API',
      color: 'border-cyan-200',
      blueprint: `## Phase 1 (Month 1): Planning & Community Buy-in
- Village council engagement in Haflong, Maibang, Umrangso
- Site survey for 12 gateway locations (hilltops preferred for range)
- Community training on SOS message protocol

## Phase 2 (Month 2-3): Network Deployment
- Install 4 LoRa gateways at strategic hilltop positions
- Distribute 120 end-node devices to village Gaon Buras
- Setup TTN private server integration with GARUD backend

## Phase 3 (Month 4): Testing & Integration
- Full mesh connectivity test across 2,000 km² coverage area
- Integration with GARUD alert dashboard
- IVR voice broadcast system integration

## Expected Outcome
- **100% communication resilience** even during cable/cell blackout
- Cover **~85,000 people** in remote Dima Hasao villages
- Enable **real-time SOS relay** from cut-off villages to NDRF`,
    },
  ];

  return (
    <FadeIn>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">📋 Pilot Project Proposals</h2>
        <p className="text-slate-700 text-sm mb-6">Ready-to-submit implementation blueprints for immediate NDMA funding consideration.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map(p => (
            <div key={p.id} className={`rounded-2xl border ${p.color} bg-slate-50 p-5 backdrop-blur-sm`}>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{p.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-white border border-slate-600/50 px-2 py-0.5 rounded-full text-slate-700">💰 {p.cost}</span>
                    <span className="text-xs bg-white border border-slate-600/50 px-2 py-0.5 rounded-full text-slate-700">⏱ {p.timeline}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div><span className="text-slate-700">Stakeholders:</span> <span className="text-slate-200">{p.stakeholders}</span></div>
                <div><span className="text-slate-700">Tech Stack:</span> <span className="text-slate-200">{p.techStack}</span></div>
              </div>
              <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="w-full py-2 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">
                {expanded === p.id ? '▲ Hide Blueprint' : '▼ Generate Full Blueprint'}
              </button>
              {expanded === p.id && (
                <div className="mt-4 bg-white rounded-xl p-4 text-sm text-slate-200 border border-slate-300/50 whitespace-pre-line font-mono text-xs leading-relaxed max-h-80 overflow-y-auto">
                  {p.blueprint}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function StrategicUpgradesPage() {
  return (
    <div className="light-dashboard page-enter relative pb-12 bg-slate-50 min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-2">

        {/* Hero */}
        <FadeIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                🛰️ Strategic Upgrades
              </h1>
              <p className="text-slate-700">Next-Gen NER Resilience Architecture — GARUD v2.0 Blueprint</p>
            </div>
            <SimulatedDataBadge />
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Acoustic Sensors', value: acousticSensors.length, icon: '🔊', color: 'text--600' },
              { label: 'LoRaWAN Nodes', value: loraNodes.length, icon: '📡', color: 'text--600' },
              { label: 'River Gauges', value: riverGauges.length, icon: '🌊', color: 'text--600' },
              { label: 'Drone Corridors', value: droneCorridors.length, icon: '🚁', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-2xl border border-slate-300/50 p-4 text-center backdrop-blur-sm">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-700 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <AcousticSensorSection />
        <LoRaWANSection />
        <RiverGaugesSection />
        <DroneCorrridorsSection />
        <TribalIVRSection />
        <PilotProposalsSection />

        <FadeIn>
          <div className="text-center py-8 text-slate-700 text-xs uppercase tracking-widest border-t border-slate-300/50">
            GARUD AI v2.0 · Strategic Upgrades Module · NDMA Technology Blueprint
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
