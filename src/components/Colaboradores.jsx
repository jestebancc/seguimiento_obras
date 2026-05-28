import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Mail, Phone, UserCheck, UserX, Briefcase } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

export default function Colaboradores({ 
  collaborators, 
  onAddCollaborator, 
  onUpdateCollaborator, 
  onDeleteCollaborator, 
  projects 
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Modal Control State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState(null);
  const [selectedColabId, setSelectedColabId] = useState(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("activo");

  // Roles available for selection
  const rolesList = [
    "Arquitecto Principal",
    "Ingeniero Civil",
    "Diseñador de Interiores",
    "Supervisor de Obra",
    "Electricista Principal",
    "Especialista BIM",
    "Topógrafo",
    "Maestro de Obra"
  ];

  // Helper to open form for Create
  const handleOpenCreate = () => {
    setCurrentCollaborator(null);
    setName("");
    setRole(rolesList[0]);
    setEmail("");
    setPhone("");
    setStatus("activo");
    setIsFormOpen(true);
  };

  // Helper to open form for Edit
  const handleOpenEdit = (colab) => {
    setCurrentCollaborator(colab);
    setName(colab.name);
    setRole(colab.role);
    setEmail(colab.email);
    setPhone(colab.phone);
    setStatus(colab.status);
    setIsFormOpen(true);
  };

  // Helper to open delete confirmation
  const handleOpenDelete = (id) => {
    setSelectedColabId(id);
    setIsDeleteOpen(true);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Form validation
    if (!name.trim() || !role || !email.trim()) return;

    const colabData = {
      name: name.trim(),
      role,
      email: email.trim(),
      phone: phone.trim(),
      status
    };

    if (currentCollaborator) {
      // Edit mode
      onUpdateCollaborator({ ...colabData, id: currentCollaborator.id });
    } else {
      // Create mode
      onAddCollaborator({ ...colabData, id: `col-${Date.now()}` });
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedColabId) {
      onDeleteCollaborator(selectedColabId);
      setIsDeleteOpen(false);
      setSelectedColabId(null);
    }
  };

  // Calculate projects count for each collaborator
  const getProjectsCount = (colabId) => {
    return projects.filter(p => p.collaborators && p.collaborators.includes(colabId)).length;
  };

  // Filtering logic
  const filteredCollaborators = collaborators.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "todos" || 
      c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="collaborators-view">
      {/* Top Action Bar */}
      <div className="action-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o cargo..." 
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
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Nuevo Colaborador</span>
          </button>
        </div>
      </div>

      {/* Grid of Profile Cards */}
      {filteredCollaborators.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <p className="text-secondary">No se encontraron colaboradores que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredCollaborators.map((c) => {
            const initials = c.name.split(" ").slice(-1)[0]?.substring(0, 2).toUpperCase() || c.name.substring(0, 2).toUpperCase();
            const projCount = getProjectsCount(c.id);
            return (
              <div key={c.id} className="glass-panel profile-card glass-panel-hover">
                <div className="profile-header">
                  <div className="avatar-wrapper" style={{ 
                    background: c.status === "activo" ? "linear-gradient(135deg, var(--accent-primary), #0d9488)" : "var(--bg-tertiary)",
                    border: c.status === "activo" ? "none" : "1px solid var(--border-light)"
                  }}>
                    {initials}
                  </div>
                  <div className="profile-info">
                    <h4 className="profile-name">{c.name}</h4>
                    <span className="profile-role">{c.role}</span>
                  </div>
                </div>

                <div className="profile-body">
                  <div className="profile-body-item">
                    <Mail size={14} className="text-secondary" />
                    <span>{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="profile-body-item">
                      <Phone size={14} className="text-secondary" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  <div className="profile-body-item">
                    <Briefcase size={14} className="text-secondary" />
                    <span>{projCount} {projCount === 1 ? "proyecto asignado" : "proyectos asignados"}</span>
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className={`badge badge-dot ${c.status === "activo" ? "badge-success" : "badge-danger"}`}>
                      {c.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    className="btn btn-ghost btn-icon-only" 
                    onClick={() => handleOpenEdit(c)}
                    title="Editar Colaborador"
                  >
                    <Edit2 size={16} className="text-teal" />
                  </button>
                  <button 
                    className="btn btn-ghost btn-icon-only" 
                    onClick={() => handleOpenDelete(c.id)}
                    title="Eliminar Colaborador"
                  >
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reusable Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={currentCollaborator ? "Editar Colaborador" : "Agregar Nuevo Colaborador"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name-input">Nombre Completo *</label>
            <input 
              type="text" 
              id="name-input"
              className="form-control"
              placeholder="Ej. Arq. Carlos Slim"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role-select">Cargo / Especialidad *</label>
            <select 
              id="role-select"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              {rolesList.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email-input">Correo Electrónico *</label>
              <input 
                type="email" 
                id="email-input"
                className="form-control"
                placeholder="ejemplo@obras.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone-input">Teléfono Celular</label>
              <input 
                type="tel" 
                id="phone-input"
                className="form-control"
                placeholder="Ej. +51 987 654 321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estado de Actividad *</label>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "normal", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="status"
                  value="activo" 
                  checked={status === "activo"}
                  onChange={() => setStatus("activo")}
                />
                <span className="badge badge-success" style={{ padding: "0.15rem 0.5rem" }}>Activo</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "normal", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="status"
                  value="inactivo" 
                  checked={status === "inactivo"}
                  onChange={() => setStatus("inactivo")}
                />
                <span className="badge badge-danger" style={{ padding: "0.15rem 0.5rem" }}>Inactivo</span>
              </label>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {currentCollaborator ? "Guardar Cambios" : "Crear Colaborador"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Colaborador?"
        message="Esta acción no se puede deshacer. Se desvinculará de todos sus proyectos asignados."
      />
    </div>
  );
}
