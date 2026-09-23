import React, { useState, useEffect, useContext } from 'react';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import { GitMerge, Route, AlertOctagon, CheckCircle2, ArrowRight, Activity, Map as MapIcon, Clock, Truck, List, Plane, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom animated truck icon
const TruckIcon = L.divIcon({
  html: `<div class="bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg shadow-blue-500/50 flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg></div>`,
  className: 'custom-truck-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const HeliIcon = L.divIcon({
  html: `<div class="bg-purple-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg shadow-purple-500/50 flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l-3.5-3.5C11.6 6.6 10.4 6 9 6c-2.3 0-3.6 1.8-3.1 4l1.2 5 2.1 4.2c.4.7 1.1 1.2 1.9 1.4.8.1 1.6-.1 2.3-.5l4.4-2.9z"/><path d="M22 6h-6"/><path d="M20 9V3"/><path d="M2 19h10"/></svg></div>`,
  className: 'custom-heli-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const DroneIcon = L.divIcon({
  html: `<div class="bg-blue-400 text-white p-1.5 rounded-full border-2 border-white shadow-lg shadow-blue-400/50 flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
  className: 'custom-drone-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});


const MapBoundsUpdater = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
};

// Global fleets list covering major states
const INITIAL_GLOBAL_FLEETS = [
  { id: 'NDRF-Alpha', origin: 'New Delhi', destination: 'Assam', color: '#3b82f6', startLat: 28.6139, startLng: 77.2090, endLat: 26.2006, endLng: 92.9376, progress: 30, speed: 1.2 },
  { id: 'NDRF-Bravo', origin: 'Kolkata', destination: 'Sikkim', color: '#10b981', startLat: 22.5726, startLng: 88.3639, endLat: 27.5330, endLng: 88.5122, progress: 65, speed: 0.8 },
  { id: 'SDRF-Charlie', origin: 'Guwahati', destination: 'Meghalaya', color: '#8b5cf6', startLat: 26.1445, startLng: 91.7362, endLat: 25.4670, endLng: 91.3662, progress: 80, speed: 1.5 },
  { id: 'NDRF-Delta', origin: 'Patna', destination: 'Arunachal Pradesh', color: '#f59e0b', startLat: 25.5941, startLng: 85.1376, endLat: 28.2180, endLng: 94.7278, progress: 45, speed: 1.0 },
  { id: 'SDRF-Echo', origin: 'Silchar', destination: 'Mizoram', color: '#ef4444', startLat: 24.8333, startLng: 92.7789, endLat: 23.1645, endLng: 92.9376, progress: 20, speed: 0.9 },
  { id: 'NDRF-Foxtrot', origin: 'Dimapur', destination: 'Nagaland', color: '#06b6d4', startLat: 25.8596, startLng: 93.7266, endLat: 26.1584, endLng: 94.5624, progress: 55, speed: 1.1 },
  { id: 'SDRF-Golf', origin: 'Imphal', destination: 'Manipur', color: '#ec4899', startLat: 24.8170, startLng: 93.9368, endLat: 24.6637, endLng: 93.9063, progress: 90, speed: 1.3 },
  { id: 'NDRF-Hotel', origin: 'Agartala', destination: 'Tripura', color: '#14b8a6', startLat: 23.8315, startLng: 91.2868, endLat: 23.9408, endLng: 91.9882, progress: 10, speed: 1.4 },
];

export default function AIRouteOptimizer() {
  const { dispatchFleet } = useContext(LiveDataContext);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargo, setCargo] = useState('');
  const [transportMode, setTransportMode] = useState('truck');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [globalFleets, setGlobalFleets] = useState(INITIAL_GLOBAL_FLEETS);
  const [viewMode, setViewMode] = useState('global'); // 'global' or 'single'

  // Animate global fleets
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalFleets(prevFleets => 
        prevFleets.map(fleet => {
          let newProgress = fleet.progress + fleet.speed;
          if (newProgress >= 100) newProgress = 0; // loop back for demo
          return { ...fleet, progress: newProgress };
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Animate single route tracking
  useEffect(() => {
    let interval;
    if (result && viewMode === 'single') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 1; // 1% per tick
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [result, viewMode]);

  const handleOptimize = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    
    setIsCalculating(true);
    setResult(null);
    setProgress(0);
    setViewMode('single');

    // Simulate ML network request
    setTimeout(() => {
      const getCoord = (str, isLat) => {
        const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const base = isLat ? 15.0 : 75.0;
        const variance = isLat ? 15.0 : 15.0;
        return base + (hash % 100) / 100 * variance;
      };
      
      const startLat = getCoord(origin, true);
      const startLng = getCoord(origin, false);
      const endLat = getCoord(destination, true);
      const endLng = getCoord(destination, false);
      
      const midLat = (startLat + endLat) / 2 + (Math.random() > 0.5 ? 2 : -2);
      const midLng = (startLng + endLng) / 2 + (Math.random() > 0.5 ? 2 : -2);

      setResult({
        incident: `High Risk Triggered at ${destination}`,
        primary: {
          route: 'National Highway Route',
          status: 'Blocked',
          distance: '1,450 km',
          time: '28 hrs',
          coords: [[startLat, startLng], [midLat, midLng], [endLat, endLng]]
        },
        alternates: [
          {
            id: 1,
            route: 'AI Optimized Safe Corridor',
            status: 'Clear',
            distance: '1,520 km',
            addedDistance: '+70 km',
            time: '24.5 hrs',
            addedTime: '-3.5 hrs (Avoids traffic)',
            eta: 'Next Day, 14:30',
            coords: [
              [startLat, startLng], 
              [startLat + (midLat-startLat)*0.3, startLng + (midLng-startLng)*0.4 + 1], 
              [startLat + (midLat-startLat)*0.7, startLng + (midLng-startLng)*0.8 - 1], 
              [endLat, endLng]
            ]
          }
        ]
      });

      if (dispatchFleet) {
        dispatchFleet({
          id: 'NDRF-' + Math.floor(Math.random() * 900 + 100),
          category: 'medicine',
          cargo: cargo,
          origin: origin,
          destination: destination,
          status: 'on-time',
          eta: 'Next Day, 14:30',
          lat: startLat,
          lng: startLng,
          speed: 60,
          delayReason: null,
          routeHistory: [
              [startLat, startLng], 
              [startLat + (midLat-startLat)*0.3, startLng + (midLng-startLng)*0.4 + 1], 
              [startLat + (midLat-startLat)*0.7, startLng + (midLng-startLng)*0.8 - 1], 
              [endLat, endLng]
          ],
          route: 'AI Optimized Safe Corridor'
        });
      }

      setGlobalFleets(prev => [
        {
          id: 'NDRF-' + Math.floor(Math.random() * 900 + 100),
          origin: origin,
          destination: destination,
          color: '#ef4444',
          startLat: startLat,
          startLng: startLng,
          endLat: endLat,
          endLng: endLng,
          progress: 0,
          speed: 1.5
        },
        ...prev
      ]);

      setIsCalculating(false);
    }, 1500);
  };

  const getInterpolatedPosition = (coords, prog) => {
    if (!coords || coords.length === 0) return [0,0];
    if (prog <= 0) return coords[0];
    if (prog >= 100) return coords[coords.length - 1];
    
    const totalSegments = coords.length - 1;
    const currentSegmentFloat = (prog / 100) * totalSegments;
    const segmentIndex = Math.floor(currentSegmentFloat);
    const segmentProgress = currentSegmentFloat - segmentIndex;
    
    const start = coords[segmentIndex];
    const end = coords[segmentIndex + 1];
    
    if (!start || !end) return coords[coords.length - 1];
    const lat = start[0] + (end[0] - start[0]) * segmentProgress;
    const lng = start[1] + (end[1] - start[1]) * segmentProgress;
    return [lat, lng];
  };

  const getTruckPosition = () => {
    if (!result) return [0,0];
    return getInterpolatedPosition(result.alternates[0].coords, progress);
  };

  const getAllFleetsCoordsForBounds = () => {
    return globalFleets.flatMap(f => [[f.startLat, f.startLng], [f.endLat, f.endLng]]);
  };

   return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Live GPS Fleet Tracker</h2>
            <p className="text-sm text-slate-500">Pan-India real-time dispatch and routing</p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setViewMode('global')}
             className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${viewMode === 'global' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
           >
             <MapIcon className="w-4 h-4" /> Global View
           </button>
           <button 
             onClick={() => { if(result) setViewMode('single') }}
             className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${viewMode === 'single' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'} ${!result && 'opacity-50 cursor-not-allowed'}`}
             disabled={!result}
           >
             <Truck className="w-4 h-4" /> Track Target
           </button>
        </div>
      </div>

      <form onSubmit={handleOptimize} className="flex flex-col gap-3 mb-6 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input 
            type="text"
            placeholder="Enter Dispatch Base (Origin)..."
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <ArrowRight className="w-5 h-5 text-slate-400 self-center hidden sm:block transform rotate-90 sm:rotate-0" />
          <input 
            type="text"
            placeholder="Enter Impact Zone (Destination)..."
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input 
            type="text"
            placeholder="Enter Cargo Details (e.g. Medical Supplies, Tents)..."
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="flex-[2] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <button 
            type="button"
            onClick={() => {
              setOrigin("Guwahati Supply Depot");
              setDestination("Dima Hasao (Landslide Zone)");
              setCargo("3x Earth Movers, 200 Emergency Medical Kits, 500 Tents");
            }}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <Activity className="w-4 h-4" /> AI Suggest
          </button>
          <button 
            type="submit"
            disabled={isCalculating || !origin || !destination || !cargo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCalculating ? <Activity className="w-4 h-4 animate-spin" /> : 'Dispatch Fleet'}
          </button>
        </div>
      </form>

      {isCalculating && (
        <div className="flex flex-col items-center justify-center text-blue-500 min-h-[300px]">
          <Activity className="w-10 h-10 animate-spin mb-4" />
          <p className="text-lg font-semibold animate-pulse">Establishing secure sat-link with fleet...</p>
        </div>
      )}

      {!isCalculating && viewMode === 'global' && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="flex flex-col lg:col-span-2">
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between mb-4">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg">Global Active Fleets</h3>
                   <p className="text-xs text-slate-500">Tracking {globalFleets.length} units nationwide</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
             </div>
             <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                {globalFleets.map(fleet => (
                   <div key={fleet.id} className="p-3 rounded-lg border bg-white shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-1 transition-all duration-300" style={{width: `${fleet.progress}%`, backgroundColor: fleet.color}}></div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-sm text-slate-800">{fleet.id}</span>
                         <span className="text-[10px] font-bold text-slate-500">{fleet.progress.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                         <span className="truncate">{fleet.origin}</span>
                         <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                         <span className="font-semibold text-slate-800 truncate">{fleet.destination}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
          <div className="lg:col-span-3 relative" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner z-10">
              <MapContainer 
                center={[22.5, 82.5]} // Center of India roughly
                zoom={4} 
                className="w-full h-full"
                zoomControl={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapBoundsUpdater coords={getAllFleetsCoordsForBounds()} />
                
                {globalFleets.map(fleet => {
                   const coords = [[fleet.startLat, fleet.startLng], [fleet.endLat, fleet.endLng]];
                   return (
                      <React.Fragment key={fleet.id}>
                         <Polyline positions={coords} color={fleet.color} weight={3} opacity={0.4} dashArray="5,5" />
                         <Marker position={getInterpolatedPosition(coords, fleet.progress)} icon={TruckIcon}>
                            <Popup><div className="font-bold">{fleet.id}</div><div>Heading to {fleet.destination}</div></Popup>
                         </Marker>
                      </React.Fragment>
                   );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {!isCalculating && viewMode === 'single' && result && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="flex flex-col lg:col-span-2">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2 text-base">
                <AlertOctagon className="w-5 h-5" />
                {result.incident}
              </div>
              <p className="text-sm text-red-600 font-medium">Standard routing blocked due to high disaster vulnerability.</p>
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-3">Live Fleet Status</h3>
            <div className="space-y-4">
              {result.alternates.map((alt, idx) => (
                <div key={alt.id} className="p-4 rounded-xl border-2 bg-blue-50/50 border-blue-400 shadow-sm relative overflow-hidden">
                   {/* Progress bar background */}
                   <div className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-100" style={{width: `${progress}%`}}></div>
                   
                  <div className="flex justify-between items-start mb-3 mt-1">
                    <div className="font-bold text-slate-800 flex items-center gap-2 text-base">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Target Fleet Active
                    </div>
                    <div className="text-xs font-medium text-slate-600 mb-1 line-clamp-1 border-b border-slate-100 pb-2">?? {cargo}</div>
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">
                      {progress < 100 ? 'In Transit' : 'Arrived'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm bg-white p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold mb-1">Time to Target</span>
                      <div className="font-bold text-slate-800">{progress < 100 ? alt.time : '0 hrs'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold mb-1">Est. Arrival</span>
                      <div className="font-bold text-blue-700">{alt.eta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 relative" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner z-10">
              <MapContainer 
                center={result.primary.coords[0]} 
                zoom={5} 
                className="w-full h-full"
                zoomControl={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapBoundsUpdater coords={[...result.primary.coords, ...result.alternates[0].coords]} />
                
                <Marker position={result.primary.coords[0]} icon={DefaultIcon}>
                  <Popup><div className="font-bold">{origin} (Dispatch Center)</div></Popup>
                </Marker>
                <Marker position={result.primary.coords[result.primary.coords.length - 1]} icon={DefaultIcon}>
                  <Popup><div className="font-bold">{destination} (Disaster Zone)</div></Popup>
                </Marker>

                {/* Blocked Route */}
                <Polyline positions={result.primary.coords} color="#ef4444" weight={3} dashArray="5,8" opacity={0.5} />
                
                {/* Active Route */}
                <Polyline positions={result.alternates[0].coords} color="#3b82f6" weight={4} opacity={0.8} />

                {/* Moving Truck Marker */}
                <Marker position={getTruckPosition()} icon={transportMode === 'helicopter' ? HeliIcon : transportMode === 'drone' ? DroneIcon : TruckIcon}>
                  <Popup><div className="font-bold text-blue-700">Target Fleet</div><div className="text-xs font-medium mt-1">?? {cargo}</div><div className="text-xs text-slate-500 mt-1">Speed: 60 km/h</div></Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
