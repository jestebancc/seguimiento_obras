import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio";
import ComponenteCrud from "./components/ComponenteCrud";
import Login from "./components/Login";
import { proyectosConfig, colaboradoresConfig, seguimientosConfig } from "./config/crudConfigs";

export default function App() {
  const { isAuthenticated, userData, login } = useAuth();

  const [currentTab, setCurrentTab] = useState("seguimientos");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "inicio":
        return <Inicio setCurrentTab={setCurrentTab} />;
      case "seguimientos":
        return <ComponenteCrud config={seguimientosConfig} queryParams={{ e164: userData?.phone }} />;
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
