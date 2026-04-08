import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AllowedProtocolsDialogProps {
  service: { name: string; description: string; protocols: Record<string, boolean> } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AllowedProtocolsDialog = ({ service, open, onOpenChange }: AllowedProtocolsDialogProps) => {
  if (!service) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Allowed Protocols:</span> {service.name}</DialogTitle>
        </DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Name</span><span>{service.name}</span></div>
          <div className="flex items-center"><span className="w-32 font-medium shrink-0" style={{ color: '#555' }}>Description</span><span style={{ color: '#666' }}>{service.description}</span></div>
        </div>
        <div className="mt-2">
          <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Protocol Toggles</div>
          <div className="border border-border rounded bg-card p-3 space-y-2">
            {Object.entries(service.protocols).map(([proto, enabled]) => (
              <div key={proto} className="flex items-center gap-2 text-xs">
                <Switch defaultChecked={enabled} className="scale-75" />
                <span style={{ color: '#333' }}>{proto}</span>
              </div>
            ))}
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

export default AllowedProtocolsDialog;
