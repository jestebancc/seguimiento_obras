import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio";
import ComponenteCrud from "./components/ComponenteCrud";
import { proyectosConfig, colaboradoresConfig, seguimientosConfig } from "./config/crudConfigs";

export default function App() {
  const [currentTab, setCurrentTab] = useState("inicio");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTabContent = () => {
    switch (currentTab) {
      case "inicio":
        return <Inicio setCurrentTab={setCurrentTab} />;
      case "proyectos":
        return <ComponenteCrud config={proyectosConfig} />;
      case "colaboradores":
        return <ComponenteCrud config={colaboradoresConfig} />;
      case "seguimientos":
        return <ComponenteCrud config={seguimientosConfig} />;
      default:
        return <Inicio setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-container">
      <div className={`sidebar-wrapper ${isSidebarOpen ? "mobile-open" : ""}`}>
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
