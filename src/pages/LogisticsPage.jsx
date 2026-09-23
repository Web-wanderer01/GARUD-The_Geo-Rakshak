import React, { useState, useEffect, useCallback } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { Zap, Package, Wind, AlertTriangle, CheckCircle, Clock, Truck, Anchor, Radio, Shield, Users, MapPin, Navigation, Waves, Route, Battery, Thermometer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ─── DATA ───────────────────────────────────────────────────────────────────

const DRONES = [
  { id:'GHY-01', name:'Garuda-Alpha', hub:'Guwahati', dest:'Dima Hasao', payload:8.4,  maxPay:10, bat:78, eta:'22 min', status:'AIRBORNE',  weather:'✅ Clear',  type:'Supply',  alt:'1240m', spd:'65km/h', cargo:'Dry rations 8.4kg' },
  { id:'SHL-02', name:'Pakhrin-Beta', hub:'Shillong',  dest:'Champhai',   payload:4.1,  maxPay:5,  bat:55, eta:'41 min', status:'AIRBORNE',  weather:'⚠ Gusty',   type:'Medical', alt:'980m',  spd:'52km/h', cargo:'Snake antivenom, cholera vax' },
  { id:'IMP-03', name:'Kangla-Delta', hub:'Imphal',    dest:'Mangan',     payload:3.8,  maxPay:5,  bat:91, eta:'18 min', status:'AIRBORNE',  weather:'✅ Clear',  type:'Medical', alt:'1560m', spd:'71km/h', cargo:'Blood bags, IV fluids' },
  { id:'IMP-04', name:'Loktak-Gamma', hub:'Imphal',    dest:'Jiribam',    payload:9.2,  maxPay:10, bat:34, eta:'RTRN',   status:'RETURNING', weather:'✅ Clear',  type:'Supply',  alt:'420m',  spd:'68km/h', cargo:'Empty — returning for reload' },
  { id:'GHY-05', name:'Siang-Eta',    hub:'Guwahati', dest:'Haflong',     payload:0,    maxPay:10, bat:100,eta:'STANDBY',status:'STANDBY',   weather:'⛈ Storm',  type:'Supply',  alt:'—',     spd:'—',      cargo:'Awaiting weather clearance' },
  { id:'AGT-06', name:'Tawang-Zeta',  hub:'Itanagar', dest:'Tawang',      payload:4.9,  maxPay:5,  bat:67, eta:'58 min', status:'AIRBORNE',  weather:'✅ Clear',  type:'Medical', alt:'3200m', spd:'45km/h', cargo:'High-altitude meds, O2 canisters' },
  { id:'SHL-07', name:'Umiam-Theta',  hub:'Shillong',  dest:'Tura',       payload:7.6,  maxPay:10, bat:82, eta:'29 min', status:'AIRBORNE',  weather:'✅ Clear',  type:'Supply',  alt:'760m',  spd:'60km/h', cargo:'Baby food, water tablets' },
  { id:'GHY-08', name:'Kaziranga-Iota',hub:'Guwahati',dest:'Dhubri',     payload:0,    maxPay:5,  bat:100,eta:'STANDBY',status:'STANDBY',   weather:'⛈ Storm',  type:'Medical', alt:'—',     spd:'—',      cargo:'Awaiting dispatch order' },
];

const FLIGHT_LOG = [
  { id:'FL-2847', drone:'GHY-01', from:'Guwahati Hub', to:'Umrangso Camp', cargo:'Rice 9.5kg, ORS packets', status:'DELIVERED', time:'05:42', dgca:'CLR-2847', iaf:'IAF-N/A' },
  { id:'FL-2846', drone:'IMP-03', from:'Imphal Hub',   to:'Chandel Relief', cargo:'Antivenom 12 vials', status:'DELIVERED', time:'04:58', dgca:'CLR-2846', iaf:'IAF-ATC-07' },
  { id:'FL-2845', drone:'SHL-02', from:'Shillong Hub', to:'Khliehriat Camp', cargo:'Baby food 4.2kg', status:'DELIVERED', time:'04:15', dgca:'CLR-2845', iaf:'IAF-N/A' },
  { id:'FL-2844', drone:'AGT-06', from:'Itanagar Hub', to:'Tawang HAA', cargo:'O2 canisters 2×10L', status:'FAILED', time:'03:30', dgca:'CLR-2844', iaf:'IAF-ATC-03', note:'Engine warning at 3400m — aborted' },
  { id:'FL-2843', drone:'GHY-01', from:'Guwahati Hub', to:'Diphu Hospital', cargo:'Insulin, cholera vax', status:'DELIVERED', time:'02:47', dgca:'CLR-2843', iaf:'IAF-N/A' },
  { id:'FL-2842', drone:'IMP-04', from:'Imphal Hub',   to:'Jiribam Border', cargo:'Dry rations 8.8kg',  status:'DELIVERED', time:'01:55', dgca:'CLR-2842', iaf:'IAF-ATC-12' },
];

const CAMPS = [
  { name:'Guwahati Central', dist:'Kamrup',       state:'AS', cap:2000, occ:1640, water:3.8, rations:6, antivenom:24, vaccine:120, solar:80,  blankets:450,  baby:4, status:'OK' },
  { name:'Silchar Flood Camp', dist:'Cachar',      state:'AS', cap:800,  occ:791,  water:0.9, rations:1, antivenom:4,  vaccine:18,  solar:20,  blankets:60,   baby:0, status:'CRITICAL' },
  { name:'Aizawl Relief Hub',  dist:'Aizawl',     state:'MZ', cap:500,  occ:318,  water:5.1, rations:14,antivenom:40, vaccine:200, solar:95,  blankets:280,  baby:12,status:'OK' },
  { name:'Gangtok Emergency',  dist:'East Sikkim',state:'SK', cap:600,  occ:597,  water:1.2, rations:2, antivenom:8,  vaccine:30,  solar:45,  blankets:85,   baby:1, status:'CRITICAL' },
  { name:'Imphal North Camp',  dist:'Imphal W',   state:'MN', cap:1200, occ:890,  water:3.5, rations:5, antivenom:18, vaccine:90,  solar:70,  blankets:320,  baby:8, status:'WARNING' },
  { name:'Kohima Community',   dist:'Kohima',     state:'NL', cap:400,  occ:210,  water:5.8, rations:16,antivenom:50, vaccine:220, solar:100, blankets:300,  baby:18,status:'OK' },
  { name:'Shillong Complex',   dist:'E.Khasi',    state:'ML', cap:1500, occ:1180, water:2.9, rations:4, antivenom:12, vaccine:55,  solar:60,  blankets:190,  baby:5, status:'WARNING' },
  { name:'Itanagar Airfield',  dist:'Papum Pare', state:'AR', cap:700,  occ:445,  water:4.3, rations:9, antivenom:35, vaccine:160, solar:88,  blankets:360,  baby:10,status:'OK' },
  { name:'Jorhat NDRF Base',   dist:'Jorhat',     state:'AS', cap:900,  occ:240,  water:6.2, rations:22,antivenom:60, vaccine:280, solar:100, blankets:500,  baby:22,status:'OK' },
  { name:'Dimapur Transit',    dist:'Dimapur',    state:'NL', cap:350,  occ:305,  water:2.1, rations:3, antivenom:6,  vaccine:22,  solar:35,  blankets:70,   baby:2, status:'WARNING' },
];

const ROUTES = [
  { id:'NH-10', name:'NH-10 Siliguri–Gangtok', segment:'Rangpo–Singtam', status:'BLOCKED',  agency:'BRO', reason:'Major landslide Km 42', alt:'NH-717A via Rishi', risk:92, airlift:true },
  { id:'NH-06', name:'NH-06 Silchar–Imphal', segment:'Jiribam–Tupul', status:'PARTIAL',   agency:'NHIDCL', reason:'Debris flow, single-lane', alt:'NH-37 via Lumding (+180km)', risk:65, airlift:false },
  { id:'NH-29', name:'NH-29 Dimapur–Kohima', segment:'Zubza–Kohima', status:'OPEN',      agency:'NHIDCL', reason:'Clear, monitoring',  alt:'—', risk:18, airlift:false },
  { id:'NH-02', name:'NH-02 Guwahati–Shillong',segment:'Jorabat–Nongthymmai',status:'PARTIAL',agency:'NHIDCL',reason:'Flooding, slow traffic', alt:'NH-6 via Jowai (+45km)', risk:48, airlift:false },
  { id:'NH-40', name:'NH-40 Shillong–Dawki', segment:'Nongstoin–Baghmara', status:'BLOCKED',agency:'BRO', reason:'Slope failure both sides', alt:'Helicopter only — AIRLIFT', risk:88, airlift:true },
  { id:'NH-54', name:'NH-54 Aizawl–Silchar', segment:'Serchhip–Tamdil', status:'OPEN',   agency:'NHIDCL', reason:'Clear', alt:'—', risk:22, airlift:false },
  { id:'NH-27', name:'NH-27 Assam Ring Road', segment:'Numaligarh–Silapathar', status:'PARTIAL', agency:'NHIDCL', reason:'Brahmaputra flooding', alt:'Inland road via Majuli', risk:55, airlift:false },
  { id:'NH-13', name:'NH-13 Itanagar–Tawang', segment:'Bomdila–Dirang', status:'BLOCKED', agency:'BRO', reason:'GLOF debris — Dirang River', alt:'IAF Mi-17 via Guwahati', risk:95, airlift:true },
];

const ASSETS = [
  { agency:'NDRF',         icon:'🛡️', total:8,  deployed:5, pct:62, jcb:3,  boats:8,  trucks:12, satphone:6  },
  { agency:'SDRF',         icon:'👮', total:12, deployed:4, pct:33, jcb:2,  boats:14, trucks:18, satphone:4  },
  { agency:'Indian Army',  icon:'⚔️', total:6,  deployed:3, pct:50, jcb:8,  boats:6,  trucks:24, satphone:12 },
  { agency:'IAF',          icon:'✈️', total:4,  deployed:2, pct:50, jcb:0,  boats:0,  trucks:4,  satphone:8  },
  { agency:'Medical Corps',icon:'🏥', total:23, deployed:8, pct:35, jcb:0,  boats:2,  trucks:16, satphone:10 },
  { agency:'Dist. Admin',  icon:'🏛️', total:42, deployed:18,pct:43, jcb:12, boats:10, trucks:38, satphone:20 },
  { agency:'NGOs (NER)',   icon:'🤝', total:28, deployed:11,pct:39, jcb:1,  boats:5,  trucks:22, satphone:2  },
];

const STATUS_MAP = {
  AIRBORNE:'bg-green-50 text--600 border-green-200',
  RETURNING:'bg-blue-50 text--600 border-blue-200',
  STANDBY: 'bg-amber-50 text--600 border-amber-200',
  DELIVERED:'bg-green-50 text--600 border-green-200',
  FAILED:   'bg-red-50   text--600   border-red-200',
  BLOCKED:  'bg-red-50   text--600   border-red-200',
  PARTIAL:  'bg-amber-50 text--600 border-amber-200',
  OPEN:     'bg-green-50 text--600 border-green-200',
  CRITICAL: 'border-red-200 bg-red-50',
  WARNING:  'border-amber-200 bg-amber-50',
  OK:       'border-slate-200',
};

const TABS = [
  { id:'drones',    label:'🚁 Drone Tracking',      icon:Zap },
  { id:'camps',     label:'⛺ Relief Camps',          icon:Package },
  { id:'routes',    label:'🛣️ Route Status',          icon:Route },
  { id:'assets',    label:'🤝 Resource Pooling',      icon:Shield },
];

const PIE_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];

export default function LogisticsPage() {
  const [tab, setTab]         = useState('drones');
  const [drones, setDrones]   = useState(DRONES.map(d => ({ ...d })));
  const [camps,  setCamps]    = useState(CAMPS.map(c => ({ ...c })));
  const [flightLog, setFlightLog] = useState(FLIGHT_LOG);
  const [routeFilter, setRouteFilter] = useState('ALL');
  const [dispatchModal, setDispatchModal] = useState(null);
  const [toast, setToast]     = useState('');
  const [selectedDrone, setSelectedDrone] = useState(null);

  // Live drone battery drain & ETA countdown
  useEffect(() => {
    const t = setInterval(() => {
      setDrones(prev => prev.map(d => {
        if (d.status !== 'AIRBORNE') return d;
        return { ...d, bat: Math.max(10, d.bat - 0.3) };
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Live camp occupancy drift
  useEffect(() => {
    const t = setInterval(() => {
      setCamps(prev => prev.map(c => ({
        ...c,
        occ: Math.min(c.cap, Math.max(0, c.occ + Math.floor(Math.random() * 7) - 3)),
        water: Math.max(0, +(c.water - 0.01).toFixed(2)),
        rations: Math.max(0, +(c.rations - 0.005).toFixed(3)),
      })));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const dispatchDrone = (drone) => {
    setDrones(prev => prev.map(d => d.id === drone.id ? { ...d, status: 'AIRBORNE', bat: 100 } : d));
    const newEntry = {
      id: `FL-${2848 + flightLog.length}`, drone: drone.id,
      from: drone.hub + ' Hub', to: drone.dest + ' Camp',
      cargo: drone.cargo, status: 'IN_FLIGHT',
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      dgca: `CLR-${2848 + flightLog.length}`, iaf: 'IAF-ATC-PENDING',
    };
    setFlightLog(prev => [newEntry, ...prev]);
    showToast(`✅ ${drone.name} dispatched from ${drone.hub} → ${drone.dest}`);
    setDispatchModal(null);
  };

  const filteredRoutes = routeFilter === 'ALL' ? ROUTES : ROUTES.filter(r => r.status === routeFilter);

  const campOccData = camps.slice(0,6).map(c => ({ name: c.name.split(' ')[0], pct: Math.round(c.occ/c.cap*100) }));
  const assetPieData = ASSETS.map(a => ({ name: a.agency, value: a.deployed }));

  return (
    <div className="logistics-page page-enter relative min-h-screen bg-slate-50 pb-10">
      <BackgroundAnimation variant="pulse" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />{toast}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-5">
        {/* Header */}
        <FadeIn direction="down">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-black text-slate-900">📦 GARUD Logistics Hub</h1>
              <p className="text-slate-700 text-sm">Drone Tracking · Relief Camps · Routes · Resource Pooling · NER</p>
            </div>
            <SimulatedDataBadge />
          </div>
        </FadeIn>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner overflow-x-auto hide-scrollbar w-full sm:w-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ease-out whitespace-nowrap ${
                tab === t.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-500 scale-100' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white/80 scale-95 opacity-90 hover:opacity-100 hover:scale-100'
              }`}>
              <span className="flex items-center gap-2">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════ TAB: DRONES ═══════════════ */}
        {tab === 'drones' && (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Airborne',   val: drones.filter(d=>d.status==='AIRBORNE').length,  color:'text--600', bg:'border-green-200' },
                { label:'Returning',  val: drones.filter(d=>d.status==='RETURNING').length, color:'text--600',  bg:'border-blue-200' },
                { label:'Standby',    val: drones.filter(d=>d.status==='STANDBY').length,   color:'text--600', bg:'border-amber-200' },
                { label:'Total Sorties Today', val: flightLog.filter(f=>f.status==='DELIVERED').length, color:'text--600', bg:'border-purple-200' },
              ].map(s => (
                <div key={s.label} className={`bg-slate-50 backdrop-blur rounded-xl border ${s.bg} p-4 text-center`}>
                  <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-slate-700 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Drone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {drones.map(d => (
                <div key={d.id} onClick={() => setSelectedDrone(d)}
                  className={`bg-slate-50 backdrop-blur rounded-xl border cursor-pointer hover:border-blue-200 transition-all ${STATUS_MAP[d.status]}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-sm">{d.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_MAP[d.status]}`}>{d.status}</span>
                    </div>
                    <div className="text-xs text-slate-700 mb-1">🏠 {d.hub} → 📍 {d.dest}</div>
                    <div className="text-xs text-slate-700 mb-3 leading-snug">📦 {d.cargo}</div>
                    <div className="space-y-1.5">
                      {/* Battery */}
                      <div className="flex items-center gap-2">
                        <Battery className="w-3 h-3 text-slate-700 shrink-0" />
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all duration-1000"
                            style={{ width:`${d.bat}%`, background: d.bat < 25 ? '#ef4444' : d.bat < 50 ? '#f59e0b' : '#10b981' }} />
                        </div>
                        <span className="text-[10px] text-slate-700 w-8 text-right">{Math.round(d.bat)}%</span>
                      </div>
                      {/* Payload */}
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-slate-700 shrink-0" />
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-blue-500"
                            style={{ width:`${(d.payload/d.maxPay)*100}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-700 w-12 text-right">{d.payload}/{d.maxPay}kg</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-700">
                      <span>⏱ ETA: <span className="text-slate-900 font-semibold">{d.eta}</span></span>
                      <span>🌤 {d.weather}</span>
                      <span>📡 {d.alt}</span>
                      <span>💨 {d.spd}</span>
                    </div>
                    {d.status === 'STANDBY' && (
                      <button onClick={(e) => { e.stopPropagation(); setDispatchModal(d); }}
                        className="mt-3 w-full py-1.5 rounded-lg bg-blue-50 border border-blue-200 text--600 text-xs font-bold hover:bg-blue-600/60 transition-colors">
                        🚀 Dispatch Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Flight Log with DGCA / IAF Clearance */}
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">📋 Automated Flight Log — DGCA / IAF Clearances</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="text-xs text-slate-700 uppercase border-b border-slate-300/50">
                      <th className="text-left pb-2 pr-3">Flight ID</th>
                      <th className="text-left pb-2 pr-3">Drone</th>
                      <th className="text-left pb-2 pr-3">Route</th>
                      <th className="text-left pb-2 pr-3">Cargo</th>
                      <th className="text-left pb-2 pr-3">DGCA CLR</th>
                      <th className="text-left pb-2 pr-3">IAF Coord</th>
                      <th className="text-left pb-2 pr-3">Time</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {flightLog.map(f => (
                      <tr key={f.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 pr-3 font-mono text-xs text--600">{f.id}</td>
                        <td className="py-2 pr-3 text-xs text-slate-700">{f.drone}</td>
                        <td className="py-2 pr-3 text-xs text-slate-700">{f.from.split(' ')[0]} → {f.to.split(' ')[0]}</td>
                        <td className="py-2 pr-3 text-xs text-slate-700 max-w-[140px] truncate">{f.cargo}</td>
                        <td className="py-2 pr-3 text-xs text--600 font-mono">{f.dgca}</td>
                        <td className="py-2 pr-3 text-xs text--600 font-mono">{f.iaf}</td>
                        <td className="py-2 pr-3 text-xs text-slate-700">{f.time}</td>
                        <td className="py-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_MAP[f.status] || 'text-slate-700 border-slate-600'}`}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB: CAMPS ═══════════════ */}
        {tab === 'camps' && (
          <div className="space-y-5">
            {/* Alert strip */}
            {camps.filter(c => c.status === 'CRITICAL').length > 0 && (
              <div className="bg-red-500/10 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text--600 shrink-0" />
                <span className="text-sm text--600 font-semibold">
                  🚨 CRITICAL: {camps.filter(c=>c.status==='CRITICAL').map(c=>c.name).join(' & ')} — immediate resupply required
                </span>
              </div>
            )}

            {/* Camp occupancy chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
                <h2 className="font-bold text-slate-900 mb-4">📊 Camp Occupancy Heatmap</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campOccData} margin={{left:-20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{fill:'#94a3b8', fontSize:9}} />
                      <YAxis tick={{fill:'#94a3b8', fontSize:9}} domain={[0,100]} unit="%" />
                      <Tooltip contentStyle={{background:'#ffffff',border:'1px solid #cbd5e1',borderRadius:'8px',color:'#1e293b'}} formatter={v=>[`${v}%`,'Occupancy']} />
                      <Bar dataKey="pct" radius={[4,4,0,0]} fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
                <h2 className="font-bold text-slate-900 mb-4">🔴 Low-Stock Alerts</h2>
                <div className="space-y-2">
                  {camps.filter(c => c.water < 2 || c.rations < 3 || c.antivenom < 10 || c.baby < 2).map(c => (
                    <div key={c.name} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <AlertTriangle className="w-4 h-4 text--600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text--600">{c.name}</span>
                        <div className="flex gap-2 flex-wrap mt-0.5">
                          {c.water < 2 && <span className="text-[10px] bg-red-50 text--600 px-2 py-0.5 rounded-full">💧 Water {c.water}L/pp</span>}
                          {c.rations < 3 && <span className="text-[10px] bg-red-50 text--600 px-2 py-0.5 rounded-full">🍱 Rations {c.rations}d</span>}
                          {c.antivenom < 10 && <span className="text-[10px] bg-red-50 text--600 px-2 py-0.5 rounded-full">🐍 Antivenom {c.antivenom} vials</span>}
                          {c.baby < 2 && <span className="text-[10px] bg-red-50 text--600 px-2 py-0.5 rounded-full">👶 Baby food {c.baby}d</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {camps.every(c => c.water >= 2 && c.rations >= 3 && c.antivenom >= 10 && c.baby >= 2) && (
                    <div className="text-center text--600 py-4 text-sm">✅ All stocks above critical threshold</div>
                  )}
                </div>
              </div>
            </div>

            {/* Full camp inventory grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {camps.map(c => {
                const occ = Math.round(c.occ/c.cap*100);
                return (
                  <div key={c.name} className={`bg-slate-50 backdrop-blur rounded-xl border p-4 ${STATUS_MAP[c.status]}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-xs text-slate-700">{c.dist} · {c.state}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${c.status==='CRITICAL'?'bg-red-50 text--600 border-red-200':c.status==='WARNING'?'bg-amber-50 text--600 border-amber-200':'bg-green-50 text--600 border-green-200'}`}>{c.status}</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-700 mb-1"><span>Occupancy</span><span className="text-slate-900">{c.occ}/{c.cap} ({occ}%)</span></div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{width:`${occ}%`,background:occ>90?'#ef4444':occ>75?'#f59e0b':'#10b981'}} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {[
                        { icon:'💧', label:'Water', val:`${c.water}L/pp`, warn: c.water < 2 },
                        { icon:'🍱', label:'Rations', val:`${c.rations}d`, warn: c.rations < 3 },
                        { icon:'🐍', label:'Antivenom', val:`${c.antivenom} vials`, warn: c.antivenom < 10 },
                        { icon:'💉', label:'Vaccine', val:`${c.vaccine} doses`, warn: c.vaccine < 30 },
                        { icon:'☀️', label:'Solar', val:`${c.solar}%`, warn: c.solar < 30 },
                        { icon:'🛏️', label:'Blankets', val:`${c.blankets}`, warn: c.blankets < 100 },
                        { icon:'👶', label:'Baby food', val:`${c.baby}d`, warn: c.baby < 2 },
                      ].map(item => (
                        <div key={item.label} className={`flex items-center gap-1 p-1.5 rounded-lg ${item.warn ? 'bg-red-50 text--600' : 'bg-white text-slate-700'}`}>
                          <span>{item.icon}</span><span>{item.label}: </span><span className="font-semibold">{item.val}</span>
                          {item.warn && <span className="ml-auto text--600">⚠</span>}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => showToast(`📦 Resupply request sent for ${c.name}`)}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold bg-blue-600/30 border border-blue-200 text--600 hover:bg-blue-600/50 transition-colors">
                      📤 Request Resupply
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════ TAB: ROUTES ═══════════════ */}
        {tab === 'routes' && (
          <div className="space-y-5">
            <div className="flex gap-3 flex-wrap items-center w-full">
              <span className="text-sm font-bold text-slate-700 hidden sm:block">Filter:</span>
              <div className="inline-flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner overflow-x-auto hide-scrollbar">
                {['ALL','OPEN','PARTIAL','BLOCKED'].map(f => (
                  <button key={f} onClick={() => setRouteFilter(f)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ease-out whitespace-nowrap ${
                      routeFilter === f 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-indigo-500 scale-100' 
                        : 'text-slate-600 hover:text-indigo-700 hover:bg-white/80 scale-95 opacity-90 hover:opacity-100'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3 h-3"/>{ROUTES.filter(r=>r.airlift).length} Airlift-only zones
              </span>
            </div>

            <div className="space-y-3">
              {filteredRoutes.map(r => (
                <div key={r.id} className={`bg-slate-50 backdrop-blur rounded-xl border p-4 ${r.status==='BLOCKED'?'border-red-200':r.status==='PARTIAL'?'border-amber-200':'border-green-200'}`}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_MAP[r.status]}`}>{r.status}</span>
                        {r.airlift && <span className="text-xs bg-purple-500/20 text--600 border border-purple-200 px-2 py-0.5 rounded-full font-bold animate-pulse">🚁 AIRLIFT ONLY</span>}
                        <span className="text-xs text-slate-700">{r.agency}</span>
                      </div>
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-700 mt-0.5">Segment: {r.segment}</div>
                      <div className={`text-xs mt-1 ${r.status==='BLOCKED'?'text--600':r.status==='PARTIAL'?'text--600':'text--600'}`}>
                        ⚠ {r.reason}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700">Risk:</span>
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{width:`${r.risk}%`,background:r.risk>75?'#ef4444':r.risk>45?'#f59e0b':'#10b981'}} />
                        </div>
                        <span className={`text-xs font-bold ${r.risk>75?'text--600':r.risk>45?'text--600':'text--600'}`}>{r.risk}</span>
                      </div>
                      {r.alt !== '—' && (
                        <div className="text-right">
                          <div className="text-[10px] text-slate-700">AI Alternative Route:</div>
                          <div className="text-xs text--600 font-medium max-w-[180px] text-right">{r.alt}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Route Calculator */}
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-indigo-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Navigation className="w-5 h-5 text--600"/> AI Detour Calculator — Active Hazard Avoidance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-700 mb-1 block">Origin District</label>
                  <select className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-200">
                    {['Guwahati','Shillong','Imphal','Aizawl','Itanagar','Gangtok','Kohima','Agartala'].map(x=><option key={x}>{x}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-700 mb-1 block">Destination</label>
                  <select className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-200">
                    {['Dima Hasao','Champhai','Mangan','Tawang','Pherzawl','Ukhrul','Haflong','Nongstoin'].map(x=><option key={x}>{x}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => showToast('🛣 AI Route: Via NH-27 → NH-36 → District Road CR-4. Avoids: Brahmaputra flood zone. ETA: 6h 40m. Risk: 32/100')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all">
                    ⚡ Calculate Safe Route
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-700 mb-2">Active Hazard Zones Being Avoided:</div>
                <div className="flex flex-wrap gap-2">
                  {['🌊 Brahmaputra flood (Dhubri–Goalpara)','🏔️ NH-10 landslide (Rangpo)','⛰️ NH-40 slope failure','🌧️ NH-13 GLOF debris','💧 Barak river overflow (Cachar)'].map(h => (
                    <span key={h} className="text-xs bg-red-50 border border-red-200 text--600 px-2 py-1 rounded-lg">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB: ASSETS ═══════════════ */}
        {tab === 'assets' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Pie chart */}
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
                <h2 className="font-bold text-slate-900 mb-4">📊 Deployed Teams by Agency</h2>
                <div className="flex items-center gap-4">
                  <div className="h-44 w-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={assetPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {assetPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{background:'#ffffff',border:'1px solid #cbd5e1',color:'#1e293b',borderRadius:'8px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    {assetPieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{background:PIE_COLORS[i]}} />
                        <span className="text-xs text-slate-700 flex-1">{d.name}</span>
                        <span className="text-xs font-bold text-slate-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
                <h2 className="font-bold text-slate-900 mb-4">🔧 Total Asset Pool — NER Region</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon:'🚜', label:'JCB / Excavators', val: ASSETS.reduce((s,a)=>s+a.jcb,0) },
                    { icon:'🚤', label:'Amphibian Boats',  val: ASSETS.reduce((s,a)=>s+a.boats,0) },
                    { icon:'🚛', label:'Relief Trucks',    val: ASSETS.reduce((s,a)=>s+a.trucks,0) },
                    { icon:'📡', label:'Satellite Phones', val: ASSETS.reduce((s,a)=>s+a.satphone,0) },
                  ].map(x => (
                    <div key={x.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                      <div className="text-3xl mb-1">{x.icon}</div>
                      <div className="text-2xl font-black text--600">{x.val}</div>
                      <div className="text-xs text-slate-700 mt-0.5">{x.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full agency table */}
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
              <h2 className="font-bold text-slate-900 mb-4">🤝 Agency Resource Matrix — Live Deployment</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="text-xs text-slate-700 uppercase border-b border-slate-300/50">
                      <th className="text-left pb-2 pr-4">Agency</th>
                      <th className="text-left pb-2 pr-4">Teams</th>
                      <th className="text-left pb-2 pr-4">Deploy %</th>
                      <th className="text-center pb-2 pr-4">JCBs</th>
                      <th className="text-center pb-2 pr-4">Boats</th>
                      <th className="text-center pb-2 pr-4">Trucks</th>
                      <th className="text-center pb-2">Sat Phones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {ASSETS.map(a => (
                      <tr key={a.agency} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-bold text-slate-900">{a.icon} {a.agency}</td>
                        <td className="py-3 pr-4 text-slate-700">{a.deployed}/{a.total}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div className="h-2 rounded-full" style={{width:`${a.pct}%`,background:a.pct>70?'#ef4444':a.pct>40?'#f59e0b':'#10b981'}} />
                            </div>
                            <span className="text-xs text-slate-700">{a.pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-center text-slate-700">{a.jcb}</td>
                        <td className="py-3 pr-4 text-center text-slate-700">{a.boats}</td>
                        <td className="py-3 pr-4 text-center text-slate-700">{a.trucks}</td>
                        <td className="py-3 text-center text-slate-700">{a.satphone}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-600 font-black text--600">
                      <td className="py-2 pr-4">TOTAL</td>
                      <td className="py-2 pr-4">{ASSETS.reduce((s,a)=>s+a.deployed,0)}/{ASSETS.reduce((s,a)=>s+a.total,0)}</td>
                      <td className="py-2 pr-4 text-xs text-slate-700">—</td>
                      <td className="py-2 pr-4 text-center">{ASSETS.reduce((s,a)=>s+a.jcb,0)}</td>
                      <td className="py-2 pr-4 text-center">{ASSETS.reduce((s,a)=>s+a.boats,0)}</td>
                      <td className="py-2 pr-4 text-center">{ASSETS.reduce((s,a)=>s+a.trucks,0)}</td>
                      <td className="py-2 text-center">{ASSETS.reduce((s,a)=>s+a.satphone,0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDispatchModal(null)}>
          <div className="bg-slate-50 border border-blue-200 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-1">🚀 Dispatch Drone</h3>
            <p className="text-slate-700 text-sm mb-4">{dispatchModal.name} — {dispatchModal.hub} → {dispatchModal.dest}</p>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between"><span className="text-slate-700">Payload</span><span className="text-slate-900">{dispatchModal.maxPay}kg capacity</span></div>
              <div className="flex justify-between"><span className="text-slate-700">Cargo</span><span className="text-slate-900 text-right max-w-[200px]">{dispatchModal.cargo}</span></div>
              <div className="flex justify-between"><span className="text-slate-700">Weather</span><span className="text-slate-900">{dispatchModal.weather}</span></div>
              <div className="flex justify-between"><span className="text-slate-700">Battery</span><span className="text--600">{dispatchModal.bat}% — Full</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDispatchModal(null)} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-600 transition-colors">Cancel</button>
              <button onClick={() => dispatchDrone(dispatchModal)} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black transition-all">
                ✅ Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
