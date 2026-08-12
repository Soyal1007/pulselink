'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CasePriority, CaseStatus } from '@/types';

// ─── Shared Case Data Types ─────────────────────────────────────────────────
export interface CasePatient {
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  phone: string;
  chief_complaint: string;
  allergies: string;
  medications: string;
  conditions: string;
}

export interface CaseVitals {
  heart_rate: number;
  spo2: number;
  systolic_bp: number;
  diastolic_bp: number;
  resp_rate: number;
  temperature: number;
}

export interface CaseEvent {
  time: string;
  label: string;
  actor: string;
}

export interface LiveCase {
  id: string;
  case_ref: string;
  priority: CasePriority;
  status: CaseStatus;
  patient: CasePatient;
  vitals: CaseVitals;
  symptoms: string[];
  symptom_onset: string;
  symptom_notes: string;
  ecg_pattern: string;
  ambulance_id: string;
  paramedic: string;
  eta_min: number;
  distance_km: number;
  events: CaseEvent[];
  acknowledged: boolean;
  preparing: boolean;
  created_at: string;
}

// ─── Initial Demo Data ──────────────────────────────────────────────────────
const SEED_CASES: LiveCase[] = [
  {
    id: 'case-001',
    case_ref: 'PL-20260811-CARDIAC01',
    priority: 'CRITICAL',
    status: 'hospital_notified',
    patient: {
      name: 'Rajan Mehta', age: 58, gender: 'Male', blood_group: 'O+',
      phone: '+91 98765 43210',
      chief_complaint: 'Acute substernal chest pain & dyspnea',
      allergies: 'Penicillin', medications: 'Metformin, Amlodipine',
      conditions: 'Hypertension, Type 2 Diabetes',
    },
    vitals: { heart_rate: 94, spo2: 94.5, systolic_bp: 148, diastolic_bp: 92, resp_rate: 22, temperature: 37.2 },
    symptoms: ['Chest Pain', 'Shortness of Breath', 'Diaphoresis'],
    symptom_onset: '40 minutes ago',
    symptom_notes: 'Crushing pain radiating to left arm with cold sweats.',
    ecg_pattern: 'RBBB',
    ambulance_id: 'KA-01-A-0001',
    paramedic: 'Arjun Kumar',
    eta_min: 8,
    distance_km: 6.4,
    events: [
      { time: '10:21', label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
      { time: '10:22', label: 'Patient information recorded', actor: 'Arjun Kumar' },
      { time: '10:23', label: 'Vitals recorded', actor: 'System' },
      { time: '10:24', label: 'ECG analyzed — RBBB detected', actor: 'AI Service' },
      { time: '10:25', label: 'Hospital notified', actor: 'System' },
    ],
    acknowledged: false,
    preparing: false,
    created_at: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'case-002',
    case_ref: 'PL-20260811-TRAUMA01',
    priority: 'HIGH',
    status: 'hospital_notified',
    patient: {
      name: 'Priya Sharma', age: 32, gender: 'Female', blood_group: 'A+',
      phone: '+91 98765 43211',
      chief_complaint: 'High-velocity motor vehicle accident trauma',
      allergies: 'None known', medications: 'None',
      conditions: 'None',
    },
    vitals: { heart_rate: 118, spo2: 96.0, systolic_bp: 98, diastolic_bp: 62, resp_rate: 26, temperature: 36.8 },
    symptoms: ['Physical Trauma', 'Severe Bleeding', 'Loss of Consciousness'],
    symptom_onset: '15 minutes ago',
    symptom_notes: 'Multi-vehicle collision, patient extracted from driver seat.',
    ecg_pattern: 'NORM',
    ambulance_id: 'KA-01-A-0002',
    paramedic: 'Sita Verma',
    eta_min: 14,
    distance_km: 7.1,
    events: [
      { time: '10:18', label: 'Emergency case created', actor: 'Sita Verma (Paramedic)' },
      { time: '10:19', label: 'Trauma vitals recorded', actor: 'Sita Verma' },
      { time: '10:20', label: 'Hospital notified', actor: 'System' },
    ],
    acknowledged: false,
    preparing: false,
    created_at: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    id: 'case-003',
    case_ref: 'PL-20260811-RESP01',
    priority: 'MEDIUM',
    status: 'en_route',
    patient: {
      name: 'Arjun Nair', age: 45, gender: 'Male', blood_group: 'B+',
      phone: '+91 98765 43212',
      chief_complaint: 'Acute asthma exacerbation',
      allergies: 'Aspirin', medications: 'Salbutamol inhaler',
      conditions: 'Chronic Asthma',
    },
    vitals: { heart_rate: 88, spo2: 91.5, systolic_bp: 126, diastolic_bp: 82, resp_rate: 28, temperature: 37.0 },
    symptoms: ['Shortness of Breath', 'Heart Palpitations'],
    symptom_onset: '25 minutes ago',
    symptom_notes: 'Severe wheezing, unable to complete sentences.',
    ecg_pattern: 'NORM',
    ambulance_id: 'KA-01-A-0003',
    paramedic: 'Rajesh Rao',
    eta_min: 22,
    distance_km: 11.2,
    events: [
      { time: '10:10', label: 'Emergency case created', actor: 'Rajesh Rao (Paramedic)' },
      { time: '10:12', label: 'Vitals recorded', actor: 'Rajesh Rao' },
    ],
    acknowledged: false,
    preparing: false,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
];

// ─── Zustand Store with LocalStorage Persistence ────────────────────────────
interface CaseStore {
  cases: LiveCase[];
  activeCaseId: string | null;

  // Paramedic actions
  addCase: (c: LiveCase) => void;
  setActiveCaseId: (id: string | null) => void;
  updateCaseVitals: (caseId: string, vitals: Partial<CaseVitals>) => void;
  updateCaseEcg: (caseId: string, pattern: string) => void;
  addCaseEvent: (caseId: string, event: CaseEvent) => void;

  // Hospital actions
  acknowledgeCase: (caseId: string) => void;
  prepareCase: (caseId: string) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus) => void;

  // Getters
  getCaseById: (id: string) => LiveCase | undefined;
  getActiveCase: () => LiveCase | undefined;

  // Reset
  resetToDemo: () => void;
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      cases: SEED_CASES,
      activeCaseId: null,

      addCase: (c) =>
        set((state) => ({
          cases: [c, ...state.cases],
          activeCaseId: c.id,
        })),

      setActiveCaseId: (id) => set({ activeCaseId: id }),

      updateCaseVitals: (caseId, vitals) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, vitals: { ...c.vitals, ...vitals } } : c
          ),
        })),

      updateCaseEcg: (caseId, pattern) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, ecg_pattern: pattern } : c
          ),
        })),

      addCaseEvent: (caseId, event) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, events: [...c.events, event] } : c
          ),
        })),

      acknowledgeCase: (caseId) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  acknowledged: true,
                  status: 'hospital_acknowledged' as CaseStatus,
                  events: [
                    ...c.events,
                    {
                      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                      label: 'Triage acknowledged by ER physician',
                      actor: 'Dr. Meera Pillai (Triage Officer)',
                    },
                  ],
                }
              : c
          ),
        })),

      prepareCase: (caseId) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  preparing: true,
                  status: 'team_preparing' as CaseStatus,
                  events: [
                    ...c.events,
                    {
                      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                      label: 'Trauma bay prepared, ER team assembled',
                      actor: 'Dr. Meera Pillai (Triage Officer)',
                    },
                  ],
                }
              : c
          ),
        })),

      updateCaseStatus: (caseId, status) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, status } : c
          ),
        })),

      getCaseById: (id) => get().cases.find((c) => c.id === id),

      getActiveCase: () => {
        const { activeCaseId, cases } = get();
        return activeCaseId ? cases.find((c) => c.id === activeCaseId) : undefined;
      },

      resetToDemo: () => set({ cases: SEED_CASES, activeCaseId: null }),
    }),
    {
      name: 'pulselink-cases',
    }
  )
);
