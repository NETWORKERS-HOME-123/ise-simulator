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

export const generateLiveSessions = (count: number) => {
  const now = Date.now();
  const authzPolicies = ['PermitAccess', 'BYOD_Access', 'Guest_Access', 'VPN_Full_Access', 'Limited_Access', 'IOT_Restricted'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    sessionId: `0A0${Math.floor(Math.random() * 9)}${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    username: usernames[Math.floor(Math.random() * usernames.length)],
    ip: generateIP(),
    mac: generateMacAddress(),
    nasIP: nasIPs[Math.floor(Math.random() * nasIPs.length)],
    server: servers[Math.floor(Math.random() * servers.length)],
    authzPolicy: authzPolicies[Math.floor(Math.random() * authzPolicies.length)],
    started: new Date(now - Math.floor(Math.random() * 86400000)).toISOString(),
    duration: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    protocol: Math.random() > 0.5 ? 'RADIUS' : '802.1X',
  }));
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

export const authenticationPolicies = [
  { id: 1, rule: 'Dot1X', conditions: 'Wired_802.1X OR Wireless_802.1X', allowedProtocols: 'Default Network Access', identityStore: 'Internal Users', status: 'Enabled' },
  { id: 2, rule: 'MAB', conditions: 'Wired_MAB OR Wireless_MAB', allowedProtocols: 'Default Network Access', identityStore: 'Internal Endpoints', status: 'Enabled' },
  { id: 3, rule: 'Guest_Auth', conditions: 'Wireless_MAB AND GuestEndpoint', allowedProtocols: 'Default Network Access', identityStore: 'Guest Portal Sequence', status: 'Enabled' },
  { id: 4, rule: 'VPN_Auth', conditions: 'DEVICE:Device Type EQUALS VPN', allowedProtocols: 'Default Network Access', identityStore: 'AD with RSA', status: 'Enabled' },
  { id: 5, rule: 'Default', conditions: 'Default', allowedProtocols: 'Default Network Access', identityStore: 'Internal Users', status: 'Enabled' },
];

export const authorizationPolicies = [
  { id: 1, rule: 'Employee_Wired', conditions: 'IdentityGroup:Employee AND Wired_802.1X', profile: 'PermitAccess', securityGroup: 'Employees', status: 'Enabled' },
  { id: 2, rule: 'Employee_Wireless', conditions: 'IdentityGroup:Employee AND Wireless_802.1X', profile: 'PermitAccess', securityGroup: 'Employees', status: 'Enabled' },
  { id: 3, rule: 'Guest_Redirect', conditions: 'IdentityGroup:Guest AND Wireless_MAB', profile: 'CWA_Redirect', securityGroup: 'Guests', status: 'Enabled' },
  { id: 4, rule: 'BYOD_Onboard', conditions: 'IdentityGroup:BYOD AND Certificate_Based', profile: 'BYOD_Access', securityGroup: 'BYOD_Devices', status: 'Enabled' },
  { id: 5, rule: 'IOT_Restrict', conditions: 'IdentityGroup:IOT AND MAB', profile: 'IOT_Restricted', securityGroup: 'IOT_Devices', status: 'Enabled' },
  { id: 6, rule: 'Contractor_Limited', conditions: 'IdentityGroup:Contractor', profile: 'Limited_Access', securityGroup: 'Contractors', status: 'Enabled' },
  { id: 7, rule: 'VPN_Full', conditions: 'DEVICE:Device Type EQUALS VPN', profile: 'VPN_Full_Access', securityGroup: 'VPN_Users', status: 'Enabled' },
  { id: 8, rule: 'Default_Deny', conditions: 'Default', profile: 'DenyAccess', securityGroup: 'Unknown', status: 'Enabled' },
];

export const authorizationProfiles = [
  { id: 1, name: 'PermitAccess', type: 'Standard', description: 'Permits full network access', accessType: 'ACCESS_ACCEPT', vlan: '', dacl: '' },
  { id: 2, name: 'DenyAccess', type: 'Standard', description: 'Denies all network access', accessType: 'ACCESS_REJECT', vlan: '', dacl: '' },
  { id: 3, name: 'CWA_Redirect', type: 'Standard', description: 'Central Web Auth redirect for guests', accessType: 'ACCESS_ACCEPT', vlan: 'Guest_VLAN', dacl: 'ACL-WEBAUTH-REDIRECT' },
  { id: 4, name: 'BYOD_Access', type: 'Standard', description: 'BYOD onboarding access with limited scope', accessType: 'ACCESS_ACCEPT', vlan: 'BYOD_VLAN', dacl: 'PERMIT_ALL_IPV4_TRAFFIC' },
  { id: 5, name: 'IOT_Restricted', type: 'Standard', description: 'Restricted access for IoT devices', accessType: 'ACCESS_ACCEPT', vlan: 'IOT_VLAN', dacl: 'ACL-IOT-RESTRICT' },
  { id: 6, name: 'VPN_Full_Access', type: 'Standard', description: 'Full VPN access for remote workers', accessType: 'ACCESS_ACCEPT', vlan: '', dacl: 'PERMIT_ALL_IPV4_TRAFFIC' },
  { id: 7, name: 'Limited_Access', type: 'Standard', description: 'Limited network scope for contractors', accessType: 'ACCESS_ACCEPT', vlan: 'Contractor_VLAN', dacl: 'ACL-CONTRACTOR-LIMITED' },
  { id: 8, name: 'Guest_Access', type: 'Standard', description: 'Internet-only guest access', accessType: 'ACCESS_ACCEPT', vlan: 'Guest_VLAN', dacl: 'ACL-GUEST-INTERNET' },
  { id: 9, name: 'Posture_Remediation', type: 'Standard', description: 'Remediation VLAN for non-compliant', accessType: 'ACCESS_ACCEPT', vlan: 'Remediation_VLAN', dacl: 'ACL-POSTURE-REMEDIATE' },
];

export const policyConditions = [
  { id: 1, name: 'Wired_802.1X', type: 'Simple', attribute: 'RADIUS:Service-Type', operator: 'EQUALS', value: 'Framed', description: 'Matches wired 802.1X sessions' },
  { id: 2, name: 'Wireless_802.1X', type: 'Simple', attribute: 'RADIUS:Service-Type', operator: 'EQUALS', value: 'Framed', description: 'Matches wireless 802.1X sessions' },
  { id: 3, name: 'Wired_MAB', type: 'Simple', attribute: 'Radius:Service-Type', operator: 'EQUALS', value: 'Call-Check', description: 'Matches wired MAB sessions' },
  { id: 4, name: 'Wireless_MAB', type: 'Simple', attribute: 'Radius:Service-Type', operator: 'EQUALS', value: 'Call-Check', description: 'Matches wireless MAB sessions' },
  { id: 5, name: 'VPN_Tunnel', type: 'Compound', attribute: 'DEVICE:Device Type', operator: 'EQUALS', value: 'All Device Types#VPN', description: 'Matches VPN tunnel connections' },
  { id: 6, name: 'GuestEndpoint', type: 'Simple', attribute: 'EndPoints:BYODRegistration', operator: 'EQUALS', value: 'No', description: 'Non-registered endpoints' },
  { id: 7, name: 'Certificate_Based', type: 'Simple', attribute: 'Network Access:EapAuthentication', operator: 'EQUALS', value: 'EAP-TLS', description: 'Certificate-based authentication' },
];

export const radiusDictionaries = [
  { id: 1, name: 'IETF', vendor: 'IETF', attributes: 256, description: 'Standard RADIUS attributes (RFC 2865/2866)' },
  { id: 2, name: 'Cisco', vendor: 'Cisco', attributes: 89, description: 'Cisco vendor-specific attributes (VSA 9)' },
  { id: 3, name: 'Microsoft', vendor: 'Microsoft', attributes: 34, description: 'Microsoft vendor-specific attributes' },
  { id: 4, name: 'Airespace', vendor: 'Cisco Airespace', attributes: 22, description: 'Cisco wireless controller attributes' },
  { id: 5, name: 'Cisco-VPN3000', vendor: 'Cisco', attributes: 67, description: 'Cisco VPN 3000 series attributes' },
  { id: 6, name: 'Infoblox', vendor: 'Infoblox', attributes: 8, description: 'Infoblox DHCP vendor attributes' },
];

export const profilingPolicies = [
  { id: 1, name: 'Cisco-IP-Phone', certainty: 70, matchedEndpoints: 234, conditions: 'DHCP class OR CDP protocol', parentPolicy: 'Cisco-Device', status: 'Verified' },
  { id: 2, name: 'Apple-MacBook', certainty: 40, matchedEndpoints: 189, conditions: 'DHCP:host-name CONTAINS Mac', parentPolicy: 'Apple-Device', status: 'Verified' },
  { id: 3, name: 'Windows10-Workstation', certainty: 30, matchedEndpoints: 567, conditions: 'DHCP class CONTAINS MSFT 5.0', parentPolicy: 'Microsoft-Workstation', status: 'Verified' },
  { id: 4, name: 'HP-Printer', certainty: 70, matchedEndpoints: 45, conditions: 'OUI STARTS_WITH 00:1A:4B', parentPolicy: 'HP-Device', status: 'Verified' },
  { id: 5, name: 'Android', certainty: 20, matchedEndpoints: 312, conditions: 'DHCP:host-name CONTAINS android', parentPolicy: 'Android', status: 'Verified' },
  { id: 6, name: 'Cisco-Switch', certainty: 70, matchedEndpoints: 28, conditions: 'CDP OR LLDP protocol detected', parentPolicy: 'Cisco-Device', status: 'Verified' },
  { id: 7, name: 'Linux-Workstation', certainty: 20, matchedEndpoints: 78, conditions: 'DHCP class CONTAINS Linux', parentPolicy: 'Workstation', status: 'Verified' },
  { id: 8, name: 'Unknown', certainty: 0, matchedEndpoints: 156, conditions: 'No match', parentPolicy: '', status: 'Unknown' },
];

export const clientProvisioningResources = [
  { id: 1, name: 'AnyConnect Windows 4.10', platform: 'Windows', type: 'AnyConnect', version: '4.10.07061', status: 'Active', lastUpdated: '2026-03-15' },
  { id: 2, name: 'AnyConnect macOS 4.10', platform: 'macOS', type: 'AnyConnect', version: '4.10.07061', status: 'Active', lastUpdated: '2026-03-15' },
  { id: 3, name: 'NAC Agent Windows', platform: 'Windows', type: 'NAC Agent', version: '4.9.6.3', status: 'Active', lastUpdated: '2026-02-20' },
  { id: 4, name: 'Network Setup Assistant (iOS)', platform: 'iOS', type: 'NSA', version: '3.1.0', status: 'Active', lastUpdated: '2026-01-10' },
  { id: 5, name: 'Network Setup Assistant (Android)', platform: 'Android', type: 'NSA', version: '3.1.0', status: 'Active', lastUpdated: '2026-01-10' },
  { id: 6, name: 'Chromebook NSP', platform: 'ChromeOS', type: 'Native Supplicant Profile', version: '1.0', status: 'Active', lastUpdated: '2025-12-05' },
];

export const deploymentNodes = [
  { hostname: 'ise-pan01.corp.local', role: 'Primary Admin (PAN)', persona: 'Admin, Policy Service', status: 'Connected', ip: '10.1.1.10', version: '3.1.0.518', roles: { admin: true, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: false, http: true, radius: true, nmap: false, dns: true, snmpQuery: false, snmpTrap: true, ad: true } },
  { hostname: 'ise-mnt01.corp.local', role: 'Monitoring (MnT)', persona: 'Monitoring', status: 'Connected', ip: '10.1.1.11', version: '3.1.0.518', roles: { admin: false, monitoring: true, policyService: false }, probes: { netflow: false, dhcp: false, dhcpSpan: false, http: false, radius: false, nmap: false, dns: false, snmpQuery: false, snmpTrap: false, ad: false } },
  { hostname: 'ise-psn01.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Connected', ip: '10.1.1.12', version: '3.1.0.518', roles: { admin: false, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: true, http: true, radius: true, nmap: true, dns: true, snmpQuery: true, snmpTrap: true, ad: false } },
  { hostname: 'ise-psn02.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Disconnected', ip: '10.1.1.13', version: '3.1.0.518', roles: { admin: false, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: false, http: true, radius: true, nmap: false, dns: true, snmpQuery: false, snmpTrap: true, ad: false } },
];

export const licenses = [
  { id: 1, type: 'Base', total: 5000, consumed: 3247, status: 'Compliant', expiry: '2027-04-01', description: 'Basic network access and authentication' },
  { id: 2, type: 'Plus', total: 2500, consumed: 1834, status: 'Compliant', expiry: '2027-04-01', description: 'Profiling and context visibility' },
  { id: 3, type: 'Apex', total: 1000, consumed: 456, status: 'Compliant', expiry: '2027-04-01', description: 'Advanced posture and BYOD' },
  { id: 4, type: 'Device Admin', total: 500, consumed: 128, status: 'Compliant', expiry: '2027-04-01', description: 'TACACS+ device administration' },
  { id: 5, type: 'ISE VM', total: 4, consumed: 4, status: 'At Limit', expiry: '2027-04-01', description: 'Virtual machine instance licenses' },
];

export const systemCertificates = [
  { id: 1, friendlyName: 'Default self-signed server certificate', issuedTo: 'ise-pan01.corp.local', issuedBy: 'Cisco ISE Self-Signed CA', validFrom: '2025-01-01', validTo: '2027-01-01', usedBy: 'Admin, EAP, Portal', status: 'Valid' },
  { id: 2, friendlyName: 'EAP Authentication Certificate', issuedTo: 'ise-psn01.corp.local', issuedBy: 'Corporate Root CA', validFrom: '2025-06-01', validTo: '2026-06-01', usedBy: 'EAP Authentication', status: 'Expiring Soon' },
  { id: 3, friendlyName: 'Portal Server Certificate', issuedTo: 'guest.corp.local', issuedBy: 'DigiCert SHA2 CA', validFrom: '2025-03-01', validTo: '2027-03-01', usedBy: 'Portal', status: 'Valid' },
  { id: 4, friendlyName: 'pxGrid Certificate', issuedTo: 'ise-pan01.corp.local', issuedBy: 'Corporate Root CA', validFrom: '2025-01-15', validTo: '2027-01-15', usedBy: 'pxGrid', status: 'Valid' },
];

export const trustedCertificates = [
  { id: 1, friendlyName: 'Corporate Root CA', subject: 'CN=Corp Root CA, O=Corporation', issuedBy: 'Self', validTo: '2035-12-31', status: 'Enabled', trustedFor: 'Infrastructure, Endpoints, Cisco Services' },
  { id: 2, friendlyName: 'DigiCert Global Root CA', subject: 'CN=DigiCert Global Root CA', issuedBy: 'Self', validTo: '2031-11-10', status: 'Enabled', trustedFor: 'Infrastructure, Cisco Services' },
  { id: 3, friendlyName: 'Cisco ISE Self-Signed CA', subject: 'CN=Cisco ISE CA', issuedBy: 'Self', validTo: '2033-01-01', status: 'Enabled', trustedFor: 'Infrastructure' },
  { id: 4, friendlyName: 'VeriSign Universal Root CA', subject: 'CN=VeriSign Universal Root CA', issuedBy: 'Self', validTo: '2037-12-01', status: 'Enabled', trustedFor: 'Infrastructure' },
];

export const adminUsers = [
  { id: 1, name: 'admin', email: 'admin@corp.local', role: 'Super Admin', status: 'Enabled', lastLogin: '2026-04-08 09:00:12', groups: 'Super Admin' },
  { id: 2, name: 'netadmin', email: 'netadmin@corp.local', role: 'Network Admin', status: 'Enabled', lastLogin: '2026-04-07 14:30:45', groups: 'Network Device Admin' },
  { id: 3, name: 'helpdesk', email: 'helpdesk@corp.local', role: 'Helpdesk Admin', status: 'Enabled', lastLogin: '2026-04-08 08:15:00', groups: 'Help Desk Admin' },
  { id: 4, name: 'readonly', email: 'readonly@corp.local', role: 'Read Only Admin', status: 'Enabled', lastLogin: '2026-04-06 11:00:00', groups: 'Read Only Admin' },
  { id: 5, name: 'isebackup', email: 'backup@corp.local', role: 'System Admin', status: 'Disabled', lastLogin: '2026-03-01 02:00:00', groups: 'System Admin' },
];

export const workCenterSections = [
  { id: 'guest', name: 'Guest Access', description: 'Configure guest portals, sponsor groups, and guest policies', icon: 'Users', subItems: ['Portals & Components', 'Settings', 'Reports'] },
  { id: 'byod', name: 'BYOD', description: 'Manage Bring Your Own Device onboarding and native supplicant provisioning', icon: 'Smartphone', subItems: ['BYOD Portal', 'My Devices Portal', 'Settings'] },
  { id: 'device-admin', name: 'Device Administration', description: 'TACACS+ device administration for network equipment', icon: 'Server', subItems: ['Device Admin Policy Sets', 'TACACS Profiles', 'TACACS Command Sets'] },
  { id: 'network-access', name: 'Network Access', description: 'Configure network access policies, policy sets, and conditions', icon: 'Network', subItems: ['Policy Sets', 'Authentication', 'Authorization'] },
  { id: 'posture', name: 'Posture', description: 'Endpoint compliance checks and remediation policies', icon: 'Shield', subItems: ['Posture Policy', 'Posture Elements', 'Client Provisioning'] },
  { id: 'trustsec', name: 'TrustSec', description: 'Software-defined segmentation with Security Group Tags (SGTs)', icon: 'Lock', subItems: ['TrustSec Policy', 'Security Groups', 'IP-SGT Mapping'] },
];
