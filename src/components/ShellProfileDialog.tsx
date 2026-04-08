import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShellProfileDialogProps {
  profileName: string | null;
  details: { privilegeLevel: number; idleTimeout: number; maxSessions: number; attributes: { name: string; requirement: string; value: string }[] } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const ShellProfileDialog = ({ profileName, details, open, onOpenChange }: ShellProfileDialogProps) => {
  if (!profileName || !details) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Shell Profile:</span> {profileName}</DialogTitle></DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Privilege Level</span><span className="font-mono font-bold">{details.privilegeLevel}</span></div>
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Idle Timeout</span><span className="font-mono">{details.idleTimeout} minutes</span></div>
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Max Sessions</span><span className="font-mono">{details.maxSessions}</span></div>
        </div>
        <div className="mt-2">
          <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>Custom Attributes</div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-[11px]">
              <thead><tr style={{ background: '#f0f0f0' }}>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Attribute</th>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Requirement</th>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Value</th>
              </tr></thead>
              <tbody>{details.attributes.map((a, i) => (
                <tr key={a.name} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td className="p-2 font-mono">{a.name}</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: a.requirement === 'Mandatory' ? '#cc000020' : '#049fd920', color: a.requirement === 'Mandatory' ? '#cc0000' : '#049fd9' }}>{a.requirement}</span></td>
                  <td className="p-2 font-mono">{a.value || '—'}</td>
                </tr>
              ))}</tbody>
            </table>
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

export default ShellProfileDialog;
