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

export interface HospitalResponse {
  hospital_id: string;
  hospital_name: string;
  status: 'accepted' | 'declined' | 'pending';
  bed_type: string;
  reason?: string;
  responded_at: string;
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
  assigned_hospital_id?: string;
  assigned_hospital_name?: string;
  eta_min: number;
  distance_km: number;
  hospital_responses: HospitalResponse[];
  events: CaseEvent[];
  acknowledged: boolean;
  preparing: boolean;
  created_at: string;
}

export const HOSPITALS = [
  { id: 'hosp-001', name: 'City General Hospital', distance: 6.4, address: 'MG Road, Sector 4' },
  { id: 'hosp-002', name: 'Apollo Trauma Center', distance: 8.2, address: 'Koramangala 80ft Rd' },
  { id: 'hosp-003', name: 'Manipal Heart Institute', distance: 11.5, address: 'Old Airport Road' },
  { id: 'hosp-004', name: 'St. John’s Emergency Care', distance: 5.1, address: 'Sarjapur Main Rd' }
];

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
    assigned_hospital_id: 'hosp-001',
    assigned_hospital_name: 'City General Hospital',
    eta_min: 8,
    distance_km: 6.4,
    hospital_responses: [
      { hospital_id: 'hosp-001', hospital_name: 'City General Hospital', status: 'accepted', bed_type: 'Cath Lab / Cardiac ICU', responded_at: '10:25 AM' },
      { hospital_id: 'hosp-002', hospital_name: 'Apollo Trauma Center', status: 'accepted', bed_type: 'Emergency ER Bay 3', responded_at: '10:26 AM' },
      { hospital_id: 'hosp-003', hospital_name: 'Manipal Heart Institute', status: 'declined', bed_type: 'Cath Lab Full', reason: 'No available ventilators', responded_at: '10:27 AM' }
    ],
    events: [
      { time: '10:21', label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
      { time: '10:22', label: 'Patient information recorded', actor: 'Arjun Kumar' },
      { time: '10:23', label: 'Vitals recorded', actor: 'System' },
      { time: '10:24', label: 'ECG analyzed — RBBB detected', actor: 'AI Service' },
      { time: '10:25', label: 'Broadcast sent to all city hospitals', actor: 'System' },
      { time: '10:25', label: 'City General Hospital ACCEPTED patient', actor: 'Dr. Meera Pillai' },
    ],
    acknowledged: true,
    preparing: true,
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
    assigned_hospital_id: 'hosp-002',
    assigned_hospital_name: 'Apollo Trauma Center',
    eta_min: 14,
    distance_km: 7.1,
    hospital_responses: [
      { hospital_id: 'hosp-002', hospital_name: 'Apollo Trauma Center', status: 'accepted', bed_type: 'Red Zone Trauma Bay 1', responded_at: '10:20 AM' }
    ],
    events: [
      { time: '10:18', label: 'Emergency case created', actor: 'Sita Verma (Paramedic)' },
      { time: '10:19', label: 'Trauma vitals recorded', actor: 'Sita Verma' },
      { time: '10:20', label: 'Apollo Trauma Center ACCEPTED patient', actor: 'Dr. Suresh Nair' },
    ],
    acknowledged: false,
    preparing: false,
    created_at: new Date(Date.now() - 7 * 60000).toISOString(),
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
  redirectAmbulanceToHospital: (caseId: string, hospitalId: string, hospitalName: string) => void;

  // Hospital actions (Multi-hospital interconnectivity)
  hospitalRespondToCase: (caseId: string, hospitalId: string, hospitalName: string, status: 'accepted' | 'declined', bedType?: string, reason?: string) => void;
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
      activeCaseId: 'case-001',

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

      redirectAmbulanceToHospital: (caseId, hospitalId, hospitalName) =>
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  assigned_hospital_id: hospitalId,
                  assigned_hospital_name: hospitalName,
                  events: [
                    ...c.events,
                    {
                      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                      label: `Ambulance redirected to ${hospitalName}`,
                      actor: `${c.paramedic} (Paramedic)`,
                    },
                  ],
                }
              : c
          ),
        })),

      hospitalRespondToCase: (caseId, hospitalId, hospitalName, status, bedType = 'Emergency Bed', reason) =>
        set((state) => ({
          cases: state.cases.map((c) => {
            if (c.id !== caseId) return c;

            const existingResponses = c.hospital_responses || [];
            const updatedResponses = [
              ...existingResponses.filter((r) => r.hospital_id !== hospitalId),
              {
                hospital_id: hospitalId,
                hospital_name: hospitalName,
                status,
                bed_type: bedType,
                reason,
                responded_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              },
            ];

            // If accepted and no hospital is assigned yet, auto assign or keep choice
            const assignedHospId = c.assigned_hospital_id || (status === 'accepted' ? hospitalId : undefined);
            const assignedHospName = c.assigned_hospital_name || (status === 'accepted' ? hospitalName : undefined);

            return {
              ...c,
              hospital_responses: updatedResponses,
              assigned_hospital_id: assignedHospId,
              assigned_hospital_name: assignedHospName,
              events: [
                ...c.events,
                {
                  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  label: `${hospitalName} ${status.toUpperCase()} patient accommodation request (${bedType})`,
                  actor: `${hospitalName} ER Staff`,
                },
              ],
            };
          }),
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
        return activeCaseId ? cases.find((c) => c.id === activeCaseId) : cases[0];
      },

      resetToDemo: () => set({ cases: SEED_CASES, activeCaseId: 'case-001' }),
    }),
    {
      name: 'pulselink-cases-v2',
    }
  )
);
