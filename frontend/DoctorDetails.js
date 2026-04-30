import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorDetails() {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("STORED USER:", user);

    if (user && user.role === "doctor") {
      const doctorData = user.data?.doctor || user.data;
      setDoctor(doctorData);
    } else {
      alert("No doctor logged in ❌");
    }
  }, []);

  if (!doctor) {
    return <h3 className="page-content">Loading doctor data...</h3>;
  }

  return (
    <div className="page-content">
      <div className="page-inner">

        {/* 👨‍⚕️ HEADER CARD */}
        <div className="card">
          <div className="card-head">
            <div className="card-icon green">👨‍⚕️</div>
            <div>
              <div className="card-title">Doctor Dashboard</div>
              <div className="card-sub">Welcome back</div>
            </div>
          </div>
        </div>

        {/* 👤 DOCTOR PROFILE */}
        <div className="card">
          <div className="card-head">
            <div className="card-icon blue">👤</div>
            <div>
              <div className="card-title">{doctor.name || "Doctor Name"}</div>
              <div className="card-sub">Professional Details</div>
            </div>
          </div>

          <div className="card-body">
            <div className="chips">

              <div className="chip">
                <div className="chip-icon b">🆔</div>
                <div>
                  <div className="chip-val">{doctor.doctor_id || "N/A"}</div>
                  <div className="chip-sub">Doctor ID</div>
                </div>
              </div>

              <div className="chip">
                <div className="chip-icon g">🩺</div>
                <div>
                  <div className="chip-val">{doctor.specialization || "N/A"}</div>
                  <div className="chip-sub">Specialization</div>
                </div>
              </div>

              <div className="chip">
                <div className="chip-icon y">🏥</div>
                <div>
                  <div className="chip-val">{doctor.hospital || "N/A"}</div>
                  <div className="chip-sub">Hospital</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 🔍 ACTION CARD */}
        <div className="card">
          <div className="card-head">
            <div className="card-icon yellow">🔍</div>
            <div className="card-title">Patient Management</div>
          </div>

          <div className="card-body">
            <p style={{ marginBottom: "10px", color: "#666" }}>
              Search and manage patient records securely.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/details")}
            >
              🔍 Go to Patient Lookup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DoctorDetails;