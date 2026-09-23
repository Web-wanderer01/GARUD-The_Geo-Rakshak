import React, { useState } from 'react';
import { roads, ROAD_STATUS_CONFIG, roadStats } from '../../data/roads';
import { Route, Search, MapPin, Navigation2, Activity } from 'lucide-react';
import SimulatedDataBadge from '../common/SimulatedDataBadge';

export default function RoadStatusBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredRoads = roads.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Route className="w-6 h-6 text-blue-600" />
            Connectivity & Disruption Monitor
          </h2>
          <p className="text-sm text-slate-500 mt-1">Real-time status of critical routes and bridges.</p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Monitored" value={roadStats.total} color="slate" />
        <StatCard label="Fully Open" value={roadStats.open} color="green" />
        <StatCard label="Partially Blocked" value={roadStats.partiallyBlocked} color="orange" />
        <StatCard label="Fully Blocked" value={roadStats.fullyBlocked} color="red" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-grow max-w-md">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search routes or locations..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'road', 'bridge'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                filterType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRoads.map((road) => {
          const config = ROAD_STATUS_CONFIG[road.status];
          return (
            <div key={road.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                      {road.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full capitalize">
                      {road.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{road.name}</h3>
                </div>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bgClass} border-${config.color.replace('#', '')}`}>
                  <span>{config.icon}</span>
                  <span className="hidden sm:inline">{road.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-sm">
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">{road.from}</span> to <span className="font-semibold">{road.to}</span>
                    <div className="text-xs text-slate-400 mt-0.5">{road.state} • {road.lengthKm} km</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-slate-600">
                  <Activity className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Disruption Risk: 
                      <span className={`px-1.5 py-0.5 rounded text-white text-xs ${
                        road.disruptionRisk > 80 ? 'bg-red-500' : road.disruptionRisk > 50 ? 'bg-orange-500' : 'bg-green-500'
                      }`}>
                        {road.disruptionRisk}/100
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      Data: {road.dataSource} <span className="w-1 h-1 rounded-full bg-slate-300"></span> Conf: {road.confidence}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-sm text-slate-700">
                <span className="font-semibold block mb-1">Field Notes / Details:</span>
                {road.details}
              </div>
              
              <div className="text-xs text-slate-400 mt-3 text-right">
                Last Verified: {new Date(road.lastUpdated).toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    slate: 'bg-slate-50 border-slate-200 text-slate-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`rounded-lg p-4 border ${colorMap[color]}`}>
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}
