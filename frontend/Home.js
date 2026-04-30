import React, { useEffect, useState } from "react";

function Home() {

  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    emergency: 0,
    qr: 0
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 TIME FORMAT */
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + " hr ago";

    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + " min ago";

    return "Just now";
  };

  /* 🔥 LOAD DATA */
  const loadData = () => {
    setLoading(true);

    fetch("http://localhost:5000/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/activities")
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  /* 🔁 AUTO REFRESH */
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content">
      <div className="page-inner">

        {/* Topbar */}
        <div className="topbar" style={{ marginBottom: 0 }}>
          <span className="topbar-emoji">🏠</span>
          <span className="topbar-title">Home</span>
          <div className="topbar-spacer"></div>
          <div className="topbar-badge yellow">
            <div className="badge-dot yellow"></div>
            Welcome
          </div>
        </div>

        {/* Stats */}
        <div className="stat-row" style={{ marginTop: 16 }}>
          <div className="stat">
            <div className="stat-icon b">🧑‍⚕️</div>
            <div>
              <div className="stat-val">{stats.patients}</div>
              <div className="stat-label">Patients Registered</div>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon g">👨‍⚕️</div>
            <div>
              <div className="stat-val">{stats.doctors}</div>
              <div className="stat-label">Doctors Verified</div>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon r">🚨</div>
            <div>
              <div className="stat-val">{stats.emergency}</div>
              <div className="stat-label">Emergency Accesses Today</div>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon y">📱</div>
            <div>
              <div className="stat-val">{stats.qr}</div>
              <div className="stat-label">QR Codes Generated</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="two-col">

          {/* LEFT SIDE */}
          <div>

            {/* Hero */}
            <div className="hero-card">
              <div className="hero-badge"><div className="hero-dot"></div> Emergency Ready</div>
              <div className="hero-title">
                Emergency <span>Medical</span><br />Information Access
              </div>
              <div className="hero-desc">
                EMIAS gives every patient a unique QR code linked to their complete medical profile.
                In an emergency, doctors scan the QR to instantly see blood group, allergies,
                and medications — even if the patient is unconscious.
              </div>
            </div>

            {/* Features */}
            <div className="section-title">✨ Key Features</div>
            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🧑‍⚕️</span>
                <div>
                  <div className="feature-title">Patient Registration</div>
                  <div className="feature-sub">Store history, get QR code</div>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">👨‍⚕️</span>
                <div>
                  <div className="feature-title">Doctor Access</div>
                  <div className="feature-sub">View & edit patient records</div>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div>
                  <div className="feature-title">QR Emergency Scan</div>
                  <div className="feature-sub">Instant profile access</div>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div>
                  <div className="feature-title">Role-Based Security</div>
                  <div className="feature-sub">Only doctors can edit</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="section-title">⚙️ How It Works</div>
            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-icon">📝</div>
                <div className="step-title">Patient Registers</div>
                <div className="step-desc">Fill details, get Patient ID and QR</div>
              </div>

              <div className="step">
                <div className="step-num">2</div>
                <div className="step-icon">📱</div>
                <div className="step-title">Carry QR Card</div>
                <div className="step-desc">Save or print QR</div>
              </div>

              <div className="step">
                <div className="step-num">3</div>
                <div className="step-icon">🔍</div>
                <div className="step-title">Doctor Scans</div>
                <div className="step-desc">Instant access</div>
              </div>
            </div>

            {/* About */}
            <div className="section-title">ℹ️ About EMIAS</div>
            <div className="card">
              <div className="card-body">
                <p>
                  EMIAS is built using React, Node.js, Express, and SQLite.
                  It ensures emergency medical data is instantly accessible.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            {/* Quick Access */}
            <div className="card">
              <div className="card-head">
                <div className="card-icon red">🔐</div>
                <div>
                  <div className="card-title">Quick Access</div>
                  <div className="card-sub">Jump to any section</div>
                </div>
              </div>

              <div className="card-body">
                <div className="quick-grid">
                  <a href="/register"><div className="quick-card">🧑‍⚕️ Register Patient</div></a>
                  <a href="/doctor"><div className="quick-card">👨‍⚕️ Register Doctor</div></a>
                  <a href="/login"><div className="quick-card">🔐 Login</div></a>
                  <a href="/emergency"><div className="quick-card red-hover">🚨 Emergency</div></a>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="section-title" style={{ marginTop: 12 }}>🕐 Recent Activity</div>
            <div className="card">
              <div className="activity-list">

                {loading ? (
                  <div style={{ padding: "10px" }}>Loading...</div>
                ) : activities.length === 0 ? (
                  <div style={{ padding: "10px" }}>No activity yet</div>
                ) : (
                  activities.map((act, index) => (
                    <div className="activity-item" key={index}>
                      <div className="activity-dot"></div>
                      <div className="activity-text">{act.message}</div>
                      <div className="activity-time">
                        {timeAgo(act.time)}
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;