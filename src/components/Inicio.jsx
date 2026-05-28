import React from "react";
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Activity
} from "lucide-react";

export default function Inicio({ projects, collaborators, trackings = [], setCurrentTab }) {
  // 1. Calculate KPI Metrics
  const totalProjects = projects.length;
  const totalCollaborators = collaborators.length;
  const totalTrackings = trackings.length;
  const recentTrackings = [...trackings].slice(-3).reverse();
  
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === "progreso").length;
  
  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Percentage calculations for graphical widgets
  const progressPercent = totalProjects > 0 
    ? Math.round((activeProjectsCount / totalProjects) * 100) 
    : 0;

  const activeColabsCount = collaborators.filter(c => c.status === "activo").length;
  const colabsPercent = totalCollaborators > 0 
    ? Math.round((activeColabsCount / totalCollaborators) * 100) 
    : 0;

  // Recent lists
  const recentProjects = [...projects].slice(-3).reverse();
  const recentCollaborators = [...collaborators].slice(-3).reverse();

  // Status mapping to badge classes
  const statusMap = {
    planificacion: { label: "Planificación", class: "badge-warning" },
    progreso: { label: "En Progreso", class: "badge-info" },
    completado: { label: "Completado", class: "badge-success" },
    pausado: { label: "Pausado", class: "badge-danger" }
  };

  // Circular progress stroke calculation
  const strokeRadius = 50;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  
  const getStrokeDashOffset = (percent) => {
    return strokeCircumference - (percent / 100) * strokeCircumference;
  };

  return (
    <div className="dashboard-view">
      <div className="dashboard-welcome">
        <h1 className="page-title">Bienvenido a ObrasControl</h1>
        <p className="text-secondary">Monitorea y gestiona tus proyectos constructivos y equipos colaboradores en tiempo real.</p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        <div className="glass-panel stat-card teal">
          <div className="stat-icon-wrapper">
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Proyectos</span>
            <span className="stat-value">{totalProjects}</span>
          </div>
        </div>

        <div className="glass-panel stat-card indigo">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Colaboradores</span>
            <span className="stat-value">{totalCollaborators}</span>
          </div>
        </div>

        <div className="glass-panel stat-card violet">
          <div className="stat-icon-wrapper">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Presupuesto Total</span>
            <span className="stat-value">{formatCurrency(totalBudget)}</span>
          </div>
        </div>

        <div className="glass-panel stat-card amber">
          <div className="stat-icon-wrapper">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Obras Activas</span>
            <span className="stat-value">{activeProjectsCount}</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ borderLeft: "3px solid var(--accent-primary)" }}>
          <div className="stat-icon-wrapper" style={{ color: "var(--accent-primary)", background: "var(--accent-primary-glow)", borderColor: "rgba(20, 184, 166, 0.2)" }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Avances Obra</span>
            <span className="stat-value">{totalTrackings}</span>
          </div>
        </div>
      </div>

      {/* Graphics & Distribution */}
      <div className="details-grid">
        <div className="glass-panel col-12 col-lg-6" style={{ padding: "1.5rem", gridColumn: "span 6", display: "flex", flexDirection: "column", minWidth: "300px" }}>
          <h3 className="section-title">Distribución y Rendimiento</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "2rem", margin: "auto 0" }}>
            
            {/* Project Progress Widget */}
            <div style={{ textAlign: "center" }}>
              <div className="circular-progress">
                <svg>
                  <circle className="bg-circle" cx="60" cy="60" r={strokeRadius} />
                  <circle 
                    className="progress-circle" 
                    cx="60" 
                    cy="60" 
                    r={strokeRadius} 
                    strokeDasharray={strokeCircumference}
                    strokeDashoffset={getStrokeDashOffset(progressPercent)}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-number">{progressPercent}%</span>
                  <span className="progress-label">Activos</span>
                </div>
              </div>
              <p style={{ marginTop: "1rem", fontWeight: "600", fontSize: "0.9rem" }}>Proyectos en Progreso</p>
              <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{activeProjectsCount} de {totalProjects} obras</span>
            </div>

            {/* Collaborators Progress Widget */}
            <div style={{ textAlign: "center" }}>
              <div className="circular-progress">
                <svg>
                  <circle className="bg-circle" cx="60" cy="60" r={strokeRadius} />
                  <circle 
                    className="progress-circle" 
                    cx="60" 
                    cy="60" 
                    r={strokeRadius} 
                    strokeDasharray={strokeCircumference}
                    strokeDashoffset={getStrokeDashOffset(colabsPercent)}
                    style={{ stroke: "var(--accent-secondary)" }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-number">{colabsPercent}%</span>
                  <span className="progress-label">Activos</span>
                </div>
              </div>
              <p style={{ marginTop: "1rem", fontWeight: "600", fontSize: "0.9rem" }}>Equipos Operativos</p>
              <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{activeColabsCount} de {totalCollaborators} activos</span>
            </div>

          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-panel col-12 col-lg-6" style={{ padding: "1.5rem", gridColumn: "span 6", minWidth: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Proyectos Recientes</h3>
            <button className="btn btn-ghost" onClick={() => setCurrentTab("proyectos")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}>
              Ver todo <ArrowRight size={14} />
            </button>
          </div>

          <div className="dashboard-list">
            {recentProjects.length === 0 ? (
              <p className="text-secondary" style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem" }}>No hay proyectos registrados.</p>
            ) : (
              recentProjects.map((p) => {
                const statusDetails = statusMap[p.status] || { label: p.status, class: "badge-info" };
                return (
                  <div key={p.id} className="dashboard-list-item">
                    <div>
                      <div className="list-item-title">{p.name}</div>
                      <div className="list-item-subtitle">{p.category} • {formatCurrency(p.budget)}</div>
                    </div>
                    <span className={`badge ${statusDetails.class}`}>{statusDetails.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Collaborators & Timeline Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
        {/* Column 1: Recent Collaborators */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Nuevos Colaboradores</h3>
            <button className="btn btn-ghost" onClick={() => setCurrentTab("colaboradores")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}>
              Ver todo <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentCollaborators.length === 0 ? (
              <p className="text-secondary" style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem" }}>No hay colaboradores registrados.</p>
            ) : (
              recentCollaborators.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-light)" }}>
                  <div className="avatar-wrapper" style={{ 
                    width: "36px", 
                    height: "36px", 
                    fontSize: "0.8rem",
                    background: c.status === "activo" ? "linear-gradient(135deg, var(--accent-primary), #0d9488)" : "var(--bg-tertiary)",
                    border: c.status === "activo" ? "none" : "1px solid var(--border-light)"
                  }}>
                    {c.name.split(" ").slice(-1)[0]?.substring(0, 2).toUpperCase() || c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>{c.name}</span>
                    <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{c.role}</span>
                  </div>
                  <span className={`badge badge-dot ${c.status === "activo" ? "badge-success" : "badge-danger"}`} style={{ fontSize: "0.7rem", padding: 0 }}>
                    {c.status === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Recent Bitácora Feed (Seguimientos) */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Últimos Avances (Bitácora)</h3>
            <button className="btn btn-ghost" onClick={() => setCurrentTab("seguimientos")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}>
              Ver todo <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentTrackings.length === 0 ? (
              <p className="text-secondary" style={{ padding: "1rem", textAlign: "center", fontSize: "0.85rem" }}>No hay avances reportados aún.</p>
            ) : (
              recentTrackings.map((t, idx) => {
                const proj = projects.find(p => p.id === t.projectId);
                const colab = collaborators.find(c => c.id === t.collaboratorId);
                const statusMapLocal = {
                  normal: { class: "badge-success", label: "Al Día" },
                  retraso: { class: "badge-warning", label: "Con Retraso" },
                  critico: { class: "badge-danger", label: "Crítico" }
                };
                const statusDetails = statusMapLocal[t.status] || { class: "badge-info", label: t.status };
                
                return (
                  <div key={t.id} style={{
                    display: "flex",
                    gap: "0.75rem",
                    paddingBottom: idx !== recentTrackings.length - 1 ? "0.75rem" : "0",
                    borderBottom: idx !== recentTrackings.length - 1 ? "1px solid var(--border-light)" : "none"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: t.status === "critico" ? "var(--status-danger)" : t.status === "retraso" ? "var(--status-warning)" : "var(--accent-primary)",
                        boxShadow: t.status === "critico" ? "0 0 6px var(--status-danger)" : t.status === "retraso" ? "0 0 6px var(--status-warning)" : "0 0 6px var(--accent-primary)",
                        marginTop: "6px"
                      }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "0.15rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                          {proj ? proj.name : "Obra"}
                        </span>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{t.date}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        {t.description.length > 75 ? t.description.substring(0, 75) + "..." : t.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.15rem" }}>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                          Avance: <strong style={{ color: "var(--text-primary)" }}>{t.progress}%</strong> • {colab ? colab.name.split(" ").slice(-1)[0] : "Sin asignar"}
                        </span>
                        <span className={`badge ${statusDetails.class}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                          {statusDetails.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
