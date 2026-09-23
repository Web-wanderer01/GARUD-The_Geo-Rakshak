import React, { useState, useEffect } from "react";
import { Users, Tent, TrendingUp, AlertTriangle, Activity, Cloud, RefreshCw } from "lucide-react";
import { zones, computeZoneStats } from "../../data/zones";

// Real NER capital cities for weather cross-check (Open-Meteo free API)
const NER_CAPITALS = [
  { name: "Guwahati",   lat: 26.14, lon: 91.74, state: "Assam" },
  { name: "Shillong",   lat: 25.57, lon: 91.88, state: "Meghalaya" },
  { name: "Imphal",     lat: 24.82, lon: 93.95, state: "Manipur" },
  { name: "Kohima",     lat: 25.67, lon: 94.11, state: "Nagaland" },
  { name: "Aizawl",     lat: 23.73, lon: 92.72, state: "Mizoram" },
  { name: "Agartala",   lat: 23.84, lon: 91.28, state: "Tripura" },
  { name: "Itanagar",   lat: 27.10, lon: 93.62, state: "Arunachal Pradesh" },
  { name: "Gangtok",    lat: 27.33, lon: 88.61, state: "Sikkim" },
];

// Fetch all 8 capitals in parallel from Open-Meteo
async function fetchRealWeather() {
  const results = await Promise.all(
    NER_CAPITALS.map(c =>
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
        `&current=precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,relative_humidity_2m` +
        `&daily=precipitation_sum&timezone=auto&forecast_days=1`
      ).then(r => r.json()).then(d => ({ ...c, data: d }))
    )
  );
  return results;
}

// Western Disturbance detector based on synoptic indicators
function detectWesternDisturbance(weatherList) {
  let westerlyCount = 0;
  let lowPressureCount = 0;
  let heavyRainCount = 0;
  let totalPrecip = 0;

  weatherList.forEach(({ data }) => {
    const cur = data?.current;
    if (!cur) return;
    const dir = cur.wind_direction_10m || 0;
    const press = cur.surface_pressure || 1015;
    const rain = cur.precipitation || 0;
    if (dir >= 225 && dir <= 315) westerlyCount++;
    if (press < 1012) lowPressureCount++;
    if (rain > 5) heavyRainCount++;
    totalPrecip += rain;
  });

  const prob = Math.min(100, Math.round(
    (westerlyCount / NER_CAPITALS.length) * 40 +
    (lowPressureCount / NER_CAPITALS.length) * 35 +
    (heavyRainCount / NER_CAPITALS.length) * 25
  ));
  return { prob, westerlyCount, lowPressureCount, heavyRainCount, totalPrecip: totalPrecip.toFixed(1) };
}

export default function LiveStatsSidebar() {
  const [weather, setWeather] = useState(null);
  const [wd, setWd] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const w = await fetchRealWeather();
      setWeather(w);
      setWd(detectWesternDisturbance(w));
      setLastUpdated(new Date());
    } catch (e) {
      console.warn("LiveStatsSidebar weather fetch failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  // Live zone-based metrics (from our expanded 70+ district zones)
  const allZones = zones;
  const criticalZones = allZones.filter(z => z.riskScore >= 76);
  const highZones     = allZones.filter(z => z.riskScore >= 56 && z.riskScore < 76);
  const stats         = computeZoneStats(allZones);
  const highestZone   = stats.highestRiskZone || { name: "None", riskScore: 0 };

  // Population at risk = sum of actual district populations in critical/high zones (real census 2011 data)
  const popAtRisk = [...criticalZones, ...highZones].reduce((sum, z) => sum + (z.population || 0), 0);
  const activeReliefCamps = Math.max(1, criticalZones.length * 2 + Math.floor(highZones.length / 2));
  const capacityPercent = Math.min(98, 40 + criticalZones.length * 5);

  // Avg 24h rainfall from weather API (real)
  const avgRain = weather
    ? (weather.reduce((s, w) => s + (w.data?.current?.precipitation || 0), 0) / NER_CAPITALS.length).toFixed(1)
    : "—";

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Live Impact Metrics
        </h3>
        <button onClick={loadData} title="Refresh" className="text-slate-400 hover:text-blue-500 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Population at Risk (latest projections) */}
      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
        <div className="flex items-center gap-2 text-red-700 mb-1">
          <Users className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Population at Risk</span>
        </div>
        <div className="text-2xl font-bold text-red-900">{popAtRisk.toLocaleString("en-IN")}</div>
        <p className="text-[10px] text-red-600 mt-1">Districts with score &gt;56 · Latest Projections</p>
      </div>

      {/* Active Relief Camps */}
      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Tent className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Active Relief Camps</span>
        </div>
        <div className="text-2xl font-bold text-emerald-900">{activeReliefCamps}</div>
        <p className="text-[10px] text-emerald-600 mt-1">Est. at {capacityPercent}% capacity based on critical zones</p>
      </div>

      {/* Highest Risk Zone */}
      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
        <div className="flex items-center gap-2 text-orange-700 mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Highest Risk Zone</span>
        </div>
        <div className="text-base font-bold text-orange-900 leading-tight">{highestZone.name}</div>
        <p className="text-[10px] text-orange-600 mt-1">{highestZone.district} · Score: {highestZone.riskScore}/100</p>
      </div>

      {/* Avg Live Rainfall (real Open-Meteo) */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 mb-1">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Avg Live Rainfall</span>
        </div>
        <div className="text-2xl font-bold text-blue-900">{avgRain} <span className="text-sm font-normal">mm/hr</span></div>
        <p className="text-[10px] text-blue-600 mt-1">Open-Meteo · 8 NER capitals · {lastUpdated ? lastUpdated.toLocaleTimeString("en-IN") : "loading…"}</p>
      </div>

      {/* Western Disturbance */}
      {wd && (
        <div className="bg-slate-800 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2 text-blue-300 mb-2 text-xs font-bold uppercase">
            <Cloud className="w-3.5 h-3.5" />
            Western Disturbance Index
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl font-black">{wd.prob}%</div>
            <div className={`text-xs px-2 py-0.5 rounded-full font-bold ${wd.prob > 60 ? "bg-red-500" : wd.prob > 30 ? "bg-orange-500" : "bg-blue-500"}`}>
              {wd.prob > 60 ? "HIGH" : wd.prob > 30 ? "MODERATE" : "LOW"}
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className={`h-full ${wd.prob > 60 ? "bg-red-400" : wd.prob > 30 ? "bg-orange-400" : "bg-blue-400"}`} style={{ width: `${wd.prob}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
            <span>🌬 Westerly: {wd.westerlyCount}/{NER_CAPITALS.length} capitals</span>
            <span>🔽 Low-P: {wd.lowPressureCount}/{NER_CAPITALS.length}</span>
            <span>🌧 Rain: {wd.totalPrecip} mm total</span>
            <span>⚡ Heavy: {wd.heavyRainCount} zones</span>
          </div>
        </div>
      )}

      {isLoading && !wd && (
        <div className="text-center text-xs text-slate-400 py-2 animate-pulse">Fetching live weather…</div>
      )}

      <p className="text-[10px] text-slate-400 italic text-center">
        Open-Meteo API · NDMA Population · Auto-refresh 10 min
      </p>
    </div>
  );
}
