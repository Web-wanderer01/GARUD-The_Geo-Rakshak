import React, { useMemo, useState } from 'react';
import { Activity, CloudRain, Gauge, Layers3, Radio, ShieldCheck, Waves, WifiOff } from 'lucide-react';
import { acousticSensors, riverGauges, droneCorridors } from '../../data/strategicUpgrades';

const layerItems = [
  { id: 'radar', label: 'IMD rainfall radar', icon: CloudRain },
  { id: 'riskZones', label: 'ISRO landslide susceptibility', icon: Layers3 },
  { id: 'riverGauges', label: 'River level gauges', icon: Waves },
  { id: 'acousticSensors', label: 'Acoustic / vibration sensors', icon: Activity },
  { id: 'droneCorridors', label: 'BVLOS medical corridors', icon: ShieldCheck },
];

export default function TacticalCommandPanel({ activeLayers, onToggleLayer, isOnline }) {
  const [sensorId, setSensorId] = useState(acousticSensors[0].id);
  const sensor = useMemo(() => acousticSensors.find(item => item.id === sensorId) || acousticSensors[0], [sensorId]);
  const activeDrones = droneCorridors.filter(item => item.status === 'ACTIVE').reduce((sum, item) => sum + item.drones, 0);
  const alertGauges = riverGauges.filter(item => item.alert).length;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <Radio className="h-4 w-4" /> Tactical layers
          </div>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">NER operations picture</h2>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {isOnline ? <WifiOff className="hidden" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? 'LIVE' : 'OFFLINE CACHE'}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {layerItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onToggleLayer(id)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50">
            <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-slate-500" />{label}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${activeLayers[id] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.7)]' : 'bg-slate-300'}`} />
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-red-50 p-2"><div className="text-lg font-black text-red-700">{alertGauges}</div><div className="text-[10px] font-bold text-red-600">GAUGES ALERT</div></div>
        <div className="rounded-lg bg-amber-50 p-2"><div className="text-lg font-black text-amber-700">{acousticSensors.filter(item => item.status !== 'MONITORING').length}</div><div className="text-[10px] font-bold text-amber-600">SENSOR FLAGS</div></div>
        <div className="rounded-lg bg-emerald-50 p-2"><div className="text-lg font-black text-emerald-700">{activeDrones}</div><div className="text-[10px] font-bold text-emerald-600">DRONES ACTIVE</div></div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-950 p-3 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Acoustic telemetry</span>
          <select value={sensorId} onChange={event => setSensorId(event.target.value)} className="rounded bg-slate-800 px-2 py-1 text-[10px] text-white outline-none">
            {acousticSensors.map(item => <option key={item.id} value={item.id}>{item.id} · {item.riskZone}</option>)}
          </select>
        </div>
        <div className="flex h-10 items-end gap-1" aria-label={`${sensor.name} vibration waveform`}>
          {Array.from({ length: 28 }, (_, index) => <span key={index} className={`w-full rounded-t ${sensor.vibration > 80 ? 'bg-red-400' : 'bg-cyan-400'}`} style={{ height: `${18 + ((index * 17 + sensor.vibration) % 70)}%` }} />)}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
          <span>{sensor.name}</span><span className="font-bold text-white">{sensor.vibration}/100 · {sensor.frequency} Hz</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
        <Gauge className="h-3.5 w-3.5" /> Cached risk vectors and sensor telemetry remain available during fiber cuts.
      </div>
    </aside>
  );
}
