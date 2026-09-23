export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);  
  const dLon = (lon2 - lon1) * (Math.PI / 180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// Simple pseudo-random seeded generator
const sfc32 = (a, b, c, d) => {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

// Generates a jagged polyline between two points to simulate a road
export const generateSimulatedRoute = (startLat, startLng, endLat, endLng) => {
  const points = [[startLat, startLng]];
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  
  // Create waypoints every ~5km
  const numSegments = Math.max(3, Math.floor(distance / 5));
  
  const rand = sfc32(Math.floor(startLat*100), Math.floor(endLng*100), Math.floor(startLng*100), Math.floor(endLat*100));

  for (let i = 1; i < numSegments; i++) {
    const fraction = i / numSegments;
    const directLat = startLat + (endLat - startLat) * fraction;
    const directLng = startLng + (endLng - startLng) * fraction;
    
    // Add "road curve" noise
    const maxDeviation = 0.045;
    const noiseLat = (rand() - 0.5) * maxDeviation;
    const noiseLng = (rand() - 0.5) * maxDeviation;
    
    points.push([directLat + noiseLat, directLng + noiseLng]);
  }
  
  points.push([endLat, endLng]);
  return {
    path: points,
    distanceKm: distance
  };
};

export const calculateHeading = (lat1, lon1, lat2, lon2) => {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
};

export const predictRouteRisk = (routePath, liveZones) => {
  if (!routePath || routePath.length === 0 || !liveZones || liveZones.length === 0) {
    return { riskScore: 30, conditions: "Normal", warnings: [] };
  }
  
  let maxRisk = 0;
  let maxRainfall = 0;
  let maxSoilMoisture = 0;
  let warnings = new Set();
  
  // Sample points along the route
  routePath.forEach(point => {
    const lat = point[0];
    const lng = point[1];
    
    // Find nearest zone to this point
    let nearestZone = null;
    let minDistance = Infinity;
    
    liveZones.forEach(zone => {
      const dist = calculateDistance(lat, lng, zone.lat, zone.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestZone = zone;
      }
    });
    
    if (nearestZone && minDistance < 50) { // Only consider if within 50km
      if (nearestZone.riskScore > maxRisk) maxRisk = nearestZone.riskScore;
      if (nearestZone.rainfall24h > maxRainfall) maxRainfall = nearestZone.rainfall24h;
      if (nearestZone.soilMoisture > maxSoilMoisture) maxSoilMoisture = nearestZone.soilMoisture;
      
      if (nearestZone.rainfall24h > 100) warnings.add("Heavy Rainfall Detected");
      if (nearestZone.soilMoisture > 80) warnings.add("High Soil Moisture / Mudslide Risk");
      if (nearestZone.seismicRisk > 50) warnings.add("Elevated Seismic Activity");
    }
  });
  
  // Baseline risk based on distance/terrain
  let finalRisk = Math.max(10, maxRisk);
  
  let conditionStr = "Clear";
  if (finalRisk > 75) conditionStr = "Critical Danger";
  else if (finalRisk > 50) conditionStr = "Hazardous";
  else if (finalRisk > 30) conditionStr = "Caution";

  return {
    riskScore: Math.round(finalRisk),
    conditions: conditionStr,
    warnings: Array.from(warnings),
    maxRainfall: Math.round(maxRainfall),
    maxSoilMoisture: Math.round(maxSoilMoisture)
  };
};
