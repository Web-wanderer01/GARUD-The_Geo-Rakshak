const fs = require('fs');

// ==================== HOME PAGE ====================
const homePage = `import { Link } from 'react-router-dom';
import { Map, BarChart3, Bell, FileText, Shield, AlertTriangle, Route, Users, Phone, ChevronRight, CheckCircle2, Activity, Truck, Zap } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import GarudIntro from '../components/home/GarudIntro';
import LiveNewsFeed from '../components/news/LiveNewsFeed';
import HistoricalImpact from '../components/home/HistoricalImpact';
import { zones } from '../data/zones';
import { alerts } from '../data/alerts';
import { roadStats } from '../data/roads';
import { useContext, useState, useEffect } from 'react';
import { LiveDataContext } from '../contexts/LiveDataContext';

function SystemStatusBanner() {
  const { isLiveConnected } = useContext(LiveDataContext) || {};
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="bg-slate-900 text-white py-1.5 px-4 overflow-hidden border-b border-slate-700">
      <div className="flex items-center gap-6 text-xs font-mono overflow-hidden">
        <span className="flex items-center gap-1.5 text-green-400 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>GARUD ENGINE ONLINE
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-cyan-300 flex-shrink-0">SENSORS: 54 ACTIVE</span>
        <span className="text-slate-400">|</span>
        <span className="text-amber-300 flex-shrink-0">ALERTS: {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} ACTIVE</span>
        <span className="text-slate-400">|</span>
        <span className="text-blue-300 flex-shrink-0">UPTIME: {Math.floor(uptime/60)}m {uptime%60}s</span>
        <span className="text-slate-400">|</span>
        <span className={"flex-shrink-0 " + (isLiveConnected ? "text-green-300" : "text-amber-300")}>{isLiveConnected ? "? LIVE API" : "? OFFLINE"}</span>
      </div>
    </div>
  );
}

function LiveWeatherWidget() {
  const [metrics, setMetrics] = useState({ temp: 24, rain: 42, humidity: 87, wind: 18 });
  useEffect(() => {
    const i = setInterval(() => setMetrics(m => ({
      temp: Math.max(18, Math.min(35, m.temp + (Math.random()-0.5)*0.5)),
      rain: Math.max(0, Math.min(200, m.rain + (Math.random()-0.4)*3)),
      humidity: Math.max(60, Math.min(100, m.humidity + (Math.random()-0.5)*1)),
      wind: Math.max(5, Math.min(60, m.wind + (Math.random()-0.5)*2))
    })), 3000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">NER Live Weather</h3>
        <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>LIVE
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Temperature', value: metrics.temp.toFixed(1) + '°C', icon: '???' },
          { label: '1h Rainfall', value: metrics.rain.toFixed(0) + 'mm', icon: '???' },
          { label: 'Humidity', value: metrics.humidity.toFixed(0) + '%', icon: '??' },
          { label: 'Wind Speed', value: metrics.wind.toFixed(0) + ' km/h', icon: '??' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white/5 rounded-lg p-3">
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-lg font-bold tabular-nums">{value}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { icon: Bell, label: 'Active Alerts', link: '/alerts', color: 'bg-red-600', pulse: true },
    { icon: Map, label: 'Risk Map', link: '/map', color: 'bg-blue-600' },
    { icon: FileText, label: 'Field Report', link: '/reporting', color: 'bg-emerald-600' },
    { icon: Truck, label: 'Fleet Tracker', link: '/logistics', color: 'bg-violet-600' },
    { icon: Phone, label: 'Emergency', link: '/emergency', color: 'bg-orange-500' },
    { icon: BarChart3, label: 'Analytics', link: '/analytics', color: 'bg-cyan-600' },
  ];
  return (
    <section className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {actions.map(({ icon: Icon, label, link, color, pulse }) => (
        <Link key={link} to={link} className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className={"w-12 h-12 " + color + " rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform relative"}>
            <Icon className="w-6 h-6 text-white" />
            {pulse && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>}
          </div>
          <span className="text-xs font-bold text-slate-800">{label}</span>
        </Link>
      ))}
    </section>
  );
}

function SubscribeAlerts() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', district: '', role: 'Citizen' });
  const [submitted, setSubmitted] = useState(false);
  const nerDistricts = ['Dima Hasao, Assam','Cachar, Assam','Kamrup, Assam','Dibrugarh, Assam','East Khasi Hills, Meghalaya','West Garo Hills, Meghalaya','Imphal, Manipur','Aizawl, Mizoram','Kohima, Nagaland','Agartala, Tripura','Tawang, Arunachal Pradesh','Gangtok, Sikkim'];
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.district) return;
    const existing = JSON.parse(localStorage.getItem('garud_citizens') || '[]');
    localStorage.setItem('garud_citizens', JSON.stringify([{ id: 'USR-'+Math.floor(1000+Math.random()*9000), ...formData, status: 'Active', registeredAt: new Date().toISOString() }, ...existing]));
    setSubmitted(true);
  };
  if (submitted) return (
    <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center">
      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-green-800 mb-1">Registered!</h3>
      <p className="text-green-700 text-sm">You will receive disaster alerts for {formData.district}.</p>
      <button onClick={() => setSubmitted(false)} className="mt-4 text-green-600 font-bold hover:underline text-sm">Register another</button>
    </div>
  );
  return (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-7 shadow-xl text-white border border-slate-700">
      <h3 className="text-lg font-bold mb-1">Subscribe to Disaster Alerts</h3>
      <p className="text-slate-400 text-sm mb-5">Receive multilingual SMS + Email warnings in real-time</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['name','Full Name','text'],['phone','Phone Number','tel'],['email','Email Address','email']].map(([f,p,t]) => (
          <input key={f} type={t} placeholder={p + ' *'} value={formData[f]} onChange={e=>setFormData(prev=>({...prev,[f]:e.target.value}))} className="bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm" />
        ))}
        <select value={formData.district} onChange={e=>setFormData(prev=>({...prev,district:e.target.value}))} className="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
          <option value="">Select District *</option>
          {nerDistricts.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <button type="submit" className="sm:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
          <Bell className="w-4 h-4" /> Register for Alerts
        </button>
      </form>
    </section>
  );
}

export default function HomePage() {
  const { liveZones, isLiveConnected } = useContext(LiveDataContext) || {};
  const activeZones = liveZones || zones;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const affectedRoads = roadStats.partiallyBlocked + roadStats.fullyBlocked;
  const [liveAlertCount, setLiveAlertCount] = useState(criticalCount);
  const [activeSensors, setActiveSensors] = useState(54);
  useEffect(() => {
    const i = setInterval(() => {
      setLiveAlertCount(c => Math.max(1, c + (Math.random() > 0.8 ? 1 : 0)));
      setActiveSensors(s => Math.max(50, Math.min(56, s + Math.round((Math.random()-0.5)))));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SystemStatusBanner />
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)'}} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <SimulatedDataBadge />
                <span className={"flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border " + (isLiveConnected ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400')}>
                  <span className={"w-2 h-2 rounded-full animate-pulse " + (isLiveConnected ? 'bg-green-400' : 'bg-amber-400')}></span>
                  {isLiveConnected ? 'Live API Connected' : 'Demo Mode'}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">GARUD <span className="text-blue-400">—</span> The Geo Rakshak<br /><span className="text-blue-400">for Northeast India</span></h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">AI-powered early warning & landslide risk monitoring across <strong className="text-white">all 8 NER states</strong>. Real-time telemetry. Multilingual alerts. Precision fleet dispatch.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/map" className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105">
                  <Map className="w-5 h-5" /> View Risk Map
                </Link>
                <Link to="/demo" className="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20">
                  <Zap className="w-5 h-5 text-amber-400" /> Run Live Demo
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs flex-shrink-0">
              {[
                { val: activeZones.length, label: 'Monitored Zones', icon: '??', live: false },
                { val: liveAlertCount, label: 'Critical Alerts', icon: '??', live: true },
                { val: activeSensors, label: 'Active Sensors', icon: '???', live: true },
                { val: affectedRoads, label: 'Roads Affected', icon: '??', live: false },
              ].map(({ val, label, icon, live }) => (
                <div key={label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-3xl font-black tabular-nums flex items-center justify-center gap-1">
                    {val}
                    {live && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>}
                  </div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GarudIntro />
            <HistoricalImpact />
          </div>
          <div className="space-y-6">
            <LiveWeatherWidget />
            <LiveNewsFeed />
          </div>
        </div>
        <SubscribeAlerts />
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/HomePage.jsx', homePage);
console.log('HomePage written');
