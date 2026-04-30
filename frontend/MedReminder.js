import { useEffect, useState } from "react";

function MedReminder() {
  const [popup, setPopup] = useState(null); // { medName, time }
  const [dismissed, setDismissed] = useState([]); // track which alerts were shown today

  useEffect(() => {
    const checkMedications = () => {
      // Get stored medication schedule from localStorage
      const stored = localStorage.getItem("med_schedule");
      if (!stored) return;

      let schedule;
      try {
        schedule = JSON.parse(stored);
      } catch {
        return;
      }

      // Get current time as HH:MM
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, "0") + ":" +
                          now.getMinutes().toString().padStart(2, "0");
      const todayKey = now.toDateString();

      // Check each medication
      schedule.forEach((med) => {
        if (!med.name || !med.time || med.name.toLowerCase() === "none") return;

        const alertKey = `${todayKey}_${med.name}_${med.time}`;

        // Only alert once per day per medication time
        if (dismissed.includes(alertKey)) return;

        if (med.time === currentTime) {
          setPopup({ medName: med.name, time: med.time, alertKey });
        }
      });
    };

    // Check immediately on mount
    checkMedications();

    // Then check every 30 seconds
    const interval = setInterval(checkMedications, 30000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = () => {
    if (popup) {
      setDismissed(prev => [...prev, popup.alertKey]);
    }
    setPopup(null);
  };

  const handleSnooze = () => {
    // Snooze: mark dismissed for now, but re-check in 5 min
    // We do this by removing the alertKey from dismissed after 5 minutes
    if (popup) {
      const key = popup.alertKey;
      setDismissed(prev => [...prev, key]);
      setPopup(null);
      setTimeout(() => {
        setDismissed(prev => prev.filter(k => k !== key));
      }, 5 * 60 * 1000); // 5 minutes
    }
  };

  if (!popup) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9998,
        backdropFilter: "blur(2px)"
      }} onClick={handleDismiss} />

      {/* Popup */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        width: 340,
        overflow: "hidden",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        {/* Red top bar */}
        <div style={{
          background: "linear-gradient(135deg, #e53935, #ef5350)",
          padding: "18px 20px 16px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>💊</div>
          <div style={{
            color: "#fff", fontSize: 15, fontWeight: 700,
            letterSpacing: "0.02em"
          }}>
            Medication Reminder
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11.5, marginTop: 3 }}>
            Scheduled for {popup.time}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px" }}>
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Time to take
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>
              {popup.medName}
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginBottom: 16, lineHeight: 1.5 }}>
            Please take your medication as prescribed.<br />
            Contact your doctor if you have any concerns.
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSnooze}
              style={{
                flex: 1, padding: "10px", border: "1px solid #e5e7eb",
                borderRadius: 8, background: "#f9fafb",
                fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                color: "#374151", fontFamily: "inherit"
              }}
            >
              ⏰ Snooze 5 min
            </button>
            <button
              onClick={handleDismiss}
              style={{
                flex: 1, padding: "10px", border: "none",
                borderRadius: 8, background: "#e53935",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                color: "#fff", fontFamily: "inherit"
              }}
            >
              ✅ Taken
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}

export default MedReminder;
