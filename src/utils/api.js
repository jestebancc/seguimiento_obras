const API_BASE_URL = "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test";

// Hardcoded headers for testing. In production, these should come from Auth context.
const headers = {
  "Content-Type": "application/json",
  "user_role": "administrador",
  "user_cliente_id": "00000000-0000-0000-0000-000000000000", // Dummy UUID
  "user_id": "00000000-0000-0000-0000-000000000000" // Dummy UUID for creado_por
};

// --- PROYECTOS API ---

export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/proyectos`, {
    method: "GET",
    headers
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
};

export const createProject = async (projectData) => {
  const response = await fetch(`${API_BASE_URL}/proyectos`, {
    method: "POST",
    headers,
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
};

export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
};

export const deleteProject = async (id) => {
  const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
    method: "DELETE",
    headers
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
};

// --- USUARIOS CLIENTE (COLLABORATORS) API ---

export const fetchCollaborators = async () => {
  const response = await fetch(`${API_BASE_URL}/usuarios-cliente`, {
    method: "GET",
    headers
  });
  if (!response.ok) throw new Error("Failed to fetch collaborators");
  return response.json();
};

export const createCollaborator = async (collabData) => {
  const response = await fetch(`${API_BASE_URL}/usuarios-cliente`, {
    method: "POST",
    headers,
    body: JSON.stringify(collabData)
  });
  if (!response.ok) throw new Error("Failed to create collaborator");
  return response.json();
};

export const updateCollaborator = async (id, collabData) => {
  const response = await fetch(`${API_BASE_URL}/usuarios-cliente/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(collabData)
  });
  if (!response.ok) throw new Error("Failed to update collaborator");
  return response.json();
};

export const deleteCollaborator = async (id) => {
  const response = await fetch(`${API_BASE_URL}/usuarios-cliente/${id}`, {
    method: "DELETE",
    headers
  });
  if (!response.ok) throw new Error("Failed to delete collaborator");
  return response.json();
};
