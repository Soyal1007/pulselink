// ─── User & Auth ────────────────────────────────────────────────────────────
export type UserRole = 'paramedic' | 'doctor' | 'hospital_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  hospital_id?: string;
  ambulance_org_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Hospital ────────────────────────────────────────────────────────────────
export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  departments: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Ambulance ───────────────────────────────────────────────────────────────
export interface Ambulance {
  id: string;
  vehicle_number: string;
  organization: string;
  status: 'available' | 'en_route' | 'at_scene' | 'returning';
  current_latitude?: number;
  current_longitude?: number;
  assigned_paramedic_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Patient ─────────────────────────────────────────────────────────────────
export interface Patient {
  id: string;
  patient_ref: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  phone?: string;
  emergency_contact?: string;
  blood_group?: string;
  allergies?: string;
  existing_conditions?: string;
  current_medication?: string;
  chief_complaint?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Emergency Case ──────────────────────────────────────────────────────────
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus =
  | 'created'
  | 'en_route'
  | 'hospital_notified'
  | 'hospital_acknowledged'
  | 'team_preparing'
  | 'ready_for_arrival'
  | 'approaching'
  | 'arrived'
  | 'patient_transferred'
  | 'closed';

export interface EmergencyCase {
  id: string;
  case_ref: string;
  patient_id: string;
  ambulance_id: string;
  paramedic_id: string;
  hospital_id?: string;
  priority: CasePriority;
  status: CaseStatus;
  symptoms: string[];
  symptom_notes?: string;
  symptom_onset?: string;
  ecg_priority?: CasePriority;
  ai_result_summary?: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  // relations
  patient?: Patient;
  hospital?: Hospital;
  ambulance?: Ambulance;
  vitals?: Vitals[];
  ecg_records?: EcgRecord[];
  case_events?: CaseEvent[];
}

// ─── Vitals ──────────────────────────────────────────────────────────────────
export interface Vitals {
  id: string;
  case_id: string;
  heart_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  spo2?: number;
  respiratory_rate?: number;
  temperature?: number;
  ecg_heart_rate?: number;
  consciousness_level?: 'alert' | 'verbal' | 'pain' | 'unresponsive';
  is_simulated: boolean;
  recorded_at: string;
  created_at: string;
}

// ─── ECG ─────────────────────────────────────────────────────────────────────
export type EcgMode = 'digital' | 'paper_image';
export type EcgStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed' | 'incompatible';

export interface EcgRecord {
  id: string;
  case_id: string;
  mode: EcgMode;
  status: EcgStatus;
  file_url?: string;
  processed_url?: string;
  waveform_data?: number[][];
  metadata?: Record<string, unknown>;
  ai_result?: EcgAiResult;
  uploaded_at: string;
  created_at: string;
}

export interface EcgAiResult {
  id: string;
  ecg_record_id: string;
  detected_labels: DetectedLabel[];
  top_confidence: number;
  risk_level: CasePriority;
  raw_predictions: Record<string, number>;
  model_version: string;
  processing_time_ms: number;
  error_message?: string;
  created_at: string;
}

export interface DetectedLabel {
  label: string;
  friendly_name: string;
  confidence: number;
  is_abnormal: boolean;
}

// ─── Case Events ─────────────────────────────────────────────────────────────
export interface CaseEvent {
  id: string;
  case_id: string;
  event_type: string;
  description: string;
  actor_id?: string;
  actor_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─── Location ────────────────────────────────────────────────────────────────
export interface LocationUpdate {
  id: string;
  case_id: string;
  ambulance_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  eta_minutes?: number;
  distance_km?: number;
  is_simulated: boolean;
  recorded_at: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  recipient_id?: string;
  hospital_id?: string;
  case_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── Sync / Offline ──────────────────────────────────────────────────────────
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncQueueItem {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  status: SyncStatus;
  retry_count: number;
  created_at: string;
  synced_at?: string;
  error_message?: string;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  active_ambulances: number;
  incoming_cases: number;
  critical_cases: number;
  completed_cases_today: number;
  avg_notification_time_min: number;
  avg_pre_arrival_min: number;
  cases_by_priority: Record<CasePriority, number>;
  is_demo: boolean;
}
