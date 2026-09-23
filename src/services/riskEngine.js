// src/services/riskEngine.js
export const RISK_WEIGHTS = {
  rainfall: 0.35,
  soilMoisture: 0.30,
  slope: 0.20,
  displacement: 0.15
};

export const calculateRisk = (environmentalData, terrainData) => {
  const { rainfall, soilMoisture } = environmentalData; 
  const { avgSlope, displacement } = terrainData; 

  // Normalize inputs to 0-100 scale
  // Rainfall: Assume 50mm/hr intensity is 100% extreme
  const normRain = Math.min(100, (rainfall / 50) * 100);
  
  // Soil Moisture is already 0-100%
  const normSoil = Math.min(100, soilMoisture);
  
  // Slope: 45 degrees is 100% highest risk
  const normSlope = Math.min(100, (avgSlope / 45) * 100);
  
  // Displacement: 20mm/mo is 100% extreme
  const normDisp = Math.min(100, (displacement / 20) * 100);

  const riskScore = (
    normRain * RISK_WEIGHTS.rainfall +
    normSoil * RISK_WEIGHTS.soilMoisture +
    normSlope * RISK_WEIGHTS.slope +
    normDisp * RISK_WEIGHTS.displacement
  );

  let riskLevel = 'safe';
  if (riskScore > 75) riskLevel = 'critical';
  else if (riskScore > 50) riskLevel = 'warning';
  else if (riskScore > 30) riskLevel = 'elevated';

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    factors: {
      rainfall: Math.round(normRain),
      soilMoisture: Math.round(normSoil),
      slope: Math.round(normSlope),
      displacement: Math.round(normDisp)
    }
  };
};
