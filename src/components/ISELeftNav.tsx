import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface NavSection {
  label: string;
  items: { label: string; key: string }[];
  defaultOpen?: boolean;
}

interface ISELeftNavProps {
  sections: NavSection[];
  activeKey: string;
  onSelect: (key: string) => void;
}

const ISELeftNav = ({ sections, activeKey, onSelect }: ISELeftNavProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach(s => {
      init[s.label] = s.defaultOpen ?? s.items.some(i => i.key === activeKey);
    });
    return init;
  });

  const toggle = (label: string) =>
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="w-52 flex-shrink-0 border-r border-border bg-card overflow-y-auto" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {sections.map(section => (
        <div key={section.label}>
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-accent/50 transition-colors"
            style={{ color: '#333', background: openSections[section.label] ? '#f0f0f0' : 'transparent' }}
            onClick={() => toggle(section.label)}
          >
            <span>{section.label}</span>
            {openSections[section.label]
              ? <ChevronDown size={12} style={{ color: '#888' }} />
              : <ChevronRight size={12} style={{ color: '#888' }} />
            }
          </button>
          {openSections[section.label] && (
            <div className="py-0.5">
              {section.items.map(item => (
                <button
                  key={item.key}
                  data-walkthrough={`nav-${item.key}`}
                  className="w-full text-left px-5 py-1.5 text-xs transition-colors"
                  style={{
                    color: activeKey === item.key ? '#049fd9' : '#555',
                    background: activeKey === item.key ? '#e6f4fb' : 'transparent',
                    fontWeight: activeKey === item.key ? 600 : 400,
                    borderLeft: activeKey === item.key ? '3px solid #049fd9' : '3px solid transparent',
                  }}
                  onClick={() => onSelect(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ISELeftNav;
