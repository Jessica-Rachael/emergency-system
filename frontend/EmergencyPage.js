// EmergencyPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader"; // ✅ Named import for new version

function EmergencyPage() {
  const [patientId, setPatientId] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [fileQR, setFileQR] = useState(null);
  const navigate = useNavigate();

  // Handle manual lookup
  const handleLookup = async (id = null) => {
    const pid = id || patientId.trim();
    if (pid.length < 3) {
      alert("Please enter a valid Patient ID");
      return;
    }

    try {
      await fetch("http://localhost:5000/log-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: pid, access_type: "EMERGENCY_MANUAL" }),
      });
      console.log("✅ Access logged");
    } catch (err) {
      console.error("Logging failed", err);
    }

    navigate(`/patient/${pid}`);
  };

  // Handle QR scan from camera
  const handleScan = (data) => {
    if (data) {
      const pid = data.replace(/.*\/patient\//, "");
      setPatientId(pid);
      handleLookup(pid);
      setShowQRScanner(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  // Handle QR file selection (optional decoding can be added later)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileQR(file);
    alert("File uploaded. In production, decode QR from file to get Patient ID.");
  };

  return (
    <div className="page-content">
      <div className="page-inner">

        {/* Banner */}
        <div className="banner red">
          <span>🚨</span>
          <strong>Emergency Mode —</strong> Enter the Patient ID, scan QR, or upload QR image. No login required.
        </div>

        <div className="two-col">

          {/* LEFT SECTION */}
          <div>
            <div className="section-title">🔍 Look Up Patient</div>

            {/* Manual entry */}
            <div className="search-row" style={{ marginBottom: 12 }}>
              <input
                className="form-input"
                type="text"
                placeholder="Enter Patient ID e.g. PAT583291"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
              <button className="btn btn-dark" onClick={() => handleLookup()}>
                🔍 Look Up
              </button>
            </div>

            {/* QR Scan button */}
            <div style={{ marginBottom: 12 }}>
              <button
                className="btn btn-primary full"
                onClick={() => setShowQRScanner(!showQRScanner)}
              >
                📱 Scan QR Code
              </button>
              {showQRScanner && (
                <div style={{ marginTop: 12 }}>
                  <QrReader
                    onResult={(result, error) => {
                      if (!!result) handleScan(result?.text);
                      if (!!error) handleError(error);
                    }}
                    constraints={{ facingMode: "environment" }}
                    style={{ width: "100%" }}
                  />
                  <button
                    className="btn btn-outline full"
                    style={{ marginTop: 8 }}
                    onClick={() => setShowQRScanner(false)}
                  >
                    ❌ Cancel Scan
                  </button>
                </div>
              )}
            </div>

            {/* File upload */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileQRInput"
              />
              <label htmlFor="fileQRInput" className="btn btn-secondary full">
                📁 Choose QR Code File
              </label>
              {fileQR && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#374151" }}>
                  Selected file: {fileQR.name}
                </div>
              )}
            </div>

            {/* Info card */}
            <div style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 28,
              textAlign: "center",
              marginBottom: 12
            }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>📱</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                Enter a Patient ID, scan a QR code, or upload a QR image.
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div>
            <div className="section-title">📱 How QR Code Emergency Access Works</div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="card-body">
                <div className="info-list">
                  <div className="info-item-row" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <span className="info-item-icon">1️⃣</span>
                    <div>
                      <div className="info-item-title">Patient carries QR card</div>
                      <div className="info-item-sub">Each registered patient has a unique QR code.</div>
                    </div>
                  </div>

                  <div className="info-item-row">
                    <span className="info-item-icon">2️⃣</span>
                    <div>
                      <div className="info-item-title">Doctor scans QR</div>
                      <div className="info-item-sub">QR opens emergency access instantly.</div>
                    </div>
                  </div>

                  <div className="info-item-row">
                    <span className="info-item-icon">3️⃣</span>
                    <div>
                      <div className="info-item-title">Instant data access</div>
                      <div className="info-item-sub">Medical details appear immediately.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EmergencyPage;