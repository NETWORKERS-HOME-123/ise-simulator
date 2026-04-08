import { useState, useEffect, useRef } from "react";
import { generateRadiusLogs, generateLiveSessions } from "@/lib/mockData";
import { CheckCircle, XCircle, RefreshCw, Pause, Play, Search, Terminal, Wifi, Activity } from "lucide-react";

type Tab = 'live-logs' | 'live-sessions' | 'troubleshoot';

const Operations = () => {
  const [tab, setTab] = useState<Tab>('live-logs');
  const [logs, setLogs] = useState(() => generateRadiusLogs(30));
  const [sessions] = useState(() => generateLiveSessions(40));
  const [autoRefresh, setAutoRefresh] = useState(true);
  const counterRef = useRef(31);
  const [traceInput, setTraceInput] = useState('');
  const [traceResults, setTraceResults] = useState<string[]>([]);
  const [tcpDumpRunning, setTcpDumpRunning] = useState(false);
  const [tcpDumpOutput, setTcpDumpOutput] = useState<string[]>([]);

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

  useEffect(() => {
    if (!tcpDumpRunning) return;
    const lines = [
      'tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes',
      '09:15:22.123456 IP 10.1.100.1.49152 > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x4a, length: 244',
      '09:15:22.125789 IP 10.1.1.12.1812 > 10.1.100.1.49152: RADIUS, Access-Challenge (11), id: 0x4a, length: 112',
      '09:15:22.234567 IP 10.1.100.1.49152 > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x4b, length: 456',
      '09:15:22.345678 IP 10.1.1.12.1812 > 10.1.100.1.49152: RADIUS, Access-Accept (2), id: 0x4b, length: 188',
      '09:15:23.456789 IP 10.2.200.1.32768 > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x1f, length: 198',
      '09:15:23.458901 IP 10.1.1.12.1812 > 10.2.200.1.32768: RADIUS, Access-Reject (3), id: 0x1f, length: 44',
    ];
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < lines.length) {
        setTcpDumpOutput(prev => [...prev, lines[idx]]);
        idx++;
      } else {
        const src = `10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        setTcpDumpOutput(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}.${Math.floor(Math.random()*999999)} IP ${src}.${32768+Math.floor(Math.random()*32768)} > 10.1.1.12.1812: RADIUS, Access-Request (1), id: 0x${Math.floor(Math.random()*256).toString(16)}, length: ${100+Math.floor(Math.random()*400)}`]);
      }
    }, 1500);
    return () => clearInterval(iv);
  }, [tcpDumpRunning]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'live-logs', label: 'Live Logs', icon: <Activity size={13} /> },
    { key: 'live-sessions', label: 'Live Sessions', icon: <Wifi size={13} /> },
    { key: 'troubleshoot', label: 'Troubleshoot', icon: <Terminal size={13} /> },
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs" style={{ color: '#666' }}>Operations &gt; RADIUS &gt; <span className="font-semibold" style={{ color: '#333' }}>{tabs.find(t => t.key === tab)?.label}</span></div>

      {/* Sub tabs */}
      <div className="flex items-center border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2"
            style={{
              color: tab === t.key ? '#049fd9' : '#666',
              borderBottomColor: tab === t.key ? '#049fd9' : 'transparent',
            }}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Live Logs */}
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
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  {['Time', 'Status', 'Details', 'Username', 'Endpoint ID', 'Identity Group', 'Server', 'NAS IP', 'Protocol'].map(h => (
                    <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={`${log.id}-${log.time}`} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Live Sessions */}
      {tab === 'live-sessions' && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-[11px]" style={{ color: '#888' }}>{sessions.length} active sessions</span>
          </div>
          <div className="border border-border rounded overflow-auto bg-card">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  {['Session ID', 'Username', 'IP Address', 'MAC Address', 'NAS IP', 'Authorization', 'Protocol', 'Duration', 'Server'].map(h => (
                    <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                    <td className="p-2 font-mono" style={{ color: '#049fd9', fontSize: '11px' }}>{s.sessionId}</td>
                    <td className="p-2 font-mono">{s.username}</td>
                    <td className="p-2 font-mono">{s.ip}</td>
                    <td className="p-2 font-mono" style={{ fontSize: '11px' }}>{s.mac}</td>
                    <td className="p-2 font-mono">{s.nasIP}</td>
                    <td className="p-2">{s.authzPolicy}</td>
                    <td className="p-2" style={{ color: '#888' }}>{s.protocol}</td>
                    <td className="p-2 font-mono" style={{ color: '#666' }}>{s.duration}</td>
                    <td className="p-2">{s.server}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Troubleshoot */}
      {tab === 'troubleshoot' && (
        <div className="space-y-4">
          {/* Session Trace */}
          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>Session Trace</div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Search size={13} style={{ color: '#888' }} />
                <input
                  className="flex-1 border border-border rounded px-2 py-1 text-xs bg-card outline-none"
                  placeholder="Enter username or MAC address..."
                  value={traceInput}
                  onChange={e => setTraceInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runTrace()}
                />
                <button className="text-xs px-3 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={runTrace}>Trace</button>
              </div>
              {traceResults.length > 0 && (
                <div className="font-mono text-[11px] p-2 rounded space-y-0.5" style={{ background: '#1a1a1a', color: '#6cc04a' }}>
                  {traceResults.map((line, i) => <div key={i}>{line}</div>)}
                </div>
              )}
            </div>
          </div>

          {/* TCP Dump */}
          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>TCP Dump Simulator</div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-3 py-1 rounded text-white flex items-center gap-1"
                  style={{ background: tcpDumpRunning ? '#cc0000' : '#049fd9' }}
                  onClick={() => { setTcpDumpRunning(!tcpDumpRunning); if (!tcpDumpRunning) setTcpDumpOutput([]); }}
                >
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

          {/* RADIUS Test */}
          <div className="border border-border rounded bg-card">
            <div className="px-3 py-2 font-semibold text-xs" style={{ background: '#f0f0f0', color: '#333', borderBottom: '1px solid #ddd' }}>RADIUS Authentication Test</div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block mb-1" style={{ color: '#555' }}>Username</label>
                  <input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" defaultValue="jsmith" />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: '#555' }}>Password</label>
                  <input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" type="password" defaultValue="••••••" />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: '#555' }}>NAS IP Address</label>
                  <input className="w-full border border-border rounded px-2 py-1 text-xs bg-card" defaultValue="10.1.100.1" />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: '#555' }}>Policy Server</label>
                  <select className="w-full border border-border rounded px-2 py-1 text-xs bg-card">
                    <option>ise-psn01</option><option>ise-psn02</option>
                  </select>
                </div>
              </div>
              <button className="mt-3 text-xs px-4 py-1.5 rounded text-white" style={{ background: '#049fd9' }}>Run Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operations;
