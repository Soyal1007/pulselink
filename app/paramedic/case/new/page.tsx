'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, User, Stethoscope, FileText, Activity,
  CheckCircle2, AlertTriangle, ShieldCheck, Heart, ShieldAlert
} from 'lucide-react';
import { useCaseStore, type LiveCase, type CaseVitals, type CasePatient } from '@/store/caseStore';
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

const SYMPTOM_LABELS: Record<string, string> = {};
SYMPTOMS.forEach((s) => { SYMPTOM_LABELS[s.id] = s.label; });

const PRIORITIES: { value: CasePriority; label: string; color: string; desc: string }[] = [
  { value: 'CRITICAL', label: 'CRITICAL', color: 'border-red-600 bg-red-600 text-white', desc: 'Immediate life-threatening (STEMI, cardiac arrest, major trauma)' },
  { value: 'HIGH', label: 'HIGH', color: 'border-amber-600 bg-amber-600 text-white', desc: 'Urgent intervention needed within minutes' },
  { value: 'MEDIUM', label: 'MEDIUM', color: 'border-yellow-500 bg-yellow-500 text-white', desc: 'Significant but stable (moderate injury, acute illness)' },
  { value: 'LOW', label: 'LOW', color: 'border-emerald-600 bg-emerald-600 text-white', desc: 'Non-urgent, standard transport and evaluation' },
];

export default function NewCasePage() {
  const router = useRouter();
  const { addCase } = useCaseStore();
  const [step, setStep] = useState(1);

  // Step 1: Patient Info
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<GenderOption>('unknown');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Symptoms + Priority
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomOnset, setSymptomOnset] = useState('');
  const [symptomDetails, setSymptomDetails] = useState('');
  const [priority, setPriority] = useState<CasePriority>('HIGH');

  // Step 3: Medical History
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [preExistingConditions, setPreExistingConditions] = useState('');

  // Step 4: Vitals & ECG
  const [heartRate, setHeartRate] = useState(80);
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [respRate, setRespRate] = useState(18);
  const [temperature, setTemperature] = useState(37.0);
  const [ecgPattern, setEcgPattern] = useState<EcgConditionPattern>('NORM');

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSubmit() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const caseNum = Math.floor(100 + Math.random() * 900);
    const caseId = `case-${Date.now()}`;

    const newCase: LiveCase = {
      id: caseId,
      case_ref: `PL-${dateStr}-${caseNum}`,
      priority,
      status: 'hospital_notified',
      patient: {
        name: patientName || 'Unidentified Patient',
        age: parseInt(age) || 0,
        gender: gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : gender === 'other' ? 'Other' : 'Unknown',
        blood_group: bloodGroup,
        phone: phone || 'N/A',
        chief_complaint: chiefComplaint || 'No complaint recorded',
        allergies: allergies || 'None known',
        medications: medications || 'None',
        conditions: preExistingConditions || 'None',
      },
      vitals: {
        heart_rate: heartRate,
        spo2,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        resp_rate: respRate,
        temperature,
      },
      symptoms: selectedSymptoms.map((s) => SYMPTOM_LABELS[s] || s),
      symptom_onset: symptomOnset || 'Unknown',
      symptom_notes: symptomDetails || '',
      ecg_pattern: ecgPattern,
      ambulance_id: 'KA-01-A-0001',
      paramedic: 'Arjun Kumar',
      eta_min: Math.floor(5 + Math.random() * 20),
      distance_km: parseFloat((2 + Math.random() * 12).toFixed(1)),
      events: [
        { time: timeStr, label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
        { time: timeStr, label: 'Patient information recorded', actor: 'Arjun Kumar' },
        { time: timeStr, label: 'Vitals recorded & ECG pattern set', actor: 'System' },
        { time: timeStr, label: 'Hospital notified — case transmitted', actor: 'System' },
      ],
      acknowledged: false,
      preparing: false,
      created_at: now.toISOString(),
    };

    addCase(newCase);
    router.push('/paramedic');
  }

  const TOTAL_STEPS = 4;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.push('/paramedic'))}
          className="flex items-center gap-2 text-sm font-black text-slate-800 hover:text-blue-600 transition"
        >
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900">New Emergency Patient Case</h1>
          <p className="text-xs font-bold text-slate-600">
            Step {step} of {TOTAL_STEPS} — {
              step === 1 ? 'Patient Demographics' :
              step === 2 ? 'Symptoms & Priority' :
              step === 3 ? 'Medical History' :
              'Vitals & ECG Telemetry'
            }
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">Step {step}/{TOTAL_STEPS}</span>
      </div>

      {/* Progress Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn('h-2.5 rounded-full transition-all duration-300', step >= i ? 'bg-blue-600' : 'bg-slate-200')}
          />
        ))}
      </div>

      {/* Form Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        {/* STEP 1: Demographics */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Patient Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Full Name</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g. Rajan Mehta or Unknown"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 58"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Blood Group</label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition">
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Gender</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['male', 'female', 'other', 'unknown'] as GenderOption[]).map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={cn('rounded-xl border py-3 text-xs font-extrabold capitalize transition',
                        gender === g ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100')}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Phone / Emergency Contact</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Chief Complaint</label>
                <input type="text" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} placeholder="e.g. Severe crushing chest pain, difficulty breathing..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Symptoms + Priority Level */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" /> Clinical Symptoms & Triage Priority
            </h2>

            {/* PRIORITY SELECTOR */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-red-700">
                ⚠ Triage Priority Level (Required)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition',
                      priority === p.value
                        ? p.color + ' shadow-md'
                        : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    )}
                  >
                    <p className="text-sm font-black">{p.label}</p>
                    <p className={cn('text-[10px] font-semibold mt-0.5', priority === p.value ? 'text-white/80' : 'text-slate-500')}>
                      {p.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {SYMPTOMS.map((s) => {
                const isSel = selectedSymptoms.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleSymptom(s.id)}
                    className={cn('flex items-center gap-3 rounded-xl border p-4 text-left text-xs font-extrabold transition',
                      isSel ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100')}>
                    <span className="text-xl">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Symptom Onset</label>
                <input type="text" value={symptomOnset} onChange={(e) => setSymptomOnset(e.target.value)} placeholder="e.g. 30 minutes ago"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Additional Details</label>
                <input type="text" value={symptomDetails} onChange={(e) => setSymptomDetails(e.target.value)} placeholder="Clinical observations..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Medical History */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Medical History & Conditions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Known Drug Allergies</label>
                <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Sulfa drugs"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Current Medications</label>
                <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g. Aspirin, Metoprolol"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">Pre-Existing Conditions</label>
                <input type="text" value={preExistingConditions} onChange={(e) => setPreExistingConditions(e.target.value)} placeholder="e.g. Hypertension, Diabetes"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Vitals & ECG */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" /> Vital Signs & ECG Pattern
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Heart Rate (bpm)', value: heartRate, set: (v: string) => setHeartRate(parseInt(v) || 0) },
                { label: 'SpO2 (%)', value: spo2, set: (v: string) => setSpo2(parseFloat(v) || 0) },
                { label: 'Systolic BP (mmHg)', value: systolicBp, set: (v: string) => setSystolicBp(parseInt(v) || 0) },
                { label: 'Diastolic BP (mmHg)', value: diastolicBp, set: (v: string) => setDiastolicBp(parseInt(v) || 0) },
                { label: 'Resp Rate (/min)', value: respRate, set: (v: string) => setRespRate(parseInt(v) || 0) },
                { label: 'Temperature (°C)', value: temperature, set: (v: string) => setTemperature(parseFloat(v) || 0) },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">{field.label}</label>
                  <input type="number" value={field.value} onChange={(e) => field.set(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white" />
                </div>
              ))}
            </div>

            {/* ECG Pattern Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Select Observed ECG Rhythm Pattern
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'NORM', label: 'Normal Sinus Rhythm' },
                  { id: 'RBBB', label: 'Right Bundle Branch Block' },
                  { id: 'AF', label: 'Atrial Fibrillation' },
                  { id: 'STD', label: 'ST-Segment Depression' },
                  { id: 'STE', label: 'Acute STEMI Elevation' },
                  { id: 'VT', label: 'Ventricular Tachycardia' },
                ].map((p) => (
                  <button key={p.id} type="button" onClick={() => setEcgPattern(p.id as EcgConditionPattern)}
                    className={cn('rounded-xl border p-3 text-left text-xs font-extrabold transition',
                      ecgPattern === p.id ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100')}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs font-extrabold uppercase text-slate-500 mb-1">Live Waveform Preview</p>
                <EcgWaveformCanvas heartRate={heartRate} pattern={ecgPattern} height={180} interactive={false} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-xs font-black text-slate-800 hover:bg-slate-100 transition">
              Previous Step
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-xs font-black text-white hover:bg-blue-700 transition shadow-sm">
              Continue to Step {step + 1}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-10 py-3.5 text-sm font-black text-white hover:bg-red-700 transition shadow-md">
              <CheckCircle2 className="h-5 w-5" />
              CREATE & TRANSMIT CASE TO HOSPITAL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
