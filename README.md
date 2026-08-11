# 🚑 PulseLink — Smart Ambulance Platform

> **"From Ambulance to Emergency Room — Before the Patient Arrives."**

PulseLink is a hackathon MVP that digitally connects ambulances, paramedics,
AI-assisted ECG screening, and hospital emergency departments in real time.

---

## 🏆 Core USP

**THE AMBULANCE IS AN EXTENSION OF THE EMERGENCY ROOM.**

Instead of hospitals learning about patients when the ambulance *arrives*,
PulseLink lets them start *preparing* while the ambulance is still on the road.

---

## Medical Disclaimer

PulseLink is a prototype clinical decision-support system.
- AI ECG outputs are **screening results — NOT medical diagnoses**
- This system does **not replace** qualified healthcare professionals
- Final clinical interpretation must be performed by licensed professionals
- This prototype has **not** been clinically validated or regulatory approved
- All demo data is **fully synthetic** — no real patient information is used

---

## Architecture

```
MOBILE PHONE (Paramedic)
       |
       v
 Ambulance PWA (Next.js / React)
       |
       v
   Supabase
   +-- PostgreSQL
   +-- Realtime
   +-- Auth
   +-- Storage
       |
  +----+-----+
  v          v
Python AI   Hospital Dashboard
FastAPI     (Next.js / React)
ONNX Runtime
```

---

## Technology Stack

- Frontend: Next.js 16 + React + TypeScript + Tailwind CSS v4
- PWA: Service Worker + IndexedDB offline storage
- Backend: Supabase (PostgreSQL + Realtime + Auth + Storage)
- AI Service: Python + FastAPI + ONNX Runtime + NumPy + OpenCV
- AI Model: adzetto/ecg-arrhythmia-classifier (DS-CNN 12-lead)
- Maps: Mapbox (abstracted)
- State: Zustand

---

## Quick Start

### 1. Install dependencies
```bash
cd pulselink
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run the frontend
```bash
npm run dev
# http://localhost:3000
```

### 4. Run the AI service (optional)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# http://localhost:8000
```

---

## Supabase Setup

1. Create a project at supabase.com
2. Run: supabase/migrations/001_initial_schema.sql
3. Run: supabase/seed/demo_data.sql
4. Create demo user accounts via Supabase Auth Dashboard
5. Copy URL and anon key to .env.local

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=
```

---

## AI Model Setup

Model: adzetto/ecg-arrhythmia-classifier
HuggingFace: https://huggingface.co/adzetto/ecg-arrhythmia-classifier

```bash
cd ai-service
mkdir models
# Download ecg_model.onnx from HuggingFace and place in models/
```

Without the model file: AI service runs in demo fallback mode.

ECG Input Format:
- Digital ECG: CSV or JSON, shape (12 x 2500), 12-lead, 10s, 250 Hz
- Paper ECG: JPEG/PNG image

---

## Demo Accounts

Connect Supabase and create these users in Auth Dashboard:

| Role | Email | Password |
|------|-------|----------|
| Paramedic | paramedic@demo.pulselink | Demo@1234 |
| Doctor | doctor@demo.pulselink | Demo@1234 |
| Hospital Admin | admin@demo.pulselink | Demo@1234 |
| Super Admin | superadmin@demo.pulselink | Demo@1234 |

Without Supabase: Use demo navigation links on the login page.

---

## Demo Workflow

1. Open /paramedic - Enable Demo Mode
2. Select ambulance - Start Emergency Case
3. Fill patient info (pre-filled in demo)
4. Select symptoms - Enter vitals
5. Go to ECG - Run Demo ECG Analysis
6. View AI result (RBBB + ST-T Changes, 87% confidence, HIGH priority)
7. Notify Hospital
8. Switch to /hospital - see NEW EMERGENCY alert
9. Acknowledge - Prepare for Arrival
10. Go to Tracking - Start ambulance simulation
11. ETA counts down in real time
12. Demo offline: Simulate Offline - enter data - Restore Network - auto-sync

---

## Features

| Feature | Status |
|---------|--------|
| Landing page | Working |
| Paramedic mobile PWA | Working |
| 4-step emergency case creation | Working |
| Vital monitoring + simulation | Working |
| ECG upload and AI screening | Working |
| AI risk engine (rule-based) | Working |
| Hospital dashboard | Working |
| Incoming emergencies board | Working |
| Case detail view | Working |
| Acknowledge and Prepare actions | Working |
| ETA countdown | Working |
| Ambulance GPS simulation | Working |
| Offline network simulation | Working |
| Analytics dashboard | Working |
| Case timeline | Working |
| Auth login page | UI Ready |
| Supabase integration | Requires config |
| Real-time sync | Requires Supabase config |
| Real ONNX inference | Requires model file |
| Mapbox live map | Requires API key |

---

## Known Limitations

1. Supabase required for real auth, real-time sync, and ECG storage
2. ONNX model must be downloaded manually from HuggingFace
3. GPS uses simulation
4. Mapbox map is a placeholder without API key
5. Offline IndexedDB full persistence requires service worker setup
6. Paper ECG digitization returns honest error message when extraction fails

---

## Recommended Next Steps

1. Set up Supabase project and run migrations
2. Download ONNX model from HuggingFace
3. Add Mapbox token for live map
4. Implement service worker for full PWA offline support
5. Build Supabase Realtime subscriptions
6. Add push notification support (FCM)
7. Refine paper ECG digitization pipeline
8. Expand to Flutter/native Android with the same API backend
