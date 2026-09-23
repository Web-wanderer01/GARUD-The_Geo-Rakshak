const fs = require('fs');

const homePage = `import { Link } from 'react-router-dom';
import { Map, BarChart3, Bell, FileText, Settings, Shield, AlertTriangle, Route, Users, BookOpen, Phone, ChevronRight, CheckCircle2, Activity, Truck, Box } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import GarudIntro from '../components/home/GarudIntro';
import LiveNewsFeed from '../components/news/LiveNewsFeed';
import HistoricalImpact from '../components/home/HistoricalImpact';
import { zoneStats } from '../data/zones';
import { alerts, SEVERITY_CONFIG } from '../data/alerts';
import { roadStats } from '../data/roads';

import { useContext, useState } from 'react';
import { LiveDataContext } from '../contexts/LiveDataContext';
import { computeZoneStats } from '../data/zones';


function SubscribeAlerts() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', district: '', role: 'Citizen' });
  const [submitted, setSubmitted] = useState(false);

  const nerDistricts = [
    'Dima Hasao, Assam', 'Cachar, Assam', 'Kamrup, Assam', 'Dibrugarh, Assam',
    'East Khasi Hills, Meghalaya', 'West Garo Hills, Meghalaya', 'Cherrapunji, Meghalaya',
    'Imphal, Manipur', 'Churachandpur, Manipur', 'Ukhrul, Manipur',
    'Aizawl, Mizoram', 'Lunglei, Mizoram', 'Champhai, Mizoram',
    'Kohima, Nagaland', 'Dimapur, Nagaland', 'Mokokchung, Nagaland',
    'Agartala, Tripura', 'North Tripura, Tripura', 'South Tripura, Tripura',
    'Tawang, Arunachal Pradesh', 'Itanagar, Arunachal Pradesh', 'Ziro, Arunachal Pradesh',
    'Gangtok, Sikkim', 'Namchi, Sikkim', 'Mangan, Sikkim'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.name || !formData.phone || !formData.email || !formData.district) return;
    
    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      ...formData,
      type: formData.role,
      status: 'Active',
      registeredAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('garud_citizens') || '[]');
    localStorage.setItem('garud_citizens', JSON.stringify([newUser, ...existing]));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Successfully Registered!</h3>
        <p className="text-green-700">You have been added to the Citizen Dashboard. You will now receive alerts.</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-green-600 font-bold hover:underline">Register another</button>
      </div>
    );
  }

  return (
    <section className="mt-10 bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 shadow-lg text-white">
      <h3 className="text-xl font-bold mb-1">Subscribe to Emergency Alerts</h3>
      <p className="text-slate-400 text-sm mb-6">Register to receive multilingual SMS, Email & WhatsApp warnings during disasters.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Full Name *" value={formData.name} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm" />
        <input type="tel" placeholder="Phone Number *" value={formData.phone} onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))} className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm" />
        <input type="email" placeholder="Email Address *" value={formData.email} onChange={e => setFormData(prev => ({...prev, email: e.target.value}))} className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm" />
        <select value={formData.district} onChange={e => setFormData(prev => ({...prev, district: e.target.value}))} className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
          <option value="">Select Your District *</option>
          {nerDistricts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={formData.role} onChange={e => setFormData(prev => ({...prev, role: e.target.value}))} className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
          <option value="Citizen">Citizen</option>
          <option value="Field Officer">Field Officer</option>
          <option value="NDRF Personnel">NDRF Personnel</option>
          <option value="Medical Staff">Medical Staff</option>
          <option value="Government Official">Government Official</option>
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
          <Bell className="w-4 h-4" /> Register for Alerts
        </button>
      </form>
    </section>
  );
}

export default function HomePage() {
  const { liveZones } = useContext(LiveDataContext) || {};
  const dataZones = liveZones || [];
  const stats = dataZones.length > 0 ? computeZoneStats(dataZones) : zoneStats;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const featureCards = [
    {
      icon: Map,
      title: 'GIS Risk Dashboard',
      description: 'Interactive map showing real-time landslide risk zones across all NER districts. Toggle layers for rainfall, roads, and villages.',
      link: '/map',
      color: 'blue',
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: '7-day AI risk score forecasts powered by rainfall, soil moisture, slope angle, and historical landslide data.',
      link: '/analytics',
      color: 'purple',
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Automated multilingual warnings disseminated via SMS, Email, and WhatsApp when risk thresholds are crossed.',
      link: '/alerts',
      color: 'red',
    },
    {
      icon: FileText,
      title: 'Field Reporting',
      description: 'Geo-tagged incident reporting with offline support. Reports auto-sync when connectivity is restored.',
      link: '/reporting',
      color: 'green',
    },
    {
      icon: Truck,
      title: 'NDRF Logistics',
      description: 'AI-powered route optimization and real-time fleet tracking for relief supply chains across blocked corridors.',
      link: '/logistics',
      color: 'orange',
    },
    {
      icon: Activity,
      title: 'Operations Center',
      description: 'Live road status, district risk tables, weather forecasts and emergency resource prioritization.',
      link: '/operations',
      color: 'teal',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-700', btn: 'text-blue-700 hover:text-blue-900' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-700', btn: 'text-purple-700 hover:text-purple-900' },
    red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-700', btn: 'text-red-700 hover:text-red-900' },
    green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-700', btn: 'text-green-700 hover:text-green-900' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-700', btn: 'text-orange-700 hover:text-orange-900' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'bg-teal-100 text-teal-700', btn: 'text-teal-700 hover:text-teal-900' },
  };

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <SimulatedDataBadge />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                AI-Based Early Warning &<br />
                <span className="text-blue-400">Landslide Risk Monitoring</span>
              </h2>
              <p className="text-slate-300 text-lg mb-3 max-w-2xl">
                Protecting communities across <strong className="text-white">Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim</strong> with real-time intelligence and automated emergency response.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/map" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg">
                  <Map className="w-4 h-4" /> View Live Risk Map
                </Link>
                <Link to="/reporting" className="px-6 py-3 border-2 border-blue-400 text-blue-300 hover:bg-blue-900/30 font-bold rounded-lg transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Report an Incident
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm flex-shrink-0">
              {[
                { label: 'Monitored Zones', value: stats.totalZones, icon: Map, color: 'text-blue-400' },
                { label: 'Active Alerts', value: criticalAlerts.length, icon: AlertTriangle, color: 'text-red-400' },
                { label: 'Highest Risk District', value: stats.highestRiskZone?.riskScore ?? '--', icon: Activity, color: 'text-amber-400', suffix: '/100' },
                { label: 'Roads Affected', value: roadStats.partiallyBlocked + roadStats.fullyBlocked, icon: Route, color: 'text-orange-400' },
              ].map(({ label, value, icon: Icon, color, suffix }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Icon className={"w-6 h-6 mx-auto mb-2 " + color} />
                  <div className="text-3xl font-black">{value}{suffix}</div>
                  <div className="text-xs text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: GARUD Intro + Feature Cards */}
          <div className="lg:col-span-2 space-y-8">
            <GarudIntro />

            {/* Feature Cards */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureCards.map(({ icon: Icon, title, description, link, color }) => {
                  const c = colorMap[color];
                  return (
                    <Link key={link} to={link} className={"block p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 " + c.bg + " " + c.border}>
                      <div className={"w-10 h-10 rounded-lg flex items-center justify-center mb-3 " + c.icon}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                      <span className={"text-sm font-semibold flex items-center gap-1 mt-3 " + c.btn}>
                        Open <ChevronRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <HistoricalImpact />
            <SubscribeAlerts />
          </div>

          {/* Right: News Feed */}
          <div>
            <LiveNewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/HomePage.jsx', homePage);
console.log('HomePage restored to original!');
