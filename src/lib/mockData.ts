// Mock data generators for Cisco ISE Dashboard

export const generateMacAddress = () => {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
};

export const generateIP = () =>
  `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const profiles = ['Cisco-Device', 'Apple-MacBook', 'Windows10-Workstation', 'HP-Printer', 'Cisco-IP-Phone', 'Android', 'Linux-Workstation', 'Unknown'];
const identityGroups = ['Employee', 'Guest', 'Contractor', 'BYOD', 'IOT', 'Profiled', 'Unknown'];
const usernames = ['jsmith', 'admin', 'jdoe', 'mwilson', 'agarcia', 'bchen', 'host/DESKTOP-A1B2C3', 'host/LAPTOP-X4Y5Z6', 'guest_user01', 'contractor_01'];
const servers = ['ise-pan01', 'ise-psn01', 'ise-psn02', 'ise-mnt01'];
const nasIPs = ['10.1.100.1', '10.1.100.2', '10.2.200.1', '10.3.50.1', '172.16.1.1'];

export const generateEndpoints = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    mac: generateMacAddress(),
    ip: generateIP(),
    identityGroup: identityGroups[Math.floor(Math.random() * identityGroups.length)],
    profile: profiles[Math.floor(Math.random() * profiles.length)],
    status: Math.random() > 0.15 ? 'Connected' : 'Disconnected',
    staticAssignment: Math.random() > 0.7,
  }));

export const generateRadiusLogs = (count: number) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const passed = Math.random() > 0.2;
    return {
      id: i + 1,
      time: new Date(now - i * 3000 - Math.random() * 5000).toISOString(),
      status: passed ? 'Pass' : 'Fail',
      detail: passed ? 'Authentication Succeeded' : (Math.random() > 0.5 ? 'Wrong Password' : 'Unknown User'),
      username: usernames[Math.floor(Math.random() * usernames.length)],
      endpointId: generateMacAddress(),
      identityGroup: identityGroups[Math.floor(Math.random() * identityGroups.length)],
      server: servers[Math.floor(Math.random() * servers.length)],
      nasIP: nasIPs[Math.floor(Math.random() * nasIPs.length)],
      authProtocol: Math.random() > 0.5 ? 'PEAP (EAP-MSCHAPv2)' : 'EAP-TLS',
    };
  });
};

export const alarms = [
  { id: 1, severity: 'warning', name: 'NTP Sync Failure', detail: 'NTP server 10.1.1.1 not reachable', occurrences: 12, lastOccurred: '2026-04-08 09:14:22' },
  { id: 2, severity: 'error', name: 'DNS Resolution Failure', detail: 'Cannot resolve ise-psn02.corp.local', occurrences: 5, lastOccurred: '2026-04-08 09:12:01' },
  { id: 3, severity: 'info', name: 'Configuration Changed', detail: 'Policy set "Corporate_Wired" modified by admin', occurrences: 1, lastOccurred: '2026-04-08 08:55:30' },
  { id: 4, severity: 'warning', name: 'ISE Authentication Inactivity', detail: 'No authentications received in last 15 min on ise-psn01', occurrences: 3, lastOccurred: '2026-04-08 08:40:15' },
  { id: 5, severity: 'error', name: 'Certificate Expiry Warning', detail: 'System certificate expires in 7 days', occurrences: 1, lastOccurred: '2026-04-08 07:00:00' },
  { id: 6, severity: 'info', name: 'Profiler Service Started', detail: 'Profiler service restarted on ise-psn02', occurrences: 2, lastOccurred: '2026-04-08 06:30:00' },
  { id: 7, severity: 'warning', name: 'High CPU Utilization', detail: 'CPU usage exceeded 85% on ise-pan01', occurrences: 8, lastOccurred: '2026-04-08 09:10:00' },
  { id: 8, severity: 'error', name: 'RADIUS Request Timeout', detail: 'Timeout waiting for response from NAS 10.1.100.2', occurrences: 15, lastOccurred: '2026-04-08 09:15:00' },
];

export const policySets = [
  { id: 1, name: 'Corporate_Wired', status: 'Enabled', conditions: 'Wired_802.1X', authPolicy: 'Internal Users', authzPolicy: 'PermitAccess', hits: 14523 },
  { id: 2, name: 'Corporate_Wireless', status: 'Enabled', conditions: 'Wireless_802.1X', authPolicy: 'Internal Users', authzPolicy: 'PermitAccess', hits: 8721 },
  { id: 3, name: 'Guest_Portal', status: 'Enabled', conditions: 'Wireless_MAB', authPolicy: 'Guest Portal Sequence', authzPolicy: 'Guest_Access', hits: 3456 },
  { id: 4, name: 'BYOD_Onboarding', status: 'Enabled', conditions: 'BYOD_Portal', authPolicy: 'Certificate Auth Profile', authzPolicy: 'BYOD_Access', hits: 1234 },
  { id: 5, name: 'VPN_Remote', status: 'Enabled', conditions: 'VPN_Tunnel', authPolicy: 'AD with RSA', authzPolicy: 'VPN_Full_Access', hits: 2890 },
  { id: 6, name: 'IOT_Devices', status: 'Disabled', conditions: 'MAB', authPolicy: 'Internal Endpoints', authzPolicy: 'IOT_Restricted', hits: 567 },
  { id: 7, name: 'Contractor_Access', status: 'Enabled', conditions: 'Wired_MAB', authPolicy: 'Contractor_DB', authzPolicy: 'Limited_Access', hits: 890 },
];

export const deploymentNodes = [
  { hostname: 'ise-pan01.corp.local', role: 'Primary Admin (PAN)', persona: 'Admin, Policy Service', status: 'Connected', ip: '10.1.1.10', version: '3.1.0.518' },
  { hostname: 'ise-mnt01.corp.local', role: 'Monitoring (MnT)', persona: 'Monitoring', status: 'Connected', ip: '10.1.1.11', version: '3.1.0.518' },
  { hostname: 'ise-psn01.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Connected', ip: '10.1.1.12', version: '3.1.0.518' },
  { hostname: 'ise-psn02.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Disconnected', ip: '10.1.1.13', version: '3.1.0.518' },
];
