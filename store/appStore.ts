'use client';
import { create } from 'zustand';
import type { UserProfile, EmergencyCase, Vitals, Hospital, Ambulance } from '@/types';

interface AppState {
  // Auth
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;

  // Active case (paramedic)
  activeCase: EmergencyCase | null;
  setActiveCase: (c: EmergencyCase | null) => void;

  // Vitals stream
  latestVitals: Vitals | null;
  setLatestVitals: (v: Vitals) => void;

  // Connectivity
  isOnline: boolean;
  setOnline: (v: boolean) => void;

  // Sync
  pendingSyncCount: number;
  setPendingSyncCount: (n: number) => void;

  // Notification count
  unreadCount: number;
  setUnreadCount: (n: number) => void;

  // Selected ambulance
  selectedAmbulance: Ambulance | null;
  setSelectedAmbulance: (a: Ambulance | null) => void;

  // Selected hospital
  selectedHospital: Hospital | null;
  setSelectedHospital: (h: Hospital | null) => void;

  // Demo mode
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  setProfile: (p) => set({ profile: p }),

  activeCase: null,
  setActiveCase: (c) => set({ activeCase: c }),

  latestVitals: null,
  setLatestVitals: (v) => set({ latestVitals: v }),

  isOnline: true,
  setOnline: (v) => set({ isOnline: v }),

  pendingSyncCount: 0,
  setPendingSyncCount: (n) => set({ pendingSyncCount: n }),

  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),

  selectedAmbulance: null,
  setSelectedAmbulance: (a) => set({ selectedAmbulance: a }),

  selectedHospital: null,
  setSelectedHospital: (h) => set({ selectedHospital: h }),

  isDemoMode: false,
  setDemoMode: (v) => set({ isDemoMode: v }),
}));
