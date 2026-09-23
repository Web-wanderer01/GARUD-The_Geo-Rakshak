import React, { useState, useContext } from 'react';
import { AlertCircle, Radio, MapPin, CheckCircle2, WifiOff, Bluetooth, Plane } from 'lucide-react';
import { LiveDataContext } from '../../contexts/LiveDataContext';

export default function SOSButton() {
  const { dispatchFleet } = useContext(LiveDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, locating, sending, offline-mesh, success
  const [coords, setCoords] = useState({ lat: 26.2124, lng: 92.9376 });

  const triggerSOS = () => {
    setIsOpen(true);
    setStatus('locating');
    
    // Attempt real HTML5 Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation failed, using default')
      );
    }
    
    setTimeout(() => {
      setStatus('sending');
      
      // Simulate network failure after 2 seconds
      setTimeout(() => {
        setStatus('offline-mesh');
        
        // Simulate mesh success after 3 seconds
        setTimeout(() => {
          setStatus('success');
          // Actually dispatch NDRF Heli to the user's live location!
          if (dispatchFleet) {
            dispatchFleet({
              id: 'HELI-SOS-' + Math.floor(Math.random() * 900),
              category: 'medicine',
              cargo: 'Airlift Rescue & Medical Team',
              origin: 'Guwahati Command Center',
              destination: 'SOS Beacon Origin',
              transportMode: 'helicopter',
              status: 'critical',
              eta: '15 Minutes',
              lat: 26.14,
              lng: 91.73,
              speed: 250,
              delayReason: null,
              routeHistory: [[26.14, 91.73], [coords.lat, coords.lng]],
              route: 'Direct SOS Response Flight'
            });
          }
        }, 3000);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={triggerSOS}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 hover:scale-110 transition-all duration-300 animate-bounce cursor-pointer group"
        title="Emergency SOS"
      >
        <AlertCircle className="w-8 h-8 text-white" />
        <span className="absolute -top-10 bg-red-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
          EMERGENCY SOS
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-red-600 p-6 text-center relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Emergency SOS Beacon</h2>
          <p className="text-red-100 text-sm">Transmitting Distress Signal to NDRF</p>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4 font-mono text-sm">
          {/* Step 1: GPS */}
          <div className="flex items-center gap-3 text-slate-700">
            {status === 'locating' ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
            <span>Acquiring precise GPS coordinates... {status !== 'locating' && `[${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E]`}</span>
          </div>

          {/* Step 2: Main Network */}
          {(status === 'sending' || status === 'offline-mesh' || status === 'success') && (
            <div className="flex items-center gap-3 text-slate-700">
              {status === 'sending' ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={status === 'offline-mesh' || status === 'success' ? 'text-red-600 font-bold' : ''}>
                Connecting to primary cell network... {status === 'sending' ? '' : '[FAILED: NO SIGNAL]'}
              </span>
            </div>
          )}

          {/* Step 3: Mesh Network Fallback */}
          {(status === 'offline-mesh' || status === 'success') && (
            <div className="flex items-center gap-3 text-slate-700">
              {status === 'offline-mesh' ? (
                <Radio className="w-5 h-5 text-blue-600 animate-ping absolute" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <Bluetooth className={`w-5 h-5 ${status === 'offline-mesh' ? 'text-blue-600 relative z-10' : 'text-green-500'}`} />
              <span className="text-blue-700 font-bold">
                {status === 'offline-mesh' ? 'Initiating Bluetooth P2P Mesh Protocol...' : 'Mesh Node Connected!'}
              </span>
            </div>
          )}

          {/* Step 4: Success */}
          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center animate-in fade-in slide-in-from-bottom-2">
              <p className="font-bold mb-1">SOS DELIVERED VIA MESH</p>
              <p className="text-xs">Your signal hopped across 4 nearby citizen devices and reached the NDRF Command Center. <strong>An NDRF Airlift Helicopter has been automatically dispatched to your exact live location.</strong> Check the Fleet Tracker for ETA.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-100 text-center">
          <button 
            onClick={() => { setIsOpen(false); setStatus('idle'); }}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
          >
            {status === 'success' ? 'Close Window' : 'Cancel SOS'}
          </button>
        </div>
      </div>
    </div>
  );
}
