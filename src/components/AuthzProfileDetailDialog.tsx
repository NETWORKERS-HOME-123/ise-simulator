import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { authzProfileDetails } from "@/lib/mockDataExtended";
import { toast } from "sonner";

interface AuthzProfileDetailDialogProps {
  profile: { id: number; name: string; type: string; description: string; accessType: string; vlan: string; dacl: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthzProfileDetailDialog = ({ profile, open, onOpenChange }: AuthzProfileDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState<'common' | 'advanced' | 'attributes'>('common');
  if (!profile) return null;

  const details = authzProfileDetails[profile.name];

  const handleSave = () => {
    toast.success(`Authorization profile "${profile.name}" saved successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Authorization Profile:</span> {profile.name}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <Row label="Name" value={profile.name} />
          <Row label="Description" value={profile.description} />
          <Row label="Access Type" value={profile.accessType} mono />
          <Row label="Profile Type" value={profile.type} />
        </div>

        <div className="flex border-b border-border mt-3">
          {(['common', 'advanced', 'attributes'] as const).map(t => (
            <button key={t} className="px-4 py-1.5 text-xs font-medium border-b-2 transition-colors capitalize"
              style={{ color: activeTab === t ? '#049fd9' : '#666', borderBottomColor: activeTab === t ? '#049fd9' : 'transparent' }}
              onClick={() => setActiveTab(t)}>{t === 'common' ? 'Common Tasks' : t === 'advanced' ? 'Advanced' : 'Attributes Details'}</button>
          ))}
        </div>

        {activeTab === 'common' && details && (
          <div className="border border-border rounded p-3 bg-card text-xs space-y-3">
            <ToggleRow label="DACL Name" value={details.dacl || 'None'} enabled={!!details.dacl} />
            <ToggleRow label="VLAN ID/Name" value={details.vlan || 'None'} enabled={!!details.vlan} />
            <ToggleRow label="Voice Domain Permission" value={details.voiceDomainPermission ? 'Enabled' : 'Disabled'} enabled={details.voiceDomainPermission} />
            {details.webRedirection && (
              <div className="border-t border-border pt-2 space-y-2">
                <div className="font-semibold" style={{ color: '#333' }}>Web Redirection</div>
                <Row label="Type" value={details.webRedirection.type} />
                <Row label="ACL" value={details.webRedirection.acl} mono />
                <Row label="Portal" value={details.webRedirection.portal} />
              </div>
            )}
            <div className="border-t border-border pt-2 space-y-2">
              <Row label="Reauthentication Timer" value={details.reauthTimer ? `${details.reauthTimer} seconds` : 'Disabled'} mono />
              <ToggleRow label="Maintain Connectivity" value={details.maintainConnectivity ? 'During Reauth' : 'No'} enabled={details.maintainConnectivity} />
            </div>
            {details.autoSmartPort && <Row label="Auto SmartPort" value={details.autoSmartPort} />}
            {details.asaVpn && <Row label="ASA VPN" value={details.asaVpn} />}
            {details.airespacACL && <Row label="Airespace ACL" value={details.airespacACL} />}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
            <Row label="Interface Template" value={details?.interfaceTemplate || 'None'} />
            <Row label="AVC Profile" value={details?.avcProfile || 'None'} />
            <Row label="Auto SmartPort" value={details?.autoSmartPort || 'None'} />
            <Row label="ASA VPN Group Policy" value={details?.asaVpn || 'None'} />
            <Row label="Airespace ACL" value={details?.airespacACL || 'None'} />
          </div>
        )}

        {activeTab === 'attributes' && details && (
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-[11px]">
              <thead><tr style={{ background: '#f0f0f0' }}>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Attribute</th>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Type</th>
                <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Value</th>
              </tr></thead>
              <tbody>
                {details.radiusAVPs.map((avp, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{avp.attribute}</td>
                    <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#049fd920', color: '#049fd9' }}>{avp.type}</span></td>
                    <td className="p-2 font-mono" style={{ color: '#333' }}>{avp.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!details && (
          <div className="text-xs text-center py-4" style={{ color: '#888' }}>No extended details available for this profile.</div>
        )}

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center text-xs">
    <span className="w-44 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span>
  </div>
);

const ToggleRow = ({ label, value, enabled }: { label: string; value: string; enabled: boolean }) => (
  <div className="flex items-center text-xs gap-2">
    <Switch defaultChecked={enabled} className="scale-75" />
    <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <span className="font-mono" style={{ color: '#333' }}>{value}</span>
  </div>
);

export default AuthzProfileDetailDialog;
