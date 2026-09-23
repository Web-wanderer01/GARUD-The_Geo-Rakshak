import React from 'react';
import { Radio, ShieldCheck, Users, Wifi } from 'lucide-react';

const matrix = [
  { zone: 'Dima Hasao', rain: 86, probability: 78, eta: '18 min' },
  { zone: 'North Sikkim', rain: 72, probability: 64, eta: '31 min' },
  { zone: 'East Khasi Hills', rain: 58, probability: 42, eta: '44 min' },
  { zone: 'Churachandpur', rain: 39, probability: 24, eta: '—' },
];
const comms = [
  { label: 'Satellite uplinks', value: 92, status: 'STABLE' },
  { label: 'VHF repeaters', value: 74, status: 'DEGRADED' },
  { label: 'LoRaWAN mesh', value: 88, status: 'STABLE' },
];

export default function DecisionSupportPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700"><ShieldCheck className="h-4 w-4" /> Decision support engine</div><h2 className="mt-1 text-xl font-extrabold text-slate-900">45-minute impact outlook</h2></div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">MODEL UPDATED 38s AGO</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="pb-2">Zone</th><th className="pb-2">Rain / 3h</th><th className="pb-2">Landslide probability</th><th className="pb-2">Window</th></tr></thead>
          <tbody>{matrix.map(row => <tr key={row.zone} className="border-b border-slate-50"><td className="py-3 font-bold text-slate-800">{row.zone}</td><td className="py-3 text-slate-600">{row.rain} mm</td><td className="py-3"><div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${row.probability > 70 ? 'bg-red-500' : row.probability > 45 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${row.probability}%` }} /></div><b>{row.probability}%</b></div></td><td className="py-3 font-semibold text-slate-500">{row.eta}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Users className="h-4 w-4 text-blue-600" /> Resource readiness</div><div className="space-y-3">{[['NDRF / SDRF battalions', '18 / 24'], ['Choppers · Mohanbari / GHY', '5 / 7'], ['Nearest camp capacity', '68% free']].map(([label, value]) => <div key={label} className="flex items-center justify-between text-xs"><span className="text-slate-500">{label}</span><b className="text-slate-900">{value}</b></div>)}</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Wifi className="h-4 w-4 text-emerald-600" /> Communication grid health</div><div className="space-y-3">{comms.map(item => <div key={item.label}><div className="mb-1 flex justify-between text-xs"><span className="text-slate-500">{item.label}</span><b className={item.value < 80 ? 'text-amber-600' : 'text-emerald-600'}>{item.value}% · {item.status}</b></div><div className="h-2 rounded-full bg-slate-200"><div className={`h-2 rounded-full ${item.value < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.value}%` }} /></div></div>)}</div></div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800"><Radio className="h-4 w-4" /> Localized models combine IMD rainfall, soil moisture, slope and acoustic telemetry.</div>
    </section>
  );
}
