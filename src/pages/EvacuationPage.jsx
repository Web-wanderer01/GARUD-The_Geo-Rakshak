import React, { useState, useEffect } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { MapPin, Route, Users, Package, Droplets, Heart, Truck, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const SOURCES = ['Imphal','Silchar','Agartala','Guwahati','Kohima','Aizawl','Itanagar','Gangtok','Shillong','Jorhat'];
const CAMPS_LIST = ['Guwahati Central Camp','Silchar Flood Camp','Aizawl Relief Hub','Gangtok Emergency Shelter',
  'Imphal North Camp','Kohima Community Hall','Shillong Sports Complex','Itanagar Airfield Camp',
  'Jorhat NDRF Base','Tezpur Relief Center','Dimapur Transit Camp','Agartala Stadium Camp'];

const ROUTES_DATA = {
  'Imphal|Guwahati Central Camp': { via:['Jiribam','Silchar','Lumding','Guwahati'], blocked:[1], dist:'487 km', eta:'9h 20m', risk:72 },
  'Imphal|Silchar Flood Camp':    { via:['Jiribam','Silchar'], blocked:[], dist:'238 km', eta:'5h 10m', risk:45 },
  'Kohima|Guwahati Central Camp': { via:['Dimapur','Lumding','Guwahati'], blocked:[], dist:'402 km', eta:'8h 00m', risk:38 },
  'Gangtok|Guwahati Central Camp':{ via:['Rangpo','Siliguri','Guwahati'], blocked:[0], dist:'370 km', eta:'7h 30m', risk:88 },
  'Shillong|Guwahati Central Camp':{ via:['Jorabat','Guwahati'], blocked:[], dist:'98 km', eta:'2h 10m', risk:25 },
  'Aizawl|Silchar Flood Camp':    { via:['Serchhip','Silchar'], blocked:[], dist:'175 km', eta:'4h 00m', risk:40 },
  'Itanagar|Jorhat NDRF Base':    { via:['Naharlagun','North Lakhimpur','Jorhat'], blocked:[1], dist:'312 km', eta:'6h 40m', risk:65 },
};

const CAMPS = [
  { name:'Guwahati Central Camp',   dist:'Kamrup',       state:'Assam',    cap:2000, occ:1420, food:8,  water:4.2, kits:120, status:'OPERATIONAL' },
  { name:'Silchar Flood Camp',       dist:'Cachar',       state:'Assam',    cap:800,  occ:774,  food:2,  water:2.1, kits:34,  status:'CRITICAL_SUPPLY' },
  { name:'Aizawl Relief Hub',        dist:'Aizawl',       state:'Mizoram',  cap:500,  occ:312,  food:12, water:5.0, kits:67,  status:'OPERATIONAL' },
  { name:'Gangtok Emergency Shelter',dist:'East Sikkim',  state:'Sikkim',   cap:600,  occ:589,  food:1,  water:1.8, kits:12,  status:'AT_CAPACITY' },
  { name:'Imphal North Camp',        dist:'Imphal West',  state:'Manipur',  cap:1200, occ:876,  food:5,  water:3.5, kits:88,  status:'OPERATIONAL' },
  { name:'Kohima Community Hall',    dist:'Kohima',       state:'Nagaland', cap:400,  occ:201,  food:14, water:5.5, kits:45,  status:'OPERATIONAL' },
  { name:'Shillong Sports Complex',  dist:'East Khasi',   state:'Meghalaya',cap:1500, occ:1100, food:4,  water:3.8, kits:102, status:'OPERATIONAL' },
  { name:'Itanagar Airfield Camp',   dist:'Papum Pare',   state:'Arunachal',cap:700,  occ:432,  food:9,  water:4.0, kits:78,  status:'OPERATIONAL' },
  { name:'Jorhat NDRF Base',         dist:'Jorhat',       state:'Assam',    cap:900,  occ:234,  food:20, water:6.0, kits:156, status:'OPERATIONAL' },
  { name:'Tezpur Relief Center',     dist:'Sonitpur',     state:'Assam',    cap:600,  occ:521,  food:3,  water:2.9, kits:41,  status:'AT_CAPACITY' },
  { name:'Dimapur Transit Camp',     dist:'Dimapur',      state:'Nagaland', cap:350,  occ:298,  food:6,  water:3.2, kits:55,  status:'OPERATIONAL' },
  { name:'Agartala Stadium Camp',    dist:'West Tripura', state:'Tripura',  cap:2500, occ:1876, food:7,  water:4.1, kits:134, status:'OPERATIONAL' },
];

const DRONES = [
  { name:'Guwahati → Tawang', payload:'Medicine 4.2kg', status:'ACTIVE',  drone:'HELI-1', eta:'95 min', prog:34 },
  { name:'Silchar → Jiribam', payload:'Blood Bags 1.8kg',status:'ACTIVE',  drone:'HELI-2', eta:'38 min', prog:67 },
  { name:'Imphal → Churachandpur', payload:'Food Packs 8kg', status:'STANDBY', drone:'5 ready', eta:'-',     prog:0 },
  { name:'Dimapur → Khonsa', payload:'Rescue Kit 6kg', status:'STANDBY', drone:'4 ready', eta:'-',     prog:0 },
];

const STATUS_BADGE = {
  OPERATIONAL:    'bg-green-50 text--600 border-green-200',
  AT_CAPACITY:    'bg-amber-50 text--600 border-amber-200',
  CRITICAL_SUPPLY:'bg-red-50   text--600   border-red-200',
};

export default function EvacuationPage() {
  const [src, setSrc]       = useState('Imphal');
  const [dst, setDst]       = useState('Guwahati Central Camp');
  const [result, setResult] = useState(null);
  const [camps, setCamps]   = useState(CAMPS);
  const [dronesProg, setDronesProg] = useState(DRONES);

  // Live occupancy updates
  useEffect(() => {
    const t = setInterval(() => {
      setCamps(prev => prev.map(c => ({ ...c, occ: Math.min(c.cap, Math.max(0, c.occ + Math.floor(Math.random()*7)-3)) })));
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // Drone progress
  useEffect(() => {
    const t = setInterval(() => {
      setDronesProg(prev => prev.map(d => d.status === 'ACTIVE' ? { ...d, prog: Math.min(100, d.prog + 0.5) } : d));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const calcRoute = () => {
    const key = `${src}|${dst}`;
    const r = ROUTES_DATA[key] || { via:[src,'NH-37','Lumding',dst.split(' ')[0]], blocked:[1], dist:'320 km', eta:'6h 45m', risk:55 };
    setResult(r);
  };

  return (
    <div className="page-enter relative pb-10 bg-white min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-8">

        <FadeIn direction="down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">🚌 Evacuation & Routing</h1>
              <p className="text-slate-700 text-sm">AI Route Optimizer · Relief Camp Inventory · BVLOS Drones</p>
            </div>
            <SimulatedDataBadge />
          </div>
        </FadeIn>

        {/* Route Optimizer */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-blue-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Route className="w-5 h-5 text--600"/> AI Route Optimizer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-700 uppercase mb-1 block">Source</label>
                <select value={src} onChange={e=>setSrc(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:border-blue-200 outline-none">
                  {SOURCES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 uppercase mb-1 block">Destination (Relief Camp)</label>
                <select value={dst} onChange={e=>setDst(e.target.value)} className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:border-blue-200 outline-none">
                  {CAMPS_LIST.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={calcRoute} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95">
                  ⚡ Calculate Safe Route
                </button>
              </div>
            </div>

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text--600 mb-3 uppercase">✅ Recommended Route</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {result.via.map((wp, i) => (
                      <React.Fragment key={wp}>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${result.blocked.includes(i) ? 'bg-red-50 text--600 border-red-200 line-through' : 'bg-blue-50 text--600 border-blue-200'}`}>
                          {result.blocked.includes(i) ? '🚫' : '📍'} {wp}
                        </span>
                        {i < result.via.length-1 && <span className="text-slate-700">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  {result.blocked.length > 0 && (
                    <div className="mt-2 text-xs text--600">⚠ Red nodes are BLOCKED — route avoids via NH-54</div>
                  )}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text--600 mb-3 uppercase">📊 Route Details</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[{label:'Distance', val:result.dist},{label:'ETA', val:result.eta},{label:'Risk Score', val:`${result.risk}/100`}].map(s=>(
                      <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                        <div className={`text-lg font-black ${result.risk>70?'text--600':result.risk>50?'text--600':'text--600'}`}>{s.val}</div>
                        <div className="text-xs text-slate-700">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Relief Camp Inventory */}
        <FadeIn>
          <h2 className="text-lg font-bold text-slate-900">🏕️ Relief Camp Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {camps.map(c => {
              const pct = Math.round((c.occ/c.cap)*100);
              return (
                <div key={c.name} className="bg-slate-50 backdrop-blur rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">{c.name}</div>
                      <div className="text-xs text-slate-700">{c.dist} · {c.state}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${STATUS_BADGE[c.status]}`}>{c.status.replace('_',' ')}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-700 mb-1"><span>Occupancy</span><span className="text-slate-900 font-mono">{c.occ}/{c.cap} ({pct}%)</span></div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-500" style={{width:`${pct}%`,background:pct>90?'#ef4444':pct>70?'#f59e0b':'#10b981'}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div className={`text-center p-1.5 rounded-lg ${c.food<3?'bg-red-50 text--600':c.food<7?'bg-amber-50 text--600':'bg-green-50 text--600'}`}>
                      🍱 {c.food}d food
                    </div>
                    <div className={`text-center p-1.5 rounded-lg ${c.water<2?'bg-red-50 text--600':'bg-blue-50 text--600'}`}>
                      💧 {c.water}L/pp
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-pink-900/20 text-pink-300">
                      ❤️ {c.kits} kits
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* BVLOS Drone Corridors */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">🚁 BVLOS Drone Corridor Tracker</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dronesProg.map(d => (
                <div key={d.name} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">🚁 {d.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${d.status==='ACTIVE'?'bg-green-50 text--600 border-green-200 animate-pulse':'bg-slate-200/50 text-slate-700 border-slate-600/40'}`}>{d.status}</span>
                  </div>
                  <div className="text-xs text-slate-700 mb-3">{d.payload} · Drone: {d.drone} {d.eta!=='-'&&`· ETA ${d.eta}`}</div>
                  {d.status==='ACTIVE' && (
                    <>
                      <div className="flex justify-between text-xs text-slate-700 mb-1"><span>Flight Progress</span><span className="text-slate-900">{Math.round(d.prog)}%</span></div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000" style={{width:`${d.prog}%`}} />
                      </div>
                    </>
                  )}
                  {d.status==='STANDBY' && <div className="text-xs text--600">⏳ Awaiting dispatch authorization</div>}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
