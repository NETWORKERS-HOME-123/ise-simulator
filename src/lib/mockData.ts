// Mock data generators for Cisco ISE Dashboard

export const generateMacAddress = () => {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
};

export const generateIP = () =>
  `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

// Generate ISE-format session ID: {nas_ip_hex}:{port_hex}/{timestamp_hex}/{seq}
const generateSessionId = (nasIP: string) => {
  const parts = nasIP.split('.').map(p => parseInt(p).toString(16).padStart(2, '0'));
  const nodeHex = parts.join('');
  const portHex = Math.floor(Math.random() * 48).toString(16).padStart(4, '0');
  const tsHex = Math.floor(Date.now() / 1000).toString(16);
  const seq = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${nodeHex}:${portHex}/${tsHex}/${seq}`;
};

const profiles = ['Cisco-Device', 'Apple-MacBook', 'Windows10-Workstation', 'HP-Printer', 'Cisco-IP-Phone', 'Android', 'Linux-Workstation', 'Unknown'];
const identityGroups = ['Employee', 'Guest', 'Contractor', 'BYOD', 'IOT', 'Profiled', 'Unknown'];
const usernames = ['jsmith', 'admin', 'jdoe', 'mwilson', 'agarcia', 'bchen', 'host/DESKTOP-A1B2C3', 'host/LAPTOP-X4Y5Z6', 'guest_user01', 'contractor_01'];
const servers = ['ise-pan01', 'ise-psn01', 'ise-psn02', 'ise-mnt01'];
const nasIPs = ['10.1.100.1', '10.1.100.2', '10.2.200.1', '10.3.50.1', '172.16.1.1'];

// Official ISE 3.3 failure reason codes from message catalog
const failureReasons = [
  '5400 Authentication failed',
  '22056 Subject not found in the applicable identity store(s)',
  '22028 Authentication failed and target identity store is unavailable',
  '12514 EAP-TLS handshake failed',
  '5440 Endpoint abandoned EAP session and started new',
  '5405 RADIUS Request dropped',
  '22040 Wrong password or invalid shared secret',
  '5434 Endpoint conducted several failed authentications of the same scenario',
];

export const generateEndpoints = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    mac: generateMacAddress(),
    ip: generateIP(),
    identityGroup: identityGroups[Math.floor(Math.random() * identityGroups.length)],
    profile: profiles[Math.floor(Math.random() * profiles.length)],
    status: Math.random() > 0.15 ? 'Connected' : 'Disconnected',
    staticAssignment: Math.random() > 0.7,
    firstSeen: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
    lastSeen: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    location: ['Building A - Floor 1', 'Building A - Floor 2', 'Building B', 'Data Center', 'Remote VPN'][Math.floor(Math.random() * 5)],
    nasPort: `GigabitEthernet1/0/${Math.floor(Math.random() * 48)}`,
    authMethod: Math.random() > 0.5 ? '802.1X' : 'MAB',
    os: ['Windows 10', 'macOS 14', 'iOS 17', 'Android 14', 'Linux', 'ChromeOS', 'Unknown'][Math.floor(Math.random() * 7)],
    manufacturer: ['Dell', 'Apple', 'HP', 'Cisco', 'Samsung', 'Lenovo', 'Unknown'][Math.floor(Math.random() * 7)],
  }));

export const generateRadiusLogs = (count: number) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const passed = Math.random() > 0.2;
    const nasIP = nasIPs[Math.floor(Math.random() * nasIPs.length)];
    return {
      id: i + 1,
      time: new Date(now - i * 3000 - Math.random() * 5000).toISOString(),
      status: passed ? 'Pass' : 'Fail',
      detail: passed ? '5200 Authentication succeeded' : failureReasons[Math.floor(Math.random() * failureReasons.length)],
      username: usernames[Math.floor(Math.random() * usernames.length)],
      endpointId: generateMacAddress(),
      identityGroup: identityGroups[Math.floor(Math.random() * identityGroups.length)],
      server: servers[Math.floor(Math.random() * servers.length)],
      nasIP,
      authProtocol: Math.random() > 0.5 ? 'PEAP (EAP-MSCHAPv2)' : 'EAP-TLS',
      policySet: ['Corporate_Wired', 'Corporate_Wireless', 'Guest_Portal', 'VPN_Remote'][Math.floor(Math.random() * 4)],
      authzProfile: ['PermitAccess', 'DenyAccess', 'CWA_Redirect', 'BYOD_Access'][Math.floor(Math.random() * 4)],
      nasPort: `GigabitEthernet1/0/${Math.floor(Math.random() * 48)}`,
      sessionId: generateSessionId(nasIP),
      failureReason: passed ? '' : failureReasons[Math.floor(Math.random() * failureReasons.length)],
    };
  });
};

export const generateLiveSessions = (count: number) => {
  const now = Date.now();
  const authzPolicies = ['PermitAccess', 'BYOD_Access', 'Guest_Access', 'VPN_Full_Access', 'Limited_Access', 'IOT_Restricted'];
  return Array.from({ length: count }, (_, i) => {
    const nasIP = nasIPs[Math.floor(Math.random() * nasIPs.length)];
    return {
      id: i + 1,
      sessionId: generateSessionId(nasIP),
      username: usernames[Math.floor(Math.random() * usernames.length)],
      ip: generateIP(),
      mac: generateMacAddress(),
      nasIP,
      server: servers[Math.floor(Math.random() * servers.length)],
      authzPolicy: authzPolicies[Math.floor(Math.random() * authzPolicies.length)],
      started: new Date(now - Math.floor(Math.random() * 86400000)).toISOString(),
      duration: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      protocol: Math.random() > 0.5 ? 'RADIUS' : '802.1X',
      postureStatus: ['Compliant', 'Non-Compliant', 'Unknown', 'Pending'][Math.floor(Math.random() * 4)],
      securityGroup: ['Employees', 'Guests', 'BYOD_Devices', 'Contractors', 'IOT_Devices'][Math.floor(Math.random() * 5)],
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
  { id: 6, name: 'IOT_Devices', status: 'Monitor Only', conditions: 'MAB', authPolicy: 'Internal Endpoints', authzPolicy: 'IOT_Restricted', hits: 567 },
  { id: 7, name: 'Contractor_Access', status: 'Enabled', conditions: 'Wired_MAB', authPolicy: 'Contractor_DB', authzPolicy: 'Limited_Access', hits: 890 },
  { id: 8, name: 'Default', status: 'Enabled', conditions: 'Default', authPolicy: 'Internal Users', authzPolicy: 'DenyAccess', hits: 245 },
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
  { id: 3, name: 'Cisco_WebAuth', type: 'Standard', description: 'Cisco Web Authentication redirect', accessType: 'ACCESS_ACCEPT', vlan: '', dacl: 'ACL-WEBAUTH-REDIRECT' },
  { id: 4, name: 'Blackhole_Wireless_Access', type: 'Standard', description: 'Blackhole wireless access for blocked devices', accessType: 'ACCESS_ACCEPT', vlan: 'Blackhole_VLAN', dacl: 'ACL-BLACKHOLE' },
  { id: 5, name: 'CWA_Redirect', type: 'Standard', description: 'Central Web Auth redirect for guests', accessType: 'ACCESS_ACCEPT', vlan: 'Guest_VLAN', dacl: 'ACL-WEBAUTH-REDIRECT' },
  { id: 6, name: 'BYOD_Access', type: 'Standard', description: 'BYOD onboarding access with limited scope', accessType: 'ACCESS_ACCEPT', vlan: 'BYOD_VLAN', dacl: 'PERMIT_ALL_IPV4_TRAFFIC' },
  { id: 7, name: 'IOT_Restricted', type: 'Standard', description: 'Restricted access for IoT devices', accessType: 'ACCESS_ACCEPT', vlan: 'IOT_VLAN', dacl: 'ACL-IOT-RESTRICT' },
  { id: 8, name: 'VPN_Full_Access', type: 'Standard', description: 'Full VPN access for remote workers', accessType: 'ACCESS_ACCEPT', vlan: '', dacl: 'PERMIT_ALL_IPV4_TRAFFIC' },
  { id: 9, name: 'Limited_Access', type: 'Standard', description: 'Limited network scope for contractors', accessType: 'ACCESS_ACCEPT', vlan: 'Contractor_VLAN', dacl: 'ACL-CONTRACTOR-LIMITED' },
  { id: 10, name: 'Guest_Access', type: 'Standard', description: 'Internet-only guest access', accessType: 'ACCESS_ACCEPT', vlan: 'Guest_VLAN', dacl: 'ACL-GUEST-INTERNET' },
  { id: 11, name: 'Posture_Remediation', type: 'Standard', description: 'Remediation VLAN for non-compliant', accessType: 'ACCESS_ACCEPT', vlan: 'Remediation_VLAN', dacl: 'ACL-POSTURE-REMEDIATE' },
  { id: 12, name: 'Blackhole_Stolen', type: 'Standard', description: 'Redirect to stolen device notification page', accessType: 'ACCESS_ACCEPT', vlan: 'Blackhole_VLAN', dacl: 'ACL-BLACKHOLE' },
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
  { id: 8, name: 'Xerox-Printer', certainty: 50, matchedEndpoints: 12, conditions: 'OUI STARTS_WITH 00:00:AA', parentPolicy: 'Xerox-Device', status: 'Verified' },
  { id: 9, name: 'Meraki-AP', certainty: 70, matchedEndpoints: 42, conditions: 'OUI STARTS_WITH 00:18:0A', parentPolicy: 'Cisco-Device', status: 'Verified' },
  { id: 10, name: 'Unknown', certainty: 0, matchedEndpoints: 156, conditions: 'No match', parentPolicy: '', status: 'Unknown' },
];

export const clientProvisioningResources = [
  { id: 1, name: 'AnyConnect Windows 4.10', platform: 'Windows', type: 'AnyConnect', version: '4.10.07061', status: 'Active', lastUpdated: '2026-03-15' },
  { id: 2, name: 'AnyConnect macOS 4.10', platform: 'macOS', type: 'AnyConnect', version: '4.10.07061', status: 'Active', lastUpdated: '2026-03-15' },
  { id: 3, name: 'NAC Agent Windows', platform: 'Windows', type: 'NAC Agent', version: '4.9.6.3', status: 'Active', lastUpdated: '2026-02-20' },
  { id: 4, name: 'Network Setup Assistant (iOS)', platform: 'iOS', type: 'NSA', version: '3.1.0', status: 'Active', lastUpdated: '2026-01-10' },
  { id: 5, name: 'Network Setup Assistant (Android)', platform: 'Android', type: 'NSA', version: '3.1.0', status: 'Active', lastUpdated: '2026-01-10' },
  { id: 6, name: 'Chromebook NSP', platform: 'ChromeOS', type: 'Native Supplicant Profile', version: '1.0', status: 'Active', lastUpdated: '2025-12-05' },
  { id: 7, name: 'Windows Supplicant Provisioning Wizard', platform: 'Windows', type: 'SPW', version: '2.2.1', status: 'Active', lastUpdated: '2026-02-01' },
];

export const deploymentNodes = [
  { hostname: 'ise-pan01.corp.local', role: 'Primary Admin (PAN)', persona: 'Admin, Policy Service', status: 'Connected', ip: '10.1.1.10', version: '3.3.0.430', roles: { admin: true, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: false, http: true, radius: true, nmap: false, dns: true, snmpQuery: false, snmpTrap: true, ad: true } },
  { hostname: 'ise-mnt01.corp.local', role: 'Monitoring (MnT)', persona: 'Monitoring', status: 'Connected', ip: '10.1.1.11', version: '3.3.0.430', roles: { admin: false, monitoring: true, policyService: false }, probes: { netflow: false, dhcp: false, dhcpSpan: false, http: false, radius: false, nmap: false, dns: false, snmpQuery: false, snmpTrap: false, ad: false } },
  { hostname: 'ise-psn01.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Connected', ip: '10.1.1.12', version: '3.3.0.430', roles: { admin: false, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: true, http: true, radius: true, nmap: true, dns: true, snmpQuery: true, snmpTrap: true, ad: false } },
  { hostname: 'ise-psn02.corp.local', role: 'Policy Service (PSN)', persona: 'Policy Service', status: 'Disconnected', ip: '10.1.1.13', version: '3.3.0.430', roles: { admin: false, monitoring: false, policyService: true }, probes: { netflow: true, dhcp: true, dhcpSpan: false, http: true, radius: true, nmap: false, dns: true, snmpQuery: false, snmpTrap: true, ad: false } },
];

export const licenses = [
  { id: 1, type: 'Essentials', total: 5000, consumed: 3247, status: 'Compliant', expiry: '2027-04-01', description: 'Basic network access, authentication, 802.1X, Guest' },
  { id: 2, type: 'Advantage', total: 2500, consumed: 1834, status: 'Compliant', expiry: '2027-04-01', description: 'Profiling, context visibility, feed service, BYOD' },
  { id: 3, type: 'Premier', total: 1000, consumed: 456, status: 'Compliant', expiry: '2027-04-01', description: 'Posture, TC-NAC, pxGrid, Passive ID' },
  { id: 4, type: 'Device Admin', total: 500, consumed: 128, status: 'Compliant', expiry: '2027-04-01', description: 'TACACS+ device administration' },
  { id: 5, type: 'ISE VM', total: 4, consumed: 4, status: 'At Limit', expiry: '2027-04-01', description: 'Virtual machine instance licenses' },
];

export const systemCertificates = [
  { id: 1, friendlyName: 'Default self-signed server certificate', issuedTo: 'ise-pan01.corp.local', issuedBy: 'Cisco ISE Self-Signed CA', validFrom: '2025-01-01', validTo: '2027-01-01', usedBy: 'Admin, EAP, Portal', status: 'Valid' },
  { id: 2, friendlyName: 'EAP Authentication Certificate', issuedTo: 'ise-psn01.corp.local', issuedBy: 'Corporate Root CA', validFrom: '2025-06-01', validTo: '2026-06-01', usedBy: 'EAP Authentication', status: 'Expiring Soon' },
  { id: 3, friendlyName: 'Portal Server Certificate', issuedTo: 'guest.corp.local', issuedBy: 'DigiCert SHA2 CA', validFrom: '2025-03-01', validTo: '2027-03-01', usedBy: 'Portal', status: 'Valid' },
  { id: 4, friendlyName: 'pxGrid Certificate', issuedTo: 'ise-pan01.corp.local', issuedBy: 'Corporate Root CA', validFrom: '2025-01-15', validTo: '2027-01-15', usedBy: 'pxGrid', status: 'Valid' },
  { id: 5, friendlyName: 'SAML IdP Certificate', issuedTo: 'idp.corp.local', issuedBy: 'Corporate Root CA', validFrom: '2025-04-01', validTo: '2027-04-01', usedBy: 'SAML', status: 'Valid' },
];

export const trustedCertificates = [
  { id: 1, friendlyName: 'Corporate Root CA', subject: 'CN=Corp Root CA, O=Corporation', issuedBy: 'Self', validTo: '2035-12-31', status: 'Enabled', trustedFor: 'Infrastructure, Endpoints, Cisco Services' },
  { id: 2, friendlyName: 'DigiCert Global Root CA', subject: 'CN=DigiCert Global Root CA', issuedBy: 'Self', validTo: '2031-11-10', status: 'Enabled', trustedFor: 'Infrastructure, Cisco Services' },
  { id: 3, friendlyName: 'Cisco ISE Self-Signed CA', subject: 'CN=Cisco ISE CA', issuedBy: 'Self', validTo: '2033-01-01', status: 'Enabled', trustedFor: 'Infrastructure' },
  { id: 4, friendlyName: 'VeriSign Universal Root CA', subject: 'CN=VeriSign Universal Root CA', issuedBy: 'Self', validTo: '2037-12-01', status: 'Enabled', trustedFor: 'Infrastructure' },
  { id: 5, friendlyName: 'Cisco Manufacturing CA', subject: 'CN=Cisco Manufacturing CA', issuedBy: 'Cisco Root CA 2048', validTo: '2029-05-14', status: 'Enabled', trustedFor: 'Cisco Services, Endpoints' },
  { id: 6, friendlyName: 'Cisco Root CA 2048', subject: 'CN=Cisco Root CA 2048', issuedBy: 'Self', validTo: '2029-05-14', status: 'Enabled', trustedFor: 'Infrastructure, Cisco Services' },
];

export const adminUsers = [
  { id: 1, name: 'admin', email: 'admin@corp.local', role: 'Super Admin', status: 'Enabled', lastLogin: '2026-04-08 09:00:12', groups: 'Super Admin' },
  { id: 2, name: 'netadmin', email: 'netadmin@corp.local', role: 'Network Admin', status: 'Enabled', lastLogin: '2026-04-07 14:30:45', groups: 'Network Device Admin' },
  { id: 3, name: 'helpdesk', email: 'helpdesk@corp.local', role: 'Helpdesk Admin', status: 'Enabled', lastLogin: '2026-04-08 08:15:00', groups: 'Help Desk Admin' },
  { id: 4, name: 'readonly', email: 'readonly@corp.local', role: 'Read Only Admin', status: 'Enabled', lastLogin: '2026-04-06 11:00:00', groups: 'Read Only Admin' },
  { id: 5, name: 'isebackup', email: 'backup@corp.local', role: 'System Admin', status: 'Disabled', lastLogin: '2026-03-01 02:00:00', groups: 'System Admin' },
];

export const networkDevices = [
  { id: 1, name: 'SW-CORE-01', ip: '10.1.100.1', type: 'Cisco Catalyst 9300', location: 'Building A', ndg: 'All Device Types#Switch', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: true, snmpRO: 'public' },
  { id: 2, name: 'SW-ACCESS-01', ip: '10.1.100.2', type: 'Cisco Catalyst 9200', location: 'Building A - Floor 1', ndg: 'All Device Types#Switch', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: true, snmpRO: 'public' },
  { id: 3, name: 'WLC-01', ip: '10.2.200.1', type: 'Cisco 9800 WLC', location: 'Data Center', ndg: 'All Device Types#Wireless Controller', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: false, snmpRO: 'public' },
  { id: 4, name: 'FW-EDGE-01', ip: '10.3.50.1', type: 'Cisco ASA 5525-X', location: 'Data Center', ndg: 'All Device Types#Firewall', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: false, snmpRO: 'ciscoRO' },
  { id: 5, name: 'VPN-CONC-01', ip: '172.16.1.1', type: 'Cisco FTD 2110', location: 'DMZ', ndg: 'All Device Types#VPN', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: false, snmpRO: 'public' },
  { id: 6, name: 'SW-ACCESS-02', ip: '10.1.100.3', type: 'Cisco Catalyst 3850', location: 'Building B', ndg: 'All Device Types#Switch', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: true, snmpRO: 'public' },
  { id: 7, name: 'AP-BLDG-A-01', ip: '10.1.100.50', type: 'Cisco Aironet 3802i', location: 'Building A - Floor 1', ndg: 'All Device Types#Access Point', profile: 'Cisco', status: 'Active', radiusSharedSecret: '●●●●●●●●', tacacs: false, snmpRO: 'public' },
];

export const networkDeviceGroups = [
  { id: 1, name: 'All Device Types', type: 'Device Type', children: ['Switch', 'Wireless Controller', 'Firewall', 'VPN', 'Access Point', 'Router'] },
  { id: 2, name: 'All Locations', type: 'Location', children: ['Building A', 'Building B', 'Data Center', 'DMZ', 'Remote'] },
  { id: 3, name: 'IPSEC', type: 'IPSEC', children: ['Yes', 'No'] },
];

export const internalUsers = [
  { id: 1, name: 'jsmith', firstName: 'John', lastName: 'Smith', email: 'jsmith@corp.local', identityGroup: 'Employee', status: 'Enabled', lastPasswordChange: '2026-03-15' },
  { id: 2, name: 'jdoe', firstName: 'Jane', lastName: 'Doe', email: 'jdoe@corp.local', identityGroup: 'Employee', status: 'Enabled', lastPasswordChange: '2026-03-20' },
  { id: 3, name: 'mwilson', firstName: 'Mike', lastName: 'Wilson', email: 'mwilson@corp.local', identityGroup: 'Employee', status: 'Enabled', lastPasswordChange: '2026-02-28' },
  { id: 4, name: 'agarcia', firstName: 'Ana', lastName: 'Garcia', email: 'agarcia@corp.local', identityGroup: 'Employee', status: 'Enabled', lastPasswordChange: '2026-03-01' },
  { id: 5, name: 'bchen', firstName: 'Brian', lastName: 'Chen', email: 'bchen@corp.local', identityGroup: 'Employee', status: 'Enabled', lastPasswordChange: '2026-03-10' },
  { id: 6, name: 'guest_user01', firstName: 'Guest', lastName: 'User', email: 'guest@corp.local', identityGroup: 'Guest', status: 'Enabled', lastPasswordChange: '2026-04-01' },
  { id: 7, name: 'contractor_01', firstName: 'Contract', lastName: 'Worker', email: 'contractor@vendor.com', identityGroup: 'Contractor', status: 'Enabled', lastPasswordChange: '2026-03-25' },
];

export const identityGroupsList = [
  { id: 1, name: 'Employee', description: 'Corporate employees with full access', members: 2847 },
  { id: 2, name: 'Guest', description: 'Temporary guest users with internet-only access', members: 83 },
  { id: 3, name: 'Contractor', description: 'External contractors with limited access', members: 45 },
  { id: 4, name: 'BYOD', description: 'Bring Your Own Device registered endpoints', members: 312 },
  { id: 5, name: 'IOT', description: 'Internet of Things devices', members: 189 },
  { id: 6, name: 'Profiled', description: 'Automatically profiled devices', members: 567 },
  { id: 7, name: 'Unknown', description: 'Unidentified endpoints', members: 156 },
  { id: 8, name: 'Blacklist', description: 'Blocked/stolen devices', members: 3 },
];

export const externalIdentitySources = [
  { id: 1, name: 'corp.local', type: 'Active Directory', status: 'Connected', joinPoint: 'ise-pan01.corp.local', domain: 'corp.local', users: 4521, groups: 87 },
  { id: 2, name: 'LDAP-HQ', type: 'LDAP', status: 'Connected', joinPoint: 'ldap.corp.local:636', domain: 'dc=corp,dc=local', users: 4521, groups: 45 },
  { id: 3, name: 'RSA-SecurID', type: 'RSA SecurID', status: 'Connected', joinPoint: '10.1.1.50', domain: '', users: 1200, groups: 0 },
  { id: 4, name: 'SAML-Azure', type: 'SAML IdP', status: 'Active', joinPoint: 'login.microsoftonline.com', domain: 'corp.onmicrosoft.com', users: 0, groups: 0 },
];

export const reportCategories = [
  { name: 'Authentication Summary', description: 'Summary of RADIUS authentication activity', lastRun: '2026-04-08 09:00', records: 14523 },
  { name: 'Top Authentications by User', description: 'Most active users by authentication count', lastRun: '2026-04-08 09:00', records: 250 },
  { name: 'Failed Authentications', description: 'All failed RADIUS authentication attempts', lastRun: '2026-04-08 08:30', records: 342 },
  { name: 'Endpoint Profiling', description: 'Endpoint profiler activity and changes', lastRun: '2026-04-08 07:00', records: 1892 },
  { name: 'Guest Access', description: 'Guest portal usage and sponsor activity', lastRun: '2026-04-08 06:00', records: 83 },
  { name: 'TACACS+ Accounting', description: 'Device administration session accounting', lastRun: '2026-04-07 23:00', records: 456 },
  { name: 'Adaptive Network Control', description: 'ANC policy application and quarantine actions', lastRun: '2026-04-08 09:15', records: 12 },
  { name: 'System Diagnostics', description: 'ISE node health and performance metrics', lastRun: '2026-04-08 09:10', records: 96 },
  { name: 'Change Configuration Audit', description: 'Admin configuration change history', lastRun: '2026-04-08 08:55', records: 34 },
  { name: 'Posture Assessment', description: 'Endpoint compliance check results', lastRun: '2026-04-08 08:00', records: 567 },
];

export const ancEndpoints = [
  { id: 1, mac: 'AA:BB:CC:11:22:33', ip: '10.1.50.101', policy: 'ANC-Quarantine', status: 'Quarantined', appliedBy: 'admin', appliedAt: '2026-04-08 08:30:00', reason: 'Suspicious activity detected' },
  { id: 2, mac: 'DD:EE:FF:44:55:66', ip: '10.1.50.102', policy: 'ANC-Shutdown', status: 'Port Shutdown', appliedBy: 'admin', appliedAt: '2026-04-07 16:00:00', reason: 'Stolen device reported' },
  { id: 3, mac: '11:22:33:AA:BB:CC', ip: '10.2.100.55', policy: 'ANC-Quarantine', status: 'Quarantined', appliedBy: 'netadmin', appliedAt: '2026-04-08 09:10:00', reason: 'Malware detected by endpoint protection' },
];

export const workCenterSections = [
  { id: 'network-access', name: 'Network Access', description: 'Configure network access policies, policy sets, and conditions', icon: 'Network', subItems: ['Overview', 'Policy Sets', 'Ext RADIUS Servers', 'External ID Sources', 'Network Devices'] },
  { id: 'guest', name: 'Guest Access', description: 'Configure guest portals, sponsor groups, and guest policies', icon: 'Users', subItems: ['Overview', 'Portals & Components', 'Settings', 'Reports'] },
  { id: 'trustsec', name: 'TrustSec', description: 'Software-defined segmentation with Security Group Tags (SGTs)', icon: 'Lock', subItems: ['Overview', 'Components', 'TrustSec Policy', 'Settings'] },
  { id: 'byod', name: 'BYOD', description: 'Manage Bring Your Own Device onboarding and native supplicant provisioning', icon: 'Smartphone', subItems: ['Overview', 'Portals & Components', 'Settings'] },
  { id: 'device-admin', name: 'Device Administration', description: 'TACACS+ device administration for network equipment', icon: 'Server', subItems: ['Overview', 'Device Admin Policy Sets', 'Policy Elements', 'Network Resources', 'Reports', 'Settings'] },
  { id: 'posture', name: 'Posture', description: 'Endpoint compliance checks and remediation policies', icon: 'Shield', subItems: ['Overview', 'Policy Elements', 'Posture Policy', 'Client Provisioning', 'Settings'] },
];

export const tacacsProfiles = [
  { id: 1, name: 'Shell_Admin', description: 'Full shell access with privilege 15', protocol: 'TACACS+', privilege: 15, status: 'Enabled' },
  { id: 2, name: 'Shell_ReadOnly', description: 'Read-only shell access with privilege 1', protocol: 'TACACS+', privilege: 1, status: 'Enabled' },
  { id: 3, name: 'Shell_Monitor', description: 'Show commands only with privilege 5', protocol: 'TACACS+', privilege: 5, status: 'Enabled' },
];

export const tacacsCommandSets = [
  { id: 1, name: 'PermitAll', description: 'Permits all commands', commands: 'permit .* .*', status: 'Enabled' },
  { id: 2, name: 'ShowOnly', description: 'Only show and display commands', commands: 'permit show .*, permit display .*', status: 'Enabled' },
  { id: 3, name: 'DenyConfig', description: 'Deny all configuration commands', commands: 'deny configure .*', status: 'Enabled' },
];

export const securityGroups = [
  { id: 1, name: 'Employees', tag: 4, description: 'Corporate employees', icon: '🏢', learned: false },
  { id: 2, name: 'Guests', tag: 6, description: 'Guest users', icon: '👤', learned: false },
  { id: 3, name: 'BYOD_Devices', tag: 7, description: 'BYOD registered devices', icon: '📱', learned: false },
  { id: 4, name: 'Contractors', tag: 8, description: 'External contractors', icon: '🔧', learned: false },
  { id: 5, name: 'IOT_Devices', tag: 10, description: 'IoT devices', icon: '📡', learned: false },
  { id: 6, name: 'Servers', tag: 11, description: 'Data center servers', icon: '🖥️', learned: false },
  { id: 7, name: 'Network_Devices', tag: 2, description: 'Switches, routers, APs', icon: '🌐', learned: false },
  { id: 8, name: 'TrustSec_Devices', tag: 3, description: 'TrustSec capable devices', icon: '🔒', learned: true },
  { id: 9, name: 'VPN_Users', tag: 12, description: 'Remote VPN users', icon: '🔗', learned: false },
  { id: 10, name: 'Quarantine', tag: 255, description: 'Quarantined endpoints', icon: '⚠️', learned: false },
];

export const posturePolicies = [
  { id: 1, name: 'Windows_AV_Check', os: 'Windows All', condition: 'AntiVirus Installed AND AntiVirus Definition Date < 3 days', remediationAction: 'Windows_AV_Remediation', status: 'Enabled' },
  { id: 2, name: 'Windows_Firewall', os: 'Windows All', condition: 'Windows Firewall Enabled', remediationAction: 'Enable_Firewall_Remediation', status: 'Enabled' },
  { id: 3, name: 'macOS_FileVault', os: 'macOS All', condition: 'FileVault Encryption Enabled', remediationAction: 'macOS_Encryption_Remediation', status: 'Enabled' },
  { id: 4, name: 'Windows_Patches', os: 'Windows 10/11', condition: 'Critical patches installed within 30 days', remediationAction: 'Windows_Update_Remediation', status: 'Enabled' },
  { id: 5, name: 'USB_Storage', os: 'Windows All', condition: 'USB Mass Storage Disabled', remediationAction: 'USB_Block_Remediation', status: 'Disabled' },
];

export const guestPortals = [
  { id: 1, name: 'Hotspot Portal', type: 'Hotspot', url: 'https://guest.corp.local:8443/hotspot', status: 'Active', theme: 'Default', authMethod: 'None (AUP only)' },
  { id: 2, name: 'Sponsored Guest Portal', type: 'Sponsored', url: 'https://guest.corp.local:8443/sponsored', status: 'Active', theme: 'Corporate', authMethod: 'Sponsor Approval' },
  { id: 3, name: 'Self-Registration Portal', type: 'Self-Registration', url: 'https://guest.corp.local:8443/self-reg', status: 'Active', theme: 'Corporate', authMethod: 'Self-Registration + SMS' },
  { id: 4, name: 'BYOD Portal', type: 'BYOD', url: 'https://guest.corp.local:8443/byod', status: 'Active', theme: 'Corporate', authMethod: 'Employee Credentials' },
];

export const sponsorGroups = [
  { id: 1, name: 'ALL_ACCOUNTS', description: 'Can create all guest account types', members: 15, guestTypes: ['Contractor', 'Daily', 'Weekly'] },
  { id: 2, name: 'GROUP_ACCOUNTS', description: 'Can only create group guest accounts', members: 5, guestTypes: ['Daily', 'Weekly'] },
  { id: 3, name: 'OWN_ACCOUNTS', description: 'Can only manage own guest accounts', members: 45, guestTypes: ['Daily'] },
];
