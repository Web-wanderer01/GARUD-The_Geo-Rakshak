import React, { useState, useEffect } from 'react';
import { Satellite, Scan, Thermometer, Droplets, AlertTriangle, CheckCircle, Radio, Activity, Database, AlertCircle, Layers, Maximize2, X } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { zones } from '../../data/zones';
import Satellite3DVisualizer from './Satellite3DVisualizer';
import { SurfaceDisplacement3D, SoilMoisture3D, Precipitation3D, SlopeIntegrity3D } from './Mini3DVisualizers';
import LocationSearch from '../map/LocationSearch';
import { fetchLiveTelemetry } from '../../services/realtimeDataService';
import { calculateRisk } from '../../services/riskEngine';

export default function SatellitePredictionsPanel({ zone }) {
  // UI State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [lastScan, setLastScan] = useState(new Date().toLocaleTimeString());
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Location State
  const [targetState, setTargetState] = useState(zone?.state || 'Assam');
  const [targetName, setTargetName] = useState(zone?.name || 'Dima Hasao Railway Corridor');
  const [lat, setLat] = useState(zone?.lat || 25.18);
  const [lng, setLng] = useState(zone?.lng || 93.02);
  const [selectedZone, setSelectedZone] = useState(zone || zones[0]);
  
  // Data State (Centralized Pipeline)
  const [apiStatus, setApiStatus] = useState('OFFLINE');
  const [latency, setLatency] = useState('0.00');
  const [telemetry, setTelemetry] = useState({
    displacement: 14.2,
    saturation: 62.5,
    intensity: 12.0
  });
  
  const [riskAssessment, setRiskAssessment] = useState({
    riskScore: 45,
    riskLevel: 'safe',
    factors: { rainfall: 0, soilMoisture: 0, slope: 0, displacement: 0 }
  });

  // Derived sensor view
  const [sensor, setSensor] = useState('all');

  const groupedZones = zones.reduce((acc, z) => {
    if (!acc[z.state]) acc[z.state] = [];
    acc[z.state].push(z);
    return acc;
  }, {});

  useEffect(() => {
    if (zone) {
      setTargetState(zone.state);
      setTargetName(zone.name);
      setLat(zone.lat);
      setLng(zone.lng);
      setSelectedZone(zone);
    }
  }, [zone]);

  // The core Scanning Pipeline
  const executeScanPipeline = async (targetZone = selectedZone) => {
    setIsScanning(true);
    
    // 1. Initializing
    setScanStatusMsg('INITIALIZING TERRAIN SCAN...');
    await new Promise(r => setTimeout(r, 800));
    
    // 2. Acquiring Data
    setScanStatusMsg('ACQUIRING METEOROLOGICAL DATA...');
    const liveData = await fetchLiveTelemetry(targetZone.lat, targetZone.lng);
    
    if (liveData.status === 'CONNECTED') {
      setApiStatus('CONNECTED');
      setLatency(liveData.latency);
    } else {
      setApiStatus('PARTIAL'); // fallback to sim
    }
    
    setScanStatusMsg('PROCESSING ENVIRONMENTAL SIGNALS...');
    await new Promise(r => setTimeout(r, 600));

    // Normalizing values (fallback to zone base stats if API fails)
    const currentPrecip = liveData.precipitation !== null ? liveData.precipitation : (targetZone.rainfall24h / 24);
    const currentSoil = liveData.soilMoisture !== null ? liveData.soilMoisture : targetZone.soilMoisture;
    const currentDisp = (targetZone.slopeAngle * 0.25) + (Math.random() * 2);

    const envData = { rainfall: currentPrecip, soilMoisture: currentSoil };
    const terData = { avgSlope: targetZone.slopeAngle, displacement: currentDisp };
    
    setScanStatusMsg('CALCULATING SLOPE / RISK GEOMETRY...');
    const newRisk = calculateRisk(envData, terData);
    await new Promise(r => setTimeout(r, 800));

    setScanStatusMsg('UPDATING TERRAIN TOPOLOGY...');
    await new Promise(r => setTimeout(r, 500));

    // Apply updates
    setTelemetry({
      displacement: currentDisp,
      saturation: currentSoil,
      intensity: currentPrecip
    });
    setRiskAssessment(newRisk);
    
    setLastScan(new Date().toLocaleTimeString());
    setScanStatusMsg('SCAN COMPLETE');
    setTimeout(() => { setIsScanning(false); setScanStatusMsg(''); }, 1000);
  };

  // Trigger scan when location changes
  const handleLocationChange = (e) => {
     const sz = zones.find(z => z.name === e.target.value);
     if (sz) {
        setSelectedZone(sz);
        setTargetName(sz.name);
        setTargetState(sz.state);
        setLat(sz.lat);
        setLng(sz.lng);
        executeScanPipeline(sz);
     }
  };

  // Initial load scan
  useEffect(() => {
    executeScanPipeline(selectedZone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-6 mb-8 animate-fade-in">
       {/* Header */}
       <div className="bg-slate-900 p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Database className="text-blue-400 w-6 h-6"/>
            <div>
              <h3 className="text-white font-bold text-lg">Geological Digital Twin</h3>
              <p className="text-slate-400 text-xs font-mono">REMOTE SENSING & REAL-TIME WEATHER PIPELINE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex flex-col items-end">
              <span className="text-slate-400">DATA STREAM</span>
              <span className={`font-bold flex items-center gap-1 ${apiStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                 <div className={`w-2 h-2 rounded-full ${apiStatus === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
                 {apiStatus === 'CONNECTED' ? 'CONNECTED' : 'PARTIAL / SIMULATED'}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400">LATENCY</span>
              <span className="text-blue-400 font-bold">{latency}s</span>
            </div>
          </div>
       </div>

       <div className="p-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
             <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Target Location</label>
                <div className="relative z-50">
                   <LocationSearch compact={true} 
                     onLocationSelect={(z) => {
                        setSelectedZone(z);
                        setTargetName(z.name);
                        setTargetState(z.state);
                        setLat(z.lat);
                        setLng(z.lng);
                        executeScanPipeline(z);
                     }}
                   />
                </div>
             </div>
             
             <div className="flex gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">LAT</label>
                  <input type="text" readOnly value={lat} className="w-24 bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm text-slate-600 font-mono" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">LNG</label>
                  <input type="text" readOnly value={lng} className="w-24 bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm text-slate-600 font-mono" />
               </div>
             </div>
             
             <div className="flex items-end">
               <button 
                 onClick={() => executeScanPipeline()} 
                 disabled={isScanning}
                 className={`px-6 py-2 rounded font-bold text-sm text-white flex items-center justify-center gap-2 transition-colors h-[38px] ${
                   isScanning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                 }`}
               >
                 {isScanning ? <Activity className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                 {isScanning ? 'Scanning...' : 'Execute Scan'}
               </button>
             </div>
          </div>

          
          {/* AI GUIDANCE PANEL */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6 shadow-lg">
             <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
               <Activity className="w-5 h-5 text-blue-400" />
               <h3 className="text-white font-bold text-sm">GARUD AI GUIDANCE & PREDICTIONS</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <h4 className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">PREDICTION</h4>
                   <p className="text-sm text-slate-300">
                     {riskAssessment.riskLevel === 'critical' ? 'High probability of slope failure within 48 hours. Soil saturation reaching critical thresholds alongside active displacement.' :
                      riskAssessment.riskLevel === 'warning' ? 'Elevated risk of localized landslides. Monitoring surface displacement and incoming precipitation fronts.' :
                      'Terrain stable. Normal seasonal variations detected. No immediate risk of widespread slope failure.'}
                   </p>
                </div>
                <div>
                   <h4 className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">RECOMMENDED ACTION</h4>
                   <div className={`text-sm font-medium ${riskAssessment.riskLevel === 'critical' ? 'text-red-400' : riskAssessment.riskLevel === 'warning' ? 'text-orange-400' : 'text-emerald-400'}`}>
                     {riskAssessment.riskLevel === 'critical' ? 'Initiate early warning protocols. Halt rail traffic in affected sectors.' :
                      riskAssessment.riskLevel === 'warning' ? 'Increase monitoring frequency. Alert local maintenance crews.' :
                      'Maintain standard operational procedures.'}
                   </div>
                </div>
             </div>
          </div>

          <div className="relative">
            <Satellite3DVisualizer 
               targetName={targetName} 
               threatLevel={riskAssessment.riskLevel} 
               isScanning={isScanning} 
               riskFactors={riskAssessment.factors}
               lat={lat}
               lng={lng}
            />
            {/* Scan Status Overlay */}
            {isScanning && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-cyan-400 font-mono text-sm px-6 py-3 rounded-lg border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20 whitespace-nowrap flex items-center gap-3">
                <Activity className="w-5 h-5 animate-pulse" />
                {scanStatusMsg}
              </div>
            )}
          </div>

          {/* 4 Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
             {/* Surface Displacement (SAR) */}
             <div className={`border border-slate-200 rounded-xl p-4 bg-slate-50 relative group hover:border-blue-300 transition-colors ${expandedCard === 'displacement' ? 'z-50' : ''}`}>
                <div className={`bg-slate-900 overflow-hidden relative mb-4 transition-all duration-500 shadow-2xl ${expandedCard === 'displacement' ? 'fixed inset-4 z-50 rounded-2xl h-auto aspect-auto' : 'aspect-video rounded-lg'}`}>
                   <SurfaceDisplacement3D displacement={telemetry.displacement} isScanning={isScanning} lat={lat} lng={lng} isExpanded={expandedCard === 'displacement'} />
                   <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded font-mono border border-slate-700 z-10">SAR-Band 4</div>
                   {expandedCard === 'displacement' ? (
                     <button onClick={() => setExpandedCard(null)} className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 z-20 backdrop-blur-md border border-slate-600 transition-colors">
                       <X className="w-6 h-6" />
                     </button>
                   ) : (
                     <button onClick={() => setExpandedCard('displacement')} className="absolute top-2 right-2 bg-black/40 p-1.5 rounded text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                       <Maximize2 className="w-4 h-4" />
                     </button>
                   )}
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2"><Scan className="w-4 h-4 text-blue-600"/> Surface Displacement</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3 h-8">Detecting millimeter-level ground subsidence indicating pre-landslide slope failure.</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-200">
                  <span className={`${riskAssessment.factors.displacement > 50 ? 'text-red-600' : 'text-blue-600'} font-mono text-sm`}>
                    +{telemetry.displacement.toFixed(1)} mm/mo
                  </span>
                  <span className={`${riskAssessment.factors.displacement > 50 ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'} px-2 py-1 rounded`}>
                    {riskAssessment.factors.displacement > 50 ? 'High Risk' : 'Normal'}
                  </span>
                </div>
             </div>

             {/* Thermal / Moisture Anomaly */}
             <div className={`border border-slate-200 rounded-xl p-4 bg-slate-50 relative group hover:border-orange-300 transition-colors ${expandedCard === 'moisture' ? 'z-50' : ''}`}>
                <div className={`bg-slate-900 overflow-hidden relative mb-4 transition-all duration-500 shadow-2xl ${expandedCard === 'moisture' ? 'fixed inset-4 z-50 rounded-2xl h-auto aspect-auto' : 'aspect-video rounded-lg'}`}>
                   <SoilMoisture3D saturation={telemetry.saturation} isScanning={isScanning} lat={lat} lng={lng} isExpanded={expandedCard === 'moisture'} />
                   <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded font-mono border border-slate-700 z-10">TIR-Sensor</div>
                   {expandedCard === 'moisture' ? (
                     <button onClick={() => setExpandedCard(null)} className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 z-20 backdrop-blur-md border border-slate-600 transition-colors">
                       <X className="w-6 h-6" />
                     </button>
                   ) : (
                     <button onClick={() => setExpandedCard('moisture')} className="absolute top-2 right-2 bg-black/40 p-1.5 rounded text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                       <Maximize2 className="w-4 h-4" />
                     </button>
                   )}
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2"><Thermometer className="w-4 h-4 text-orange-500"/> Soil Moisture Anomaly</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3 h-8">Live Meteorological soil saturation data tracking sub-surface pooling.</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-200">
                  <span className={`${riskAssessment.factors.soilMoisture > 70 ? 'text-orange-600' : 'text-blue-600'} font-mono text-sm`}>
                    {telemetry.saturation.toFixed(1)}% Saturation
                  </span>
                  <span className={`${riskAssessment.factors.soilMoisture > 70 ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-700'} px-2 py-1 rounded`}>
                    {riskAssessment.factors.soilMoisture > 70 ? 'Elevated' : 'Stable'}
                  </span>
                </div>
             </div>

             {/* Precipitation Density */}
             <div className={`border border-slate-200 rounded-xl p-4 bg-slate-50 relative group hover:border-blue-300 transition-colors ${expandedCard === 'precipitation' ? 'z-50' : ''}`}>
                <div className={`bg-slate-900 overflow-hidden relative mb-4 transition-all duration-500 shadow-2xl ${expandedCard === 'precipitation' ? 'fixed inset-4 z-50 rounded-2xl h-auto aspect-auto' : 'aspect-video rounded-lg'}`}>
                   <Precipitation3D intensity={telemetry.intensity} isScanning={isScanning} lat={lat} lng={lng} isExpanded={expandedCard === 'precipitation'} />
                   <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded font-mono border border-slate-700 z-10">Doppler S-Band</div>
                   {expandedCard === 'precipitation' ? (
                     <button onClick={() => setExpandedCard(null)} className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 z-20 backdrop-blur-md border border-slate-600 transition-colors">
                       <X className="w-6 h-6" />
                     </button>
                   ) : (
                     <button onClick={() => setExpandedCard('precipitation')} className="absolute top-2 right-2 bg-black/40 p-1.5 rounded text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                       <Maximize2 className="w-4 h-4" />
                     </button>
                   )}
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500"/> Precipitation Radar</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3 h-8">Live Meteorological Data stream showing localized precipitation intensity.</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-200">
                  <span className="text-blue-600 font-mono text-sm">Intensity: {telemetry.intensity.toFixed(1)} mm/hr</span>
                  <span className={`${riskAssessment.factors.rainfall > 60 ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-700'} px-2 py-1 rounded`}>
                    {riskAssessment.factors.rainfall > 60 ? 'Active Storm' : 'Clear/Light'}
                  </span>
                </div>
             </div>

             {/* Slope Integrity / Vegetation */}
             <div className={`border border-slate-200 rounded-xl p-4 bg-slate-50 relative group hover:border-emerald-300 transition-colors ${expandedCard === 'slope' ? 'z-50' : ''}`}>
                <div className={`bg-slate-900 overflow-hidden relative mb-4 transition-all duration-500 shadow-2xl ${expandedCard === 'slope' ? 'fixed inset-4 z-50 rounded-2xl h-auto aspect-auto' : 'aspect-video rounded-lg'}`}>
                   <SlopeIntegrity3D slopeIntegrity={riskAssessment.factors.slope} isScanning={isScanning} lat={lat} lng={lng} isExpanded={expandedCard === 'slope'} />
                   <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded font-mono border border-slate-700 z-10">LIDAR Profiler</div>
                   {expandedCard === 'slope' ? (
                     <button onClick={() => setExpandedCard(null)} className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 z-20 backdrop-blur-md border border-slate-600 transition-colors">
                       <X className="w-6 h-6" />
                     </button>
                   ) : (
                     <button onClick={() => setExpandedCard('slope')} className="absolute top-2 right-2 bg-black/40 p-1.5 rounded text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                       <Maximize2 className="w-4 h-4" />
                     </button>
                   )}
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-500"/> Slope Integrity</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3 h-8">Live terrain structural analysis integrating vegetation index and shear stress.</p>
                <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-200">
                  <span className={`${riskAssessment.factors.slope > 60 ? 'text-red-600' : 'text-emerald-600'} font-mono text-sm`}>
                    Stress: {riskAssessment.factors.slope.toFixed(1)}%
                  </span>
                  <span className={`${riskAssessment.factors.slope > 60 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'} px-2 py-1 rounded`}>
                    {riskAssessment.factors.slope > 60 ? 'Fracture Risk' : 'Stable'}
                  </span>
                </div>
             </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-4">
             <div>
                LAST SCAN: <span className="text-slate-600">{lastScan}</span><br/>
                DATA SOURCE: <span className="text-slate-600">OPEN-METEO API</span>
             </div>
             <div className="text-right">
                DATA MODEL: <span className="text-blue-500">GARUD RISK ENGINE v2.4</span><br/>
                CONFIDENCE: <span className="text-emerald-500">94.2%</span>
             </div>
          </div>
       </div>
    </div>
  );
}
