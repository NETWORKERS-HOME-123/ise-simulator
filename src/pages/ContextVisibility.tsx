import { useState, useMemo } from "react";
import { generateEndpoints } from "@/lib/mockData";
import { Search, Filter, Download, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import EndpointDetailDialog from "@/components/EndpointDetailDialog";

const allEndpoints = generateEndpoints(100);

const ContextVisibility = () => {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("All");
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const groups = useMemo(() => ["All", ...new Set(allEndpoints.map(e => e.identityGroup))], []);

  const filtered = useMemo(() =>
    allEndpoints.filter(e =>
      (filterGroup === "All" || e.identityGroup === filterGroup) &&
      (search === "" || e.mac.toLowerCase().includes(search.toLowerCase()) || e.ip.includes(search) || e.profile.toLowerCase().includes(search.toLowerCase()))
    ), [search, filterGroup]);

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs" style={{ color: '#666' }}>Context Visibility &gt; <span className="font-semibold" style={{ color: '#333' }}>Endpoints</span></div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded px-2 py-1 bg-card flex-1 max-w-sm">
          <Search size={13} style={{ color: '#999' }} />
          <input className="ml-1.5 text-xs bg-transparent outline-none flex-1 placeholder:text-muted-foreground" placeholder="Search MAC, IP, or Profile..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          <Filter size={13} style={{ color: '#888' }} />
          <select className="text-xs border border-border rounded px-2 py-1 bg-card" value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
            {groups.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <button className="flex items-center gap-1 text-xs px-2 py-1 border border-border rounded bg-card hover:bg-accent"><Download size={12} /> Export</button>
        <button className="flex items-center gap-1 text-xs px-2 py-1 border border-border rounded bg-card hover:bg-accent"><RefreshCw size={12} /> Refresh</button>
        <span className="text-[11px] ml-auto" style={{ color: '#888' }}>{filtered.length} endpoints</span>
      </div>

      <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a row to view endpoint details, authentication history, and profiling information</div>

      <div className="border border-border rounded overflow-auto bg-card">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              {['#', 'MAC Address', 'IP Address', 'Identity Group', 'Endpoint Profile', 'OS', 'Location', 'Status', 'Static'].map(h => (
                <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((e, i) => (
              <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60 cursor-pointer" onClick={() => { setSelectedEndpoint(e); setDetailOpen(true); }}>
                <td className="p-2 font-mono" style={{ color: '#999' }}>{e.id}</td>
                <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{e.mac}</td>
                <td className="p-2 font-mono">{e.ip}</td>
                <td className="p-2">{e.identityGroup}</td>
                <td className="p-2">{e.profile}</td>
                <td className="p-2" style={{ color: '#666' }}>{e.os}</td>
                <td className="p-2" style={{ color: '#666' }}>{e.location}</td>
                <td className="p-2">
                  {e.status === 'Connected'
                    ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Connected</span>
                    : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disconnected</span>}
                </td>
                <td className="p-2">{e.staticAssignment ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EndpointDetailDialog endpoint={selectedEndpoint} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
};

export default ContextVisibility;
