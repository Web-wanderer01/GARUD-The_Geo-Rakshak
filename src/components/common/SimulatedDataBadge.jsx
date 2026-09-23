import { AlertTriangle, Activity } from 'lucide-react';
import { useContext } from 'react';
import { LiveDataContext } from '../../contexts/LiveDataContext';

/**
 * Badge to label whether data is mock or live from APIs.
 */
export default function SimulatedDataBadge({ className = '' }) {
  const { isLiveConnected } = useContext(LiveDataContext);

  if (isLiveConnected) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full ${className}`}
        title="Connected to Live IMD/Open-Meteo & USGS APIs for real-time telemetry."
      >
        <Activity className="w-3 h-3 animate-pulse" />
        Live API Connected
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full ${className}`}
      title="This data is simulated for demonstration purposes."
    >
      <AlertTriangle className="w-3 h-3" />
      Connecting...
    </span>
  );
}
