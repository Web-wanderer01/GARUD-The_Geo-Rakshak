import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, AlertTriangle, Map, BarChart3, Bell, FileText, Settings, BookOpen, Shield, Route, Users, Truck, Activity, MapPin } from 'lucide-react';
import GarudIntro from '../components/home/GarudIntro';
import HistoricalImpact from '../components/home/HistoricalImpact';
import LiveNewsFeed from '../components/news/LiveNewsFeed';
import SubscribeAlerts from '../components/alerts/SubscribeAlerts';
import { alerts } from '../data/alerts';

import { useContext } from 'react';
import { LiveDataContext } from '../contexts/LiveDataContext';
import { zoneStats } from '../data/zones';
import { roadStats } from '../data/roads';

function AlertTicker({ criticalAlert }) {
  if (!criticalAlert) return null;
  return (
    <div className="bg-red-50 border-y border-red-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="bg-red-400 text-white text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0">
            CRITICAL
          </span>
          <span className="text--600 text-sm font-medium truncate">
            {criticalAlert.message}
          </span>
        </div>
        <Link to="/alerts" className="text-red-600 font-medium text-sm flex items-center gap-1 flex-shrink-0 hover:text-red-800">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-4 border-b border-slate-300 pb-2">
      <ChevronRight className="w-5 h-5 text-slate-700" />
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}

export default function HomePage() {
  const { liveZones } = useContext(LiveDataContext) || {};
  const dataZones = liveZones || [];
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const quickAccess = [
    { title: 'Risk Dashboard', icon: Map, link: '/map', color: 'text-blue-600', hover: 'hover:border-blue-300' },
    { title: 'Analytics (AI)', icon: BarChart3, link: '/analytics', color: 'text-indigo-600', hover: 'hover:border-indigo-300' },
    { title: 'Command Center', icon: Settings, link: '/operations', color: 'text-purple-600', hover: 'hover:border-purple-300' },
    { title: 'Smart Logistics', icon: Truck, link: '/logistics', color: 'text-amber-600', hover: 'hover:border-amber-300' },
    { title: 'Virtual Demo', icon: Activity, link: '/demo', color: 'text-red-600', hover: 'hover:border-red-300' },
    { title: 'Citizen DB', icon: Users, link: '/database', color: 'text-green-600', hover: 'hover:border-green-300' },
  ];

  const overviewStats = [
    { label: 'Monitored Zones', value: zoneStats.totalZones, icon: MapPin, color: 'text-blue-500' },
    { label: 'Critical Alerts', value: criticalAlerts.length, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Max Risk Score', value: zoneStats.highestRiskZone?.riskScore || 91, icon: Activity, color: 'text-orange-500' },
    { label: 'Roads Affected', value: roadStats.partiallyBlocked + roadStats.fullyBlocked, icon: Route, color: 'text-amber-500' }
  ];

  const states = [
    'Assam', 'Meghalaya', 'Manipur', 'Mizoram',
    'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <GarudIntro />
      <AlertTicker criticalAlert={criticalAlerts[0]} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
        
        {/* Quick Access */}
        <section>
          <SectionHeader title="Quick Access" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickAccess.map(({ icon: Icon, title, link, color, hover }) => (
              <Link 
                key={link} 
                to={link} 
                target={link === '/operations' ? '_blank' : undefined}
                rel={link === '/operations' ? 'noopener noreferrer' : undefined}
                className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm ${hover}`}
              >
                <Icon className={`w-8 h-8 mb-2 ${color}`} />
                <span className={`text-sm font-medium ${color}`}>{title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <section>
              <SectionHeader title="Current Status Overview" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {overviewStats.map(({ label, value, icon: Icon, color }, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center text-center shadow-sm">
                    <Icon className={`w-6 h-6 mb-2 ${color}`} />
                    <span className="text-2xl font-black text-slate-900">{value}</span>
                    <span className="text-xs text-slate-700 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">States Under Monitoring</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200">
                  {states.map(state => (
                    <div key={state} className="bg-white p-4 text-sm text-slate-700 font-medium">
                      {state}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <HistoricalImpact />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            
            <section>
              <SectionHeader title="Latest Alerts" />
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 flex flex-col">
                  {criticalAlerts.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex border-b border-slate-100 last:border-b-0">
                      <div className="p-4 flex gap-3 items-start w-full hover:bg-slate-50 transition-colors">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${a.severity === 'critical' ? 'bg-red-100 text--600' : 'bg-orange-100 text-orange-700'}`}>
                          {a.severity.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{a.district}, {a.location?.split(',')[1]?.trim() || a.location}</p>
                          <p className="text-xs text-slate-700 mt-1">
                            {a.state} � {new Date(a.timestamp || Date.now()).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Link to="/alerts" className="text-sm font-medium text-slate-700 hover:text-blue-600 block w-full">
                    View All Alerts <ArrowRight className="w-3 h-3 inline-block align-middle ml-1" />
                  </Link>
                </div>
              </div>
            </section>

            <LiveNewsFeed />
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <SubscribeAlerts />
      </div>
    </div>
  );
}
