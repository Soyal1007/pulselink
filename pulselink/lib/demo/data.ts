/**
 * Demo / local data used when Supabase is not configured.
 * All data is clearly labeled as DEMO DATA.
 */
import type { EmergencyCase, Hospital, Ambulance, Patient, Vitals, EcgRecord } from '@/types';

export const DEMO_HOSPITALS: Hospital[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'City General Hospital',
    address: '12 MG Road, Central District',
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91-80-1234-5678',
    latitude: 12.9716,
    longitude: 77.5946,
    departments: ['Emergency', 'Cardiology', 'Neurology', 'Trauma', 'ICU'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Apollo Emergency Centre',
    address: '56 NH-48, Electronics City',
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91-80-9876-5432',
    latitude: 12.8399,
    longitude: 77.677,
    departments: ['Emergency', 'Cardiology', 'Orthopaedics', 'ICU'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_AMBULANCES: Ambulance[] = [
  { id: 'aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', vehicle_number: 'KA-01-A-0001', organization: 'PulseLink EMS', status: 'available', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', vehicle_number: 'KA-01-A-0002', organization: 'PulseLink EMS', status: 'available', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', vehicle_number: 'KA-01-A-0003', organization: 'City Ambulance Network', status: 'available', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'demo-patient-001',
    patient_ref: 'PT-DEMO001',
    name: 'Rajan Mehta',
    age: 58,
    gender: 'male',
    blood_group: 'O+',
    allergies: 'Penicillin',
    existing_conditions: 'Hypertension, Type 2 Diabetes',
    current_medication: 'Metformin, Amlodipine',
    chief_complaint: 'Chest pain and shortness of breath',
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-patient-002',
    patient_ref: 'PT-DEMO002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'female',
    blood_group: 'B+',
    chief_complaint: 'Multiple trauma injuries — road accident',
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-patient-003',
    patient_ref: 'PT-DEMO003',
    name: 'Arjun Nair',
    age: 45,
    gender: 'male',
    existing_conditions: 'Asthma',
    current_medication: 'Salbutamol inhaler',
    chief_complaint: 'Severe respiratory distress',
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_CREDENTIALS = [
  { role: 'Paramedic', email: 'paramedic@demo.pulselink', password: 'Demo@1234', name: 'Arjun Kumar' },
  { role: 'Doctor', email: 'doctor@demo.pulselink', password: 'Demo@1234', name: 'Dr. Meera Pillai' },
  { role: 'Hospital Admin', email: 'admin@demo.pulselink', password: 'Demo@1234', name: 'Suresh Babu' },
  { role: 'Super Admin', email: 'superadmin@demo.pulselink', password: 'Demo@1234', name: 'System Admin' },
];

export function generateDemoVitals(caseId: string, offset = 0): Vitals {
  const base = {
    heart_rate: 92,
    systolic_bp: 148,
    diastolic_bp: 94,
    spo2: 94.5,
    respiratory_rate: 22,
    temperature: 37.2,
    ecg_heart_rate: 94,
    consciousness_level: 'alert' as const,
  };
  return {
    id: `demo-vitals-${Date.now()}`,
    case_id: caseId,
    heart_rate: base.heart_rate + Math.floor(Math.random() * 8 - 4) + offset,
    systolic_bp: base.systolic_bp + Math.floor(Math.random() * 10 - 5),
    diastolic_bp: base.diastolic_bp + Math.floor(Math.random() * 6 - 3),
    spo2: parseFloat((base.spo2 + (Math.random() * 2 - 1)).toFixed(1)),
    respiratory_rate: base.respiratory_rate + Math.floor(Math.random() * 4 - 2),
    temperature: parseFloat((base.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)),
    ecg_heart_rate: base.ecg_heart_rate + Math.floor(Math.random() * 6 - 3),
    consciousness_level: 'alert',
    is_simulated: true,
    recorded_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}
