import React, { createContext, useState, useEffect } from 'react';
import { zones as initialZones, calculateRiskScore } from '../data/zones';
import { fleetData } from '../data/logistics';
import { fetchLiveTelemetry, fetchLiveEarthquakes } from '../services/liveDataService';
import { gpsSimulator } from '../services/WebSocketSimulator';

export const LiveDataContext = createContext();

export const LiveDataProvider = ({ children }) => {
  const [liveZones, setLiveZones] = useState(initialZones);
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [liveFleet, setLiveFleet] = useState(gpsSimulator.fleets);

  const dispatchFleet = (newFleetData) => {
    // In a real app, send this via WebSocket. Here, we'll manually push to the simulator.
    gpsSimulator.fleets.push({
        ...newFleetData,
        id: newFleetData.id,
        vehicleName: 'Ground Transport',
        lat: newFleetData.lat,
        lng: newFleetData.lng,
        heading: 0,
        altitude: 0,
        fuel: 100,
        signalStrength: 100,
        gpsAccuracy: 3.0,
        lastUpdated: new Date().toISOString(),
        targetIndex: 1
    });
    setLiveFleet([...gpsSimulator.fleets]);
  };

  useEffect(() => {
    let mounted = true;
    
    // Start GPS Simulator
    gpsSimulator.start();
    const unsubscribeGPS = gpsSimulator.subscribe((event) => {
      if (mounted && event.type === 'FLEET_UPDATE') {
         setLiveFleet([...event.data]);
      }
    });

    const connectAPIs = async () => {
      try {
        // Fetch weather and soil moisture from Open-Meteo
        const telemetry = await fetchLiveTelemetry();
        
        // Fetch real seismic activity from USGS
        const quakes = await fetchLiveEarthquakes();
        
        if (!mounted) return;

        if (quakes) {
          setEarthquakes(quakes);
        }

        if (telemetry) {
          // Merge live data into the static zones list
          const updatedZones = initialZones.map(zone => {
            
            // Calculate seismic risk based on nearby USGS quakes (real data)
            let maxNearbyMag = 0;
            if (quakes && quakes.length > 0) {
              quakes.forEach(q => {
                const dist = Math.sqrt(Math.pow(q.lat - zone.lat, 2) + Math.pow(q.lng - zone.lng, 2));
                if (dist < 3.0) { // roughly 300km radius
                  if (q.magnitude > maxNearbyMag) maxNearbyMag = q.magnitude;
                }
              });
            }
            
            // Map earthquake magnitude to a 0-100 index score
            // Baseline tectonic stress for NER is ~15 idx.
            let calculatedSeismicRisk = 15; 
            if (maxNearbyMag >= 2.0) {
               calculatedSeismicRisk = Math.min(100, 15 + (maxNearbyMag - 2.0) * 20);
            }

            const liveInfo = telemetry.find(t => t.id === zone.id);
            if (liveInfo) {
              const newRainfall = liveInfo.liveData.precipitation24h;
              const newSoilMoisture = liveInfo.liveData.soilMoisture;
              
              const tempZone = {
                ...zone,
                rainfall24h: newRainfall,
                soilMoisture: newSoilMoisture,
                seismicRisk: calculatedSeismicRisk
              };
              const newRiskScore = calculateRiskScore(tempZone);

              return {
                ...tempZone,
                riskScore: newRiskScore,
                liveTelemetry: liveInfo.liveData
              };
            }
            
            // Even if telemetry fails for this zone, update its seismic risk
            const tempZone = {
              ...zone,
              seismicRisk: calculatedSeismicRisk
            };
            return {
              ...tempZone,
              riskScore: calculateRiskScore(tempZone)
            };
          });
          
          setLiveZones(updatedZones);
          setIsLiveConnected(true);
          setLastSyncTime(new Date());
        }
      } catch (error) {
        console.error("Failed to connect live APIs:", error);
      }
    };

    connectAPIs();

    // Set up polling interval to keep it real-time (every 15 mins)
    const intervalId = setInterval(connectAPIs, 15 * 60 * 1000);

    // Secondary interval: 10-second high-frequency fluctuation to simulate live sensor telemetry changes
    const fluctuationId = setInterval(() => {
      setLiveZones(prevZones => prevZones.map(zone => {
        const fluctuate = () => (Math.random() - 0.5) * 1.5; // Random between -0.75 and 0.75
        const newRainfall = Math.max(0, (zone.rainfall24h || 0) + fluctuate());
        const newMoisture = Math.min(100, Math.max(0, (zone.soilMoisture || 50) + fluctuate()));
        
        let newScore = calculateRiskScore({
          ...zone,
          rainfall24h: newRainfall,
          soilMoisture: newMoisture
        });

        // Ensure visible small changes to Risk Score
        newScore = Math.max(0, Math.min(100, Math.round(newScore + fluctuate())));

        return {
          ...zone,
          rainfall24h: newRainfall,
          soilMoisture: newMoisture,
          riskScore: newScore
        };
      }));
    }, 10000);


    return () => {
      mounted = false;
      clearInterval(intervalId);
      clearInterval(fluctuationId);
      unsubscribeGPS();
      gpsSimulator.stop();
    };
  }, []);

  return (
    <LiveDataContext.Provider value={{ liveZones, earthquakes, isLiveConnected, lastSyncTime, liveFleet, setLiveFleet, dispatchFleet }}>
      {children}
    </LiveDataContext.Provider>
  );
};
