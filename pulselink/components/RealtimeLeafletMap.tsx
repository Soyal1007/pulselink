'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths in Next.js SSR
const ambulanceIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19],
});

const hospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320371.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

interface RealtimeLeafletMapProps {
  ambulanceLat: number;
  ambulanceLng: number;
  hospitalLat: number;
  hospitalLng: number;
  hospitalName: string;
}

export default function RealtimeLeafletMap({
  ambulanceLat,
  ambulanceLng,
  hospitalLat,
  hospitalLng,
  hospitalName,
}: RealtimeLeafletMapProps) {
  const routePolyline: [number, number][] = [
    [ambulanceLat, ambulanceLng],
    [(ambulanceLat + hospitalLat) / 2 + 0.005, (ambulanceLng + hospitalLng) / 2 - 0.003],
    [hospitalLat, hospitalLng],
  ];

  return (
    <MapContainer
      center={[ambulanceLat, ambulanceLng]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl z-10"
    >
      <RecenterMap lat={(ambulanceLat + hospitalLat) / 2} lng={(ambulanceLng + hospitalLng) / 2} />

      {/* CartoDB High contrast clear tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Route Trajectory Polyline */}
      <Polyline positions={routePolyline} color="#2563eb" weight={5} opacity={0.8} dashArray="8, 8" />

      {/* Ambulance Marker */}
      <Marker position={[ambulanceLat, ambulanceLng]} icon={ambulanceIcon}>
        <Popup>
          <div className="text-xs font-black text-slate-900 p-1">
            🚨 Ambulance Unit KA-01-A-0001
            <p className="text-[10px] font-bold text-blue-600 mt-0.5">En Route · Live GPS Active</p>
          </div>
        </Popup>
      </Marker>

      {/* Hospital Destination Marker */}
      <Marker position={[hospitalLat, hospitalLng]} icon={hospitalIcon}>
        <Popup>
          <div className="text-xs font-black text-slate-900 p-1">
            🏥 {hospitalName}
            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Target Destination ER</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
