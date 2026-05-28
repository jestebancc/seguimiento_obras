import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  HardHat,
  ClipboardList
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard },
    { id: "proyectos", label: "Proyectos", icon: Briefcase },
    { id: "colaboradores", label: "Colaboradores", icon: Users },
    { id: "seguimientos", label: "Seguimientos", icon: ClipboardList }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <HardHat size={28} className="logo-icon-svg" />
        </div>
        {!isCollapsed && <span className="sidebar-logo-text">ObrasControl</span>}
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  onClick={() => setCurrentTab(item.id)}
                  className={`sidebar-menu-btn ${isActive ? "active" : ""}`}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon size={20} className="menu-icon-svg" />
                  {!isCollapsed && <span className="menu-btn-text">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className="sidebar-collapse-btn"
        title={isCollapsed ? "Expandir Menú" : "Colapsar Menú"}
      >
        {isCollapsed ? <ChevronRight size={18} /> : (
          <>
            <ChevronLeft size={18} />
            <span>Colapsar</span>
          </>
        )}
      </button>
    </aside>
  );
}
