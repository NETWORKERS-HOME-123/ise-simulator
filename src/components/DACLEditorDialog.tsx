import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DACLEditorDialogProps {
  dacl: { name: string; description: string; content: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const DACLEditorDialog = ({ dacl, open, onOpenChange }: DACLEditorDialogProps) => {
  if (!dacl) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Downloadable ACL:</span> {dacl.name}</DialogTitle>
        </DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Name</span><span>{dacl.name}</span></div>
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span style={{ color: '#666' }}>{dacl.description}</span></div>
        </div>
        <div className="mt-2">
          <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>ACL Content (ACE Rules)</div>
          <textarea className="w-full border border-border rounded p-2 font-mono text-[11px] bg-card" style={{ minHeight: '160px', color: '#333' }} defaultValue={dacl.content} />
          <div className="text-[10px] mt-1" style={{ color: '#888' }}>Each line is an Access Control Entry (ACE). Format: permit|deny [protocol] [source] [destination] [eq port]</div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DACLEditorDialog;
