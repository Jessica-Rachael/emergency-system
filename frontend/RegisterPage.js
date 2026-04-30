import React, { useState, useRef } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [blood, setBlood] = useState("");
  const [contact, setContact] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [password, setPassword] = useState(""); // ✅ REQUIRED NOW
  const [qr, setQR] = useState(null);
  const [patientID, setPatientID] = useState("");
  const [loading, setLoading] = useState(false);

  const qrRef = useRef(null);

  /* ───────────── REGISTER FUNCTION ───────────── */
  const handleRegister = async () => {
    if (!name || !contact || !password) { // ✅ CHECK PASSWORD
      alert("Name, Emergency Contact, and Password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/register-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          blood_group: blood,
          emergency_contact: contact,
          allergies,
          conditions,
          password // ✅ ALWAYS SEND PASSWORD
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      setQR(data.qr_code);
      setPatientID(data.patient_id);

      setTimeout(() => qrRef.current?.scrollIntoView({ behavior: "smooth" }), 300);

    } catch (err) {
      alert("Error registering patient");
      console.error(err);
    }

    setLoading(false);
  };

  const copyID = () => {
    navigator.clipboard.writeText(patientID);
    alert("Patient ID copied!");
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="page-content">
      <div className="page-inner">

        <div className="banner yellow">
          📌 Fill in accurate medical details. This helps doctors during emergencies.
        </div>

        <div className="two-col">
          <div>
            <div className="card">
              <div className="card-head">
                <div className="card-icon red">🧑‍⚕️</div>
                <div>
                  <div className="card-title">Patient Registration</div>
                  <div className="card-sub">Enter your medical details</div>
                </div>
              </div>

              <div className="card-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
                      value={blood}
                      onChange={(e) => setBlood(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option>
                      <option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact</label>
                  <input
                    className="form-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Allergies</label>
                  <textarea
                    className="form-textarea"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medical Conditions</label>
                  <textarea
                    className="form-textarea"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary full" onClick={handleRegister}>
                  {loading ? "Registering..." : "Register & Generate QR"}
                </button>
              </div>
            </div>
          </div>

          <div ref={qrRef}>
            {qr && (
              <div className="card">
                <div className="card-head">
                  <div className="card-icon green">✅</div>
                  <div>
                    <div className="card-title">Registration Successful</div>
                  </div>
                </div>

                <div className="card-body" style={{ textAlign: "center" }}>
                  <img src={qr} alt="QR" style={{ width: 200, marginBottom: 10 }} />
                  <div style={{ fontWeight: 600, marginBottom: 10 }}>{patientID}</div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                    <a href={qr} download={`QR_${patientID}.png`}>
                      <button className="btn btn-primary">⬇ Download</button>
                    </a>

                    <button className="btn btn-outline" onClick={copyID}>
                      📋 Copy ID
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={{ marginTop: 12 }}>
              <div className="card-body">
                <div className="info-list">
                  <div>📱 QR used in emergencies</div>
                  <div>🚨 Doctors can scan instantly</div>
                  <div>🔒 Your data is secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;