import React, { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import Modal from "../general/Modal";
import api from '../../helper/axiosHelper';

export default function SeguimientosCrud({ config, queryParams = {} }) {
  const { title, endpoint, columns } = config;

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [externalOptions, setExternalOptions] = useState({});

  const buildUrl = (base) => {
    if (base.startsWith("local://")) return base;
    try {
      const url = new URL(base, window.location.origin);
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key]) {
          url.searchParams.set(key, queryParams[key]);
        }
      });
      return url.toString();
    } catch (e) {
      let [path, query] = base.split('?');
      path = path.replace(/\/$/, '');
      const searchParams = new URLSearchParams(query || "");
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key]) searchParams.set(key, queryParams[key]);
      });
      const newQuery = searchParams.toString();
      return newQuery ? `${path}?${newQuery}` : path;
    }
  };

  const fetchData = async () => {
    if (endpoint.startsWith("local://")) {
      setData(loadTrackings());
      return;
    }
    try {
      const response = await api.get(buildUrl(endpoint));
      if (response?.data?.success) {
        const json = response.data;
        setData(Array.isArray(json.data) ? json.data : []);
      }
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}`, err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const handleOpenImages = (item) => {
    let imagesArray = [];
    if (typeof item.imagenes === 'string') {
      try {
        imagesArray = JSON.parse(item.imagenes);
      } catch (e) {
        console.error("Error parsing images JSON", e);
      }
    } else if (Array.isArray(item.imagenes)) {
      imagesArray = item.imagenes;
    }
    setCurrentImages(imagesArray);
    setIsImagesOpen(true);
  };

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
    if (col.type === "foreign" && externalOptions[col.key]) {
      const foreignItem = externalOptions[col.key].find(o => o.id === val);
      return foreignItem ? foreignItem[col.foreignLabel] : val;
    }
    return val;
  };

  const filteredData = data.filter(item => {
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
                    <button className="btn btn-ghost btn-icon-only" onClick={() => handleOpenImages(item)} title="Ver imágenes">
                      <Eye size={16} className="text-info" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* IMAGE VIEW MODAL */}
      <Modal
        isOpen={isImagesOpen}
        onClose={() => setIsImagesOpen(false)}
        title="Imágenes del Seguimiento"
      >
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {currentImages.length > 0 ? (
            currentImages.map((img, index) => (
              <a href={img.url_supabase} target="_blank" rel="noopener noreferrer" key={index} style={{ display: 'block' }}>
                <img
                  src={img.url_supabase}
                  alt={`Seguimiento ${index}`}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                />
              </a>
            ))
          ) : (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>No hay imágenes disponibles.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
