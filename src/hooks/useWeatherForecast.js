import { useState, useEffect } from 'react';

// Open-Meteo API for 7-day forecast and AQI
export default function useWeatherForecast(lat, lng) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchForecast() {
      try {
        setLoading(true);
        // Fetch weather forecast
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata`;
        // Fetch AQI (Air Quality)
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi&timezone=Asia/Kolkata`;
        
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(weatherUrl),
          fetch(aqiUrl)
        ]);
        
        if (!weatherRes.ok || !aqiRes.ok) throw new Error('Failed to fetch from Open-Meteo');
        
        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();
        
        if (isMounted) {
          setData({
            forecast: weatherData.daily,
            currentAqi: aqiData.current.us_aqi
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    if (lat && lng) {
      fetchForecast();
    }
  }, [lat, lng]);

  return { data, loading, error };
}
