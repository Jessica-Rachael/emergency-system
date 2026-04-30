import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import MedReminder from "./components/MedReminder";

import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import EmergencyPage from "./pages/EmergencyPage";
import DoctorRegister from "./pages/DoctorRegister";
import Login from "./pages/Login";
import PatientProfile from "./pages/PatientProfile";
import ScanQR from "./pages/ScanQR";
import PatientDetails from "./pages/PatientDetails";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDetails from "./pages/DoctorDetails";

const routeMeta = {
  "/":          { emoji: "🏠", title: "Home", badge: "Welcome", badgeColor: "yellow" },
  "/register":  { emoji: "🧑‍⚕️", title: "Patient Registration", badge: "Register", badgeColor: "green" },
  "/login":     { emoji: "🔐", title: "Login", badge: "Patient Portal", badgeColor: "yellow" },
  "/doctor":    { emoji: "👨‍⚕️", title: "Doctor Registration", badge: "Doctor Portal", badgeColor: "blue" },
  "/emergency": { emoji: "🚨", title: "Emergency Access", badge: "Emergency Mode", badgeColor: "red" },
  "/details":   { emoji: "📄", title: "Patient Details", badge: "Lookup", badgeColor: "blue" },
};

function AppLayout() {
  const location = useLocation();
  const meta =
    routeMeta[location.pathname] || {
      emoji: "🏥",
      title: "EMIAS",
      badge: "Active",
      badgeColor: "yellow",
    };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="main-area">
        <div className="topbar">
          <span className="topbar-emoji">{meta.emoji}</span>
          <span className="topbar-title">{meta.title}</span>
          <div className="topbar-spacer"></div>

          <div className={`topbar-badge ${meta.badgeColor}`}>
            <div className={`badge-dot ${meta.badgeColor}`}></div>
            {meta.badge}
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/doctor" element={<DoctorRegister />} />

          {/* ✅ KEEP YOUR GOOD UI */}
          <Route path="/patient/:id" element={<PatientProfile />} />

          {/* ✅ MOVE DASHBOARD HERE */}
          <Route path="/dashboard/:id" element={<PatientDashboard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/details" element={<PatientDetails />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
        </Routes>
      </div>

      <MedReminder />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;