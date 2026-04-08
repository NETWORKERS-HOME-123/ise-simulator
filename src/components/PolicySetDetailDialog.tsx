import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { authenticationPolicies, authorizationPolicies } from "@/lib/mockData";
import { CheckCircle, XCircle, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";

interface PolicySetDetailDialogProps {
  policySet: { id: number; name: string; status: string; conditions: string; authPolicy: string; authzPolicy: string; hits: number } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PolicySetDetailDialog = ({ policySet, open, onOpenChange }: PolicySetDetailDialogProps) => {
  const [authnRules, setAuthnRules] = useState(authenticationPolicies.map((p, i) => ({ ...p, order: i })));
  const [authzRules, setAuthzRules] = useState(authorizationPolicies.map((p, i) => ({ ...p, order: i })));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragTable, setDragTable] = useState<'authn' | 'authz' | null>(null);

  const handleDragStart = useCallback((table: 'authn' | 'authz', index: number) => {
    setDragIndex(index);
    setDragTable(table);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((table: 'authn' | 'authz', dropIndex: number) => {
    if (dragIndex === null || dragTable !== table) return;
    const setter = table === 'authn' ? setAuthnRules : setAuthzRules;
    setter(prev => {
      const items = [...prev];
      const [moved] = items.splice(dragIndex, 1);
      items.splice(dropIndex, 0, moved);
      return items.map((item, i) => ({ ...item, order: i }));
    });
    toast.success(`Rule moved to position ${dropIndex + 1}`);
    setDragIndex(null);
    setDragTable(null);
  }, [dragIndex, dragTable]);

  if (!policySet) return null;

  const handleSave = () => {
    toast.success(`Policy set "${policySet.name}" saved successfully`);
    onOpenChange(false);
  };

  const handleAddAuthnRule = () => {
    toast.info("New authentication rule added");
  };

  const handleAddAuthzRule = () => {
    toast.info("New authorization rule added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <span style={{ color: '#049fd9' }}>Policy Set:</span> {policySet.name}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded p-3 bg-card space-y-2 text-xs">
          <div className="flex items-center gap-4">
            <FormRow label="Name" value={policySet.name} />
            <FormRow label="Status">
              <Switch defaultChecked={policySet.status === 'Enabled'} />
              <span className="ml-1">{policySet.status}</span>
            </FormRow>
          </div>
          <FormRow label="Conditions" value={policySet.conditions} mono />
          <FormRow label="Description" value={`Policy set for ${policySet.conditions} authentication`} />
          <FormRow label="Total Hits" value={policySet.hits.toLocaleString()} mono />
        </div>

        {/* Authentication Policy */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#333' }}>Authentication Policy</span>
            <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={handleAddAuthnRule}>
              <Plus size={10} /> Add Rule
            </button>
          </div>
          <DraggableTable
            headers={['', '#', 'Rule Name', 'Status', 'Conditions', 'Allowed Protocols', 'Identity Store']}
            rows={authnRules}
            renderRow={(p, i) => [
              <GripVertical size={10} style={{ color: '#ccc' }} className="cursor-grab" />,
              <span className="font-mono" style={{ color: '#999' }}>{i + 1}</span>,
              <span className="font-semibold" style={{ color: '#049fd9' }}>{p.rule}</span>,
              <StatusDot ok={p.status === 'Enabled'} />,
              <span className="font-mono text-[10px]" style={{ color: '#666' }}>{p.conditions}</span>,
              <span className="text-[10px]">{p.allowedProtocols}</span>,
              <span className="text-[10px]">{p.identityStore}</span>,
            ]}
            onDragStart={(i) => handleDragStart('authn', i)}
            onDragOver={handleDragOver}
            onDrop={(i) => handleDrop('authn', i)}
            dragIndex={dragTable === 'authn' ? dragIndex : null}
          />
        </div>

        {/* Authorization Policy */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#333' }}>Authorization Policy</span>
            <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={handleAddAuthzRule}>
              <Plus size={10} /> Add Rule
            </button>
          </div>
          <DraggableTable
            headers={['', '#', 'Rule Name', 'Status', 'Conditions', 'Authz Profile', 'Security Group']}
            rows={authzRules}
            renderRow={(p, i) => [
              <GripVertical size={10} style={{ color: '#ccc' }} className="cursor-grab" />,
              <span className="font-mono" style={{ color: '#999' }}>{i + 1}</span>,
              <span className="font-semibold" style={{ color: '#049fd9' }}>{p.rule}</span>,
              <StatusDot ok={p.status === 'Enabled'} />,
              <span className="font-mono text-[10px]" style={{ color: '#666' }}>{p.conditions}</span>,
              <span className="text-[10px]">{p.profile}</span>,
              <span className="text-[10px]">{p.securityGroup}</span>,
            ]}
            onDragStart={(i) => handleDragStart('authz', i)}
            onDragOver={handleDragOver}
            onDrop={(i) => handleDrop('authz', i)}
            dragIndex={dragTable === 'authz' ? dragIndex : null}
          />
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormRow = ({ label, value, mono, children }: { label: string; value?: string; mono?: boolean; children?: React.ReactNode }) => (
  <div className="flex items-center text-xs">
    <span className="w-28 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    {children || <span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span>}
  </div>
);

const StatusDot = ({ ok }: { ok: boolean }) =>
  ok ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#999' }} />;

interface DraggableTableProps<T> {
  headers: string[];
  rows: T[];
  renderRow: (row: T, index: number) => React.ReactNode[];
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  dragIndex: number | null;
}

function DraggableTable<T>({ headers, rows, renderRow, onDragStart, onDragOver, onDrop, dragIndex }: DraggableTableProps<T>) {
  return (
    <div className="border border-border rounded overflow-auto bg-card">
      <table className="w-full text-[11px]">
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {headers.map((h, i) => <th key={i} className="text-left p-1.5 font-semibold" style={{ color: '#555' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(i)}
              style={{
                background: dragIndex === i ? '#e0f2fe' : i % 2 === 0 ? '#fff' : '#fafafa',
                opacity: dragIndex === i ? 0.6 : 1,
              }}
              className="hover:bg-accent/60 transition-colors"
            >
              {renderRow(row, i).map((cell, j) => <td key={j} className="p-1.5">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PolicySetDetailDialog;
