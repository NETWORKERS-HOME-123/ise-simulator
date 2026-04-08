import { policySets } from "@/lib/mockData";
import { Shield, CheckCircle, XCircle } from "lucide-react";

const Policy = () => (
  <div className="p-4 space-y-3">
    <div className="text-xs" style={{ color: '#666' }}>Policy &gt; <span className="font-semibold" style={{ color: '#333' }}>Policy Sets</span></div>

    <div className="flex items-center gap-2 mb-2">
      <Shield size={16} style={{ color: '#049fd9' }} />
      <span className="text-sm font-semibold" style={{ color: '#333' }}>Authentication & Authorization Policy Sets</span>
    </div>

    <div className="border border-border rounded overflow-auto bg-card">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {['#', 'Policy Set Name', 'Status', 'Conditions', 'Authentication Policy', 'Authorization Policy', 'Matched'].map(h => (
              <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {policySets.map((p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
              <td className="p-2 font-mono" style={{ color: '#999' }}>{p.id}</td>
              <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{p.name}</td>
              <td className="p-2">
                {p.status === 'Enabled'
                  ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span>
                  : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#999' }} /> Disabled</span>}
              </td>
              <td className="p-2 font-mono" style={{ color: '#666' }}>{p.conditions}</td>
              <td className="p-2">{p.authPolicy}</td>
              <td className="p-2">{p.authzPolicy}</td>
              <td className="p-2 text-right font-mono">{p.hits.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Policy;
