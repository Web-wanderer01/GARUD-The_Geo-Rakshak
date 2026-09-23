import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status.
 *
 * Uses navigator.onLine and listens for 'online'/'offline' events.
 * Components can use this to:
 *   - Show an offline banner
 *   - Queue field reports for later sync
 *   - Display cached data warnings
 *
 * INTEGRATION POINT: In production, this would be paired with:
 *   - Service Worker for offline caching (Workbox)
 *   - IndexedDB for queuing field reports
 *   - Background Sync API for automatic retry when connectivity returns
 */
export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
