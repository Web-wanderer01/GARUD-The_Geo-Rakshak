import React, { useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { getRiskLevel, RISK_LEVELS } from '../../data/zones';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import FadeIn from '../../components/common/FadeIn';

export default function DistrictRiskTable() {
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const { liveZones } = useContext(LiveDataContext);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // default new field to desc
    }
  };

  const sortedZones = [...liveZones].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const chartData = sortedZones.map(z => ({
    name: z.name,
    score: z.riskScore,
    level: getRiskLevel(z.riskScore)
  }));

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 inline-block ml-1 text-slate-300 opacity-50 transition-opacity group-hover:opacity-100" />;
    }
    return (
      <div className={`inline-block ml-1 transition-transform duration-300 ${sortDirection === 'asc' ? 'rotate-180' : 'rotate-0'}`}>
        <ArrowDown className="w-3 h-3 text-blue-600" />
      </div>
    );
  };

  return (
    <FadeIn direction="up">
      
        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-shadow hover:shadow-lg">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Risk Overview by District</h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-600 relative">
              <thead className="text-slate-700 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="bg-slate-50 group px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                    Zone / District {renderSortIcon('name')}
                  </th>
                  <th className="bg-slate-50 group px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('state')}>
                    State {renderSortIcon('state')}
                  </th>
                  <th className="bg-slate-50 group px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors text-right" onClick={() => handleSort('riskScore')}>
                    Risk Score {renderSortIcon('riskScore')}
                  </th>
                  <th className="bg-slate-50 px-6 py-4 font-semibold hover:text-blue-600 transition-colors">Risk Level</th>
                  <th className="bg-slate-50 group px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors text-right" onClick={() => handleSort('rainfall24h')}>
                    Rainfall (24h) {renderSortIcon('rainfall24h')}
                  </th>
                  <th className="bg-slate-50 group px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors text-right" onClick={() => handleSort('soilMoisture')}>
                    Soil Moisture {renderSortIcon('soilMoisture')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedZones.map((zone, index) => {
                  const rLevel = getRiskLevel(zone.riskScore);
                  const rConfig = RISK_LEVELS[rLevel];
                  const isCritical = rLevel === 'critical' || rLevel === 'high';
                  
                  return (
                    <tr 
                      key={zone.id} 
                      className="row-hover bg-white"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="bg-slate-50 px-6 py-4 font-medium text-slate-900">{zone.name}</td>
                      <td className="bg-slate-50 px-6 py-4">{zone.state}</td>
                      <td className="bg-slate-50 px-6 py-4 text-right font-bold" style={{ color: rConfig.color }}>
                        {zone.riskScore}
                      </td>
                      <td className="bg-slate-50 px-6 py-4">
                        <span 
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm inline-flex items-center gap-2 ${isCritical ? 'status-pulse-dot' : ''}`} 
                          style={{ backgroundColor: rConfig.color + '15', color: rConfig.color, border: `1px solid ${rConfig.color}30` }}
                        >
                          {rConfig.label}
                        </span>
                      </td>
                      <td className="bg-slate-50 px-6 py-4 text-right">{Number(zone.rainfall24h).toFixed(1)} mm</td>
                      <td className="bg-slate-50 px-6 py-4 text-right">{Number(zone.soilMoisture).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200">
            {sortedZones.map((zone) => {
              const rLevel = getRiskLevel(zone.riskScore);
              const rConfig = RISK_LEVELS[rLevel];
              const isCritical = rLevel === 'critical' || rLevel === 'high';

              return (
                <div key={zone.id} className="p-4 space-y-3 bg-white row-hover transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 text-base">{zone.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{zone.state}</div>
                    </div>
                    <span 
                      className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${isCritical ? 'status-pulse-dot' : ''}`} 
                      style={{ backgroundColor: rConfig.color + '15', color: rConfig.color, border: `1px solid ${rConfig.color}30` }}
                    >
                      {rConfig.label} ({zone.riskScore})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                    <span className="font-medium">Rain: <span className="text-slate-900">{Number(zone.rainfall24h).toFixed(1)}mm</span></span>
                    <span className="font-medium">Soil: <span className="text-slate-900">{Number(zone.soilMoisture).toFixed(1)}%</span></span>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </FadeIn>
  );
}
