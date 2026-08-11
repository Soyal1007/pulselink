You are a senior full-stack architect, Next.js/React engineer, backend engineer, AI/ML engineer, computer-vision engineer, UI/UX designer, database architect, and healthcare technology product engineer.

BUILD a complete working hackathon MVP called:

============================================================
PROJECT
============================================================

PULSELINK

Tagline:
"From Ambulance to Emergency Room — Before the Patient Arrives."

Core concept:

PulseLink is a smart ambulance platform that digitally connects ambulances, paramedics, AI-assisted ECG screening, and hospital emergency departments.

The system allows paramedics to capture patient information, vitals, ECG data, symptoms, and ambulance location while transporting a patient.

The receiving hospital gets the information BEFORE the ambulance arrives so that doctors and emergency teams can prepare in advance.

IMPORTANT:
This is a healthcare technology prototype and clinical decision-support system.

Do NOT present the AI as a doctor.
Do NOT claim that the AI definitively diagnoses heart attacks.
Do NOT fabricate medical accuracy statistics.
All AI outputs must be described as screening/decision support requiring qualified clinical review.

============================================================
1. CORE PROBLEM
============================================================

Many ambulances, especially in Tier-2 and Tier-3 regions, still rely on:

- paper patient records
- manual communication
- paper ECG printouts
- phone calls
- disconnected monitoring devices

As a result, hospitals may receive little or no structured clinical information before the patient arrives.

This can cause:

- treatment delays
- poor emergency preparedness
- repeated patient assessment
- delayed ECG review
- communication gaps
- loss of important clinical information

PulseLink solves this by creating a digital communication bridge:

PATIENT
↓
PARAMEDIC
↓
SMART AMBULANCE SYSTEM
↓
REAL-TIME BACKEND
↓
AI ECG SCREENING
↓
HOSPITAL EMERGENCY DEPARTMENT

============================================================
2. HOW MIGHT WE
============================================================

How might we develop an affordable smart ambulance platform that captures patient vital signs, assists with ECG interpretation, securely shares clinical information with hospitals in real time, and enables emergency departments to prepare before the patient arrives?

============================================================
3. MAIN USP
============================================================

The main USP is:

"TURN THE AMBULANCE INTO A DIGITAL EXTENSION OF THE EMERGENCY ROOM."

The system should allow the hospital to know:

- WHO is coming
- WHAT happened
- HOW CRITICAL the patient may be
- WHAT the current vitals are
- WHAT the ECG screening indicates
- WHERE the ambulance is
- WHEN the patient is expected to arrive

before the patient reaches the hospital.

The USP is NOT simply AI.

The USP is the complete:

AMBULANCE → AI → HOSPITAL PREPARATION

workflow.

Create a dedicated USP section in the application:

"THE AMBULANCE IS NOW AN EXTENSION OF THE ER"

Display:

❤️ Live Vitals
📈 ECG Screening
🤖 AI Assistance
📍 Live Location
⏱ ETA
📡 Offline Sync
🏥 Hospital Preparation

Subtitle:

"Give the hospital the information it needs before the patient arrives."

============================================================
4. PLATFORM DECISION
============================================================

DO NOT USE FLUTTER.

DO NOT USE DART.

DO NOT BUILD A NATIVE ANDROID APPLICATION AT THIS stage.

The ambulance application must be a:

RESPONSIVE NEXT.JS MOBILE-FIRST PWA.

It must work through a smartphone browser and be installable as a PWA later.

The hospital dashboard must also use Next.js.

Use a single Next.js application with role-based interfaces unless there is a strong architectural reason to separate them.

============================================================
5. TECHNOLOGY STACK
============================================================

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or another clean component system
- PWA support
- Service Worker
- IndexedDB/local storage for offline operation

Backend:

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Realtime
- Supabase Storage
- Row Level Security
- Edge Functions where appropriate

AI:

- Python
- FastAPI
- ONNX Runtime
- NumPy
- OpenCV
- SciPy where needed

ECG model:

adzetto/ecg-arrhythmia-classifier

Model:
ECG Arrhythmia Classifier (12-Lead DS-CNN)

Hugging Face:
https://huggingface.co/adzetto/ecg-arrhythmia-classifier

The model repository provides ONNX/TFLite-related artifacts.

Primary implementation preference:

Python + ONNX Runtime backend inference.

Do not force the model into the browser unless there is a strong technical reason.

Maps:

Use a modular map provider such as Mapbox.

Keep map functionality abstracted so the provider can be changed later.

============================================================
6. APPLICATION ARCHITECTURE
============================================================

Use this architecture:

                    MOBILE PHONE
                         │
                         ▼
              ┌────────────────────┐
              │ Ambulance PWA      │
              │ Next.js / React    │
              └─────────┬──────────┘
                        │
                        ▼
                ┌──────────────┐
                │   Supabase   │
                │              │
                │ PostgreSQL   │
                │ Auth         │
                │ Realtime     │
                │ Storage      │
                └──────┬───────┘
                       │
              ┌────────┴─────────┐
              ▼                  ▼
       ┌──────────────┐   ┌────────────────┐
       │ Python AI    │   │ Hospital       │
       │ Service      │   │ Dashboard      │
       │ FastAPI      │   │ Next.js        │
       │ ONNX Runtime │   │ React          │
       └──────────────┘   └────────────────┘

The architecture must be modular.

============================================================
7. USER ROLES
============================================================

Create role-based access control.

ROLE 1 — PARAMEDIC

Can:

- login
- select ambulance
- create emergency case
- enter patient information
- record symptoms
- record medical history
- record vitals
- capture/upload ECG
- run AI ECG screening
- view screening results
- select receiving hospital
- send emergency notification
- view ambulance location
- view ETA
- update case status
- work offline
- synchronize when connectivity returns

ROLE 2 — EMERGENCY DOCTOR

Can:

- login
- view incoming ambulances
- view emergency cases
- view patient information
- view vitals
- view ECG
- view AI screening
- view location
- view ETA
- acknowledge incoming emergency
- update preparedness status
- view patient timeline
- update case status

ROLE 3 — HOSPITAL ADMIN

Can:

- manage doctors
- manage paramedics
- manage ambulances
- manage hospital departments
- view analytics
- manage users
- view audit logs

ROLE 4 — SUPER ADMIN

Can:

- manage hospitals
- manage ambulance organizations
- manage platform users
- monitor system
- configure platform
- view system analytics
- manage AI configuration
- view audit logs

============================================================
8. PARAMEDIC MOBILE PWA
============================================================

Create a mobile-first interface optimized for use inside a moving ambulance.

Design principles:

- large touch targets
- minimal typing
- very clear hierarchy
- high contrast
- minimal distractions
- emergency-focused
- fast navigation
- accessible typography
- one-handed usability where possible

Screens:

1. Splash
2. Login
3. Ambulance Selection
4. Paramedic Home
5. New Emergency Case
6. Patient Information
7. Symptoms
8. Medical History
9. Vitals
10. ECG Capture
11. ECG Analysis
12. Emergency Summary
13. Hospital Selection
14. Live Tracking
15. Case Timeline
16. Offline Sync Center
17. Profile
18. Settings

============================================================
9. PARAMEDIC HOME
============================================================

Display:

- ambulance ID
- paramedic name
- online/offline status
- active emergency
- current location
- current hospital
- quick "NEW EMERGENCY" button
- active case status
- synchronization status

Main CTA:

"START EMERGENCY CASE"

============================================================
10. PATIENT REGISTRATION
============================================================

Capture:

- Patient ID
- Name
- Age
- Gender
- Phone number if available
- Emergency contact
- Blood group if known
- Known allergies
- Existing conditions
- Current medication
- Chief complaint
- Symptoms
- Symptom onset time
- Relevant medical history

Essential fields must be clearly identified.

Allow:

"UNKNOWN"

where appropriate.

Do not force unnecessary data entry during an emergency.

============================================================
11. SYMPTOM CAPTURE
============================================================

Provide quick-select symptom buttons.

Examples:

- Chest pain
- Shortness of breath
- Loss of consciousness
- Dizziness
- Severe bleeding
- Weakness
- Seizure
- Trauma
- Fever
- Other

Allow additional notes.

============================================================
12. VITAL MONITORING
============================================================

Support:

- Heart Rate
- Systolic BP
- Diastolic BP
- SpO2
- Respiratory Rate
- Temperature
- ECG heart rate
- GCS/consciousness level

For MVP support:

A. Manual input
B. Simulated device input

Create a device integration abstraction layer for future hardware.

Architecture:

MEDICAL SENSOR
↓
DEVICE GATEWAY
↓
API/Bluetooth/Wi-Fi
↓
PULSELINK
↓
HOSPITAL

Do not claim that the demo values come from real hardware.

If simulated, clearly label:

"SIMULATED SENSOR DATA"

Create a simulation mode that changes values realistically over time.

============================================================
13. ECG SYSTEM
============================================================

ECG is one of the core features.

Support:

MODE A:
Digital ECG

MODE B:
Paper ECG

Digital ECG should support:

- CSV
- JSON
- compatible waveform data
- synthetic/demo ECG

Paper ECG:

Allow paramedic to:

1. Open camera/upload
2. Capture ECG image
3. Crop ECG
4. Perspective correction
5. Image preprocessing
6. Grid/background removal
7. Waveform extraction
8. Signal reconstruction where possible
9. Validate signal
10. Send to AI pipeline

IMPORTANT:

Do not fake successful paper ECG digitization.

If reliable waveform extraction cannot be achieved:

show:

"Unable to reliably digitize this ECG."

Then allow:

"Send ECG image for clinical review."

============================================================
14. ECG IMAGE PROCESSING
============================================================

Create a modular Python/OpenCV pipeline:

IMAGE
↓
Image validation
↓
Perspective correction
↓
Crop
↓
Grid detection
↓
Background removal
↓
Noise reduction
↓
Lead detection
↓
Waveform extraction
↓
Signal normalization
↓
Signal validation
↓
Resampling
↓
AI model

Keep this component isolated so it can be upgraded later.

============================================================
15. AI MODEL
============================================================

Use a pretrained ECG model.

DO NOT train from scratch.

Primary model:

adzetto/ecg-arrhythmia-classifier

Hugging Face:

https://huggingface.co/adzetto/ecg-arrhythmia-classifier

Model characteristics:

- 12-lead ECG
- 10-second input
- 250 Hz sampling
- approximately 2500 samples per lead
- DS-CNN architecture
- lightweight model
- multi-label ECG abnormality classification
- approximately 49 output labels

Use the ONNX model for server-side inference.

The model must be loaded through an abstraction:

EcgModelService

Do not hard-code the application to the specific model.

============================================================
16. AI MODEL PIPELINE
============================================================

Input:

12-lead ECG signal

Expected:

10 seconds
250 Hz
12 leads
approximately:

2500 × 12

Pipeline:

ECG
↓
Validate
↓
Preprocess
↓
Normalize
↓
Resample if appropriate
↓
Validate dimensions
↓
ONNX inference
↓
49-class predictions
↓
Confidence scores
↓
Label mapping
↓
Risk interpretation
↓
Hospital notification

If input is incompatible:

DO NOT run inference.

Show:

"ECG format is incompatible with the current AI screening model."

============================================================
17. AI OUTPUT
============================================================

The raw AI output must not be presented as a definitive diagnosis.

Create a friendly label mapping.

For example:

RBBB

→

"Right Bundle Branch Block (RBBB)"

LBBB

→

"Left Bundle Branch Block (LBBB)"

Other supported model labels should be mapped similarly.

Create:

AI SCREENING RESULT

Example:

--------------------------------
AI ECG SCREENING

Potential abnormality detected

Detected patterns:

• RBBB
• ST-T abnormality

Confidence:
87%

Priority:
HIGH

Recommendation:

"Urgent clinical review recommended."

--------------------------------

Disclaimer:

"AI-generated screening result.
This is not a medical diagnosis.
Final interpretation must be performed by a qualified healthcare professional."

============================================================
18. AI RISK ENGINE
============================================================

Create a separate rule-based risk interpretation layer.

Do not alter the trained model.

Inputs:

- AI ECG predictions
- AI confidence
- heart rate
- blood pressure
- SpO2
- respiratory rate
- symptoms
- consciousness level

Output:

LOW
MEDIUM
HIGH
CRITICAL

These represent workflow priority only.

Label it:

"Prototype Emergency Prioritization"

Do NOT label it:

"Medical diagnosis"

or:

"Confirmed heart attack"

============================================================
19. HOSPITAL DASHBOARD
============================================================

Create a desktop-first emergency department dashboard.

Main sections:

1. Overview
2. Incoming Emergencies
3. Active Cases
4. Critical Cases
5. Ambulance Map
6. Patient Detail
7. ECG Analysis
8. Case Timeline
9. Analytics
10. Users
11. Settings

============================================================
20. INCOMING EMERGENCY BOARD
============================================================

Display:

Patient
Age
Emergency type
Priority
Ambulance
ETA
Status
Time received

Example:

CRITICAL
Patient A
Cardiac concern
ETA 08 min
Incoming

HIGH
Patient B
Trauma
ETA 14 min
Incoming

MEDIUM
Patient C
Respiratory
ETA 22 min
Incoming

Use:

- labels
- icons
- status indicators
- color
- typography

Never depend only on color.

============================================================
21. HOSPITAL CASE DETAIL
============================================================

When doctor opens a case show:

PATIENT

- Name
- Age
- Gender
- ID
- Symptoms
- Medical history
- Allergies

VITALS

- HR
- BP
- SpO2
- Respiratory rate
- Temperature

ECG

- Original ECG
- Processed ECG
- waveform if available
- AI screening
- detected patterns
- confidence
- timestamp

AMBULANCE

- ambulance ID
- paramedic
- location
- distance
- ETA

STATUS

- Emergency created
- Ambulance en route
- Hospital notified
- Hospital acknowledged
- Preparing
- Approaching
- Arrived
- Patient transferred
- Case closed

============================================================
22. REALTIME COMMUNICATION
============================================================

Use Supabase Realtime.

When the paramedic presses:

"NOTIFY HOSPITAL"

the hospital dashboard must immediately receive:

NEW EMERGENCY CASE

The dashboard should update without requiring a manual refresh.

Realtime events include:

- new case
- vital updates
- ECG upload
- AI result
- priority change
- location updates
- status changes
- acknowledgement
- arrival

============================================================
23. GPS + ETA
============================================================

Implement ambulance tracking.

For MVP:

Provide simulated GPS.

The ambulance marker should move toward the hospital.

Display:

- ambulance location
- hospital location
- route
- distance
- ETA
- current speed if available
- last update

Create a location service abstraction so real GPS can replace simulation later.

============================================================
24. OFFLINE-FIRST FUNCTIONALITY
============================================================

This is a major requirement.

The ambulance PWA must continue functioning without internet.

Use:

IndexedDB

or another reliable browser-side persistence mechanism.

Store locally:

- patient data
- case data
- vitals
- ECG metadata
- ECG files where practical
- timestamps
- status events
- GPS events
- notifications
- sync queue

When internet returns:

LOCAL DATA
↓
SYNC QUEUE
↓
SERVER
↓
HOSPITAL

Implement:

- retry
- exponential backoff
- sync status
- failed uploads
- successful uploads
- conflict handling
- duplicate prevention

UI states:

ONLINE

OFFLINE — DATA WILL SYNC AUTOMATICALLY

SYNCING...

SYNC COMPLETE

SYNC ERROR

============================================================
25. PWA
============================================================

The ambulance interface must support:

- installable PWA
- offline caching
- service worker
- responsive mobile UI
- app-like navigation
- local data storage
- reconnect handling

The app should still open and allow emergency case creation when the network is unavailable.

============================================================
26. SUPABASE DATABASE
============================================================

Use PostgreSQL.

Create tables:

profiles
users
hospitals
hospital_departments
ambulances
paramedics
doctors
patients
emergency_cases
vitals
ecg_records
ecg_predictions
locations
case_events
notifications
sync_events
audit_logs

Use UUID primary keys.

Use foreign keys.

Add:

created_at
updated_at

where appropriate.

Create indexes for:

hospital_id
ambulance_id
patient_id
case_id
status
priority
created_at

============================================================
27. EMERGENCY CASE RELATIONSHIP
============================================================

Use:

HOSPITAL
↓
EMERGENCY CASE
├── PATIENT
├── AMBULANCE
├── PARAMEDIC
├── VITALS
├── ECG RECORDS
├── AI PREDICTIONS
├── LOCATIONS
├── NOTIFICATIONS
└── CASE EVENTS

============================================================
28. SECURITY
============================================================

Patient information is sensitive.

Implement:

- Supabase Authentication
- Row Level Security
- role-based access
- authenticated ECG storage
- secure API access
- encrypted transport
- audit logs
- least-privilege access
- environment variables
- no secrets in frontend
- no Supabase service-role keys in client code

Create:

.env.example

Never commit real secrets.

Do not put patient data in URL parameters.

Do not expose patient ECG files publicly.

============================================================
29. ECG STORAGE
============================================================

Store ECG files securely.

Example:

ecg/{hospital_id}/{case_id}/

Store:

- original ECG image
- processed ECG image
- waveform data
- metadata
- AI result

Use authenticated access.

============================================================
30. API / SERVICES
============================================================

Create clean service endpoints.

Examples:

POST /api/cases
GET /api/cases
GET /api/cases/:id
PATCH /api/cases/:id

POST /api/cases/:id/vitals

POST /api/cases/:id/ecg

POST /api/cases/:id/ecg/analyze

GET /api/cases/:id/ecg/predictions

POST /api/cases/:id/location

PATCH /api/cases/:id/status

POST /api/cases/:id/acknowledge

GET /api/hospitals

GET /api/ambulances

Use authenticated requests.

============================================================
31. PYTHON AI SERVICE
============================================================

Create:

/ai-service

Use:

Python
FastAPI
ONNX Runtime
NumPy
OpenCV
SciPy where needed

Example endpoints:

POST /health

POST /ecg/validate

POST /ecg/analyze

POST /ecg/image-process

The Next.js backend should communicate with the Python service securely.

Do not expose the AI service publicly without authentication.

============================================================
32. AI MODEL ABSTRACTION
============================================================

Implement:

EcgModelService

Methods:

loadModel()
validateInput()
preprocess()
predict()
mapLabels()
calculateConfidence()
getRiskIndicators()

This allows future models to replace the current one.

============================================================
33. HOSPITAL PREPAREDNESS
============================================================

This is a major USP feature.

When hospital receives an incoming case, display:

"PREPARE FOR ARRIVAL"

Doctor can acknowledge:

"CASE ACKNOWLEDGED"

Then:

"TEAM PREPARING"

Then:

"READY FOR ARRIVAL"

The hospital dashboard should show:

- estimated arrival
- emergency priority
- patient symptoms
- current vitals
- ECG screening
- required department suggestion based on workflow rules

Do not make automated clinical treatment recommendations.

============================================================
34. CASE TIMELINE
============================================================

Create an immutable event timeline.

Example:

10:21
Emergency case created

10:22
Patient information completed

10:23
Vitals recorded

10:24
ECG uploaded

10:24
AI screening completed

10:25
Hospital notified

10:26
Hospital acknowledged

10:34
Ambulance approaching

10:38
Patient arrived

10:42
Patient transferred

Every event should have:

- timestamp
- actor
- event type
- description

============================================================
35. NOTIFICATIONS
============================================================

In-app realtime notifications for:

- new emergency
- critical priority
- ECG result available
- abnormal vital
- hospital acknowledgement
- ambulance approaching
- arrival

Push notifications can be a future extension.

============================================================
36. ANALYTICS
============================================================

Hospital admin dashboard:

- active ambulances
- incoming cases
- critical cases
- completed cases
- average notification time
- average response time
- average pre-arrival notification time
- offline sync events
- cases by priority

If using demo data, clearly display:

"DEMO DATA"

Never fabricate real-world performance claims.

============================================================
37. DEMO MODE
============================================================

Create a complete hackathon demonstration mode.

The demo must allow:

STEP 1
Paramedic login

STEP 2
Select ambulance

STEP 3
Create patient

STEP 4
Enter symptoms

STEP 5
Vitals begin updating

STEP 6
Upload ECG

STEP 7
AI screening executes

STEP 8
AI result appears

STEP 9
Emergency priority generated

STEP 10
Select receiving hospital

STEP 11
Click:

"NOTIFY HOSPITAL"

STEP 12
Hospital dashboard immediately shows:

NEW EMERGENCY

STEP 13
Doctor opens patient

STEP 14
Doctor sees:

Patient
Symptoms
Vitals
ECG
AI screening
Priority
GPS
ETA

STEP 15
Doctor clicks:

"ACKNOWLEDGE CASE"

STEP 16
Doctor clicks:

"PREPARE FOR ARRIVAL"

STEP 17
Ambulance moves toward hospital

STEP 18
ETA decreases

STEP 19
Vitals update

STEP 20
Ambulance arrives

STEP 21
Status:

ARRIVED

STEP 22
Case:

TRANSFERRED

STEP 23
Case:

CLOSED

============================================================
38. OFFLINE DEMO
============================================================

Create a highly visible:

"SIMULATE NETWORK LOSS"

button.

When clicked:

- application enters offline mode
- network indicator changes
- user can continue entering data
- patient information is stored locally
- vitals are queued
- ECG metadata is queued
- events are queued

Then:

"RESTORE NETWORK"

button.

After restoring:

- queued events synchronize
- dashboard updates
- sync status changes
- no duplicate records are created

This feature should be easy to demonstrate to judges.

============================================================
39. DEMO DATA
============================================================

Create synthetic demo patients.

Examples:

Patient 1:
Cardiac-risk scenario

Patient 2:
Trauma

Patient 3:
Respiratory emergency

Patient 4:
Low-risk emergency

Every synthetic record must clearly display:

DEMO DATA

Never use real patient data.

============================================================
40. UI DESIGN
============================================================

The interface should feel like a serious medical technology platform.

Avoid:

- generic SaaS appearance
- excessive gradients
- unnecessary animations
- clutter
- tiny text
- decorative elements that reduce usability

Use:

- clean white/dark navy foundation
- emergency red for urgent states
- strong typography
- rounded but professional cards
- clear hierarchy
- high contrast
- responsive layouts
- medical dashboard patterns

Ambulance UI:

Simple
Fast
Large controls

Hospital UI:

Information dense
Desktop optimized
Multi-panel

============================================================
41. LANDING PAGE
============================================================

Create a polished landing page.

Hero:

PULSELINK

"From Ambulance to Emergency Room — Before the Patient Arrives."

Supporting text:

"Real-time patient data, AI-assisted ECG screening, live ambulance tracking and hospital preparedness in one connected emergency platform."

CTA:

"Launch Ambulance Demo"

Secondary CTA:

"Open Hospital Dashboard"

Add architecture visualization:

AMBULANCE
↓
REAL-TIME DATA
↓
AI
↓
HOSPITAL

Add USP:

"THE AMBULANCE IS AN EXTENSION OF THE ER."

============================================================
42. PRESENTATION MODE
============================================================

Create a presentation-friendly mode.

Display:

AMBULANCE
↓
PATIENT DATA
↓
VITALS
↓
ECG
↓
AI SCREENING
↓
REALTIME BACKEND
↓
HOSPITAL
↓
PREPARE
↓
ARRIVAL

Use subtle animations only.

The actual application must not depend on animation.

============================================================
43. ACCESSIBILITY
============================================================

Ensure:

- large font
- readable labels
- keyboard accessibility
- high contrast
- no color-only meaning
- screen-reader-friendly controls
- large touch targets
- clear errors

============================================================
44. ERROR HANDLING
============================================================

Handle:

- no internet
- server unavailable
- authentication failure
- expired session
- invalid ECG
- unsupported ECG
- failed AI inference
- failed ECG upload
- failed sync
- GPS unavailable
- invalid patient data
- missing required fields

Never silently fail.

============================================================
45. MEDICAL SAFETY
============================================================

Every AI result must include:

"AI-generated screening result.
Not a medical diagnosis.
Final interpretation must be performed by a qualified healthcare professional."

Never:

- diagnose
- prescribe
- recommend medication
- recommend treatment
- claim clinical validation
- claim regulatory approval
- claim the system replaces doctors

Use terms:

"Potential abnormality"

"Screening result"

"Clinical review recommended"

"Decision support"

============================================================
46. HARDWARE READINESS
============================================================

Although hardware is NOT required for the first MVP, keep the architecture ready for future integration.

Potential future devices:

- ECG machine
- pulse oximeter
- BP monitor
- temperature sensor
- respiratory sensor
- ESP32 gateway
- Bluetooth medical devices
- USB ECG devices

Create:

DeviceIntegrationService

so future devices can be integrated without rewriting the application.

For current MVP:

Use manual input + simulation.

============================================================
47. FUTURE EXTENSIONS
============================================================

Architecture should support future:

- Flutter mobile application
- native Android
- real ECG hardware
- ESP32 gateway
- Bluetooth sensors
- FHIR interoperability
- EMR integration
- hospital HIS integration
- push notifications
- multilingual support
- voice input
- automated paper ECG digitization
- advanced ECG foundation models
- deterioration prediction
- ambulance fleet management
- hospital selection optimization
- traffic-aware ETA
- multi-hospital routing

Do NOT implement all of these now.

Keep the architecture extensible.

============================================================
48. PROJECT STRUCTURE
============================================================

Use a clean structure similar to:

/app
/components
/features
/lib
/hooks
/services
/types
/utils
/public
/pwa

/ai-service
    /models
    /preprocessing
    /inference
    /api

/supabase
    /migrations
    /seed

/docs

/scripts

/.env.example

README.md

Adapt if necessary but maintain clear separation.

============================================================
49. DATABASE SECURITY
============================================================

Create proper Supabase Row Level Security.

Paramedic:

Can access cases assigned to their ambulance/organization.

Doctor:

Can access cases belonging to their hospital.

Hospital Admin:

Can access their hospital.

Super Admin:

Platform-wide access.

Users must not be able to access unrelated patient records.

============================================================
50. AUDIT LOGGING
============================================================

Log sensitive actions:

- login
- patient created
- patient updated
- ECG uploaded
- AI analysis requested
- AI result generated
- case viewed
- case acknowledged
- priority changed
- case closed

Audit logs must include:

- actor
- action
- timestamp
- entity
- entity ID

============================================================
51. PERFORMANCE
============================================================

The ambulance interface must load quickly.

Optimize:

- bundle size
- image uploads
- ECG processing
- realtime subscriptions
- database queries
- mobile responsiveness

Do not unnecessarily load the entire hospital dashboard into the ambulance client.

============================================================
52. NO FAKE FUNCTIONALITY
============================================================

CRITICAL:

Do not create beautiful UI screens with fake buttons.

If a button exists:

it must perform a real action

OR

be explicitly labeled:

"SIMULATION"

If a feature cannot be fully implemented:

label it honestly as:

"Prototype"

Do not fabricate AI predictions.

Do not fabricate sensor readings without labeling them as simulation.

Do not claim real-time hardware data if the source is simulated.

============================================================
53. DEVELOPMENT ORDER
============================================================

Implement systematically.

PHASE 1:

- project setup
- architecture
- authentication
- database
- roles
- base UI
- landing page

PHASE 2:

- paramedic PWA
- patient registration
- emergency case
- vitals
- hospital selection

PHASE 3:

- hospital dashboard
- realtime case updates
- case detail
- case timeline

PHASE 4:

- ECG upload
- ECG viewer
- Python AI service
- ONNX model
- predictions

PHASE 5:

- priority engine
- hospital preparedness
- notifications

PHASE 6:

- GPS
- ETA
- map
- simulation

PHASE 7:

- offline mode
- IndexedDB
- sync queue
- reconnect synchronization

PHASE 8:

- paper ECG processing prototype

PHASE 9:

- analytics
- demo mode
- polish
- testing
- documentation

============================================================
54. TESTING
============================================================

Create tests for:

- authentication
- database operations
- role permissions
- case creation
- vitals
- ECG upload
- AI API
- invalid ECG
- realtime updates
- offline queue
- synchronization
- duplicate prevention
- status changes

Before finishing:

Run the application.

Test:

PARAMEDIC → HOSPITAL

end-to-end.

Fix errors.

Do not simply report that code was written.

Verify that it works.

============================================================
55. README
============================================================

Create detailed documentation containing:

1. Project overview
2. Problem statement
3. USP
4. Architecture
5. Technology stack
6. Folder structure
7. Supabase setup
8. Database setup
9. Environment variables
10. Next.js setup
11. Python setup
12. AI model installation
13. ECG input format
14. Running the AI service
15. Running the frontend
16. Demo credentials
17. Demo workflow
18. Offline workflow
19. Security
20. Medical disclaimer
21. AI limitations
22. Known limitations
23. Future improvements

============================================================
56. ENVIRONMENT VARIABLES
============================================================

Create:

.env.example

Include placeholders for:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_SERVICE_URL
MAP_PROVIDER_KEY

Never hard-code secrets.

============================================================
57. DEMO CREDENTIALS
============================================================

Create seed/demo accounts:

Paramedic
Doctor
Hospital Admin
Super Admin

Clearly label these as DEMO ACCOUNTS.

Do not use real credentials.

============================================================
58. SUCCESS CRITERIA
============================================================

The project is successful when it can demonstrate:

✓ Paramedic login
✓ Ambulance selection
✓ Patient registration
✓ Symptom capture
✓ Vital capture
✓ ECG upload
✓ ECG AI screening
✓ AI result display
✓ Emergency priority
✓ Hospital selection
✓ Hospital notification
✓ Realtime hospital dashboard
✓ GPS/ETA
✓ Hospital acknowledgement
✓ Hospital preparation
✓ Case timeline
✓ Ambulance arrival
✓ Case closure
✓ Offline data entry
✓ Automatic synchronization
✓ Role-based security
✓ Secure ECG storage
✓ Audit logs
✓ Responsive mobile ambulance interface
✓ Professional hospital dashboard

============================================================
59. FINAL HACKATHON STORY
============================================================

The application must support this story:

A patient experiences a medical emergency.

An ambulance arrives.

The paramedic opens PulseLink.

Patient information is recorded.

Vitals are captured.

ECG is uploaded.

AI performs ECG abnormality screening.

PulseLink identifies the case as requiring urgent clinical review.

The paramedic selects the receiving hospital.

The hospital is immediately notified.

The doctor sees the patient's:

- information
- symptoms
- vitals
- ECG
- AI screening
- priority
- ambulance location
- ETA

The hospital acknowledges the case.

The emergency team begins preparing.

The ambulance continues toward the hospital.

ETA updates in real time.

The patient arrives.

The case is transferred and closed.

The key message:

"Instead of the hospital learning about the patient when the ambulance arrives, the hospital starts preparing while the ambulance is still on the road."

============================================================
60. FINAL IMPLEMENTATION INSTRUCTION
============================================================

First inspect the existing project directory.

Do not destroy existing work.

Then:

1. Analyze current structure.
2. Create architecture plan.
3. Create database schema.
4. Create implementation roadmap.
5. Start implementation immediately.

Do not stop after creating a plan.

Actually build the working MVP.

After each major phase:

- run the project
- test functionality
- fix errors
- verify database
- verify realtime communication
- verify authentication
- verify AI service
- verify offline synchronization

At completion provide:

1. Implemented features
2. Working features
3. Simulated features
4. AI model setup
5. Environment variables
6. How to run the project
7. Demo credentials
8. Known limitations
9. Recommended next development steps

The final product must look like a serious national-level hackathon prototype.

The primary goal is NOT to build the largest system.

The primary goal is to build a convincing, functional end-to-end demonstration of:

AMBULANCE
→
PATIENT DATA
→
VITALS
→
ECG
→
AI SCREENING
→
REALTIME COMMUNICATION
→
HOSPITAL PREPARATION
→
FASTER EMERGENCY RESPONSE

Core USP:

"THE AMBULANCE IS AN EXTENSION OF THE EMERGENCY ROOM."