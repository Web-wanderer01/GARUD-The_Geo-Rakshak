import useOnlineStatus from '../../hooks/useOnlineStatus';
import { WifiOff, Info } from 'lucide-react';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-50 border-b-2 border-amber-300 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            You are currently offline. Displaying last available data.
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Field reports will be queued locally and submitted when connectivity is restored.
            In production, Service Workers and IndexedDB would cache risk maps and queue reports automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
