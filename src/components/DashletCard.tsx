import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, Maximize2 } from "lucide-react";

interface DashletCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

const DashletCard = ({ title, children, className = "", defaultCollapsed = false }: DashletCardProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`border border-border rounded bg-card shadow-sm ${className}`}>
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer select-none"
        style={{ background: '#f0f0f0', borderBottom: '1px solid #ddd' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-xs font-semibold" style={{ color: '#333' }}>{title}</span>
        <div className="flex items-center gap-1">
          <Maximize2 size={12} style={{ color: '#888' }} />
          {collapsed ? <ChevronDown size={14} style={{ color: '#888' }} /> : <ChevronUp size={14} style={{ color: '#888' }} />}
        </div>
      </div>
      {!collapsed && <div className="p-3">{children}</div>}
    </div>
  );
};

export default DashletCard;
