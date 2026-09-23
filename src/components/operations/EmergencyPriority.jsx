import React, { useContext } from 'react';
import { getRiskLevel, RISK_LEVELS } from '../../data/zones';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import InfoTooltip from '../common/InfoTooltip';
import SimulatedDataBadge from '../common/SimulatedDataBadge';

export default function EmergencyPriority() {
  const { liveZones } = useContext(LiveDataContext);

  const calculatePriority = (zone) => {
    let popFactor = (zone.population || 250000) > 500000 ? 1.5 : (zone.population || 250000) > 100000 ? 1.2 : 1.0;
    let infraFactor = ((zone.infrastructureLevel || 'medium') || 'medium') === 'high' ? 1.5 : ((zone.infrastructureLevel || 'medium') || 'medium') === 'medium' ? 1.2 : 1.0;
    return zone.riskScore * popFactor * infraFactor;
  };

  const priorityZones = liveZones
    .filter(z => z.riskScore > 50)
    .map(z => ({
      ...z,
      priorityScore: calculatePriority(z)
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const getAction = (riskScore) => {
    if (riskScore > 85) return 'Evacuation & Immediate deployment of NDRF';
    if (riskScore > 75) return 'Issue Public Warnings, prepare relief camps';
    if (riskScore > 65) return 'Active monitoring, ready emergency services';
    return 'Regular monitoring, clear drainage channels';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Emergency Prioritization List
            <InfoTooltip content="Priority Score = Risk Score x Population Factor x Infrastructure Factor. Highlights zones requiring immediate administrative focus." />
          </h2>
          <SimulatedDataBadge />
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 relative">
            <thead className="text-slate-700 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-center w-16 shadow-[0_1px_0_rgba(203,213,225,1)]">Rank</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-[0_1px_0_rgba(203,213,225,1)]">Zone</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-right shadow-[0_1px_0_rgba(203,213,225,1)]">Risk Score</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-right shadow-[0_1px_0_rgba(203,213,225,1)]">Priority Score</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-[0_1px_0_rgba(203,213,225,1)]">Population / Infra</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-[0_1px_0_rgba(203,213,225,1)]">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {priorityZones.map((zone, idx) => {
                const rLevel = getRiskLevel(zone.riskScore);
                const rConfig = RISK_LEVELS[rLevel];
                return (
                  <tr key={zone.id} className={idx < 3 ? 'bg-red-50/30' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4 text-center font-bold text-slate-500">#{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{zone.name}</div>
                      <div className="text-xs text-slate-500">{zone.state}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 rounded font-bold text-xs" style={{ backgroundColor: rConfig.color + '20', color: rConfig.color }}>
                        {zone.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                      {zone.priorityScore.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{((zone.population || 250000) / 1000).toFixed(0)}k</div>
                      <div className="capitalize text-slate-500">{(zone.infrastructureLevel || 'medium')}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs text-slate-600">
                      {getAction(zone.riskScore)}
                    </td>
                  </tr>
                );
              })}
              {priorityZones.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No high-risk zones currently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
