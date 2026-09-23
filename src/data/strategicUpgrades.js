// Strategic Upgrades Data — GARUD NER Disaster Resilience
// All coordinates are real NER locations

// ── Acoustic Landslide Sensors ──────────────────────────────────
export const acousticSensors = [
  { id: 'AS-01', name: 'NH-10 Km 42 (Rangpo)', lat: 27.1740, lng: 88.5288, highway: 'NH-10', status: 'ALERT', vibration: 87, frequency: 14.2, threshold: 75, lastEvent: '2 min ago', riskZone: 'Sikkim' },
  { id: 'AS-02', name: 'NH-10 Km 58 (Singtam)', lat: 27.2404, lng: 88.5006, highway: 'NH-10', status: 'MONITORING', vibration: 43, frequency: 8.1, threshold: 75, lastEvent: '18 min ago', riskZone: 'Sikkim' },
  { id: 'AS-03', name: 'NH-10 Km 78 (Mangan)', lat: 27.5025, lng: 88.5283, highway: 'NH-10', status: 'MONITORING', vibration: 61, frequency: 11.4, threshold: 75, lastEvent: '5 min ago', riskZone: 'Sikkim' },
  { id: 'AS-04', name: 'NH-10 Km 98 (Chungthang)', lat: 27.6046, lng: 88.6475, highway: 'NH-10', status: 'CRITICAL', vibration: 94, frequency: 18.7, threshold: 75, lastEvent: '30 sec ago', riskZone: 'Sikkim' },
  { id: 'AS-05', name: 'NH-06 Dima Hasao', lat: 25.1685, lng: 93.0200, highway: 'NH-06', status: 'ALERT', vibration: 79, frequency: 13.8, threshold: 75, lastEvent: '8 min ago', riskZone: 'Assam' },
  { id: 'AS-06', name: 'Tawang Road Km 14', lat: 27.4500, lng: 91.9500, highway: 'Tawang Access', status: 'MONITORING', vibration: 28, frequency: 4.2, threshold: 75, lastEvent: '1 hr ago', riskZone: 'Arunachal Pradesh' },
  { id: 'AS-07', name: 'Cherrapunji Cliff Sensor', lat: 25.2702, lng: 91.7323, highway: 'Cherrapunji Road', status: 'ALERT', vibration: 82, frequency: 15.1, threshold: 75, lastEvent: '4 min ago', riskZone: 'Meghalaya' },
  { id: 'AS-08', name: 'Tupul Rail-Link', lat: 24.8468, lng: 93.6263, highway: 'Railway Zone', status: 'CRITICAL', vibration: 96, frequency: 21.3, threshold: 75, lastEvent: '< 1 min ago', riskZone: 'Manipur' },
];

// ── LoRaWAN Mesh Network Nodes ──────────────────────────────────
export const loraNodes = [
  { id: 'LR-01', name: 'Kurung Kumey Relay Node', lat: 27.7800, lng: 93.5200, state: 'Arunachal Pradesh', status: 'ACTIVE', batteryPct: 82, lastPing: '12s', coverageKm: 15, type: 'Gateway' },
  { id: 'LR-02', name: 'Upper Subansiri Village Node', lat: 28.1000, lng: 94.2000, state: 'Arunachal Pradesh', status: 'ACTIVE', batteryPct: 67, lastPing: '28s', coverageKm: 12, type: 'End Node' },
  { id: 'LR-03', name: 'Dima Hasao Mesh Hub', lat: 25.3000, lng: 92.9500, state: 'Assam', status: 'ACTIVE', batteryPct: 91, lastPing: '8s', coverageKm: 18, type: 'Gateway' },
  { id: 'LR-04', name: 'West Khasi Hills Node', lat: 25.4200, lng: 91.0000, state: 'Meghalaya', status: 'ACTIVE', batteryPct: 55, lastPing: '45s', coverageKm: 10, type: 'End Node' },
  { id: 'LR-05', name: 'Longwa Village (Konyak)', lat: 26.5200, lng: 95.2000, state: 'Nagaland', status: 'LOW_BATTERY', batteryPct: 12, lastPing: '3m', coverageKm: 8, type: 'End Node' },
  { id: 'LR-06', name: 'Pherzawl Remote Hub', lat: 24.3200, lng: 93.4500, state: 'Manipur', status: 'ACTIVE', batteryPct: 78, lastPing: '15s', coverageKm: 14, type: 'Gateway' },
  { id: 'LR-07', name: 'Champhai Border Node', lat: 23.4700, lng: 93.3300, state: 'Mizoram', status: 'ACTIVE', batteryPct: 88, lastPing: '5s', coverageKm: 16, type: 'End Node' },
  { id: 'LR-08', name: 'North Sikkim Node Alpha', lat: 27.9500, lng: 88.4200, state: 'Sikkim', status: 'ACTIVE', batteryPct: 73, lastPing: '22s', coverageKm: 11, type: 'Gateway' },
];

// ── Smart River Gauges (GLOF Detection) ────────────────────────
export const riverGauges = [
  { id: 'RG-01', name: 'Teesta Upstream (Chungthang)', lat: 27.6500, lng: 88.6200, river: 'Teesta', level: 4.8, threshold: 5.5, trend: 'RISING', riseRate: 0.12, alert: true, glofRisk: 'HIGH' },
  { id: 'RG-02', name: 'Brahmaputra at Pasighat', lat: 28.0646, lng: 95.3253, river: 'Brahmaputra', level: 7.2, threshold: 9.0, trend: 'STABLE', riseRate: 0.02, alert: false, glofRisk: 'MODERATE' },
  { id: 'RG-03', name: 'Barak at Jiribam', lat: 24.8016, lng: 93.1222, river: 'Barak', level: 3.1, threshold: 4.0, trend: 'RISING', riseRate: 0.08, alert: false, glofRisk: 'LOW' },
  { id: 'RG-04', name: 'Lohit at Wakro', lat: 27.8000, lng: 96.5000, river: 'Lohit', level: 5.5, threshold: 6.0, trend: 'RISING', riseRate: 0.15, alert: true, glofRisk: 'HIGH' },
  { id: 'RG-05', name: 'Kopili at Hamren', lat: 25.9700, lng: 92.7900, river: 'Kopili', level: 2.3, threshold: 4.5, trend: 'FALLING', riseRate: -0.03, alert: false, glofRisk: 'LOW' },
  { id: 'RG-06', name: 'Dikrong at Bandardewa', lat: 27.0988, lng: 93.8277, river: 'Dikrong', level: 3.8, threshold: 4.2, trend: 'RISING', riseRate: 0.10, alert: true, glofRisk: 'MODERATE' },
];

// ── Autonomous Drone Corridors ──────────────────────────────────
export const droneCorridors = [
  {
    id: 'DC-01', name: 'Guwahati → Tawang Medical Express',
    from: 'Guwahati NDRF Base', to: 'Tawang District Hospital',
    path: [[26.1445,91.7362],[26.5,91.9],[27.0844,91.8],[27.3,91.82],[27.5860,91.8690]],
    status: 'ACTIVE', drones: 3, payload: 'Medical Supplies', rangeKm: 180, etaMin: 95,
    color: '#22c55e'
  },
  {
    id: 'DC-02', name: 'Silchar → Jiribam Blood Bank Run',
    from: 'Silchar Air Base', to: 'Jiribam Relief Camp',
    path: [[24.8333,92.7789],[24.7500,93.0],[24.8016,93.1222]],
    status: 'ACTIVE', drones: 2, payload: 'Blood & Anti-venom', rangeKm: 65, etaMin: 38,
    color: '#ef4444'
  },
  {
    id: 'DC-03', name: 'Imphal → Churachandpur Aid Drop',
    from: 'Imphal IAF Station', to: 'Churachandpur Flood Zone',
    path: [[24.8170,93.9368],[24.4500,93.8000],[24.3366,93.6720]],
    status: 'STANDBY', drones: 5, payload: 'Food & Water', rangeKm: 70, etaMin: 42,
    color: '#f59e0b'
  },
  {
    id: 'DC-04', name: 'Dimapur → Khonsa Emergency',
    from: 'Dimapur Helipad', to: 'Khonsa Landslide Zone',
    path: [[25.9063,93.7289],[26.2000,94.5000],[27.0000,95.5167]],
    status: 'STANDBY', drones: 4, payload: 'Rescue Kit', rangeKm: 220, etaMin: 130,
    color: '#f59e0b'
  },
];

// ── Tethered UAV Surveillance Points ───────────────────────────
export const uavPoints = [
  { id: 'UAV-01', name: 'Siliguri Corridor Watch', lat: 26.7271, lng: 88.4305, altitude: 120, coverageKm: 8, status: 'AIRBORNE', type: 'Tethered UAV' },
  { id: 'UAV-02', name: 'Dima Hasao Blackout Relay', lat: 25.2000, lng: 92.8600, altitude: 80, coverageKm: 6, status: 'AIRBORNE', type: 'Cellular Relay Drone' },
  { id: 'UAV-03', name: 'Tawang Pass Eye', lat: 27.5000, lng: 91.8500, altitude: 200, coverageKm: 10, status: 'STANDBY', type: 'LiDAR Scout' },
  { id: 'UAV-04', name: 'Manas Flood Watch', lat: 26.7200, lng: 90.8700, altitude: 100, coverageKm: 7, status: 'AIRBORNE', type: 'Tethered UAV' },
];
