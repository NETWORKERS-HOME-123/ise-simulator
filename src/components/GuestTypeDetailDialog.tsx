import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface GuestTypeDetailDialogProps {
  guestType: string | null;
  details: { accessDuration: string; maxDevices: number; maxLogins: number; sponsorRequired: boolean; emailRequired: boolean; smsRequired: boolean; allowedDays: string[]; passwordPolicy: string; aupRequired: boolean; description: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const GuestTypeDetailDialog = ({ guestType, details, open, onOpenChange }: GuestTypeDetailDialogProps) => {
  if (!guestType || !details) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Guest Type:</span> {guestType}</DialogTitle></DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Access Duration</span><span className="font-mono">{details.accessDuration}</span></div>
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Max Devices</span><span className="font-mono">{details.maxDevices}</span></div>
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Max Logins</span><span className="font-mono">{details.maxLogins === -1 ? 'Unlimited' : details.maxLogins}</span></div>
          <div className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Password Policy</span><span>{details.passwordPolicy}</span></div>
          <div className="border-t border-border pt-2 mt-2" />
          <SwitchRow label="Sponsor Required" checked={details.sponsorRequired} />
          <SwitchRow label="Email Verification" checked={details.emailRequired} />
          <SwitchRow label="SMS Verification" checked={details.smsRequired} />
          <SwitchRow label="Acceptable Use Policy" checked={details.aupRequired} />
          <div className="border-t border-border pt-2 mt-2" />
          <div className="flex items-start"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Allowed Days</span>
            <div className="flex gap-1">{details.allowedDays.map(d => <span key={d} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#049fd920', color: '#049fd9' }}>{d}</span>)}</div>
          </div>
          <div className="flex items-start"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span style={{ color: '#666' }}>{details.description}</span></div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center gap-2"><span className="w-40 font-medium" style={{ color: '#555' }}>{label}</span><Switch defaultChecked={checked} className="scale-75" /><span style={{ color: '#888' }}>{checked ? 'Yes' : 'No'}</span></div>
);

export default GuestTypeDetailDialog;
