import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SXPDeviceDialogProps {
  device: { name: string; ip: string; mode: string; status: string; peerIp: string; version: string; holdTime: number; domain: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const SXPDeviceDialog = ({ device, open, onOpenChange }: SXPDeviceDialogProps) => {
  if (!device) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>SXP Device:</span> {device.name}</DialogTitle></DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          {[
            ['Device Name', device.name],
            ['IP Address', device.ip],
            ['SXP Mode', device.mode],
            ['Peer IP (ISE)', device.peerIp],
            ['SXP Version', device.version],
            ['Hold Time', `${device.holdTime} seconds`],
            ['SXP Domain', device.domain],
            ['Connection Status', device.status],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center"><span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{l}</span><span className="font-mono" style={{ color: '#333' }}>{v}</span></div>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SXPDeviceDialog;
