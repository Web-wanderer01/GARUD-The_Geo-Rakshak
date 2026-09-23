import { calculateDistance, calculateHeading, generateSimulatedRoute } from './RoutingService';
import { fleetData } from '../data/logistics';

// This simulates a real WebSocket connection to a GPS telemetry server
class GPSTelemetrySimulator {
  constructor() {
    this.listeners = [];
    this.intervalId = null;
    this.fleets = this.initializeFleets();
  }

  initializeFleets() {
    return fleetData.map(f => {
      // Create a more robust fleet object based on user requirements
      const route = generateSimulatedRoute(f.routeHistory[0][0], f.routeHistory[0][1], f.lat, f.lng);
      
      return {
        id: f.id,
        vehicleName: f.id.startsWith('HELI') ? 'Airlift Unit' : 'Ground Transport',
        origin: f.origin,
        destination: f.destination,
        lat: f.lat,
        lng: f.lng,
        speed: f.speed,
        heading: 0,
        altitude: f.id.startsWith('HELI') ? 1500 : 0,
        status: f.status,
        fuel: 80 + Math.random() * 20,
        signalStrength: 95,
        gpsAccuracy: 3.5,
        lastUpdated: new Date().toISOString(),
        routeId: `RT-${Math.floor(Math.random()*1000)}`,
        eta: f.eta,
        cargo: f.cargo,
        category: f.category,
        delayReason: f.delayReason,
        // Internal sim state
        routeHistory: f.routeHistory || route.path,
        targetIndex: 1
      };
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  start() {
    if (this.intervalId) return;

    // Simulate WS emitting a "fleet_update" event every 3 seconds
    this.intervalId = setInterval(() => {
      this.fleets = this.fleets.map(fleet => {
        if (fleet.status === 'critical' || fleet.status === 'delayed' && fleet.speed === 0) {
          // Stopped vehicle
          fleet.lastUpdated = new Date().toISOString();
          return fleet;
        }

        // Move vehicle towards next waypoint
        const targetPoint = fleet.routeHistory[fleet.targetIndex];
        if (!targetPoint) {
          // Reached end of known route
          fleet.speed = 0;
          return fleet;
        }

        const dist = calculateDistance(fleet.lat, fleet.lng, targetPoint[0], targetPoint[1]);
        
        // Speed in km/h. distance in km.
        // In 3 seconds (1/1200 of an hour), it travels:
        const travelDist = fleet.speed * (3 / 3600);

        if (travelDist >= dist) {
          // Reached waypoint, move to next
          fleet.lat = targetPoint[0];
          fleet.lng = targetPoint[1];
          if (fleet.targetIndex < fleet.routeHistory.length - 1) {
            fleet.targetIndex++;
          } else {
             // Reached final destination
             fleet.status = 'DELIVERED';
             fleet.speed = 0;
          }
        } else {
          // Move fractionally
          const fraction = travelDist / dist;
          fleet.lat = fleet.lat + (targetPoint[0] - fleet.lat) * fraction;
          fleet.lng = fleet.lng + (targetPoint[1] - fleet.lng) * fraction;
        }

        fleet.heading = calculateHeading(fleet.lat, fleet.lng, targetPoint[0], targetPoint[1]);
        
        // Simulate GPS noise & signal drop
        const randomChance = Math.random();
        if (randomChance > 0.95) {
          fleet.signalStrength = Math.max(0, fleet.signalStrength - 20); // Signal drop
        } else {
          fleet.signalStrength = Math.min(100, fleet.signalStrength + 5); // Signal recover
        }

        // If signal drops too low, don't update timestamp to simulate 'STALE'/'OFFLINE'
        if (fleet.signalStrength > 30) {
           fleet.lastUpdated = new Date().toISOString();
        }

        return fleet;
      });

      this.listeners.forEach(l => l({ type: 'FLEET_UPDATE', data: this.fleets }));
    }, 3000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

export const gpsSimulator = new GPSTelemetrySimulator();
