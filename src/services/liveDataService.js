// Service to fetch real-time data from external APIs
import { zones } from '../data/zones';

/**
 * Fetches real-time weather and soil moisture data for all zones concurrently
 * using the free Open-Meteo API. No API key required.
 */
export const fetchLiveTelemetry = async () => {
  try {
    // To prevent hitting URL length limits, we can batch the coordinates or just fetch them all.
    // Open-Meteo supports up to 100 locations per request.
    const lats = zones.map(z => z.lat).join(',');
    const lngs = zones.map(z => z.lng).join(',');
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,precipitation,rain,weather_code,wind_speed_10m&hourly=soil_moisture_0_to_7cm&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Check if data is an array (multiple locations return an array in Open-Meteo)
    const dataArray = Array.isArray(data) ? data : [data];

    const results = zones.map((zone, index) => {
      const locationData = dataArray[index];
      if (!locationData || !locationData.current) return null;

      const currentPrecip = locationData.current.precipitation || 0;
      
      const currentHourStr = locationData.current.time.substring(0, 14) + "00"; 
      const hourIndex = locationData.hourly.time.indexOf(currentHourStr) || 0;
      const rawSoilMoisture = locationData.hourly.soil_moisture_0_to_7cm[hourIndex !== -1 ? hourIndex : 0];
      const soilMoisturePercent = Math.min(100, Math.max(0, Math.round(rawSoilMoisture * 200)));
      
      return {
        id: zone.id,
        liveData: {
          precipitation24h: currentPrecip * 10,
          soilMoisture: soilMoisturePercent,
          temperature: locationData.current.temperature_2m,
          windSpeed: locationData.current.wind_speed_10m,
          timestamp: locationData.current.time
        }
      };
    }).filter(Boolean);

    return results;
  } catch (error) {
    console.error("Failed to fetch live telemetry:", error);
    return null;
  }
};

/**
 * Fetches real-time earthquake data from USGS (All Earthquakes in the past 7 days)
 * Filters for earthquakes that happened near the NER region.
 */
export const fetchLiveEarthquakes = async () => {
  try {
    // USGS API: all earthquakes in the last 7 days
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
    if (!response.ok) throw new Error('Failed to fetch earthquakes');
    const data = await response.json();
    
    // Filter for bounding box roughly covering North East India and surrounding regions
    // Lat: 21.0 to 29.0, Lng: 87.0 to 98.0
    const nerEarthquakes = data.features.filter(quake => {
      const [lng, lat] = quake.geometry.coordinates;
      return lat >= 21.0 && lat <= 30.0 && lng >= 87.0 && lng <= 98.0;
    });

    return nerEarthquakes.map(q => ({
      id: q.id,
      magnitude: q.properties.mag,
      place: q.properties.place,
      time: q.properties.time,
      lat: q.geometry.coordinates[1],
      lng: q.geometry.coordinates[0],
      depth: q.geometry.coordinates[2]
    }));
  } catch (error) {
    console.error("Failed to fetch live earthquakes:", error);
    return [];
  }
};
