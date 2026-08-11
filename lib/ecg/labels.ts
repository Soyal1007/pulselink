/**
 * ECG Label Mapping
 * Maps model output codes to human-friendly names.
 * All outputs labeled as "screening" — NOT diagnosis.
 */

export const ECG_LABEL_MAP: Record<string, { friendly: string; isAbnormal: boolean }> = {
  NORM: { friendly: 'Normal sinus rhythm', isAbnormal: false },
  AF: { friendly: 'Atrial Fibrillation (AF)', isAbnormal: true },
  I_AVB: { friendly: '1st Degree AV Block', isAbnormal: true },
  LBBB: { friendly: 'Left Bundle Branch Block (LBBB)', isAbnormal: true },
  RBBB: { friendly: 'Right Bundle Branch Block (RBBB)', isAbnormal: true },
  PAC: { friendly: 'Premature Atrial Contraction (PAC)', isAbnormal: true },
  PVC: { friendly: 'Premature Ventricular Contraction (PVC)', isAbnormal: true },
  STD: { friendly: 'ST-segment Depression', isAbnormal: true },
  STE: { friendly: 'ST-segment Elevation', isAbnormal: true },
  VT: { friendly: 'Ventricular Tachycardia (VT)', isAbnormal: true },
  VF: { friendly: 'Ventricular Fibrillation (VF)', isAbnormal: true },
  SVPB: { friendly: 'Supraventricular Premature Beat', isAbnormal: true },
  WPW: { friendly: 'Wolff-Parkinson-White (WPW)', isAbnormal: true },
  STTC: { friendly: 'ST-T Change', isAbnormal: true },
  LVH: { friendly: 'Left Ventricular Hypertrophy', isAbnormal: true },
  LAD: { friendly: 'Left Axis Deviation', isAbnormal: true },
  RAD: { friendly: 'Right Axis Deviation', isAbnormal: true },
  PR: { friendly: 'Prolonged PR Interval', isAbnormal: true },
  LQRS: { friendly: 'Low QRS Voltage', isAbnormal: true },
  QTC: { friendly: 'Prolonged QTc Interval', isAbnormal: true },
};

export function mapLabel(code: string): { friendly: string; isAbnormal: boolean } {
  return ECG_LABEL_MAP[code] ?? { friendly: code, isAbnormal: true };
}

/**
 * AI Risk Engine — rule-based priority from ECG + vitals + symptoms.
 * This is PROTOTYPE EMERGENCY PRIORITIZATION — NOT a medical diagnosis.
 */
export function calculateRiskLevel(params: {
  ecgAbnormal: boolean;
  ecgConfidence: number;
  heartRate?: number;
  spo2?: number;
  systolicBp?: number;
  symptoms: string[];
  consciousnessLevel?: string;
}): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  let score = 0;

  const { ecgAbnormal, ecgConfidence, heartRate, spo2, systolicBp, symptoms, consciousnessLevel } = params;

  // ECG
  if (ecgAbnormal && ecgConfidence > 0.8) score += 3;
  else if (ecgAbnormal && ecgConfidence > 0.5) score += 2;
  else if (ecgAbnormal) score += 1;

  // Heart rate
  if (heartRate !== undefined) {
    if (heartRate > 150 || heartRate < 40) score += 3;
    else if (heartRate > 120 || heartRate < 50) score += 2;
    else if (heartRate > 100 || heartRate < 60) score += 1;
  }

  // SpO2
  if (spo2 !== undefined) {
    if (spo2 < 85) score += 4;
    else if (spo2 < 90) score += 3;
    else if (spo2 < 94) score += 1;
  }

  // Blood pressure
  if (systolicBp !== undefined) {
    if (systolicBp > 200 || systolicBp < 70) score += 3;
    else if (systolicBp > 170 || systolicBp < 90) score += 1;
  }

  // Consciousness
  if (consciousnessLevel === 'unresponsive') score += 5;
  else if (consciousnessLevel === 'pain') score += 3;
  else if (consciousnessLevel === 'verbal') score += 1;

  // Symptoms
  const criticalSymptoms = ['chest pain', 'loss of consciousness', 'seizure', 'severe bleeding'];
  const highSymptoms = ['shortness of breath', 'dizziness', 'weakness'];
  const lowerSymps = symptoms.map((s) => s.toLowerCase());
  if (criticalSymptoms.some((s) => lowerSymps.some((ls) => ls.includes(s)))) score += 2;
  if (highSymptoms.some((s) => lowerSymps.some((ls) => ls.includes(s)))) score += 1;

  if (score >= 8) return 'CRITICAL';
  if (score >= 5) return 'HIGH';
  if (score >= 2) return 'MEDIUM';
  return 'LOW';
}

export const RISK_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-950/50 border-red-800',
  HIGH: 'text-orange-400 bg-orange-950/50 border-orange-800',
  MEDIUM: 'text-yellow-400 bg-yellow-950/50 border-yellow-800',
  LOW: 'text-green-400 bg-green-950/50 border-green-800',
};

export const RISK_BADGE: Record<string, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-black',
  LOW: 'bg-green-600 text-white',
};
