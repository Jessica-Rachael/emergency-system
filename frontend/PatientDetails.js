import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function PatientDetails() {
  const location = useLocation();

  const [patientId, setPatientId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [doctorId, setDoctorId] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  const [medName, setMedName] = useState("");
  const [timing, setTiming] = useState("After Breakfast");
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [medicationsSchedule, setMedicationsSchedule] = useState([]);
  const [nextCheckup, setNextCheckup] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (location.state?.patientId) {
      setPatientId(location.state.patientId);
      fetchPatient(location.state.patientId);
    }
  }, [location.state]);

  const convertTimingToTime = (timingStr) => {
    switch (timingStr.toLowerCase()) {
      case "before breakfast": return "07:00";
      case "after breakfast": return "08:00";
      case "before lunch": return "12:30";
      case "after lunch": return "13:30";
      case "before dinner": return "18:30";
      case "after dinner": return "19:30";
      default: return "09:00";
    }
  };

  const fetchPatient = async (idParam) => {
    const idToUse = idParam || patientId;

    if (!idToUse) {
      alert("Enter Patient ID");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/patient/${idToUse}`);
      const result = await res.json();

      if (res.ok) {
        setData(result);

        try {
          setMedicationsSchedule(
            result.medications_schedule
              ? JSON.parse(result.medications_schedule)
              : []
          );
        } catch {
          setMedicationsSchedule([]);
        }

        setNextCheckup(result.next_checkup || "");
      } else {
        alert(result.message || "Patient not found");
        setData(null);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsAuthorized(false);
  };

  const handleDoctorLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          password: doctorPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Doctor Verified ✅");
        setIsAuthorized(true);
      } else {
        alert("Invalid credentials ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const addMedicine = () => {
    if (!medName || !timing || !startDate || days < 1) {
      alert("Fill all fields");
      return;
    }

    const newMed = {
      medicine: medName,
      timing,
      days,
      start_date: startDate,
      time: convertTimingToTime(timing)
    };

    setMedicationsSchedule([...medicationsSchedule, newMed]);

    setMedName("");
    setTiming("After Breakfast");
    setDays(1);
    setStartDate("");
  };

  const updatePatient = async () => {
    if (!isAuthorized) {
      alert("Doctor not authorized");
      return;
    }

    const body = {
      doctor: {
        doctor_id: doctorId,
        password: doctorPassword
      },
      medications_schedule: JSON.stringify(medicationsSchedule),
      next_checkup: nextCheckup
    };

    try {
      const res = await fetch(`http://localhost:5000/patient/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (res.ok) {
        alert("Patient updated successfully ✅");
        setIsEditing(false);
        setIsAuthorized(false);
        fetchPatient();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="page-content">
      <div className="page-inner">

        {/* 🔍 SEARCH CARD */}
        <div className="card">
          <div className="card-head">
            <div className="card-icon blue">🔍</div>
            <div>
              <div className="card-title">Patient Lookup</div>
              <div className="card-sub">Search by Patient ID</div>
            </div>
          </div>

          <div className="card-body">
            <div className="search-row">
              <input
                className="form-input"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => fetchPatient()}>
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* 📄 PATIENT DETAILS */}
        {data && (
          <>
            <div className="card">
              <div className="card-head">
                <div className="card-icon green">👤</div>
                <div>
                  <div className="card-title">{data.name}</div>
                  <div className="card-sub">Patient Information</div>
                </div>
              </div>

              <div className="card-body">
                <div className="chips">
                  <div className="chip">
                    <div className="chip-icon b">🩸</div>
                    <div>
                      <div className="chip-val">{data.blood_group}</div>
                      <div className="chip-sub">Blood Group</div>
                    </div>
                  </div>

                  <div className="chip">
                    <div className="chip-icon g">📞</div>
                    <div>
                      <div className="chip-val">{data.emergency_contact}</div>
                      <div className="chip-sub">Contact</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 💊 MEDICATIONS */}
            <div className="card">
              <div className="card-head">
                <div className="card-icon yellow">💊</div>
                <div className="card-title">Medications</div>
              </div>

              <div className="card-body">
                <div className="info-list">
                  {medicationsSchedule.map((m, i) => (
                    <div key={i} className="info-item-row">
                      <div className="info-item-icon">💊</div>
                      <div>
                        <div className="info-item-title">{m.medicine}</div>
                        <div className="info-item-sub">
                          {m.timing} • {m.days} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!isEditing && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "15px" }}
                    onClick={handleEditClick}
                  >
                    Edit (Doctor Login Required)
                  </button>
                )}
              </div>
            </div>

            {/* 🔐 DOCTOR LOGIN */}
            {isEditing && !isAuthorized && (
              <div className="card">
                <div className="card-head">
                  <div className="card-icon red">🔐</div>
                  <div className="card-title">Doctor Authorization</div>
                </div>

                <div className="card-body">
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="Doctor ID"
                      onChange={(e) => setDoctorId(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setDoctorPassword(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary" onClick={handleDoctorLogin}>
                    Login
                  </button>
                </div>
              </div>
            )}

            {/* ✏️ EDIT SECTION */}
            {isEditing && isAuthorized && (
              <div className="card">
                <div className="card-head">
                  <div className="card-icon blue">✏️</div>
                  <div className="card-title">Update Patient</div>
                </div>

                <div className="card-body">

                  <div className="section-title">Add Medicine</div>

                  <div className="form-grid-2">
                    <input
                      className="form-input"
                      placeholder="Medicine"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                    />

                    <select
                      className="form-select"
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                    >
                      <option>Before Breakfast</option>
                      <option>After Breakfast</option>
                      <option>Before Lunch</option>
                      <option>After Lunch</option>
                      <option>Before Dinner</option>
                      <option>After Dinner</option>
                    </select>

                    <input
                      className="form-input"
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                    />

                    <input
                      className="form-input"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-outline"
                    style={{ marginTop: "10px" }}
                    onClick={addMedicine}
                  >
                    Add Medicine
                  </button>

                  <div className="section-title" style={{ marginTop: "15px" }}>
                    Next Checkup
                  </div>

                  <input
                    className="form-input"
                    type="date"
                    value={nextCheckup}
                    onChange={(e) => setNextCheckup(e.target.value)}
                  />

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "15px" }}
                    onClick={updatePatient}
                  >
                    Update Patient
                  </button>

                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default PatientDetails;