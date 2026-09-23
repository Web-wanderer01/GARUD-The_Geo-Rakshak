import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { getRiskLevel, RISK_LEVELS } from '../../data/zones';
import { LiveDataContext } from '../../contexts/LiveDataContext';

export default function RiskScoreChart() {
  const { liveZones } = useContext(LiveDataContext);

  const sortedZones = [...liveZones].sort((a, b) => b.riskScore - a.riskScore).slice(0, 15);

  const chartData = sortedZones.map(z => ({
    name: z.name,
    score: z.riskScore,
    level: getRiskLevel(z.riskScore)
  }));

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 transition-shadow hover:shadow-lg h-full min-h-[600px] flex flex-col">
      <h3 className="text-base font-semibold text-slate-800 mb-6">Top 15 Highest Risk Zones</h3>
      <div className="flex-1 min-h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b' }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} animationDuration={1500} animationEasing="ease-out">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RISK_LEVELS[entry.level].color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
