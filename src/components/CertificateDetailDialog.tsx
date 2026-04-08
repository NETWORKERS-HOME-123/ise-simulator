import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { certificatePEMData } from "@/lib/mockDataExtended";
import { toast } from "sonner";

interface CertificateDetailDialogProps {
  certificate: { id: number; friendlyName: string; issuedTo: string; issuedBy: string; validFrom: string; validTo: string; usedBy: string; status: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CertificateDetailDialog = ({ certificate, open, onOpenChange }: CertificateDetailDialogProps) => {
  if (!certificate) return null;
  const pem = certificatePEMData[certificate.friendlyName];

  const handleRenew = () => {
    toast.success(`Certificate "${certificate.friendlyName}" renewal initiated`);
    onOpenChange(false);
  };

  const handleDelete = () => {
    toast.error(`Certificate "${certificate.friendlyName}" deleted`);
    onOpenChange(false);
  };

  const handleExport = () => {
    toast.success(`Certificate "${certificate.friendlyName}" exported to file`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Certificate:</span> {certificate.friendlyName}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <Row label="Friendly Name" value={certificate.friendlyName} />
          <Row label="Issued To" value={certificate.issuedTo} mono />
          <Row label="Issued By" value={certificate.issuedBy} />
          <Row label="Valid From" value={certificate.validFrom} mono />
          <Row label="Valid To" value={certificate.validTo} mono />
          <Row label="Used By" value={certificate.usedBy} />
          <Row label="Status" value={certificate.status} />
          {pem && (
            <>
              <div className="border-t border-border my-2 pt-2" />
              <Row label="Serial Number" value={pem.serialNumber} mono />
              <Row label="Signature Algorithm" value={pem.signatureAlgorithm} />
              <Row label="Key Usage" value={pem.keyUsage} />
              <Row label="Extended Key Usage" value={pem.extKeyUsage} />
              <Row label="Subject Alt Name" value={pem.subjectAltName} mono />
            </>
          )}
        </div>

        {pem && (
          <div className="mt-3">
            <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>Certificate (PEM Encoded)</div>
            <pre className="border border-border rounded p-2 text-[10px] font-mono overflow-auto max-h-40" style={{ background: '#f5f5f5', color: '#333' }}>
              {pem.pem}
            </pre>
          </div>
        )}

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleExport}>Export</Button>
          <Button variant="outline" size="sm" style={{ color: '#cc0000', borderColor: '#cc0000' }} onClick={handleDelete}>Delete</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleRenew}>Renew</Button>
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

export default CertificateDetailDialog;
