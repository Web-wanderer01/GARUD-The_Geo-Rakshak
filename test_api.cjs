const https = require('https');

https.get('https://api.open-meteo.com/v1/forecast?latitude=25.18&longitude=93.02&current=precipitation,soil_moisture_0_to_7cm&timezone=auto', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
