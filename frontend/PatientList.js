import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientList() {
  const [patients, setPatients]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [qrModal, setQrModal]     = useState(null); // { patient_id, name, qr_code }
  const [qrLoading, setQrLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/patients")
      .then(r => r.json())
      .then(data => { setPatients(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openQR = async (patient_id, name) => {
    setQrLoading(true);
    setQrModal({ patient_id, name, qr_code: null });
    try {
      const res  = await fetch(`http://localhost:5000/patient/${patient_id}/qr`);
      const data = await res.json();
      setQrModal({ patient_id, name, qr_code: data.qr_code });
    } catch {
      alert("Could not load QR code.");
      setQrModal(null);
    }
    setQrLoading(false);
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(search.toLowerCase()) ||
    (p.blood_group || "").toLowerCase().includes(search.toLowerCase())
  );

  const bloodColor = (bg) => {
    if (!bg) return "blue";
    if (bg.startsWith("O")) return "red";
    if (bg.startsWith("A")) return "green";
    if (bg.startsWith("B")) return "yellow";
    return "blue";
  };

  return (
    <div className="page-content">
      <div className="page-inner">

        {/* QR Modal */}
        {qrModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000
          }} onClick={() => setQrModal(null)}>
            <div style={{
              background: "#fff", borderRadius: 14, padding: "28px 32px",
              textAlign: "center", minWidth: 280, maxWidth: 340,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
            }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>QR Code for</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1d2e", marginBottom: 2 }}>
                {qrModal.name}
              </div>
              <div style={{ fontSize: 12, color: "#4f6ef7", fontWeight: 600, marginBottom: 16 }}>
                {qrModal.patient_id}
              </div>

              {qrLoading || !qrModal.qr_code ? (
                <div style={{ width: 200, height: 200, display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px", background: "#f9fafb",
                  borderRadius: 10, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Loading QR...</div>
                </div>
              ) : (
                <img src={qrModal.qr_code} alt="QR"
                  style={{ width: 200, height: 200, display: "block", margin: "0 auto 16px",
                    borderRadius: 8, border: "1px solid #e5e7eb" }} />
              )}

              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>
                Scan this QR to open emergency profile instantly
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {qrModal.qr_code && (
                  <a href={qrModal.qr_code} download={`${qrModal.patient_id}_qr.png`}>
                    <button className="btn btn-primary" style={{ fontSize: 12 }}>⬇ Download</button>
                  </a>
                )}
                <button className="btn btn-outline" style={{ fontSize: 12 }}
                  onClick={() => navigate(`/patient/${qrModal.patient_id}`)}>
                  View Profile
                </button>
                <button className="btn btn-outline" style={{ fontSize: 12 }}
                  onClick={() => setQrModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="banner blue">
          <span>📋</span>
          Click any patient's <strong>&nbsp;name&nbsp;</strong> to view their QR code.
          Click <strong>&nbsp;View Profile&nbsp;</strong> to see the full emergency medical record.
        </div>

        {/* Search + count */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder="Search by name, ID or blood group..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }}>
            {filtered.length} patient{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>Loading patients...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🧑‍⚕️</div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>No patients found</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Register a patient first or try a different search</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Patient ID</th>
                  <th>Blood Group</th>
                  <th>Allergies</th>
                  <th>Conditions</th>
                  <th>Emergency Contact</th>
                  <th>QR / Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.patient_id}>
                    {/* Clickable name → opens QR modal */}
                    <td>
                      <span
                        style={{
                          fontWeight: 600, color: "#4f6ef7", cursor: "pointer",
                          borderBottom: "1px dashed #4f6ef7"
                        }}
                        title="Click to view QR code"
                        onClick={() => openQR(p.patient_id, p.name)}
                      >
                        {p.name}
                      </span>
                    </td>
                    <td><span className="tag blue">{p.patient_id}</span></td>
                    <td>
                      {p.blood_group
                        ? <span className={`tag ${bloodColor(p.blood_group)}`}>{p.blood_group}</span>
                        : <span style={{ color: "#9ca3af" }}>—</span>}
                    </td>
                    <td style={{ maxWidth: 160, fontSize: 12 }}>
                      {p.allergies && p.allergies.toLowerCase() !== "none"
                        ? <span className="tag red" style={{ fontSize: 11 }}>{p.allergies}</span>
                        : <span style={{ color: "#9ca3af" }}>None</span>}
                    </td>
                    <td style={{ maxWidth: 160, fontSize: 12, color: "#374151" }}>
                      {p.conditions || <span style={{ color: "#9ca3af" }}>None</span>}
                    </td>
                    <td style={{ fontSize: 12 }}>{p.emergency_contact || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: 11, padding: "4px 10px" }}
                          onClick={() => openQR(p.patient_id, p.name)}
                        >
                          📱 QR
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: 11, padding: "4px 10px" }}
                          onClick={() => navigate(`/patient/${p.patient_id}`)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default PatientList;
