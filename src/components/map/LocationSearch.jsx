import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, AlertTriangle, CloudRain, Droplets, ArrowRight, X } from "lucide-react";
import { zones, getRiskLevel, RISK_LEVELS } from "../../data/zones";

// Sort all zones by risk score descending once at module load
const ALL_ZONES_SORTED = [...zones].sort((a, b) => b.riskScore - a.riskScore);

export default function LocationSearch({ onLocationSelect, compact = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter using while loop
  const runSearch = useCallback((q) => {
    if (!q || q.trim() === "") {
      setResults(ALL_ZONES_SORTED);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = [];
    let i = 0;
    while (i < zones.length) {
      const z = zones[i];
      if (
        z.name.toLowerCase().includes(lower) ||
        z.district.toLowerCase().includes(lower) ||
        z.state.toLowerCase().includes(lower)
      ) {
        filtered.push(z);
      }
      i++;
    }
    setResults(filtered.sort((a, b) => b.riskScore - a.riskScore));
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedZone(null);
    runSearch(val);
    setShowDropdown(true);
  };

  const handleFocus = () => {
    runSearch(query);
    setShowDropdown(true);
  };

  const handleSelect = (zone) => {
    setSelectedZone(zone);
    setQuery(zone.name);
    setShowDropdown(false);
    if (onLocationSelect) onLocationSelect(zone);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedZone(null);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const getRecommendation = (score) => {
    if (score > 80) return "IMMEDIATE EVACUATION RECOMMENDED. High probability of catastrophic failure.";
    if (score > 60) return "Alert: Prepare for possible evacuation. Monitor local authority channels.";
    if (score > 40) return "Caution: Avoid steep slopes and valleys during heavy rain.";
    return "Normal conditions. Stay informed.";
  };

  return (
    <div className="w-full relative z-[500]" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search village, district or state in NER..."
          className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-700 shadow-sm transition-all text-sm font-medium"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-[600]">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {query ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : `All ${results.length} zones sorted by risk`}
          </div>
          {results.map((zone) => {
            const risk = getRiskLevel(zone.riskScore);
            const color = RISK_LEVELS[risk]?.color || "#94a3b8";
            return (
              <div
                key={zone.id}
                className="px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(zone);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{zone.name}</h4>
                    <p className="text-xs text-slate-500">{zone.district}, {zone.state}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full text-white flex-shrink-0 ml-2" style={{ backgroundColor: color }}>
                  {zone.riskScore}/100
                </span>
              </div>
            );
          })}
        </div>
      )}

      {selectedZone && !showDropdown && !compact && (
        <div className="mt-3 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl"
            style={{ backgroundColor: RISK_LEVELS[getRiskLevel(selectedZone.riskScore)]?.color }}
          />
          <div className="pl-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedZone.name}</h3>
                <p className="text-sm text-slate-500">{selectedZone.district}, {selectedZone.state}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-800">
                  {selectedZone.riskScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <p className="text-[10px] font-bold uppercase" style={{ color: RISK_LEVELS[getRiskLevel(selectedZone.riskScore)]?.color }}>
                  AI Risk Score
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Rain 24h</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedZone.rainfall24h ?? "N/A"} mm</p>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Soil Moist</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedZone.soilMoisture ?? "N/A"}%</p>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Slope</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedZone.slopeAngle ?? "N/A"} deg</p>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Road</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedZone.roadStatus ?? "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 text-white p-3 rounded-lg flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedZone.riskScore > 60 ? "text-red-400" : "text-blue-300"}`} />
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase mb-1">AI Recommendation</h4>
                <p className="text-sm font-medium">{getRecommendation(selectedZone.riskScore)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
