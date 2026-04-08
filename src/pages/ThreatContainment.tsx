import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { threatEvents, vulnerabilityAdapters } from "@/lib/mockDataGap";
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const sections: NavSection[] = [
  { label: 'Threat-Centric NAC', items: [
    { label: 'Overview', key: 'tc-overview' },
    { label: 'Vulnerability Assessment', key: 'va-adapters' },
    { label: 'Compromised Endpoints', key: 'compromised' },
  ], defaultOpen: true },
];

const ThreatContainment = () => {
  const [active, setActive] = useState('tc-overview');
  const [tcNacEnabled, setTcNacEnabled] = useState(true);
  const [selectedAdapter, setSelectedAdapter] = useState<typeof vulnerabilityAdapters[0] | null>(null);
  const [adapterOpen, setAdapterOpen] = useState(false);

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Work Centers &gt; Threat Containment &gt; <span className="font-semibold" style={{ color: '#333' }}>{sections.flatMap(s => s.items).find(i => i.key === active)?.label}</span></div>

        {active === 'tc-overview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><ShieldAlert size={16} style={{ color: '#cc0000' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Threat-Centric NAC (TC-NAC)</span></div>
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: '#555' }}>TC-NAC Service</span>
                <Switch checked={tcNacEnabled} onCheckedChange={setTcNacEnabled} />
                <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: tcNacEnabled ? '#6cc04a20' : '#f0f0f0', color: tcNacEnabled ? '#3d7a2a' : '#888' }}>{tcNacEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Active Threats" value={String(threatEvents.filter(t => t.status === 'Active').length)} color="#cc0000" />
              <StatCard label="Mitigated" value={String(threatEvents.filter(t => t.status === 'Mitigated').length)} color="#6cc04a" />
              <StatCard label="VA Adapters" value={String(vulnerabilityAdapters.length)} color="#049fd9" />
              <StatCard label="Avg CVSS" value={(threatEvents.reduce((a, t) => a + t.cvssScore, 0) / threatEvents.length).toFixed(1)} color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              TC-NAC integrates with third-party vulnerability assessment and threat intelligence tools to automatically quarantine or restrict endpoints based on their threat posture. When TC-NAC detects a compromised endpoint or critical vulnerability, it can apply ANC policies automatically.
            </div>
            <div className="border border-border rounded bg-card p-4">
              <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Recent Threat Events</div>
              <ISETable headers={['Severity', 'Threat Type', 'MAC Address', 'IP', 'CVSS', 'Adapter', 'ANC Action', 'Status', 'Detected']}
                rows={threatEvents.map(t => [
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
                    background: t.severity === 'Critical' ? '#cc000020' : t.severity === 'High' ? '#fbab1830' : '#049fd920',
                    color: t.severity === 'Critical' ? '#cc0000' : t.severity === 'High' ? '#b47a00' : '#049fd9'
                  }}>{t.severity}</span>,
                  t.threatType,
                  <span className="font-mono text-[11px]" style={{ color: '#049fd9' }}>{t.mac}</span>,
                  <span className="font-mono">{t.ip}</span>,
                  <span className="font-mono font-bold" style={{ color: t.cvssScore >= 9 ? '#cc0000' : t.cvssScore >= 7 ? '#b47a00' : '#049fd9' }}>{t.cvssScore}</span>,
                  t.adapter,
                  <span className="font-mono" style={{ color: t.ancAction !== 'None' ? '#cc0000' : '#888' }}>{t.ancAction}</span>,
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: t.status === 'Active' ? '#cc000020' : '#6cc04a20', color: t.status === 'Active' ? '#cc0000' : '#3d7a2a' }}>{t.status}</span>,
                  <span className="font-mono" style={{ color: '#888' }}>{t.detectedAt}</span>,
                ])} />
            </div>
          </div>
        )}

        {active === 'va-adapters' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Activity size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Vulnerability Assessment Adapters</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>+ Add Adapter</button>
            </div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click an adapter to view configuration details</div>
            <ISETable headers={['Adapter Name', 'Type', 'Server URL', 'Status', 'Endpoints Scanned', 'Last Sync']}
              rows={vulnerabilityAdapters.map(a => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{a.name}</span>,
                a.type,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{a.serverUrl}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {a.status}</span>,
                <span className="font-mono">{a.endpoints.toLocaleString()}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{a.lastSync}</span>,
              ])}
              onRowClick={(i) => { setSelectedAdapter(vulnerabilityAdapters[i]); setAdapterOpen(true); }}
            />
            <Dialog open={adapterOpen} onOpenChange={setAdapterOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>VA Adapter:</span> {selectedAdapter?.name}</DialogTitle></DialogHeader>
                {selectedAdapter && (
                  <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                    {[
                      ['Name', selectedAdapter.name],
                      ['Type', selectedAdapter.type],
                      ['Vendor Instance', selectedAdapter.vendorInstance],
                      ['Server URL', selectedAdapter.serverUrl],
                      ['Status', selectedAdapter.status],
                      ['Endpoints Scanned', selectedAdapter.endpoints.toLocaleString()],
                      ['Last Sync', selectedAdapter.lastSync],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center"><span className="w-44 font-medium shrink-0" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
                    ))}
                  </div>
                )}
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAdapterOpen(false)}>Close</Button>
                  <Button size="sm" style={{ background: '#049fd9' }}>Test Connection</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {active === 'compromised' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} style={{ color: '#cc0000' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Compromised Endpoints</span></div>
            <ISETable headers={['MAC Address', 'IP', 'Threat Type', 'CVSS', 'Description', 'ANC Action', 'Status']}
              rows={threatEvents.filter(t => t.status === 'Active').map(t => [
                <span className="font-mono" style={{ color: '#049fd9' }}>{t.mac}</span>,
                <span className="font-mono">{t.ip}</span>,
                t.threatType,
                <span className="font-mono font-bold" style={{ color: '#cc0000' }}>{t.cvssScore}</span>,
                <span style={{ color: '#666' }}>{t.description}</span>,
                <span className="font-mono" style={{ color: '#cc0000' }}>{t.ancAction}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#cc000020', color: '#cc0000' }}>Active</span>,
              ])} />
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

export default ThreatContainment;
