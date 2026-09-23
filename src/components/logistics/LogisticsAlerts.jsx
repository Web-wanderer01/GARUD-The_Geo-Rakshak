import React, { useContext } from 'react';
import { AlertTriangle, MapPin, Clock, Info } from 'lucide-react';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import { roads } from '../../data/roads';

export default function LogisticsAlerts() {
  const { liveFleet } = useContext(LiveDataContext);

  // Generate logistics alerts dynamically based on fleet delays and road blockages
  const delayedFleet = liveFleet.filter(truck => truck.status === 'delayed' || truck.status === 'critical');
  const blockedRoads = roads.filter(road => road.status === 'fully_blocked' || road.status === 'partially_blocked');

  const alerts = [
    ...blockedRoads.map(road => ({
      id: 'road-' + road.id,
      type: 'road',
      severity: road.status === 'fully_blocked' ? 'critical' : 'high',
      title: 'Transport Corridor Disrupted',
      message: road.name + ' (' + road.from + ' to ' + road.to + ') is ' + road.status.replace('_', ' ') + '. Rerouting advised.',
      timestamp: road.lastUpdated || new Date().toISOString(),
      location: road.state
    })),
    ...delayedFleet.map(truck => ({
      id: 'fleet-' + truck.id,
      type: 'delivery',
      severity: truck.status === 'critical' ? 'high' : 'medium',
      title: 'Delivery Delayed: ' + truck.cargo.toUpperCase(),
      message: 'Fleet ' + truck.id + ' (' + truck.origin + ' to ' + truck.destination + ') is delayed. Reason: ' + (truck.delayReason || 'Severe weather routing') + '.',
      timestamp: new Date().toISOString(),
      location: truck.destination
    }))
  ].sort((a, b) => {
    const sevMap = { critical: 3, high: 2, medium: 1, low: 0 };
    return sevMap[b.severity] - sevMap[a.severity];
  });

  const getSeverityColors = (sev) => {
    switch (sev) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Logistics Alerts</h2>
          <p className="text-sm text-slate-500">Automated alerts for delayed deliveries and blocked routes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {alerts.length === 0 ? (
          <div className="text-center text-slate-500 py-8 flex flex-col items-center">
            <Info className="w-8 h-8 text-slate-300 mb-2" />
            <p>No active logistics alerts at this time.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={'p-4 rounded-lg border flex gap-4 items-start ' + getSeverityColors(alert.severity)}>
              <AlertTriangle className={'w-5 h-5 flex-shrink-0 mt-0.5 ' + (alert.severity === 'critical' ? 'text-red-600 animate-pulse' : 'text-orange-500')} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{alert.title}</h3>
                  <span className={'text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider ' + (alert.severity === 'critical' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900')}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm mb-2 opacity-90">{alert.message}</p>
                <div className="flex items-center gap-4 text-xs font-medium opacity-75">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {alert.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Just now</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
