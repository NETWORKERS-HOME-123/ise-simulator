import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Monitor, Wifi, Clock, MapPin, Shield, Fingerprint } from "lucide-react";

interface EndpointDetailDialogProps {
  endpoint: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EndpointDetailDialog = ({ endpoint, open, onOpenChange }: EndpointDetailDialogProps) => {
  const [tab, setTab] = useState<'general' | 'auth' | 'profiling'>('general');
  if (!endpoint) return null;

  const connected = endpoint.status === 'Connected';

  // Mock auth history
  const authHistory = Array.from({ length: 5 }, (_, i) => ({
    time: new Date(Date.now() - i * 3600000 - Math.random() * 1800000).toLocaleString(),
    status: Math.random() > 0.15 ? 'Pass' : 'Fail',
    server: ['ise-psn01', 'ise-psn02'][Math.floor(Math.random() * 2)],
    policy: ['PermitAccess', 'BYOD_Access', 'Guest_Access'][Math.floor(Math.random() * 3)],
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Monitor size={16} style={{ color: '#049fd9' }} />
            Endpoint Detail — {endpoint.mac}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex items-center border-b border-border mb-3">
          {([['general', 'General'], ['auth', 'Authentication History'], ['profiling', 'Profiling']] as const).map(([key, label]) => (
            <button key={key} className="px-4 py-2 text-xs font-medium border-b-2 transition-colors" style={{ color: tab === key ? '#049fd9' : '#666', borderBottomColor: tab === key ? '#049fd9' : 'transparent' }} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {tab === 'general' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 mb-2">
              {connected
                ? <><CheckCircle size={16} style={{ color: '#6cc04a' }} /><span className="font-semibold" style={{ color: '#6cc04a' }}>Connected</span></>
                : <><XCircle size={16} style={{ color: '#cc0000' }} /><span className="font-semibold" style={{ color: '#cc0000' }}>Disconnected</span></>
              }
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 rounded border border-border" style={{ background: '#fafafa' }}>
              <div><span style={{ color: '#888' }}>MAC Address:</span> <span className="font-mono font-semibold" style={{ color: '#049fd9' }}>{endpoint.mac}</span></div>
              <div><span style={{ color: '#888' }}>IP Address:</span> <span className="font-mono">{endpoint.ip}</span></div>
              <div><span style={{ color: '#888' }}>Identity Group:</span> <span className="font-semibold">{endpoint.identityGroup}</span></div>
              <div><span style={{ color: '#888' }}>Endpoint Profile:</span> <span>{endpoint.profile}</span></div>
              <div><span style={{ color: '#888' }}>Static Assignment:</span> <span>{endpoint.staticAssignment ? 'Yes' : 'No'}</span></div>
              <div><span style={{ color: '#888' }}>Auth Method:</span> <span className="font-mono">{endpoint.authMethod}</span></div>
              <div><span style={{ color: '#888' }}>Location:</span> <span>{endpoint.location}</span></div>
              <div><span style={{ color: '#888' }}>NAS Port:</span> <span className="font-mono">{endpoint.nasPort}</span></div>
              <div><span style={{ color: '#888' }}>OS:</span> <span>{endpoint.os}</span></div>
              <div><span style={{ color: '#888' }}>Manufacturer:</span> <span>{endpoint.manufacturer}</span></div>
              <div><span style={{ color: '#888' }}>First Seen:</span> <span className="font-mono">{new Date(endpoint.firstSeen).toLocaleDateString()}</span></div>
              <div><span style={{ color: '#888' }}>Last Seen:</span> <span className="font-mono">{new Date(endpoint.lastSeen).toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {tab === 'auth' && (
          <div className="space-y-2 text-xs">
            <div className="font-semibold" style={{ color: '#333' }}>Recent Authentication History</div>
            <div className="border border-border rounded overflow-auto bg-card">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    {['Time', 'Status', 'Server', 'Authorization Profile'].map(h => (
                      <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {authHistory.map((a, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="p-2 font-mono" style={{ color: '#888' }}>{a.time}</td>
                      <td className="p-2">
                        {a.status === 'Pass'
                          ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Pass</span>
                          : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Fail</span>}
                      </td>
                      <td className="p-2">{a.server}</td>
                      <td className="p-2 font-mono">{a.policy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'profiling' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded border border-border" style={{ background: '#fafafa' }}>
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint size={16} style={{ color: '#049fd9' }} />
                <span className="font-semibold" style={{ color: '#333' }}>Profiling Information</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span style={{ color: '#888' }}>Matched Policy:</span> <span className="font-semibold" style={{ color: '#049fd9' }}>{endpoint.profile}</span></div>
                <div><span style={{ color: '#888' }}>Certainty Factor:</span> <span className="font-mono font-bold">{Math.floor(Math.random() * 50 + 20)}</span></div>
                <div><span style={{ color: '#888' }}>OUI:</span> <span className="font-mono">{endpoint.mac.substring(0, 8)}</span></div>
                <div><span style={{ color: '#888' }}>Manufacturer:</span> <span>{endpoint.manufacturer}</span></div>
                <div><span style={{ color: '#888' }}>Operating System:</span> <span>{endpoint.os}</span></div>
                <div><span style={{ color: '#888' }}>DHCP Class ID:</span> <span className="font-mono">MSFT 5.0</span></div>
              </div>
            </div>
            <div className="p-3 rounded border border-border" style={{ background: '#fafafa' }}>
              <div className="font-semibold mb-2" style={{ color: '#333' }}>Profiling Probes Matched</div>
              <div className="flex flex-wrap gap-2">
                {['DHCP', 'HTTP', 'RADIUS', 'DNS'].map(probe => (
                  <span key={probe} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{probe}</span>
                ))}
                {['NMAP', 'SNMP', 'NetFlow'].map(probe => (
                  <span key={probe} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: '#f0f0f0', color: '#999' }}>{probe}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EndpointDetailDialog;
