import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Calendar, DollarSign, Users, Briefcase } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

export default function Proyectos({ 
  projects, 
  collaborators, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Modal Control State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residencial");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [assignedColabs, setAssignedColabs] = useState([]);

  const categories = ["Residencial", "Comercial", "Industrial", "Infraestructura"];

  // Spanish status mappings
  const statusMap = {
    planificacion: { label: "Planificación", class: "badge-warning" },
    progreso: { label: "En Progreso", class: "badge-info" },
    completado: { label: "Completado", class: "badge-success" },
    pausado: { label: "Pausado", class: "badge-danger" }
  };

  const handleOpenCreate = () => {
    setCurrentProject(null);
    setName("");
    setDescription("");
    setCategory("Residencial");
    
    // Default dates
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate("");
    setBudget("");
    setAssignedColabs([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setCurrentProject(proj);
    setName(proj.name);
    setDescription(proj.description || "");
    setCategory(proj.category);
    setStartDate(proj.startDate);
    setEndDate(proj.endDate);
    setBudget(proj.budget.toString());
    setAssignedColabs(proj.collaborators || []);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setSelectedProjectId(id);
    setIsDeleteOpen(true);
  };

  const handleToggleColab = (colabId) => {
    if (assignedColabs.includes(colabId)) {
      setAssignedColabs(assignedColabs.filter(id => id !== colabId));
    } else {
      setAssignedColabs([...assignedColabs, colabId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !category || !startDate || !endDate || !budget) return;

    // Enforce logic: End date must be after start date
    if (new Date(endDate) < new Date(startDate)) {
      alert("La fecha de finalización no puede ser anterior a la de inicio.");
      return;
    }

    const projectData = {
      name: name.trim(),
      description: description.trim(),
      category,
      startDate,
      endDate,
      budget: parseFloat(budget) || 0,
      collaborators: assignedColabs,
      status: currentProject ? currentProject.status : "planificacion" // defaults to planificacion on create
    };

    if (currentProject) {
      onUpdateProject({ ...projectData, id: currentProject.id, status: currentProject.status });
    } else {
      onAddProject({ ...projectData, id: `proj-${Date.now()}` });
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProjectId) {
      onDeleteProject(selectedProjectId);
      setIsDeleteOpen(false);
      setSelectedProjectId(null);
    }
  };

  const handleStatusChange = (proj, newStatus) => {
    onUpdateProject({ ...proj, status: newStatus });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter projects list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === "todos" || 
      p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="projects-view">
      {/* Top Action Bar */}
      <div className="action-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos los Estados</option>
            <option value="planificacion">Planificación</option>
            <option value="progreso">En Progreso</option>
            <option value="completado">Completados</option>
            <option value="pausado">Pausados</option>
          </select>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel" style={{ padding: "0.5rem", overflow: "hidden" }}>
        {filteredProjects.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p className="text-secondary">No se encontraron proyectos activos.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Obra / Categoría</th>
                  <th>Presupuesto</th>
                  <th>Plazo / Cronograma</th>
                  <th>Equipo Asignado</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => {
                  const statusDetails = statusMap[p.status] || { label: p.status, class: "badge-info" };
                  
                  return (
                    <tr key={p.id}>
                      {/* Name & Category */}
                      <td>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{p.name}</div>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{p.category}</span>
                      </td>

                      {/* Budget */}
                      <td style={{ fontWeight: "600" }}>
                        {formatCurrency(p.budget)}
                      </td>

                      {/* Plazo / Cronograma */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          <Calendar size={14} className="text-teal" />
                          <span>{p.startDate} al {p.endDate}</span>
                        </div>
                      </td>

                      {/* Stacked Avatars for Assigned Collaborators */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {p.collaborators && p.collaborators.length > 0 ? (
                            <div style={{ display: "flex", position: "relative" }}>
                              {p.collaborators.map((colabId, idx) => {
                                const colab = collaborators.find(c => c.id === colabId);
                                if (!colab) return null;
                                const initials = colab.name.split(" ").slice(-1)[0]?.substring(0, 2).toUpperCase() || colab.name.substring(0, 2).toUpperCase();
                                return (
                                  <div 
                                    key={colabId} 
                                    className="avatar-wrapper"
                                    title={`${colab.name} (${colab.role})`}
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      fontSize: "0.75rem",
                                      marginLeft: idx > 0 ? "-8px" : "0",
                                      border: "2px solid var(--bg-secondary)",
                                      zIndex: 10 - idx,
                                      background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))"
                                    }}
                                  >
                                    {initials}
                                  </div>
                                );
                              })}
                              {p.collaborators.length > 3 && (
                                <div 
                                  className="avatar-wrapper"
                                  title="Más colaboradores asignados"
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    fontSize: "0.7rem",
                                    marginLeft: "-8px",
                                    border: "2px solid var(--bg-secondary)",
                                    zIndex: 1,
                                    background: "var(--bg-tertiary)",
                                    fontWeight: "600"
                                  }}
                                >
                                  +{p.collaborators.length - 3}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-secondary" style={{ fontSize: "0.8rem" }}>Sin asignar</span>
                          )}
                        </div>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td>
                        <select
                          className={`badge ${statusDetails.class}`}
                          value={p.status}
                          onChange={(e) => handleStatusChange(p, e.target.value)}
                          style={{ 
                            border: "1px solid rgba(255,255,255,0.08)",
                            cursor: "pointer",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "12px",
                            appearance: "none",
                            textAlign: "center"
                          }}
                        >
                          <option value="planificacion" className="badge-warning">Planificación</option>
                          <option value="progreso" className="badge-info">En Progreso</option>
                          <option value="completado" className="badge-success">Completado</option>
                          <option value="pausado" className="badge-danger">Pausado</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                          <button 
                            className="btn btn-ghost btn-icon-only" 
                            onClick={() => handleOpenEdit(p)}
                            title="Editar Proyecto"
                          >
                            <Edit2 size={16} className="text-teal" />
                          </button>
                          <button 
                            className="btn btn-ghost btn-icon-only" 
                            onClick={() => handleOpenDelete(p.id)}
                            title="Eliminar Proyecto"
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
        title={currentProject ? "Editar Proyecto Constructivo" : "Registrar Nueva Obra"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="proj-name">Nombre del Proyecto *</label>
            <input 
              type="text" 
              id="proj-name"
              className="form-control"
              placeholder="Ej. Sede Central Corporativa - Acabados"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="proj-desc">Descripción / Alcance</label>
            <textarea 
              id="proj-desc"
              className="form-control"
              placeholder="Describa el alcance de los trabajos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proj-cat">Categoría *</label>
              <select 
                id="proj-cat"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="proj-budget">Presupuesto Estimado (S/.) *</label>
              <input 
                type="number" 
                id="proj-budget"
                className="form-control"
                placeholder="Presupuesto en Soles"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                step="any"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proj-start">Fecha de Inicio *</label>
              <input 
                type="date" 
                id="proj-start"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj-end">Fecha Límite (Entrega) *</label>
              <input 
                type="date" 
                id="proj-end"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Assigned Collaborators Multi-Select */}
          <div className="form-group">
            <label>Asignar Equipo Colaborador</label>
            <div 
              style={{ 
                maxHeight: "130px", 
                overflowY: "auto", 
                border: "1px solid var(--border-light)", 
                padding: "0.5rem", 
                borderRadius: "10px", 
                background: "rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              {collaborators.length === 0 ? (
                <span className="text-secondary" style={{ fontSize: "0.85rem", padding: "0.25rem" }}>
                  No hay colaboradores disponibles. Regístrelos primero.
                </span>
              ) : (
                collaborators.map((c) => (
                  <label 
                    key={c.id} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem", 
                      fontSize: "0.85rem", 
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "6px",
                      background: assignedColabs.includes(c.id) ? "rgba(255,255,255,0.02)" : "transparent"
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={assignedColabs.includes(c.id)}
                      onChange={() => handleToggleColab(c.id)}
                    />
                    <span>{c.name} - <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{c.role}</span></span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {currentProject ? "Guardar Cambios" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Obra?"
        message="Esta acción no se puede deshacer. Se eliminarán permanentemente los registros de esta obra."
      />
    </div>
  );
}
