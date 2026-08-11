'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, User, Stethoscope, FileText, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, Heart
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { CasePriority } from '@/types';
import EcgWaveformCanvas, { EcgConditionPattern } from '@/components/EcgWaveformCanvas';

type GenderOption = 'male' | 'female' | 'other' | 'unknown';

const SYMPTOMS = [
  { id: 'chest_pain', label: 'Chest Pain', icon: '🫀' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', icon: '🫁' },
  { id: 'loss_of_consciousness', label: 'Loss of Consciousness', icon: '🧠' },
  { id: 'dizziness', label: 'Dizziness / Syncope', icon: '💫' },
  { id: 'severe_bleeding', label: 'Severe Bleeding', icon: '🩸' },
  { id: 'weakness', label: 'Acute Weakness', icon: '⚠️' },
  { id: 'seizure', label: 'Seizure Activity', icon: '⚡' },
  { id: 'trauma', label: 'Physical Trauma', icon: '🩹' },
  { id: 'fever', label: 'High Fever', icon: '🌡️' },
  { id: 'palpitations', label: 'Heart Palpitations', icon: '💓' },
  { id: 'nausea_vomiting', label: 'Nausea / Vomiting', icon: '🤢' },
];

export default function NewCasePage() {
  const router = useRouter();
  const { setActiveCase, selectedAmbulance } = useAppStore();
  const [step, setStep] = useState(1);

  // Step 1: Info
  const [patientName, setPatientName] = useState('Rajan Mehta');
  const [age, setAge] = useState('58');
  const [gender, setGender] = useState<GenderOption>('male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [chiefComplaint, setChiefComplaint] = useState('Acute substernal chest pain & shortness of breath');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Step 2: Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['chest_pain', 'shortness_of_breath']);
  const [symptomOnset, setSymptomOnset] = useState('30 minutes ago');
  const [symptomDetails, setSymptomDetails] = useState('Crushing pain radiating to left arm with cold sweats.');

  // Step 3: Medical History
  const [allergies, setAllergies] = useState('Penicillin');
  const [medications, setMedications] = useState('Aspirin, Atorvastatin');
  const [preExistingConditions, setPreExistingConditions] = useState('Hypertension, Type 2 Diabetes');

  // Step 4: Initial Vitals & ECG Pattern selection
  const [heartRate, setHeartRate] = useState(94);
  const [systolicBp, setSystolicBp] = useState(148);
  const [diastolicBp, setDiastolicBp] = useState(92);
  const [spo2, setSpo2] = useState(94.5);
  const [respRate, setRespRate] = useState(22);
  const [ecgPattern, setEcgPattern] = useState<EcgConditionPattern>('RBBB');

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSubmit() {
    const priority: CasePriority =
      selectedSymptoms.includes('chest_pain') || selectedSymptoms.includes('severe_bleeding')
        ? 'CRITICAL'
        : 'HIGH';

    const newCase = {
      id: `case-${Date.now()}`,
      case_number: `PL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'hospital_notified' as const,
      priority,
      ambulance_id: selectedAmbulance?.id || 'amb-001',
      hospital_id: 'hosp-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: `pat-${Date.now()}`,
        name: patientName || 'Unidentified Patient',
        age: parseInt(age) || 45,
        gender,
        blood_group: bloodGroup,
        chief_complaint: chiefComplaint,
        phone,
        medical_history: {
          allergies: allergies.split(',').map((x) => x.trim()),
          current_medications: medications.split(',').map((x) => x.trim()),
          pre_existing_conditions: preExistingConditions.split(',').map((x) => x.trim()),
        },
      },
      symptoms: selectedSymptoms,
    };

    setActiveCase(newCase as any);
    router.push('/paramedic');
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Step Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.push('/paramedic'))}
          className="flex items-center gap-2 text-sm font-black text-slate-800 hover:text-blue-600 transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900">New Emergency Patient Registration</h1>
          <p className="text-xs font-bold text-slate-600">Step {step} of 4 — {step === 1 ? 'Patient Demographics' : step === 2 ? 'Clinical Symptoms' : step === 3 ? 'Medical History' : 'Vital Signs & Telemetry'}</p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">Step {step}/4</span>
      </div>

      {/* Clean 4-Step Progress Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300',
              step >= i ? 'bg-blue-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      {/* Form Content Cards */}
      <div className="pro-card p-8 bg-white shadow-sm space-y-6">
        {/* STEP 1: DEMOGRAPHICS */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Patient Identification & Demographics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rajan Mehta or Unknown"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 58"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Gender</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['male', 'female', 'other', 'unknown'] as GenderOption[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={cn(
                        'rounded-xl border py-3 text-xs font-extrabold capitalize transition',
                        gender === g
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Phone / Family Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Chief Complaint (Primary Reason)</label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Severe crushing chest pain, dyspnea..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SYMPTOMS */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Observed Clinical Symptoms & Onset
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SYMPTOMS.map((s) => {
                const isSel = selectedSymptoms.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSymptom(s.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4 text-left text-xs font-extrabold transition',
                      isSel
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    )}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Symptom Onset Time</label>
                <input
                  type="text"
                  value={symptomOnset}
                  onChange={(e) => setSymptomOnset(e.target.value)}
                  placeholder="e.g. 30 minutes ago"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Additional Clinical Observations</label>
                <input
                  type="text"
                  value={symptomDetails}
                  onChange={(e) => setSymptomDetails(e.target.value)}
                  placeholder="Details..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MEDICAL HISTORY */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Patient Medical History & Known Conditions
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Known Drug Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Current Active Medications</label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g. Aspirin, Metoprolol, Insulin"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Pre-Existing Medical Conditions</label>
                <input
                  type="text"
                  value={preExistingConditions}
                  onChange={(e) => setPreExistingConditions(e.target.value)}
                  placeholder="e.g. Hypertension, CAD, Diabetes"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INITIAL VITALS & ECG TELEMETRY PATTERN */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Initial Vitals Telemetry & ECG Condition Selection
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value) || 75)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(parseFloat(e.target.value) || 98)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Systolic BP</label>
                <input
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(parseInt(e.target.value) || 120)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Diastolic BP</label>
                <input
                  type="number"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(parseInt(e.target.value) || 80)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Dynamic ECG Condition Pattern Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Select Observed Patient ECG Condition Pattern
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'NORM', label: 'Normal Sinus Rhythm' },
                  { id: 'RBBB', label: 'Right Bundle Branch Block (RBBB)' },
                  { id: 'AF', label: 'Atrial Fibrillation (AFib)' },
                  { id: 'STD', label: 'ST-Segment Depression' },
                  { id: 'STE', label: 'Acute STEMI Elevation' },
                  { id: 'VT', label: 'Ventricular Tachycardia (VT)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEcgPattern(p.id as EcgConditionPattern)}
                    className={cn(
                      'rounded-xl border p-3 text-left text-xs font-extrabold transition',
                      ecgPattern === p.id
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Live Preview of Selected Condition Pattern */}
              <div className="mt-4">
                <p className="text-xs font-extrabold uppercase text-slate-500 mb-1">Live Waveform Preview for Selected Condition</p>
                <EcgWaveformCanvas heartRate={heartRate} pattern={ecgPattern} height={180} interactive={false} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-xs font-black text-slate-800 hover:bg-slate-100 transition"
            >
              Previous Step
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm"
            >
              Continue to Step {step + 1}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-10 py-3.5 text-sm font-black text-white hover:bg-red-700 transition shadow-md"
            >
              <CheckCircle2 className="h-5 w-5" />
              CREATE & TRANSMIT CASE TO HOSPITAL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
