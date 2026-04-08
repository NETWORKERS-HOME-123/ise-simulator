import { useState, useEffect } from "react";
import DashletCard from "@/components/DashletCard";
import { alarms } from "@/lib/mockData";
import { AlertTriangle, AlertCircle, Info, Activity, Wifi, Monitor, Users, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const severityIcon = (s: string) => {
  switch (s) {
    case 'error': return <AlertCircle size={14} style={{ color: '#cc0000' }} />;
    case 'warning': return <AlertTriangle size={14} style={{ color: '#fbab18' }} />;
    default: return <Info size={14} style={{ color: '#049fd9' }} />;
  }
};

const sparkData = (base: number) =>
  Array.from({ length: 12 }, () => ({ v: base + Math.floor(Math.random() * base * 0.3) }));

const pieData = [
  { name: 'Windows', value: 42 },
  { name: 'Apple', value: 28 },
  { name: 'Cisco', value: 15 },
  { name: 'Other', value: 15 },
];
const PIE_COLORS = ['#049fd9', '#6cc04a', '#fbab18', '#999'];

const Index = () => {
  const [ts, setTs] = useState(new Date());
  const [metrics, setMetrics] = useState({
    active: 1247,
    guests: 83,
    profiled: 956,
    cpu: 62,
    memory: 71,
    latency: 24,
  });

  useEffect(() => {
    const iv = setInterval(() => {
      setTs(new Date());
      setMetrics(m => ({
        active: m.active + Math.floor(Math.random() * 10 - 5),
        guests: m.guests + Math.floor(Math.random() * 4 - 2),
        profiled: m.profiled + Math.floor(Math.random() * 6 - 3),
        cpu: Math.min(99, Math.max(20, m.cpu + Math.floor(Math.random() * 8 - 4))),
        memory: Math.min(99, Math.max(30, m.memory + Math.floor(Math.random() * 4 - 2))),
        latency: Math.min(100, Math.max(5, m.latency + Math.floor(Math.random() * 6 - 3))),
      }));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const metricCards = [
    { label: 'Active Endpoints', value: metrics.active, color: '#e8730e', icon: Monitor, base: 1200 },
    { label: 'Authenticated Guests', value: metrics.guests, color: '#6cc04a', icon: Users, base: 80 },
    { label: 'Profiled Endpoints', value: metrics.profiled, color: '#049fd9', icon: Wifi, base: 900 },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="text-xs" style={{ color: '#666' }}>Home &gt; <span className="font-semibold" style={{ color: '#333' }}>Dashboard</span></div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#888' }}>
          <RefreshCw size={12} />
          Last updated: {ts.toLocaleTimeString()}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4">
        {metricCards.map(card => (
          <div key={card.label} className="border border-border rounded bg-card p-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded" style={{ background: card.color + '18' }}>
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-medium" style={{ color: '#666' }}>{card.label}</div>
              <div className="text-xl font-bold" style={{ color: card.color }}>{card.value.toLocaleString()}</div>
            </div>
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData(card.base)}>
                  <Area type="monotone" dataKey="v" stroke={card.color} fill={card.color} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* System Summary */}
        <div className="col-span-3">
          <DashletCard title="System Summary">
            <div className="space-y-4">
              {[
                { label: 'CPU Utilization', value: metrics.cpu, color: metrics.cpu > 80 ? '#cc0000' : '#049fd9' },
                { label: 'Memory Utilization', value: metrics.memory, color: metrics.memory > 85 ? '#cc0000' : '#6cc04a' },
                { label: 'Auth Latency (ms)', value: metrics.latency, color: '#fbab18', max: 100 },
              ].map(g => (
                <div key={g.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span style={{ color: '#555' }}>{g.label}</span>
                    <span className="font-bold" style={{ color: g.color }}>{g.value}{g.label.includes('ms') ? 'ms' : '%'}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#e5e5e5' }}>
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${g.value}%`, background: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </DashletCard>

          <div className="mt-4">
            <DashletCard title="Endpoint Distribution">
              <div className="flex items-center justify-center">
                <PieChart width={150} height={120}>
                  <Pie data={pieData} cx={75} cy={55} outerRadius={50} innerRadius={25} dataKey="value" strokeWidth={1}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1 text-[10px]">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i] }} />
                    {d.name} ({d.value}%)
                  </div>
                ))}
              </div>
            </DashletCard>
          </div>
        </div>

        {/* Alarms */}
        <div className="col-span-6">
          <DashletCard title="Alarms">
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th className="text-left p-1.5 font-semibold" style={{ color: '#555' }}>Severity</th>
                    <th className="text-left p-1.5 font-semibold" style={{ color: '#555' }}>Alarm Name</th>
                    <th className="text-left p-1.5 font-semibold" style={{ color: '#555' }}>Details</th>
                    <th className="text-right p-1.5 font-semibold" style={{ color: '#555' }}>#</th>
                    <th className="text-right p-1.5 font-semibold" style={{ color: '#555' }}>Last Occurred</th>
                  </tr>
                </thead>
                <tbody>
                  {alarms.map((a, i) => (
                    <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="hover:bg-accent/60">
                      <td className="p-1.5">{severityIcon(a.severity)}</td>
                      <td className="p-1.5 font-medium" style={{ color: '#333' }}>{a.name}</td>
                      <td className="p-1.5" style={{ color: '#666' }}>{a.detail}</td>
                      <td className="p-1.5 text-right font-mono">{a.occurrences}</td>
                      <td className="p-1.5 text-right" style={{ color: '#888' }}>{a.lastOccurred}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashletCard>
        </div>

        {/* Right panel */}
        <div className="col-span-3 space-y-4">
          <DashletCard title="Passed Authentications (24h)">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#6cc04a' }}>12,847</div>
              <div className="text-[10px] mt-1" style={{ color: '#888' }}>▲ 3.2% from yesterday</div>
              <div className="w-full h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData(12000)}>
                    <Area type="monotone" dataKey="v" stroke="#6cc04a" fill="#6cc04a" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DashletCard>

          <DashletCard title="Failed Authentications (24h)">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#cc0000' }}>342</div>
              <div className="text-[10px] mt-1" style={{ color: '#888' }}>▼ 1.5% from yesterday</div>
              <div className="w-full h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData(340)}>
                    <Area type="monotone" dataKey="v" stroke="#cc0000" fill="#cc0000" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DashletCard>

          <DashletCard title="RADIUS Activity">
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: '#049fd9' }} />
              <span className="text-xs" style={{ color: '#555' }}>Live RADIUS requests</span>
            </div>
            <div className="text-[11px] mt-2 space-y-1">
              <div className="flex justify-between"><span style={{ color: '#666' }}>Requests/sec</span><span className="font-mono font-bold">47</span></div>
              <div className="flex justify-between"><span style={{ color: '#666' }}>Avg response (ms)</span><span className="font-mono font-bold">{metrics.latency}</span></div>
              <div className="flex justify-between"><span style={{ color: '#666' }}>Active sessions</span><span className="font-mono font-bold">{metrics.active}</span></div>
            </div>
          </DashletCard>
        </div>
      </div>
    </div>
  );
};

export default Index;
