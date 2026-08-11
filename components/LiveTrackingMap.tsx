'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in Next.js SSR
const ambulanceIcon = L.divIcon({
  className: 'custom-ambulance-icon',
  html: `<div style="background-color: #ef4444; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);">
          <span style="color: white; font-size: 14px; font-weight: bold;">🚑</span>
        </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const hospitalIcon = L.divIcon({
  className: 'custom-hospital-icon',
  html: `<div style="background-color: #2563eb; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);">
          <span style="color: white; font-size: 14px; font-weight: bold;">🏥</span>
        </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

interface MapProps {
  currentPos: { lat: number; lng: number };
  hospitalPos: { lat: number; lng: number; name?: string };
}

export default function LiveTrackingMap({ currentPos, hospitalPos }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0d1117] text-slate-500 text-xs">
        Loading Map...
      </div>
    );
  }

  const polylineCoords = [
    [currentPos.lat, currentPos.lng] as [number, number],
    [hospitalPos.lat, hospitalPos.lng] as [number, number],
  ];

  return (
    <MapContainer
      center={[currentPos.lat, currentPos.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl z-0"
      style={{ background: '#0d1117' }}
    >
      {/* Dark mode Leaflet tiles from CartoDB */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <RecenterMap lat={currentPos.lat} lng={currentPos.lng} />

      {/* Ambulance Marker */}
      <Marker position={[currentPos.lat, currentPos.lng]} icon={ambulanceIcon}>
        <Popup className="custom-popup">
          <span className="text-xs font-bold text-slate-800">Ambulance (En Route)</span>
        </Popup>
      </Marker>

      {/* Hospital Marker */}
      <Marker position={[hospitalPos.lat, hospitalPos.lng]} icon={hospitalIcon}>
        <Popup className="custom-popup">
          <span className="text-xs font-bold text-slate-800">{hospitalPos.name || 'Receiving Hospital'}</span>
        </Popup>
      </Marker>

      {/* Route line */}
      <Polyline
        positions={polylineCoords}
        pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '6, 8', opacity: 0.8 }}
      />
    </MapContainer>
  );
}
