// src/services/realtimeDataService.js
export const fetchLiveTelemetry = async (lat, lng) => {
  const startTime = performance.now();
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation,soil_moisture_0_to_7cm&timezone=auto`);
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    const endTime = performance.now();
    
    return {
      status: 'CONNECTED',
      precipitation: data.current?.precipitation || 0, // mm
      soilMoisture: (data.current?.soil_moisture_0_to_7cm || 0) * 100, // percentage
      latency: ((endTime - startTime) / 1000).toFixed(2) // seconds
    };
  } catch (error) {
    console.error("Failed to fetch live telemetry:", error);
    return {
      status: 'OFFLINE',
      precipitation: null,
      soilMoisture: null,
      latency: 0,
      error: error.message
    };
  }
};
