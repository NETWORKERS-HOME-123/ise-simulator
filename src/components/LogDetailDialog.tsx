import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, FileText, ArrowRight } from "lucide-react";
import { generateMacAddress } from "@/lib/mockData";

interface LogDetailDialogProps {
  log: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogDetailDialog = ({ log, open, onOpenChange }: LogDetailDialogProps) => {
  if (!log) return null;

  const passed = log.status === 'Pass';

  const steps = passed ? [
    { step: 1, event: '11001', desc: 'Received RADIUS Access-Request', detail: `NAS-IP-Address=${log.nasIP}, NAS-Port=${log.nasPort || 'GigabitEthernet1/0/12'}, Service-Type=Framed` },
    { step: 2, event: '11017', desc: 'RADIUS created a new session', detail: `Session-ID=${log.sessionId}` },
    { step: 3, event: '15049', desc: 'Evaluating Policy Group', detail: `Policy Set: ${log.policySet}` },
    { step: 4, event: '15008', desc: 'Evaluating Authentication Policy', detail: `Rule matched: Dot1X, Allowed Protocols: Default Network Access` },
    { step: 5, event: '22037', desc: 'Authentication Passed', detail: `Identity Store: Internal Users, User: ${log.username}` },
    { step: 6, event: '15048', desc: 'Evaluating Authorization Policy', detail: `Rule matched: Employee_Wired` },
    { step: 7, event: '15016', desc: 'Selected Authorization Profile', detail: `Profile: ${log.authzProfile}` },
    { step: 8, event: '11002', desc: 'Returned RADIUS Access-Accept', detail: `Response sent to NAS ${log.nasIP}` },
  ] : [
    { step: 1, event: '11001', desc: 'Received RADIUS Access-Request', detail: `NAS-IP-Address=${log.nasIP}, NAS-Port=${log.nasPort || 'GigabitEthernet1/0/12'}` },
    { step: 2, event: '11017', desc: 'RADIUS created a new session', detail: `Session-ID=${log.sessionId}` },
    { step: 3, event: '15049', desc: 'Evaluating Policy Group', detail: `Policy Set: ${log.policySet}` },
    { step: 4, event: '15008', desc: 'Evaluating Authentication Policy', detail: `Rule matched: Dot1X` },
    { step: 5, event: '22056', desc: 'Authentication Failed', detail: `Failure Reason: ${log.failureReason || 'Unknown'}` },
    { step: 6, event: '11003', desc: 'Returned RADIUS Access-Reject', detail: `Response sent to NAS ${log.nasIP}` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileText size={16} style={{ color: '#049fd9' }} />
            Authentication Detail — {log.sessionId || 'N/A'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Overview */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded border border-border" style={{ background: '#fafafa' }}>
            <div className="flex items-center gap-2 col-span-2 mb-1">
              {passed
                ? <><CheckCircle size={16} style={{ color: '#6cc04a' }} /><span className="font-semibold" style={{ color: '#6cc04a' }}>Authentication Passed</span></>
                : <><XCircle size={16} style={{ color: '#cc0000' }} /><span className="font-semibold" style={{ color: '#cc0000' }}>Authentication Failed</span></>
              }
            </div>
            <div><span style={{ color: '#888' }}>Username:</span> <span className="font-mono font-semibold">{log.username}</span></div>
            <div><span style={{ color: '#888' }}>Endpoint ID:</span> <span className="font-mono" style={{ color: '#049fd9' }}>{log.endpointId}</span></div>
            <div><span style={{ color: '#888' }}>NAS IP:</span> <span className="font-mono">{log.nasIP}</span></div>
            <div><span style={{ color: '#888' }}>NAS Port:</span> <span className="font-mono">{log.nasPort || 'GigabitEthernet1/0/12'}</span></div>
            <div><span style={{ color: '#888' }}>Server:</span> <span className="font-mono">{log.server}</span></div>
            <div><span style={{ color: '#888' }}>Protocol:</span> <span className="font-mono">{log.authProtocol}</span></div>
            <div><span style={{ color: '#888' }}>Identity Group:</span> <span>{log.identityGroup}</span></div>
            <div><span style={{ color: '#888' }}>Time:</span> <span className="font-mono">{new Date(log.time).toLocaleString()}</span></div>
            <div><span style={{ color: '#888' }}>Policy Set:</span> <span className="font-mono">{log.policySet}</span></div>
            <div><span style={{ color: '#888' }}>Authorization Profile:</span> <span className="font-mono">{log.authzProfile}</span></div>
            {!passed && <div className="col-span-2"><span style={{ color: '#888' }}>Failure Reason:</span> <span className="font-mono" style={{ color: '#cc0000' }}>{log.failureReason}</span></div>}
          </div>

          {/* Step-by-step flow */}
          <div>
            <div className="font-semibold mb-2" style={{ color: '#333' }}>Authentication Flow — Steps</div>
            <div className="space-y-1">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded border border-border" style={{ background: i === steps.length - 1 ? (passed ? '#f0fff0' : '#fff0f0') : '#fff' }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: i === steps.length - 1 ? (passed ? '#6cc04a' : '#cc0000') : '#049fd9' }}>
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1 py-0.5 rounded" style={{ background: '#f0f0f0', color: '#666' }}>{s.event}</span>
                      <span className="font-semibold" style={{ color: '#333' }}>{s.desc}</span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px]" style={{ color: '#666' }}>{s.detail}</div>
                  </div>
                  {i < steps.length - 1 && <ArrowRight size={12} style={{ color: '#ccc' }} className="mt-1.5" />}
                </div>
              ))}
            </div>
          </div>

          {/* RADIUS Attributes */}
          <div>
            <div className="font-semibold mb-2" style={{ color: '#333' }}>Other Attributes</div>
            <div className="grid grid-cols-2 gap-1 p-2 rounded font-mono text-[11px]" style={{ background: '#f5f5f5' }}>
              <div><span style={{ color: '#888' }}>Called-Station-ID:</span> {generateMacAddress()}</div>
              <div><span style={{ color: '#888' }}>Calling-Station-ID:</span> {log.endpointId}</div>
              <div><span style={{ color: '#888' }}>Framed-IP-Address:</span> {`10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`}</div>
              <div><span style={{ color: '#888' }}>NAS-Port-Type:</span> Ethernet</div>
              <div><span style={{ color: '#888' }}>cisco-av-pair:</span> audit-session-id={log.sessionId}</div>
              <div><span style={{ color: '#888' }}>Acct-Session-Id:</span> {log.sessionId}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetailDialog;
