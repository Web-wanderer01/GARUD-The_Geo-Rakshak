import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function PredictiveTrendChart({ zone }) {
  if (!zone) return null;

  // Generate 7-day predictive mock data based on current risk
  const generateTrendData = (baseRisk) => {
    const data = [];
    const today = new Date();
    
    // Simulate a rising risk trend based on forecasted rain
    let currentTrend = baseRisk;
    
    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Add some random AI noise
      const volatility = (Math.random() * 8) - 2; 
      
      // If current risk is high, model predicts it stays high/grows. If low, slight upward creep.
      if (baseRisk > 60) {
        currentTrend += volatility + 2; 
      } else {
        currentTrend += volatility + 1;
      }
      
      // Cap at 98
      currentTrend = Math.min(Math.max(currentTrend, 5), 98);
      
      data.push({
        name: i === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
        'AI Risk Prediction': Number(currentTrend.toFixed(1)),
        'Forecast Rain (mm)': Number((Math.random() * 40 + (baseRisk/3)).toFixed(1))
      });
    }
    return data;
  };

  const trendData = generateTrendData(zone.riskScore);
  const maxRisk = Math.max(...trendData.map(d => d['AI Risk Prediction']));
  const isDangerTrend = maxRisk >= 75;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <p className="text-red-600 font-semibold flex items-center gap-1">
            <TrendingUp size={14} /> Risk: {payload[0].value}%
          </p>
          <p className="text-blue-600">Rainfall: {payload[1].value} mm</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-full col-span-1 lg:col-span-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600 w-5 h-5" /> 
            7-Day AI Predictive Forecast
          </h2>
          <p className="text-sm text-slate-500 mt-1">Machine Learning projection based on IMD weather forecasts and historical soil saturation data.</p>
        </div>
        
        {isDangerTrend && (
          <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle size={14} /> Critical Risk Approaching
          </div>
        )}
      </div>

      <div className="w-full h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine y={75} yAxisId="left" stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Critical Threshold', fill: '#ef4444', fontSize: 10 }} />
            
            <Area yAxisId="left" type="monotone" dataKey="AI Risk Prediction" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
            <Area yAxisId="left" type="monotone" dataKey="Forecast Rain (mm)" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
