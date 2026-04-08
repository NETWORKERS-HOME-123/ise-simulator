import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { networkDeviceDetails } from "@/lib/mockDataExtended";
import { toast } from "sonner";

interface NetworkDeviceDetailDialogProps {
  device: { id: number; name: string; ip: string; type: string; location: string; profile: string; status: string; radiusSharedSecret: string; tacacs: boolean; snmpRO: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DeviceTab = 'general' | 'radius' | 'tacacs' | 'snmp' | 'trustsec';

const NetworkDeviceDetailDialog = ({ device, open, onOpenChange }: NetworkDeviceDetailDialogProps) => {
  const [tab, setTab] = useState<DeviceTab>('general');
  const [snmpVersion, setSnmpVersion] = useState('2c');
  const [singleConnectMode, setSingleConnectMode] = useState<'legacy' | 'draft'>('draft');
  
  if (!device) return null;

  const details = networkDeviceDetails[device.name];
  const tabs: { key: DeviceTab; label: string }[] = [
    { key: 'general', label: 'General Settings' },
    { key: 'radius', label: 'RADIUS Authentication Settings' },
    { key: 'tacacs', label: 'TACACS+ Authentication Settings' },
    { key: 'snmp', label: 'SNMP Settings' },
    { key: 'trustsec', label: 'Advanced TrustSec Settings' },
  ];

  const handleSave = () => {
    toast.success(`Network device "${device.name}" saved successfully`);
    onOpenChange(false);
  };

  const handleDelete = () => {
    toast.error(`Network device "${device.name}" deleted`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Network Devices &gt; </span> {device.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button key={t.key} className="px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ color: tab === t.key ? '#049fd9' : '#666', borderBottomColor: tab === t.key ? '#049fd9' : 'transparent' }}
              onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-3">
          {tab === 'general' && (
            <>
              <SectionTitle>Device Information</SectionTitle>
              <Row label="Name" value={device.name} editable />
              <Row label="Description" value={details?.description || ''} editable />
              <Row label="IP Address / Subnet Mask" value={device.ip} mono editable />
              <Row label="Model Name" value={device.type.split(' ').slice(1).join(' ') || 'N/A'} />
              <Row label="Software Version" value="17.9.4a" />
              
              <SectionTitle>Device Profile</SectionTitle>
              <SelectRow label="Device Profile" value={device.profile} options={['Cisco', 'Aruba', 'HP', 'Juniper', 'Meraki']} />
              
              <SectionTitle>Network Device Group</SectionTitle>
              <Row label="Location" value={details?.ndgLocation || `All Locations#${device.location}`} />
              <Row label="IPSEC" value="No" />
              <Row label="Device Type" value={details?.ndgDeviceType || `All Device Types#${device.type.split(' ')[0]}`} />
              <Row label="Status" value={device.status} />
            </>
          )}

          {tab === 'radius' && (
            <>
              <SectionTitle>RADIUS Authentication Settings</SectionTitle>
              <Row label="Protocol" value="RADIUS" />
              <Row label="Shared Secret" value={device.radiusSharedSecret} mono editable secret />
              <SwitchRow label="Use Second Shared Secret" checked={false} />
              <Row label="CoA Port" value={String(details?.radiusCoAPort || 1700)} mono editable />
              
              <SectionTitle>RADIUS DTLS</SectionTitle>
              <SwitchRow label="DTLS Required" checked={details?.radiusDTLS || false} />
              {details?.radiusDTLS && (
                <>
                  <Row label="DTLS Shared Secret" value="●●●●●●●●" mono />
                  <Row label="DTLS CoA Port" value="2083" mono />
                  <SelectRow label="Issuer CA" value="Corporate Root CA" options={['Corporate Root CA', 'Cisco ISE Self-Signed CA', 'DigiCert Global Root CA']} />
                  <Row label="DNS Name" value={`${device.name.toLowerCase()}.corp.local`} editable />
                </>
              )}
              
              <SectionTitle>KeyWrap Settings</SectionTitle>
              <SwitchRow label="Enable KeyWrap" checked={details?.radiusKeyWrap || false} />
              {details?.radiusKeyWrap && (
                <>
                  <Row label="Key Encryption Key (KEK)" value="●●●●●●●●●●●●●●●●" mono />
                  <Row label="Message Authenticator Code Key (MACK)" value="●●●●●●●●●●●●●●●●●●●●" mono />
                  <SelectRow label="Key Input Format" value="ASCII" options={['ASCII', 'Hexadecimal']} />
                </>
              )}
            </>
          )}

          {tab === 'tacacs' && (
            <>
              <SectionTitle>TACACS+ Authentication Settings</SectionTitle>
              <SwitchRow label="TACACS+ Enabled" checked={device.tacacs} />
              {device.tacacs && (
                <>
                  <Row label="Shared Secret" value={details?.tacacsSharedSecret || '●●●●●●●●'} mono editable secret />
                  <Row label="Retired Shared Secret" value="N/A" />
                  <div className="flex items-center text-xs gap-2 ml-48">
                    <button className="text-[10px] px-2 py-0.5 rounded border border-border hover:bg-accent" style={{ color: '#049fd9' }}>
                      Retire
                    </button>
                    <span style={{ color: '#888' }}>Remaining Retired Period: N/A</span>
                  </div>
                  
                  <SectionTitle>Connection Settings</SectionTitle>
                  <SwitchRow label="Enable Single Connect Mode" checked={details?.tacacsSingleConnect || false} />
                  {(details?.tacacsSingleConnect) && (
                    <div className="flex items-center text-xs gap-2 ml-48">
                      <label className="flex items-center gap-1">
                        <input type="radio" name="singleConnect" value="legacy" checked={singleConnectMode === 'legacy'} onChange={() => setSingleConnectMode('legacy')} className="scale-75" />
                        <span style={{ color: '#555' }}>Legacy Cisco Device</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="singleConnect" value="draft" checked={singleConnectMode === 'draft'} onChange={() => setSingleConnectMode('draft')} className="scale-75" />
                        <span style={{ color: '#555' }}>Draft Compliant (RFC)</span>
                      </label>
                    </div>
                  )}
                  <SwitchRow label="Legacy TACACS+ Encoding" checked={details?.tacacsLegacy || false} />
                </>
              )}
            </>
          )}

          {tab === 'snmp' && (
            <>
              <SectionTitle>SNMP Settings</SectionTitle>
              <SelectRow label="SNMP Version" value={details?.snmpVersion || '2c'} options={['1', '2c', '3']} onChange={(v) => setSnmpVersion(v)} />
              
              {(snmpVersion === '1' || snmpVersion === '2c' || details?.snmpVersion === '2c' || details?.snmpVersion === '1') && (
                <Row label="SNMP RO Community" value={device.snmpRO} mono editable />
              )}
              
              {(snmpVersion === '3' || details?.snmpVersion === '3') && (
                <>
                  <SectionTitle>SNMPv3 Security Parameters</SectionTitle>
                  <Row label="Username" value="ise_snmp_user" editable />
                  <SelectRow label="Security Level" value="authPriv" options={['noAuthNoPriv', 'authNoPriv', 'authPriv']} />
                  <SelectRow label="Auth Protocol" value="SHA" options={['MD5', 'SHA', 'SHA-224', 'SHA-256', 'SHA-384', 'SHA-512']} />
                  <Row label="Auth Password" value="●●●●●●●●" mono editable secret />
                  <SelectRow label="Privacy Protocol" value="AES-128" options={['DES', 'AES-128', 'AES-192', 'AES-256']} />
                  <Row label="Privacy Password" value="●●●●●●●●" mono editable secret />
                </>
              )}
              
              <SectionTitle>SNMP Queries</SectionTitle>
              <Row label="Polling Interval" value={`${details?.snmpPollingInterval || 3600} seconds`} mono editable />
              <SwitchRow label="Link Trap Query" checked={details?.snmpLinkTrap || false} />
              <SwitchRow label="MAC Trap Query" checked={details?.snmpMacTrap || false} />
              <SelectRow label="Originating Policy Service Node" value="Auto" options={['Auto', 'ise-psn01.corp.local', 'ise-psn02.corp.local']} />
            </>
          )}

          {tab === 'trustsec' && details && (
            <>
              <SectionTitle>TrustSec Device Settings</SectionTitle>
              <Row label="Device ID" value={details.trustsecDeviceId || 'Not configured'} mono editable />
              <Row label="Password" value={details.trustsecPassword || 'N/A'} mono editable secret />
              
              <SectionTitle>Device Configuration Deployment</SectionTitle>
              <SwitchRow label="Include this device when deploying Security Group Tag Mapping Updates" checked={details.trustsecEnvDataDownload} />
              
              <SectionTitle>Out-of-Band TrustSec PAC</SectionTitle>
              <SwitchRow label="Enable Out-of-Band TrustSec PAC" checked={details.trustsecPAC} />
              
              <SectionTitle>Peer Authorization Policy</SectionTitle>
              <SelectRow label="Peer Authorization Policy" value={details.trustsecPeerAuth} options={['None', 'Policy', 'Default']} />
              
              <SectionTitle>Notifications and Updates</SectionTitle>
              <SwitchRow label="Send SGT Notifications to this device" checked={details.trustsecSgtNotify} />
              <SwitchRow label="Environment Data Download" checked={details.trustsecEnvDataDownload} />
            </>
          )}
          
          {tab === 'trustsec' && !details && (
            <div className="text-xs text-center py-4" style={{ color: '#888' }}>TrustSec settings not configured for this device.</div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" style={{ color: '#cc0000', borderColor: '#cc0000' }} onClick={handleDelete}>Delete</Button>
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-bold pt-2 pb-1 border-b border-border" style={{ color: '#333' }}>{children}</div>
);

const Row = ({ label, value, mono, editable, secret }: { label: string; value: string; mono?: boolean; editable?: boolean; secret?: boolean }) => (
  <div className="flex items-center text-xs">
    <span className="w-48 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    {editable ? (
      <input 
        type={secret ? 'password' : 'text'}
        defaultValue={value} 
        className="border border-border rounded px-2 py-0.5 text-xs bg-card flex-1 max-w-xs"
        style={{ color: '#333', fontFamily: mono ? 'monospace' : 'inherit' }}
      />
    ) : (
      <span className={mono ? 'font-mono' : ''} style={{ color: '#333' }}>{value}</span>
    )}
  </div>
);

const SwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center text-xs gap-2">
    <span className="w-48 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <Switch defaultChecked={checked} className="scale-75" />
    <span style={{ color: '#888' }}>{checked ? 'Enabled' : 'Disabled'}</span>
  </div>
);

const SelectRow = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange?: (v: string) => void }) => (
  <div className="flex items-center text-xs">
    <span className="w-48 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <select 
      className="border border-border rounded px-2 py-0.5 text-xs bg-card"
      defaultValue={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default NetworkDeviceDetailDialog;
