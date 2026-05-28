import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Calendar } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

export default function Seguimientos({
  trackings,
  projects,
  collaborators,
  onAddTracking,
  onUpdateTracking,
  onDeleteTracking
}) {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Modal Control States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTracking, setCurrentTracking] = useState(null);
  const [selectedTrackingId, setSelectedTrackingId] = useState(null);

  // Form Fields States
  const [projectId, setProjectId] = useState("");
  const [collaboratorId, setCollaboratorId] = useState("");
  const [date, setDate] = useState("");
  const [progress, setProgress] = useState("");
  const [budgetSpent, setBudgetSpent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("normal");

  // Status mapping to color classes & text
  const statusMap = {
    normal: { label: "Al Día", class: "badge-success" },
    retraso: { label: "Con Retraso", class: "badge-warning" },
    critico: { label: "Crítico", class: "badge-danger" }
  };

  const handleOpenCreate = () => {
    setCurrentTracking(null);
    setProjectId(projects[0]?.id || "");
    setCollaboratorId(collaborators[0]?.id || "");
    setDate(new Date().toISOString().split("T")[0]);
    setProgress("0");
    setBudgetSpent("0");
    setDescription("");
    setStatus("normal");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (seg) => {
    setCurrentTracking(seg);
    setProjectId(seg.projectId);
    setCollaboratorId(seg.collaboratorId || "");
    setDate(seg.date);
    setProgress(seg.progress.toString());
    setBudgetSpent(seg.budgetSpent.toString());
    setDescription(seg.description);
    setStatus(seg.status);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setSelectedTrackingId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectId || !date || progress === "" || budgetSpent === "" || !description.trim()) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    const progNum = parseInt(progress, 10);
    if (progNum < 0 || progNum > 100) {
      alert("El avance debe estar entre 0% y 100%.");
      return;
    }

    const trackingData = {
      projectId,
      collaboratorId: collaboratorId || null,
      date,
      progress: progNum,
      budgetSpent: parseFloat(budgetSpent) || 0,
      description: description.trim(),
      status
    };

    if (currentTracking) {
      onUpdateTracking({ ...trackingData, id: currentTracking.id });
    } else {
      onAddTracking({ ...trackingData, id: `seg-${Date.now()}` });
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedTrackingId) {
      onDeleteTracking(selectedTrackingId);
      setIsDeleteOpen(false);
      setSelectedTrackingId(null);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter trackings list
  const filteredTrackings = trackings.filter((t) => {
    const project = projects.find(p => p.id === t.projectId);
    const projectName = project ? project.name.toLowerCase() : "";
    const colab = collaborators.find(c => c.id === t.collaboratorId);
    const colabName = colab ? colab.name.toLowerCase() : "sin responsable";

    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectName.includes(searchTerm.toLowerCase()) ||
      colabName.includes(searchTerm.toLowerCase());

    const matchesProject = 
      projectFilter === "todos" || 
      t.projectId === projectFilter;

    const matchesStatus = 
      statusFilter === "todos" || 
      t.status === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <div className="trackings-view">
      {/* Top Action Bar */}
      <div className="action-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por obra, descripción o responsable..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Project Filter */}
          <select 
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="todos">Todas las Obras</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos los Avances</option>
            <option value="normal">Al Día</option>
            <option value="retraso">Con Retraso</option>
            <option value="critico">Crítico</option>
          </select>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Nuevo Avance</span>
          </button>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel" style={{ padding: "0.5rem", overflow: "hidden" }}>
        {filteredTrackings.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p className="text-secondary">No se encontraron reportes de bitácora.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Obra / Proyecto</th>
                  <th style={{ width: "35%" }}>Descripción del Avance / Fecha</th>
                  <th>Costo Estimado</th>
                  <th>Avance Global</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackings.map((t) => {
                  const project = projects.find(p => p.id === t.projectId);
                  const collaborator = collaborators.find(c => c.id === t.collaboratorId);
                  const statusDetails = statusMap[t.status] || { label: t.status, class: "badge-info" };

                  return (
                    <tr key={t.id}>
                      {/* Project Link/Label */}
                      <td>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                          {project ? project.name : "Obra eliminada"}
                        </div>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                          {project ? project.category : "N/A"}
                        </span>
                      </td>

                      {/* Description & Date */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--accent-primary)", marginBottom: "0.25rem", fontWeight: "600" }}>
                          <Calendar size={12} />
                          <span>{t.date}</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: "1.4" }}>
                          {t.description}
                        </div>
                      </td>

                      {/* Budget spent in this milestone */}
                      <td style={{ fontWeight: "600" }}>
                        {formatCurrency(t.budgetSpent)}
                      </td>

                      {/* Progress meter */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600" }}>
                            <span>{t.progress}%</span>
                          </div>
                          <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                            <div 
                              style={{ 
                                height: "100%", 
                                width: `${t.progress}%`, 
                                background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                                borderRadius: "3px"
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Responsible Collaborator */}
                      <td>
                        {collaborator ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div 
                              className="avatar-wrapper"
                              style={{
                                width: "24px",
                                height: "24px",
                                fontSize: "0.65rem",
                                background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))"
                              }}
                              title={collaborator.role}
                            >
                              {collaborator.name.split(" ").slice(-1)[0]?.substring(0, 2).toUpperCase() || collaborator.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>{collaborator.name}</span>
                              <span className="text-secondary" style={{ fontSize: "0.7rem" }}>{collaborator.role}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-secondary" style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                            Sin asignar
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td>
                        <span className={`badge ${statusDetails.class}`}>
                          {statusDetails.label}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                          <button 
                            className="btn btn-ghost btn-icon-only" 
                            onClick={() => handleOpenEdit(t)}
                            title="Editar Reporte"
                          >
                            <Edit2 size={16} className="text-teal" />
                          </button>
                          <button 
                            className="btn btn-ghost btn-icon-only" 
                            onClick={() => handleOpenDelete(t.id)}
                            title="Eliminar Reporte"
                          >
                            <Trash2 size={16} className="text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={currentTracking ? "Editar Registro de Bitácora" : "Registrar Reporte de Avance"}
      >
        <form onSubmit={handleSubmit}>
          {/* Project Choice */}
          <div className="form-group">
            <label htmlFor="seg-project">Proyecto / Obra Relacionada *</label>
            <select 
              id="seg-project"
              className="form-control"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              {projects.length === 0 ? (
                <option value="">No hay proyectos creados</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))
              )}
            </select>
          </div>

          {/* Collaborator Choice */}
          <div className="form-group">
            <label htmlFor="seg-collaborator">Responsable del Reporte</label>
            <select 
              id="seg-collaborator"
              className="form-control"
              value={collaboratorId}
              onChange={(e) => setCollaboratorId(e.target.value)}
            >
              <option value="">-- Sin responsable asignado --</option>
              {collaborators.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          {/* Date & Budget Spent */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seg-date">Fecha del Reporte *</label>
              <input 
                type="date" 
                id="seg-date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="seg-budget">Inversión / Costo del Reporte (S/.) *</label>
              <input 
                type="number" 
                id="seg-budget"
                className="form-control"
                placeholder="Presupuesto ejecutado"
                value={budgetSpent}
                onChange={(e) => setBudgetSpent(e.target.value)}
                min="0"
                step="any"
                required
              />
            </div>
          </div>

          {/* Progress Percent & Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seg-progress">Avance Global Acumulado (%) *</label>
              <input 
                type="number" 
                id="seg-progress"
                className="form-control"
                placeholder="0 - 100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                min="0"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Estado del Avance *</label>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "normal", cursor: "pointer", fontSize: "0.8rem" }}>
                  <input 
                    type="radio" 
                    name="seg-status"
                    value="normal" 
                    checked={status === "normal"}
                    onChange={() => setStatus("normal")}
                  />
                  <span className="badge badge-success" style={{ padding: "0.15rem 0.5rem" }}>Al Día</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "normal", cursor: "pointer", fontSize: "0.8rem" }}>
                  <input 
                    type="radio" 
                    name="seg-status"
                    value="retraso" 
                    checked={status === "retraso"}
                    onChange={() => setStatus("retraso")}
                  />
                  <span className="badge badge-warning" style={{ padding: "0.15rem 0.5rem" }}>Retraso</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "normal", cursor: "pointer", fontSize: "0.8rem" }}>
                  <input 
                    type="radio" 
                    name="seg-status"
                    value="critico" 
                    checked={status === "critico"}
                    onChange={() => setStatus("critico")}
                  />
                  <span className="badge badge-danger" style={{ padding: "0.15rem 0.5rem" }}>Crítico</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="seg-desc">Descripción Detallada del Progreso *</label>
            <textarea 
              id="seg-desc"
              className="form-control"
              placeholder="Describa los trabajos completados, contingencias encontradas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={projects.length === 0}>
              {currentTracking ? "Guardar Cambios" : "Crear Registro"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Registro de Bitácora?"
        message="Esta acción no se puede deshacer. Se eliminará el registro de avance seleccionado de forma permanente."
      />
    </div>
  );
}
