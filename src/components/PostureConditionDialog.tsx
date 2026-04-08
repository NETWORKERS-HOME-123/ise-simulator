import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PostureConditionDialogProps {
  condition: { name: string; type: string; os: string; attribute: string; operator: string; value: string; description: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const PostureConditionDialog = ({ condition, open, onOpenChange }: PostureConditionDialogProps) => {
  if (!condition) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm"><span style={{ color: '#049fd9' }}>Posture Condition:</span> {condition.name}</DialogTitle>
        </DialogHeader>
        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          {[
            ['Name', condition.name],
            ['Type', condition.type],
            ['Operating System', condition.os],
            ['Attribute', condition.attribute],
            ['Operator', condition.operator],
            ['Value', condition.value || '(any)'],
            ['Description', condition.description],
          ].map(([l, v]) => (
            <div key={l} className="flex items-start"><span className="w-36 font-medium shrink-0" style={{ color: '#555' }}>{l}</span><span style={{ color: '#333' }}>{v}</span></div>
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

export default PostureConditionDialog;
