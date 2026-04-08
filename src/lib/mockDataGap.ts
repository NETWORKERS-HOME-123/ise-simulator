// Gap analysis mock data: Threat Containment, Posture deep-dive, pxGrid, DACLs, Allowed Protocols, Backup/Restore, etc.

// ======================== THREAT CONTAINMENT ========================
export const threatEvents = [
  { id: 1, mac: 'AA:BB:CC:11:22:33', ip: '10.1.50.101', threatType: 'Malware', severity: 'Critical', cvssScore: 9.8, adapter: 'Qualys', detectedAt: '2026-04-08 08:25:00', status: 'Active', ancAction: 'ANC-Quarantine', description: 'Trojan.GenericKD.46845231 detected' },
  { id: 2, mac: 'DD:EE:FF:44:55:66', ip: '10.1.50.102', threatType: 'Vulnerability', severity: 'High', cvssScore: 8.5, adapter: 'Nexpose', detectedAt: '2026-04-07 15:30:00', status: 'Mitigated', ancAction: 'ANC-Shutdown', description: 'CVE-2026-12345 — Remote Code Execution in SMBv3' },
  { id: 3, mac: '11:22:33:AA:BB:CC', ip: '10.2.100.55', threatType: 'Compromised', severity: 'Critical', cvssScore: 10.0, adapter: 'CTA', detectedAt: '2026-04-08 09:00:00', status: 'Active', ancAction: 'ANC-Quarantine', description: 'Endpoint communicating with known C2 server' },
  { id: 4, mac: 'CC:DD:EE:11:22:33', ip: '10.1.60.42', threatType: 'Vulnerability', severity: 'Medium', cvssScore: 5.3, adapter: 'Tenable', detectedAt: '2026-04-06 11:00:00', status: 'Active', ancAction: 'None', description: 'CVE-2025-9876 — Information Disclosure in Apache' },
  { id: 5, mac: 'FF:AA:BB:CC:DD:EE', ip: '10.1.70.88', threatType: 'Malware', severity: 'High', cvssScore: 7.9, adapter: 'Qualys', detectedAt: '2026-04-08 07:15:00', status: 'Mitigated', ancAction: 'ANC-PortBounce', description: 'PUP.Optional.BundleInstaller detected' },
];

export const vulnerabilityAdapters = [
  { id: 1, name: 'Qualys', type: 'Qualys VA', status: 'Connected', serverUrl: 'https://qualysapi.corp.local', lastSync: '2026-04-08 08:00:00', endpoints: 2456, vendorInstance: 'Qualys Cloud Platform' },
  { id: 2, name: 'Nexpose', type: 'Rapid7 Nexpose', status: 'Connected', serverUrl: 'https://nexpose.corp.local:3780', lastSync: '2026-04-07 23:00:00', endpoints: 1890, vendorInstance: 'Nexpose Security Console' },
  { id: 3, name: 'Tenable', type: 'Tenable.io', status: 'Connected', serverUrl: 'https://cloud.tenable.com', lastSync: '2026-04-08 06:00:00', endpoints: 3100, vendorInstance: 'Tenable.io Vulnerability Management' },
  { id: 4, name: 'CTA', type: 'Cognitive Threat Analytics', status: 'Connected', serverUrl: 'https://cta.cisco.com', lastSync: '2026-04-08 09:00:00', endpoints: 0, vendorInstance: 'Cisco CTA Cloud' },
];

// ======================== POSTURE CONDITIONS ========================
export const postureConditions = [
  { id: 1, name: 'AV_Installed', type: 'AntiVirus', os: 'Windows All', attribute: 'AntiVirus.Name', operator: 'EXISTS', value: '', description: 'Checks if any antivirus product is installed' },
  { id: 2, name: 'AV_Definition_UpToDate', type: 'AntiVirus', os: 'Windows All', attribute: 'AntiVirus.DefinitionDate', operator: 'WITHIN', value: '3 days', description: 'AV definitions updated within last 3 days' },
  { id: 3, name: 'Firewall_Enabled', type: 'Firewall', os: 'Windows All', attribute: 'Firewall.Status', operator: 'EQUALS', value: 'Enabled', description: 'Windows Firewall must be enabled' },
  { id: 4, name: 'DiskEncryption_On', type: 'Disk Encryption', os: 'Windows 10/11', attribute: 'DiskEncryption.Status', operator: 'EQUALS', value: 'Full', description: 'BitLocker full disk encryption enabled' },
  { id: 5, name: 'FileVault_Enabled', type: 'Disk Encryption', os: 'macOS All', attribute: 'FileVault.Status', operator: 'EQUALS', value: 'Enabled', description: 'macOS FileVault encryption enabled' },
  { id: 6, name: 'USB_Disabled', type: 'USB', os: 'Windows All', attribute: 'USB.MassStorage', operator: 'EQUALS', value: 'Disabled', description: 'USB mass storage devices disabled' },
  { id: 7, name: 'Registry_Key_Exists', type: 'Registry', os: 'Windows All', attribute: 'Registry.Key', operator: 'KEY_EXISTS', value: 'HKLM\\SOFTWARE\\Corp\\Agent', description: 'Corporate agent registry key exists' },
  { id: 8, name: 'File_Exists_Agent', type: 'File', os: 'Windows All', attribute: 'File.Path', operator: 'EXISTS', value: 'C:\\Program Files\\CorpAgent\\agent.exe', description: 'Corporate agent executable present' },
  { id: 9, name: 'Patch_Current', type: 'Patch Management', os: 'Windows 10/11', attribute: 'WSUS.LastUpdate', operator: 'WITHIN', value: '30 days', description: 'Critical patches installed within 30 days' },
  { id: 10, name: 'AS_Installed', type: 'Antispyware', os: 'Windows All', attribute: 'Antispyware.Name', operator: 'EXISTS', value: '', description: 'Antispyware product is installed' },
];

export const postureRequirements = [
  { id: 1, name: 'Windows_AV_Requirement', os: 'Windows All', conditions: ['AV_Installed', 'AV_Definition_UpToDate'], remediation: 'Windows_AV_Remediation', gracePeriod: '4 hours' },
  { id: 2, name: 'Windows_Firewall_Requirement', os: 'Windows All', conditions: ['Firewall_Enabled'], remediation: 'Enable_Firewall_Remediation', gracePeriod: '1 hour' },
  { id: 3, name: 'Windows_Encryption_Requirement', os: 'Windows 10/11', conditions: ['DiskEncryption_On'], remediation: 'Enable_BitLocker_Remediation', gracePeriod: '24 hours' },
  { id: 4, name: 'macOS_FileVault_Requirement', os: 'macOS All', conditions: ['FileVault_Enabled'], remediation: 'macOS_Encryption_Remediation', gracePeriod: '24 hours' },
  { id: 5, name: 'Windows_Patch_Requirement', os: 'Windows 10/11', conditions: ['Patch_Current'], remediation: 'Windows_Update_Remediation', gracePeriod: '48 hours' },
  { id: 6, name: 'Corporate_Agent_Requirement', os: 'Windows All', conditions: ['Registry_Key_Exists', 'File_Exists_Agent'], remediation: 'Install_Agent_Remediation', gracePeriod: '2 hours' },
];

export const postureRemediations = [
  { id: 1, name: 'Windows_AV_Remediation', type: 'Antivirus', action: 'Update AV definitions via WSUS', instructions: 'Please update your antivirus definitions. Open Windows Security > Virus & threat protection > Check for updates.' },
  { id: 2, name: 'Enable_Firewall_Remediation', type: 'Script', action: 'Enable Windows Firewall via netsh', instructions: 'Your Windows Firewall is disabled. It will be automatically enabled. If the issue persists, contact IT.' },
  { id: 3, name: 'Enable_BitLocker_Remediation', type: 'Link', action: 'Redirect to BitLocker enrollment page', instructions: 'Full disk encryption is required. Visit the IT portal to begin BitLocker enrollment.' },
  { id: 4, name: 'macOS_Encryption_Remediation', type: 'Link', action: 'Redirect to FileVault instructions', instructions: 'FileVault must be enabled. Go to System Preferences > Security & Privacy > FileVault.' },
  { id: 5, name: 'Windows_Update_Remediation', type: 'Patch', action: 'Trigger WSUS scan and install', instructions: 'Critical patches are missing. Go to Settings > Update & Security > Check for updates.' },
  { id: 6, name: 'Install_Agent_Remediation', type: 'File', action: 'Download and install corporate agent', instructions: 'Corporate endpoint agent is missing. Download from https://it.corp.local/agent.' },
  { id: 7, name: 'USB_Block_Remediation', type: 'Script', action: 'Disable USB mass storage via registry', instructions: 'USB mass storage must be disabled per corporate policy.' },
];

// ======================== DACLs ========================
export const downloadableACLs = [
  { id: 1, name: 'PERMIT_ALL_IPV4_TRAFFIC', description: 'Permits all IPv4 traffic', content: 'permit ip any any' },
  { id: 2, name: 'ACL-WEBAUTH-REDIRECT', description: 'Web auth redirect ACL for CWA', content: 'deny udp any any eq 53\npermit tcp any any eq 53\ndeny ip any any' },
  { id: 3, name: 'ACL-IOT-RESTRICT', description: 'Restricted access for IoT devices', content: 'permit udp any any eq 53\npermit tcp any host 10.3.0.10 eq 443\npermit icmp any any\ndeny ip any any' },
  { id: 4, name: 'ACL-CONTRACTOR-LIMITED', description: 'Limited contractor access', content: 'permit tcp any any eq 80\npermit tcp any any eq 443\npermit udp any any eq 53\npermit icmp any any\ndeny ip any any' },
  { id: 5, name: 'ACL-GUEST-INTERNET', description: 'Internet-only guest access', content: 'permit tcp any any eq 80\npermit tcp any any eq 443\npermit udp any any eq 53\npermit udp any any eq 67\npermit udp any any eq 68\ndeny ip any 10.0.0.0 0.255.255.255\ndeny ip any 172.16.0.0 0.15.255.255\ndeny ip any 192.168.0.0 0.0.255.255\npermit ip any any' },
  { id: 6, name: 'ACL-POSTURE-REMEDIATE', description: 'Posture remediation redirect', content: 'permit udp any any eq 53\npermit tcp any host 10.1.1.12 eq 8443\ndeny ip any any' },
  { id: 7, name: 'ACL-BLACKHOLE', description: 'Deny all traffic', content: 'deny ip any any' },
];

// ======================== ALLOWED PROTOCOLS ========================
export const allowedProtocolsServices = [
  { id: 1, name: 'Default Network Access', description: 'Default allowed protocols for network access', protocols: { 'PAP/ASCII': true, 'EAP-MD5': true, 'EAP-TLS': true, 'PEAP (EAP-MSCHAPv2)': true, 'PEAP (EAP-GTC)': true, 'EAP-FAST': true, 'EAP-TTLS': false, 'LEAP': false, 'CHAP': true, 'MS-CHAPv1': false, 'MS-CHAPv2': true, 'EAP-TLS with TLS 1.3': true } },
  { id: 2, name: 'Default Device Admin', description: 'Default protocols for TACACS+ device admin', protocols: { 'PAP/ASCII': true, 'CHAP': true, 'MS-CHAPv1': false, 'MS-CHAPv2': false, 'EAP-MD5': false, 'EAP-TLS': false, 'PEAP (EAP-MSCHAPv2)': false, 'PEAP (EAP-GTC)': false, 'EAP-FAST': false, 'EAP-TTLS': false, 'LEAP': false, 'EAP-TLS with TLS 1.3': false } },
  { id: 3, name: 'EAP-TLS Only', description: 'Certificate-based authentication only', protocols: { 'PAP/ASCII': false, 'EAP-MD5': false, 'EAP-TLS': true, 'PEAP (EAP-MSCHAPv2)': false, 'PEAP (EAP-GTC)': false, 'EAP-FAST': false, 'EAP-TTLS': false, 'LEAP': false, 'CHAP': false, 'MS-CHAPv1': false, 'MS-CHAPv2': false, 'EAP-TLS with TLS 1.3': true } },
];

// ======================== pxGrid ========================
export const pxGridClients = [
  { id: 1, name: 'FMC-01.corp.local', status: 'Online', type: 'Firepower Management Center', ip: '10.5.1.20', version: '7.2.0', topics: ['Session', 'TrustSec'], lastSeen: '2026-04-08 09:15:00', authType: 'Certificate' },
  { id: 2, name: 'Stealthwatch-01.corp.local', status: 'Online', type: 'Stealthwatch Management Console', ip: '10.5.1.30', version: '7.4.0', topics: ['Session', 'ANC', 'Profiler'], lastSeen: '2026-04-08 09:14:00', authType: 'Certificate' },
  { id: 3, name: 'DNA-Center-01.corp.local', status: 'Online', type: 'Cisco DNA Center', ip: '10.5.1.40', version: '2.3.5', topics: ['Session', 'TrustSec', 'ANC', 'RADIUS'], lastSeen: '2026-04-08 09:13:00', authType: 'Certificate' },
  { id: 4, name: 'WSA-01.corp.local', status: 'Offline', type: 'Web Security Appliance', ip: '10.5.1.50', version: '14.5', topics: ['Session'], lastSeen: '2026-04-07 18:00:00', authType: 'Password' },
  { id: 5, name: 'SIEM-Splunk.corp.local', status: 'Online', type: 'Splunk (pxGrid Plugin)', ip: '10.5.1.60', version: '3.0', topics: ['Session', 'ANC'], lastSeen: '2026-04-08 09:12:00', authType: 'Certificate' },
];

export const pxGridTopics = [
  { name: 'Session', description: 'Session state change notifications (connect, disconnect, CoA)', subscribers: 5, publishers: 1 },
  { name: 'TrustSec', description: 'Security Group Tag and policy updates', subscribers: 2, publishers: 1 },
  { name: 'ANC', description: 'Adaptive Network Control policy applications', subscribers: 3, publishers: 2 },
  { name: 'Profiler', description: 'Endpoint profiling updates', subscribers: 1, publishers: 1 },
  { name: 'RADIUS', description: 'RADIUS failure and accounting notifications', subscribers: 1, publishers: 1 },
  { name: 'MDM', description: 'Mobile Device Management compliance updates', subscribers: 0, publishers: 0 },
  { name: 'System Health', description: 'ISE node health and performance data', subscribers: 2, publishers: 1 },
];

// ======================== BACKUP & RESTORE ========================
export const backupHistory = [
  { id: 1, name: 'ISE_Config_Backup_20260408', type: 'Configuration', status: 'Completed', repository: 'SFTP-Backup-01', startTime: '2026-04-08 02:00:00', endTime: '2026-04-08 02:15:23', size: '245 MB' },
  { id: 2, name: 'ISE_Full_Backup_20260407', type: 'Full (Config + Operational)', status: 'Completed', repository: 'SFTP-Backup-01', startTime: '2026-04-07 02:00:00', endTime: '2026-04-07 02:45:12', size: '1.2 GB' },
  { id: 3, name: 'ISE_Config_Backup_20260401', type: 'Configuration', status: 'Completed', repository: 'SFTP-Backup-01', startTime: '2026-04-01 02:00:00', endTime: '2026-04-01 02:14:56', size: '243 MB' },
  { id: 4, name: 'ISE_Config_Backup_20260325', type: 'Configuration', status: 'Failed', repository: 'NFS-Archive', startTime: '2026-03-25 02:00:00', endTime: '2026-03-25 02:02:30', size: '0 MB' },
];

export const backupRepositories = [
  { id: 1, name: 'SFTP-Backup-01', type: 'SFTP', path: '/backups/ise/', server: 'sftp-backup.corp.local', status: 'Available' },
  { id: 2, name: 'NFS-Archive', type: 'NFS', path: '/mnt/nfs/ise-archive/', server: 'nfs.corp.local', status: 'Unavailable' },
  { id: 3, name: 'FTP-DR', type: 'FTP', path: '/dr/ise/', server: 'ftp-dr.corp.local', status: 'Available' },
  { id: 4, name: 'Local-Storage', type: 'Local', path: '/opt/backup/', server: 'ise-pan01', status: 'Available' },
];

export const scheduledBackups = [
  { id: 1, name: 'Daily Config Backup', type: 'Configuration', schedule: 'Daily at 02:00 AM', repository: 'SFTP-Backup-01', encryption: 'AES-256', status: 'Enabled', lastRun: '2026-04-08 02:00:00' },
  { id: 2, name: 'Weekly Full Backup', type: 'Full', schedule: 'Every Sunday at 01:00 AM', repository: 'SFTP-Backup-01', encryption: 'AES-256', status: 'Enabled', lastRun: '2026-04-06 01:00:00' },
];

// ======================== TACACS LIVE LOGS ========================
export const generateTacacsLogs = (count: number) => {
  const tacacsUsers = ['netadmin', 'admin', 'noc_user01', 'helpdesk', 'readonly'];
  const devices = ['SW-CORE-01', 'SW-ACCESS-01', 'WLC-01', 'FW-EDGE-01', 'SW-ACCESS-02'];
  const commands = ['show running-config', 'show interfaces', 'configure terminal', 'show ip route', 'write memory', 'show log', 'reload', 'copy running-config startup-config'];
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const passed = Math.random() > 0.15;
    return {
      id: i + 1,
      time: new Date(now - i * 5000 - Math.random() * 10000).toISOString(),
      status: passed ? 'Pass' : 'Fail',
      username: tacacsUsers[Math.floor(Math.random() * tacacsUsers.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      deviceIp: ['10.1.100.1', '10.1.100.2', '10.2.200.1', '10.3.50.1', '10.1.100.3'][Math.floor(Math.random() * 5)],
      command: commands[Math.floor(Math.random() * commands.length)],
      privilege: Math.random() > 0.5 ? 15 : Math.random() > 0.5 ? 5 : 1,
      authType: 'TACACS+',
      detail: passed ? 'Command Authorized' : 'Command Denied',
    };
  });
};

// ======================== SXP DEVICES ========================
export const sxpDevices = [
  { id: 1, name: 'SW-CORE-01', ip: '10.1.100.1', mode: 'Both', status: 'On', peerIp: '10.1.1.10', version: '4', holdTime: 120, domain: 'default' },
  { id: 2, name: 'SW-ACCESS-01', ip: '10.1.100.2', mode: 'Listener', status: 'On', peerIp: '10.1.1.10', version: '4', holdTime: 120, domain: 'default' },
  { id: 3, name: 'FW-EDGE-01', ip: '10.3.50.1', mode: 'Speaker', status: 'Off', peerIp: '10.1.1.10', version: '4', holdTime: 120, domain: 'default' },
];

// ======================== GUEST TYPE DETAILS ========================
export const guestTypeDetails: Record<string, { accessDuration: string; maxDevices: number; maxLogins: number; sponsorRequired: boolean; emailRequired: boolean; smsRequired: boolean; allowedDays: string[]; passwordPolicy: string; aupRequired: boolean; description: string }> = {
  'Contractor': { accessDuration: '90 days', maxDevices: 3, maxLogins: 1, sponsorRequired: true, emailRequired: true, smsRequired: false, allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], passwordPolicy: 'Alphanumeric, min 8 chars', aupRequired: true, description: 'Long-term contractor access with sponsor approval and email notification' },
  'Daily': { accessDuration: '1 day', maxDevices: 1, maxLogins: 1, sponsorRequired: true, emailRequired: false, smsRequired: true, allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], passwordPolicy: 'Numeric, 4 digits', aupRequired: true, description: 'Single-day guest access with sponsor-generated credentials' },
  'Weekly': { accessDuration: '7 days', maxDevices: 2, maxLogins: 1, sponsorRequired: true, emailRequired: true, smsRequired: false, allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], passwordPolicy: 'Alphanumeric, min 6 chars', aupRequired: true, description: 'Week-long guest access for visiting partners' },
  'Self-Registration': { accessDuration: '3 days', maxDevices: 1, maxLogins: 1, sponsorRequired: false, emailRequired: true, smsRequired: true, allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], passwordPolicy: 'Alphanumeric, min 6 chars', aupRequired: true, description: 'Self-registered guest with email/SMS verification' },
  'Hotspot': { accessDuration: '1 day', maxDevices: 1, maxLogins: -1, sponsorRequired: false, emailRequired: false, smsRequired: false, allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], passwordPolicy: 'None', aupRequired: true, description: 'Open hotspot access requiring only AUP acceptance' },
};

// ======================== SHELL PROFILE DETAILS ========================
export const shellProfileDetails: Record<string, { privilegeLevel: number; idleTimeout: number; maxSessions: number; attributes: { name: string; requirement: string; value: string }[] }> = {
  'Shell_Admin': { privilegeLevel: 15, idleTimeout: 30, maxSessions: 5, attributes: [{ name: 'priv-lvl', requirement: 'Mandatory', value: '15' }, { name: 'timeout', requirement: 'Optional', value: '30' }, { name: 'autocmd', requirement: 'Optional', value: '' }] },
  'Shell_ReadOnly': { privilegeLevel: 1, idleTimeout: 15, maxSessions: 10, attributes: [{ name: 'priv-lvl', requirement: 'Mandatory', value: '1' }, { name: 'timeout', requirement: 'Optional', value: '15' }] },
  'Shell_Monitor': { privilegeLevel: 5, idleTimeout: 20, maxSessions: 5, attributes: [{ name: 'priv-lvl', requirement: 'Mandatory', value: '5' }, { name: 'timeout', requirement: 'Optional', value: '20' }] },
};

// ======================== COMMAND SET DETAILS ========================
export const commandSetDetails: Record<string, { rules: { grant: 'Permit' | 'Deny'; command: string; arguments: string }[] }> = {
  'PermitAll': { rules: [{ grant: 'Permit', command: '.*', arguments: '.*' }] },
  'ShowOnly': { rules: [{ grant: 'Permit', command: 'show', arguments: '.*' }, { grant: 'Permit', command: 'display', arguments: '.*' }, { grant: 'Permit', command: 'exit', arguments: '' }, { grant: 'Deny', command: '.*', arguments: '.*' }] },
  'DenyConfig': { rules: [{ grant: 'Deny', command: 'configure', arguments: '.*' }, { grant: 'Deny', command: 'write', arguments: '.*' }, { grant: 'Deny', command: 'copy', arguments: '.*' }, { grant: 'Deny', command: 'reload', arguments: '.*' }, { grant: 'Permit', command: '.*', arguments: '.*' }] },
};

// ======================== MESSAGE CODES ========================
export const messageCodes = [
  { code: 5200, category: 'Passed-Authentication', severity: 'INFO', description: 'Authentication succeeded' },
  { code: 5400, category: 'Failed-Attempt', severity: 'ERROR', description: 'Authentication failed' },
  { code: 5405, category: 'Failed-Attempt', severity: 'ERROR', description: 'RADIUS request dropped' },
  { code: 5440, category: 'Failed-Attempt', severity: 'WARN', description: 'Endpoint abandoned EAP session' },
  { code: 12304, category: 'RADIUS-Diagnostics', severity: 'INFO', description: 'Extracted EAP-Response containing EAP-TLS response' },
  { code: 22028, category: 'Failed-Attempt', severity: 'ERROR', description: 'Authentication failed — wrong password' },
  { code: 22056, category: 'Failed-Attempt', severity: 'ERROR', description: 'Subject not found in the applicable identity store(s)' },
  { code: 24408, category: 'Failed-Attempt', severity: 'ERROR', description: 'User not found in identity store' },
  { code: 24421, category: 'Passed-Authentication', severity: 'INFO', description: 'Identity resolution detected single matching account' },
  { code: 86009, category: 'System-Diagnostics', severity: 'INFO', description: 'Guest user record created' },
  { code: 86010, category: 'System-Diagnostics', severity: 'INFO', description: 'Guest user changed password' },
  { code: 91008, category: 'Internal-Operations', severity: 'INFO', description: 'pxGrid session published' },
  { code: 91010, category: 'Internal-Operations', severity: 'WARN', description: 'pxGrid session removed' },
];

// ======================== NETWORK DEVICE PROFILES ========================
export const networkDeviceProfiles = [
  { id: 1, name: 'Cisco', vendor: 'Cisco Systems', coaType: 'RFC 5176', urlRedirect: 'Cisco AV-Pair', description: 'Default Cisco device profile supporting CoA and URL redirect' },
  { id: 2, name: 'Aruba', vendor: 'HPE Aruba', coaType: 'RFC 5176', urlRedirect: 'Aruba VSA', description: 'Aruba wireless and wired device support' },
  { id: 3, name: 'HP', vendor: 'HP Networking', coaType: 'RFC 5176', urlRedirect: 'HP VSA', description: 'HP ProCurve/Comware switch support' },
  { id: 4, name: 'Juniper', vendor: 'Juniper Networks', coaType: 'RFC 5176', urlRedirect: 'Juniper VSA', description: 'Juniper EX/SRX device support' },
  { id: 5, name: 'Meraki', vendor: 'Cisco Meraki', coaType: 'API-based', urlRedirect: 'Meraki Dashboard', description: 'Cisco Meraki cloud-managed devices' },
];

// ======================== ADMIN SETTINGS ========================
export const smtpConfig = { server: 'smtp.corp.local', port: 25, useTLS: true, username: 'ise-notify@corp.local', fromAddress: 'ise-alerts@corp.local', status: 'Connected' };
export const ntpServers = [
  { ip: '10.1.1.1', status: 'Synchronized', stratum: 2, offset: '+0.003s' },
  { ip: '10.1.1.2', status: 'Reachable', stratum: 3, offset: '+0.012s' },
];
export const patchHistory = [
  { id: 1, name: 'ise-patchbundle-3.1.0.518-Patch7-23071409.SPA.x86_64.tar.gz', version: 'Patch 7', installedDate: '2026-03-01', installedBy: 'admin', status: 'Applied' },
  { id: 2, name: 'ise-patchbundle-3.1.0.518-Patch6-23050111.SPA.x86_64.tar.gz', version: 'Patch 6', installedDate: '2025-12-15', installedBy: 'admin', status: 'Applied (Superseded)' },
  { id: 3, name: 'ise-patchbundle-3.1.0.518-Patch5-23030815.SPA.x86_64.tar.gz', version: 'Patch 5', installedDate: '2025-09-20', installedBy: 'admin', status: 'Applied (Superseded)' },
];

export const ersApiSettings = { enabled: true, port: 9060, corsAllowed: true, maxSessions: 100, documentation: 'https://ise-pan01.corp.local:9060/ers/sdk', status: 'Running' };
export const dataConnectSettings = { enabled: true, port: 2484, odbc: 'ISE-DataConnect', maxConnections: 5, status: 'Active', password: '●●●●●●●●' };
