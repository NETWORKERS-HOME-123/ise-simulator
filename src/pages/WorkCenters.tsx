import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { Users, Smartphone, Server, Wifi, Shield, Lock } from "lucide-react";
import { workCenterSections, guestPortals, sponsorGroups, tacacsProfiles, tacacsCommandSets, securityGroups, posturePolicies, clientProvisioningResources, policySets } from "@/lib/mockData";
import { postureConditions, postureRequirements, postureRemediations, guestTypeDetails, shellProfileDetails, commandSetDetails, sxpDevices } from "@/lib/mockDataGap";
import { CheckCircle, XCircle } from "lucide-react";
import PostureConditionDialog from "@/components/PostureConditionDialog";
import GuestTypeDetailDialog from "@/components/GuestTypeDetailDialog";
import ShellProfileDialog from "@/components/ShellProfileDialog";
import CommandSetDialog from "@/components/CommandSetDialog";
import SXPDeviceDialog from "@/components/SXPDeviceDialog";

const sections: NavSection[] = [
  { label: 'Network Access', items: [
    { label: 'Overview', key: 'netaccess-overview' },
    { label: 'Policy Sets', key: 'netaccess-policies' },
    { label: 'External RADIUS Servers', key: 'netaccess-ext-radius' },
    { label: 'External ID Sources', key: 'netaccess-ext-id' },
    { label: 'Network Devices', key: 'netaccess-devices' },
  ], defaultOpen: true },
  { label: 'Guest Access', items: [
    { label: 'Overview', key: 'guest-overview' },
    { label: 'Portals & Components', key: 'guest-portals' },
    { label: 'Sponsor Groups', key: 'sponsor-groups' },
    { label: 'Guest Types', key: 'guest-types' },
    { label: 'Settings', key: 'guest-settings' },
  ], defaultOpen: false },
  { label: 'BYOD', items: [
    { label: 'Overview', key: 'byod-overview' },
    { label: 'My Devices Portal', key: 'my-devices' },
    { label: 'Settings', key: 'byod-settings' },
  ], defaultOpen: false },
  { label: 'Device Administration', items: [
    { label: 'Overview', key: 'devadmin-overview' },
    { label: 'Policy Sets', key: 'devadmin-policies' },
    { label: 'Policy Elements', key: 'devadmin-elements' },
    { label: 'TACACS Profiles', key: 'tacacs-profiles' },
    { label: 'TACACS Command Sets', key: 'tacacs-commands' },
    { label: 'Network Resources', key: 'devadmin-resources' },
    { label: 'Settings', key: 'devadmin-settings' },
  ], defaultOpen: false },
  { label: 'Posture', items: [
    { label: 'Overview', key: 'posture-overview' },
    { label: 'Posture Policy', key: 'posture-policy' },
    { label: 'Policy Elements', key: 'posture-elements' },
    { label: 'Posture Conditions', key: 'posture-conditions' },
    { label: 'Posture Requirements', key: 'posture-requirements' },
    { label: 'Remediation Actions', key: 'posture-remediation' },
    { label: 'Client Provisioning', key: 'posture-provisioning' },
    { label: 'Settings', key: 'posture-settings' },
  ], defaultOpen: false },
  { label: 'TrustSec', items: [
    { label: 'Overview', key: 'trustsec-overview' },
    { label: 'Components', key: 'trustsec-components' },
    { label: 'Security Groups (SGTs)', key: 'security-groups' },
    { label: 'SGACLs', key: 'sgacls' },
    { label: 'IP-SGT Mapping', key: 'ip-sgt' },
    { label: 'SXP Devices', key: 'sxp-devices' },
    { label: 'TrustSec Policy', key: 'trustsec-policy' },
    { label: 'Settings', key: 'trustsec-settings' },
  ], defaultOpen: false },
];

const WorkCenters = () => {
  const [active, setActive] = useState('netaccess-overview');
  const [selectedCondition, setSelectedCondition] = useState<typeof postureConditions[0] | null>(null);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [selectedGuestType, setSelectedGuestType] = useState<string | null>(null);
  const [guestTypeOpen, setGuestTypeOpen] = useState(false);
  const [selectedShellProfile, setSelectedShellProfile] = useState<string | null>(null);
  const [shellProfileOpen, setShellProfileOpen] = useState(false);
  const [selectedCommandSet, setSelectedCommandSet] = useState<string | null>(null);
  const [commandSetOpen, setCommandSetOpen] = useState(false);
  const [selectedSXP, setSelectedSXP] = useState<typeof sxpDevices[0] | null>(null);
  const [sxpOpen, setSxpOpen] = useState(false);

  const getSectionLabel = () => {
    const section = sections.find(s => s.items.some(i => i.key === active));
    const item = sections.flatMap(s => s.items).find(i => i.key === active);
    return { section: section?.label, item: item?.label };
  };
  const { section: secLabel, item: itemLabel } = getSectionLabel();

  const guestTypes = ['Contractor', 'Daily', 'Weekly', 'Self-Registration', 'Hotspot'];

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Work Centers &gt; {secLabel} &gt; <span className="font-semibold" style={{ color: '#333' }}>{itemLabel}</span></div>

        {/* ========== NETWORK ACCESS ========== */}
        {active === 'netaccess-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Access</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Active Policy Sets" value={String(policySets.filter(p => p.status === 'Enabled').length)} color="#049fd9" />
              <StatCard label="Total Policy Hits (24h)" value={policySets.reduce((a, p) => a + p.hits, 0).toLocaleString()} color="#6cc04a" />
              <StatCard label="Authentication Rate" value="97.3%" color="#6cc04a" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>Network Access provides 802.1X, MAB, and web authentication policy management for wired and wireless endpoints.</div>
          </div>
        )}

        {active === 'netaccess-policies' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Access Policy Sets</span></div>
            <ISETable headers={['#', 'Policy Set', 'Status', 'Conditions', 'Allowed Protocols', 'Hits']}
              rows={policySets.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.status === 'Enabled' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Enabled</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#999' }} /> Disabled</span>,
                <span className="font-mono" style={{ color: '#666' }}>{p.conditions}</span>,
                p.authPolicy,
                <span className="font-mono">{p.hits.toLocaleString()}</span>,
              ])} />
          </>
        )}

        {active === 'netaccess-ext-radius' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#888' }}>
            <div className="flex items-center gap-2 mb-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>External RADIUS Servers</span></div>
            Configure external RADIUS servers for proxy authentication. Manage these under Administration &gt; Network Resources &gt; External RADIUS Servers.
          </div>
        )}

        {active === 'netaccess-ext-id' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#888' }}>
            <div className="flex items-center gap-2 mb-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>External Identity Sources</span></div>
            Configure Active Directory, LDAP, and SAML identity sources. Manage these under Administration &gt; Identity Management &gt; External Identity Sources.
          </div>
        )}

        {active === 'netaccess-devices' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#888' }}>
            <div className="flex items-center gap-2 mb-2"><Wifi size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Network Devices</span></div>
            Configure network access devices (switches, WLCs). Manage these under Administration &gt; Network Resources &gt; Network Devices.
          </div>
        )}

        {/* ========== GUEST ACCESS ========== */}
        {active === 'guest-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Access</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Active Guest Sessions" value="83" color="#6cc04a" />
              <StatCard label="Guest Portals" value={String(guestPortals.length)} color="#049fd9" />
              <StatCard label="Sponsor Groups" value={String(sponsorGroups.length)} color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>Guest Access provides secure, policy-driven network access for visitors and temporary users through captive portals.</div>
          </div>
        )}

        {active === 'guest-portals' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Portals & Components</span></div>
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
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a guest type to view detailed configuration</div>
            <ISETable headers={['Guest Type', 'Max Duration', 'Max Logins', 'Sponsor Required', 'Description']}
              rows={guestTypes.map(gt => {
                const d = guestTypeDetails[gt];
                return [
                  <span className="font-semibold" style={{ color: '#049fd9' }}>{gt}</span>,
                  <span className="font-mono">{d?.accessDuration || '—'}</span>,
                  <span className="font-mono">{d?.maxLogins === -1 ? 'Unlimited' : d?.maxLogins || '—'}</span>,
                  d?.sponsorRequired ? 'Yes' : 'No',
                  <span style={{ color: '#666' }}>{d?.description || ''}</span>,
                ];
              })}
              onRowClick={(i) => { setSelectedGuestType(guestTypes[i]); setGuestTypeOpen(true); }}
            />
            <GuestTypeDetailDialog guestType={selectedGuestType} details={selectedGuestType ? guestTypeDetails[selectedGuestType] || null : null} open={guestTypeOpen} onOpenChange={setGuestTypeOpen} />
          </>
        )}

        {active === 'guest-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Users size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Guest Access Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['Guest Account Purge', 'Enabled — every 24 hours'], ['Self-Registration Approval', 'Auto-Approve'], ['SMS Gateway', 'Configured — Twilio'], ['SMTP Notifications', 'Enabled'], ['AUP Page', 'Enabled — must scroll to accept']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-44 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {/* ========== BYOD ========== */}
        {active === 'byod-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Smartphone size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>BYOD</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Registered BYOD Devices" value="312" color="#049fd9" />
              <StatCard label="Pending Registration" value="8" color="#fbab18" />
              <StatCard label="Certificates Issued" value="298" color="#6cc04a" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>BYOD allows employees to register personal devices and receive provisioned certificates for secure network access.</div>
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
                <div><span style={{ color: '#888' }}>Status:</span> <span className="flex items-center gap-1 inline-flex"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Active</span></div>
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
              {[{ label: 'BYOD Portal', value: 'Enabled' }, { label: 'Certificate Template', value: 'EAP_Authentication_Template' }, { label: 'Supplicant Provisioning', value: 'Enabled' }, { label: 'Dual-SSID Flow', value: 'Enabled' }, { label: 'Provisioning SSID', value: 'Corp-Onboard' }, { label: 'Secure SSID', value: 'Corp-Secure' }, { label: 'Maximum Devices per User', value: '5' }, { label: 'Certificate Validity', value: '365 days' }].map(s => (
                <div key={s.label} className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{s.label}</span><span className="font-mono" style={{ color: '#333' }}>{s.value}</span></div>
              ))}
            </div>
          </div>
        )}

        {/* ========== DEVICE ADMINISTRATION ========== */}
        {active === 'devadmin-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Administration (TACACS+)</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="TACACS+ Profiles" value={String(tacacsProfiles.length)} color="#049fd9" />
              <StatCard label="Command Sets" value={String(tacacsCommandSets.length)} color="#6cc04a" />
              <StatCard label="Device Admin Sessions (24h)" value="128" color="#fbab18" />
            </div>
          </div>
        )}

        {active === 'devadmin-elements' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#666' }}>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Admin Policy Elements</span></div>
            <p>Configure TACACS+ shell profiles and command sets used in device administration policy sets. Use the left navigation to access individual elements.</p>
          </div>
        )}

        {active === 'devadmin-resources' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#888' }}>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Admin Network Resources</span></div>
            Network devices for TACACS+ are shared with Administration &gt; Network Resources &gt; Network Devices. Ensure TACACS+ is enabled on the device configuration.
          </div>
        )}

        {active === 'devadmin-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Device Administration Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['TACACS+ Service', 'Enabled'], ['Default Shared Secret', '●●●●●●●●'], ['Single Connect Support', 'Draft Compliance'], ['Session Timeout', '300 seconds'], ['Logging Level', 'Full']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-44 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {active === 'tacacs-profiles' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TACACS+ Shell Profiles</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a profile to view privilege level and custom attributes</div>
            <ISETable headers={['Profile Name', 'Description', 'Protocol', 'Privilege Level', 'Status']}
              rows={tacacsProfiles.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span style={{ color: '#666' }}>{p.description}</span>,
                <span className="font-mono">{p.protocol}</span>,
                <span className="font-mono font-bold">{p.privilege}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {p.status}</span>,
              ])}
              onRowClick={(i) => { setSelectedShellProfile(tacacsProfiles[i].name); setShellProfileOpen(true); }}
            />
            <ShellProfileDialog profileName={selectedShellProfile} details={selectedShellProfile ? shellProfileDetails[selectedShellProfile] || null : null} open={shellProfileOpen} onOpenChange={setShellProfileOpen} />
          </>
        )}

        {active === 'tacacs-commands' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TACACS+ Command Sets</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a command set to view permit/deny rules</div>
            <ISETable headers={['Command Set Name', 'Description', 'Commands', 'Status']}
              rows={tacacsCommandSets.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span style={{ color: '#666' }}>{c.description}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{c.commands}</span>,
                <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {c.status}</span>,
              ])}
              onRowClick={(i) => { setSelectedCommandSet(tacacsCommandSets[i].name); setCommandSetOpen(true); }}
            />
            <CommandSetDialog commandSetName={selectedCommandSet} details={selectedCommandSet ? commandSetDetails[selectedCommandSet] || null : null} open={commandSetOpen} onOpenChange={setCommandSetOpen} />
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

        {/* ========== POSTURE ========== */}
        {active === 'posture-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Assessment</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Compliant Endpoints" value="1,834" color="#6cc04a" />
              <StatCard label="Non-Compliant" value="156" color="#cc0000" />
              <StatCard label="Pending Assessment" value="89" color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>Posture service checks endpoint compliance before granting full network access. Configure conditions, requirements, and remediation actions.</div>
          </div>
        )}

        {active === 'posture-elements' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#666' }}>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Policy Elements</span></div>
            <p>Configure the building blocks of posture assessment policies:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li><strong>Conditions</strong> — AV, firewall, disk encryption, registry, file checks</li>
              <li><strong>Requirements</strong> — Group conditions with remediation actions</li>
              <li><strong>Remediation Actions</strong> — Scripts, links, patches, file downloads</li>
            </ul>
          </div>
        )}

        {active === 'posture-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['Posture Lease', '7 days'], ['Remediation Timer', '15 minutes'], ['Default Posture Status', 'Non-Compliant'], ['Continuous Monitoring', 'Enabled'], ['Stealth Mode', 'Disabled'], ['AUP Required', 'Enabled']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-44 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
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

        {active === 'posture-conditions' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Conditions</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a condition to view/edit details</div>
            <ISETable headers={['Name', 'Type', 'OS', 'Attribute', 'Operator', 'Value', 'Description']}
              rows={postureConditions.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{c.type}</span>,
                c.os,
                <span className="font-mono text-[11px]">{c.attribute}</span>,
                c.operator,
                <span className="font-mono">{c.value || '—'}</span>,
                <span style={{ color: '#666' }}>{c.description}</span>,
              ])}
              onRowClick={(i) => { setSelectedCondition(postureConditions[i]); setConditionOpen(true); }}
            />
            <PostureConditionDialog condition={selectedCondition} open={conditionOpen} onOpenChange={setConditionOpen} />
          </>
        )}

        {active === 'posture-requirements' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Posture Requirements</span></div>
            <ISETable headers={['Requirement Name', 'OS', 'Conditions', 'Remediation', 'Grace Period']}
              rows={postureRequirements.map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
                r.os,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r.conditions.join(', ')}</span>,
                <span className="font-mono">{r.remediation}</span>,
                <span className="font-mono">{r.gracePeriod}</span>,
              ])} />
          </>
        )}

        {active === 'posture-remediation' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Remediation Actions</span></div>
            <ISETable headers={['Name', 'Type', 'Action', 'Instructions']}
              rows={postureRemediations.map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{r.type}</span>,
                <span style={{ color: '#666' }}>{r.action}</span>,
                <span className="text-[11px]" style={{ color: '#888' }}>{r.instructions}</span>,
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

        {/* ========== TRUSTSEC ========== */}
        {active === 'trustsec-overview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TrustSec (Software-Defined Segmentation)</span></div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Security Groups" value={String(securityGroups.length)} color="#049fd9" />
              <StatCard label="SGT-Tagged Endpoints" value="2,847" color="#6cc04a" />
              <StatCard label="SXP Peers" value={String(sxpDevices.length)} color="#fbab18" />
            </div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>Cisco TrustSec enables software-defined segmentation using Security Group Tags (SGTs) and Security Group ACLs (SGACLs).</div>
          </div>
        )}

        {active === 'trustsec-components' && (
          <div className="text-xs p-4 border border-border rounded bg-card" style={{ color: '#666' }}>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TrustSec Components</span></div>
            <p>TrustSec components define the segmentation policy building blocks:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li><strong>Security Groups (SGTs)</strong> — Tags assigned to endpoints based on identity/posture</li>
              <li><strong>SGACLs</strong> — Access control lists applied between security groups</li>
              <li><strong>IP-SGT Mapping</strong> — Static IP-to-SGT assignments</li>
              <li><strong>SXP Devices</strong> — SGT Exchange Protocol peers</li>
            </ul>
          </div>
        )}

        {active === 'sgacls' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Security Group ACLs (SGACLs)</span></div>
            <ISETable headers={['SGACL Name', 'IP Version', 'ACE Content', 'Description']}
              rows={[
                ['Deny_IP_Log', 'IPv4', 'deny ip log', 'Deny all IP traffic with logging'],
                ['Permit_IP', 'IPv4', 'permit ip', 'Permit all IP traffic'],
                ['Deny_ICMP_Permit_Rest', 'IPv4', 'deny icmp\npermit ip', 'Block ICMP, allow everything else'],
                ['Server_Access', 'IPv4', 'permit tcp dst eq 443\npermit tcp dst eq 80\ndeny ip', 'Allow HTTP/HTTPS only'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{r[1]}</span>,
                <span className="font-mono text-[10px]" style={{ color: '#666' }}>{r[2]}</span>,
                <span style={{ color: '#666' }}>{r[3]}</span>,
              ])} />
          </>
        )}

        {active === 'security-groups' && (
          <>
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Security Groups (SGTs)</span></div><button data-walkthrough="add-sgt-btn" className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>+ Add SGT</button></div>
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
                <thead><tr><th className="p-1 font-semibold text-left" style={{ color: '#555' }}>Source ↓ / Dest →</th>{['Employees', 'Guests', 'Servers', 'IOT', 'Quarantine'].map(h => <th key={h} className="p-1 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
                <tbody>{['Employees', 'Guests', 'Contractors', 'BYOD', 'IOT'].map((src, i) => (
                  <tr key={src} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td className="p-1 font-semibold" style={{ color: '#333' }}>{src}</td>
                    {[0,1,2,3,4].map(j => {
                      const allowed = !((src === 'Guests' && j === 2) || (src === 'IOT' && j === 2) || j === 4);
                      return <td key={j} className="p-1 text-center">{allowed ? <span className="px-1 py-0.5 rounded" style={{ background: '#6cc04a20', color: '#3d7a2a' }}>Permit</span> : <span className="px-1 py-0.5 rounded" style={{ background: '#cc000020', color: '#cc0000' }}>Deny</span>}</td>;
                    })}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {active === 'trustsec-settings' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TrustSec Settings</span></div>
            <div className="border border-border rounded bg-card p-4 space-y-3 text-xs">
              {[['TrustSec Service', 'Enabled'], ['CTS Device ID', 'ise-pan01'], ['CTS Password', '●●●●●●●●'], ['Environment Data Download', 'Enabled'], ['Peer Authorization Policy', 'Cisco TrustSec Matrix'], ['SGT Notifications', 'Enabled']].map(([l, v]) => (
                <div key={l} className="flex items-center"><span className="w-52 font-medium" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
              ))}
            </div>
          </div>
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

        {active === 'sxp-devices' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>SXP Devices</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click an SXP peer to view connection details</div>
            <ISETable headers={['Device Name', 'IP Address', 'SXP Mode', 'Peer IP', 'Status', 'Domain']}
              rows={sxpDevices.map(d => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{d.name}</span>,
                <span className="font-mono">{d.ip}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{d.mode}</span>,
                <span className="font-mono">{d.peerIp}</span>,
                d.status === 'On' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> On</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Off</span>,
                d.domain,
              ])}
              onRowClick={(i) => { setSelectedSXP(sxpDevices[i]); setSxpOpen(true); }}
            />
            <SXPDeviceDialog device={selectedSXP} open={sxpOpen} onOpenChange={setSxpOpen} />
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

export default WorkCenters;
