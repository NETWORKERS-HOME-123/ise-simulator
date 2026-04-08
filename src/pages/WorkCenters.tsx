import { Users, Smartphone, Server, Wifi, Shield, Lock } from "lucide-react";
import { workCenterSections } from "@/lib/mockData";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={24} style={{ color: '#049fd9' }} />,
  Smartphone: <Smartphone size={24} style={{ color: '#049fd9' }} />,
  Server: <Server size={24} style={{ color: '#049fd9' }} />,
  Network: <Wifi size={24} style={{ color: '#049fd9' }} />,
  Shield: <Shield size={24} style={{ color: '#049fd9' }} />,
  Lock: <Lock size={24} style={{ color: '#049fd9' }} />,
};

const WorkCenters = () => (
  <div className="p-4 space-y-4">
    <div className="text-xs" style={{ color: '#666' }}>Work Centers &gt; <span className="font-semibold" style={{ color: '#333' }}>Overview</span></div>
    <div className="text-sm font-semibold" style={{ color: '#333' }}>Work Centers</div>

    <div className="grid grid-cols-3 gap-4">
      {workCenterSections.map(section => (
        <div key={section.id} className="border border-border rounded bg-card p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            {iconMap[section.icon]}
            <span className="text-sm font-semibold" style={{ color: '#333' }}>{section.name}</span>
          </div>
          <p className="text-xs mb-3" style={{ color: '#666' }}>{section.description}</p>
          <div className="space-y-1">
            {section.subItems.map(item => (
              <div key={item} className="text-xs px-2 py-1 rounded hover:bg-accent/50 cursor-pointer" style={{ color: '#049fd9' }}>
                › {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WorkCenters;
