import { useState } from "react";
import { backupHistory, backupRepositories, scheduledBackups } from "@/lib/mockDataGap";
import { CheckCircle, XCircle, Database, Clock, HardDrive } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const BackupRestorePanel = () => {
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><Database size={16} style={{ color: '#049fd9' }} /><span className="text-sm font-semibold" style={{ color: '#333' }}>Backup & Restore</span></div>
        <button className="text-xs px-3 py-1.5 rounded text-white" style={{ background: '#049fd9' }} onClick={() => setBackupDialogOpen(true)}>+ Backup Now</button>
      </div>

      <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>Scheduled Backups</div>
      <ISETable headers={['Name', 'Type', 'Schedule', 'Repository', 'Encryption', 'Status', 'Last Run']}
        rows={scheduledBackups.map(b => [
          <span className="font-semibold" style={{ color: '#049fd9' }}>{b.name}</span>,
          b.type, b.schedule, b.repository, b.encryption,
          <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {b.status}</span>,
          <span className="font-mono" style={{ color: '#888' }}>{b.lastRun}</span>,
        ])} />

      <div className="text-xs font-semibold mb-1 mt-4" style={{ color: '#333' }}>Backup History</div>
      <ISETable headers={['Backup Name', 'Type', 'Repository', 'Start', 'End', 'Size', 'Status']}
        rows={backupHistory.map(b => [
          <span className="font-semibold" style={{ color: '#049fd9' }}>{b.name}</span>,
          b.type, b.repository,
          <span className="font-mono" style={{ color: '#888' }}>{b.startTime}</span>,
          <span className="font-mono" style={{ color: '#888' }}>{b.endTime}</span>,
          <span className="font-mono">{b.size}</span>,
          b.status === 'Completed' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> {b.status}</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> {b.status}</span>,
        ])} />

      <div className="text-xs font-semibold mb-1 mt-4" style={{ color: '#333' }}>Repositories</div>
      <ISETable headers={['Repository', 'Type', 'Server', 'Path', 'Status']}
        rows={backupRepositories.map(r => [
          <span className="font-semibold" style={{ color: '#049fd9' }}>{r.name}</span>,
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{r.type}</span>,
          <span className="font-mono">{r.server}</span>,
          <span className="font-mono text-[11px]" style={{ color: '#666' }}>{r.path}</span>,
          r.status === 'Available' ? <span className="flex items-center gap-1"><CheckCircle size={12} style={{ color: '#6cc04a' }} /> Available</span> : <span className="flex items-center gap-1"><XCircle size={12} style={{ color: '#cc0000' }} /> Unavailable</span>,
        ])} />

      <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-sm">On-Demand Backup</DialogTitle></DialogHeader>
          <div className="space-y-3 text-xs">
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Backup Name</label><input className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" defaultValue={`ISE_Config_Backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`} /></div>
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Backup Type</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card"><option>Configuration</option><option>Full (Config + Operational)</option></select></div>
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Repository</label><select className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card">{backupRepositories.filter(r => r.status === 'Available').map(r => <option key={r.id}>{r.name}</option>)}</select></div>
            <div><label className="block mb-1 font-medium" style={{ color: '#555' }}>Encryption Key</label><input type="password" className="w-full border border-border rounded px-2 py-1.5 text-xs bg-card" placeholder="Enter encryption key..." /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
            <Button size="sm" style={{ background: '#049fd9' }} onClick={() => setBackupDialogOpen(false)}>Start Backup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ISETable = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <div className="border border-border rounded overflow-auto bg-card">
    <table className="w-full text-xs">
      <thead><tr style={{ background: '#f0f0f0' }}>{headers.map(h => <th key={h} className="text-left p-2 font-semibold" style={{ color: '#555' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
          {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

export default BackupRestorePanel;
