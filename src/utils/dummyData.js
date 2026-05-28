// Dummy data module with LocalStorage persistence helper

export const initialCollaborators = [
  {
    id: "col-1",
    name: "Arq. Sofia Valenzuela",
    role: "Arquitecto Principal",
    email: "sofia.valenzuela@obras.com",
    phone: "+51 987 654 321",
    status: "activo"
  },
  {
    id: "col-2",
    name: "Ing. Alejandro Mendoza",
    role: "Ingeniero Civil",
    email: "alejandro.mendoza@obras.com",
    phone: "+51 912 345 678",
    status: "activo"
  },
  {
    id: "col-3",
    name: "Diseñadora Camila Rojas",
    role: "Diseñador de Interiores",
    email: "camila.rojas@obras.com",
    phone: "+51 934 567 890",
    status: "activo"
  },
  {
    id: "col-4",
    name: "Ing. Mateo Castro",
    role: "Supervisor de Obra",
    email: "mateo.castro@obras.com",
    phone: "+51 956 789 012",
    status: "activo"
  },
  {
    id: "col-5",
    name: "Carlos Guerrero",
    role: "Electricista Principal",
    email: "carlos.guerrero@obras.com",
    phone: "+51 978 901 234",
    status: "inactivo"
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    name: "Residencial Las Praderas - Torre A",
    description: "Construcción de edificio residencial multifamiliar de 12 pisos con áreas comunes y sótano.",
    category: "Residencial",
    startDate: "2026-01-10",
    endDate: "2026-12-20",
    status: "progreso",
    budget: 1250000,
    collaborators: ["col-1", "col-2", "col-4"]
  },
  {
    id: "proj-2",
    name: "Centro Comercial Portal Oeste",
    description: "Remodelación y ampliación del patio de comidas y tiendas ancla del sector norte.",
    category: "Comercial",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    status: "progreso",
    budget: 850000,
    collaborators: ["col-1", "col-3"]
  },
  {
    id: "proj-3",
    name: "Complejo Industrial Lurín",
    description: "Diseño y cimentación para nave industrial de almacenamiento de alta resistencia.",
    category: "Industrial",
    startDate: "2026-06-15",
    endDate: "2027-04-10",
    status: "planificacion",
    budget: 2100000,
    collaborators: ["col-2", "col-4"]
  },
  {
    id: "proj-4",
    name: "Puente Peatonal Av. Universitaria",
    description: "Instalación de estructura metálica e iluminación LED inteligente para cruce peatonal seguro.",
    category: "Infraestructura",
    startDate: "2025-08-01",
    endDate: "2025-12-15",
    status: "completado",
    budget: 340000,
    collaborators: ["col-2", "col-5"]
  },
  {
    id: "proj-5",
    name: "Oficinas Corporativas SkyTower",
    description: "Implementación de oficinas prime en el piso 18 con certificación de sostenibilidad LEED.",
    category: "Comercial",
    startDate: "2026-04-15",
    endDate: "2026-10-15",
    status: "pausado",
    budget: 620000,
    collaborators: ["col-3", "col-1"]
  }
];

// Helper functions for persistent data
export const loadCollaborators = () => {
  const data = localStorage.getItem("seguimiento_colaboradores");
  if (data) return JSON.parse(data);
  localStorage.setItem("seguimiento_colaboradores", JSON.stringify(initialCollaborators));
  return initialCollaborators;
};

export const saveCollaborators = (collaborators) => {
  localStorage.setItem("seguimiento_colaboradores", JSON.stringify(collaborators));
};

export const loadProjects = () => {
  const data = localStorage.getItem("seguimiento_proyectos");
  if (data) return JSON.parse(data);
  localStorage.setItem("seguimiento_proyectos", JSON.stringify(initialProjects));
  return initialProjects;
};

export const saveProjects = (projects) => {
  localStorage.setItem("seguimiento_proyectos", JSON.stringify(projects));
};

export const initialTrackings = [
  {
    id: "seg-1",
    projectId: "proj-1",
    date: "2026-05-15",
    description: "Vaciado de concreto en vigas y losas del piso 4 completado al 100%. Inspección de calidad aprobada sin observaciones.",
    progress: 35,
    budgetSpent: 45000,
    collaboratorId: "col-2",
    status: "normal"
  },
  {
    id: "seg-2",
    projectId: "proj-1",
    date: "2026-05-20",
    description: "Demora en la entrega de fierro corrugado de 1/2 pulgada. Se reporta un retraso de 3 días en el encofrado del piso 5.",
    progress: 38,
    budgetSpent: 12000,
    collaboratorId: "col-4",
    status: "retraso"
  },
  {
    id: "seg-3",
    projectId: "proj-2",
    date: "2026-05-10",
    description: "Instalación de conductos de aire acondicionado en zona norte. Trabajos se realizan en horario nocturno.",
    progress: 25,
    budgetSpent: 28000,
    collaboratorId: "col-1",
    status: "normal"
  },
  {
    id: "seg-4",
    projectId: "proj-2",
    date: "2026-05-18",
    description: "Ampliación de redes eléctricas del patio de comidas iniciada. Se detecta interferencia con tubería de agua contra incendios.",
    progress: 30,
    budgetSpent: 15000,
    collaboratorId: "col-3",
    status: "critico"
  },
  {
    id: "seg-5",
    projectId: "proj-5",
    date: "2026-05-25",
    description: "Diseño conceptual de iluminación LED aprobado por el cliente. Selección de luminarias de bajo consumo energético lista.",
    progress: 10,
    budgetSpent: 5000,
    collaboratorId: "col-1",
    status: "normal"
  }
];

export const loadTrackings = () => {
  const data = localStorage.getItem("seguimiento_trackings");
  if (data) return JSON.parse(data);
  localStorage.setItem("seguimiento_trackings", JSON.stringify(initialTrackings));
  return initialTrackings;
};

export const saveTrackings = (trackings) => {
  localStorage.setItem("seguimiento_trackings", JSON.stringify(trackings));
};
