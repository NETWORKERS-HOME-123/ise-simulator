import { useState, useEffect, useRef } from "react";
import { useSimulation } from "@/context/ISESimulationContext";
import { generateRadiusLogs, generateLiveSessions, reportCategories, generateMacAddress } from "@/lib/mockData";
import { generateTacacsLogs, messageCodes } from "@/lib/mockDataGap";
import { simulateAuthentication } from "@/lib/authSimulator";
import PolicyFlowDiagram from "@/components/PolicyFlowDiagram";
import type { AuthSimResult } from "@/lib/authSimulator";
import { CheckCircle, XCircle, RefreshCw, Pause, Play, Search, Terminal, Wifi, Activity, FileBarChart, ShieldAlert, Filter, Server, BookOpen, BarChart3 } from "lucide-react";
import LogDetailDialog from "@/components/LogDetailDialog";

type Tab = 'live-logs' | 'live-sessions' | 'tacacs-logs' | 'troubleshoot' | 'reports' | 'anc' | 'system360' | 'message-codes';

// Operations page structure mirrors real ISE 3.3:
// RADIUS > Live Logs, RADIUS > Live Sessions
// TACACS > Live Logs
// Reports
// Troubleshoot > Diagnostic Tools > General Tools
// System 360, ANC, Message Codes

const Operations = () => {
  const sim = useSimulation();
  const [tab, setTab] = useState<Tab>('live-logs');
  const [logs, setLogs] = useState(() => generateRadiusLogs(30));
  const [sessions] = useState(() => generateLiveSessions(40));
  const [tacacsLogs] = useState(() => generateTacacsLogs(25));
  const [autoRefresh, setAutoRefresh] = useState(true);
  const counterRef = useRef(31);
  const [traceInput, setTraceInput] = useState('');
  const [traceResults, setTraceResults] = useState<string[]>([]);
  const [tcpDumpRunning, setTcpDumpRunning] = useState(false);
  const [tcpDumpOutput, setTcpDumpOutput] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logDetailOpen, setLogDetailOpen] = useState(false);
  const [ancApplyOpen, setAncApplyOpen] = useState(false);
  const [ancMac, setAncMac] = useState('');
  const [ancPolicy, setAncPolicy] = useState('ANC-Quarantine');
  const [localAnc, setLocalAnc] = useState(sim.ancEndpoints);
  const [debugMac, setDebugMac] = useState('');
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  useEffect(() => {
    if (!autoRefresh || tab !== 'live-logs') return;
    const iv = setInterval(() => {
      const newLogs = generateRadiusLogs(2).map(l => ({ ...l, id: counterRef.current++ }));
      setLogs(prev => [...newLogs, ...prev].slice(0, 100));
    }, 3000);
    return () => clearInterval(iv);
  }, [autoRefresh, tab]);

  const runTrace = () => {
    if (!traceInput.trim()) return;
    setTraceResults([
      `[${new Date().toLocaleTimeString()}] Session Trace for: ${traceInput}`,
      '  → Step 1: RADIUS Access-Request received from NAS 10.1.100.1',
      '  → Step 2: Evaluating Policy Set "Corporate_Wired"',
      '  → Step 3: Authentication Policy matched: "Dot1X"',
      '  → Step 4: Identity Store: Internal Users — User found',
      '  → Step 5: EAP-TLS handshake completed',
      '  → Step 6: Authorization Policy matched: "Employee_Wired"',
      '  → Step 7: Authorization Profile: PermitAccess applied',
      '  → Step 8: RADIUS Access-Accept sent to NAS',
      `  ✓ Authentication PASSED — Session ID: 0A0${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    ]);
  };

  const runDebug = () => {
    if (!debugMac.trim()) return;
    setDebugOutput([
      `[DEBUG] Endpoint Debug Log Collector started for MAC: ${debugMac}`,
      `[DEBUG] Collecting logs from ise-psn01, ise-psn02...`,
      `[DEBUG] Found 3 sessions for ${debugMac} in last 24 hours`,
      `[DEBUG] Session 1: Auth=PASS, Policy=Corporate_Wired, Profile=PermitAccess`,
      `[DEBUG] Session 2: Auth=PASS, Policy=Corporate_Wireless, Profile=BYOD_Access`,
      `[DEBUG] Session 3: Auth=FAIL, Reason=22028 Wrong password, NAS=10.1.100.2`,
      `[DEBUG] Profiler: Endpoint classified as Windows10-Workstation (Certainty: 80)`,
      `[DEBUG] Posture: Last assessment=Compliant (2026-04-08 07:30:00)`,
      `[DEBUG] TrustSec: SGT=Employees (Tag 4)`,
      `[DEBUG] Collection complete. ${Math.floor(Math.random() * 500 + 100)} log entries found.`,
    ]);
  };

  useEffect(() => {
    if (!tcpDumpRunning) return;
    const lines = [
      'tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes',
      '09:15:22.123456 IP 10.1.100.1.49152 > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x4a, length: 244',
      '09:15:22.125789 IP 10.1.1.12.1812 > 10.1.100.1.49152: RADIUS, Access-Challenge (11), id: 0x4a, length: 112',
      '09:15:22.234567 IP 10.1.100.1.49152 > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x4b, length: 456',
      '09:15:22.345678 IP 10.1.1.12.1812 > 10.1.100.1.49152: RADIUS, Access-Accept (2), id: 0x4b, length: 188',
    ];
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < lines.length) { setTcpDumpOutput(prev => [...prev, lines[idx]]); idx++; }
      else {
        const src = `10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        setTcpDumpOutput(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}.${Math.floor(Math.random()*999999)} IP ${src}.${32768+Math.floor(Math.random()*32768)} > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x${Math.floor(Math.random()*256).toString(16)}, length: ${100+Math.floor(Math.random()*400)}`]);
      }
    }, 1500);
    return () => clearInterval(iv);
  }, [tcpDumpRunning]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'live-logs', label: 'RADIUS Live Logs', icon: <Activity size={13} /> },
    { key: 'tacacs-logs', label: 'TACACS+ Live Logs', icon: <Server size={13} /> },
    { key: 'live-sessions', label: 'Live Sessions', icon: <Wifi size={13} /> },
    { key: 'troubleshoot', label: 'Troubleshoot', icon: <Terminal size={13} /> },
    { key: 'reports', label: 'Reports', icon: <FileBarChart size={13} /> },
    { key: 'anc', label: 'ANC', icon: <ShieldAlert size={13} /> },
    { key: 'system360', label: 'System 360', icon: <BarChart3 size={13} /> },
    { key: 'message-codes', label: 'Message Codes', icon: <BookOpen size={13} /> },
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs" style={{ color: '#666' }}>Operations &gt; <span className="font-semibold" style={{ color: '#333' }}>{tabs.find(t => t.key === tab)?.label}</span></div>
      <div className="flex items-center border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap" style={{ color: tab === t.key ? '#049fd9' : '#666', borderBottomColor: tab === t.key ? '#049fd9' : 'transparent' }} onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'live-logs' && (
        <>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border border-border bg-card hover:bg-accent" onClick={() => setAutoRefresh(!autoRefresh)}>
              {autoRefresh ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
            </button>
            <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border border-border bg-card hover:bg-accent" onClick={() => setLogs(generateRadiusLogs(30))}>
              <RefreshCw size={12} /> Refresh
            </button>
            <div className="flex items-center gap-1 ml-auto">
              {autoRefresh && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6cc04a' }} />}
              <span className="text-[11px]" style={{ color: '#888' }}>{autoRefresh ? 'Auto-refresh ON' : 'Paused'} • {logs.length} entries</span>
            </div>
          </div>
          <div className="text-[10px] mb-1" style={{ color: '#888' }}>Click a row to view full authentication details</div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['Time', 'Status', 'Details', 'Username', 'Endpoint ID', 'Identity Group', 'Server', 'NAS IP', 'Protocol'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{logs.map((log, i) => (
                <tr key={`${log.id}-${log.time}`} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60 cursor-pointer" onClick={() => { setSelectedLog(log); setLogDetailOpen(true); }}>
                  <td className="p-2 font-mono whitespace-nowrap" style={{ color: '#888' }}>{new Date(log.time).toLocaleTimeString()}</td>
                  <td className="p-2">{log.status === 'Pass' ? <CheckCircle size={14} style={{ color: '#6cc04a' }} /> : <XCircle size={14} style={{ color: '#cc0000' }} />}</td>
                  <td className="p-2" style={{ color: log.status === 'Fail' ? '#cc0000' : '#333' }}>{log.detail}</td>
                  <td className="p-2 font-mono">{log.username}</td>
                  <td className="p-2 font-mono" style={{ color: '#049fd9', fontSize: '11px' }}>{log.endpointId}</td>
                  <td className="p-2">{log.identityGroup}</td>
                  <td className="p-2">{log.server}</td>
                  <td className="p-2 font-mono">{log.nasIP}</td>
                  <td className="p-2" style={{ color: '#888' }}>{log.authProtocol}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <LogDetailDialog log={selectedLog} open={logDetailOpen} onOpenChange={setLogDetailOpen} />
        </>
      )}

      {tab === 'tacacs-logs' && (
        <>
          <div className="flex items-center gap-2 mb-2"><Server size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>TACACS+ Live Logs</span></div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['Time', 'Status', 'Username', 'Device', 'Device IP', 'Command', 'Privilege', 'Detail'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{tacacsLogs.map((log, i) => (
                <tr key={log.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                  <td className="p-2 font-mono whitespace-nowrap" style={{ color: '#888' }}>{new Date(log.time).toLocaleTimeString()}</td>
                  <td className="p-2">{log.status === 'Pass' ? <CheckCircle size={14} style={{ color: '#6cc04a' }} /> : <XCircle size={14} style={{ color: '#cc0000' }} />}</td>
                  <td className="p-2 font-mono">{log.username}</td>
                  <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{log.device}</td>
                  <td className="p-2 font-mono">{log.deviceIp}</td>
                  <td className="p-2 font-mono text-[11px]" style={{ color: '#666' }}>{log.command}</td>
                  <td className="p-2 font-mono font-bold">{log.privilege}</td>
                  <td className="p-2" style={{ color: log.status === 'Fail' ? '#cc0000' : '#333' }}>{log.detail}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'live-sessions' && (
        <>
          <div className="flex items-center gap-3"><span className="text-[11px]" style={{ color: '#888' }}>{sessions.length} active sessions</span></div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['Session ID', 'Username', 'IP Address', 'MAC Address', 'NAS IP', 'Authorization', 'SGT', 'Posture', 'Protocol', 'Duration', 'Server'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{sessions.map((s, i) => (
                <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                  <td className="p-2 font-mono" style={{ color: '#049fd9', fontSize: '11px' }}>{s.sessionId}</td>
                  <td className="p-2 font-mono">{s.username}</td>
                  <td className="p-2 font-mono">{s.ip}</td>
                  <td className="p-2 font-mono" style={{ fontSize: '11px' }}>{s.mac}</td>
                  <td className="p-2 font-mono">{s.nasIP}</td>
                  <td className="p-2">{s.authzPolicy}</td>
                  <td className="p-2">{s.securityGroup}</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: s.postureStatus === 'Compliant' ? '#6cc04a20' : s.postureStatus === 'Non-Compliant' ? '#cc000020' : '#f0f0f0', color: s.postureStatus === 'Compliant' ? '#3d7a2a' : s.postureStatus === 'Non-Compliant' ? '#cc0000' : '#888' }}>{s.postureStatus}</span></td>
                  <td className="p-2" style={{ color: '#888' }}>{s.protocol}</td>
                  <td className="p-2 font-mono" style={{ color: '#666' }}>{s.duration}</td>
                  <td className="p-2">{s.server}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'troubleshoot' && (
        <div className="space-y-4">
          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>Session Trace</div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Search size={13} style={{ color: '#888' }} />
                <input className="flex-1 border border-border rounded px-2 py-1 text-xs bg-card outline-none" placeholder="Enter username or MAC address..." value={traceInput} onChange={e => setTraceInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && runTrace()} />
                <button className="text-xs px-3 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={runTrace}>Trace</button>
              </div>
              {traceResults.length > 0 && (
                <div className="font-mono text-[11px] p-2 rounded space-y-0.5" style={{ background: '#1a1a1a', color: '#6cc04a' }}>
                  {traceResults.map((line, i) => <div key={i}>{line}</div>)}
                </div>
              )}
            </div>
          </div>

          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>Endpoint Debug Log Collector</div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Search size={13} style={{ color: '#888' }} />
                <input className="flex-1 border border-border rounded px-2 py-1 text-xs bg-card outline-none" placeholder="Enter MAC address (e.g., AA:BB:CC:DD:EE:FF)..." value={debugMac} onChange={e => setDebugMac(e.target.value)} />
                <button className="text-xs px-3 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={runDebug}>Collect</button>
              </div>
              {debugOutput.length > 0 && (
                <div className="font-mono text-[11px] p-2 rounded space-y-0.5" style={{ background: '#1a1a1a', color: '#ccc' }}>
                  {debugOutput.map((line, i) => <div key={i} style={{ color: line.includes('FAIL') ? '#cc0000' : line.includes('PASS') || line.includes('complete') ? '#6cc04a' : '#ccc' }}>{line}</div>)}
                </div>
              )}
            </div>
          </div>

          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>TCP Dump Simulator</div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <button className="text-xs px-3 py-1 rounded text-white flex items-center gap-1" style={{ background: tcpDumpRunning ? '#cc0000' : '#049fd9' }} onClick={() => { setTcpDumpRunning(!tcpDumpRunning); if (!tcpDumpRunning) setTcpDumpOutput([]); }}>
                  {tcpDumpRunning ? <><Pause size={12} /> Stop Capture</> : <><Play size={12} /> Start Capture</>}
                </button>
                <span className="text-[11px]" style={{ color: '#888' }}>Interface: eth0 | Filter: port 1812 or port 1813</span>
              </div>
              <div className="font-mono text-[10px] p-2 rounded overflow-auto" style={{ background: '#1a1a1a', color: '#ccc', maxHeight: '200px' }}>
                {tcpDumpOutput.length === 0 && <span style={{ color: '#666' }}>Capture stopped. Click "Start Capture" to begin.</span>}
                {tcpDumpOutput.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          </div>

          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>RADIUS Authentication Test</div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><label className="block mb-1" style={{ color: '#555' }}>Username</label><input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" defaultValue="jsmith" /></div>
                <div><label className="block mb-1" style={{ color: '#555' }}>Password</label><input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" type="password" defaultValue="••••••" /></div>
                <div><label className="block mb-1" style={{ color: '#555' }}>NAS IP Address</label><input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" defaultValue="10.1.100.1" /></div>
                <div><label className="block mb-1" style={{ color: '#555' }}>Policy Server</label><select className="w-full border border-border rounded px-2 py-1 text-xs bg-card"><option>ise-psn01</option><option>ise-psn02</option></select></div>
              </div>
              <button className="mt-3 text-xs px-4 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>Run Test</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2"><FileBarChart size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>ISE Reports</span></div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['Report Name', 'Description', 'Last Run', 'Records'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{reportCategories.map((r, i) => (
                <tr key={r.name} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60 cursor-pointer">
                  <td className="p-2 font-semibold" style={{ color: '#049fd9' }}>{r.name}</td>
                  <td className="p-2" style={{ color: '#666' }}>{r.description}</td>
                  <td className="p-2 font-mono" style={{ color: '#888' }}>{r.lastRun}</td>
                  <td className="p-2 font-mono font-bold">{r.records.toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'anc' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><ShieldAlert size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Adaptive Network Control</span></div>
            <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setAncApplyOpen(true)}>+ Apply ANC Policy</button>
          </div>
          <div className="text-xs p-3 border border-border rounded bg-card" style={{ color: '#666' }}>ANC allows you to quarantine or shut down endpoints directly from ISE. Applied policies take effect on the next RADIUS CoA (Change of Authorization).</div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['MAC Address', 'IP Address', 'ANC Policy', 'Status', 'Applied By', 'Applied At', 'Reason'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{localAnc.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                  <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{a.mac}</td>
                  <td className="p-2 font-mono">{a.ip}</td>
                  <td className="p-2 font-semibold" style={{ color: a.policy === 'ANC-Shutdown' ? '#cc0000' : '#fbab18' }}>{a.policy}</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: a.status === 'Port Shutdown' ? '#cc000020' : '#fbab1830', color: a.status === 'Port Shutdown' ? '#cc0000' : '#b47a00' }}>{a.status}</span></td>
                  <td className="p-2">{a.appliedBy}</td>
                  <td className="p-2 font-mono" style={{ color: '#888' }}>{a.appliedAt}</td>
                  <td className="p-2" style={{ color: '#666' }}>{a.reason}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {ancApplyOpen && (
            <div className="border border-border rounded bg-card p-4 space-y-3">
              <div className="text-xs font-semibold" style={{ color: '#333' }}>Apply ANC Policy to Endpoint</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><label className="block mb-1" style={{ color: '#555' }}>MAC Address</label><input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" placeholder="AA:BB:CC:DD:EE:FF" value={ancMac} onChange={e => setAncMac(e.target.value)} /></div>
                <div><label className="block mb-1" style={{ color: '#555' }}>ANC Policy</label><select className="w-full border border-border rounded px-2 py-1 text-xs bg-card" value={ancPolicy} onChange={e => setAncPolicy(e.target.value)}><option>ANC-Quarantine</option><option>ANC-Shutdown</option><option>ANC-PortBounce</option></select></div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={() => { if (ancMac) { setLocalAnc(prev => [...prev, { id: prev.length + 1, mac: ancMac, ip: '10.1.50.999', policy: ancPolicy, status: ancPolicy === 'ANC-Shutdown' ? 'Port Shutdown' : 'Quarantined', appliedBy: 'admin', appliedAt: new Date().toLocaleString(), reason: 'Manually applied' }]); setAncMac(''); setAncApplyOpen(false); } }}>Apply</button>
                <button className="text-xs px-3 py-1 rounded border border-border" onClick={() => setAncApplyOpen(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'system360' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2"><BarChart3 size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>System 360 — Node Health</span></div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { node: 'ise-pan01', cpu: 42, mem: 68, disk: 35, status: 'Healthy' },
              { node: 'ise-mnt01', cpu: 28, mem: 55, disk: 42, status: 'Healthy' },
              { node: 'ise-psn01', cpu: 67, mem: 72, disk: 28, status: 'Warning' },
              { node: 'ise-psn02', cpu: 0, mem: 0, disk: 0, status: 'Disconnected' },
            ].map(n => (
              <div key={n.node} className="border border-border rounded bg-card p-3">
                <div className="text-[11px] font-medium" style={{ color: '#333' }}>{n.node}</div>
                <div className="text-[10px] mt-1 mb-2"><span className="px-1.5 py-0.5 rounded font-medium" style={{ background: n.status === 'Healthy' ? '#6cc04a20' : n.status === 'Warning' ? '#fbab1830' : '#cc000020', color: n.status === 'Healthy' ? '#3d7a2a' : n.status === 'Warning' ? '#b47a00' : '#cc0000' }}>{n.status}</span></div>
                {n.status !== 'Disconnected' ? (
                  <div className="space-y-1">
                    <Meter label="CPU" value={n.cpu} />
                    <Meter label="Memory" value={n.mem} />
                    <Meter label="Disk" value={n.disk} />
                  </div>
                ) : (
                  <div className="text-[11px]" style={{ color: '#888' }}>Node unreachable</div>
                )}
              </div>
            ))}
          </div>
          <div className="border border-border rounded bg-card p-4">
            <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Service Status</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['RADIUS', 'TACACS+', 'Profiler', 'Posture', 'pxGrid', 'SXP', 'Guest', 'MDM', 'TC-NAC'].map(svc => (
                <div key={svc} className="flex items-center gap-1.5">
                  <CheckCircle size={12} style={{ color: svc === 'MDM' ? '#888' : '#6cc04a' }} />
                  <span style={{ color: svc === 'MDM' ? '#888' : '#333' }}>{svc}</span>
                  <span className="text-[10px] ml-auto" style={{ color: svc === 'MDM' ? '#888' : '#3d7a2a' }}>{svc === 'MDM' ? 'Not Configured' : 'Running'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'message-codes' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2"><BookOpen size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>ISE Message Codes Catalog</span></div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead><tr style={{ background: '#f0f0f0' }}>{['Code', 'Category', 'Severity', 'Description'].map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
              <tbody>{messageCodes.map((m, i) => (
                <tr key={m.code} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                  <td className="p-2 font-mono font-bold" style={{ color: '#049fd9' }}>{m.code}</td>
                  <td className="p-2">{m.category}</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: m.severity === 'ERROR' ? '#cc000020' : m.severity === 'WARN' ? '#fbab1830' : '#049fd920', color: m.severity === 'ERROR' ? '#cc0000' : m.severity === 'WARN' ? '#b47a00' : '#049fd9' }}>{m.severity}</span></td>
                  <td className="p-2" style={{ color: '#666' }}>{m.description}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Meter = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-1.5 text-[10px]">
    <span className="w-12" style={{ color: '#888' }}>{label}</span>
    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e5e5' }}>
      <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: value > 80 ? '#cc0000' : value > 60 ? '#fbab18' : '#6cc04a' }} />
    </div>
    <span className="font-mono w-8 text-right" style={{ color: value > 80 ? '#cc0000' : '#666' }}>{value}%</span>
  </div>
);

export default Operations;
