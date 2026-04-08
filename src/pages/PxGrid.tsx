import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { pxGridClients, pxGridTopics } from "@/lib/mockDataGap";
import { systemSettings } from "@/lib/mockDataExtended";
import { CheckCircle, XCircle, Network, Users, Radio, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const sections: NavSection[] = [
  { label: 'pxGrid', items: [
    { label: 'Overview', key: 'pxgrid-overview' },
    { label: 'Clients', key: 'pxgrid-clients' },
    { label: 'Topics', key: 'pxgrid-topics' },
    { label: 'Settings', key: 'pxgrid-settings' },
  ], defaultOpen: true },
];

const PxGrid = () => {
  const [active, setActive] = useState('pxgrid-overview');
  const [selectedClient, setSelectedClient] = useState<typeof pxGridClients[0] | null>(null);
  const [clientOpen, setClientOpen] = useState(false);

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Administration &gt; pxGrid Services &gt; <span className="font-semibold" style={{ color: '#333' }}>{sections.flatMap(s => s.items).find(i => i.key === active)?.label}</span></div>

        {active === 'pxgrid-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Network size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>pxGrid Services</span></div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Connected Clients" value={String(pxGridClients.filter(c => c.status === 'Online').length)} color="#6cc04a" />
              <StatCard label="Total Clients" value={String(pxGridClients.length)} color="#049fd9" />
              <StatCard label="Active Topics" value={String(pxGridTopics.filter(t => t.subscribers > 0).length)} color="#fbab18" />
              <StatCard label="Service Status" value={systemSettings.pxGrid.status} color="#6cc04a" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              pxGrid (Platform Exchange Grid) enables secure sharing of context information between ISE and partner platforms such as Firepower, Stealthwatch, DNA Center, and third-party SIEM solutions. Connected clients can subscribe to session, TrustSec, ANC, and profiler topics to receive real-time context updates.
            </div>
            <div className="border border-border rounded bg-card p-4">
              <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>pxGrid Controller</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span style={{ color: '#888' }}>pxGrid Node:</span> <span className="font-mono">{systemSettings.pxGrid.pxGridNode}</span></div>
                <div><span style={{ color: '#888' }}>Status:</span> <span className="flex items-center gap-1 inline-flex"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {systemSettings.pxGrid.status}</span></div>
                <div><span style={{ color: '#888' }}>Auto-Approve:</span> <span className="font-mono">{systemSettings.pxGrid.autoApprove ? 'Yes' : 'No'}</span></div>
                <div><span style={{ color: '#888' }}>Auth Type:</span> <span className="font-mono">{systemSettings.pxGrid.certificateBased ? 'Certificate' : 'Password'}</span></div>
              </div>
            </div>
          </div>
        )}

        {active === 'pxgrid-clients' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>pxGrid Clients</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a client to view subscription details</div>
            <ISETable headers={['Client Name', 'Type', 'IP Address', 'Status', 'Topics', 'Auth Type', 'Last Seen']}
              rows={pxGridClients.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span style={{ color: '#666' }}>{c.type}</span>,
                <span className="font-mono">{c.ip}</span>,
                c.status === 'Online' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Online</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Offline</span>,
                <span className="font-mono text-[11px]">{c.topics.join(', ')}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: c.authType === 'Certificate' ? '#049fd920' : '#fbab1830', color: c.authType === 'Certificate' ? '#049fd9' : '#b47a00' }}>{c.authType}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{c.lastSeen}</span>,
              ])}
              onRowClick={(i) => { setSelectedClient(pxGridClients[i]); setClientOpen(true); }}
            />
            <Dialog open={clientOpen} onOpenChange={setClientOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>pxGrid Client:</span> {selectedClient?.name}</DialogTitle></DialogHeader>
                {selectedClient && (
                  <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                    {[
                      ['Client Name', selectedClient.name],
                      ['Type', selectedClient.type],
                      ['IP Address', selectedClient.ip],
                      ['Version', selectedClient.version],
                      ['Status', selectedClient.status],
                      ['Auth Type', selectedClient.authType],
                      ['Last Seen', selectedClient.lastSeen],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{l}</span><span className="font-mono">{v}</span></div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="font-semibold mb-1" style={{ color: '#333' }}>Subscribed Topics</div>
                      <div className="flex flex-wrap gap-1">{selectedClient.topics.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#049fd920', color: '#049fd9' }}>{t}</span>)}</div>
                    </div>
                  </div>
                )}
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => setClientOpen(false)}>Close</Button>
                  <Button variant="destructive" size="sm">Disconnect</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {active === 'pxgrid-topics' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Radio size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>pxGrid Topics</span></div>
            <ISETable headers={['Topic Name', 'Description', 'Subscribers', 'Publishers']}
              rows={pxGridTopics.map(t => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{t.name}</span>,
                <span style={{ color: '#666' }}>{t.description}</span>,
                <span className="font-mono font-bold">{t.subscribers}</span>,
                <span className="font-mono">{t.publishers}</span>,
              ])} />
          </div>
        )}

        {active === 'pxgrid-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>pxGrid Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              <SettingSwitchRow label="Auto-Approve New Clients" checked={systemSettings.pxGrid.autoApprove} />
              <SettingSwitchRow label="Certificate-Based Authentication" checked={systemSettings.pxGrid.certificateBased} />
              <SettingSwitchRow label="Password-Based Authentication" checked={systemSettings.pxGrid.passwordBased} />
              <SettingRow label="pxGrid Controller Node" value={systemSettings.pxGrid.pxGridNode} />
              <SettingRow label="Service Status" value={systemSettings.pxGrid.status} />
            </div>
            <div className="flex justify-end">
              <Button size="sm" style={{ background: '#049fd9' }}>Save Settings</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="border border-border rounded bg-card p-3">
    <div className="text-[11px] font-medium" style={{ color: '#666' }}>{label}</div>
    <div className="text-xl font-bold mt-1" style={{ color }}>{value}</div>
  </div>
);

const ISETable = ({ headers, rows, onRowClick }: { headers: string[]; rows: React.ReactNode[][]; onRowClick?: (i: number) => void }) => (
  <div className="border border-border rounded overflow-auto bg-card">
    <table className="w-full text-xs">
      <thead><tr style={{ background: '#f0f0f0' }}>{headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className={`hover:bg-accent/60 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(i)}>
          {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

const SettingRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{label}</span><span className="font-mono" style={{ color: '#333' }}>{value}</span></div>
);

const SettingSwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center gap-2"><span className="w-52 font-medium" style={{ color: '#555' }}>{label}</span><Switch defaultChecked={checked} className="scale-75" /><span style={{ color: '#888' }}>{checked ? 'Enabled' : 'Disabled'}</span></div>
);

export default PxGrid;
