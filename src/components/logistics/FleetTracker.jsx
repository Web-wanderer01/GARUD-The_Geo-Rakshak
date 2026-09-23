import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Truck, MapPin, Clock, AlertTriangle, ShieldCheck, Box, Plane, Navigation } from 'lucide-react';
import { useContext } from 'react';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import SimulatedDataBadge from '../common/SimulatedDataBadge';
import RoutingPanel from '../map/RoutingPanel';
import RiskMap from '../map/RiskMap';
import { generateSimulatedRoute, predictRouteRisk } from '../../services/RoutingService';

export default function FleetTracker() {
  const [filter, setFilter] = useState('all');
  const [activeTruckId, setActiveTruckId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Routing State
  const [dispatchBase, setDispatchBase] = useState(null);
  const [impactZone, setImpactZone] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [routeBounds, setRouteBounds] = useState(null);
  
  // Simulation state for truck movement
  const { liveFleet, liveZones } = useContext(LiveDataContext);

  const handleCalculateRoute = useCallback(() => {
    if (dispatchBase && impactZone) {
      const route = generateSimulatedRoute(dispatchBase.lat, dispatchBase.lng, impactZone.lat, impactZone.lng);
      const prediction = predictRouteRisk(route.path, liveZones);
      
      setRouteResult({
        ...route,
        risk: prediction.riskScore,
        conditions: prediction.conditions,
        warnings: prediction.warnings,
        maxRainfall: prediction.maxRainfall,
        maxSoilMoisture: prediction.maxSoilMoisture
      });
      
      // Generate 3 alternate routes
      const altRoutes = [];
      for (let i = 0; i < 3; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.4;
        const offsetLng = (Math.random() - 0.5) * 0.4;
        const altRoute = generateSimulatedRoute(dispatchBase.lat + offsetLat, dispatchBase.lng + offsetLng, impactZone.lat, impactZone.lng);
        const altPath = altRoute.path.map(p => [p[0] + (Math.random()-0.5)*0.02, p[1] + (Math.random()-0.5)*0.02]);
        const altPrediction = predictRouteRisk(altPath, liveZones);
        
        altRoutes.push({
          ...altRoute,
          path: altPath,
          risk: altPrediction.riskScore,
          conditions: altPrediction.conditions,
          warnings: altPrediction.warnings,
          maxRainfall: altPrediction.maxRainfall,
          maxSoilMoisture: altPrediction.maxSoilMoisture,
          id: i
        });
      }
      setAlternateRoutes(altRoutes.sort((a, b) => a.risk - b.risk));

      import('leaflet').then(L => {
        const bounds = L.default.latLngBounds(route.path);
        setRouteBounds(bounds);
      });
    }
  }, [dispatchBase, impactZone, liveZones]);

  // Auto-recalculate route when markers are dragged
  useEffect(() => {
    if (routeResult && dispatchBase && impactZone) {
      handleCalculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchBase, impactZone]);

  const handleClearRoute = () => {
    setDispatchBase(null);
    setImpactZone(null);
    setRouteResult(null);
    setAlternateRoutes([]);
    setRouteBounds(null);
  };

  const activeTruck = activeTruckId ? liveFleet.find(t => t.id === activeTruckId) : null;

  const filteredFleet = filter === 'all' 
    ? liveFleet 
    : liveFleet.filter(t => t.category === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Live GPS Fleet Tracker</h2>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'medicine', 'food', 'construction', 'agriculture'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors border ${
              filter === cat 
                ? 'bg-slate-800 text-white border-slate-800' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Layout: Map (Left) + List/Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        {/* Map View */}
        <div className="h-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
          <RiskMap 
            activeLayers={{ riskZones: true, roads: true, trucks: true, satellite: false }}
            dispatchBase={dispatchBase}
            setDispatchBase={setDispatchBase}
            impactZone={impactZone}
            setImpactZone={setImpactZone}
            routeResult={routeResult}
            alternateRoutes={alternateRoutes}
            routeBounds={routeBounds}
            focusCenter={activeTruck && isFollowing ? [activeTruck.lat, activeTruck.lng] : null}
          />
        </div>

        {/* List / Detail View */}
        <div className="h-full overflow-y-auto pr-2 space-y-4">
          {activeTruck ? (
            <div className="border border-blue-200 bg-blue-50/50 p-5 rounded-xl h-full flex flex-col relative">
              <button 
                onClick={() => { setActiveTruckId(null); setIsFollowing(false); }}
                className="absolute top-4 right-4 text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Back to List
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                {activeTruck.id.startsWith('HELI') ? <Plane className="w-8 h-8 text-purple-600" /> : activeTruck.id.startsWith('DRN') ? <Navigation className="w-8 h-8 text-blue-500" /> : <Box className="w-8 h-8 text-blue-600" />}
                <div>
                  <h3 className="text-xl font-black text-slate-800">{activeTruck.id}</h3>
                  <p className="text-sm text-slate-500 font-medium capitalize">{activeTruck.id.startsWith('HELI') ? 'Airlift' : activeTruck.id.startsWith('DRN') ? 'Scout Drone' : 'Road Transport'} - {activeTruck.category}</p>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded text-xs font-bold w-max mb-4 uppercase tracking-wider border ${getStatusColor(activeTruck.status)}`}>
                STATUS: {activeTruck.status}
              </div>

              <div className="space-y-4 flex-grow">
                {/* Core Routing */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-slate-500 font-medium">Route & ETA</div>
                    <div className="text-[10px] font-mono text-slate-400">ID: {activeTruck.routeId}</div>
                  </div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {activeTruck.origin} <span className="text-slate-400">→</span> {activeTruck.destination}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Expected ETA: <span className="font-bold">{activeTruck.eta}</span></div>
                </div>

                {/* Live Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-lg text-white">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Speed</div>
                    <div className="text-xl font-mono font-bold">{Math.round(activeTruck.speed)} <span className="text-xs font-sans font-normal text-slate-400">km/h</span></div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg text-white">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Heading</div>
                    <div className="text-xl font-mono font-bold">{Math.round(activeTruck.heading)}° <span className="text-xs font-sans font-normal text-slate-400">N</span></div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 col-span-2 flex justify-between items-center">
                     <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Signal Strength</div>
                       <div className="flex items-center gap-1 mt-1">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className={`w-2 h-3 rounded-sm ${i < (activeTruck.signalStrength / 20) ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                         ))}
                         <span className="text-xs font-mono ml-2 text-slate-600">{Math.round(activeTruck.signalStrength)}%</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Accuracy</div>
                       <div className="text-sm font-mono font-bold text-slate-700 mt-1">±{activeTruck.gpsAccuracy}m</div>
                     </div>
                  </div>
                </div>

                <div className="text-[10px] text-center text-slate-500 font-mono">
                  Last Updated: {new Date(activeTruck.lastUpdated).toLocaleTimeString()}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`${isFollowing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} text-xs font-bold py-2 rounded-lg transition-colors`}
                  >
                    {isFollowing ? 'Stop Following' : 'Follow Vehicle'}
                  </button>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold py-2 rounded-lg transition-colors">
                    Navigate
                  </button>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold py-2 rounded-lg transition-colors">
                    Reroute
                  </button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold py-2 rounded-lg transition-colors">
                    Emergency
                  </button>
                </div>

                {activeTruck.delayReason && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex gap-2 items-start mt-4">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-red-800 font-bold mb-0.5">Delay Reason</div>
                      <div className="text-sm text-red-700">{activeTruck.delayReason}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <RoutingPanel 
                  dispatchBase={dispatchBase} setDispatchBase={setDispatchBase}
                  impactZone={impactZone} setImpactZone={setImpactZone}
                  onCalculateRoute={handleCalculateRoute} routeResult={routeResult}
                  onClearRoute={handleClearRoute}
                />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Active Fleet List</h3>
              {filteredFleet.map((truck) => (
              <div 
                key={truck.id} 
                onClick={() => { setActiveTruckId(truck.id); setIsFollowing(true); }}
                className="p-4 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-md cursor-pointer transition-all bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {truck.id.startsWith('HELI') ? <Plane className="w-4 h-4 text-purple-600" /> : truck.id.startsWith('DRN') ? <Navigation className="w-4 h-4 text-blue-500" /> : <Truck className="w-4 h-4 text-blue-600" />}
                    <span className="font-bold text-slate-800">{truck.id}</span>
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{truck.cargo}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getStatusColor(truck.status)}`}>
                    {truck.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-3">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {truck.origin} → {truck.destination}
                  </div>
                </div>
              </div>
            ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
