import { deploymentNodes } from "@/lib/mockData";
import { Server, CheckCircle, XCircle } from "lucide-react";

const Administration = () => (
  <div className="p-4 space-y-3">
    <div className="text-xs" style={{ color: '#666' }}>Administration &gt; System &gt; <span className="font-semibold" style={{ color: '#333' }}>Deployment</span></div>

    <div className="flex items-center gap-2 mb-2">
      <Server size={16} style={{ color: '#049fd9' }} />
      <span className="text-sm font-semibold" style={{ color: '#333' }}>Deployment Nodes</span>
    </div>

    <div className="border border-border rounded overflow-auto bg-card">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {['Hostname', 'Role', 'Personas', 'IP Address', 'Version', 'Status'].map(h => (
              <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deploymentNodes.map((n, i) => (
            <tr key={n.hostname} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
              <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{n.hostname}</td>
              <td className="p-2 font-semibold">{n.role}</td>
              <td className="p-2" style={{ color: '#666' }}>{n.persona}</td>
              <td className="p-2 font-mono">{n.ip}</td>
              <td className="p-2 font-mono" style={{ color: '#888' }}>{n.version}</td>
              <td className="p-2">
                {n.status === 'Connected'
                  ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Connected</span>
                  : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disconnected</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4 p-3 border border-border rounded bg-card">
      <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>System Information</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><span style={{ color: '#888' }}>Deployment Type:</span> <span className="font-mono">Distributed</span></div>
        <div><span style={{ color: '#888' }}>Primary PAN:</span> <span className="font-mono">ise-pan01.corp.local</span></div>
        <div><span style={{ color: '#888' }}>ISE Version:</span> <span className="font-mono">3.1.0.518</span></div>
        <div><span style={{ color: '#888' }}>Patch Level:</span> <span className="font-mono">Patch 7</span></div>
      </div>
    </div>
  </div>
);

export default Administration;
