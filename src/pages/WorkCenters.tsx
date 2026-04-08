import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { Users, Smartphone, Server, Wifi, Shield, Lock } from "lucide-react";
import { workCenterSections, guestPortals, sponsorGroups, tacacsProfiles, tacacsCommandSets, securityGroups, posturePolicies, clientProvisioningResources, policySets } from "@/lib/mockData";
import { CheckCircle, XCircle } from "lucide-react";

const sections: NavSection[] = [
  { label: 'Guest Access', items: [
    { label: 'Overview', key: 'guest-overview' },
    { label: 'Portals & Components', key: 'guest-portals' },
    { label: 'Sponsor Groups', key: 'sponsor-groups' },
    { label: 'Guest Types', key: 'guest-types' },
  ], defaultOpen: true },
  { label: 'BYOD', items: [
    { label: 'Overview', key: 'byod-overview' },
    { label: 'My Devices Portal', key: 'my-devices' },
    { label: 'BYOD Settings', key: 'byod-settings' },
  ], defaultOpen: false },
  { label: 'Device Administration', items: [
    { label: 'Overview', key: 'devadmin-overview' },
    { label: 'TACACS Profiles', key: 'tacacs-profiles' },
    { label: 'TACACS Command Sets', key: 'tacacs-commands' },
    { label: 'Device Admin Policy Sets', key: 'devadmin-policies' },
  ], defaultOpen: false },
  { label: 'Posture', items: [
    { label: 'Overview', key: 'posture-overview' },
    { label: 'Posture Policy', key: 'posture-policy' },
    { label: 'Client Provisioning', key: 'posture-provisioning' },
  ], defaultOpen: false },
  { label: 'TrustSec', items: [
    { label: 'Overview', key: 'trustsec-overview' },
    { label: 'Security Groups (SGTs)', key: 'security-groups' },
    { label: 'TrustSec Policy', key: 'trustsec-policy' },
    { label: 'IP-SGT Mapping', key: 'ip-sgt' },
  ], defaultOpen: false },
  { label: 'Network Access', items: [
    { label: 'Overview', key: 'netaccess-overview' },
    { label: 'Policy Sets', key: 'netaccess-policies' },
  ], defaultOpen: false },
];

const WorkCenters = () => {
  const [active, setActive] = useState('guest-overview');

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
        <div className="text-xs" style={{ color: '#666' }}>Work Centers &gt; {secLabel} &gt; <span className="font-semibold" style={{ color: '#333' }}>{itemLabel}</span></div>

        {/* Guest Access Overview */}
        {active === 'guest-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Access</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Active Guest Sessions" value="83" color="#6cc04a" />
              <StatCard label="Guest Portals" value={String(guestPortals.length)} color="#049fd9" />
              <StatCard label="Sponsor Groups" value={String(sponsorGroups.length)} color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              Guest Access provides secure, policy-driven network access for visitors and temporary users. Configure portals, sponsor groups, and guest account types to manage the complete guest lifecycle.
            </div>
          </div>
        )}

        {active === 'guest-portals' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Portals</span></div>
            <ISETable headers={['Portal Name', 'Type', 'URL', 'Auth Method', 'Theme', 'Status']}
              rows={guestPortals.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{p.type}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{p.url}</span>,
                p.authMethod, p.theme,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {p.status}</span>,
              ])} />
          </>
        )}

        {active === 'sponsor-groups' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Sponsor Groups</span></div>
            <ISETable headers={['Group Name', 'Description', 'Members', 'Guest Types']}
              rows={sponsorGroups.map(g => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{g.name}</span>,
                <span style={{ color: '#666' }}>{g.description}</span>,
                <span className="font-mono">{g.members}</span>,
                <span className="font-mono text-[11px]">{g.guestTypes.join(', ')}</span>,
              ])} />
          </>
        )}

        {active === 'guest-types' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Types</span></div>
            <ISETable headers={['Guest Type', 'Max Duration', 'Max Logins', 'Sponsor Required', 'Description']}
              rows={[
                ['Contractor', '90 days', '1', 'Yes', 'Long-term contractor access with sponsor approval'],
                ['Daily', '1 day', '1', 'Yes', 'Single-day guest with sponsor approval'],
                ['Weekly', '7 days', '1', 'Yes', 'Week-long guest access'],
                ['Self-Registration', '3 days', '1', 'No', 'Self-registered guest with email verification'],
                ['Hotspot', '1 day', 'Unlimited', 'No', 'Hotspot access with AUP acceptance only'],
              ].map(r => r.map((c, i) => i === 0 ? <span className="font-semibold" style={{ color: '#049fd9' }}>{c}</span> : <span style={{ color: i === 4 ? '#666' : '#333' }}>{c}</span>))} />
          </>
        )}

        {/* BYOD */}
        {active === 'byod-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Smartphone size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>BYOD</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Registered BYOD Devices" value="312" color="#049fd9" />
              <StatCard label="Pending Registration" value="8" color="#fbab18" />
              <StatCard label="Certificates Issued" value="298" color="#6cc04a" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              BYOD allows employees to register personal devices and receive provisioned certificates and supplicant configurations. The onboarding flow includes device registration, certificate provisioning, and network profile installation.
            </div>
            <div className="border border-border rounded bg-card p-4">
              <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>BYOD Onboarding Flow</div>
              <div className="flex items-center gap-2 text-[11px]">
                {['Connect to SSID', 'Redirect to Portal', 'Employee Login', 'Device Registration', 'Install Certificate', 'Connect to Secure SSID'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded border border-border" style={{ color: '#049fd9' }}>{step}</span>
                    {i < 5 && <span style={{ color: '#ccc' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'my-devices' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Smartphone size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>My Devices Portal</span></div>
            <div className="p-4 border border-border rounded bg-card text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div><span style={{ color: '#888' }}>Portal URL:</span> <span className="font-mono">https://mydevices.corp.local:8443</span></div>
                <div><span style={{ color: '#888' }}>Status:</span> <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Active</span></div>
                <div><span style={{ color: '#888' }}>Max Devices per User:</span> <span className="font-mono">5</span></div>
                <div><span style={{ color: '#888' }}>Auto-Approval:</span> <span className="font-mono">Disabled</span></div>
              </div>
            </div>
          </div>
        )}

        {active === 'byod-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Smartphone size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>BYOD Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[
                { label: 'BYOD Portal', value: 'Enabled' },
                { label: 'Certificate Template', value: 'EAP_Authentication_Template' },
                { label: 'Supplicant Provisioning', value: 'Enabled' },
                { label: 'Dual-SSID Flow', value: 'Enabled' },
                { label: 'Provisioning SSID', value: 'Corp-Onboard' },
                { label: 'Secure SSID', value: 'Corp-Secure' },
                { label: 'Maximum Devices per User', value: '5' },
                { label: 'Certificate Validity', value: '365 days' },
              ].map(s => (
                <div key={s.label} className="flex items-center">
                  <span className="w-52 font-medium" style={{ color: '#555' }}>{s.label}</span>
                  <span className="font-mono" style={{ color: '#333' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Device Administration */}
        {active === 'devadmin-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Administration (TACACS+)</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="TACACS+ Profiles" value={String(tacacsProfiles.length)} color="#049fd9" />
              <StatCard label="Command Sets" value={String(tacacsCommandSets.length)} color="#6cc04a" />
              <StatCard label="Device Admin Sessions (24h)" value="128" color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              TACACS+ provides centralized authentication, authorization, and accounting for network device administration. Configure shell profiles, command sets, and device admin policy sets.
            </div>
          </div>
        )}

        {active === 'tacacs-profiles' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TACACS+ Shell Profiles</span></div>
            <ISETable headers={['Profile Name', 'Description', 'Protocol', 'Privilege Level', 'Status']}
              rows={tacacsProfiles.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span style={{ color: '#666' }}>{p.description}</span>,
                <span className="font-mono">{p.protocol}</span>,
                <span className="font-mono font-bold">{p.privilege}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {p.status}</span>,
              ])} />
          </>
        )}

        {active === 'tacacs-commands' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TACACS+ Command Sets</span></div>
            <ISETable headers={['Command Set Name', 'Description', 'Commands', 'Status']}
              rows={tacacsCommandSets.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span style={{ color: '#666' }}>{c.description}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{c.commands}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {c.status}</span>,
              ])} />
          </>
        )}

        {active === 'devadmin-policies' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Admin Policy Sets</span></div>
            <ISETable headers={['#', 'Policy Set', 'Status', 'Conditions', 'Shell Profile', 'Command Set']}
              rows={[
                ['1', 'Network_Admin_Full', 'Enabled', 'AD:MemberOf EQUALS Network Admins', 'Shell_Admin', 'PermitAll'],
                ['2', 'Network_ReadOnly', 'Enabled', 'AD:MemberOf EQUALS NOC', 'Shell_ReadOnly', 'ShowOnly'],
                ['3', 'Network_Monitor', 'Enabled', 'AD:MemberOf EQUALS Monitoring', 'Shell_Monitor', 'ShowOnly'],
                ['4', 'Default_Deny', 'Enabled', 'Default', 'DenyAccess', 'DenyAll'],
              ].map(r => [
                <span className="font-mono" style={{ color: '#999' }}>{r[0]}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[1]}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {r[2]}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r[3]}</span>,
                <span className="font-mono">{r[4]}</span>,
                <span className="font-mono">{r[5]}</span>,
              ])} />
          </>
        )}

        {/* Posture */}
        {active === 'posture-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Assessment</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Compliant Endpoints" value="1,834" color="#6cc04a" />
              <StatCard label="Non-Compliant" value="156" color="#cc0000" />
              <StatCard label="Pending Assessment" value="89" color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              Posture service checks endpoint compliance before granting full network access. Endpoints that fail posture checks are placed in a remediation VLAN with instructions to bring the device into compliance.
            </div>
          </div>
        )}

        {active === 'posture-policy' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Policies</span></div>
            <ISETable headers={['Policy Name', 'Operating System', 'Condition', 'Remediation Action', 'Status']}
              rows={posturePolicies.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.os,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{p.condition}</span>,
                <span className="font-mono">{p.remediationAction}</span>,
                p.status === 'Enabled' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#999' }} /> Disabled</span>,
              ])} />
          </>
        )}

        {active === 'posture-provisioning' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Client Provisioning Resources</span></div>
            <ISETable headers={['Name', 'Platform', 'Type', 'Version', 'Status', 'Last Updated']}
              rows={clientProvisioningResources.map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
                r.platform, r.type,
                <span className="font-mono">{r.version}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {r.status}</span>,
                <span style={{ color: '#888' }}>{r.lastUpdated}</span>,
              ])} />
          </>
        )}

        {/* TrustSec */}
        {active === 'trustsec-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TrustSec (Software-Defined Segmentation)</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Security Groups" value={String(securityGroups.length)} color="#049fd9" />
              <StatCard label="SGT-Tagged Endpoints" value="2,847" color="#6cc04a" />
              <StatCard label="Egress Policies" value="15" color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>
              Cisco TrustSec enables software-defined segmentation across your network using Security Group Tags (SGTs). Assign SGTs at authentication, then enforce segmentation policies at egress points.
            </div>
          </div>
        )}

        {active === 'security-groups' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Security Groups (SGTs)</span></div>
            <ISETable headers={['', 'Name', 'SGT Value', 'Description', 'Learned']}
              rows={securityGroups.map(g => [
                <span className="text-lg">{g.icon}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{g.name}</span>,
                <span className="font-mono font-bold">{g.tag}</span>,
                <span style={{ color: '#666' }}>{g.description}</span>,
                g.learned ? <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#fbab1830', color: '#b47a00' }}>Learned</span> : <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>Static</span>,
              ])} />
          </>
        )}

        {active === 'trustsec-policy' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TrustSec Egress Policy Matrix</span></div>
            <div className="text-xs mb-2" style={{ color: '#666' }}>Define which source SGTs can communicate with destination SGTs</div>
            <div className="border border-border rounded overflow-auto bg-card p-2">
              <table className="w-full text-[10px]">
                <thead>
                  <tr>
                    <th className="p-1 font-semibold text-left" style={{ color: '#555' }}>Source ↓ / Dest →</th>
                    {['Employees', 'Guests', 'Servers', 'IOT', 'Quarantine'].map(h => <th key={h} className="p-1 font-semibold" style={{ color: '#555' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {['Employees', 'Guests', 'Contractors', 'BYOD', 'IOT'].map((src, i) => (
                    <tr key={src} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="p-1 font-semibold" style={{ color: '#333' }}>{src}</td>
                      {[0,1,2,3,4].map(j => {
                        const allowed = !((src === 'Guests' && j === 2) || (src === 'IOT' && j === 2) || j === 4);
                        return <td key={j} className="p-1 text-center">
                          {allowed
                            ? <span className="px-1 py-0.5 rounded" style={{ background: '#6cc04a20', color: '#3d7a2a' }}>Permit</span>
                            : <span className="px-1 py-0.5 rounded" style={{ background: '#cc000020', color: '#cc0000' }}>Deny</span>
                          }
                        </td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === 'ip-sgt' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>IP-SGT Static Mapping</span></div>
            <ISETable headers={['IP Address / Subnet', 'SGT', 'Security Group', 'Deploy To', 'Description']}
              rows={[
                ['10.1.0.0/16', '4', 'Employees', 'All TrustSec Devices', 'Corporate wired subnet'],
                ['10.2.0.0/16', '6', 'Guests', 'All TrustSec Devices', 'Guest wireless subnet'],
                ['10.3.0.0/24', '11', 'Servers', 'All TrustSec Devices', 'Data center subnet'],
                ['172.16.0.0/12', '12', 'VPN_Users', 'VPN Concentrators', 'VPN pool subnet'],
                ['10.4.0.0/24', '10', 'IOT_Devices', 'All TrustSec Devices', 'IoT VLAN'],
              ].map(r => r.map((c, i) => i === 0 ? <span className="font-mono" style={{ color: '#049fd9' }}>{c}</span> : <span className={i === 1 ? 'font-mono font-bold' : ''} style={{ color: i === 4 ? '#666' : '#333' }}>{c}</span>))} />
          </>
        )}

        {/* Network Access */}
        {active === 'netaccess-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Access</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Active Policy Sets" value={String(policySets.filter(p => p.status === 'Enabled').length)} color="#049fd9" />
              <StatCard label="Total Policy Hits (24h)" value={policySets.reduce((a, p) => a + p.hits, 0).toLocaleString()} color="#6cc04a" />
              <StatCard label="Authentication Rate" value="97.3%" color="#6cc04a" />
            </div>
          </div>
        )}

        {active === 'netaccess-policies' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Access Policy Sets</span></div>
            <ISETable headers={['#', 'Policy Set', 'Status', 'Conditions', 'Auth Policy', 'Authz Policy', 'Hits']}
              rows={policySets.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.status === 'Enabled' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#999' }} /> Disabled</span>,
                <span className="font-mono" style={{ color: '#666' }}>{p.conditions}</span>,
                p.authPolicy, p.authzPolicy,
                <span className="font-mono">{p.hits.toLocaleString()}</span>,
              ])} />
          </>
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

const ISETable = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div className="border border-border rounded overflow-auto bg-card">
    <table className="w-full text-xs">
      <thead><tr style={{ background: '#f0f0f0' }}>{headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
          {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

export default WorkCenters;
