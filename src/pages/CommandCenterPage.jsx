import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Shield, Radio, Truck, Wind, Thermometer, Activity, Zap, CheckCircle, Bell, Users, Map, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

const TICKER_ITEMS = [
  { color: 'text--600',   text: '🔴 CRITICAL: NH-10 landslide risk HIGH — Rangpo Km 42 — Sensor AS-01 vibration 94/100' },
  { color: 'text--600', text: '🟡 ALERT: Brahmaputra water level rising +0.15m/hr at Pasighat' },
  { color: 'text--600', text: '🟢 NDRF Team Alpha deployed to Cherrapunji — ETA 45 min' },
  { color: 'text--600',   text: '🔴 GLOF WARNING: Teesta upstream sensor RG-01 at 87% threshold — Sikkim' },
  { color: 'text--600', text: '🟡 IMD: Heavy rainfall warning Arunachal Pradesh — 48hrs — Red Alert' },
  { color: 'text--600',   text: '🔴 CRITICAL: Tupul acoustic sensor 96/100 — landslide imminent — Manipur' },
  { color: 'text--600', text: '🟢 Drone DC-02 completed blood delivery to Jiribam Relief Camp' },
  { color: 'text--600', text: '🟡 Seismic: 3.2M tremor detected near Manipur-Myanmar border 06:42 IST' },
  { color: 'text--600',   text: '🔴 NH-06 Dima Hasao: Road blocked by debris flow — alternate via NH-27' },
  { color: 'text--600', text: '🟡 IMD Radar: Cyclonic circulation forming over Bay of Bengal — Tripura watch' },
  { color: 'text--600', text: '🟢 LoRaWAN Node LR-05 Longwa village: SOS cleared — rescue team arrived' },
  { color: 'text--600',   text: '🔴 GLOF: South Lhonak Lake monitoring — satellite imagery shows 2m level rise' },
  { color: 'text--600', text: '🟡 River Lohit at Wakro: 5.5m / 6.0m threshold — rising 0.15m/hr' },
  { color: 'text--600', text: '🟢 SDRF Boat Squadron 3: Rescued 47 persons from Brahmaputra floodplain' },
  { color: 'text--600',   text: '🔴 Cherrapunji acoustic sensor AC-013: East Jaintia Hills vibration spike 81/100' },
];

const INCIDENT_POOL = [
  { sev: 'CRITICAL', icon: '🏔️', text: 'Landslide on NH-10 near Singtam — 3 vehicles trapped', state: 'Sikkim' },
  { sev: 'HIGH',     icon: '🌊', text: 'Brahmaputra embankment breach near Dhubri — 200 families displaced', state: 'Assam' },
  { sev: 'CRITICAL', icon: '⛰️', text: 'GLOF warning: Teesta River rising rapidly — evacuate downstream', state: 'Sikkim' },
  { sev: 'HIGH',     icon: '🛣️', text: 'NH-29 blocked by rockfall near Kohima — traffic diverted', state: 'Nagaland' },
  { sev: 'MEDIUM',   icon: '🚁', text: 'IAF Mi-17 completed supply drop to Tawang — 2.4 tonnes delivered', state: 'Arunachal' },
  { sev: 'HIGH',     icon: '💧', text: 'Flash flood warning: Barak Valley — water level rising fast', state: 'Assam' },
  { sev: 'CRITICAL', icon: '📡', text: 'Acoustic sensor AC-015 Mangan: vibration 89/100 — evacuate slope', state: 'Sikkim' },
  { sev: 'MEDIUM',   icon: '🏕️', text: 'Silchar relief camp at 97% capacity — requesting transfer to Guwahati', state: 'Assam' },
  { sev: 'HIGH',     icon: '🌧️', text: 'IMD: Red alert rainfall warning for West Kameng, Arunachal — 200mm/24hr', state: 'Arunachal' },
  { sev: 'MEDIUM',   icon: '🚛', text: 'Supply convoy delayed at Nathu La — fog conditions improving', state: 'Sikkim' },
  { sev: 'HIGH',     icon: '🆘', text: 'Village Pherzawl cut off — LoRaWAN SOS received — SDRF dispatched', state: 'Manipur' },
  { sev: 'CRITICAL', icon: '🌁', text: 'Mudslide blocks Imphal-Moreh highway — international supply chain impact', state: 'Manipur' },
];

const DISTRICT_RISK = [
  { state: 'Assam', risk: 72 }, { state: 'Meghalaya', risk: 85 },
  { state: 'Manipur', risk: 91 }, { state: 'Mizoram', risk: 45 },
  { state: 'Nagaland', risk: 68 }, { state: 'Tripura', risk: 38 },
  { state: 'Arunachal', risk: 79 }, { state: 'Sikkim', risk: 88 },
];

const QUICK_LINKS = [
  { label: 'Live Map',      path: '/map',          icon: Map },
  { label: 'Sensors',       path: '/sensors',       icon: Radio },
  { label: 'Evacuation',    path: '/evacuation',    icon: Truck },
  { label: 'Coordination',  path: '/coordination',  icon: Shield },
  { label: 'CommHub',       path: '/dialects',      icon: Users },
];

const SEV_STYLE = {
  CRITICAL: 'bg-red-50 text--600 border-red-200',
  HIGH:     'bg-amber-50 text--600 border-amber-200',
  MEDIUM:   'bg-blue-50 text--600 border-blue-200',
};

export default function CommandCenterPage() {
  const [widgets, setWidgets] = useState({ alerts: 14, ndrf: 8, sensors: 47, drones: 5, rainfall: 87, temp: 18, seismic: 3 });
  const [incidents, setIncidents] = useState(() => INCIDENT_POOL.slice(0, 5).map((inc, i) => ({ ...inc, id: i, time: new Date(Date.now() - i * 90000), acked: false })));
  const [toast, setToast] = useState(null);
  const incIdx = useRef(5);

  // Live widget updates
  useEffect(() => {
    const t = setInterval(() => {
      setWidgets(w => ({
        alerts:   Math.max(0,  w.alerts   + (Math.random() > 0.7 ? 1 : 0)),
        ndrf:     Math.min(15, w.ndrf     + (Math.random() > 0.8 ? 1 : -1)),
        sensors:  Math.max(40, w.sensors  + (Math.random() > 0.9 ? -1 : 0)),
        drones:   Math.max(0,  w.drones   + (Math.random() > 0.8 ? 1 : -1)),
        rainfall: +(w.rainfall + (Math.random() * 2 - 0.5)).toFixed(1),
        temp:     +(w.temp     + (Math.random() * 0.4 - 0.2)).toFixed(1),
        seismic:  Math.max(0,  w.seismic  + (Math.random() > 0.9 ? 1 : 0)),
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // New incident every 6s
  useEffect(() => {
    const t = setInterval(() => {
      const inc = INCIDENT_POOL[incIdx.current % INCIDENT_POOL.length];
      incIdx.current++;
      setIncidents(prev => [{ ...inc, id: Date.now(), time: new Date(), acked: false }, ...prev.slice(0, 7)]);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const WIDGET_DATA = [
    { label: 'Active Alerts',       value: widgets.alerts,   unit: '',    icon: AlertTriangle, color: 'text--600',   border: 'border-red-200' },
    { label: 'NDRF Teams',          value: widgets.ndrf,     unit: '',    icon: Shield,        color: 'text--600',  border: 'border-blue-200' },
    { label: 'IoT Sensors Online',  value: `${widgets.sensors}/52`, unit: '', icon: Radio,    color: 'text--600', border: 'border-green-200' },
    { label: 'Drones Airborne',     value: widgets.drones,   unit: '',    icon: Zap,           color: 'text--600',  border: 'border-cyan-200' },
    { label: 'Rainfall 24h',        value: widgets.rainfall, unit: 'mm',  icon: Wind,          color: 'text--600',   border: 'border-sky-500/30' },
    { label: 'Avg Temp',            value: widgets.temp,     unit: '°C',  icon: Thermometer,   color: 'text--600', border: 'border-amber-200' },
    { label: 'Seismic Events',      value: widgets.seismic,  unit: '',    icon: Activity,      color: 'text--600',   border: 'border-red-200' },
  ];

  return (
    <div className="light-dashboard page-enter relative pb-10 bg-slate-50 min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10">

        {/* Toast */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-5 h-5" /> {toast}
          </div>
        )}

        {/* Threat Ticker */}
        <div className="bg-black/70 border-b border-red-200 py-2 overflow-hidden">
          <div className="flex items-center gap-3 px-3 mb-1">
            <span className="text-xs font-black text--600 uppercase tracking-widest shrink-0 bg-red-50 px-2 py-0.5 rounded">● LIVE</span>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className={`text-xs font-medium shrink-0 ${item.color}`}>{item.text}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header */}
          <FadeIn direction="down">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">🎯 Command Center</h1>
                <p className="text-slate-700 text-sm">NER Strategic Overview · Real-time Situational Awareness</p>
              </div>
              <SimulatedDataBadge />
            </div>
          </FadeIn>

          {/* Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {WIDGET_DATA.map(w => (
              <div key={w.label} className={`bg-slate-50 backdrop-blur rounded-xl border ${w.border} p-3 text-center`}>
                <w.icon className={`w-5 h-5 mx-auto mb-1 ${w.color}`} />
                <div className={`text-2xl font-black ${w.color}`}>{w.value}{w.unit}</div>
                <div className="text-[10px] text-slate-700 mt-1 leading-tight">{w.label}</div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Incident Feed */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Bell className="w-5 h-5 text--600" /> Live Incident Feed</h2>
              <div className="space-y-2">
                {incidents.map(inc => (
                  <div key={inc.id} className={`flex items-start gap-3 p-3 rounded-xl border bg-slate-50 backdrop-blur transition-all ${inc.acked ? 'opacity-50 border-slate-200' : SEV_STYLE[inc.sev]}`}>
                    <span className="text-xl shrink-0">{inc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SEV_STYLE[inc.sev]}`}>{inc.sev}</span>
                        <span className="text-xs text-slate-700">{inc.state}</span>
                        <span className="text-xs text-slate-700">{inc.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-snug">{inc.text}</p>
                    </div>
                    {!inc.acked && (
                      <button onClick={() => setIncidents(p => p.map(i => i.id === inc.id ? { ...i, acked: true } : i))}
                        className="text-xs px-2 py-1 rounded-lg bg-blue-50 text--600 hover:bg-blue-600/60 border border-blue-200 shrink-0">
                        Ack
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-2 space-y-4">

              {/* Quick Deploy */}
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">⚡ Quick Deploy</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '🛡️ NDRF Team',      msg: 'NDRF Team dispatched to highest-risk zone!' },
                    { label: '🚁 Helicopter',      msg: 'Mi-17 scrambled — ETA 20 min to target!' },
                    { label: '🚁 Launch Drone',    msg: 'Autonomous drone corridor activated!' },
                    { label: '📢 Broadcast Alert', msg: 'Emergency broadcast sent to 847 devices!' },
                  ].map(btn => (
                    <button key={btn.label} onClick={() => showToast(btn.msg)}
                      className="py-3 px-2 rounded-xl bg-blue-600/30 border border-blue-200 text-sm text-blue-200 font-semibold hover:bg-blue-600/50 hover:text-slate-900 transition-all active:scale-95 text-center">
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Risk Chart */}
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">📊 State Risk Index</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DISTRICT_RISK} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="state" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b' }} />
                      <Bar dataKey="risk" radius={[4, 4, 0, 0]}
                        fill="#3b82f6"
                        label={false}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">🔗 Quick Navigation</h3>
                <div className="space-y-1.5">
                  {QUICK_LINKS.map(ql => (
                    <Link key={ql.path} to={ql.path}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600/20 border border-transparent hover:border-blue-200 transition-all group">
                      <ql.icon className="w-4 h-4 text--600" />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{ql.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text--600 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  );
}
