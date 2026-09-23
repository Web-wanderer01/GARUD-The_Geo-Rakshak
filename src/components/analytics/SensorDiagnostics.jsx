import React from 'react';
import { Activity, Signal, Battery, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { zones } from '../../data/zones';
import SimulatedDataBadge from '../common/SimulatedDataBadge';

export default function SensorDiagnostics() {
  // Generate some realistic-looking diagnostics for the zones
  const diagnostics = zones.map(z => {
    // Generate deterministic but pseudo-random values based on zone name
    const hash = z.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const battery = Math.min(100, Math.max(10, 100 - (hash % 40)));
    const signal = Math.min(100, Math.max(20, 100 - (hash % 50)));
    const pingMs = 45 + (hash % 120);
    
    // Status logic
    let status = 'Online';
    let statusColor = 'text-green-500 bg-green-50';
    let Icon = CheckCircle2;
    
    if (battery < 20 || signal < 30) {
      status = 'Degraded';
      statusColor = 'text-orange-500 bg-orange-50';
      Icon = AlertTriangle;
    }
    if (pingMs > 150) {
      status = 'High Latency';
      statusColor = 'text-yellow-600 bg-yellow-50';
      Icon = Activity;
    }
    
    return {
      ...z,
      battery,
      signal,
      pingMs,
      status,
      statusColor,
      Icon
    };
  }).sort((a, b) => b.pingMs - a.pingMs); // Sort by highest latency first

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Live IoT Sensor Diagnostics</h2>
          <p className="text-sm text-slate-500">Hardware telemetry from deployed early-warning sensors</p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
            <tr>
              <th className="px-4 py-3">Sensor Node</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Signal (4G/LTE)</th>
              <th className="px-4 py-3">Battery (Solar)</th>
              <th className="px-4 py-3">Latency</th>
            </tr>
          </thead>
          <tbody>
            {diagnostics.map((d, i) => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-4 font-medium text-slate-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  {d.id}-NDMA
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {d.name}, {d.state}
                </td>
                <td className="px-4 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${d.statusColor}`}>
                    <d.Icon className="w-3.5 h-3.5" />
                    {d.status}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Signal className={`w-4 h-4 ${d.signal > 50 ? 'text-green-500' : 'text-orange-500'}`} />
                    <span className="text-slate-600 font-medium">{d.signal}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${d.battery > 30 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-slate-600 font-medium">{d.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-slate-600">
                  {d.pingMs}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
