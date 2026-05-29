import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

// Helper to handle local storage fallback for trackings
import { loadTrackings, saveTrackings } from "../utils/dummyData";

export default function ComponenteCrud({ config }) {
  const { title, endpoint, columns, fields } = config;

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({});
  // External options cache for fields that have `optionsEndpoint`
  const [externalOptions, setExternalOptions] = useState({});

  // Auth Headers
  const headers = {
    "Content-Type": "application/json",
    "user_role": "administrador",
    "user_cliente_id": "00000000-0000-0000-0000-000000000000",
    "user_id": "00000000-0000-0000-0000-000000000000"
  };

  // --- DATA FETCHING ---
  const fetchData = async () => {
    if (endpoint.startsWith("local://")) {
      setData(loadTrackings());
      return;
    }
    try {
      const response = await fetch(endpoint, { method: "GET", headers });
      if (response.ok) {
        const json = await response.json();
        setData(Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}`, err);
    }
  };

  // Pre-fetch foreign options for dynamic select fields
  const fetchExternalOptions = async () => {
    const newExternalOptions = {};
    for (const field of fields) {
      if (field.optionsEndpoint) {
        try {
          const res = await fetch(field.optionsEndpoint, { method: "GET", headers });
          if (res.ok) {
            const json = await res.json();
            newExternalOptions[field.name] = Array.isArray(json) ? json : [];
          }
        } catch (err) {
          console.error(`Error fetching options for ${field.name}`, err);
        }
      }
    }
    setExternalOptions(newExternalOptions);
  };

  useEffect(() => {
    fetchData();
    fetchExternalOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setCurrentItemId(null);
    // Initialize form data
    const initialData = {};
    fields.forEach(f => {
      if (f.type === "multiselect") initialData[f.name] = [];
      else initialData[f.name] = "";
    });
    setFormData(initialData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentItemId(item.id);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setCurrentItemId(id);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiselectToggle = (name, value) => {
    setFormData(prev => {
      const currentList = prev[name] || [];
      if (currentList.includes(value)) {
        return { ...prev, [name]: currentList.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...currentList, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      cliente_id: "00000000-0000-0000-0000-000000000000" // dummy mapping
    };

    if (endpoint.startsWith("local://")) {
      // Handle local dummy fallback
      let updatedData = [];
      if (currentItemId) {
        updatedData = data.map(item => item.id === currentItemId ? { ...item, ...payload } : item);
      } else {
        updatedData = [...data, { ...payload, id: `loc-${Date.now()}` }];
      }
      setData(updatedData);
      saveTrackings(updatedData);
      setIsFormOpen(false);
      return;
    }

    try {
      if (currentItemId) {
        // UPDATE
        const res = await fetch(`${endpoint}/${currentItemId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      } else {
        // CREATE
        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error saving data", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (endpoint.startsWith("local://")) {
      const updatedData = data.filter(item => item.id !== currentItemId);
      setData(updatedData);
      saveTrackings(updatedData);
      setIsDeleteOpen(false);
      return;
    }

    try {
      const res = await fetch(`${endpoint}/${currentItemId}`, {
        method: "DELETE",
        headers
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error deleting data", err);
    }
    setIsDeleteOpen(false);
  };

  // --- RENDERING HELPERS ---
  const formatValue = (item, col) => {
    const val = item[col.key];
    if (col.type === "currency") {
      return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 0 }).format(Number(val) || 0);
    }
    if (col.type === "badge") {
      return <span className={`badge ${val === 'activo' || val === 'completado' ? 'badge-success' : val === 'pausado' || val === 'inactivo' ? 'badge-danger' : 'badge-info'}`}>{val}</span>;
    }
    if (col.type === "progress") {
      return `${val}%`;
    }
    // Handle foreign key labels if data is pre-fetched
    if (col.type === "foreign" && externalOptions[col.key]) {
      const foreignItem = externalOptions[col.key].find(o => o.id === val);
      return foreignItem ? foreignItem[col.foreignLabel] : val;
    }
    return val;
  };

  const filteredData = data.filter(item => {
    // Basic search filtering string values
    if (!searchTerm) return true;
    return Object.values(item).some(v => 
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="crud-view">
      {/* ACTION BAR */}
      <div className="action-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>{title}</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} /> Nuevo
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-panel" style={{ padding: "0.5rem", overflowX: "auto" }}>
        <table className="premium-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              {columns.map(col => <th key={col.key} style={{ padding: "1rem", textAlign: "left" }}>{col.label}</th>)}
              <th style={{ textAlign: "right", padding: "1rem" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "2rem" }}>No hay registros disponibles.</td>
              </tr>
            ) : (
              filteredData.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: "1rem" }}>{formatValue(item, col)}</td>
                  ))}
                  <td style={{ textAlign: "right", padding: "1rem" }}>
                    <button className="btn btn-ghost btn-icon-only" onClick={() => handleOpenEdit(item)}><Edit2 size={16} className="text-teal" /></button>
                    <button className="btn btn-ghost btn-icon-only" onClick={() => handleOpenDelete(item.id)}><Trash2 size={16} className="text-danger" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DYNAMIC FORM MODAL */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={currentItemId ? `Editar ${title}` : `Nuevo ${title}`}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {fields.map(field => (
            <div key={field.name} className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>{field.label} {field.required && "*"}</label>
              
              {field.type === "text" || field.type === "email" || field.type === "number" || field.type === "date" ? (
                <input 
                  type={field.type}
                  className="form-control"
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-light)", color: "white" }}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  className="form-control"
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-light)", color: "white", minHeight: "80px" }}
                />
              ) : field.type === "select" ? (
                <select
                  className="form-control"
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-light)", color: "white" }}
                >
                  <option value="">Seleccione...</option>
                  {field.optionsEndpoint && externalOptions[field.name] ? (
                    externalOptions[field.name].map(opt => (
                      <option key={opt[field.optionValue]} value={opt[field.optionValue]}>
                        {opt[field.optionLabel]}
                      </option>
                    ))
                  ) : (
                    field.options && field.options.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))
                  )}
                </select>
              ) : field.type === "radio" ? (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {field.options.map((opt, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input 
                        type="radio" 
                        name={field.name} 
                        value={opt.value}
                        checked={formData[field.name] === opt.value}
                        onChange={(e) => handleFormChange(field.name, e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              ) : field.type === "multiselect" && field.optionsEndpoint ? (
                <div style={{ maxHeight: "150px", overflowY: "auto", background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  {externalOptions[field.name]?.map(opt => (
                    <label key={opt[field.optionValue]} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer" }}>
                      <input 
                        type="checkbox"
                        checked={(formData[field.name] || []).includes(opt[field.optionValue])}
                        onChange={() => handleMultiselectToggle(field.name, opt[field.optionValue])}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {opt[field.optionLabel]}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
      />
    </div>
  );
}
