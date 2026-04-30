import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: "/",          emoji: "🏠",  label: "Home",                section: "Main"      },
    { to: "/register",  emoji: "🧑‍⚕️", label: "Patient Registration", section: "Patient"   },
    { to: "/patients",  emoji: "📋",  label: "Patient Records",      section: null        },
    { to: "/login",     emoji: "🔐",  label: "Login",        section: null        },
    { to: "/doctor",    emoji: "👨‍⚕️", label: "Doctor Registration",  section: "Doctor"    },
    { to: "/emergency", emoji: "🚨",  label: "Emergency Access",     section: "Emergency" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏥</div>
        <div>
          <div className="sidebar-logo-text">MedID System</div>
          <div className="sidebar-logo-sub">Emergency Access Platform</div>
        </div>
      </div>

      <nav>
        {navItems.map((item, i) => {
          const isActive = path === item.to;
          const prevSection = i > 0 ? navItems[i - 1].section : null;
          const showSection = item.section && item.section !== prevSection;
          return (
            <div key={item.to}>
              {showSection && (
                <div className="nav-section">{item.section}</div>
              )}
              <Link
                to={item.to}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <span className="nav-item-dot"></span>
                <span className="nav-item-emoji">{item.emoji}</span>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="online-chip">
          <div className="online-dot"></div>
          <span className="online-text">System Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
