import { useState } from "react";
import ISELeftNav, { NavSection } from "@/components/ISELeftNav";
import { policySets, authenticationPolicies, authorizationPolicies, authorizationProfiles, policyConditions, radiusDictionaries, profilingPolicies, clientProvisioningResources } from "@/lib/mockData";
import { Shield, CheckCircle, XCircle, FileText, Layers, BookOpen, Cpu, Download } from "lucide-react";

const sections: NavSection[] = [
  { label: 'Policy', items: [{ label: 'Policy Sets', key: 'policy-sets' }], defaultOpen: true },
  { label: 'Authentication', items: [{ label: 'Authentication Policies', key: 'auth-policies' }], defaultOpen: true },
  { label: 'Authorization', items: [{ label: 'Authorization Policies', key: 'authz-policies' }], defaultOpen: true },
  { label: 'Policy Elements', items: [
    { label: 'Authorization Profiles', key: 'authz-profiles' },
    { label: 'Conditions', key: 'conditions' },
    { label: 'Dictionaries', key: 'dictionaries' },
  ], defaultOpen: false },
  { label: 'Profiling', items: [{ label: 'Profiling Policies', key: 'profiling' }], defaultOpen: false },
  { label: 'Client Provisioning', items: [{ label: 'Resources', key: 'client-provisioning' }], defaultOpen: false },
];

const Policy = () => {
  const [active, setActive] = useState('policy-sets');

  return (
    <div className="flex">
      <ISELeftNav sections={sections} activeKey={active} onSelect={setActive} />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="text-xs" style={{ color: '#666' }}>Policy &gt; <span className="font-semibold" style={{ color: '#333' }}>{sections.flatMap(s => s.items).find(i => i.key === active)?.label}</span></div>

        {active === 'policy-sets' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Authentication & Authorization Policy Sets</span></div>
            <Table headers={['#', 'Policy Set Name', 'Status', 'Conditions', 'Authentication Policy', 'Authorization Policy', 'Matched']}
              rows={policySets.map(p => [
                <span className="font-mono" style={{ color: '#999' }}>{p.id}</span>,
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.status === 'Enabled' ? <StatusBadge ok label="Enabled" /> : <StatusBadge ok={false} label="Disabled" />,
                <span className="font-mono" style={{ color: '#666' }}>{p.conditions}</span>,
                p.authPolicy, p.authzPolicy,
                <span className="text-right font-mono">{p.hits.toLocaleString()}</span>,
              ])} />
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
            <Table headers={['Name', 'Type', 'Description', 'Access Type', 'VLAN', 'DACL']}
              rows={authorizationProfiles.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                p.type, <span style={{ color: '#666' }}>{p.description}</span>,
                <span className="font-mono">{p.accessType}</span>,
                <span className="font-mono" style={{ color: '#888' }}>{p.vlan || '—'}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#888' }}>{p.dacl || '—'}</span>,
              ])} />
          </>
        )}

        {active === 'conditions' && (
          <>
            <div className="flex items-center gap-2 mb-2"><FileText size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Policy Conditions Library</span></div>
            <Table headers={['Name', 'Type', 'Attribute', 'Operator', 'Value', 'Description']}
              rows={policyConditions.map(c => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{c.name}</span>,
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: c.type === 'Compound' ? '#fbab18' + '30' : '#049fd9' + '20', color: c.type === 'Compound' ? '#b47a00' : '#049fd9' }}>{c.type}</span>,
                <span className="font-mono text-[11px]">{c.attribute}</span>,
                c.operator,
                <span className="font-mono">{c.value}</span>,
                <span style={{ color: '#666' }}>{c.description}</span>,
              ])} />
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

        {active === 'profiling' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Cpu size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Profiling Policies</span></div>
            <Table headers={['Policy Name', 'Min Certainty', 'Matched Endpoints', 'Conditions', 'Parent', 'Status']}
              rows={profilingPolicies.map(p => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{p.name}</span>,
                <span className="font-mono">{p.certainty}</span>,
                <span className="font-mono font-bold">{p.matchedEndpoints}</span>,
                <span className="font-mono text-[11px]" style={{ color: '#666' }}>{p.conditions}</span>,
                p.parentPolicy || '—',
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: p.status === 'Verified' ? '#6cc04a20' : '#fbab1830', color: p.status === 'Verified' ? '#3d7a2a' : '#b47a00' }}>{p.status}</span>,
              ])} />
          </>
        )}

        {active === 'client-provisioning' && (
          <>
            <div className="flex items-center gap-2 mb-2"><Download size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Client Provisioning Resources</span></div>
            <Table headers={['Name', 'Platform', 'Type', 'Version', 'Status', 'Last Updated']}
              rows={clientProvisioningResources.map(r => [
                <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
                r.platform, r.type,
                <span className="font-mono">{r.version}</span>,
                <StatusBadge ok={r.status === 'Active'} label={r.status} />,
                <span style={{ color: '#888' }}>{r.lastUpdated}</span>,
              ])} />
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

const Table = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div className="border border-border rounded overflow-auto bg-card">
    <table className="w-full text-xs">
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          {headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
            {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Policy;
