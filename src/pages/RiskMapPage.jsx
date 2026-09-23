import React, { useState, useEffect, useCallback } from 'react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import RiskMap from '../components/map/RiskMap';
import MapLegend from '../components/map/MapLegend';
import LayerControls from '../components/map/LayerControls';
import ModelStatusPanel from '../components/map/ModelStatusPanel';
import useLiveMeteoData from '../hooks/useLiveMeteoData';
import { zones, calculateRiskScore } from '../data/zones';
import FadeIn from '../components/common/FadeIn';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import LiveStatsSidebar from '../components/map/LiveStatsSidebar';
import LocationSearch from '../components/map/LocationSearch';
import RoutingPanel from '../components/map/RoutingPanel';
import { generateSimulatedRoute, predictRouteRisk } from '../services/RoutingService';
import TacticalCommandPanel from '../components/map/TacticalCommandPanel';
import useOnlineStatus from '../hooks/useOnlineStatus';

export default function RiskMapPage({ reports = [] }) {
  const { liveData, loading } = useLiveMeteoData(zones);
  const [activeLayers, setActiveLayers] = useState({
    satellite: false,
    riskZones: true,
    roads: false,
    camps: true,
    rainfall: false,
    trucks: true,
    westernDisturbance: false,
    radar: true,
    acousticSensors: true,
    riverGauges: true,
    droneCorridors: true,
  });
  const isOnline = useOnlineStatus();
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [evacuationRoute, setEvacuationRoute] = useState(null);
  const [focusCenter, setFocusCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Routing State
  const [dispatchBase, setDispatchBase] = useState(null);
  const [impactZone, setImpactZone] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [routeBounds, setRouteBounds] = useState(null);
  
  const getLiveZones = () => {
    if (!liveData) return zones; // fallback to static
    return zones.map(z => {
      const live = liveData[z.id];
      if (!live) return z;
      
      const newZone = { ...z, rainfall24h: live.liveRainfall, soilMoisture: live.liveSoilMoisture };
      newZone.riskScore = calculateRiskScore(newZone); // Recalculate AI score with LIVE data!
      return newZone;
    });
  };
  const currentZones = getLiveZones();

  const handleCalculateRoute = useCallback(() => {
    if (dispatchBase && impactZone) {
      const route = generateSimulatedRoute(dispatchBase.lat, dispatchBase.lng, impactZone.lat, impactZone.lng);
      const prediction = predictRouteRisk(route.path, currentZones);
      
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
        const altPrediction = predictRouteRisk(altPath, currentZones);
        
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
      setAlternateRoutes(altRoutes.sort((a, b) => a.risk - b.risk)); // Sort by risk (safest first)

      import('leaflet').then(L => {
        const bounds = L.default.latLngBounds(route.path);
        setRouteBounds(bounds);
      });
    }
  }, [dispatchBase, impactZone, currentZones]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  

  
  const handleToggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  return (
    <div className="page-enter relative pb-8">
      <BackgroundAnimation variant="topo" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-4">
        <FadeIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">GIS Risk Dashboard</h1>
              <p className="text-slate-700">Real-time spatial analysis of landslide vulnerability</p>
            </div>
            <SimulatedDataBadge />

        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="px-3 py-1 bg-blue-50 border border-blue-200 text--600 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
            📡 ISRO Bhuvan (Topography API)
          </span>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
            ☁️ IMD Telemetry (Live Rainfall)
          </span>
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text--600 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
            📍 NDMA Data Mesh
          </span>
        </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5">
          {/* Controls Sidebar / Top bar */}
          <FadeIn direction="left" delay={200} className="flex flex-col gap-3">
             <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1.35fr_1fr]">
               <div className="min-w-0">
                 <LocationSearch onLocationSelect={(zone) => {
                   setActiveLayers(prev => ({ ...prev, riskZones: true }));
                   setFocusCenter([zone.lat, zone.lng]);
                 }} />
                 <div className="mt-3">
                   <RoutingPanel 
                     dispatchBase={dispatchBase} setDispatchBase={setDispatchBase}
                     impactZone={impactZone} setImpactZone={setImpactZone}
                     onCalculateRoute={handleCalculateRoute} routeResult={routeResult}
                     onClearRoute={handleClearRoute}
                   />
                 </div>
               </div>
               <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                 <h3 className="font-bold text-slate-900 text-sm mb-2">Map Layers</h3>
                 <LayerControls activeLayers={activeLayers} onToggleLayer={handleToggleLayer} />
                 <ModelStatusPanel />
               </div>
               <div className="min-w-0">
                 <TacticalCommandPanel activeLayers={activeLayers} onToggleLayer={handleToggleLayer} isOnline={isOnline} />
               </div>
             </div>
          </FadeIn>

          <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main Map Area */}
            <FadeIn direction="scale" delay={300} className="relative flex min-w-0 flex-col rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
            {isMapLoading ? (
              <LoadingSkeleton type="map" />
            ) : (
              <div className="transition-opacity duration-500 ease-in-out opacity-100 flex-1 h-full min-h-[500px] relative">
                
                {/* Floating GPS Button */}
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        pos => {
                          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                          setUserLocation(loc);
                          setFocusCenter([loc.lat, loc.lng]);
                        },
                        err => {
                          console.warn("GPS failed, using fallback:", err);
                          // Fallback to Shillong coordinates
                          const loc = { lat: 25.5788, lng: 91.8933 };
                          setUserLocation(loc);
                          setFocusCenter([loc.lat, loc.lng]);
                        },
                        { enableHighAccuracy: true, timeout: 5000 }
                      );
                    }
                  }}
                  className="absolute top-4 right-4 z-[1000] bg-white border-2 border-slate-200 text-blue-600 p-2.5 rounded-xl shadow-lg hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all flex items-center justify-center"
                  title="Locate Me (Satellite)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
                </button>

                {/* MOCK DATA: Map interactions simulated without actual GIS server */}
                <RiskMap 
                  activeLayers={activeLayers} 
                  reports={reports} 
                  focusCenter={focusCenter}
                  userLocation={userLocation}
                  dispatchBase={dispatchBase}
                  setDispatchBase={setDispatchBase}
                  impactZone={impactZone}
                  setImpactZone={setImpactZone}
                  routeResult={routeResult}
                  alternateRoutes={alternateRoutes}
                  routeBounds={routeBounds}
                />
              </div>
            )}
            
            {!isMapLoading && (
              <FadeIn direction="up" delay={400} className="mt-2">
                <MapLegend />
              </FadeIn>
            )}
            </FadeIn>

            {/* Live Impact Stats Sidebar */}
            <FadeIn direction="right" delay={400} className="min-w-0">
              <LiveStatsSidebar />
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
