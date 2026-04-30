# EMIAS — Update Instructions

## Files changed in this update

| File | Where to put it |
|------|----------------|
| server.js | Desktop/emias/backend/server.js — REPLACE existing |
| App.js | Desktop/emias/frontend/src/App.js — REPLACE existing |
| Navbar.js | Desktop/emias/frontend/src/components/Navbar.js — REPLACE existing |
| RegisterPage.js | Desktop/emias/frontend/src/pages/RegisterPage.js — REPLACE existing |
| PatientList.js | Desktop/emias/frontend/src/pages/PatientList.js — NEW FILE (create this) |

---

## Step 1 — Install the qrcode package in backend

Open backend terminal and run:
  npm install qrcode

---

## Step 2 — Replace server.js

Open backend/server.js, delete everything, paste the new server.js content.

---

## Step 3 — Replace frontend files

Replace App.js, Navbar.js, RegisterPage.js with the new versions.
Create a new file PatientList.js inside src/pages/.

---

## Step 4 — Restart backend

Stop the backend (Ctrl+C) and run again:
  node server.js

You should see: Server running on port 5000

---

## What's new

1. Patient Registration → stores name, blood group, allergies, conditions, medications, password to SQLite database
2. QR code is generated from the real backend URL: http://localhost:3000/patient/PAT123456
3. Patient Records page (📋 in sidebar) shows all registered patients
4. Click any patient NAME → QR code modal pops up instantly
5. Click QR button in table → same QR modal
6. Download QR button saves the actual working QR image
7. View button → opens full emergency profile page

---

## How QR works

When a patient registers:
- Server generates a QR that encodes: http://localhost:3000/patient/PAT123456
- Scanning this QR on a phone opens the Emergency Profile page for that patient
- No login needed for emergency access — just scan and get the info

