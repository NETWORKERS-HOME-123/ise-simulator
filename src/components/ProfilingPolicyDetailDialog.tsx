import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { profilingPolicyDetails } from "@/lib/mockDataExtended";

interface ProfilingPolicyDetailDialogProps {
  policy: { id: number; name: string; certainty: number; matchedEndpoints: number; conditions: string; parentPolicy: string; status: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfilingPolicyDetailDialog = ({ policy, open, onOpenChange }: ProfilingPolicyDetailDialogProps) => {
  if (!policy) return null;
  const details = profilingPolicyDetails[policy.name];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Profiling Policy:</span> {policy.name}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <Row label="Name" value={policy.name} />
          <Row label="Min Certainty Factor" value={String(policy.certainty)} mono />
          <Row label="Parent Policy" value={policy.parentPolicy || 'None'} />
          <Row label="Matched Endpoints" value={policy.matchedEndpoints.toLocaleString()} mono />
          <Row label="Status" value={policy.status} />
          {details && (
            <>
              <Row label="Description" value={details.description} />
              <Row label="CoA Type" value={details.coaType} />
              <Row label="Exception Action" value={details.exceptionAction || 'None'} />
            </>
          )}
        </div>

        {details && (
          <div className="mt-3">
            <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Conditions (with Certainty Factor)</div>
            <div className="border border-border rounded overflow-auto bg-card">
              <table className="w-full text-[11px]">
                <thead><tr style={{ background: '#f0f0f0' }}>
                  <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Attribute</th>
                  <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Operator</th>
                  <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Value</th>
                  <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Certainty</th>
                </tr></thead>
                <tbody>
                  {details.conditions.map((c, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{c.attribute}</td>
                      <td className="p-2">{c.operator}</td>
                      <td className="p-2 font-mono">{c.value}</td>
                      <td className="p-2 font-mono font-bold" style={{ color: '#049fd9' }}>+{c.certainty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-[10px] text-right" style={{ color: '#888' }}>
              Total possible certainty: {details.conditions.reduce((s, c) => s + c.certainty, 0)} | Minimum required: {details.minCertainty}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center text-xs">
    <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span>
  </div>
);

export default ProfilingPolicyDetailDialog;
