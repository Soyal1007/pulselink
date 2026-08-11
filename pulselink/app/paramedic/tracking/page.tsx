'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Clock, Building2, Plus, Phone, CheckCircle2, ShieldCheck, Ambulance, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import Leaflet map to prevent Next.js SSR window errors
const RealtimeLeafletMap = dynamic(() => import('@/components/RealtimeLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 rounded-xl">
      Loading OpenStreetMap Leaflet Engine...
    </div>
  ),
});

export interface HospitalDestination {
  id: string;
  name: string;
  dept: string;
  address: string;
  distance: string;
  eta: string;
  lat: number;
  lng: number;
  phone: string;
}

const DEFAULT_HOSPITALS: HospitalDestination[] = [
  {
    id: 'hosp-1',
    name: 'City General Hospital',
    dept: 'Level 1 Trauma & Cardiac Cath Lab',
    address: 'Indiranagar 100ft Road, Bengaluru',
    distance: '6.8 km',
    eta: '14 mins',
    lat: 12.9784,
    lng: 77.6408,
    phone: '+91 80 2525 0000',
  },
  {
    id: 'hosp-2',
    name: 'Apollo Emergency Medical Center',
    dept: 'Comprehensive Stroke & Critical Care Unit',
    address: 'Bannerghatta Road, Bengaluru',
    distance: '11.4 km',
    eta: '22 mins',
    lat: 12.8984,
    lng: 77.5988,
    phone: '+91 80 2630 4000',
  },
  {
    id: 'hosp-3',
    name: 'Manipal Heart & Emergency Institute',
    dept: 'Super Specialty Cardiology & ECMO Unit',
    address: 'HAL Airport Road, Bengaluru',
    distance: '8.2 km',
    eta: '17 mins',
    lat: 12.9575,
    lng: 77.6492,
    phone: '+91 80 2502 4444',
  },
];

export default function TrackingPage() {
  const [hospitals, setHospitals] = useState<HospitalDestination[]>(DEFAULT_HOSPITALS);
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-1');
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);

  // Custom Hospital Form State
  const [newHospitalName, setNewHospitalName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLat, setNewLat] = useState('12.9352');
  const [newLng, setNewLng] = useState('77.6245');

  // Ambulance Current GPS Coordinates (Simulated Live Updates)
  const [ambulancePos, setAmbulancePos] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulancePos((prev) => ({
        lat: prev.lat + 0.0001,
        lng: prev.lng + 0.0001,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  function handleAddCustomHospital(e: React.FormEvent) {
    e.preventDefault();
    if (!newHospitalName) return;

    const customHosp: HospitalDestination = {
      id: `hosp-custom-${Date.now()}`,
      name: newHospitalName,
      dept: newDept || 'Emergency Department',
      address: newAddress || 'Custom Location, Bengaluru',
      distance: '5.2 km',
      eta: '11 mins',
      lat: parseFloat(newLat) || 12.9352,
      lng: parseFloat(newLng) || 77.6245,
      phone: newPhone || '+91 80 0000 0000',
    };

    setHospitals((prev) => [customHosp, ...prev]);
    setSelectedHospitalId(customHosp.id);
    setIsAddingModalOpen(false);

    // Reset Form
    setNewHospitalName('');
    setNewDept('');
    setNewAddress('');
    setNewPhone('');
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ambulance Live GPS & Real-Time Hospital Navigation</h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Real-time ambulance dispatch tracking powered by OpenStreetMap & Leaflet.js.
          </p>
        </div>

        <button
          onClick={() => setIsAddingModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Custom Hospital / Facility
        </button>
      </div>

      {/* Hospital Selection Cards — Horizontal Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Select Destination Emergency Hospital ({hospitals.length} Available)
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitals.map((h) => {
            const isSel = selectedHospitalId === h.id;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedHospitalId(h.id)}
                className={cn(
                  'pro-card p-5 cursor-pointer transition-all',
                  isSel ? 'border-2 border-blue-600 bg-blue-50/40 shadow-sm ring-4 ring-blue-500/10' : 'hover:border-slate-300'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2.5 rounded-xl text-white shadow-2xs', isSel ? 'bg-blue-600' : 'bg-slate-700')}>
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">{h.name}</h3>
                      <p className="text-xs font-bold text-blue-700">{h.dept}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {h.address}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-blue-100 text-blue-900 px-3 py-1 text-xs font-black">
                      {h.eta}
                    </span>
                    <p className="text-xs font-bold text-slate-500 mt-2">{h.distance}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPS Live Telemetry Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pro-card p-5 text-center">
          <p className="text-xs font-extrabold uppercase text-slate-500">Destination Hospital</p>
          <p className="text-lg font-black text-slate-900 truncate mt-1">{currentHospital.name}</p>
        </div>
        <div className="pro-card p-5 text-center">
          <p className="text-xs font-extrabold uppercase text-slate-500">Route Distance</p>
          <p className="text-3xl font-black text-blue-600 mt-1">{currentHospital.distance}</p>
        </div>
        <div className="pro-card p-5 text-center">
          <p className="text-xs font-extrabold uppercase text-slate-500">Estimated Travel Time</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{currentHospital.eta}</p>
        </div>
        <div className="pro-card p-5 text-center">
          <p className="text-xs font-extrabold uppercase text-slate-500">Ambulance Speed</p>
          <p className="text-3xl font-black text-purple-600 mt-1">48 <span className="text-xs font-bold text-slate-600">km/h</span></p>
        </div>
      </div>

      {/* Real-time Interactive Leaflet Map Container */}
      <div className="pro-card p-4 space-y-3 bg-white">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            Live OpenStreetMap & Leaflet Interactive Navigation Canvas
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            GPS LAT: {ambulancePos.lat.toFixed(4)}, LNG: {ambulancePos.lng.toFixed(4)}
          </span>
        </div>

        <div className="h-[460px] w-full rounded-xl border border-slate-300 overflow-hidden relative shadow-inner">
          <RealtimeLeafletMap
            ambulanceLat={ambulancePos.lat}
            ambulanceLng={ambulancePos.lng}
            hospitalLat={currentHospital.lat}
            hospitalLng={currentHospital.lng}
            hospitalName={currentHospital.name}
          />
        </div>
      </div>

      {/* ADD CUSTOM HOSPITAL MODAL */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="pro-card p-6 w-full max-w-lg bg-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Add Custom Hospital of Your Choice
              </h3>
              <button onClick={() => setIsAddingModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomHospital} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  required
                  value={newHospitalName}
                  onChange={(e) => setNewHospitalName(e.target.value)}
                  placeholder="e.g. St. Martha's Hospital"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">Department / Emergency Care Specialty</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. Emergency Cardiac Center"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Nrupatunga Road, Bengaluru"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    placeholder="12.9352"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    placeholder="77.6245"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white hover:bg-blue-700 shadow-sm"
                >
                  Add & Route to Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
