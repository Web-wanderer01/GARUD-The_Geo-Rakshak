import React from 'react';
import { CloudRain, Droplets, Mountain, Waves, Navigation, Activity } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import { getRiskLevel, RISK_LEVELS, RISK_FORMULA_DESCRIPTION } from '../../data/zones';

export default function RiskScorePanel({ zone }) {
  if (!zone) return null;

  const riskLevel = getRiskLevel(zone.riskScore);
  const color = RISK_LEVELS[riskLevel].color;
  
  // Use the 6 parameters with proper AI weightings
  const rainFactor         = Math.min(zone.rainfall24h / 200, 1) * 100 * 0.25;
  const soilFactor         = Math.min(zone.soilMoisture / 100, 1) * 100 * 0.20;
  const slopeFactor        = Math.min(zone.slopeAngle / 60, 1) * 100 * 0.15;
  const riverProxFactor    = Math.max(0, 100 - (zone.riverProximity / 10)) * 0.15;
  const streamNarrowFactor = Math.min(zone.streamNarrowing / 100, 1) * 100 * 0.15;
  const seismicFactorRaw   = zone.seismicRisk !== undefined ? zone.seismicRisk : 20; 
  const seismicFactor      = Math.min(seismicFactorRaw / 100, 1) * 100 * 0.10;

  const parameters = [
    { icon: CloudRain, name: 'Rainfall (24h)', value: `${Number(zone.rainfall24h).toFixed(1)} mm`, weight: '25%', points: Math.round(rainFactor), maxPoints: 25, color: 'bg-blue-500' },
    { icon: Droplets, name: 'Soil Moisture', value: `${Number(zone.soilMoisture).toFixed(1)}%`, weight: '20%', points: Math.round(soilFactor), maxPoints: 20, color: 'bg-emerald-500' },
    { icon: Mountain, name: 'Slope Angle', value: `${Number(zone.slopeAngle).toFixed(1)}°`, weight: '15%', points: Math.round(slopeFactor), maxPoints: 15, color: 'bg-yellow-500' },
    { icon: Waves, name: 'River Proximity', value: `${Number(zone.riverProximity).toFixed(1)} m`, weight: '15%', points: Math.round(riverProxFactor), maxPoints: 15, color: 'bg-cyan-500' },
    { icon: Navigation, name: 'Stream Narrowing', value: `${Number(zone.streamNarrowing).toFixed(1)}%`, weight: '15%', points: Math.round(streamNarrowFactor), maxPoints: 15, color: 'bg-purple-500' },
    { icon: Activity, name: 'Seismic Activity', value: `${Number(seismicFactorRaw).toFixed(1)} idx`, weight: '10%', points: Math.round(seismicFactor), maxPoints: 10, color: 'bg-orange-500' }
  ];

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (zone.riskScore / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Current Risk Analysis</h2>
        <InfoTooltip title="How is this calculated?">
          <p className="mb-2 text-sm">{RISK_FORMULA_DESCRIPTION}</p>
        </InfoTooltip>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 flex-grow">
        {/* Gauge */}
        <div className="relative flex flex-col items-center justify-center min-w-[200px]">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{zone.riskScore}</span>
            <span className="text-sm font-medium text-slate-500">/ 100</span>
          </div>
          <div className="mt-4 text-center">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {RISK_LEVELS[riskLevel].label} Risk
            </span>
          </div>
        </div>

        {/* Breakdown parameters */}
        <div className="flex-1 w-full flex flex-col justify-center gap-4">
          <h3 className="text-sm font-medium text-slate-600 mb-1 border-b border-slate-100 pb-2">Formula Parameter Breakdown</h3>
          {parameters.map((param, idx) => {
            const Icon = param.icon;
            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
                    {param.name} 
                    <span className="text-slate-400 font-normal">({param.value})</span>
                  </span>
                  <span>{param.points} / {param.maxPoints} pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${param.color} transition-all duration-1000`} 
                    style={{ width: `${(param.points / param.maxPoints) * 100}%` }} 
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right">Weight: {param.weight}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
