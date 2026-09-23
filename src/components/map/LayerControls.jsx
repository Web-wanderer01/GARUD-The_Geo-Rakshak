import React from 'react';
import { MapPin, Route, Home, CloudRain, Truck, Tent, Map as MapIcon, Activity, CloudLightning, Wind, AlertTriangle, Box, ShieldCheck, Radio, Waves, Navigation } from 'lucide-react';

export default function LayerControls({ activeLayers, onToggleLayer }) {
  const controls = [
    { id: 'satellite',           label: 'Satellite View',          icon: MapIcon },
    { id: 'riskZones',           label: 'Risk Zones',              icon: MapPin },
    { id: 'seismic',             label: 'Seismic Activity',        icon: Activity },
    { id: 'radar',               label: 'Live Weather Radar',       icon: CloudLightning },
    { id: 'rainfall',            label: 'Rainfall Areas',          icon: CloudRain },
    { id: 'westernDisturbance',  label: 'Western Disturbance',      icon: Wind },
    { id: 'evacuation',          label: 'Evacuation Routes',        icon: Route },
    { id: 'roads',               label: 'Road Network',             icon: Route },
    { id: 'camps',               label: 'Relief Camps ⛺',         icon: Tent },
    { id: 'trucks',              label: 'Live Fleets',              icon: Truck },
    { id: 'incidents',           label: 'Incidents',                icon: AlertTriangle },
    { id: 'sensors',             label: 'Sensors',                  icon: Activity },
    { id: 'supplyGaps',          label: 'Supply Gaps',              icon: Box },
    { id: 'emergencyFacilities', label: 'Emergency Facilities',     icon: ShieldCheck },
    // ── Strategic Upgrade Layers ──
    { id: 'acousticSensors',    label: '🔊 Acoustic Sensors',       icon: Radio },
    { id: 'loraNodes',          label: '📡 LoRaWAN Mesh',           icon: Radio },
    { id: 'riverGauges',        label: '🌊 River Gauges (GLOF)',    icon: Waves },
    { id: 'droneCorridors',     label: '🚁 Drone Corridors',        icon: Navigation },
  ];

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-2 z-10 w-full overflow-x-auto">
      {controls.map((ctrl) => {
        const Icon = ctrl.icon;
        const isActive = activeLayers[ctrl.id];
        return (
          <button
            key={ctrl.id}
            onClick={() => onToggleLayer(ctrl.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm font-medium whitespace-nowrap
              ${isActive 
                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
          >
            <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
            {ctrl.label}
          </button>
        );
      })}
    </div>
  );
}
