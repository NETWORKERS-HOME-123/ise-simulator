import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface CommandSetDialogProps {
  commandSetName: string | null;
  details: { rules: { grant: 'Permit' | 'Deny'; command: string; arguments: string }[] } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const CommandSetDialog = ({ commandSetName, details, open, onOpenChange }: CommandSetDialogProps) => {
  if (!commandSetName || !details) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Command Set:</span> {commandSetName}</DialogTitle></DialogHeader>
        <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>Command Rules</div>
        <div className="border border-border rounded overflow-auto bg-card">
          <table className="w-full text-[11px]">
            <thead><tr style={{ background: '#f0f0f0' }}>
              <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>#</th>
              <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Grant</th>
              <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Command</th>
              <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Arguments</th>
            </tr></thead>
            <tbody>{details.rules.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td className="p-2 font-mono" style={{ color: '#999' }}>{i + 1}</td>
                <td className="p-2"><span className="flex items-center gap-1">{r.grant === 'Permit' ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#cc0000' }} />}<span style={{ color: r.grant === 'Permit' ? '#3d7a2a' : '#cc0000' }}>{r.grant}</span></span></td>
                <td className="p-2 font-mono">{r.command}</td>
                <td className="p-2 font-mono" style={{ color: '#666' }}>{r.arguments || '(any)'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="text-[10px] mt-1" style={{ color: '#888' }}>Rules are evaluated top-down. First match wins.</div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommandSetDialog;
