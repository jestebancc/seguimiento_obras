import React, { useState, useEffect } from "react";
import { Menu, Calendar, User, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar({ currentTab, isSidebarOpen, setIsSidebarOpen }) {
  const { logout, userData } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    // Localize in Spanish as it fits "seguimiento de obras" perfectly
    const today = new Date().toLocaleDateString("es-ES", options);
    // Capitalize the first letter
    setCurrentDate(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  const getPageTitle = () => {
    switch (currentTab) {
      case "inicio":
        return "Resumen General";
      case "proyectos":
        return "Gestión de Proyectos";
      case "colaboradores":
        return "Control de Colaboradores";
      case "seguimientos":
        return "Bitácora y Avances de Obra";
      default:
        return "Seguimiento de Obras";
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Menú"
        >
          <Menu size={20} />
        </button>
        <h2 className="navbar-title">{getPageTitle()}</h2>
      </div>

      <div className="navbar-right">
        <div className="navbar-date-chip">
          <Calendar size={16} className="text-teal" />
          <span>{currentDate}</span>
        </div>

        {/*<button className="navbar-notification-btn" title="Notificaciones">
          <Bell size={18} />
          <span className="notification-badge-dot"></span>
        </button>*/}

        <div className="navbar-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="profile-meta">
              <span className="profile-user-name">{userData?.phone}</span>
              <span className="profile-user-role">Administrador</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-ghost btn-icon-only"
            title="Cerrar sesión"
            style={{
              marginLeft: '0.25rem',
              color: 'var(--text-secondary)',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
          >
            <LogOut size={20} className="text-danger" />
          </button>
        </div>
      </div>
    </header>
  );
}
