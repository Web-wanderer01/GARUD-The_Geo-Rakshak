/**
 * MOCK DATA: 7-day weather forecast and risk predictions.
 *
 * INTEGRATION POINT: In production, forecast data would come from:
 *   - IMD (India Meteorological Department) API for weather forecasts
 *   - ECMWF/GFS model outputs for extended forecasts
 *   - ML model predictions combining weather forecasts with terrain data
 *   - Real-time satellite rainfall estimates (GPM, INSAT-3D)
 */

const DAY_LABELS = ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

/**
 * Generate a 7-day mock forecast for a given zone.
 * Uses the zone's current data as a baseline and adds realistic variation.
 *
 * INTEGRATION POINT: Replace with actual IMD API + ML prediction calls.
 */
export function generateForecast(zone) {
  if (!zone) return [];

  const baseRainfall = zone.rainfall24h;
  const baseRisk = zone.riskScore;

  // Seed a deterministic but varied pattern from the zone ID
  const seed = zone.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return DAY_LABELS.map((label, i) => {
    // Create realistic variation: peak around day 2-3, then gradual decline
    const rainfallMultiplier = [1.0, 1.15, 1.25, 1.10, 0.85, 0.65, 0.50][i];
    const jitter = ((seed * (i + 1) * 17) % 30) - 15; // ±15mm jitter

    const rainfall = Math.max(0, Math.round(baseRainfall * rainfallMultiplier + jitter));

    // Risk score follows rainfall pattern with slight lag
    const riskMultiplier = [1.0, 1.05, 1.18, 1.20, 1.05, 0.88, 0.72][i];
    const riskJitter = ((seed * (i + 1) * 13) % 10) - 5;
    const riskScore = Math.min(100, Math.max(0, Math.round(baseRisk * riskMultiplier + riskJitter)));

    // Soil moisture changes slowly
    const soilMoisture = Math.min(100, Math.max(20, zone.soilMoisture + (rainfall > 50 ? 3 : -2) * (i > 3 ? -1 : 1)));

    return {
      day: label,
      dayIndex: i,
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      rainfall,
      riskScore,
      soilMoisture: Math.round(soilMoisture),
      temperature: Math.round(22 + ((seed * (i + 1)) % 8)),
      humidity: Math.min(98, Math.round(70 + rainfall / 5)),
      windSpeed: Math.round(10 + ((seed * (i + 2)) % 20)),
      weatherCondition: rainfall > 80 ? 'Heavy Rain' : rainfall > 40 ? 'Moderate Rain' : rainfall > 15 ? 'Light Rain' : 'Cloudy',
    };
  });
}

/**
 * Generate mock weekly rainfall chart data for the operations dashboard.
 * Shows rainfall across all states.
 *
 * INTEGRATION POINT: Replace with IMD district-wise rainfall API data.
 */
export function generateWeeklyRainfall() {
  return DAY_LABELS.map((label, i) => ({
    day: label,
    Assam: Math.round(45 + Math.sin(i * 0.8) * 30 + Math.random() * 20),
    Meghalaya: Math.round(85 + Math.sin(i * 0.6) * 40 + Math.random() * 25),
    Manipur: Math.round(40 + Math.sin(i * 0.9) * 25 + Math.random() * 15),
    Mizoram: Math.round(35 + Math.sin(i * 0.7) * 20 + Math.random() * 15),
    Nagaland: Math.round(38 + Math.sin(i * 0.5) * 22 + Math.random() * 18),
    Tripura: Math.round(25 + Math.sin(i * 1.0) * 15 + Math.random() * 10),
    'Arunachal Pradesh': Math.round(55 + Math.sin(i * 0.4) * 35 + Math.random() * 20),
    Sikkim: Math.round(50 + Math.sin(i * 0.6) * 28 + Math.random() * 18),
  }));
}
