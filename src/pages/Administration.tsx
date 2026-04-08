import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import NodeDetailDialog from "@/components/NodeDetailDialog";
import { deploymentNodes, licenses, systemCertificates, trustedCertificates, adminUsers } from "@/lib/mockData";
import { Server, CheckCircle, XCircle, Key, Shield, Users, Settings, ToggleLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const sections: NavSection[] = [
  { label: 'System', items: [
    { label: 'Deployment', key: 'deployment' },
    { label: 'Licensing', key: 'licensing' },
    { label: 'Certificates', key: 'certificates' },
    { label: 'Settings', key: 'settings' },
  ], defaultOpen: true },
  { label: 'Admin Access', items: [
    { label: 'Admin Users', key: 'admin-users' },
  ], defaultOpen: true },
];

type CertTab = 'system' | 'trusted' | 'ca' | 'csr';

const Administration = () => {
  const [active, setActive] = useState('deployment');
  const [selectedNode, setSelectedNode] = useState<typeof deploymentNodes[0] | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [panFailover, setPanFailover] = useState(false);
  const [certTab, setCertTab] = useState<CertTab>('system');
  const [addAdminOpen, setAddAdminOpen] = useState(false);

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Administration &gt; {sections.find(s => s.items.some(i => i.key === active))?.label} &gt; <span className="font-semibold" style={{ color: '#333' }}>{sections.flatMap(s => s.items).find(i => i.key === active)?.label}</span></div>

        {active === 'deployment' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Deployment Nodes</span></div>
              <div className="flex items-center gap-2 text-xs">
                <ToggleLeft size={14} style={{ color: '#888' }} />
                <span style={{ color: '#555' }}>PAN Failover</span>
                <Switch checked={panFailover} onCheckedChange={setPanFailover} />
                <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: panFailover ? '#6cc04a20' : '#f0f0f0', color: panFailover ? '#3d7a2a' : '#888' }}>
                  {panFailover ? 'Enabled' : 'Disabled'}
                </span>
              </div>
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
                    <tr key={n.hostname} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60 cursor-pointer" onClick={() => { setSelectedNode(n); setNodeDialogOpen(true); }}>
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
                <div><span style={{ color: '#888' }}>PAN Failover:</span> <span className="font-mono">{panFailover ? 'Active' : 'Standby'}</span></div>
              </div>
            </div>

            <NodeDetailDialog node={selectedNode} open={nodeDialogOpen} onOpenChange={setNodeDialogOpen} />
          </>
        )}

        {active === 'licensing' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Key size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>License Usage</span></div>
            <div className="border border-border rounded overflow-auto bg-card">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['License Type', 'Description', 'Total', 'Consumed', 'Available', 'Status', 'Expiry'].map(h => (
                      <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((l, i) => (
                    <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                      <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{l.type}</td>
                      <td className="p-2" style={{ color: '#666' }}>{l.description}</td>
                      <td className="p-2 font-mono">{l.total.toLocaleString()}</td>
                      <td className="p-2 font-mono font-bold">{l.consumed.toLocaleString()}</td>
                      <td className="p-2 font-mono">{(l.total - l.consumed).toLocaleString()}</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
                          background: l.status === 'Compliant' ? '#6cc04a20' : '#fbab1830',
                          color: l.status === 'Compliant' ? '#3d7a2a' : '#b47a00',
                        }}>{l.status}</span>
                      </td>
                      <td className="p-2 font-mono" style={{ color: '#888' }}>{l.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {licenses.slice(0, 4).map(l => (
                <div key={l.id} className="border border-border rounded p-3 bg-card">
                  <div className="text-[11px] font-medium" style={{ color: '#666' }}>{l.type}</div>
                  <div className="text-lg font-bold mt-1" style={{ color: '#049fd9' }}>{Math.round(l.consumed / l.total * 100)}%</div>
                  <div className="w-full h-1.5 rounded-full mt-1" style={{ background: '#e5e5e5' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${l.consumed / l.total * 100}%`, background: l.consumed / l.total > 0.9 ? '#cc0000' : '#049fd9' }} />
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: '#888' }}>{l.consumed.toLocaleString()} / {l.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {active === 'certificates' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Certificate Management</span></div>
            <div className="flex items-center border-b border-border mb-3">
              {([['system', 'System Certificates'], ['trusted', 'Trusted Certificates'], ['ca', 'Certificate Authority'], ['csr', 'Certificate Signing Requests']] as const).map(([key, label]) => (
                <button key={key} className="px-4 py-2 text-xs font-medium border-b-2 transition-colors" style={{ color: certTab === key ? '#049fd9' : '#666', borderBottomColor: certTab === key ? '#049fd9' : 'transparent' }} onClick={() => setCertTab(key)}>{label}</button>
              ))}
            </div>

            {certTab === 'system' && (
              <div className="border border-border rounded overflow-auto bg-card">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: '#f0f0f0' }}>{['Friendly Name', 'Issued To', 'Issued By', 'Valid From', 'Valid To', 'Used By', 'Status'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
                  <tbody>{systemCertificates.map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                      <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{c.friendlyName}</td>
                      <td className="p-2 font-mono text-[11px]">{c.issuedTo}</td>
                      <td className="p-2" style={{ color: '#666' }}>{c.issuedBy}</td>
                      <td className="p-2 font-mono" style={{ color: '#888' }}>{c.validFrom}</td>
                      <td className="p-2 font-mono" style={{ color: '#888' }}>{c.validTo}</td>
                      <td className="p-2">{c.usedBy}</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: c.status === 'Valid' ? '#6cc04a20' : '#fbab1830', color: c.status === 'Valid' ? '#3d7a2a' : '#b47a00' }}>{c.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {certTab === 'trusted' && (
              <div className="border border-border rounded overflow-auto bg-card">
                <table className="w-full text-xs">
                  <thead><tr style={{ background: '#f0f0f0' }}>{['Friendly Name', 'Subject', 'Issued By', 'Expiry', 'Status', 'Trusted For'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
                  <tbody>{trustedCertificates.map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                      <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{c.friendlyName}</td>
                      <td className="p-2 font-mono text-[11px]">{c.subject}</td>
                      <td className="p-2">{c.issuedBy}</td>
                      <td className="p-2 font-mono" style={{ color: '#888' }}>{c.validTo}</td>
                      <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#6cc04a20', color: '#3d7a2a' }}>{c.status}</span></td>
                      <td className="p-2" style={{ color: '#666' }}>{c.trustedFor}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {certTab === 'ca' && (
              <div className="p-6 text-center border border-border rounded bg-card">
                <Shield size={32} style={{ color: '#ccc' }} className="mx-auto mb-2" />
                <div className="text-xs" style={{ color: '#888' }}>ISE Internal Certificate Authority</div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>CA Enabled — Root CA certificate valid until 2033-01-01</div>
                <div className="mt-3 text-xs font-mono p-2 rounded" style={{ background: '#f5f5f5', color: '#333' }}>CN=Cisco ISE CA, O=Cisco, L=San Jose, ST=California, C=US</div>
              </div>
            )}
            {certTab === 'csr' && (
              <div className="p-6 text-center border border-border rounded bg-card">
                <div className="text-xs" style={{ color: '#888' }}>No pending Certificate Signing Requests</div>
                <button className="mt-3 text-xs px-4 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>Generate CSR</button>
              </div>
            )}
          </>
        )}

        {active === 'settings' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Settings size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>General Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-4 text-xs">
              {[
                { label: 'Host Name', value: 'ise-pan01' },
                { label: 'Domain Name', value: 'corp.local' },
                { label: 'Time Zone', value: 'America/Los_Angeles (UTC-8)' },
                { label: 'NTP Server', value: '10.1.1.1, 10.1.1.2' },
                { label: 'DNS Server', value: '10.1.1.5, 10.1.1.6' },
                { label: 'SMTP Server', value: 'smtp.corp.local' },
                { label: 'Alarm Notification Email', value: 'ise-alerts@corp.local' },
              ].map(s => (
                <div key={s.label} className="flex items-center">
                  <span className="w-48 font-medium" style={{ color: '#555' }}>{s.label}</span>
                  <span className="font-mono" style={{ color: '#333' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {active === 'admin-users' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Administrator Users</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAddAdminOpen(true)}>+ Add Admin</button>
            </div>
            <div className="border border-border rounded overflow-auto bg-card">
              <table className="w-full text-xs">
                <thead><tr style={{ background: '#f0f0f0' }}>{['Username', 'Email', 'Admin Group', 'Status', 'Last Login'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
                <tbody>{adminUsers.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                    <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{u.name}</td>
                    <td className="p-2 font-mono text-[11px]">{u.email}</td>
                    <td className="p-2">{u.groups}</td>
                    <td className="p-2">
                      {u.status === 'Enabled'
                        ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span>
                        : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disabled</span>}
                    </td>
                    <td className="p-2 font-mono" style={{ color: '#888' }}>{u.lastLogin}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle className="text-sm">Add Administrator User</DialogTitle></DialogHeader>
                <div className="space-y-3 text-xs">
                  {[['Username', 'text'], ['Email', 'email'], ['Password', 'password']].map(([label, type]) => (
                    <div key={label}>
                      <label className="block mb-1 font-medium" style={{ color: '#555' }}>{label}</label>
                      <input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" type={type} />
                    </div>
                  ))}
                  <div>
                    <label className="block mb-1 font-medium" style={{ color: '#555' }}>Admin Group</label>
                    <select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card">
                      <option>Super Admin</option><option>Network Device Admin</option><option>Help Desk Admin</option><option>Read Only Admin</option><option>System Admin</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAddAdminOpen(false)}>Cancel</Button>
                  <Button size="sm" style={{ background: '#049fd9' }} onClick={() => setAddAdminOpen(false)}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Administration;
