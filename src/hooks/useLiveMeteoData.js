import { useState, useEffect } from 'react';

// Live Open-Meteo API URL (No Key Required, Free for open source/academic)
// We fetch current precipitation (rainfall) and soil moisture (0-7cm)
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export default function useLiveMeteoData(zones) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllZones() {
      try {
        setLoading(true);
        // We will batch the latitudes and longitudes to save network requests
        const lats = zones.map(z => z.lat).join(',');
        const lons = zones.map(z => z.lng).join(',');
        
        const url = `${BASE_URL}?latitude=${lats}&longitude=${lons}&current=precipitation,soil_moisture_0_to_7cm&timezone=Asia/Kolkata`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch from Open-Meteo');
        
        const data = await res.json();
        
        // Open-Meteo returns an array of objects if multiple lat/lons are provided
        // We will map this back to our zone IDs
        const liveZoneData = {};
        
        if (Array.isArray(data)) {
            data.forEach((locationData, idx) => {
                const zoneId = zones[idx].id;
                liveZoneData[zoneId] = {
                    liveRainfall: locationData.current.precipitation, // in mm
                    // convert volumetric soil moisture (m3/m3) to percentage
                    liveSoilMoisture: Math.round(locationData.current.soil_moisture_0_to_7cm * 100) 
                };
            });
        } else if (data.current) {
            // single zone fallback
            const zoneId = zones[0].id;
            liveZoneData[zoneId] = {
                liveRainfall: data.current.precipitation,
                liveSoilMoisture: Math.round(data.current.soil_moisture_0_to_7cm * 100) 
            };
        }

        if (isMounted) {
          setLiveData(liveZoneData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Live Meteo API Error:", err);
          setError(err.message);
          setLoading(false);
        }
      }
    }

    if (zones && zones.length > 0) {
      fetchAllZones();
    }
  }, [zones]);

  return { liveData, loading, error };
}
