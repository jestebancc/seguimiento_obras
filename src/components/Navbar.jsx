import React, { useState, useEffect } from "react";
import { Menu, Calendar, User, Bell } from "lucide-react";

export default function Navbar({ currentTab, isSidebarOpen, setIsSidebarOpen }) {
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

        <button className="navbar-notification-btn" title="Notificaciones">
          <Bell size={18} />
          <span className="notification-badge-dot"></span>
        </button>

        <div className="navbar-profile">
          <div className="profile-avatar">JC</div>
          <div className="profile-meta">
            <span className="profile-user-name">Jecc Obras</span>
            <span className="profile-user-role">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}
