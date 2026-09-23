import React from 'react';
import { RISK_LEVELS } from '../../data/zones';

export default function MapLegend() {
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-sm z-10">
      <span className="font-semibold text-slate-700 whitespace-nowrap">Risk Levels:</span>
      <div className="flex flex-wrap gap-4">
        {Object.entries(RISK_LEVELS).map(([key, level]) => (
          <div key={key} className="flex items-center gap-2">
            <span 
              className="w-4 h-4 rounded-full inline-block" 
              style={{ backgroundColor: level.color }}
            />
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">{level.label}</span> ({level.min}-{level.max})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
