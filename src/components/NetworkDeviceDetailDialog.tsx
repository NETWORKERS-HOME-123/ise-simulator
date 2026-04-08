import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { networkDeviceDetails } from "@/lib/mockDataExtended";

interface NetworkDeviceDetailDialogProps {
  device: { id: number; name: string; ip: string; type: string; location: string; profile: string; status: string; radiusSharedSecret: string; tacacs: boolean; snmpRO: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DeviceTab = 'general' | 'radius' | 'tacacs' | 'snmp' | 'trustsec';

const NetworkDeviceDetailDialog = ({ device, open, onOpenChange }: NetworkDeviceDetailDialogProps) => {
  const [tab, setTab] = useState<DeviceTab>('general');
  if (!device) return null;

  const details = networkDeviceDetails[device.name];
  const tabs: { key: DeviceTab; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'radius', label: 'RADIUS' },
    { key: 'tacacs', label: 'TACACS+' },
    { key: 'snmp', label: 'SNMP' },
    { key: 'trustsec', label: 'TrustSec' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Network Device:</span> {device.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button key={t.key} className="px-4 py-1.5 text-xs font-medium border-b-2 transition-colors"
              style={{ color: tab === t.key ? '#049fd9' : '#666', borderBottomColor: tab === t.key ? '#049fd9' : 'transparent' }}
              onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          {tab === 'general' && (
            <>
              <Row label="Device Name" value={device.name} />
              <Row label="Description" value={details?.description || ''} />
              <Row label="IP Address" value={device.ip} mono />
              <Row label="Device Profile" value={device.profile} />
              <Row label="Device Type" value={details?.ndgDeviceType || device.type} />
              <Row label="Location" value={details?.ndgLocation || device.location} />
              <Row label="Status" value={device.status} />
            </>
          )}

          {tab === 'radius' && (
            <>
              <Row label="Shared Secret" value={device.radiusSharedSecret} mono />
              <Row label="CoA Port" value={String(details?.radiusCoAPort || 1700)} mono />
              <SwitchRow label="DTLS Required" checked={details?.radiusDTLS || false} />
              <SwitchRow label="KeyWrap" checked={details?.radiusKeyWrap || false} />
            </>
          )}

          {tab === 'tacacs' && (
            <>
              <SwitchRow label="TACACS+ Enabled" checked={device.tacacs} />
              {device.tacacs && (
                <>
                  <Row label="Shared Secret" value={details?.tacacsSharedSecret || '●●●●●●●●'} mono />
                  <SwitchRow label="Single Connect Mode" checked={details?.tacacsSingleConnect || false} />
                  <SwitchRow label="Legacy TACACS" checked={details?.tacacsLegacy || false} />
                </>
              )}
            </>
          )}

          {tab === 'snmp' && (
            <>
              <Row label="SNMP Version" value={details?.snmpVersion || '2c'} />
              <Row label="RO Community" value={device.snmpRO} mono />
              <Row label="Polling Interval" value={`${details?.snmpPollingInterval || 3600}s`} mono />
              <SwitchRow label="Link Trap Query" checked={details?.snmpLinkTrap || false} />
              <SwitchRow label="MAC Trap Query" checked={details?.snmpMacTrap || false} />
            </>
          )}

          {tab === 'trustsec' && details && (
            <>
              <Row label="Device ID" value={details.trustsecDeviceId || 'Not configured'} mono />
              <Row label="Password" value={details.trustsecPassword || 'N/A'} mono />
              <SwitchRow label="Environment Data Download" checked={details.trustsecEnvDataDownload} />
              <Row label="Peer Authorization Policy" value={details.trustsecPeerAuth} />
              <SwitchRow label="SGT Notifications" checked={details.trustsecSgtNotify} />
              <SwitchRow label="Out-of-Band TrustSec PAC" checked={details.trustsecPAC} />
            </>
          )}
        </div>

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
    <span className="w-48 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span>
  </div>
);

const SwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center text-xs gap-2">
    <span className="w-48 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <Switch defaultChecked={checked} className="scale-75" />
    <span style={{ color: '#888' }}>{checked ? 'Enabled' : 'Disabled'}</span>
  </div>
);

export default NetworkDeviceDetailDialog;
