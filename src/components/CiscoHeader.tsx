import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Bell, User, HelpCircle, Search } from "lucide-react";

const navTabs = [
  { label: "Home", path: "/" },
  { label: "Context Visibility", path: "/context-visibility" },
  { label: "Operations", path: "/operations" },
  { label: "Policy", path: "/policy" },
  { label: "Work Centers", path: "/work-centers" },
  { label: "Administration", path: "/administration" },
];

const CiscoHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="w-full flex-shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-11" style={{ background: '#1a1a1a' }}>
        <div className="flex items-center gap-3">
          {/* Cisco logo text */}
          <div className="flex items-center gap-1 mr-4">
            <span className="text-[18px] font-bold tracking-tight" style={{ color: '#049fd9' }}>cisco</span>
            <span className="text-[11px] font-light ml-1" style={{ color: '#9e9e9e' }}>Identity Services Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Search size={15} style={{ color: '#ccc' }} />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors relative">
            <Bell size={15} style={{ color: '#ccc' }} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold" style={{ background: '#cc0000', color: '#fff' }}>3</span>
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <HelpCircle size={15} style={{ color: '#ccc' }} />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Settings size={15} style={{ color: '#ccc' }} />
          </button>
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20">
            <User size={15} style={{ color: '#ccc' }} />
            <span className="text-xs" style={{ color: '#ccc' }}>admin</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center h-9 px-2" style={{ background: '#333' }}>
        {navTabs.map((tab) => {
          const isActive = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="px-4 h-full text-xs font-medium transition-colors relative flex items-center"
              style={{
                color: isActive ? '#fff' : '#bbb',
                background: isActive ? '#049fd9' : 'transparent',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#444'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default CiscoHeader;
