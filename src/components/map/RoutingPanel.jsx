import React, { useState } from 'react';
import { MapPin, Navigation, Crosshair, ArrowRight, Clock, AlertTriangle, ShieldCheck, ArrowLeftRight, Zap } from 'lucide-react';

export default function RoutingPanel({ 
  dispatchBase, setDispatchBase, 
  impactZone, setImpactZone, 
  onCalculateRoute,
  onClearRoute,
  routeResult 
}) {
  const [activeInput, setActiveInput] = useState(null); // 'dispatch' or 'impact'
  const [routeMode, setRouteMode] = useState('safest');

  const swapEndpoints = () => {
    const currentBase = dispatchBase;
    setDispatchBase(impactZone || null);
    setImpactZone(currentBase || null);
  };

  const applyPreset = (preset) => {
    setDispatchBase(preset.base);
    setImpactZone(preset.impact);
    setActiveInput(null);
  };

  const presets = [
    { label: 'GHY → Haflong', base: { name: 'Guwahati NDRF Base', lat: 26.1445, lng: 91.7362 }, impact: { name: 'Haflong Response Zone', lat: 25.1685, lng: 93.02 } },
    { label: 'Shillong → Cherrapunji', base: { name: 'Shillong SDRF Base', lat: 25.5788, lng: 91.8933 }, impact: { name: 'Cherrapunji Slide Zone', lat: 25.2702, lng: 91.7323 } },
    { label: 'Imphal → Tupul', base: { name: 'Imphal Relief Base', lat: 24.817, lng: 93.9368 }, impact: { name: 'Tupul Impact Zone', lat: 24.8468, lng: 93.6263 } },
  ];

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation && activeInput) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: "Current Location" };
          if (activeInput === 'dispatch') setDispatchBase(loc);
          if (activeInput === 'impact') setImpactZone(loc);
        },
        (err) => {
          alert("Geolocation failed: " + err.message);
        }
      );
    } else {
      alert("Please select either Dispatch Base or Impact Zone first, then click Use Current Location.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-blue-600" />
        Interactive Route Planner
      </h3>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-700"><Zap className="h-3.5 w-3.5" /> Dispatch profile</span>
          <span className="text-[10px] font-bold text-emerald-700">{dispatchBase && impactZone ? 'READY' : 'SELECT TWO POINTS'}</span>
        </div>
        <select value={routeMode} onChange={event => setRouteMode(event.target.value)} className="w-full rounded-md border border-blue-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700">
          <option value="safest">Safest route · prioritize risk</option>
          <option value="fastest">Fastest route · prioritize ETA</option>
          <option value="medical">Medical convoy · avoid steep slopes</option>
        </select>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map(preset => <button key={preset.label} onClick={() => applyPreset(preset)} className="rounded border border-blue-200 bg-white px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-100">{preset.label}</button>)}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Dispatch Base Input */}
        <div 
          className={`border-2 rounded-lg p-2 flex items-center gap-2 cursor-pointer transition-colors ${activeInput === 'dispatch' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
          onClick={() => setActiveInput('dispatch')}
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-grow">
            <div className="text-[10px] uppercase font-bold text-slate-500">Dispatch Base (Start)</div>
            <div className="text-sm font-medium text-slate-800">
              {dispatchBase ? `${dispatchBase.name || 'Selected Point'} (${dispatchBase.lat.toFixed(4)}, ${dispatchBase.lng.toFixed(4)})` : 'Click on map or search...'}
            </div>
          </div>
        </div>

        {/* Impact Zone Input */}
        <div 
          className={`border-2 rounded-lg p-2 flex items-center gap-2 cursor-pointer transition-colors ${activeInput === 'impact' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
          onClick={() => setActiveInput('impact')}
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-grow">
            <div className="text-[10px] uppercase font-bold text-slate-500">Impact Zone (End)</div>
            <div className="text-sm font-medium text-slate-800">
              {impactZone ? `${impactZone.name || 'Selected Point'} (${impactZone.lat.toFixed(4)}, ${impactZone.lng.toFixed(4)})` : 'Click on map or search...'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleUseCurrentLocation}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
        >
          <Crosshair className="w-4 h-4" /> My Location
        </button>
        {onClearRoute && (dispatchBase || impactZone) && (
          <button 
            onClick={onClearRoute}
            className="px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded-lg transition-colors border border-red-200"
          >
            Clear
          </button>
        )}
        <button onClick={swapEndpoints} disabled={!dispatchBase && !impactZone} title="Swap dispatch and impact points" className="rounded-lg border border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <button 
          onClick={onCalculateRoute}
          disabled={!dispatchBase || !impactZone}
          className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors ${dispatchBase && impactZone ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          Plan {routeMode === 'fastest' ? 'Fastest' : routeMode === 'medical' ? 'Medical' : 'Safest'} Route <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {routeResult && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Route Analysis</h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 p-2 rounded flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Distance</span>
              <span className="text-lg font-black text-slate-800">{routeResult.distanceKm.toFixed(1)} km</span>
            </div>
            <div className="bg-slate-50 p-2 rounded flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Travel Time</span>
              <span className="text-lg font-black text-slate-800 flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                {Math.ceil(routeResult.distanceKm / 40)} hrs
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div className="bg-blue-50 border border-blue-100 rounded p-1.5">
              <div className="text-[9px] text-blue-600 font-bold uppercase">Peak Rain</div>
              <div className="text-sm font-bold text-blue-800">{routeResult.maxRainfall || 0} mm</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded p-1.5">
              <div className="text-[9px] text-amber-600 font-bold uppercase">Max Moisture</div>
              <div className="text-sm font-bold text-amber-800">{routeResult.maxSoilMoisture || 0}%</div>
            </div>
            <div className={`border rounded p-1.5 ${routeResult.risk > 70 ? 'bg-red-50 border-red-200' : routeResult.risk > 40 ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className={`text-[9px] font-bold uppercase ${routeResult.risk > 70 ? 'text-red-600' : routeResult.risk > 40 ? 'text-orange-600' : 'text-emerald-600'}`}>Route Risk</div>
              <div className={`text-sm font-bold ${routeResult.risk > 70 ? 'text-red-800' : routeResult.risk > 40 ? 'text-orange-800' : 'text-emerald-800'}`}>{routeResult.risk}/100</div>
            </div>
          </div>

          <div className={`p-2 rounded-lg text-xs font-bold border ${routeResult.risk > 70 ? 'bg-red-50 text-red-700 border-red-200' : routeResult.risk > 40 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            <div className="flex items-center gap-1 mb-1">
              <ShieldCheck className="w-4 h-4" /> Condition: {routeResult.conditions || 'Clear'}
            </div>
            {routeResult.warnings && routeResult.warnings.length > 0 && (
              <ul className="list-disc pl-5 font-medium text-slate-700 space-y-0.5 mt-2">
                {routeResult.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      <p className="text-[10px] text-slate-400 mt-2 italic text-center">
        Tip: Click anywhere on the map to set the selected location marker. You can also drag the markers!
      </p>
    </div>
  );
}
