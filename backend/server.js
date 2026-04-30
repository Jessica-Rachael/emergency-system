// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const QRCode = require("qrcode");

// Initialize app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ───────────── MYSQL CONNECTION ─────────────
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Jess17@",
  database: "emergency_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ───────────── HELPERS ─────────────
function genPatientId() {
  return "PAT" + Math.floor(100000 + Math.random() * 900000);
}

function genDoctorId() {
  return "DOC" + Math.floor(100000 + Math.random() * 900000);
}

// ───────────── DASHBOARD STATS (✅ FIXED) ─────────────
app.get("/stats", (req, res) => {
  const stats = {
    patients: 0,
    doctors: 0,
    emergency: 0,
    qr: 0
  };

  // Patients count
  db.query("SELECT COUNT(*) AS count FROM patients", (err, pRes) => {
    if (!err) stats.patients = pRes[0].count;

    // Doctors count
    db.query("SELECT COUNT(*) AS count FROM doctors", (err2, dRes) => {
      if (!err2) stats.doctors = dRes[0].count;

      // Emergency accesses (today)
      db.query(
        "SELECT COUNT(*) AS count FROM access_logs WHERE DATE(access_time) = CURDATE()",
        (err3, eRes) => {
          if (!err3) stats.emergency = eRes[0].count;

          // QR count (same as patients)
          stats.qr = stats.patients;

          res.json(stats);
        }
      );
    });
  });
});

// ───────────── RECENT ACTIVITIES (✅ FIXED) ─────────────
app.get("/activities", (req, res) => {
  db.query(
    "SELECT * FROM access_logs ORDER BY access_time DESC LIMIT 10",
    (err, results) => {
      if (err) return res.status(500).json([]);

      const formatted = results.map(log => ({
        message: `Patient ${log.patient_id} accessed (${log.access_type})`,
        time: log.access_time
      }));

      res.json(formatted);
    }
  );
});

// ───────────── REGISTER PATIENT ─────────────
app.post("/register-patient", async (req, res) => {
  const { name, blood_group, emergency_contact, allergies, conditions, password } = req.body;

  if (!name || !emergency_contact || !password) {
    return res.status(400).json({ message: "Name, contact & password are required" });
  }

  db.query(
    "SELECT * FROM patients WHERE emergency_contact=?",
    [emergency_contact],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length > 0) {
        return res.status(400).json({ message: "Patient already registered!" });
      }

      let patient_id = genPatientId();

      const qr_code = await QRCode.toDataURL(`http://localhost:3000/patient/${patient_id}`);

      db.query(
        `INSERT INTO patients 
        (patient_id, name, blood_group, emergency_contact, allergies, conditions, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [patient_id, name, blood_group, emergency_contact, allergies, conditions, password],
        (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });

          res.json({ patient_id, qr_code });
        }
      );
    }
  );
});

// ───────────── REGISTER DOCTOR ─────────────
app.post("/register-doctor", (req, res) => {
  const { name, specialization, hospital, license, proof, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name & password are required" });
  }

  let doctor_id = genDoctorId();

  db.query(
    `INSERT INTO doctors 
    (doctor_id, name, specialization, hospital, license, proof, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [doctor_id, name, specialization, hospital, license, proof, password],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      res.json({ doctor_id });
    }
  );
});

// ───────────── PATIENT LOGIN ─────────────
app.post("/login-patient", (req, res) => {
  const { patient_id, password } = req.body;

  db.query(
    "SELECT * FROM patients WHERE patient_id=?",
    [patient_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length === 0) {
        return res.status(400).json({ success: false, message: "Patient not found" });
      }

      const patient = results[0];

      if (patient.password && patient.password !== password) {
        return res.status(400).json({ success: false, message: "Incorrect password" });
      }

      res.json({ success: true, patient });
    }
  );
});

// ───────────── DOCTOR LOGIN ─────────────
app.post("/login-doctor", (req, res) => {
  const { doctor_id, password } = req.body;

  db.query(
    "SELECT * FROM doctors WHERE doctor_id=? AND password=?",
    [doctor_id, password],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid ID or password" });
      }

      res.json({ success: true, doctor: results[0] });
    }
  );
});

// ───────────── GET PATIENT DETAILS ─────────────
app.get("/patient/:id", (req, res) => {
  const patient_id = req.params.id;

  db.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [patient_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const patient = results[0];

      if (!patient.medications_schedule) {
        patient.medications_schedule = "[]";
      }

      res.json(patient);
    }
  );
});

// ───────────── UPDATE PATIENT ─────────────
app.put("/patient/:id", (req, res) => {
  const patient_id = req.params.id;
  const { doctor, medications_schedule, next_checkup } = req.body;

  if (!doctor || !doctor.doctor_id || !doctor.password) {
    return res.status(400).json({ message: "Doctor authentication required" });
  }

  db.query(
    "SELECT * FROM doctors WHERE doctor_id=? AND password=?",
    [doctor.doctor_id, doctor.password],
    (err, docRes) => {
      if (err) return res.status(500).json({ message: err.message });

      if (docRes.length === 0) {
        return res.status(401).json({ message: "Invalid doctor credentials" });
      }

      const safeSchedule =
        typeof medications_schedule === "string"
          ? medications_schedule
          : JSON.stringify(medications_schedule || []);

      db.query(
        "UPDATE patients SET medications_schedule=?, next_checkup=? WHERE patient_id=?",
        [safeSchedule, next_checkup, patient_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });

          res.json({ message: "Patient updated successfully" });
        }
      );
    }
  );
});

// ───────────── LOG ACCESS ─────────────
app.post("/log-access", (req, res) => {
  const { patient_id, access_type } = req.body;

  db.query(
    "INSERT INTO access_logs (patient_id, access_type) VALUES (?, ?)",
    [patient_id, access_type],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      res.json({ success: true });
    }
  );
});

// ───────────── START SERVER ─────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});