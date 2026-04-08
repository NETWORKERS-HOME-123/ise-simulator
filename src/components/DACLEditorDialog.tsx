import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DACLEditorDialogProps {
  dacl: { name: string; description: string; content: string; ipVersion?: string; isDefault?: boolean } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const DACLEditorDialog = ({ dacl, open, onOpenChange }: DACLEditorDialogProps) => {
  const [ipVersion, setIpVersion] = useState<'IPv4' | 'IPv6' | 'Agnostic'>(
    (dacl?.ipVersion as any) || 'IPv4'
  );
  const [syntaxResult, setSyntaxResult] = useState<string | null>(null);
  const [content, setContent] = useState(dacl?.content || '');
  
  if (!dacl) return null;

  const isDefault = dacl.isDefault || [
    'PERMIT_ALL_IPV4_TRAFFIC', 'DENY_ALL_IPV4_TRAFFIC', 
    'PERMIT_ALL_IPV6_TRAFFIC', 'DENY_ALL_IPV6_TRAFFIC'
  ].includes(dacl.name);

  const handleSave = () => {
    if (isDefault) {
      toast.error(`Cannot modify default system DACL "${dacl.name}"`);
      return;
    }
    toast.success(`DACL "${dacl.name}" saved successfully`);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (isDefault) {
      toast.error(`Cannot delete default system DACL "${dacl.name}"`);
      return;
    }
    toast.error(`DACL "${dacl.name}" deleted`);
    onOpenChange(false);
  };

  const handleSyntaxCheck = () => {
    const lines = (content || dacl.content).split('\n').filter(l => l.trim());
    const errors: string[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim().toLowerCase();
      if (!trimmed.startsWith('permit') && !trimmed.startsWith('deny') && !trimmed.startsWith('remark')) {
        errors.push(`Line ${i + 1}: Invalid ACE — must start with permit, deny, or remark`);
      }
      // Validate IP version consistency
      if (ipVersion === 'IPv6' && !trimmed.includes('ipv6') && !trimmed.startsWith('remark') && trimmed.includes(' ip ')) {
        errors.push(`Line ${i + 1}: IPv4 keyword 'ip' used in IPv6 DACL — use 'ipv6' instead`);
      }
    });
    if (errors.length === 0) {
      setSyntaxResult(`✓ DACL syntax is valid. ${lines.length} ACE(s) verified for ${ipVersion}.`);
      toast.success('DACL syntax check passed');
    } else {
      setSyntaxResult(`✗ ${errors.length} error(s) found:\n${errors.join('\n')}`);
      toast.error(`DACL syntax check failed — ${errors.length} error(s)`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Downloadable ACL:</span> {dacl.name}
            {isDefault && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f0f0f0', color: '#888' }}>System Default</span>}
          </DialogTitle>
        </DialogHeader>

        {isDefault && (
          <div className="p-2 rounded text-[11px]" style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
            This is a system default DACL and cannot be modified or deleted.
          </div>
        )}

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Name</span><span>{dacl.name}</span></div>
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span style={{ color: '#666' }}>{dacl.description}</span></div>
          <div className="flex items-center gap-2">
            <span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>IP Version</span>
            <select
              className="border border-border rounded px-2 py-1 text-xs bg-card"
              value={ipVersion}
              onChange={(e) => setIpVersion(e.target.value as any)}
              disabled={isDefault}
            >
              <option value="IPv4">IPv4</option>
              <option value="IPv6">IPv6</option>
              <option value="Agnostic">IP Agnostic</option>
            </select>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-semibold" style={{ color: '#333' }}>DACL Content (ACE Rules)</div>
            <button
              className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent"
              style={{ color: '#049fd9' }}
              onClick={handleSyntaxCheck}
            >
              Check DACL Syntax
            </button>
          </div>
          <textarea 
            className="w-full border border-border rounded p-2 font-mono text-[11px] bg-card" 
            style={{ minHeight: '160px', color: '#333' }} 
            defaultValue={dacl.content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={isDefault}
          />
          <div className="text-[10px] mt-1" style={{ color: '#888' }}>Each line is an Access Control Entry (ACE). Format: permit|deny [protocol] [source] [destination] [eq port]</div>
          {syntaxResult && (
            <div className="mt-2 p-2 rounded text-[11px] font-mono whitespace-pre-wrap" style={{ background: syntaxResult.startsWith('✓') ? '#6cc04a10' : '#cc000010', color: syntaxResult.startsWith('✓') ? '#3d7a2a' : '#cc0000' }}>
              {syntaxResult}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          {!isDefault && <Button variant="outline" size="sm" style={{ color: '#cc0000', borderColor: '#cc0000' }} onClick={handleDelete}>Delete</Button>}
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          {!isDefault && <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DACLEditorDialog;
