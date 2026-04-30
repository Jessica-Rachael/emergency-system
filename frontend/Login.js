import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  
  const [role, setRole] = useState("patient");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id.trim() || !password.trim()) {
      alert("Please enter ID and password");
      return;
    }

    const url =
      role === "patient"
        ? "http://localhost:5000/login-patient"
        : "http://localhost:5000/login-doctor";

    const body =
      role === "patient"
        ? { patient_id: id.trim(), password: password.trim() }
        : { doctor_id: id.trim(), password: password.trim() };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // ✅ FINAL FIX (IMPORTANT)
      if (!res.ok || data.success === false) {
        alert(data.message || "Invalid ID or password ❌");
        return;
      }

      // ✅ STORE SESSION
      localStorage.setItem(
        "user",
        JSON.stringify({
          role,
          id: id.trim(),
          data
        })
      );

      console.log("Logged in:", data);

      // ✅ REDIRECT
      if (role === "patient") {
        navigate(`/patient/${id.trim()}`);
      } else {
        navigate(`/doctor/${id.trim()}`);
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="page-content">
      <div className="page-inner">

        <div className="banner yellow">
          <span>📌</span>
          Patients log in using their <strong>&nbsp;Patient ID&nbsp;</strong> and doctors log in using their <strong>&nbsp;Doctor ID&nbsp;</strong>.
        </div>

        <div className="two-col">

          {/* LEFT */}
          <div>
            <div className="card">
              <div className="card-head">
                <div className="card-icon red">🔐</div>
                <div>
                  <div className="card-title">Sign In to Your Account</div>
                  <div className="card-sub">Enter your registered ID and password</div>
                </div>
              </div>

              <div className="card-body">

                <div className="role-tabs">
                  <button
                    className={`role-tab${role === "patient" ? " active" : ""}`}
                    onClick={() => setRole("patient")}
                  >
                    🧑‍⚕️ Patient
                  </button>

                  <button
                    className={`role-tab${role === "doctor" ? " active" : ""}`}
                    onClick={() => setRole("doctor")}
                  >
                    👨‍⚕️ Doctor
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {role === "patient" ? "Patient ID" : "Doctor ID"}
                  </label>

                  <input
                    type="text"
                    className="form-input"
                    placeholder={role === "patient" ? "PAT123456" : "DOC123456"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />

                  <div className="form-hint">
                    Enter your registered ID
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-row-between">
                  <label className="form-remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#" className="form-link">Forgot ID?</a>
                </div>

                <button className="btn btn-primary full" onClick={handleLogin}>
                  Sign In
                </button>

                <button
                  className="btn btn-outline full"
                  style={{ marginTop: 10 }}
                  onClick={() => navigate("/scan")}
                >
                  📷 Scan QR Code
                </button>

                <div className="or-divider">
                  <span>Don't have an account?</span>
                </div>

                <button
                  className="btn btn-outline full"
                  onClick={() =>
                    navigate(role === "patient" ? "/register" : "/doctor")
                  }
                >
                  ➕ {role === "patient"
                    ? "Register as Patient"
                    : "Register as Doctor"}
                </button>

              </div>
            </div>

            <div className="chips">
              <div className="chip">
                <div className="chip-icon b">🔒</div>
                <div><div className="chip-val">Encrypted</div><div className="chip-sub">Secure</div></div>
              </div>

              <div className="chip">
                <div className="chip-icon g">✅</div>
                <div><div className="chip-val">Verified</div><div className="chip-sub">Doctor ID</div></div>
              </div>

              <div className="chip">
                <div className="chip-icon r">📱</div>
                <div><div className="chip-val">QR Access</div><div className="chip-sub">Emergency</div></div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="section-title">
              {role === "patient"
                ? "🧑‍⚕️ What patients can do"
                : "👨‍⚕️ What doctors can do"}
            </div>

            <div className="card">
              <div className="card-body">
                <div className="info-list">

                  {role === "patient" ? (
                    <>
                      <div className="info-item-row">👁 View profile</div>
                      <div className="info-item-row">📱 Download QR</div>
                      <div className="info-item-row">📞 Emergency contact</div>
                    </>
                  ) : (
                    <>
                      <div className="info-item-row">🔍 View patients</div>
                      <div className="info-item-row">✏️ Edit records</div>
                      <div className="info-item-row">📷 Scan QR</div>
                    </>
                  )}

                </div>
              </div>
            </div>

            <div className="banner blue">
              <span>ℹ️</span>
              Use your registered ID to login
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;