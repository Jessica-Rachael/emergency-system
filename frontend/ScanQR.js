import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

function ScanQR() {
  const qrRef = useRef(null);
  const navigate = useNavigate();
  const [scanner, setScanner] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const startCameraScan = () => {
    if (scanner) return; // Already initialized

    const html5QrScanner = new Html5Qrcode("reader");
    setScanner(html5QrScanner);

    html5QrScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          handleResult(decodedText);
          html5QrScanner.stop().then(() => setIsRunning(false)).catch(() => {});
        },
        (error) => {
          // Optional: console.log("Scanning error:", error);
        }
      )
      .then(() => setIsRunning(true))
      .catch((err) => console.error("Scanner failed to start", err));
  };

  const handleResult = async (text) => {
    try {
      const parts = text.split("/");
      const patientID = parts[parts.length - 1];
      if (!patientID) {
        alert("Invalid QR Code");
        return;
      }

      await fetch("http://localhost:5000/log-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientID, access_type: "EMERGENCY_SCAN" }),
      });

      navigate(`/patient/${patientID}`);
    } catch {
      alert("Error reading QR");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = scanner || new Html5Qrcode("reader");
    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => handleResult(decodedText))
      .catch(() => alert("Could not scan QR from image"));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 Scan Patient QR Code</h2>

      <button
        className="btn btn-primary"
        onClick={startCameraScan}
        style={{ marginBottom: 20 }}
      >
        Start Camera Scan
      </button>

      <div id="reader" ref={qrRef} style={{ width: "300px", marginBottom: 20 }} />

      <div>
        <p>OR Upload QR Image:</p>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default ScanQR;