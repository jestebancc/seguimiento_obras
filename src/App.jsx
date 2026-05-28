import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio";
import Proyectos from "./components/Proyectos";
import Colaboradores from "./components/Colaboradores";
import Seguimientos from "./components/Seguimientos";
import { 
  loadProjects, 
  saveProjects, 
  loadCollaborators, 
  saveCollaborators,
  loadTrackings,
  saveTrackings
} from "./utils/dummyData";

export default function App() {
  // 1. Navigation & UI States
  const [currentTab, setCurrentTab] = useState("inicio");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer Toggle

  // 2. Data Collections States
  const [projects, setProjects] = useState(() => loadProjects());
  const [collaborators, setCollaborators] = useState(() => loadCollaborators());
  const [trackings, setTrackings] = useState(() => loadTrackings());

  // 3. Project CRUD Handlers
  const handleAddProject = (newProj) => {
    const updated = [...projects, newProj];
    setProjects(updated);
    saveProjects(updated);
  };

  const handleUpdateProject = (updatedProj) => {
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(updated);
    saveProjects(updated);
  };

  const handleDeleteProject = (projId) => {
    const updated = projects.filter(p => p.id !== projId);
    setProjects(updated);
    saveProjects(updated);

    // Cascade delete related trackings
    const updatedTrackings = trackings.filter(t => t.projectId !== projId);
    setTrackings(updatedTrackings);
    saveTrackings(updatedTrackings);
  };

  // 4. Collaborator CRUD Handlers
  const handleAddCollaborator = (newColab) => {
    const updated = [...collaborators, newColab];
    setCollaborators(updated);
    saveCollaborators(updated);
  };

  const handleUpdateCollaborator = (updatedColab) => {
    const updated = collaborators.map(c => c.id === updatedColab.id ? updatedColab : c);
    setCollaborators(updated);
    saveCollaborators(updated);
  };

  const handleDeleteCollaborator = (colabId) => {
    // A. Remove collaborator from list
    const updatedColabs = collaborators.filter(c => c.id !== colabId);
    setCollaborators(updatedColabs);
    saveCollaborators(updatedColabs);

    // B. Clean up referential integrity: remove this collaborator's ID from all projects
    const updatedProjs = projects.map(p => {
      if (p.collaborators && p.collaborators.includes(colabId)) {
        return {
          ...p,
          collaborators: p.collaborators.filter(id => id !== colabId)
        };
      }
      return p;
    });
    setProjects(updatedProjs);
    saveProjects(updatedProjs);

    // C. Clean up referential integrity: clear collaboratorId in related trackings
    const updatedTrackings = trackings.map(t => {
      if (t.collaboratorId === colabId) {
        return { ...t, collaboratorId: "" };
      }
      return t;
    });
    setTrackings(updatedTrackings);
    saveTrackings(updatedTrackings);
  };

  // 4b. Tracking CRUD Handlers
  const handleAddTracking = (newSeg) => {
    const updated = [...trackings, newSeg];
    setTrackings(updated);
    saveTrackings(updated);
  };

  const handleUpdateTracking = (updatedSeg) => {
    const updated = trackings.map(t => t.id === updatedSeg.id ? updatedSeg : t);
    setTrackings(updated);
    saveTrackings(updated);
  };

  const handleDeleteTracking = (segId) => {
    const updated = trackings.filter(t => t.id !== segId);
    setTrackings(updated);
    saveTrackings(updated);
  };

  // 5. Dynamic Tab Router
  const renderTabContent = () => {
    switch (currentTab) {
      case "inicio":
        return (
          <Inicio 
            projects={projects} 
            collaborators={collaborators} 
            trackings={trackings}
            setCurrentTab={setCurrentTab} 
          />
        );
      case "proyectos":
        return (
          <Proyectos 
            projects={projects}
            collaborators={collaborators}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        );
      case "colaboradores":
        return (
          <Colaboradores 
            collaborators={collaborators}
            projects={projects}
            onAddCollaborator={handleAddCollaborator}
            onUpdateCollaborator={handleUpdateCollaborator}
            onDeleteCollaborator={handleDeleteCollaborator}
          />
        );
      case "seguimientos":
        return (
          <Seguimientos 
            trackings={trackings}
            projects={projects}
            collaborators={collaborators}
            onAddTracking={handleAddTracking}
            onUpdateTracking={handleUpdateTracking}
            onDeleteTracking={handleDeleteTracking}
          />
        );
      default:
        return (
          <Inicio 
            projects={projects} 
            collaborators={collaborators} 
            trackings={trackings}
            setCurrentTab={setCurrentTab} 
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* 1. Sidebar Navigation */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? "mobile-open" : ""}`}>
        {/* Mobile overlay */}
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setIsSidebarOpen(false); // Close mobile drawer on selection
          }} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>

      {/* 2. Main Content Frame */}
      <div className={`main-layout ${isCollapsed ? "collapsed" : ""}`}>
        <Navbar 
          currentTab={currentTab} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        <main className="content-container">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
