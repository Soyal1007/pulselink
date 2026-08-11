/**
 * GPS / ETA Service
 * Abstracts location logic so real GPS can replace simulation later.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Haversine distance in kilometres */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Estimate ETA in minutes given distance (km) and speed (km/h) */
export function estimateEta(distanceKm: number, speedKmh = 50): number {
  return (distanceKm / speedKmh) * 60;
}

/** Interpolate between two coordinates by fraction 0-1 */
export function interpolate(from: LatLng, to: LatLng, fraction: number): LatLng {
  return {
    lat: from.lat + (to.lat - from.lat) * fraction,
    lng: from.lng + (to.lng - from.lng) * fraction,
  };
}

/** Simulate ambulance moving toward hospital */
export class AmbulanceSimulator {
  private fraction = 0;
  private readonly stepSize: number;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    public from: LatLng,
    public to: LatLng,
    private onUpdate: (pos: LatLng, eta: number, distance: number) => void,
    private onArrival: () => void,
    stepDurationMs = 3000
  ) {
    const totalDistance = haversineDistance(from, to);
    // step covers ~0.5 km per tick
    this.stepSize = 0.5 / totalDistance;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.fraction = Math.min(1, this.fraction + this.stepSize);
      const pos = interpolate(this.from, this.to, this.fraction);
      const remaining = haversineDistance(pos, this.to);
      const eta = estimateEta(remaining);
      this.onUpdate(pos, eta, remaining);
      if (this.fraction >= 1) {
        this.stop();
        this.onArrival();
      }
    }, 3000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
