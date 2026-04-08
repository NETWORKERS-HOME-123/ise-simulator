import { useState, useRef } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import NodeDetailDialog from "@/components/NodeDetailDialog";
import NetworkDeviceDetailDialog from "@/components/NetworkDeviceDetailDialog";
import CertificateDetailDialog from "@/components/CertificateDetailDialog";
import UserDetailDialog from "@/components/UserDetailDialog";
import BackupRestorePanel from "@/components/BackupRestorePanel";
import { useSimulation } from "@/context/ISESimulationContext";
import { deploymentNodes, licenses, systemCertificates, trustedCertificates, adminUsers, networkDeviceGroups, identityGroupsList, externalIdentitySources } from "@/lib/mockData";
import { systemSettings, licensingDetails } from "@/lib/mockDataExtended";
import { networkDeviceProfiles, smtpConfig, ntpServers, patchHistory, ersApiSettings, dataConnectSettings } from "@/lib/mockDataGap";
import { Server, CheckCircle, XCircle, Key, Shield, Users, Settings, ToggleLeft, Router, Layers, UserCheck, Database, Globe, HardDrive, Wrench, Plug } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const sections: NavSection[] = [
  { label: 'System', items: [
    { label: 'Deployment', key: 'deployment' },
    { label: 'Licensing', key: 'licensing' },
    { label: 'Certificates', key: 'certificates' },
    { label: 'Logging', key: 'logging' },
    { label: 'Maintenance', key: 'maintenance-header' },
  ], defaultOpen: true },
  { label: 'Maintenance', items: [
    { label: 'Backup & Restore', key: 'backup-restore' },
    { label: 'Repository', key: 'repository' },
    { label: 'Patch Management', key: 'patch-mgmt' },
  ], defaultOpen: false },
  { label: 'Settings', items: [
    { label: 'General', key: 'settings' },
    { label: 'SMTP Server', key: 'smtp' },
    { label: 'Proxy', key: 'proxy' },
  ], defaultOpen: false },
  { label: 'Admin Access', items: [
    { label: 'Administrators', key: 'admin-users' },
    { label: 'Admin Groups', key: 'admin-groups' },
    { label: 'Authentication', key: 'admin-auth' },
    { label: 'Authorization', key: 'admin-authz' },
  ], defaultOpen: false },
  { label: 'Identity Management', items: [
    { label: 'Identity Source Sequences', key: 'id-sequences' },
    { label: 'Internal Users', key: 'internal-users' },
    { label: 'External Identity Sources', key: 'ext-identity' },
    { label: 'Identity Groups', key: 'identity-groups' },
  ], defaultOpen: false },
  { label: 'Network Resources', items: [
    { label: 'Network Devices', key: 'network-devices' },
    { label: 'Network Device Groups', key: 'ndg' },
    { label: 'Network Device Profiles', key: 'ndp' },
    { label: 'External RADIUS Servers', key: 'ext-radius' },
    { label: 'RADIUS Server Sequences', key: 'radius-sequences' },
  ], defaultOpen: false },
  { label: 'System Configuration', items: [
    { label: 'ERS (API Gateway)', key: 'ers' },
    { label: 'Data Connect', key: 'data-connect' },
    { label: 'NTP Servers', key: 'ntp' },
  ], defaultOpen: false },
];

type CertTab = 'system' | 'trusted' | 'ca' | 'csr';
type SettingsTab = 'general' | 'eap-tls' | 'radius' | 'profiler' | 'posture' | 'pxgrid' | 'logging';

const Administration = () => {
  const [active, setActive] = useState('deployment');
  const [selectedNode, setSelectedNode] = useState<typeof deploymentNodes[0] | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [panFailover, setPanFailover] = useState(false);
  const [certTab, setCertTab] = useState<CertTab>('system');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<typeof networkDevices[0] | null>(null);
  const [deviceDetailOpen, setDeviceDetailOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<typeof systemCertificates[0] | null>(null);
  const [certDetailOpen, setCertDetailOpen] = useState(false);
  const [selectedInternalUser, setSelectedInternalUser] = useState<typeof internalUsers[0] | null>(null);
  const [internalUserOpen, setInternalUserOpen] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState<typeof adminUsers[0] | null>(null);
  const [adminUserOpen, setAdminUserOpen] = useState(false);
  const [licenseDetailOpen, setLicenseDetailOpen] = useState(false);

  const getSectionLabel = () => {
    const section = sections.find(s => s.items.some(i => i.key === active));
    const item = sections.flatMap(s => s.items).find(i => i.key === active);
    return { section: section?.label, item: item?.label };
  };
  const { section: secLabel, item: itemLabel } = getSectionLabel();

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Administration &gt; {secLabel} &gt; <span className="font-semibold" style={{ color: '#333' }}>{itemLabel}</span></div>

        {/* ============= DEPLOYMENT ============= */}
        {active === 'deployment' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Deployment Nodes</span></div>
              <div className="flex items-center gap-2 text-xs">
                <ToggleLeft size={14} style={{ color: '#888' }} /><span style={{ color: '#555' }}>PAN Failover</span>
                <Switch checked={panFailover} onCheckedChange={setPanFailover} />
                <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: panFailover ? '#6cc04a20' : '#f0f0f0', color: panFailover ? '#3d7a2a' : '#888' }}>{panFailover ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a node to configure roles and profiling probes</div>
            <ISETable headers={['Hostname', 'Role', 'Personas', 'IP Address', 'Version', 'Status']}
              rows={deploymentNodes.map(n => [
                <span className="font-mono" style={{ color: '#049fd9' }}>{n.hostname}</span>,
                <span className="font-semibold">{n.role}</span>,
                <span style={{ color: '#666' }}>{n.persona}</span>,
                <span className="font-mono">{n.ip}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{n.version}</span>,
                n.status === 'Connected' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Connected</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disconnected</span>,
              ])}
              onRowClick={(i) => { setSelectedNode(deploymentNodes[i]); setNodeDialogOpen(true); }}
            />
            <div className="mt-4 p-3 border border-border rounded bg-card">
              <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>System Information</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span style={{ color: '#888' }}>Deployment Type:</span> <span className="font-mono">Distributed</span></div>
                <div><span style={{ color: '#888' }}>Primary PAN:</span> <span className="font-mono">ise-pan01.corp.local</span></div>
                <div><span style={{ color: '#888' }}>ISE Version:</span> <span className="font-mono">3.3.0.430</span></div>
                <div><span style={{ color: '#888' }}>Patch Level:</span> <span className="font-mono">Patch 3</span></div>
                <div><span style={{ color: '#888' }}>PAN Failover:</span> <span className="font-mono">{panFailover ? 'Active' : 'Standby'}</span></div>
              </div>
            </div>
            <NodeDetailDialog node={selectedNode} open={nodeDialogOpen} onOpenChange={setNodeDialogOpen} />
          </>
        )}

        {/* ============= LICENSING ============= */}
        {active === 'licensing' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Key size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>License Usage</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setLicenseDetailOpen(true)}>Smart License Details</button>
            </div>
            <ISETable headers={['License Type', 'Description', 'Total', 'Consumed', 'Available', 'Status', 'Expiry']}
              rows={licenses.map(l => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{l.type}</span>,
                <span style={{ color: '#666' }}>{l.description}</span>,
                <span className="font-mono">{l.total.toLocaleString()}</span>,
                <span className="font-mono font-bold">{l.consumed.toLocaleString()}</span>,
                <span className="font-mono">{(l.total - l.consumed).toLocaleString()}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: l.status === 'Compliant' ? '#6cc04a20' : '#fbab1830', color: l.status === 'Compliant' ? '#3d7a2a' : '#b47a00' }}>{l.status}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{l.expiry}</span>,
              ])} />
            <div className="grid grid-cols-5 gap-3 mt-3">
              {licenses.map(l => (
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
            <Dialog open={licenseDetailOpen} onOpenChange={setLicenseDetailOpen}>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Smart License</span> Details</DialogTitle></DialogHeader>
                <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Registration</div>
                  {Object.entries(licensingDetails.smartLicense).map(([k, v]) => (
                    <div key={k} className="flex items-center"><span className="w-44 font-medium shrink-0 capitalize" style={{ color: '#555' }}>{k.replace(/([A-Z])/g, ' $1')}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>UDI</div>
                  <div className="border border-border rounded overflow-auto bg-card">
                    <table className="w-full text-[11px]">
                      <thead><tr style={{ background: '#f0f0f0' }}><th className="text-left p-2 font-semibold" style={{ color: '#555' }}>PID</th><th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Serial Number</th><th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Hostname</th></tr></thead>
                      <tbody>{licensingDetails.udi.map((u, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}><td className="p-2 font-mono">{u.pid}</td><td className="p-2 font-mono" style={{ color: '#049fd9' }}>{u.serialNumber}</td><td className="p-2 font-mono">{u.hostname}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
                <DialogFooter><Button variant="outline" size="sm" onClick={() => setLicenseDetailOpen(false)}>Close</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* ============= CERTIFICATES ============= */}
        {active === 'certificates' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Certificate Management</span></div>
            <div className="flex items-center border-b border-border mb-3">
              {([['system', 'System Certificates'], ['trusted', 'Trusted Certificates'], ['ca', 'Certificate Authority'], ['csr', 'Certificate Signing Requests']] as const).map(([key, label]) => (
                <button key={key} data-walkthrough={`cert-tab-${key}`} className="px-4 py-2 text-xs font-medium border-b-2 transition-colors" style={{ color: certTab === key ? '#049fd9' : '#666', borderBottomColor: certTab === key ? '#049fd9' : 'transparent' }} onClick={() => setCertTab(key)}>{label}</button>
              ))}
            </div>
            {certTab === 'system' && (
              <>
                <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a certificate to view details and PEM data</div>
                <ISETable headers={['Friendly Name', 'Issued To', 'Issued By', 'Valid From', 'Valid To', 'Used By', 'Status']}
                  rows={systemCertificates.map(c => [
                    <span className="font-semibold" style={{ color: '#049fd9' }}>{c.friendlyName}</span>,
                    <span className="font-mono text-[11px]">{c.issuedTo}</span>,
                    <span style={{ color: '#666' }}>{c.issuedBy}</span>,
                    <span className="font-mono" style={{ color: '#888' }}>{c.validFrom}</span>,
                    <span className="font-mono" style={{ color: '#888' }}>{c.validTo}</span>,
                    c.usedBy,
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: c.status === 'Valid' ? '#6cc04a20' : '#fbab1830', color: c.status === 'Valid' ? '#3d7a2a' : '#b47a00' }}>{c.status}</span>,
                  ])}
                  onRowClick={(i) => { setSelectedCert(systemCertificates[i]); setCertDetailOpen(true); }}
                />
                <CertificateDetailDialog certificate={selectedCert} open={certDetailOpen} onOpenChange={setCertDetailOpen} />
              </>
            )}
            {certTab === 'trusted' && (
              <ISETable headers={['Friendly Name', 'Subject', 'Issued By', 'Expiry', 'Status', 'Trusted For']}
                rows={trustedCertificates.map(c => [
                  <span className="font-semibold" style={{ color: '#049fd9' }}>{c.friendlyName}</span>,
                  <span className="font-mono text-[11px]">{c.subject}</span>,
                  c.issuedBy,
                  <span className="font-mono" style={{ color: '#888' }}>{c.validTo}</span>,
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#6cc04a20', color: '#3d7a2a' }}>{c.status}</span>,
                  <span style={{ color: '#666' }}>{c.trustedFor}</span>,
                ])} />
            )}
            {certTab === 'ca' && (
              <div className="space-y-3">
                <div className="p-4 border border-border rounded bg-card">
                  <div className="flex items-center gap-2 mb-3"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-xs font-semibold" style={{ color: '#333' }}>ISE Internal Certificate Authority</span></div>
                  <div className="text-xs" style={{ color: '#666' }}>CA Enabled — Root CA certificate valid until 2033-01-01</div>
                  <div className="mt-2 text-xs font-mono p-2 rounded" style={{ background: '#f5f5f5', color: '#333' }}>CN=Cisco ISE CA, O=Cisco, L=San Jose, ST=California, C=US</div>
                </div>
                <div className="p-4 border border-border rounded bg-card">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>CA Certificate Templates</div>
                  <ISETable headers={['Template Name', 'Key Type', 'Key Size', 'SAN', 'Usage']}
                    rows={[
                      ['ISE_Internal_CA_Template', 'RSA', '2048', 'DNS, IP', 'Client Auth, Server Auth'],
                      ['EAP_Authentication_Template', 'RSA', '2048', 'DNS', 'Client Auth'],
                      ['Portal_Certificate_Template', 'RSA', '4096', 'DNS', 'Server Auth'],
                    ].map(r => r.map((c, i) => i === 0 ? <span className="font-semibold" style={{ color: '#049fd9' }}>{c}</span> : <span className="font-mono">{c}</span>))} />
                  <button className="mt-2 text-xs px-3 py-1 rounded text-white" style={{ background: '#049fd9' }}>+ Add Template</button>
                </div>
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

        {/* ============= LOGGING ============= */}
        {active === 'logging' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Settings size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Logging Configuration</span></div>
            <div className="border border-border rounded bg-card p-4 text-xs">
              <div className="font-semibold mb-2" style={{ color: '#333' }}>Logging Targets</div>
              <ISETable headers={['Name', 'Type', 'Severity', 'Status']}
                rows={systemSettings.logging.targets.map(t => [
                  <span className="font-semibold" style={{ color: '#049fd9' }}>{t.name}</span>, t.type,
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: t.severity === 'ERROR' ? '#cc000020' : t.severity === 'WARN' ? '#fbab1830' : '#049fd920', color: t.severity === 'ERROR' ? '#cc0000' : t.severity === 'WARN' ? '#b47a00' : '#049fd9' }}>{t.severity}</span>,
                  t.status,
                ])} />
            </div>
            <div className="border border-border rounded bg-card p-4 text-xs">
              <div className="font-semibold mb-2" style={{ color: '#333' }}>Collection Filters</div>
              <div className="space-y-2">{systemSettings.logging.collectionFilters.map(f => (
                <div key={f.name} className="flex items-center gap-2"><Switch defaultChecked={f.enabled} className="scale-75" /><span style={{ color: '#333' }}>{f.name}</span></div>
              ))}</div>
            </div>
          </div>
        )}

        {/* ============= MAINTENANCE HEADER ============= */}
        {active === 'maintenance-header' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#666' }}>
            <div className="flex items-center gap-2 mb-2"><Wrench size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Maintenance</span></div>
            <p>Manage ISE system backups, patch installations, and repository configurations. Use the left navigation to access:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li><strong>Backup & Restore</strong> — Schedule and manage configuration/operational backups</li>
              <li><strong>Repository</strong> — Configure SFTP/FTP/NFS backup repositories</li>
              <li><strong>Patch Management</strong> — View installed patches and apply updates</li>
            </ul>
          </div>
        )}

        {/* ============= BACKUP & RESTORE ============= */}
        {active === 'backup-restore' && <BackupRestorePanel />}

        {/* ============= REPOSITORY ============= */}
        {active === 'repository' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><HardDrive size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Repository</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>+ Add Repository</button>
            </div>
            <ISETable headers={['Repository Name', 'Type', 'Server', 'Path', 'Status']}
              rows={[
                ['SFTP-Backup-01', 'SFTP', 'sftp-backup.corp.local', '/backups/ise/', 'Available'],
                ['NFS-Archive', 'NFS', 'nfs.corp.local', '/mnt/nfs/ise-archive/', 'Unavailable'],
                ['FTP-DR', 'FTP', 'ftp-dr.corp.local', '/dr/ise/', 'Available'],
                ['Local-Storage', 'Local', 'ise-pan01', '/opt/backup/', 'Available'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{r[1]}</span>,
                <span className="font-mono text-[11px]">{r[2]}</span>,
                <span className="font-mono text-[11px]">{r[3]}</span>,
                <span className="flex items-center gap-1">{r[4] === 'Available' ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#cc0000' }} />} {r[4]}</span>,
              ])} />
          </>
        )}

        {/* ============= PATCH MANAGEMENT ============= */}
        {active === 'patch-mgmt' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Wrench size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Patch Management</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>Install Patch</button>
            </div>
            <ISETable headers={['Patch Name', 'Version', 'Installed Date', 'Installed By', 'Status']}
              rows={patchHistory.map(p => [
                <span className="font-mono text-[11px]" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span className="font-semibold">{p.version}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{p.installedDate}</span>,
                p.installedBy,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: p.status === 'Applied' ? '#6cc04a20' : '#fbab1830', color: p.status === 'Applied' ? '#3d7a2a' : '#b47a00' }}>{p.status}</span>,
              ])} />
          </>
        )}

        {/* ============= SETTINGS ============= */}
        {active === 'settings' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Settings size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>System Settings</span></div>
            <div className="flex items-center border-b border-border mb-3">
              {([['general', 'General'], ['eap-tls', 'EAP-TLS'], ['radius', 'RADIUS'], ['profiler', 'Profiler'], ['posture', 'Posture'], ['pxgrid', 'pxGrid']] as const).map(([key, label]) => (
                <button key={key} className="px-3 py-1.5 text-xs font-medium border-b-2 transition-colors" style={{ color: settingsTab === key ? '#049fd9' : '#666', borderBottomColor: settingsTab === key ? '#049fd9' : 'transparent' }} onClick={() => setSettingsTab(key)}>{label}</button>
              ))}
            </div>
            {settingsTab === 'general' && (
              <div className="border border-border rounded bg-card p-4 space-y-4 text-xs">
                {[{ label: 'Host Name', value: 'ise-pan01' }, { label: 'Domain Name', value: 'corp.local' }, { label: 'Time Zone', value: 'America/Los_Angeles (UTC-8)' }, { label: 'NTP Server', value: '10.1.1.1, 10.1.1.2' }, { label: 'DNS Server', value: '10.1.1.5, 10.1.1.6' }, { label: 'SMTP Server', value: 'smtp.corp.local' }, { label: 'Alarm Notification Email', value: 'ise-alerts@corp.local' }].map(s => (
                  <div key={s.label} className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{s.label}</span><span className="font-mono" style={{ color: '#333' }}>{s.value}</span></div>
                ))}
              </div>
            )}
            {settingsTab === 'eap-tls' && (
              <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
                <SettingSwitchRow label="Session Resume" checked={systemSettings.eapTls.sessionResume} />
                <SettingRow label="EAP-TLS Session Timeout" value={`${systemSettings.eapTls.sessionTimeout} seconds`} />
                <SettingRow label="CA Certificate" value={systemSettings.eapTls.eapTlsCACert} />
                <SettingSwitchRow label="OCSP Validation" checked={systemSettings.eapTls.ocspEnabled} />
                <SettingSwitchRow label="CRL Validation" checked={systemSettings.eapTls.crlEnabled} />
                <SettingRow label="CRL Distribution URL" value={systemSettings.eapTls.crlUrl} mono />
              </div>
            )}
            {settingsTab === 'radius' && (
              <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
                <SettingSwitchRow label="Suppress Anomalous Clients" checked={systemSettings.radius.suppressAnomalousClients} />
                <SettingSwitchRow label="Detect Anomalous Clients" checked={systemSettings.radius.detectAnomalousClients} />
                <SettingRow label="CoA Type" value={systemSettings.radius.coaType} />
                <SettingRow label="Request Timeout" value={`${systemSettings.radius.requestTimeout} seconds`} />
                <SettingRow label="Max Retries" value={String(systemSettings.radius.maxRetries)} />
                <SettingSwitchRow label="Suppress Repeated Failed Clients" checked={systemSettings.radius.suppressRepeatedFailedClients} />
                <SettingRow label="Suppress Duration" value={`${systemSettings.radius.suppressDuration} seconds`} />
              </div>
            )}
            {settingsTab === 'profiler' && (
              <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
                <SettingRow label="CoA Type" value={systemSettings.profiler.coaType} />
                <SettingSwitchRow label="Endpoint Attribute Filter" checked={systemSettings.profiler.endpointAttributeFilter} />
                <SettingRow label="Profiling Delay on CoA" value={`${systemSettings.profiler.profilingDelayOnCoA} seconds`} />
                <div className="border-t border-border pt-2 mt-2"><div className="font-semibold mb-2" style={{ color: '#333' }}>NMAP Scan Settings</div>
                  <SettingSwitchRow label="NMAP Enabled" checked={systemSettings.profiler.nmap.enabled} />
                  <SettingRow label="Scan Subnets" value={systemSettings.profiler.nmap.scanSubnets} mono />
                  <SettingSwitchRow label="Skip NMAP for Known" checked={systemSettings.profiler.nmap.skipNmapScanForKnown} />
                </div>
              </div>
            )}
            {settingsTab === 'posture' && (
              <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
                <SettingRow label="Posture Lease" value={`${systemSettings.posture.postureLease} days`} />
                <SettingRow label="Remediation Timer" value={`${systemSettings.posture.remediationTimer} minutes`} />
                <SettingRow label="Default Posture Status" value={systemSettings.posture.defaultPostureStatus} />
                <SettingSwitchRow label="Continuous Monitoring" checked={systemSettings.posture.continuousMonitoring} />
                <SettingSwitchRow label="Acceptable Use Policy" checked={systemSettings.posture.acceptableUsePolicyEnabled} />
                <SettingSwitchRow label="Stealth Mode" checked={systemSettings.posture.stealthMode} />
              </div>
            )}
            {settingsTab === 'pxgrid' && (
              <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
                <SettingRow label="pxGrid Node" value={systemSettings.pxGrid.pxGridNode} mono />
                <SettingRow label="Status" value={systemSettings.pxGrid.status} />
                <SettingSwitchRow label="Auto-Approve" checked={systemSettings.pxGrid.autoApprove} />
                <SettingSwitchRow label="Certificate-Based" checked={systemSettings.pxGrid.certificateBased} />
                <SettingSwitchRow label="Password-Based" checked={systemSettings.pxGrid.passwordBased} />
              </div>
            )}
            <div className="flex justify-end mt-3"><Button size="sm" style={{ background: '#049fd9' }} onClick={() => toast.success("System settings saved successfully")}>Save Settings</Button></div>
          </>
        )}

        {/* ============= PROXY ============= */}
        {active === 'proxy' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Globe size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Proxy Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['Proxy Enabled', 'No'], ['Proxy Server', '—'], ['Proxy Port', '—'], ['Bypass Proxy For', 'localhost, 127.0.0.1']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-40 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {/* ============= ADMIN AUTH / AUTHZ ============= */}
        {active === 'admin-auth' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Admin Authentication Method</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['Authentication Method', 'Password Based'], ['Password Policy', 'Alphanumeric, min 8 chars, 1 uppercase, 1 digit'], ['Account Lockout', 'After 5 failed attempts'], ['Lockout Duration', '30 minutes'], ['Session Timeout', '60 minutes'], ['Idle Timeout', '30 minutes']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {active === 'admin-authz' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Admin Authorization — RBAC Permissions</span></div>
            <ISETable headers={['Admin Group', 'Menu Access', 'Data Access']}
              rows={[
                ['Super Admin', 'Full Menu Access', 'Full Data Access'],
                ['Network Device Admin', 'Network Resources, Policy', 'Network Devices, Policies'],
                ['Help Desk Admin', 'Operations, Context Visibility', 'Read-Only Logs, Endpoints'],
                ['Read Only Admin', 'All Menus (Read Only)', 'All Data (Read Only)'],
                ['System Admin', 'Administration > System', 'System Settings, Maintenance'],
                ['Policy Admin', 'Policy, Work Centers', 'Policies, Conditions, Results'],
                ['MnT Admin', 'Operations, Reports', 'Logs, Reports, Alarms'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span style={{ color: '#666' }}>{r[1]}</span>,
                <span style={{ color: '#666' }}>{r[2]}</span>,
              ])} />
          </div>
        )}

        {/* ============= NETWORK DEVICES ============= */}
        {active === 'network-devices' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Router size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Devices</span></div>
              <button data-walkthrough="add-device-btn" className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAddDeviceOpen(true)}>+ Add Device</button>
            </div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a device to configure RADIUS, TACACS+, SNMP, and TrustSec settings</div>
            <ISETable headers={['Name', 'IP Address', 'Device Type', 'Location', 'Profile', 'TACACS+', 'Status']}
              rows={networkDevices.map(d => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{d.name}</span>,
                <span className="font-mono">{d.ip}</span>,
                <span style={{ color: '#666' }}>{d.type}</span>,
                d.location, d.profile,
                d.tacacs ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#ccc' }} />,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#6cc04a20', color: '#3d7a2a' }}>{d.status}</span>,
              ])}
              onRowClick={(i) => { setSelectedDevice(networkDevices[i]); setDeviceDetailOpen(true); }}
            />
            <NetworkDeviceDetailDialog device={selectedDevice} open={deviceDetailOpen} onOpenChange={setDeviceDetailOpen} />
            <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="text-sm">Add Network Device</DialogTitle></DialogHeader>
                <div className="space-y-3 text-xs">
                  {[['Device Name', 'text'], ['IP Address / IP Range', 'text'], ['RADIUS Shared Secret', 'password']].map(([label, type]) => (
                    <div key={label}><label className="block mb-1 font-medium" style={{ color: '#555' }}>{label}</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" type={type} /></div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Device Profile</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card"><option>Cisco</option><option>Aruba</option><option>HP</option><option>Juniper</option><option>Meraki</option></select></div>
                    <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Model Name</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" placeholder="e.g. Catalyst 9300" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Device Type (NDG)</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card"><option>Switch</option><option>Wireless Controller</option><option>Firewall</option><option>VPN</option><option>Router</option><option>Access Point</option></select></div>
                    <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Location (NDG)</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card"><option>Building A</option><option>Building B</option><option>Data Center</option><option>DMZ</option><option>Remote</option></select></div>
                  </div>
                  <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Software Version</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" placeholder="e.g. 17.9.1" /></div>
                </div>
                <DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={() => setAddDeviceOpen(false)}>Cancel</Button><Button size="sm" style={{ background: '#049fd9' }} onClick={() => { toast.success("Network device added successfully"); setAddDeviceOpen(false); }}>Save</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {active === 'ndg' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Layers size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Device Groups</span></div>
            <div className="space-y-3">{networkDeviceGroups.map(g => (
              <div key={g.id} className="border border-border rounded bg-card p-3">
                <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold" style={{ color: '#333' }}>{g.name}</span><span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#049fd920', color: '#049fd9' }}>{g.type}</span></div>
                <div className="flex flex-wrap gap-2">{g.children.map(c => <span key={c} className="px-2 py-1 border border-border rounded text-xs" style={{ color: '#555' }}>{g.name}#{c}</span>)}</div>
              </div>
            ))}</div>
          </>
        )}

        {active === 'ndp' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Router size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Device Profiles</span></div>
            <ISETable headers={['Profile Name', 'Vendor', 'CoA Type', 'URL Redirect', 'Description']}
              rows={networkDeviceProfiles.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.vendor,
                <span className="font-mono">{p.coaType}</span>,
                <span className="font-mono text-[11px]">{p.urlRedirect}</span>,
                <span style={{ color: '#666' }}>{p.description}</span>,
              ])} />
          </>
        )}

        {active === 'ext-radius' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Globe size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>External RADIUS Servers</span></div>
            <ISETable headers={['Name', 'Host IP', 'Auth Port', 'Acct Port', 'Shared Secret', 'Timeout', 'Status']}
              rows={[['RADIUS-Proxy-01', '10.5.1.10', '1812', '1813', '●●●●●●●●', '5s', 'Active'], ['RADIUS-Proxy-02', '10.5.1.11', '1812', '1813', '●●●●●●●●', '5s', 'Active']].map(r => r.map((c, i) => i === 0 ? <span className="font-semibold" style={{ color: '#049fd9' }}>{c}</span> : <span className="font-mono">{c}</span>))} />
          </>
        )}

        {active === 'radius-sequences' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Layers size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>RADIUS Server Sequences</span></div>
            <ISETable headers={['Sequence Name', 'Servers', 'Strip Prefix', 'Strip Suffix', 'Description']}
              rows={[
                ['Use_Local', 'Local (ISE)', 'No', 'No', 'Use local ISE RADIUS server'],
                ['Proxy_Sequence', 'RADIUS-Proxy-01 → RADIUS-Proxy-02', 'Yes', 'No', 'Proxy to external RADIUS with failover'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r[1]}</span>,
                <span className="font-mono">{r[2]}</span>,
                <span className="font-mono">{r[3]}</span>,
                <span style={{ color: '#666' }}>{r[4]}</span>,
              ])} />
          </>
        )}

        {/* ============= IDENTITY MANAGEMENT ============= */}
        {active === 'internal-users' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><UserCheck size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Internal Users</span></div>
              <button data-walkthrough="add-user-btn" className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAddUserOpen(true)}>+ Add User</button>
            </div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a user to edit details and custom attributes</div>
            <ISETable headers={['Username', 'First Name', 'Last Name', 'Email', 'Identity Group', 'Status', 'Last Password Change']}
              rows={internalUsers.map(u => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{u.name}</span>,
                u.firstName, u.lastName,
                <span className="font-mono text-[11px]">{u.email}</span>,
                u.identityGroup,
                u.status === 'Enabled' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disabled</span>,
                <span className="font-mono" style={{ color: '#888' }}>{u.lastPasswordChange}</span>,
              ])}
              onRowClick={(i) => { setSelectedInternalUser(internalUsers[i]); setInternalUserOpen(true); }}
            />
            <UserDetailDialog user={selectedInternalUser} type="internal" open={internalUserOpen} onOpenChange={setInternalUserOpen} />
            <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle className="text-sm">Add Internal User</DialogTitle></DialogHeader>
                <div className="space-y-3 text-xs">
                  {[['Username', 'text'], ['First Name', 'text'], ['Last Name', 'text'], ['Email', 'email'], ['Password', 'password']].map(([label, type]) => (
                    <div key={label}><label className="block mb-1 font-medium" style={{ color: '#555' }}>{label}</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" type={type} /></div>
                  ))}
                  <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Identity Group</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card">{identityGroupsList.map(g => <option key={g.id}>{g.name}</option>)}</select></div>
                </div>
                <DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={() => setAddUserOpen(false)}>Cancel</Button><Button size="sm" style={{ background: '#049fd9' }} onClick={() => { toast.success("Internal user created successfully"); setAddUserOpen(false); }}>Create</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {active === 'identity-groups' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Database size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Identity Groups</span></div>
            <ISETable headers={['Group Name', 'Description', 'Members']}
              rows={identityGroupsList.map(g => [<span className="font-semibold" style={{ color: '#049fd9' }}>{g.name}</span>, <span style={{ color: '#666' }}>{g.description}</span>, <span className="font-mono font-bold">{g.members.toLocaleString()}</span>])} />
          </>
        )}

        {active === 'ext-identity' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Globe size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>External Identity Sources</span></div>
            <ISETable headers={['Name', 'Type', 'Status', 'Join Point / Server', 'Domain', 'Users', 'Groups']}
              rows={externalIdentitySources.map(s => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{s.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{s.type}</span>,
                s.status === 'Connected' || s.status === 'Active' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {s.status}</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> {s.status}</span>,
                <span className="font-mono text-[11px]">{s.joinPoint}</span>,
                <span className="font-mono text-[11px]">{s.domain}</span>,
                <span className="font-mono">{s.users.toLocaleString()}</span>,
                <span className="font-mono">{s.groups}</span>,
              ])} />
          </>
        )}

        {active === 'id-sequences' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Layers size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Identity Source Sequences</span></div>
            <ISETable headers={['Sequence Name', 'Sources', 'Description']}
              rows={[
                ['Internal_Users_First', 'Internal Users → Active Directory', 'Try internal users, then fallback to AD'],
                ['AD_Only', 'Active Directory', 'Active Directory only authentication'],
                ['Guest_Portal_Sequence', 'Guest Portal → Internal Users', 'Guest portal with internal user fallback'],
                ['Certificate_Auth_Profile', 'Certificate Store → Internal Users', 'Certificate-based with user validation'],
                ['All_User_ID_Stores', 'Internal Users → AD → LDAP', 'Try all identity stores in sequence'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r[1]}</span>,
                <span style={{ color: '#666' }}>{r[2]}</span>,
              ])} />
          </>
        )}

        {/* ============= ADMIN USERS ============= */}
        {active === 'admin-users' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Administrators</span></div>
              <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAddAdminOpen(true)}>+ Add Admin</button>
            </div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click an admin user to view details and menu access</div>
            <ISETable headers={['Username', 'Email', 'Admin Group', 'Status', 'Last Login']}
              rows={adminUsers.map(u => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{u.name}</span>,
                <span className="font-mono text-[11px]">{u.email}</span>,
                u.groups,
                u.status === 'Enabled' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disabled</span>,
                <span className="font-mono" style={{ color: '#888' }}>{u.lastLogin}</span>,
              ])}
              onRowClick={(i) => { setSelectedAdminUser(adminUsers[i]); setAdminUserOpen(true); }}
            />
            <UserDetailDialog user={selectedAdminUser} type="admin" open={adminUserOpen} onOpenChange={setAdminUserOpen} />
            <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle className="text-sm">Add Administrator</DialogTitle></DialogHeader>
                <div className="space-y-3 text-xs">
                  {[['Username', 'text'], ['Email', 'email'], ['Password', 'password']].map(([label, type]) => (
                    <div key={label}><label className="block mb-1 font-medium" style={{ color: '#555' }}>{label}</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" type={type} /></div>
                  ))}
                  <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Admin Group</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card"><option>Super Admin</option><option>Network Device Admin</option><option>Help Desk Admin</option><option>Read Only Admin</option><option>System Admin</option><option>Policy Admin</option><option>MnT Admin</option></select></div>
                </div>
                <DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={() => setAddAdminOpen(false)}>Cancel</Button><Button size="sm" style={{ background: '#049fd9' }} onClick={() => { toast.success("Administrator created"); setAddAdminOpen(false); }}>Create</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {active === 'admin-groups' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Admin Groups</span></div>
            <ISETable headers={['Group Name', 'Description', 'Type', 'Members']}
              rows={[
                ['Super Admin', 'Full access to all ISE functions', 'Internal', '1'],
                ['Network Device Admin', 'Manage network devices and groups', 'Internal', '1'],
                ['Help Desk Admin', 'View logs, manage endpoints', 'Internal', '1'],
                ['Read Only Admin', 'Read-only access to all sections', 'Internal', '1'],
                ['System Admin', 'System and maintenance operations', 'Internal', '1'],
                ['Policy Admin', 'Manage policies and conditions', 'Internal', '0'],
                ['MnT Admin', 'Monitoring and troubleshooting', 'Internal', '0'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span style={{ color: '#666' }}>{r[1]}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{r[2]}</span>,
                <span className="font-mono">{r[3]}</span>,
              ])} />
          </>
        )}

        {/* ============= SYSTEM CONFIGURATION ============= */}
        {active === 'smtp' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Globe size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>SMTP Server Configuration</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['SMTP Server', smtpConfig.server], ['Port', String(smtpConfig.port)], ['Use TLS', smtpConfig.useTLS ? 'Yes' : 'No'], ['Username', smtpConfig.username], ['From Address', smtpConfig.fromAddress], ['Status', smtpConfig.status]].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-40 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
            <div className="flex justify-end mt-3"><Button size="sm" style={{ background: '#049fd9' }}>Test Connection</Button></div>
          </>
        )}

        {active === 'ntp' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Globe size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>NTP Servers</span></div>
            <ISETable headers={['NTP Server IP', 'Status', 'Stratum', 'Offset']}
              rows={ntpServers.map(n => [
                <span className="font-mono" style={{ color: '#049fd9' }}>{n.ip}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {n.status}</span>,
                <span className="font-mono">{n.stratum}</span>,
                <span className="font-mono">{n.offset}</span>,
              ])} />
          </>
        )}

        {active === 'ers' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Plug size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>ERS (External RESTful Services) / API Gateway</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['ERS Enabled', ersApiSettings.enabled ? 'Yes' : 'No'], ['Port', String(ersApiSettings.port)], ['CORS Allowed', ersApiSettings.corsAllowed ? 'Yes' : 'No'], ['Max Sessions', String(ersApiSettings.maxSessions)], ['SDK Documentation', ersApiSettings.documentation], ['Status', ersApiSettings.status]].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-40 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono text-[11px]" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </>
        )}

        {active === 'data-connect' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Database size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Data Connect (ODBC)</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['Enabled', dataConnectSettings.enabled ? 'Yes' : 'No'], ['Port', String(dataConnectSettings.port)], ['ODBC Name', dataConnectSettings.odbc], ['Max Connections', String(dataConnectSettings.maxConnections)], ['Status', dataConnectSettings.status], ['Password', dataConnectSettings.password]].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-40 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ISETable = ({ headers, rows, onRowClick }: { headers: string[]; rows: React.ReactNode[][]; onRowClick?: (i: number) => void }) => {
  const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (rowIdx: number, colIdx: number, cellContent: React.ReactNode) => {
    const text = typeof cellContent === 'string' ? cellContent : '';
    if (!text && typeof cellContent !== 'string') return;
    setEditCell({ row: rowIdx, col: colIdx });
    setEditValue(text);
  };

  const handleEditDone = () => {
    if (editCell) {
      toast.success(`Cell updated`);
    }
    setEditCell(null);
  };

  return (
    <div className="border border-border rounded overflow-auto bg-card">
      <table className="w-full text-xs">
        <thead><tr style={{ background: '#f0f0f0' }}>{headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className={`hover:bg-accent/60 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(i)}>
            {row.map((cell, j) => (
              <td key={j} className="p-2" onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(i, j, cell); }}>
                {editCell?.row === i && editCell?.col === j ? (
                  <input
                    className="border border-primary rounded px-1 py-0.5 text-xs bg-background w-full"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleEditDone}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditDone()}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : cell}
              </td>
            ))}
          </tr>
        ))}</tbody>
      </table>
      <div className="text-[9px] px-2 py-1 border-t border-border" style={{ color: '#aaa' }}>Double-click a cell to edit inline</div>
    </div>
  );
};

const SettingRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{label}</span><span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span></div>
);

const SettingSwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center gap-2"><span className="w-52 font-medium" style={{ color: '#555' }}>{label}</span><Switch defaultChecked={checked} className="scale-75" /><span style={{ color: '#888' }}>{checked ? 'Enabled' : 'Disabled'}</span></div>
);

export default Administration;
