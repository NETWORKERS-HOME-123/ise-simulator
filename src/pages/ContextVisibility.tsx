import { useState, useMemo } from "react";
import { useSimulation } from "@/context/ISESimulationContext";
import { Search, Filter, Download, RefreshCw, CheckCircle, XCircle, Trash2, Plus, Copy } from "lucide-react";
import EndpointDetailDialog from "@/components/EndpointDetailDialog";
import TableToolbar from "@/components/TableToolbar";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { generateMacAddress, generateIP } from "@/lib/mockData";

const ContextVisibility = () => {
  const sim = useSimulation();
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("All");
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newMac, setNewMac] = useState('');
  const [newIp, setNewIp] = useState('');
  const [newProfile, setNewProfile] = useState('Unknown');
  const [newGroup, setNewGroup] = useState('Employee');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const groups = useMemo(() => ["All", ...new Set(sim.endpoints.map(e => e.identityGroup))], [sim.endpoints]);
  const filterOptions = useMemo(() => groups.filter(g => g !== 'All').map(g => ({ label: g, value: g })), [groups]);

  const filtered = useMemo(() =>
    sim.endpoints.filter(e =>
      (filterGroup === "All" || e.identityGroup === filterGroup) &&
      (search === "" || e.mac.toLowerCase().includes(search.toLowerCase()) || e.ip.includes(search) || e.profile.toLowerCase().includes(search.toLowerCase()))
    ), [search, filterGroup, sim.endpoints]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => sim.deleteEndpoint(id));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} endpoints deleted`);
  };

  const handleAddEndpoint = () => {
    if (!newMac.trim()) { toast.error('MAC address is required'); return; }
    sim.addEndpoint({
      mac: newMac || generateMacAddress(),
      ip: newIp || generateIP(),
      identityGroup: newGroup,
      profile: newProfile,
      status: 'Connected',
      staticAssignment: true,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      location: 'Building A - Floor 1',
      nasPort: 'GigabitEthernet1/0/1',
      authMethod: 'MAB',
      os: 'Unknown',
      manufacturer: 'Unknown',
    });
    setAddOpen(false);
    setNewMac(''); setNewIp('');
  };

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs" style={{ color: '#666' }}>Context Visibility &gt; <span className="font-semibold" style={{ color: '#333' }}>Endpoints</span></div>

      <TableToolbar data-walkthrough="cv-search"
        search={search} onSearchChange={setSearch}
        totalCount={sim.endpoints.length} filteredCount={filtered.length}
        placeholder="Search MAC, IP, or Profile..."
        filterOptions={filterOptions} filterValue={filterGroup} onFilterChange={v => setFilterGroup(v)}
        onRefresh={() => toast.info('Endpoint list refreshed')}
      >
        <button data-walkthrough="add-endpoint-btn" className="flex items-center gap-1 text-xs px-2 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAddOpen(true)}>
          <Plus size={12} /> Add Endpoint
        </button>
        {selectedIds.size > 0 && (
          <button className="flex items-center gap-1 text-xs px-2 py-1 rounded text-white" style={{ background: '#cc0000' }} onClick={handleBulkDelete}>
            <Trash2 size={12} /> Delete ({selectedIds.size})
          </button>
        )}
      </TableToolbar>

      <div className="text-[10px] mb-1" style={{ color: '#888' }}>Right-click rows for actions • Click to view details • Checkbox to bulk select</div>

      <div data-walkthrough="endpoint-table" className="border border-border rounded overflow-auto bg-card">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th className="p-2 w-8"><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? new Set(filtered.slice(0, 50).map(ep => ep.id)) : new Set())} /></th>
              {['#', 'MAC Address', 'IP Address', 'Identity Group', 'Endpoint Profile', 'OS', 'Location', 'Status', ''].map(h => (
                <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((e, i) => (
              <ContextMenu key={e.id}>
                <ContextMenuTrigger asChild>
                  <tr style={{ background: selectedIds.has(e.id) ? '#049fd910' : i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60 cursor-pointer" onClick={() => { setSelectedEndpoint(e); setDetailOpen(true); }}>
                    <td className="p-2" onClick={ev => { ev.stopPropagation(); toggleSelect(e.id); }}><input type="checkbox" checked={selectedIds.has(e.id)} readOnly /></td>
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
                    <td className="p-2">
                      <button className="p-1 rounded hover:bg-destructive/10" onClick={ev => { ev.stopPropagation(); setDeleteTarget(e); setDeleteOpen(true); }}>
                        <Trash2 size={12} style={{ color: '#cc0000' }} />
                      </button>
                    </td>
                  </tr>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => { setSelectedEndpoint(e); setDetailOpen(true); }}>View Details</ContextMenuItem>
                  <ContextMenuItem onClick={() => { navigator.clipboard.writeText(e.mac); toast.success('MAC copied'); }}>
                    <Copy size={12} className="mr-2" /> Copy MAC Address
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => { sim.addANCEndpoint({ mac: e.mac, ip: e.ip, policy: 'ANC-Quarantine', status: 'Quarantined', appliedBy: 'admin', appliedAt: new Date().toLocaleString(), reason: 'Manual quarantine' }); }}>
                    Apply ANC Quarantine
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => { sim.addANCEndpoint({ mac: e.mac, ip: e.ip, policy: 'ANC-Shutdown', status: 'Port Shutdown', appliedBy: 'admin', appliedAt: new Date().toLocaleString(), reason: 'Manual shutdown' }); }}>
                    Apply ANC Shutdown
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="text-destructive" onClick={() => { setDeleteTarget(e); setDeleteOpen(true); }}>
                    Delete Endpoint
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </tbody>
        </table>
      </div>

      <EndpointDetailDialog endpoint={selectedEndpoint} open={detailOpen} onOpenChange={setDetailOpen} />
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} title={deleteTarget?.mac || ''} onConfirm={() => { if (deleteTarget) sim.deleteEndpoint(deleteTarget.id); setDeleteOpen(false); }} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-sm">Add Endpoint (Manual)</DialogTitle></DialogHeader>
          <div className="space-y-3 text-xs">
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>MAC Address *</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card font-mono" placeholder="AA:BB:CC:DD:EE:FF" value={newMac} onChange={e => setNewMac(e.target.value)} /></div>
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>IP Address</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card font-mono" placeholder="10.1.1.100" value={newIp} onChange={e => setNewIp(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Identity Group</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" value={newGroup} onChange={e => setNewGroup(e.target.value)}>
                {['Employee', 'Guest', 'Contractor', 'BYOD', 'IOT', 'Unknown'].map(g => <option key={g}>{g}</option>)}
              </select></div>
              <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Profile</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" value={newProfile} onChange={e => setNewProfile(e.target.value)}>
                {['Unknown', 'Windows10-Workstation', 'Apple-MacBook', 'Cisco-IP-Phone', 'HP-Printer', 'Android', 'Linux-Workstation'].map(p => <option key={p}>{p}</option>)}
              </select></div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" style={{ background: '#049fd9' }} onClick={handleAddEndpoint}>Add Endpoint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContextVisibility;
