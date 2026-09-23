import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Radio, Zap, Shield, Volume2, Mic, Activity, Thermometer, Droplets, Wind, ChevronRight, Bell, CheckCircle, X, RotateCcw, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchLiveEarthquakes } from '../services/liveDataService';

// ── DEFCON CONFIG ────────────────────────────────────────────────────────────
const DEFCON = [
  { level:1, label:'DEFCON 1 — CRITICAL',  color:'#dc2626', bg:'bg-red-600',    pulse:true  },
  { level:2, label:'DEFCON 2 — SEVERE',    color:'#f97316', bg:'bg-orange-500', pulse:true  },
  { level:3, label:'DEFCON 3 — HIGH',      color:'#f59e0b', bg:'bg-amber-500',  pulse:false },
  { level:4, label:'DEFCON 4 — ELEVATED',  color:'#eab308', bg:'bg-yellow-500', pulse:false },
  { level:5, label:'DEFCON 5 — NORMAL',    color:'#16a34a', bg:'bg-green-600',  pulse:false },
];

// ── TICKER ITEMS ─────────────────────────────────────────────────────────────
const TICKER = [
  '🔴 CRITICAL: AS-08 (NH-10 Rangpo) vib=96/100 — SLOPE FAILURE IMMINENT',
  '🟡 IMD: Red alert Arunachal Pradesh — 200mm/24hr — West Kameng',
  '🔴 GLOF: South Lhonak Lake +2.1m above safe level — Sikkim evacuate now',
  '🟢 NDRF Alpha arrived Silchar — 47 rescued from Barak floodplain',
  '🟡 Brahmaputra: Pasighat gauge 5.8m / 6.0m danger mark — rising 0.12m/hr',
  '🔴 NH-06 Dima Hasao: Debris flow — complete blockade — Km 148',
  '🟢 Drone GHY-01 delivered medicines to Haflong Camp — 4.2kg payload',
  '🟡 Seismic: 3.4M Manipur-Myanmar border 14:32 IST — monitoring active',
  '🔴 Tupul AS-015 acoustic: 89/100 — LoRaWAN SOS from Pherzawl village',
];

// ── SENSOR DATA ───────────────────────────────────────────────────────────────
const SENSORS_LORA = [
  { id:'AS-01', loc:'NH-415 Arunachal',  ping:98,  lat: 27.1,  status:'OK'       },
  { id:'AS-03', loc:'NH-40 Meghalaya',   ping:72,  lat: 25.5,  status:'WARNING'  },
  { id:'AS-08', loc:'NH-10 Rangpo SK',   ping:100, lat: 27.33, status:'CRITICAL' },
  { id:'AS-11', loc:'Shillong-GHY NH-6', ping:91,  lat: 25.57, status:'OK'       },
  { id:'AS-15', loc:'Tupul Manipur',     ping:89,  lat: 24.48, status:'CRITICAL' },
  { id:'AS-19', loc:'Dima Hasao NH-27',  ping:55,  lat: 25.55, status:'WARNING'  },
];

// ── RIVER GAUGES ──────────────────────────────────────────────────────────────
const RIVERS = [
  { name:'Brahmaputra (Pasighat)', cur:5.8,  danger:6.0,  flood:6.8,  unit:'m' },
  { name:'Barak (Silchar)',         cur:4.2,  danger:4.5,  flood:5.2,  unit:'m' },
  { name:'Teesta (Rangpo)',         cur:3.1,  danger:3.5,  flood:4.2,  unit:'m' },
  { name:'Kopili (Kampur)',         cur:6.7,  danger:6.5,  flood:7.8,  unit:'m' },
  { name:'Jiabharali (Bhalukpong)', cur:2.9,  danger:4.0,  flood:5.1,  unit:'m' },
];

// ── MAP NODES ──────────────────────────────────────────────────────────────────
const MAP_NODES = {
  red: [
    { lat:27.33, lng:88.56, label:'NH-10 Landslide',      detail:'Road blocked Km 42 — 3 vehicles trapped' },
    { lat:25.09, lng:93.25, label:'Dima Hasao Slide',      detail:'NH-06 Km 148 — debris flow active' },
    { lat:24.80, lng:93.95, label:'Tupul Slope Failure',   detail:'Acoustic sensor 89/100 — evacuate' },
    { lat:25.57, lng:91.88, label:'NH-40 Blockage',        detail:'Both carriageways blocked — BRO mobilised' },
    { lat:27.10, lng:91.90, label:'Sela Pass Rockfall',    detail:'NH-13 blocked — IAF Mi-17 only access' },
  ],
  blue: [
    { lat:27.00, lng:94.91, label:'Majuli Island Flood',   detail:'80% submerged — 12,400 evacuated' },
    { lat:26.57, lng:91.44, label:'Barpeta Flood',         detail:'3 revenue circles inundated — boats deployed' },
    { lat:24.82, lng:92.79, label:'Barak Overflow Silchar',detail:'Embankment breached at 2 points' },
    { lat:26.72, lng:90.35, label:'Kokrajhar Flood',       detail:'NH-31 submerged — SDRF boats active' },
  ],
  green: [
    { lat:26.14, lng:91.74, label:'Guwahati Camp',         detail:'Capacity: 1640/2000 · Supplies: OK' },
    { lat:25.57, lng:91.88, label:'Shillong Camp',         detail:'Capacity: 1180/1500 · Supplies: OK' },
    { lat:24.82, lng:93.94, label:'Imphal Camp',           detail:'Capacity: 890/1200 · Supplies: WARNING' },
    { lat:27.33, lng:88.62, label:'Gangtok Camp',          detail:'Capacity: 597/600 · CRITICAL FULL' },
    { lat:25.10, lng:92.64, label:'Aizawl Camp',           detail:'Capacity: 318/500 · Supplies: OK' },
  ],
};

const DRONE_PATHS = [
  { coords:[[26.14,91.74],[25.55,93.25]], label:'GHY-01 Dima Hasao', color:'#22d3ee', status:'ACTIVE' },
  { coords:[[25.57,91.88],[24.48,93.77]], label:'SHL-02 Champhai',   color:'#a78bfa', status:'ACTIVE' },
  { coords:[[24.82,93.94],[27.33,88.62]], label:'IMP-03 Mangan',     color:'#34d399', status:'ACTIVE' },
];

// ── AI ACTION CARDS ────────────────────────────────────────────────────────────
const INIT_ACTIONS = [
  { id:1, priority:'CRITICAL', icon:'🚨', text:'NH-6 blocked at Sonapur — Reroute logistics via Umrangso bypass — Dispatch 2 NDRF teams to Haflong', time:'14:35', acked:false },
  { id:2, priority:'HIGH',     icon:'🌊', text:'Brahmaputra rising 0.12m/hr at Pasighat — Pre-position 4 SDRF boats at Dibru ghat — Alert Majuli DC', time:'14:32', acked:false },
  { id:3, priority:'HIGH',     icon:'🚁', text:'Tawang HAA cut off — Activate IAF Mi-17V5 sorties from Guwahati AFB for medical evacuation — Priority: children+elderly', time:'14:28', acked:false },
  { id:4, priority:'MEDIUM',   icon:'📡', text:'AS-08 NH-10 Rangpo vibration 96/100 — Trigger 5km geofence evacuation — Activate tribal IVR in Lepcha dialect', time:'14:22', acked:false },
  { id:5, priority:'MEDIUM',   icon:'🏕️', text:'Gangtok camp at 99% capacity — Transfer 200 evacuees to Jorhat NDRF base — Coordinate ARMY transport', time:'14:18', acked:false },
];

const AGENCIES = [
  { name:'NDRF 1st Bn (Assam)', icon:'🛡️', freq:'VHF-148.5', loc:'Guwahati', avail:3 },
  { name:'SDRF Sikkim',         icon:'👮', freq:'VHF-152.3', loc:'Gangtok',  avail:0 },
  { name:'Assam Rifles',        icon:'⚔️', freq:'HF-7.432',  loc:'Shillong', avail:2 },
  { name:'Indian Army Col.',    icon:'🪖', freq:'HF-8.121',  loc:'Tawang',   avail:4 },
  { name:'IAF Mi-17 Fleet',     icon:'🚁', freq:'VHF-125.0', loc:'Tezpur',   avail:2 },
  { name:'Medical Response',    icon:'🏥', freq:'SAT-LINK',  loc:'Imphal',   avail:1 },
];

const DIALECTS = [
  { lang:'Khasi',   msg:'Ai ia leit mynta sha nga shong! Soh pyndep.',           region:'Meghalaya' },
  { lang:'Mizo',    msg:'Rawn dan rawh! Phung buatsaih a awm hmasa.',            region:'Mizoram' },
  { lang:'Bodo',    msg:'Dao jakhon! Mati khisaw alarm. 112 phone khou.',        region:'Assam' },
  { lang:'Meitei',  msg:'Chatpa mateng! Yum lum alarm oikhre.',                  region:'Manipur' },
  { lang:'Garo',    msg:'Songenga angan! Dok·ko relief camp.',                   region:'Meghalaya' },
  { lang:'Nyishi',  msg:'Pa lo pio! Mendo chu alarm pata.',                      region:'Arunachal' },
];

const genWave = (phase, critical) =>
  Array.from({ length: 30 }, (_, i) => {
    const amp = critical ? 40 + Math.random() * 30 : 10 + Math.random() * 8;
    return { t: i, v: +(50 + amp * Math.sin(i * (critical ? 0.8 : 0.4) + phase) + (critical ? (Math.random() - 0.5) * 20 : 0)).toFixed(1) };
  });

const genSoil = () => Array.from({ length: 20 }, (_, i) => ({ t: i, v: +(55 + Math.random() * 30).toFixed(1) }));

// ── CUSTOM TICK ────────────────────────────────────────────────────────────────
function TickerBar({ items }) {
  return (
    <div className="overflow-hidden flex-1">
      <div className="flex gap-12 animate-[marquee_60s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`text-xs font-semibold shrink-0 ${item.startsWith('🔴') ? 'text--600' : item.startsWith('🟡') ? 'text--600' : 'text--600'}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── MAP FIT ────────────────────────────────────────────────────────────────────
function MapCenter() {
  const map = useMap();
  useEffect(() => { map.setView([26.0, 92.5], 6); }, [map]);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function OperationsPage() {
  const [defcon, setDefcon]           = useState(2);
  const [wavePhase, setWavePhase]     = useState(0);
  const [waveData, setWaveData]       = useState(() => genWave(0, true));
  const [soilData, setSoilData]       = useState(() => genSoil());
  const [rivers, setRivers]           = useState(RIVERS);
  const [sensors, setSensors]         = useState(SENSORS_LORA);
  const [actions, setActions]         = useState(INIT_ACTIONS);
  const [toast, setToast]             = useState('');
  const [overrideMode, setOverride]   = useState(false);
  const [alarmActive, setAlarm]       = useState(false);
  const [broadcastLang, setBroadcast] = useState(null);
  const [dispatchLog, setDispatchLog] = useState([]);
  const [mapNodes]                    = useState(MAP_NODES);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [liveEarthquakes, setLiveEarthquakes] = useState([]);
  const [mapApiStatus, setMapApiStatus] = useState('CONNECTING');
  const [satPacketCount, setSatPacketCount] = useState(0);
  const [satLastSync, setSatLastSync] = useState(null);
  const audioCtx                      = useRef(null);

  const GLOF_LAKES = [
    { name: 'South Lhonak (Sikkim)', level: '+2.1m', trend: 'RISING FAST', status: 'CRITICAL', time: '14:32' },
    { name: 'Shako Cho (Sikkim)', level: '+0.5m', trend: 'STABLE', status: 'OK', time: '14:15' },
    { name: 'Tawang Basin (Arunachal)', level: '+1.2m', trend: 'RISING', status: 'WARNING', time: '14:28' }
  ];

  useEffect(() => {
    let mounted = true;
    const loadEarthquakes = async () => {
      if (lowBandwidth) return;
      setMapApiStatus('CONNECTING');
      const data = await fetchLiveEarthquakes();
      if (!mounted) return;
      setLiveEarthquakes(data);
      setMapApiStatus('CONNECTED');
      setSatLastSync(new Date());
    };
    loadEarthquakes().catch(() => {
      if (mounted) setMapApiStatus('OFFLINE');
    });
    const refresh = setInterval(loadEarthquakes, 5 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(refresh);
    };
  }, [lowBandwidth]);

  useEffect(() => {
    if (!lowBandwidth) return undefined;

    setMapApiStatus('SATELLITE RELAY');
    setSatPacketCount(0);
    setSatLastSync(new Date());
    const packetTimer = setInterval(() => {
      setSatPacketCount(count => count + 1);
      setSatLastSync(new Date());
    }, 8000);

    return () => clearInterval(packetTimer);
  }, [lowBandwidth]);

  const dc = DEFCON.find(d => d.level === defcon) || DEFCON[1];

  // ── Live waveform ──
  useEffect(() => {
    const t = setInterval(() => {
      setWavePhase(p => p + 0.3);
      const critical = sensors.some(s => s.status === 'CRITICAL');
      setWaveData(genWave(wavePhase, critical));
    }, 500);
    return () => clearInterval(t);
  }, [wavePhase, sensors]);

  // ── Live soil data ──
  useEffect(() => {
    const t = setInterval(() => setSoilData(genSoil()), 4000);
    return () => clearInterval(t);
  }, []);

  // ── Live river levels ──
  useEffect(() => {
    const t = setInterval(() => {
      setRivers(prev => prev.map(r => ({
        ...r, cur: +(r.cur + (Math.random() * 0.04 - 0.01)).toFixed(2)
      })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // ── Sensor ping jitter ──
  useEffect(() => {
    const t = setInterval(() => {
      setSensors(prev => prev.map(s => ({
        ...s, ping: Math.max(30, Math.min(100, s.ping + Math.floor(Math.random() * 7 - 3)))
      })));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // ── Audio alarm ──
  const playAlarm = useCallback((type = 'critical') => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = type === 'critical' ? 880 : 440;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }, []);

  // ── Toast helper ──
  const showToast = useCallback((msg, sound = false) => {
    setToast(msg);
    if (sound) playAlarm('notify');
    setTimeout(() => setToast(''), 4000);
  }, [playAlarm]);

  // ── Dispatch agency ──
  const dispatch = (agency) => {
    const entry = {
      agency: agency.name, time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      status: 'DISPATCHED'
    };
    setDispatchLog(prev => [entry, ...prev.slice(0, 6)]);
    showToast(`📡 ${agency.name} contacted on ${agency.freq}`, true);
  };

  // ── Acknowledge action card ──
  const ackAction = (id) => setActions(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));

  // ── Broadcast ──
  const broadcast = (d) => {
    setBroadcast(d.lang);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(d.msg);
      utt.lang = 'en-IN'; utt.rate = 0.85;
      utt.onend = () => setBroadcast(null);
      window.speechSynthesis.speak(utt);
    }
    showToast(`🔊 Broadcasting in ${d.lang} → ${d.region}`, true);
    setTimeout(() => setBroadcast(null), 5000);
  };

  const criticalCount = sensors.filter(s => s.status === 'CRITICAL').length;

  return (
    <div className={`flex flex-col flex-grow max-w-7xl mx-auto w-full bg-slate-50 text-slate-900 shadow-sm border-x border-slate-200 ${overrideMode ? 'bg-slate-100' : ''}`}>

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] bg-slate-100 border border-blue-200 text-slate-900 px-5 py-2.5 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text--600" />{toast}
        </div>
      )}

      {/* ══════════════ TOP BAR ══════════════ */}
      <div className={`shrink-0 border-b ${dc.level <= 2 ? 'border-red-200' : 'border-slate-300/50'} bg-white backdrop-blur`}>
        {/* DEFCON + controls */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-b border-slate-200">
          {/* DEFCON selector */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${dc.bg} ${dc.pulse ? 'animate-pulse' : ''}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-slate-900" />
            <span className="text-xs font-black text-slate-900 tracking-wider">{dc.label}</span>
          </div>
          <div className="flex gap-1">
            {DEFCON.map(d => (
              <button key={d.level} onClick={() => setDefcon(d.level)}
                className={`w-6 h-6 rounded text-[10px] font-black transition-all border ${defcon === d.level ? 'border-slate-800 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
                style={{ background: d.color }}>
                {d.level}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Low Bandwidth Toggle */}
            <button
              aria-pressed={lowBandwidth}
              aria-label={lowBandwidth ? 'Disable satellite relay mode' : 'Enable satellite relay mode'}
              onClick={() => {
                const nextMode = !lowBandwidth;
                setLowBandwidth(nextMode);
                showToast(nextMode
                  ? '📡 SAT relay active — live map paused, telemetry packets receiving'
                  : '🌐 Live network restored — refreshing map feeds', true);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 shadow-sm ${
                lowBandwidth 
                  ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Radio className={`w-4 h-4 ${lowBandwidth ? 'text-amber-600' : 'text-slate-700'}`} />
              {lowBandwidth ? 'SAT RELAY ACTIVE' : 'Switch to SAT Mode'}
            </button>

            {/* Sensor pings */}
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-700 font-bold">Ping:</span>
            {sensors.map(s => (
              <div key={s.id} title={`${s.id} — ${s.loc}: ${s.ping}ms`}
                className={`w-2.5 h-2.5 rounded-full ${s.status === 'CRITICAL' ? 'bg-red-500 animate-pulse' : s.status === 'WARNING' ? 'bg-amber-400' : 'bg-green-400'}`} />
            ))}
            <span className="text-[10px] text-slate-700">{sensors.filter(s => s.status === 'OK').length}/{sensors.length} OK</span>
          </div>

          {/* Weather Doppler */}
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
            <Wind className="w-3.5 h-3.5 text--600" />
            <span className="text-[10px] text--600">IMD Radar: </span>
            <span className="text-[10px] text--600">⛈ CB detected Sikkim NW</span>
            <span className="text-[10px] text-slate-700">|</span>
            <span className="text-[10px] text--600">⚠ GLOF potential Lhonak</span>
          </div>

          {/* Override toggle */}
          <button onClick={() => { setOverride(v => !v); showToast(overrideMode ? '🤖 AI Control restored' : '🧑 HUMAN OVERRIDE activated', true); }}
            className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${overrideMode ? 'bg-amber-50 border-amber-200 text--600' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-blue-200'}`}>
            <RotateCcw className="w-3 h-3" />
            {overrideMode ? '⚡ OVERRIDE ACTIVE' : 'One-Touch Override'}
          </button>

          {/* Alarm button */}
          <button onClick={() => { setAlarm(v => !v); playAlarm('critical'); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${alarmActive ? 'bg-red-50 border-red-200 text--600 animate-pulse' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
            <Bell className="w-3 h-3" />
            {alarmActive ? 'ALARM ON' : 'Test Alarm'}
          </button>
        </div>
        </div>

        {/* Ticker */}
        <div className="flex items-center gap-3 px-3 py-1">
          <span className="text-[10px] font-black text--600 bg-red-50 border border-red-200 px-2 py-0.5 rounded shrink-0">● LIVE</span>
          <TickerBar items={TICKER} />
        </div>
      </div>

      {/* ══════════════ MAIN 3-COLUMN GRID ══════════════ */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-0 lg:divide-x divide-y lg:divide-y-0 divide-slate-200">

        {/* ═══ LEFT PANEL ═══ */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col bg-slate-50 space-y-0 divide-y divide-slate-200">

          {/* Acoustic Waveform */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Acoustic Sensor Stream
              </span>
              {criticalCount > 0 && <span className="text-[9px] bg-red-50 text--600 border border-red-200 px-1.5 py-0.5 rounded animate-pulse">⚠ {criticalCount} CRITICAL</span>}
            </div>
            <div className="h-28 bg-white rounded border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waveData} margin={{ top:4, right:4, left:-30, bottom:0 }}>
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={criticalCount > 0 ? '#ef4444' : '#22d3ee'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={criticalCount > 0 ? '#ef4444' : '#22d3ee'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={criticalCount > 0 ? '#ef4444' : '#22d3ee'} fill="url(#waveGrad)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <YAxis domain={[0,100]} tick={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {sensors.map(s => (
                <div key={s.id} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${s.status==='CRITICAL'?'bg-red-50 border border-red-200':s.status==='WARNING'?'bg-amber-50 border border-amber-200':'bg-slate-100 border border-slate-200'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status==='CRITICAL'?'bg-red-400 animate-pulse':s.status==='WARNING'?'bg-amber-400':'bg-green-400'}`} />
                  <span className={`${s.status==='CRITICAL'?'text--600':s.status==='WARNING'?'text--600':'text-slate-700'}`}>{s.id}</span>
                  <span className="text-slate-700 ml-auto">{s.ping}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="p-3">
            <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-3 h-3" /> Soil Moisture / Pore Pressure
            </span>
            <div className="h-24 bg-white rounded border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={soilData} margin={{ top:4, right:4, left:-30, bottom:0 }}>
                  <defs>
                    <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="url(#soilGrad)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <YAxis domain={[0,100]} tick={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-[9px]">
              {[['Mizoram','72%','text--600'],['Meghalaya','84%','text--600'],['Nagaland','61%','text--600']].map(([s,v,c]) => (
                <div key={s} className="bg-slate-50 rounded px-2 py-1.5 border border-slate-200 text-center">
                  <div className={`font-black text-sm ${c}`}>{v}</div>
                  <div className="text-slate-700 leading-tight">{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* River Gauges */}
          <div className="p-3">
            <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-3 h-3" /> River Basin Gauges
            </span>
            <div className="space-y-2">
              {rivers.map(r => {
                const pct = Math.min(100, Math.round((r.cur / r.flood) * 100));
                const overDanger = r.cur >= r.danger;
                return (
                  <div key={r.name}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className={`${overDanger ? 'text--600 font-bold' : 'text-slate-700'}`}>{r.name.split('(')[0].trim()}</span>
                      <span className={`font-mono font-bold ${overDanger ? 'text--600' : 'text-slate-900'}`}>{r.cur}m {overDanger && '⚠'}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 relative">
                      <div className="h-1.5 rounded-full transition-all duration-1000"
                        style={{ width:`${pct}%`, background: r.cur >= r.danger ? '#dc2626' : r.cur >= r.danger * 0.9 ? '#f59e0b' : '#2563eb' }} />
                      <div className="absolute top-0 h-1.5 w-0.5 bg-yellow-400"
                        style={{ left:`${Math.round((r.danger/r.flood)*100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GLOF Telemetry */}
          <div className="p-3 border-t border-slate-200">
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Activity className="w-3 h-3" /> GLOF Telemetry (NER)
            </span>
            <div className="space-y-2">
              {GLOF_LAKES.map(lake => (
                <div key={lake.name} className="flex flex-col bg-slate-50 p-1.5 rounded border border-slate-200">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-700">{lake.name}</span>
                    <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${lake.status === 'CRITICAL' ? 'bg-red-100 text--600' : lake.status === 'WARNING' ? 'bg-amber-100 text--600' : 'bg-green-100 text--600'}`}>{lake.level}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] mt-1 text-slate-700">
                    <span className="uppercase tracking-widest">{lake.trend}</span>
                    <span>T: {lake.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CENTER MAP ═══ */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-l border-r border-slate-200 shadow-xl z-10">
          {/* Map header */}
          <div className="shrink-0 bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm z-20">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                🗺️ {lowBandwidth ? 'GARUD RAW TELEMETRY' : 'GARUD GIS Tactical Map'} 
                <span className={`${lowBandwidth ? 'bg-amber-100 text--600' : 'bg-blue-100 text--600'} px-2 py-0.5 rounded text-[10px] font-bold tracking-widest`}>
                  {lowBandwidth ? 'LORA/SAT MODE' : 'LIVE FEED'}
                </span>
              </span>
              <span className="text-[10px] text-slate-700 font-medium flex items-center gap-2">
              Monitoring North Eastern Region (NER)
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${mapApiStatus === 'CONNECTED' ? 'bg-emerald-100 text-emerald-700' : mapApiStatus === 'SATELLITE RELAY' ? 'bg-amber-100 text--600' : mapApiStatus === 'CONNECTING' ? 'bg-blue-100 text--600' : 'bg-red-100 text--600'}`}>
                ● {mapApiStatus === 'CONNECTED' ? 'API CONNECTED' : mapApiStatus}
              </span>
              {lowBandwidth && <span className="text--600">· {satPacketCount} packets · cached feed</span>}
              {!lowBandwidth && satLastSync && <span className="text-slate-700">· synced {satLastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
              </span>
            </div>
            
            {!lowBandwidth && (
              <div className="flex items-center gap-4 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-inner hidden md:flex">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm" />Active Landslide</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />Flood Zone</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-600 shadow-sm" />Relief Camp</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-1 bg-cyan-500 rounded-full" />Drone Path</span>
                {overrideMode && <span className="bg-amber-100 border border-amber-300 text--600 px-2 py-0.5 rounded font-bold animate-pulse ml-2 shadow-sm">⚡ OVERRIDE MODE</span>}
              </div>
            )}
          </div>

          <div className="flex-1 relative bg-slate-100 overflow-hidden">
            {lowBandwidth ? (
              <div className="absolute inset-0 overflow-y-auto p-4 font-mono text-[11px] text--600 space-y-2 bg-slate-50">
                <div className="text--600 font-bold mb-4">{'>>> SATELLITE RELAY ACTIVE: TERRESTRIAL LINK UNAVAILABLE <<<'}</div>
                <div className="text-slate-700">{`>>> LORA/SAT UPLINK ESTABLISHED - 1.2kbps · PACKETS ${satPacketCount} <<<`}</div>
                <div className="text-slate-700">{`>>> LAST RELAY SYNC: ${satLastSync ? satLastSync.toLocaleTimeString() : 'INITIALISING'} · LIVE API POLLING PAUSED <<<`}</div>
                
                <div className="mt-4 border-b border-green-800 pb-1 mb-2">RAW GPS NODES [CRITICAL ONLY]</div>
                {mapNodes.red.map((n, i) => (
                  <div key={i} className="flex justify-between border-l-2 border-red-200 pl-2">
                    <span>ERR_SLOPE_FAIL [{n.lat.toFixed(4)}, {n.lng.toFixed(4)}]</span>
                    <span className="text--600">{n.label}</span>
                  </div>
                ))}
                
                <div className="mt-4 border-b border-green-800 pb-1 mb-2">FLOOD BASINS</div>
                {mapNodes.blue.map((n, i) => (
                  <div key={i} className="flex justify-between border-l-2 border-blue-200 pl-2">
                    <span>WARN_WATER_LVL [{n.lat.toFixed(4)}, {n.lng.toFixed(4)}]</span>
                    <span className="text--600">{n.label}</span>
                  </div>
                ))}
                <div className="mt-4 border-b border-green-800 pb-1 mb-2">CACHED SEISMIC EVENTS</div>
                {liveEarthquakes.length > 0 ? liveEarthquakes.slice(0, 5).map((quake) => (
                  <div key={quake.id} className="flex justify-between border-l-2 border-violet-500 pl-2">
                    <span>SEISMIC_M{quake.magnitude?.toFixed(1)} [{quake.lat.toFixed(4)}, {quake.lng.toFixed(4)}]</span>
                    <span className="text-violet-300">{quake.place}</span>
                  </div>
                )) : (
                  <div className="text-slate-700">No cached seismic events available</div>
                )}

                <div className="mt-4 border-b border-green-800 pb-1 mb-2">ACTIVE SENSOR PINGS</div>
                {sensors.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{s.id}_{s.loc.replace(' ','_').toUpperCase()}</span>
                    <span className={s.status === 'CRITICAL' ? 'text-red-500 font-bold animate-pulse' : 'text-green-500'}>
                      {s.status} [RSRP: -98dBm]
                    </span>
                  </div>
                ))}

                <div className="animate-pulse mt-8 opacity-50">_AWAITING NEXT TELEMETRY PACKET...</div>
              </div>
            ) : (
              <>
            {/* Map Action Buttons */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <button 
                className="bg-white border-2 border-slate-200 text-slate-700 p-2.5 rounded-xl shadow-lg hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all"
                title="Toggle Topography"
                onClick={() => showToast("Terrain view activated", true)}
              >
                <MapPin className="w-5 h-5" />
              </button>
              <button 
                className="bg-white border-2 border-slate-200 text-slate-700 p-2.5 rounded-xl shadow-lg hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all"
                title="Toggle Weather Radar"
                onClick={() => showToast("Weather Radar Overlay ON", true)}
              >
                <Wind className="w-5 h-5 text-blue-500" />
              </button>
            </div>

            <MapContainer center={[26.0, 92.5]} zoom={6} style={{ width:'100%', height:'100%', background:'#f8fafc' }}
              zoomControl={true} scrollWheelZoom={true}>
              <MapCenter />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri, Maxar, Earthstar Geographics'
                maxZoom={18}
              />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={18}
              />
              {/* Red nodes — landslides */}
              {mapNodes.red.map((n, i) => (
                <CircleMarker key={`r${i}`} center={[n.lat, n.lng]} radius={10} pathOptions={{ color:'#dc2626', fillColor:'#dc2626', fillOpacity:0.7, weight:2 }}>
                  <Popup><div className="text-xs p-1"><strong className="text--600 text-sm block mb-1">🔴 {n.label}</strong>{n.detail}</div></Popup>
                </CircleMarker>
              ))}
              {/* Blue nodes — floods */}
              {mapNodes.blue.map((n, i) => (
                <CircleMarker key={`b${i}`} center={[n.lat, n.lng]} radius={12} pathOptions={{ color:'#2563eb', fillColor:'#2563eb', fillOpacity:0.5, weight:2, dashArray:'4 2' }}>
                  <Popup><div className="text-xs p-1"><strong className="text--600 text-sm block mb-1">🔵 {n.label}</strong>{n.detail}</div></Popup>
                </CircleMarker>
              ))}
              {/* Green nodes — camps */}
              {mapNodes.green.map((n, i) => (
                <CircleMarker key={`g${i}`} center={[n.lat, n.lng]} radius={8} pathOptions={{ color:'#16a34a', fillColor:'#16a34a', fillOpacity:0.8, weight:2 }}>
                  <Popup><div className="text-xs p-1"><strong className="text-green-800 text-sm block mb-1">🟢 {n.label}</strong>{n.detail}</div></Popup>
                </CircleMarker>
              ))}
              {/* Drone corridors */}
              {DRONE_PATHS.map((d, i) => (
                <Polyline key={`d${i}`} positions={d.coords} pathOptions={{ color: d.color, weight:3, dashArray:'6 6', opacity:0.9 }}>
                  <Popup><div className="text-xs font-bold p-1"><span className="text-sm">{d.label}</span><br/><span className="text--600">{d.status}</span></div></Popup>
                </Polyline>
              ))}
            </MapContainer>
            </>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col bg-slate-50 divide-y divide-slate-200">

          {/* AI Action Cards */}
          <div className="p-3">
            <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Zap className="w-3 h-3" /> GARUD AI Action Cards
            </span>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
              {actions.filter(a => !a.acked).map(a => (
                <div key={a.id} className={`rounded-lg border p-2 text-[10px] ${a.priority==='CRITICAL'?'bg-red-50 border-red-200':a.priority==='HIGH'?'bg-amber-50 border-amber-200':'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{a.icon}</span>
                    <span className={`font-bold ${a.priority==='CRITICAL'?'text--600':a.priority==='HIGH'?'text--600':'text--600'}`}>{a.priority}</span>
                    <span className="text-slate-700 ml-auto">{a.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-1.5">{a.text}</p>
                  <div className="flex gap-1.5">
                    <button onClick={() => { ackAction(a.id); showToast(`✅ Action acknowledged`, true); }}
                      className="flex-1 py-1 rounded bg-green-50 border border-green-200 text--600 font-bold hover:bg-green-600/50 transition-colors text-[10px]">
                      ✓ Execute
                    </button>
                    <button onClick={() => { ackAction(a.id); showToast('⏭ Action deferred'); }}
                      className="py-1 px-2 rounded bg-slate-200/50 border border-slate-300 text-slate-700 hover:bg-slate-200 transition-colors text-[10px]">
                      Defer
                    </button>
                  </div>
                </div>
              ))}
              {actions.every(a => a.acked) && (
                <div className="text-center text--600 text-xs py-3">✅ All actions acknowledged</div>
              )}
            </div>
          </div>

          {/* Multi-Agency Asset Matrix (The Grid) */}
          <div className="p-3">
            <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Shield className="w-3 h-3" /> Multi-Agency Asset Matrix
            </span>
            <div className="space-y-1.5">
              {AGENCIES.map(a => (
                <div key={a.name} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
                  <span className="text-base shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-900 truncate">{a.name}</div>
                    <div className="text-[9px] text-slate-700 font-mono tracking-tight">{a.loc} · {a.freq}</div>
                  </div>
                  <span className={`text-[9px] font-bold shrink-0 ${a.avail > 0 ? 'text--600' : 'text-red-600'}`}>{a.avail > 0 ? `${a.avail} AVAIL` : 'DEPLOYED'}</span>
                  <button onClick={() => dispatch(a)} disabled={a.avail === 0}
                    className="shrink-0 text-[9px] px-2 py-1 rounded bg-blue-100 border border-blue-300 text--600 font-bold hover:bg-blue-200 transition-colors disabled:opacity-50">
                    CALL
                  </button>
                </div>
              ))}
            </div>

            {/* Dispatch log */}
            {dispatchLog.length > 0 && (
              <div className="mt-2 space-y-1">
                {dispatchLog.slice(0,3).map((d,i) => (
                  <div key={i} className="text-[9px] text-slate-700 flex gap-2">
                    <span className="text-slate-700">{d.time}</span>
                    <span className="text--600">✓ {d.agency}</span>
                    <span>contacted</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tribal Dialect Quick-Dispatch Templates */}
          <div className="p-3">
            <span className="text-[11px] font-bold text--600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Volume2 className="w-3 h-3" /> Dialect Quick-Dispatch (PA Radio)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {DIALECTS.map(d => (
                <button key={d.lang} onClick={() => broadcast(d)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-bold transition-all ${broadcastLang===d.lang?'bg-green-100 border-green-200 text-green-800 animate-pulse':'bg-white border-slate-200 text-slate-700 hover:border-green-300 hover:bg-green-50'}`}>
                  <Radio className="w-3 h-3 text-green-600" />
                  <span>{d.lang}</span>
                  <span className="text-slate-700 font-normal text-[9px]">{d.region}</span>
                </button>
              ))}
            </div>
            {broadcastLang && (
              <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-2 py-1.5 text-[10px] text--600 animate-pulse">
                🔊 Broadcasting in {broadcastLang}...
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
      `}</style>
    </div>
  );
}
