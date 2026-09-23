import React, { useContext, useState, useEffect } from 'react';
import { Truck, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RISK_LEVELS, getRiskLevel, zones } from '../../data/zones';
import { roads, ROAD_STATUS_CONFIG } from '../../data/roads';
import { fleetData } from '../../data/logistics';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { acousticSensors, loraNodes, riverGauges, droneCorridors } from '../../data/strategicUpgrades';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ 
  iconRetinaUrl: markerIcon2x, 
  iconUrl: markerIcon, 
  shadowUrl: markerShadow 
});

// Custom truck icon
const truckIcon = new L.DivIcon({
  html: `<div class="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg></div>`,
  className: 'custom-truck-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const heliIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1068/1068130.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const droneIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1156/1156822.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 10, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function MapBoundsController({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [bounds, map]);
  return null;
}

function MapInteractionController({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    }
  });
  return null;
}

export default function RiskMap({ 
  reports = [], 
  activeLayers, 
  evacuationRoute, 
  focusCenter,
  userLocation,
  dispatchBase, setDispatchBase,
  impactZone, setImpactZone,
  routeResult,
  alternateRoutes,
  routeBounds 
}) {
  const [radarTime, setRadarTime] = useState(null);
  
  // Get live telemetry context instead of local state
  const { liveZones, earthquakes, liveFleet } = useContext(LiveDataContext);

  const handleMapClick = (latlng) => {
    // Basic logic: if no dispatch base, set it. Else if no impact zone, set it.
    if (!dispatchBase) {
      setDispatchBase({ lat: latlng.lat, lng: latlng.lng, name: "Selected Dispatch" });
    } else if (!impactZone) {
      setImpactZone({ lat: latlng.lat, lng: latlng.lng, name: "Selected Impact Zone" });
    }
  };

  useEffect(() => {
    // Function to fetch radar data
    const fetchRadar = () => {
      fetch("https://api.rainviewer.com/public/weather-maps.json")
        .then(res => res.json())
        .then(data => {
          if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
            setRadarTime(data.radar.past[data.radar.past.length - 1].time);
          }
        })
        .catch(err => console.log('Radar fetch error:', err));
    };

    // Initial fetch
    fetchRadar();

    // Refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchRadar();
    }, 10000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  // Always have data: prefer live, fallback to static import
  const mapZones = (liveZones && liveZones.length > 0) ? liveZones : zones;
  // Safely default activeLayers
  const layers = { satellite: false, riskZones: true, seismic: true, roads: false, camps: false, rainfall: false, trucks: true, ...activeLayers };

  // Check if there are any recent earthquakes in India
  const indiaQuakes = earthquakes && earthquakes.length > 0 ? earthquakes : [];

  const nerCenter = [26.2, 92.9];
  const defaultZoom = 7;

  // Relief camps data (integrated with live capacity simulation)
  const reliefCamps = [
    { name: "Guwahati Relief Hub Alpha", lat: 26.1445, lng: 91.7362, capacity: 2500, occupancy: 1840, supplies: "Adequate", state: "Assam", contact: "+91-361-2345678", facilities: ["Medical", "Food", "Shelter", "Water"] },
    { name: "Tezpur Emergency Camp", lat: 26.6528, lng: 92.7926, capacity: 1200, occupancy: 980, supplies: "Low", state: "Assam", contact: "+91-3712-234567", facilities: ["Food", "Shelter", "Water"] },
    { name: "Shillong Safe Zone", lat: 25.5788, lng: 91.8933, capacity: 1800, occupancy: 600, supplies: "Adequate", state: "Meghalaya", contact: "+91-364-2234567", facilities: ["Medical", "Food", "Shelter", "Water", "Communications"] },
    { name: "Silchar Flood Camp", lat: 24.8333, lng: 92.7789, capacity: 3000, occupancy: 2750, supplies: "Critical", state: "Assam", contact: "+91-3842-234567", facilities: ["Medical", "Food", "Shelter"] },
    { name: "Kohima NDRF Base", lat: 25.6700, lng: 94.1100, capacity: 800, occupancy: 320, supplies: "Adequate", state: "Nagaland", contact: "+91-370-2234567", facilities: ["Medical", "Food", "Shelter", "Comms"] },
    { name: "Imphal Central Camp", lat: 24.8170, lng: 93.9368, capacity: 2000, occupancy: 1500, supplies: "Low", state: "Manipur", contact: "+91-385-2450077", facilities: ["Medical", "Food", "Shelter", "Water"] },
    { name: "Gangtok Safe Shelter", lat: 27.3389, lng: 88.6065, capacity: 900, occupancy: 720, supplies: "Adequate", state: "Sikkim", contact: "+91-3592-202256", facilities: ["Medical", "Food", "Shelter"] },
    { name: "Itanagar Relief Point", lat: 27.0844, lng: 93.6053, capacity: 1100, occupancy: 430, supplies: "Adequate", state: "Arunachal Pradesh", contact: "+91-360-2291213", facilities: ["Food", "Shelter", "Water"] },
    { name: "Aizawl Cyclone Shelter", lat: 23.7271, lng: 92.7176, capacity: 600, occupancy: 210, supplies: "Adequate", state: "Mizoram", contact: "+91-389-2322477", facilities: ["Food", "Shelter", "Water"] },
    { name: "Agartala Emergency Base", lat: 23.8315, lng: 91.2868, capacity: 1500, occupancy: 890, supplies: "Low", state: "Tripura", contact: "+91-381-2325759", facilities: ["Medical", "Food", "Shelter"] },
  ];


  const generateRoadCoordinates = (road) => {
    const mockCoordinates = {
      'Shillong': [25.5788, 91.8933],
      'Cherrapunji': [25.2702, 91.7323],
      'Haflong': [25.1685, 93.0200],
      'Silchar': [24.8333, 92.7789],
      'Tezpur': [26.6528, 92.7926],
      'Tawang': [27.5860, 91.8690],
      'Kohima': [25.6700, 94.1100],
      'Imphal': [24.8170, 93.9368],
      'Gangtok': [27.3389, 88.6065],
      'Nathula Pass': [27.3866, 88.8306],
      'Itanagar': [27.0844, 93.6053],
      'Banderdewa': [27.0988, 93.8277],
      'Aizawl': [23.7271, 92.7176],
      'Lunglei': [22.8800, 92.7500],
      'Agartala': [23.8315, 91.2868],
      'Sabroom': [23.0000, 91.7300],
      'Guwahati': [26.1445, 91.7362],
      'Mangan': [27.5025, 88.5283],
      'Chungthang': [27.6046, 88.6475],
      'Tupul': [24.8468, 93.6263],
      'Dimapur': [25.9063, 93.7289]
    };

    const fromCoord = mockCoordinates[road.from] || [26, 92];
    const toCoord = mockCoordinates[road.to] || [26.5, 92.5];
    
    // Add a slight bend
    const midCoord = [
      (fromCoord[0] + toCoord[0]) / 2 + 0.1,
      (fromCoord[1] + toCoord[1]) / 2 - 0.1
    ];

    return [fromCoord, midCoord, toCoord];
  };

  const isOnline = useOnlineStatus();

  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden border border-slate-200 shadow-lg relative z-0 bg-slate-100 radar-grid">
      {!isOnline && (
        <div className="absolute top-4 right-4 z-[400] bg-gov-900/90 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/50 text-sm font-mono flex items-center gap-2 backdrop-blur-sm shadow-xl animate-pulse">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          OFFLINE CACHE MODE
        </div>
      )}
      {indiaQuakes.length > 0 && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[400] bg-red-900/90 text-white px-6 py-3 rounded-lg border-2 border-red-500 shadow-2xl animate-pulse flex flex-col items-center">
          <div className="font-bold text-lg">EARTHQUAKE DETECTED IN INDIA</div>
          <div className="text-sm text-red-200">{indiaQuakes.length} recent seismic event(s) recorded by USGS</div>
        </div>
      )}
      <MapContainer center={nerCenter} zoom={defaultZoom} className="w-full h-full bg-transparent" scrollWheelZoom={true}>
        <MapController center={focusCenter} />
        <MapBoundsController bounds={routeBounds} />
        <MapInteractionController onMapClick={handleMapClick} />
        {isOnline && (
          <TileLayer
            attribution={layers.satellite ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            url={layers.satellite ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            className={layers.satellite ? "" : "map-tiles-blend"}
          />
        )}

        {/* Live Weather Radar (RainViewer) */}
        {layers.radar && radarTime && (
          <TileLayer
            url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.6}
            zIndex={100}
          />
        )}

        {/* Rain Fall Overlay */}
        {layers.rainfall && mapZones.map(zone => {
          if (zone.rainfall24h > 30) {
            const intensity = zone.rainfall24h > 100 ? '#1e3a8a' : zone.rainfall24h > 60 ? '#2563eb' : '#60a5fa';
            return (
              <React.Fragment key={`rain-${zone.id}`}>
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  pathOptions={{ color: intensity, fillColor: intensity, fillOpacity: 0.4, stroke: false }}
                  radius={zone.rainfall24h / 2}
                />
                <CircleMarker
                  center={[zone.lat, zone.lng]}
                  pathOptions={{ color: intensity, fillColor: intensity, fillOpacity: 0.2, stroke: false }}
                  radius={zone.rainfall24h}
                />
              </React.Fragment>
            );
          }
          return null;
        })}

        {/* Western Disturbance Wind Corridor Layer */}
        {layers.westernDisturbance && (() => {
          // Real WD tracks enter NER from the northwest (Himachal/J&K) through Nepal foothills
          // Coordinates based on IMD-published WD trajectory corridors
          const wdTrack = [
            [32.5, 76.5],   // J&K origin
            [31.2, 78.8],   // Himachal Pradesh
            [29.8, 80.5],   // Uttarakhand
            [28.2, 83.0],   // Nepal midpoint
            [27.7, 86.0],   // Nepal eastern
            [27.3, 88.6],   // Sikkim entry
            [27.1, 91.7],   // Arunachal western
            [26.1, 92.9],   // Assam core
            [25.6, 94.1],   // Nagaland
          ];
          // Secondary track through Bangladesh
          const wdTrack2 = [
            [27.3, 88.6],
            [26.5, 90.0],
            [26.0, 91.5],
            [25.2, 91.9],
            [24.8, 92.8],
          ];
          // WD high-pressure ridge indicators (large semi-transparent blobs over affected areas)
          const wdZones = [
            { lat: 27.1, lng: 91.7, r: 60, label: 'Active WD Core' },
            { lat: 26.1, lng: 92.9, r: 50, label: 'WD Rainfall Band' },
            { lat: 25.6, lng: 91.9, r: 45, label: 'Orographic Lift Zone' },
          ];
          return (
            <React.Fragment key="wd-layer">
              {/* Main jet-stream track */}
              <Polyline
                positions={wdTrack}
                pathOptions={{ color: '#818cf8', weight: 3, dashArray: '10 6', opacity: 0.85 }}
              />
              {/* Secondary track */}
              <Polyline
                positions={wdTrack2}
                pathOptions={{ color: '#a78bfa', weight: 2, dashArray: '6 8', opacity: 0.7 }}
              />
              {/* WD influence zones */}
              {wdZones.map((wz, i) => (
                <React.Fragment key={`wdz-${i}`}>
                  <CircleMarker
                    center={[wz.lat, wz.lng]}
                    pathOptions={{ color: '#6366f1', fillColor: '#818cf8', fillOpacity: 0.18, weight: 1.5, dashArray: '4 3' }}
                    radius={wz.r}
                  >
                    <Popup>
                      <div className="p-1">
                        <p className="font-bold text-indigo-700 text-sm">{wz.label}</p>
                        <p className="text-xs text-slate-500">Western Disturbance influence zone</p>
                        <p className="text-xs text-slate-400 mt-1">Track: NW India → NER via Himalayan foothills</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })()}

        {/* Risk Zones */}
        {layers.riskZones && mapZones.map(zone => {
          const riskLevel = getRiskLevel(zone.riskScore);
          const color = RISK_LEVELS[riskLevel].color;
          const roadConfig = ROAD_STATUS_CONFIG[zone.roadStatus] || ROAD_STATUS_CONFIG['Open'];

          return (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 2 }}
              radius={8 + zone.riskScore / 15}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-lg text-slate-800">{zone.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{zone.district}, {zone.state}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Risk Score:</span>
                    <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: color }}>
                      {zone.riskScore}/100
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span>Rainfall (24h/7d):</span>
                      <span className="font-medium">{zone.rainfall24h}mm / {zone.rainfall7d}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil Moisture:</span>
                      <span className="font-medium">{zone.soilMoisture}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slope Angle:</span>
                      <span className="font-medium">{zone.slopeAngle}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Landslide:</span>
                      <span className="font-medium">{zone.lastLandslideDate}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Road Status:</p>
                    <div className={`text-xs px-2 py-1 rounded ${roadConfig.bgClass} inline-flex items-center gap-1`}>
                      <span>{roadConfig.icon}</span>
                      <span>{zone.roadStatus}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {/* Evacuation Routes */}
        {layers.evacuation && (() => {
          // Mock evacuation routes leading away from high-risk zones
          const evacRoutes = [
            { name: "Guwahati Safe Corridor", positions: [[26.1445, 91.7362], [26.05, 91.5], [25.9, 91.2]], type: "Primary" },
            { name: "Shillong Emergency Exit", positions: [[25.5788, 91.8933], [25.7, 91.85], [25.9, 91.8]], type: "Primary" },
            { name: "Silchar Evac Route", positions: [[24.8333, 92.7789], [24.6, 92.5], [24.4, 92.4]], type: "Secondary" },
            { name: "Itanagar Downhill Path", positions: [[27.0844, 93.6053], [26.9, 93.7], [26.8, 93.8]], type: "Primary" },
            { name: "Imphal Valley Route", positions: [[24.8170, 93.9368], [24.7, 93.9], [24.5, 93.8]], type: "Secondary" }
          ];

          return evacRoutes.map((evac, idx) => (
            <Polyline
              key={`evac-${idx}`}
              positions={evac.positions}
              pathOptions={{ color: '#10b981', weight: 4, opacity: 0.9, dashArray: '8, 6' }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm text-emerald-800">{evac.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">Type: {evac.type} Evacuation Route</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">CLEAR & OPEN</p>
                </div>
              </Popup>
            </Polyline>
          ));
        })()}

        {/* Roads Network */}
        {layers.roads && roads.map(road => {
          const config = ROAD_STATUS_CONFIG[road.status] || ROAD_STATUS_CONFIG['Open'];
          const positions = generateRoadCoordinates(road);
          
          return (
            <Polyline
              key={road.id}
              positions={positions}
              pathOptions={{ color: config.color, weight: road.status === 'Open' ? 3 : 5, opacity: 0.8, dashArray: road.status !== 'Open' ? '5, 5' : null }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm text-slate-800">{road.name}</h3>
                  <p className="text-xs text-slate-600">{road.from} to {road.to}</p>
                  <p className={`mt-2 text-xs font-semibold px-2 py-1 rounded inline-block ${config.bgClass}`}>
                    {config.icon} {road.status}
                  </p>
                </div>
              </Popup>
            </Polyline>
          )
        })}

        {/* Relief Camps */}
        {layers.camps && reliefCamps.map((camp, idx) => {
          const pct = Math.round((camp.occupancy / camp.capacity) * 100);
          const suppliesColor = camp.supplies === 'Critical' ? '#ef4444' : camp.supplies === 'Low' ? '#f59e0b' : '#10b981';
          const campIcon = new L.DivIcon({
            html: `<div style="background:${camp.supplies === 'Critical' ? '#ef4444' : camp.supplies === 'Low' ? '#f59e0b' : '#059669'};width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:11px;color:white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">⛺</div>`,
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -12]
          });
          return (
            <Marker key={`camp-${idx}`} position={[camp.lat, camp.lng]} icon={campIcon}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm text-emerald-800 mb-1">⛺ {camp.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{camp.state}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Occupancy</span>
                      <span className="font-bold text-slate-800">{camp.occupancy} / {camp.capacity} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs text-slate-600">Supplies:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: suppliesColor }}>{camp.supplies}</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-1">
                    <span className="font-semibold">Facilities:</span> {camp.facilities.join(' · ')}
                  </div>
                  <div className="text-xs text-blue-700 font-mono mt-1">📞 {camp.contact}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* USGS Earthquake Feed (Magnitude ≥ 4.0) */}
        {layers.seismic && earthquakes && earthquakes.map((quake) => {
          const isHighMag = quake.magnitude >= 4.0;
          return (
            <CircleMarker
              key={quake.id}
              center={[quake.lat, quake.lng]}
              pathOptions={{
                color: isHighMag ? '#ef4444' : '#f97316',
                fillColor: isHighMag ? '#ef4444' : '#f97316',
                fillOpacity: 0.5,
                weight: 1
              }}
              radius={Math.max(4, quake.magnitude * 3)}
              className={isHighMag ? 'animate-pulse' : ''}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🌋</span>
                    <h3 className="font-bold text-sm text-slate-800">Seismic Event</h3>
                  </div>
                  <p className="text-xs font-semibold text-red-600">Magnitude: {quake.magnitude.toFixed(1)}</p>
                  <p className="text-xs text-slate-600 mt-1">{quake.place}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(quake.time).toLocaleString('en-IN')}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        
                {/* Community Reports */}
        {reports && reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.lat, report.lng]}
            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 2 }}
            radius={6}
          >
            <Popup>
              <div className="p-1">
                <span className="text-xs font-bold uppercase text-blue-600">{report.category}</span>
                <p className="text-sm mt-1">{report.description}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Supply Trucks (Logistics) */}
        {layers.trucks && liveFleet && liveFleet.map(truck => (
          <React.Fragment key={truck.id}>
            <Marker 
              position={[truck.lat, truck.lng]}
              icon={truck.id.startsWith('HELI') || truck.transportMode === 'helicopter' ? heliIcon : 
                    truck.id.startsWith('DRN') || truck.transportMode === 'drone' ? droneIcon : truckIcon}
            >
              <Popup>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  {truck.id}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {truck.status}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-1 font-bold">{truck.cargo}</div>
                <div className="text-xs space-y-1">
                  <div><span className="font-semibold text-slate-500">Route:</span> {truck.origin} → {truck.destination}</div>
                  <div><span className="font-semibold text-slate-500">Speed:</span> {Math.round(truck.speed)} km/h</div>
                  <div><span className="font-semibold text-slate-500">ETA:</span> {truck.eta}</div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Safe Evacuation Corridors Overlay */}
        {layers.evacuation && (
          <React.Fragment>
            <Polyline positions={[[26.1445, 91.7362], [26.63, 92.83]]} color="#10b981" weight={5} dashArray="8, 8" opacity={0.8} />
            <Polyline positions={[[25.5788, 91.8933], [26.14, 91.75]]} color="#10b981" weight={5} dashArray="8, 8" opacity={0.8} />
            <Polyline positions={[[24.8170, 93.9368], [25.9063, 93.7289]]} color="#10b981" weight={5} dashArray="8, 8" opacity={0.8} />
          </React.Fragment>
        )}

        {evacuationRoute && (
          <React.Fragment>
            <Polyline positions={evacuationRoute.path} color="#8b5cf6" weight={6} dashArray="10, 10" zIndex={1000} />
            <Marker position={evacuationRoute.path[0]} icon={L.Icon.Default.prototype}>
              <Popup><div className="font-bold">Your Location</div></Popup>
            </Marker>
            <Marker position={evacuationRoute.path[evacuationRoute.path.length - 1]} icon={L.Icon.Default.prototype}>
              <Popup><div className="font-bold text-green-700">Safe Zone: {evacuationRoute.campName}</div></Popup>
            </Marker>
          </React.Fragment>
        )}

        {/* User GPS Location Marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={new L.DivIcon({
              html: `<div class="relative flex items-center justify-center w-6 h-6">
                      <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-50 animate-ping"></div>
                      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
                     </div>`,
              className: '', iconSize: [24,24], iconAnchor: [12,12], popupAnchor: [0,-12]
            })}
            zIndexOffset={2000}
          >
            <Popup><div className="font-bold text-blue-700">Your Location (Satellite)</div></Popup>
          </Marker>
        )}

        {/* Interactive Routing Locations */}
        {dispatchBase && (
          <Marker
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                setDispatchBase({ ...dispatchBase, lat: pos.lat, lng: pos.lng });
              }
            }}
            position={[dispatchBase.lat, dispatchBase.lng]}
            icon={L.Icon.Default.prototype}
          >
            <Popup><div className="font-bold text-emerald-800">Dispatch Base (Start)</div></Popup>
          </Marker>
        )}
        
        {impactZone && (
          <Marker
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                setImpactZone({ ...impactZone, lat: pos.lat, lng: pos.lng });
              }
            }}
            position={[impactZone.lat, impactZone.lng]}
            icon={L.Icon.Default.prototype}
          >
            <Popup><div className="font-bold text-red-800">Impact Zone (End)</div></Popup>
          </Marker>
        )}

        {alternateRoutes && alternateRoutes.map((alt, idx) => (
          <Polyline 
            key={`alt-route-${idx}`}
            positions={alt.path} 
            pathOptions={{ color: alt.risk > 70 ? '#ef4444' : alt.risk > 40 ? '#f59e0b' : '#94a3b8', weight: 4, opacity: 0.8, dashArray: '8, 8' }} 
          >
            <Popup>
              <div className="font-bold text-slate-800">Alternate Route {idx + 1}</div>
              <div className="text-xs text-slate-600">Distance: {alt.distanceKm.toFixed(1)} km</div>
              <div className="text-xs text-slate-600">Travel Time: ~{Math.ceil(alt.distanceKm / 40)} hrs</div>
              <div className="text-xs font-bold mt-1" style={{color: alt.risk > 70 ? '#ef4444' : alt.risk > 40 ? '#f59e0b' : '#10b981'}}>
                Risk Score: {alt.risk}/100
              </div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Cond: {alt.conditions}</div>
            </Popup>
          </Polyline>
        ))}

        {routeResult && (
          <Polyline 
            positions={routeResult.path} 
            pathOptions={{ color: routeResult.risk > 70 ? '#ef4444' : '#3b82f6', weight: 6, opacity: 0.8 }} 
          >
            <Popup>
              <div className="font-bold text-slate-800">Primary Route</div>
              <div className="text-xs text-slate-600">Distance: {routeResult.distanceKm.toFixed(1)} km</div>
              <div className="text-xs text-slate-600">Travel Time: ~{Math.ceil(routeResult.distanceKm / 40)} hrs</div>
              <div className="text-xs font-bold mt-1" style={{color: routeResult.risk > 70 ? '#ef4444' : '#f59e0b'}}>
                Risk Score: {routeResult.risk}/100
              </div>
            </Popup>
          </Polyline>
        )}

        {/* ── Acoustic Landslide Sensors ── */}
        {layers.acousticSensors && acousticSensors.map(s => {
          const sensorIcon = new L.DivIcon({
            html: `<div style="width:18px;height:18px;border-radius:50%;background:${s.status === 'CRITICAL' ? '#ef4444' : s.status === 'ALERT' ? '#f59e0b' : '#3b82f6'};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;color:white;box-shadow:0 0 8px ${s.status === 'CRITICAL' ? 'rgba(239,68,68,0.7)' : 'rgba(59,130,246,0.5)'}">🔊</div>`,
            className: '', iconSize: [18,18], iconAnchor: [9,9], popupAnchor: [0,-10]
          });
          return (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={sensorIcon}>
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <div className={`text-xs font-black mb-1 ${s.status === 'CRITICAL' ? 'text-red-600' : s.status === 'ALERT' ? 'text-amber-600' : 'text-blue-600'}`}>{s.status === 'CRITICAL' ? '⚠ LANDSLIDE WARNING' : `🔊 ${s.id}`}</div>
                  <div className="font-bold text-sm text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{s.highway} · {s.riskZone}</div>
                  <div className="text-xs mb-1"><span className="font-semibold text-slate-600">Vibration:</span> <span className="font-bold">{Math.round(s.vibration)}/100</span></div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                    <div className="h-2 rounded-full" style={{width:`${s.vibration}%`, background: s.vibration>80?'#ef4444':s.vibration>60?'#f59e0b':'#3b82f6'}} />
                  </div>
                  <div className="text-xs text-slate-500">Frequency: {s.frequency} Hz · Last event: {s.lastEvent}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── LoRaWAN Mesh Nodes ── */}
        {layers.loraNodes && loraNodes.map(node => {
          const nodeIcon = new L.DivIcon({
            html: `<div style="width:16px;height:16px;border-radius:3px;background:${node.status==='ACTIVE'?'#06b6d4':'#f59e0b'};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;color:white;box-shadow:0 0 6px rgba(6,182,212,0.4)">📡</div>`,
            className: '', iconSize: [16,16], iconAnchor: [8,8], popupAnchor: [0,-10]
          });
          return (
            <Marker key={node.id} position={[node.lat, node.lng]} icon={nodeIcon}>
              <Popup>
                <div className="p-1 min-w-[170px]">
                  <div className="font-bold text-sm text-cyan-700 mb-1">📡 {node.id} — {node.type}</div>
                  <div className="text-xs font-semibold text-slate-700">{node.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{node.state}</div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Battery:</span>
                    <span className={`font-bold ${node.batteryPct < 20 ? 'text-red-600' : node.batteryPct < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>{node.batteryPct}%</span>
                  </div>
                  <div className="text-xs text-slate-500">Last ping: {node.lastPing} · Range: {node.coverageKm}km</div>
                  <div className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full inline-block ${node.status==='ACTIVE'?'bg-emerald-100 text-emerald-700':'bg-orange-100 text-orange-700'}`}>{node.status}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Smart River Gauges ── */}
        {layers.riverGauges && riverGauges.map(g => {
          const pct = (g.level / g.threshold) * 100;
          const isAlert = pct > 85;
          const gaugeIcon = new L.DivIcon({
            html: `<div style="width:18px;height:18px;border-radius:50%;background:${isAlert?'#ef4444':'#3b82f6'};border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;color:white;box-shadow:0 0 8px ${isAlert?'rgba(239,68,68,0.6)':'rgba(59,130,246,0.4)'}${isAlert?';animation:pulse 1s infinite':''}">🌊</div>`,
            className: '', iconSize: [18,18], iconAnchor: [9,9], popupAnchor: [0,-10]
          });
          return (
            <Marker key={g.id} position={[g.lat, g.lng]} icon={gaugeIcon}>
              <Popup>
                <div className="p-1 min-w-[180px]">
                  {isAlert && <div className="text-xs font-black text-red-600 mb-1">⚠ FLOOD ALERT</div>}
                  <div className="font-bold text-sm text-blue-700">{g.id}: {g.river}</div>
                  <div className="text-xs text-slate-500 mb-2">{g.name}</div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Level:</span>
                    <span className="font-bold text-slate-800">{g.level.toFixed(1)}m / {g.threshold}m</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                    <div className="h-2 rounded-full" style={{width:`${Math.min(100,pct)}%`,background:pct>85?'#ef4444':pct>70?'#f59e0b':'#3b82f6'}} />
                  </div>
                  <div className="text-xs text-slate-500">Trend: {g.trend} · Rate: {g.riseRate>0?'+':''}{g.riseRate.toFixed(2)} m/hr</div>
                  <div className="text-xs font-bold mt-1">GLOF Risk: <span className={g.glofRisk==='HIGH'?'text-red-600':g.glofRisk==='MODERATE'?'text-amber-600':'text-emerald-600'}>{g.glofRisk}</span></div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Drone Corridors ── */}
        {layers.droneCorridors && droneCorridors.map(dc => (
          <React.Fragment key={dc.id}>
            <Polyline
              positions={dc.path}
              pathOptions={{ color: dc.color, weight: dc.status==='ACTIVE'?4:2, opacity: dc.status==='ACTIVE'?0.9:0.4, dashArray: dc.status==='ACTIVE'?null:'8 4' }}
            >
              <Popup>
                <div className="p-1 min-w-[190px]">
                  <div className="font-bold text-sm text-slate-800 mb-1">{dc.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{dc.from} → {dc.to}</div>
                  <div className="grid grid-cols-3 gap-1 text-center text-xs mb-2">
                    <div className="bg-slate-100 rounded p-1"><div className="font-bold">{dc.drones}</div><div className="text-slate-400">Drones</div></div>
                    <div className="bg-slate-100 rounded p-1"><div className="font-bold">{dc.rangeKm}km</div><div className="text-slate-400">Range</div></div>
                    <div className="bg-slate-100 rounded p-1"><div className="font-bold">{dc.etaMin}m</div><div className="text-slate-400">ETA</div></div>
                  </div>
                  <div className="text-xs text-slate-600">📦 {dc.payload}</div>
                  <div className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full inline-block ${dc.status==='ACTIVE'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{dc.status}</div>
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        ))}

      </MapContainer>

    </div>
  );
}
