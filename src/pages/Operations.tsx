import { useState, useEffect, useRef } from "react";
import { generateRadiusLogs } from "@/lib/mockData";
import { CheckCircle, XCircle, RefreshCw, Pause, Play } from "lucide-react";

const Operations = () => {
  const [logs, setLogs] = useState(() => generateRadiusLogs(30));
  const [autoRefresh, setAutoRefresh] = useState(true);
  const counterRef = useRef(31);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(() => {
      const newLogs = generateRadiusLogs(2).map(l => ({ ...l, id: counterRef.current++ }));
      setLogs(prev => [...newLogs, ...prev].slice(0, 100));
    }, 3000);
    return () => clearInterval(iv);
  }, [autoRefresh]);

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs" style={{ color: '#666' }}>Operations &gt; RADIUS &gt; <span className="font-semibold" style={{ color: '#333' }}>Live Logs</span></div>

      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border border-border bg-card hover:bg-accent"
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
        </button>
        <button
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border border-border bg-card hover:bg-accent"
          onClick={() => setLogs(generateRadiusLogs(30))}
        >
          <RefreshCw size={12} /> Refresh
        </button>
        <div className="flex items-center gap-1 ml-auto">
          {autoRefresh && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6cc04a' }} />}
          <span className="text-[11px]" style={{ color: '#888' }}>
            {autoRefresh ? 'Auto-refresh ON' : 'Paused'} • {logs.length} entries
          </span>
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
                <td className="p-2">
                  {log.status === 'Pass'
                    ? <CheckCircle size={14} style={{ color: '#6cc04a' }} />
                    : <XCircle size={14} style={{ color: '#cc0000' }} />}
                </td>
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
    </div>
  );
};

export default Operations;
