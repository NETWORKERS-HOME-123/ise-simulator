import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { policySets, authenticationPolicies, authorizationPolicies, authorizationProfiles, policyConditions, radiusDictionaries, profilingPolicies, clientProvisioningResources } from "@/lib/mockData";
import { clientProvisioningRuleDetails } from "@/lib/mockDataExtended";
import { downloadableACLs, allowedProtocolsServices } from "@/lib/mockDataGap";
import { Shield, CheckCircle, XCircle, FileText, Layers, BookOpen, Cpu, Download, Lock, ListChecks, Clock } from "lucide-react";
import { toast } from "sonner";
import PolicySetDetailDialog from "@/components/PolicySetDetailDialog";
import AuthzProfileDetailDialog from "@/components/AuthzProfileDetailDialog";
import ConditionStudioDialog from "@/components/ConditionStudioDialog";
import ProfilingPolicyDetailDialog from "@/components/ProfilingPolicyDetailDialog";
import DACLEditorDialog from "@/components/DACLEditorDialog";
import AllowedProtocolsDialog from "@/components/AllowedProtocolsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const sections: NavSection[] = [
  { label: 'Policy', items: [{ label: 'Policy Sets', key: 'policy-sets' }], defaultOpen: true },
  { label: 'Authentication', items: [{ label: 'Authentication Policies', key: 'auth-policies' }], defaultOpen: true },
  { label: 'Authorization', items: [{ label: 'Authorization Policies', key: 'authz-policies' }], defaultOpen: true },
  { label: 'Policy Elements', items: [
    { label: 'Authorization Profiles', key: 'authz-profiles' },
    { label: 'Downloadable ACLs', key: 'dacls' },
    { label: 'Allowed Protocols', key: 'allowed-protocols' },
    { label: 'Conditions', key: 'conditions' },
    { label: 'Dictionaries', key: 'dictionaries' },
    { label: 'Policy Exceptions', key: 'policy-exceptions' },
    { label: 'Time/Date Conditions', key: 'time-conditions' },
  ], defaultOpen: false },
  { label: 'Profiling', items: [{ label: 'Profiling Policies', key: 'profiling' }], defaultOpen: false },
  { label: 'Client Provisioning', items: [{ label: 'Resources', key: 'client-provisioning' }], defaultOpen: false },
];

const Policy = () => {
  const [active, setActive] = useState('policy-sets');
  const [selectedPolicySet, setSelectedPolicySet] = useState<typeof policySets[0] | null>(null);
  const [policySetOpen, setPolicySetOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<typeof authorizationProfiles[0] | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<typeof policyConditions[0] | null>(null);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [selectedProfilingPolicy, setSelectedProfilingPolicy] = useState<typeof profilingPolicies[0] | null>(null);
  const [profilingOpen, setProfilingOpen] = useState(false);
  const [selectedCPResource, setSelectedCPResource] = useState<typeof clientProvisioningResources[0] | null>(null);
  const [cpResourceOpen, setCpResourceOpen] = useState(false);
  const [selectedDACL, setSelectedDACL] = useState<typeof downloadableACLs[0] | null>(null);
  const [daclOpen, setDaclOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<typeof allowedProtocolsServices[0] | null>(null);
  const [protocolOpen, setProtocolOpen] = useState(false);

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Policy &gt; <span className="font-semibold" style={{ color: '#333' }}>{sections.flatMap(s => s.items).find(i => i.key === active)?.label}</span></div>

        {active === 'policy-sets' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Authentication & Authorization Policy Sets</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a policy set to view authentication and authorization rules</div>
            <Table headers={['#', 'Policy Set Name', 'Status', 'Conditions', 'Authentication Policy', 'Authorization Policy', 'Matched']}
              rows={policySets.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.status === 'Enabled' ? <StatusBadge ok label="Enabled" /> : <StatusBadge ok={false} label="Disabled" />,
                <span className="font-mono" style={{ color: '#666' }}>{p.conditions}</span>,
                p.authPolicy, p.authzPolicy,
                <span className="text-right font-mono">{p.hits.toLocaleString()}</span>,
              ])}
              onRowClick={(i) => { setSelectedPolicySet(policySets[i]); setPolicySetOpen(true); }}
            />
            <PolicySetDetailDialog policySet={selectedPolicySet} open={policySetOpen} onOpenChange={setPolicySetOpen} />
          </>
        )}

        {active === 'auth-policies' && (
          <>
            <div className="flex items-center gap-2 mb-2"><FileText size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Authentication Policies</span></div>
            <Table headers={['#', 'Rule Name', 'Status', 'Conditions', 'Allowed Protocols', 'Identity Store']}
              rows={authenticationPolicies.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.rule}</span>,
                <StatusBadge ok={p.status === 'Enabled'} label={p.status} />,
                <span className="font-mono" style={{ color: '#666' }}>{p.conditions}</span>,
                p.allowedProtocols, p.identityStore,
              ])} />
          </>
        )}

        {active === 'authz-policies' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Layers size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Authorization Policies</span></div>
            <Table headers={['#', 'Rule Name', 'Status', 'Conditions', 'Authorization Profile', 'Security Group']}
              rows={authorizationPolicies.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.rule}</span>,
                <StatusBadge ok={p.status === 'Enabled'} label={p.status} />,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{p.conditions}</span>,
                p.profile, p.securityGroup,
              ])} />
          </>
        )}

        {active === 'authz-profiles' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Authorization Profiles</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a profile to view Common Tasks and RADIUS attributes</div>
            <Table headers={['Name', 'Type', 'Description', 'Access Type', 'VLAN', 'DACL']}
              rows={authorizationProfiles.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.type, <span style={{ color: '#666' }}>{p.description}</span>,
                <span className="font-mono">{p.accessType}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{p.vlan || '—'}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#888' }}>{p.dacl || '—'}</span>,
              ])}
              onRowClick={(i) => { setSelectedProfile(authorizationProfiles[i]); setProfileOpen(true); }}
            />
            <AuthzProfileDetailDialog profile={selectedProfile} open={profileOpen} onOpenChange={setProfileOpen} />
          </>
        )}

        {active === 'dacls' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Lock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Downloadable ACLs (DACLs)</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a DACL to edit Access Control Entries</div>
            <Table headers={['DACL Name', 'Description', 'ACE Lines']}
              rows={downloadableACLs.map(d => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{d.name}</span>,
                <span style={{ color: '#666' }}>{d.description}</span>,
                <span className="font-mono">{d.content.split('\n').length}</span>,
              ])}
              onRowClick={(i) => { setSelectedDACL(downloadableACLs[i]); setDaclOpen(true); }}
            />
            <DACLEditorDialog dacl={selectedDACL} open={daclOpen} onOpenChange={setDaclOpen} />
          </>
        )}

        {active === 'allowed-protocols' && (
          <>
            <div className="flex items-center gap-2 mb-2"><ListChecks size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Allowed Protocols Services</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a service to toggle EAP protocol types</div>
            <Table headers={['Service Name', 'Description', 'Enabled Protocols']}
              rows={allowedProtocolsServices.map(s => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{s.name}</span>,
                <span style={{ color: '#666' }}>{s.description}</span>,
                <span className="font-mono">{Object.values(s.protocols).filter(Boolean).length} / {Object.keys(s.protocols).length}</span>,
              ])}
              onRowClick={(i) => { setSelectedProtocol(allowedProtocolsServices[i]); setProtocolOpen(true); }}
            />
            <AllowedProtocolsDialog service={selectedProtocol} open={protocolOpen} onOpenChange={setProtocolOpen} />
          </>
        )}

        {active === 'conditions' && (
          <>
            <div className="flex items-center gap-2 mb-2"><FileText size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Policy Conditions Library</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a condition to open the Condition Studio editor</div>
            <Table headers={['Name', 'Type', 'Attribute', 'Operator', 'Value', 'Description']}
              rows={policyConditions.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: c.type === 'Compound' ? '#fbab18' + '30' : '#049fd9' + '20', color: c.type === 'Compound' ? '#b47a00' : '#049fd9' }}>{c.type}</span>,
                <span className="font-mono text-[11px]">{c.attribute}</span>,
                c.operator,
                <span className="font-mono">{c.value}</span>,
                <span style={{ color: '#666' }}>{c.description}</span>,
              ])}
              onRowClick={(i) => { setSelectedCondition(policyConditions[i]); setConditionOpen(true); }}
            />
            <ConditionStudioDialog condition={selectedCondition} open={conditionOpen} onOpenChange={setConditionOpen} />
          </>
        )}

        {active === 'dictionaries' && (
          <>
            <div className="flex items-center gap-2 mb-2"><BookOpen size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>RADIUS Dictionaries</span></div>
            <Table headers={['Dictionary Name', 'Vendor', 'Attributes', 'Description']}
              rows={radiusDictionaries.map(d => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{d.name}</span>,
                d.vendor,
                <span className="font-mono">{d.attributes}</span>,
                <span style={{ color: '#666' }}>{d.description}</span>,
              ])} />
          </>
        )}

        {active === 'policy-exceptions' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Policy Exceptions</span></div>
            <div className="text-xs mb-2" style={{ color: '#666' }}>Local and global exception rules that override standard authorization policies</div>
            <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>Global Exceptions</div>
            <Table headers={['#', 'Rule Name', 'Status', 'Conditions', 'Profile', 'Security Group']}
              rows={[
                ['1', 'Blacklisted_Devices', 'Enabled', 'EndPoints:BYODRegistration EQUALS Lost/Stolen', 'Blackhole_Stolen', 'Quarantine'],
                ['2', 'Posture_NonCompliant', 'Enabled', 'Session:PostureStatus EQUALS NonCompliant', 'Posture_Remediation', 'Quarantine'],
                ['3', 'ANC_Quarantined', 'Enabled', 'ANCPolicy EQUALS ANC-Quarantine', 'DenyAccess', 'Quarantine'],
              ].map(r => [
                <span className="font-mono" style={{ color: '#999' }}>{r[0]}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[1]}</span>,
                <StatusBadge ok label={r[2]} />,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r[3]}</span>,
                r[4], r[5],
              ])} />
            <div className="text-xs font-semibold mb-1 mt-3" style={{ color: '#333' }}>Local Exceptions (per Policy Set)</div>
            <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#888' }}>Local exceptions are configured within each Policy Set. Click on a policy set to manage local exceptions.</div>
          </>
        )}

        {active === 'time-conditions' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Clock size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Time and Date Conditions</span></div>
            <Table headers={['Condition Name', 'Days', 'Start Time', 'End Time', 'Description']}
              rows={[
                ['Business_Hours', 'Mon-Fri', '08:00', '18:00', 'Standard business hours access window'],
                ['After_Hours', 'Mon-Fri', '18:00', '08:00', 'Non-business hours access restriction'],
                ['Weekend_Access', 'Sat-Sun', '00:00', '23:59', 'Weekend access window for maintenance'],
                ['Maintenance_Window', 'Sun', '02:00', '06:00', 'Scheduled maintenance window'],
              ].map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r[0]}</span>,
                <span className="font-mono">{r[1]}</span>,
                <span className="font-mono">{r[2]}</span>,
                <span className="font-mono">{r[3]}</span>,
                <span style={{ color: '#666' }}>{r[4]}</span>,
              ])} />
          </>
        )}

        {active === 'profiling' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Cpu size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Profiling Policies</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a policy to view certainty factor conditions</div>
            <Table headers={['Policy Name', 'Min Certainty', 'Matched Endpoints', 'Conditions', 'Parent', 'Status']}
              rows={profilingPolicies.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span className="font-mono">{p.certainty}</span>,
                <span className="font-mono font-bold">{p.matchedEndpoints}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{p.conditions}</span>,
                p.parentPolicy || '—',
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: p.status === 'Verified' ? '#6cc04a20' : '#fbab1830', color: p.status === 'Verified' ? '#3d7a2a' : '#b47a00' }}>{p.status}</span>,
              ])}
              onRowClick={(i) => { setSelectedProfilingPolicy(profilingPolicies[i]); setProfilingOpen(true); }}
            />
            <ProfilingPolicyDetailDialog policy={selectedProfilingPolicy} open={profilingOpen} onOpenChange={setProfilingOpen} />
          </>
        )}

        {active === 'client-provisioning' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Download size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Client Provisioning Resources</span></div>
            <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a resource to view provisioning rule details</div>
            <Table headers={['Name', 'Platform', 'Type', 'Version', 'Status', 'Last Updated']}
              rows={clientProvisioningResources.map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
                r.platform, r.type,
                <span className="font-mono">{r.version}</span>,
                <StatusBadge ok={r.status === 'Active'} label={r.status} />,
                <span style={{ color: '#888' }}>{r.lastUpdated}</span>,
              ])}
              onRowClick={(i) => { setSelectedCPResource(clientProvisioningResources[i]); setCpResourceOpen(true); }}
            />
            <Dialog open={cpResourceOpen} onOpenChange={setCpResourceOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Client Provisioning:</span> {selectedCPResource?.name}</DialogTitle></DialogHeader>
                {selectedCPResource && (() => {
                  const d = clientProvisioningRuleDetails[selectedCPResource.name];
                  return (
                    <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                      <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Name</span><span>{selectedCPResource.name}</span></div>
                      <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Platform</span><span>{selectedCPResource.platform}</span></div>
                      <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Type</span><span>{selectedCPResource.type}</span></div>
                      <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Version</span><span className="font-mono">{selectedCPResource.version}</span></div>
                      {d && (
                        <>
                          <div className="border-t border-border pt-2 mt-2" />
                          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span>{d.description}</span></div>
                          <div className="flex items-start"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>OS Conditions</span>
                            <div className="flex flex-wrap gap-1">{d.osConditions.map(os => <span key={os} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#049fd920', color: '#049fd9' }}>{os}</span>)}</div>
                          </div>
                          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Agent Package</span><span className="font-mono text-[10px]">{d.agentPackage}</span></div>
                          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Profile</span><span className="font-mono">{d.profile}</span></div>
                          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Compliance Module</span><span className="font-mono text-[10px]">{d.complianceModule}</span></div>
                        </>
                      )}
                    </div>
                  );
                })()}
                <DialogFooter className="gap-2">
                  <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); setCpResourceOpen(false); }}>Close</Button>
                  <Button size="sm" style={{ background: '#049fd9' }} onClick={() => { toast.success(`Resource "${selectedCPResource?.name}" saved`); setCpResourceOpen(false); }}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className="flex items-center gap-1">
    {ok ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#999' }} />}
    {label}
  </span>
);

const Table = ({ headers, rows, onRowClick }: { headers: string[]; rows: React.ReactNode[][]; onRowClick?: (i: number) => void }) => (
  <div className="border border-border rounded overflow-auto bg-card">
    <table className="w-full text-xs">
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          {headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className={`hover:bg-accent/60 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(i)}>
            {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Policy;
