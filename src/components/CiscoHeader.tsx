import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Bell, User, HelpCircle, Search, BookOpen, RotateCcw, Play, ChevronDown, ChevronRight, CheckCircle, Circle, X } from "lucide-react";
import { useSimulation } from "@/context/ISESimulationContext";
import { useWalkthrough } from "@/context/WalkthroughContext";
import { labs } from "@/lib/labDefinitions";

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
  const sim = useSimulation();
  const wt = useWalkthrough();
  const [labDropdownOpen, setLabDropdownOpen] = useState(false);
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getLabProgress = (labId: string) => {
    const l = labs.find(lb => lb.id === labId);
    if (!l) return 0;
    const completed = l.steps.filter(s => s.validation(sim)).length;
    return Math.round((completed / l.steps.length) * 100);
  };

  const handleStartLab = (labId: string) => {
    wt.startWalkthrough(labId);
    setLabDropdownOpen(false);
  };

  const totalProgress = Math.round(
    labs.reduce((acc, l) => acc + l.steps.filter(s => s.validation(sim)).length, 0) /
    labs.reduce((acc, l) => acc + l.steps.length, 0) * 100
  );

  return (
    <>
      <header className="w-full flex-shrink-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 h-11" style={{ background: '#1a1a1a' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 mr-4">
              <span className="text-[18px] font-bold tracking-tight" style={{ color: '#049fd9' }}>cisco</span>
              <span className="text-[11px] font-light ml-1" style={{ color: '#9e9e9e' }}>Identity Services Engine</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Lab Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors hover:bg-white/10"
                style={{ color: '#6cc04a', border: '1px solid #6cc04a40' }}
                onClick={() => setLabDropdownOpen(!labDropdownOpen)}
              >
                <BookOpen size={13} />
                Labs
                {totalProgress > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: totalProgress === 100 ? '#6cc04a' : '#049fd9', color: '#fff' }}>
                    {totalProgress}%
                  </span>
                )}
                <ChevronDown size={11} />
              </button>

              {labDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-96 bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#049fd9' }}>
                    <span className="text-xs font-semibold text-white">Hands-On Lab Exercises</span>
                    <button className="p-0.5 rounded hover:bg-white/20" onClick={() => { sim.resetAll(); }}>
                      <RotateCcw size={11} color="#fff" />
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {labs.map(l => {
                      const progress = getLabProgress(l.id);
                      const isExpanded = expandedLab === l.id;
                      return (
                        <div key={l.id} className="border-b border-border last:border-b-0">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-accent/30 transition-colors"
                            onClick={() => setExpandedLab(isExpanded ? null : l.id)}
                          >
                            {progress === 100 ? (
                              <CheckCircle size={14} style={{ color: '#6cc04a' }} />
                            ) : (
                              <Circle size={14} style={{ color: '#ccc' }} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold truncate" style={{ color: '#333' }}>{l.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded ml-2 shrink-0" style={{
                                  background: l.difficulty === 'Beginner' ? '#6cc04a20' : l.difficulty === 'Intermediate' ? '#fbab1830' : '#cc000020',
                                  color: l.difficulty === 'Beginner' ? '#3d7a2a' : l.difficulty === 'Intermediate' ? '#b47a00' : '#cc0000'
                                }}>{l.difficulty}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e5e5' }}>
                                  <div className="h-1 rounded-full transition-all" style={{ width: `${progress}%`, background: progress === 100 ? '#6cc04a' : '#049fd9' }} />
                                </div>
                                <span className="text-[9px] font-mono shrink-0" style={{ color: '#888' }}>{progress}%</span>
                              </div>
                            </div>
                            {isExpanded ? <ChevronDown size={12} style={{ color: '#888' }} /> : <ChevronRight size={12} style={{ color: '#888' }} />}
                          </button>

                          {isExpanded && (
                            <div className="px-3 pb-3 space-y-2" style={{ background: '#fafafa' }}>
                              <div className="text-[10px] mb-1" style={{ color: '#666' }}>{l.description}</div>
                              <div className="text-[10px]" style={{ color: '#888' }}>⏱ {l.estimatedTime} • {l.steps.length} steps</div>

                              {/* Steps list */}
                              <div className="space-y-1">
                                {l.steps.map((step, i) => {
                                  const done = step.validation(sim);
                                  return (
                                    <div key={step.id} className="flex items-center gap-2 text-[10px] px-2 py-1 rounded" style={{ background: done ? '#6cc04a10' : '#fff', border: '1px solid #e5e5e5' }}>
                                      {done ? <CheckCircle size={10} style={{ color: '#6cc04a' }} /> : <Circle size={10} style={{ color: '#ccc' }} />}
                                      <span style={{ color: done ? '#3d7a2a' : '#555' }}>Step {i + 1}: {step.title}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              <button
                                className="w-full flex items-center justify-center gap-1.5 text-[11px] px-3 py-1.5 rounded text-white font-medium mt-2"
                                style={{ background: progress === 100 ? '#6cc04a' : '#049fd9' }}
                                onClick={() => handleStartLab(l.id)}
                              >
                                <Play size={11} /> {progress === 100 ? 'Replay Lab' : progress > 0 ? 'Continue Lab' : 'Start Lab'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Reset Simulation" onClick={() => sim.resetAll()}>
              <RotateCcw size={14} style={{ color: '#ccc' }} />
            </button>
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
                data-walkthrough={`nav-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
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
    </>
  );
};

export default CiscoHeader;
