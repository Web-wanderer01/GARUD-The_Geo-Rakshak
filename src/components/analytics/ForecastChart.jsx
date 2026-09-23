import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SimulatedDataBadge from '../common/SimulatedDataBadge';

export default function ForecastChart({ zone }) {
  if (!zone) return null;

  // Generate comparison data against Regional Baseline
  const seismicFactorRaw = zone.seismicRisk !== undefined ? zone.seismicRisk : 15;
  
  const chartData = [
    { name: 'Rainfall', 'Current': Number(zone.rainfall24h).toFixed(1), 'Baseline': 45, unit: 'mm' },
    { name: 'Soil Moist.', 'Current': Number(zone.soilMoisture).toFixed(1), 'Baseline': 55, unit: '%' },
    { name: 'Slope', 'Current': Number(zone.slopeAngle).toFixed(1), 'Baseline': 32, unit: '°' },
    { name: 'River Prox.', 'Current': Number(zone.riverProximity).toFixed(1), 'Baseline': 50, unit: 'm' },
    { name: 'Blockage', 'Current': Number(zone.streamNarrowing).toFixed(1), 'Baseline': 25, unit: '%' },
    { name: 'Seismic', 'Current': Number(seismicFactorRaw).toFixed(1), 'Baseline': 15, unit: 'idx' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.payload.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Regional Baseline Comparison</h2>
        <SimulatedDataBadge />
      </div>

      <div className="w-full h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
            <Bar dataKey="Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Current" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
