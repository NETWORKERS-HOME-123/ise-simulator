import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DACLEditorDialogProps {
  dacl: { name: string; description: string; content: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const DACLEditorDialog = ({ dacl, open, onOpenChange }: DACLEditorDialogProps) => {
  const [ipVersion, setIpVersion] = useState<'IPv4' | 'IPv6' | 'Agnostic'>('IPv4');
  const [syntaxResult, setSyntaxResult] = useState<string | null>(null);
  
  if (!dacl) return null;

  const handleSave = () => {
    toast.success(`DACL "${dacl.name}" saved successfully`);
    onOpenChange(false);
  };

  const handleDelete = () => {
    // Prevent deletion of default DACLs
    const defaultDACLs = ['PERMIT_ALL_IPV4_TRAFFIC', 'DENY_ALL_IPV4_TRAFFIC', 'PERMIT_ALL_IPV6_TRAFFIC', 'DENY_ALL_IPV6_TRAFFIC'];
    if (defaultDACLs.includes(dacl.name)) {
      toast.error(`Cannot delete default DACL "${dacl.name}"`);
      return;
    }
    toast.error(`DACL "${dacl.name}" deleted`);
    onOpenChange(false);
  };

  const handleSyntaxCheck = () => {
    // Simulate syntax validation
    const lines = dacl.content.split('\n').filter(l => l.trim());
    const errors: string[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim().toLowerCase();
      if (!trimmed.startsWith('permit') && !trimmed.startsWith('deny') && !trimmed.startsWith('remark')) {
        errors.push(`Line ${i + 1}: Invalid ACE — must start with permit, deny, or remark`);
      }
    });
    if (errors.length === 0) {
      setSyntaxResult(`✓ DACL syntax is valid. ${lines.length} ACE(s) verified.`);
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
          <DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Downloadable ACL:</span> {dacl.name}</DialogTitle>
        </DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Name</span><span>{dacl.name}</span></div>
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span style={{ color: '#666' }}>{dacl.description}</span></div>
          <div className="flex items-center gap-2">
            <span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>IP Version</span>
            <select
              className="border border-border rounded px-2 py-1 text-xs bg-card"
              value={ipVersion}
              onChange={(e) => setIpVersion(e.target.value as any)}
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
          <textarea className="w-full border border-border rounded p-2 font-mono text-[11px] bg-card" style={{ minHeight: '160px', color: '#333' }} defaultValue={dacl.content} />
          <div className="text-[10px] mt-1" style={{ color: '#888' }}>Each line is an Access Control Entry (ACE). Format: permit|deny [protocol] [source] [destination] [eq port]</div>
          {syntaxResult && (
            <div className="mt-2 p-2 rounded text-[11px] font-mono" style={{ background: syntaxResult.startsWith('✓') ? '#6cc04a10' : '#cc000010', color: syntaxResult.startsWith('✓') ? '#3d7a2a' : '#cc0000' }}>
              {syntaxResult}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" style={{ color: '#cc0000', borderColor: '#cc0000' }} onClick={handleDelete}>Delete</Button>
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DACLEditorDialog;
