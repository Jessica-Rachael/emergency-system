import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/patient/${id}`)
      .then(res => res.json())
      .then(data => setPatient(data));
  }, [id]);

  if (!patient) {
    return (
      <div className="page-content">
        <div className="page-inner">
          <div className="loading-wrap">
            <div style={{ textAlign: "center" }}>
              <div className="loading-spinner" style={{ margin: "0 auto 12px" }}></div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Loading patient data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-inner">

        <div className="banner red">
          <span>🚨</span>
          <strong>Emergency Medical Profile —</strong>&nbsp;
          This information is for emergency use only. Handle with care.
        </div>

        <div className="two-col">

          {/* LEFT — Emergency profile card */}
          <div>
            <div className="emrg-profile">
              <div className="emrg-top">
                <div className="emrg-tag">⚠ EMERGENCY</div>
                <div>
                  <div className="emrg-name">{patient.name}</div>
                  <div className="emrg-id-text">Patient ID: {patient.patient_id}</div>
                </div>
              </div>

              <div className="pills-row">
                <div className="pill alert">
                  <div className="pill-label">Blood Group</div>
                  <div className="pill-val">{patient.blood_group}</div>
                </div>
                <div className="pill">
                  <div className="pill-label">Emergency Contact</div>
                  <div className="pill-val">{patient.emergency_contact}</div>
                </div>
              </div>

              <div className="info-block">
                <div className="info-block-title">⚠ Known Allergies — Critical</div>
                <div className={`info-block-body${patient.allergies && patient.allergies !== "None" ? " danger" : ""}`}>
                  {patient.allergies || "None reported"}
                </div>
              </div>

              <div className="info-block">
                <div className="info-block-title">🏥 Medical Conditions</div>
                <div className="info-block-body">
                  {patient.conditions || "None reported"}
                </div>
              </div>

              <div className="info-block" style={{ marginBottom: 12 }}>
                <div className="info-block-title">💊 Current Medications</div>
                <div className="info-block-body">
                  {patient.medications || "None reported"}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-primary" onClick={() => window.print()}>
                  🖨 Print Profile
                </button>
                <button className="btn btn-outline">
                  ✏️ Edit (Doctor Login Required)
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Info + guidance */}
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="card-head">
                <div className="card-icon red">🚨</div>
                <div>
                  <div className="card-title">Emergency Response Guide</div>
                  <div className="card-sub">Key information for treating physicians</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-list">
                  <div className="info-item-row" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <span className="info-item-icon">🩸</span>
                    <div>
                      <div className="info-item-title">Blood Group: {patient.blood_group}</div>
                      <div className="info-item-sub">Verify before any transfusion procedure</div>
                    </div>
                  </div>
                  <div className="info-item-row">
                    <span className="info-item-icon">⚠️</span>
                    <div>
                      <div className="info-item-title">Check Allergies First</div>
                      <div className="info-item-sub">Always verify allergy status before administering any medication</div>
                    </div>
                  </div>
                  <div className="info-item-row">
                    <span className="info-item-icon">💊</span>
                    <div>
                      <div className="info-item-title">Review Current Medications</div>
                      <div className="info-item-sub">Check for drug interactions with any new medications prescribed</div>
                    </div>
                  </div>
                  <div className="info-item-row">
                    <span className="info-item-icon">📞</span>
                    <div>
                      <div className="info-item-title">Emergency Contact</div>
                      <div className="info-item-sub">{patient.emergency_contact} — notify immediately</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="banner yellow" style={{ marginBottom: 0 }}>
              <span>ℹ️</span>
              To edit this patient's medical details, log in with a verified Doctor ID at the Doctor Login page.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
