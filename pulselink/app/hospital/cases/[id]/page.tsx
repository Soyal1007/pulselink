'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Heart, Activity, Clock, CheckCircle2,
  AlertTriangle, User, Ambulance, Thermometer, Wind,
  RefreshCw, ChevronLeft, ShieldAlert, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import EcgWaveformCanvas from '@/components/EcgWaveformCanvas';
import ClinicalSmartChat from '@/components/ClinicalSmartChat';

// Base demo case template
const BASE_DEMO_CASE = {
  id: 'case-001',
  case_ref: 'PL-20260811-CARDIAC01',
  patient: {
    name: 'Rajan Mehta',
    age: 58,
    gender: 'Male',
    blood_group: 'O+',
    allergies: 'Penicillin',
    conditions: 'Hypertension, Type 2 Diabetes',
    medications: 'Metformin, Amlodipine'
  },
  priority: 'CRITICAL',
  symptoms: ['Chest pain', 'Shortness of breath'],
  chief_complaint: 'Chest pain and shortness of breath — onset approx. 40 min ago',
  vitals: {
    heart_rate: 94,
    systolic_bp: 148,
    diastolic_bp: 94,
    spo2: 94.5,
    resp_rate: 22,
    temperature: 37.2,
    consciousness: 'alert'
  },
  ecg: {
    ai_result: 'RBBB + ST-T Changes',
    confidence: 87,
    risk: 'HIGH',
    patterns: ['Right Bundle Branch Block (RBBB)', 'ST-segment Depression']
  },
  ambulance: {
    id: 'KA-01-A-0001',
    paramedic: 'Arjun Kumar',
    eta: 8,
    distance: 6.4
  },
  status: 'hospital_notified',
  events: [
    { time: '10:21', label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
    { time: '10:22', label: 'Patient information recorded', actor: 'Arjun Kumar' },
    { time: '10:23', label: 'Vitals recorded', actor: 'System' },
    { time: '10:24', label: 'ECG uploaded and analyzed', actor: 'AI Service' },
    { time: '10:25', label: 'Hospital notified', actor: 'Arjun Kumar' },
  ],
  is_demo: true,
};

export default function CaseDetailPage() {
  const params = useParams();
  const { activeCase } = useAppStore();
  const [prepStatus, setPrepStatus] = useState<'idle' | 'preparing' | 'ready'>('idle');

  // 1. Dynamic Case Selector
  const caseId = params.id as string;
  let c = BASE_DEMO_CASE;

  if (activeCase && caseId === activeCase.id) {
    c = {
      id: activeCase.id,
      case_ref: activeCase.case_ref || (activeCase as any).case_number || 'PL-ACTIVE-CASE',
      patient: {
        name: activeCase.patient?.name || 'Rajan Mehta',
        age: activeCase.patient?.age || 58,
        gender: activeCase.patient?.gender || 'Male',
        blood_group: activeCase.patient?.blood_group || 'O+',
        allergies: activeCase.patient?.allergies || (activeCase?.patient as any)?.medical_history?.allergies?.join(', ') || 'Penicillin',
        conditions: activeCase.patient?.existing_conditions || (activeCase?.patient as any)?.medical_history?.pre_existing_conditions?.join(', ') || 'Hypertension, Type 2 Diabetes',
        medications: activeCase.patient?.current_medication || (activeCase?.patient as any)?.medical_history?.current_medications?.join(', ') || 'Aspirin, Atorvastatin',
      },
      priority: activeCase.priority || 'CRITICAL',
      symptoms: activeCase.symptoms || ['Chest pain'],
      chief_complaint: activeCase.patient?.chief_complaint || 'Active chief complaint details',
      vitals: {
        heart_rate: 94,
        systolic_bp: 148,
        diastolic_bp: 94,
        spo2: 94.5,
        resp_rate: 22,
        temperature: 37.2,
        consciousness: 'alert'
      },
      ecg: {
        ai_result: 'RBBB + ST-T Changes',
        confidence: 87,
        risk: 'HIGH',
        patterns: ['Right Bundle Branch Block (RBBB)', 'ST-segment Depression']
      },
      ambulance: {
        id: activeCase.ambulance_id || 'amb-001',
        paramedic: 'Arjun Kumar',
        eta: 8,
        distance: 6.4
      },
      status: activeCase.status || 'hospital_notified',
      events: [
        { time: '10:21', label: 'Emergency case created', actor: 'Arjun Kumar (Paramedic)' },
        { time: '10:25', label: 'Hospital notified', actor: 'Arjun Kumar' },
      ],
      is_demo: false,
    };
  } else if (caseId === 'case-002') {
    c = {
      id: 'case-002',
      case_ref: 'PL-20260811-TRAUMA01',
      patient: { name: 'Priya Sharma', age: 34, gender: 'Female', blood_group: 'A-', allergies: 'None', conditions: 'Asthma', medications: 'Albuterol' },
      priority: 'HIGH',
      symptoms: ['Trauma', 'Severe Bleeding'],
      chief_complaint: 'Trauma from motor vehicle collision. Left thigh laceration.',
      vitals: { heart_rate: 110, systolic_bp: 112, diastolic_bp: 72, spo2: 97.0, resp_rate: 24, temperature: 36.8, consciousness: 'alert' },
      ecg: { ai_result: 'Sinus Tachycardia', confidence: 95, risk: 'MEDIUM', patterns: ['Sinus Tachycardia'] },
      ambulance: { id: 'KA-01-A-0002', paramedic: 'Karan Singh', eta: 14, distance: 11.2 },
      status: 'hospital_notified',
      events: [
        { time: '10:45', label: 'Emergency case created', actor: 'Karan Singh (Paramedic)' },
        { time: '10:50', label: 'Hospital notified', actor: 'Karan Singh' },
      ],
      is_demo: true,
    };
  } else if (caseId === 'case-003') {
    c = {
      id: 'case-003',
      case_ref: 'PL-20260811-RESP01',
      patient: { name: 'Arjun Nair', age: 72, gender: 'Male', blood_group: 'AB+', allergies: 'Sulfa Drugs', conditions: 'COPD, Congestive Heart Failure', medications: 'Furosemide, Spiriva' },
      priority: 'MEDIUM',
      symptoms: ['Respiratory', 'Shortness of breath'],
      chief_complaint: 'Severe shortness of breath. History of COPD exacerbation.',
      vitals: { heart_rate: 88, systolic_bp: 135, diastolic_bp: 80, spo2: 89.0, resp_rate: 28, temperature: 37.0, consciousness: 'alert' },
      ecg: { ai_result: 'Atrial Fibrillation', confidence: 91, risk: 'MEDIUM', patterns: ['Atrial Fibrillation'] },
      ambulance: { id: 'KA-01-A-0003', paramedic: 'Nisha Pillai', eta: 22, distance: 17.5 },
      status: 'en_route',
      events: [
        { time: '11:15', label: 'Emergency case created', actor: 'Nisha Pillai (Paramedic)' },
        { time: '11:20', label: 'Hospital notified', actor: 'Nisha Pillai' },
      ],
      is_demo: true,
    };
  }

  // 2. Interactivity State (Priority & Timeline Events)
  const [priority, setPriority] = useState(c.priority);
  const [events, setEvents] = useState(c.events);

  useEffect(() => {
    setPriority(c.priority);
    setEvents(c.events);
  }, [c.id, c.priority, c.events]);

  // 3. Vitals Simulation State (ensures changes reflect live and updated)
  const [liveVitals, setLiveVitals] = useState({
    heart_rate: c.vitals.heart_rate,
    spo2: c.vitals.spo2,
    systolic_bp: c.vitals.systolic_bp,
    diastolic_bp: c.vitals.diastolic_bp,
    resp_rate: c.vitals.resp_rate,
    temperature: c.vitals.temperature,
  });

  useEffect(() => {
    setLiveVitals({
      heart_rate: c.vitals.heart_rate,
      spo2: c.vitals.spo2,
      systolic_bp: c.vitals.systolic_bp,
      diastolic_bp: c.vitals.diastolic_bp,
      resp_rate: c.vitals.resp_rate,
      temperature: c.vitals.temperature,
    });
  }, [c.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVitals((prev) => {
        const parsedSpO2 = typeof prev.spo2 === 'number' ? prev.spo2 : parseFloat(String(prev.spo2));
        const parsedTemp = typeof prev.temperature === 'number' ? prev.temperature : parseFloat(String(prev.temperature));
        
        return {
          heart_rate: Math.min(130, Math.max(55, prev.heart_rate + Math.floor(Math.random() * 5 - 2))),
          spo2: parseFloat(Math.min(100, Math.max(88, parsedSpO2 + (Math.random() * 0.4 - 0.2))).toFixed(1)),
          systolic_bp: Math.min(170, Math.max(95, prev.systolic_bp + Math.floor(Math.random() * 3 - 1))),
          diastolic_bp: Math.min(105, Math.max(55, prev.diastolic_bp + Math.floor(Math.random() * 3 - 1))),
          resp_rate: Math.min(30, Math.max(12, prev.resp_rate + Math.floor(Math.random() * 3 - 1))),
          temperature: parseFloat((parsedTemp + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        };
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, [c.id]);

  // 4. Case Event Handlers
  const handlePrepClick = () => {
    if (prepStatus === 'idle') {
      setPrepStatus('preparing');
      setTimeout(() => {
        setPrepStatus('ready');
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setEvents((prev) => [
          ...prev,
          { time: timeStr, label: 'ER Trauma Team Alerted & Prepared', actor: 'Dr. S. Sharma' }
        ]);
      }, 2000);
    }
  };

  const handleEscalate = () => {
    if (priority !== 'CRITICAL') {
      setPriority('CRITICAL');
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setEvents((prev) => [
        ...prev,
        { time: timeStr, label: 'Severity level escalated to CRITICAL', actor: 'Dr. S. Sharma (ER Physician)' }
      ]);
    } else {
      alert('Case is already marked as CRITICAL severity.');
    }
  };

  // 5. Medical Case Report Downloader
  const handleExportReport = () => {
    const reportContent = `======================================================================
                 PULSELINK EMS CLINICAL DOSSIER & TRANSIT FILE
======================================================================
Case Reference : ${c.case_ref}
Export Timestamp: ${new Date().toLocaleString()}
Case Severity  : ${priority}
Ambulance ID   : ${c.ambulance.id}
Responding PMD : ${c.ambulance.paramedic}

----------------------------------------------------------------------
1. PATIENT DEMOGRAPHICS & MEDICAL HISTORY
----------------------------------------------------------------------
Full Name      : ${c.patient.name}
Age / Gender   : ${c.patient.age} y/o / ${c.patient.gender}
Blood Group    : ${c.patient.blood_group}
Known Allergies: ${c.patient.allergies}
Chief Complaint: ${c.chief_complaint}
Pre-Existing   : ${c.patient.conditions}
Current Meds   : ${c.patient.medications}

----------------------------------------------------------------------
2. REAL-TIME VITAL TELEMETRY (SNAPSHOT AT EXPORT)
----------------------------------------------------------------------
Heart Rate     : ${liveVitals.heart_rate} bpm
O2 Saturation  : ${liveVitals.spo2}%
Blood Pressure : ${liveVitals.systolic_bp}/${liveVitals.diastolic_bp} mmHg
Resp. Rate     : ${liveVitals.resp_rate} breaths/min
Body Temp      : ${liveVitals.temperature} °C

----------------------------------------------------------------------
3. AUTOMATED ECG DIAGNOSTIC SCREENING
----------------------------------------------------------------------
AI Result      : ${c.ecg.ai_result}
Confidence     : ${c.ecg.confidence}%
Risk Rating    : ${c.ecg.risk} RISK
Detected Waves : ${c.ecg.patterns.join(', ')}

----------------------------------------------------------------------
4. TRANSIT TIMELINE & RECORDED EVENTS
----------------------------------------------------------------------
${events.map(ev => `[${ev.time}] ${ev.label} (${ev.actor})`).join('\n')}

======================================================================
               CONFIDENTIAL PATIENT DOCUMENT · PULSELINK ER
======================================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulselink_case_file_${c.case_ref}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#1f2d3d] pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/hospital/cases" className="btn-ghost p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a2332]">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white">{c.patient.name}</h1>
              <span className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase transition-colors duration-300',
                priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              )}>{priority}</span>
              {c.is_demo && <span className="rounded-full bg-[#111827] border border-slate-700 text-[10px] font-bold text-slate-400 px-2 py-0.5">DEMO</span>}
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Case ID: {c.case_ref}</p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportReport}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 transition shadow-sm border border-blue-500/30"
          title="Download Medical Case Summary"
        >
          <Download className="h-4 w-4" />
          Export Case File
        </button>
      </div>

      {/* Grid: Columns 1-8 for Telemetry Dossiers | Columns 9-12 for Live Chat */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start w-full">
        
        {/* LEFT COMPARTMENT: Case Detail Cards (8 columns) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Grid for Patient info & Ambulance info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Card 1: Patient Information */}
            <div className="card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl">
              <h3 className="mb-4 flex items-center gap-2 font-black text-white text-xs tracking-wider uppercase">
                <User className="h-4 w-4 text-blue-400" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Age</p>
                  <p className="font-semibold text-white">{c.patient.age} y/o</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Gender</p>
                  <p className="font-semibold text-white">{c.patient.gender}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Blood Group</p>
                  <p className="font-semibold text-white">{c.patient.blood_group}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Known Allergies</p>
                  <p className="font-semibold text-red-400">{c.patient.allergies}</p>
                </div>
                <div className="col-span-2 border-t border-[#1f2d3d] pt-2">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Chief Complaint</p>
                  <p className="font-medium text-slate-200 mt-0.5 leading-tight">{c.chief_complaint}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Pre-Existing Conditions</p>
                  <p className="font-medium text-slate-300 mt-0.5 leading-tight">{c.patient.conditions}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Current Medications</p>
                  <p className="font-medium text-slate-300 mt-0.5 leading-tight">{c.patient.medications}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Ambulance Info */}
            <div className="card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-black text-white text-xs tracking-wider uppercase">
                  <Ambulance className="h-4 w-4 text-green-400" />
                  Transit Ambulance
                </h3>
                <div className="text-center mb-4 bg-[#0d1117] py-3 rounded-xl border border-[#1f2d3d]">
                  <p className="text-3xl font-black text-blue-400">{c.ambulance.eta} <span className="text-sm font-bold text-slate-500">mins</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">Estimated Arrival (ETA)</p>
                  <p className="text-[10px] text-slate-500">{c.ambulance.distance} km remaining</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 border-t border-[#1f2d3d] pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Unit ID</span>
                  <span className="font-mono text-white">{c.ambulance.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Responding Paramedic</span>
                  <span className="text-white font-semibold">{c.ambulance.paramedic}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 3: Live Vitals Dashboard */}
          <div className="card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#1f2d3d] pb-3 mb-4">
              <h3 className="flex items-center gap-2 font-black text-white text-xs tracking-wider uppercase">
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                Live Telemetry Ribbon
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                STREAMING
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Heart Rate', value: liveVitals.heart_rate, unit: 'bpm', color: 'text-red-400', warn: liveVitals.heart_rate > 100 },
                { label: 'SpO2', value: liveVitals.spo2, unit: '%', color: 'text-blue-400', warn: liveVitals.spo2 < 93 },
                { label: 'Resp. Rate', value: liveVitals.resp_rate, unit: '/m', color: 'text-cyan-400', warn: false },
                { label: 'Systolic BP', value: liveVitals.systolic_bp, unit: 'mmHg', color: 'text-purple-400', warn: liveVitals.systolic_bp > 140 },
                { label: 'Diastolic BP', value: liveVitals.diastolic_bp, unit: 'mmHg', color: 'text-purple-300', warn: false },
                { label: 'Temperature', value: liveVitals.temperature, unit: '°C', color: 'text-yellow-400', warn: false },
              ].map(({ label, value, unit, color, warn }) => (
                <div key={label} className={cn(
                  'rounded-xl p-3 flex flex-col justify-between border transition-all duration-300',
                  warn ? 'border-red-500/30 bg-red-950/20 shadow-xs' : 'bg-[#0d1117] border-[#1f2d3d]'
                )}>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
                  <p className={cn('text-lg font-black mt-2', color)}>
                    {value} <span className="text-[10px] font-bold text-slate-500">{unit}</span>
                  </p>
                  {warn && <p className="text-[9px] text-red-400 font-semibold mt-1">▲ Abnormal</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: AI ECG screening & ECG waveform canvas */}
          <div className="card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl">
            <h3 className="mb-4 flex items-center gap-2 font-black text-white text-xs tracking-wider uppercase">
              <Activity className="h-4 w-4 text-orange-400" />
              Automated AI ECG Screening
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 rounded-xl overflow-hidden bg-slate-950 p-1.5 border border-[#1f2d3d]">
                <EcgWaveformCanvas heartRate={liveVitals.heart_rate} pattern={c.ecg.ai_result.includes('RBBB') ? 'RBBB' : 'NORM'} height={120} interactive={false} />
              </div>
              
              <div className="md:col-span-5 space-y-3 bg-[#0d1117] border border-[#1f2d3d] p-4 rounded-xl">
                <div className="flex items-center justify-between border-b border-[#1f2d3d] pb-2">
                  <span className="rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 px-2 py-0.5">
                    {c.ecg.risk} RISK
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Confidence: {c.ecg.confidence}%</span>
                </div>
                <div className="space-y-1.5">
                  {c.ecg.patterns.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-slate-500 italic leading-tight pt-1">
                  AI screening output is an auxiliary warning and does not substitute professional diagnostic consensus.
                </p>
              </div>
            </div>
          </div>

          {/* Action Row & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Preparedness Actions */}
            <div className="md:col-span-5 card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl flex flex-col justify-between">
              <h3 className="mb-4 font-black text-white text-xs tracking-wider uppercase"> Preparedness Commands</h3>
              <div className="space-y-2">
                <button
                  onClick={handlePrepClick}
                  disabled={prepStatus === 'ready'}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition shadow-sm',
                    prepStatus === 'idle' && 'bg-blue-600 hover:bg-blue-700 text-white',
                    prepStatus === 'preparing' && 'bg-amber-600/30 border border-amber-500/40 text-amber-300 animate-pulse cursor-wait',
                    prepStatus === 'ready' && 'bg-emerald-600 text-white'
                  )}
                >
                  {prepStatus === 'idle' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Acknowledge Case
                    </>
                  )}
                  {prepStatus === 'preparing' && (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing ER Staff...
                    </>
                  )}
                  {prepStatus === 'ready' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      ER Staff Ready & Assigned
                    </>
                  )}
                </button>

                <button
                  onClick={handleEscalate}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-950 bg-red-950/20 py-3 text-xs font-black text-red-400 hover:bg-red-900/30 transition"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Escalate Case Severity
                </button>
              </div>
            </div>

            {/* Case Timeline */}
            <div className="md:col-span-7 card p-5 bg-[#111827] border border-[#1f2d3d] rounded-2xl">
              <h3 className="mb-4 flex items-center gap-2 font-black text-white text-xs tracking-wider uppercase">
                <Clock className="h-4 w-4 text-blue-400" />
                Case Timeline
              </h3>
              <div className="relative space-y-4 pl-5">
                {events.map((ev, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-[#111827]" />
                    {i < events.length - 1 && (
                      <div className="absolute -left-[16px] top-3 h-full w-0.5 bg-[#1f2d3d]" />
                    )}
                    <p className="text-xs font-bold text-white">{ev.label}</p>
                    <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5 font-semibold">
                      <span className="font-mono">{ev.time}</span>
                      <span>·</span>
                      <span>{ev.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPARTMENT: Doctor Chat Client (4 columns) */}
        <div className="lg:col-span-4">
          <ClinicalSmartChat
            currentUserRole="doctor"
            currentUserName="Dr. S. Sharma"
            hospitalName="City General ER"
            caseId={c.id}
            patientName={c.patient.name}
            className="h-[840px] shadow-lg border border-[#1f2d3d]"
          />
        </div>

      </div>
    </div>
  );
}
