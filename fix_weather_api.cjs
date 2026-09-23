const fs = require('fs');
let content = fs.readFileSync('src/components/operations/WeatherForecast.jsx', 'utf8');

const oldFetch = `      // Fetch all 4 cities in parallel
      const results = await Promise.all(
        NER_CITIES.map(city =>
          fetch(
            \`https://api.open-meteo.com/v1/forecast?latitude=\${city.lat}&longitude=\${city.lon}\` +
            \`&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,apparent_temperature\` +
            \`&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code\` +
            \`&timezone=auto&forecast_days=7\`
          ).then(r => r.json())
        )
      );
      const mapped = {};
      NER_CITIES.forEach((city, i) => { mapped[city.name] = results[i]; });`;

const newFetch = `      // Bulk fetch all cities in a single request for smooth performance and to prevent rate-limiting
      const lats = NER_CITIES.map(c => c.lat).join(',');
      const lons = NER_CITIES.map(c => c.lon).join(',');
      const res = await fetch(
        \`https://api.open-meteo.com/v1/forecast?latitude=\${lats}&longitude=\${lons}\` +
        \`&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,apparent_temperature\` +
        \`&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code\` +
        \`&timezone=auto&forecast_days=7\`
      );
      
      if (!res.ok) throw new Error("API Limit");
      
      const results = await res.json();
      const mapped = {};
      
      if (Array.isArray(results)) {
        NER_CITIES.forEach((city, i) => { mapped[city.name] = results[i]; });
      } else {
        NER_CITIES.forEach((city) => { mapped[city.name] = results; });
      }`;

content = content.replace(oldFetch, newFetch);

// Also fix the loading text
content = content.replace('Fetching live data for 4 NER cities', 'Fetching live data for all NER cities (Bulk API Sync)');

fs.writeFileSync('src/components/operations/WeatherForecast.jsx', content);
