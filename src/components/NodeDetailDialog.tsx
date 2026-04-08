import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Server, CheckCircle, XCircle } from "lucide-react";

interface DeploymentNode {
  hostname: string;
  ip: string;
  role: string;
  persona: string;
  status: string;
  version: string;
  roles: { admin: boolean; monitoring: boolean; policyService: boolean };
  probes: Record<string, boolean>;
}

interface NodeDetailDialogProps {
  node: DeploymentNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const probeLabels: Record<string, string> = {
  netflow: 'NetFlow',
  dhcp: 'DHCP',
  dhcpSpan: 'DHCP SPAN',
  http: 'HTTP',
  radius: 'RADIUS',
  nmap: 'NMAP',
  dns: 'DNS',
  snmpQuery: 'SNMP Query',
  snmpTrap: 'SNMP Trap',
  ad: 'Active Directory',
};

const NodeDetailDialog = ({ node, open, onOpenChange }: NodeDetailDialogProps) => {
  const [roles, setRoles] = useState(node?.roles ?? { admin: false, monitoring: false, policyService: false });
  const [probes, setProbes] = useState(node?.probes ?? {});

  if (!node) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Server size={16} style={{ color: '#049fd9' }} />
            Node Configuration — {node.hostname}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Node Info */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded border border-border" style={{ background: '#fafafa' }}>
            <div><span style={{ color: '#888' }}>Hostname:</span> <span className="font-mono font-semibold">{node.hostname}</span></div>
            <div><span style={{ color: '#888' }}>IP Address:</span> <span className="font-mono">{node.ip}</span></div>
            <div><span style={{ color: '#888' }}>Version:</span> <span className="font-mono">{node.version}</span></div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#888' }}>Status:</span>
              {node.status === 'Connected'
                ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Connected</span>
                : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Disconnected</span>}
            </div>
          </div>

          {/* Roles */}
          <div>
            <div className="font-semibold mb-2" style={{ color: '#333' }}>Node Roles (Personas)</div>
            <div className="space-y-2 pl-1">
              {([['admin', 'Administration'], ['monitoring', 'Monitoring'], ['policyService', 'Policy Service']] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={roles[key]}
                    onCheckedChange={(checked) => setRoles(prev => ({ ...prev, [key]: !!checked }))}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profiling Probes */}
          <div>
            <div className="font-semibold mb-2" style={{ color: '#333' }}>Profiling Configuration — Probes</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-1">
              {Object.entries(probeLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span style={{ color: '#555' }}>{label}</span>
                  <Switch
                    checked={probes[key] ?? false}
                    onCheckedChange={(checked) => setProbes(prev => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeDetailDialog;
