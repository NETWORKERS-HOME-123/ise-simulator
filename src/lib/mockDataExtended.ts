// Extended mock data for modal-level detail dialogs

// RADIUS Attribute-Value Pairs per authorization profile
export const authzProfileDetails: Record<string, {
  description: string;
  accessType: string;
  vlan: string;
  dacl: string;
  voiceDomainPermission: boolean;
  webRedirection: { type: string; acl: string; portal: string } | null;
  reauthTimer: number;
  maintainConnectivity: boolean;
  autoSmartPort: string;
  interfaceTemplate: string;
  asaVpn: string;
  avcProfile: string;
  airespacACL: string;
  radiusAVPs: { attribute: string; type: string; value: string }[];
}> = {
  PermitAccess: {
    description: 'Permits full network access',
    accessType: 'ACCESS_ACCEPT',
    vlan: '',
    dacl: '',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 0,
    maintainConnectivity: false,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
    ],
  },
  DenyAccess: {
    description: 'Denies all network access',
    accessType: 'ACCESS_REJECT',
    vlan: '',
    dacl: '',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 0,
    maintainConnectivity: false,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_REJECT' },
    ],
  },
  CWA_Redirect: {
    description: 'Central Web Auth redirect for guests',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'Guest_VLAN (100)',
    dacl: 'ACL-WEBAUTH-REDIRECT',
    voiceDomainPermission: false,
    webRedirection: { type: 'Centralized Web Auth', acl: 'ACL-WEBAUTH-REDIRECT', portal: 'Hotspot Portal' },
    reauthTimer: 3600,
    maintainConnectivity: true,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect-acl=ACL-WEBAUTH-REDIRECT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect=https://ise-psn01.corp.local:8443/portal/gateway?sessionId=SessionIdValue&portal=27b1…' },
      { attribute: 'Tunnel-Type', type: 'IETF', value: 'VLAN (13)' },
      { attribute: 'Tunnel-Medium-Type', type: 'IETF', value: '802 (6)' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '100' },
    ],
  },
  BYOD_Access: {
    description: 'BYOD onboarding access with limited scope',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'BYOD_VLAN (200)',
    dacl: 'PERMIT_ALL_IPV4_TRAFFIC',
    voiceDomainPermission: false,
    webRedirection: { type: 'Native Supplicant Provisioning', acl: 'ACL-NSP-REDIRECT', portal: 'BYOD Portal' },
    reauthTimer: 7200,
    maintainConnectivity: true,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect-acl=ACL-NSP-REDIRECT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect=https://ise-psn01.corp.local:8443/portal/gateway?sessionId=SessionIdValue&portal=byod…' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '200' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'PERMIT_ALL_IPV4_TRAFFIC.in' },
    ],
  },
  IOT_Restricted: {
    description: 'Restricted access for IoT devices',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'IOT_VLAN (300)',
    dacl: 'ACL-IOT-RESTRICT',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 1800,
    maintainConnectivity: false,
    autoSmartPort: 'IOT_DEVICE',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'ACL-IOT-RESTRICT.in' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '300' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'auto-smart-port=IOT_DEVICE' },
    ],
  },
  VPN_Full_Access: {
    description: 'Full VPN access for remote workers',
    accessType: 'ACCESS_ACCEPT',
    vlan: '',
    dacl: 'PERMIT_ALL_IPV4_TRAFFIC',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 28800,
    maintainConnectivity: true,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: 'Full_VPN_Tunnel_Group',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'PERMIT_ALL_IPV4_TRAFFIC.in' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'profile-name=Full_VPN_Tunnel_Group' },
      { attribute: 'Class', type: 'IETF', value: 'CACS:0A010164000000…:ise-psn01/396594388/85' },
    ],
  },
  Limited_Access: {
    description: 'Limited network scope for contractors',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'Contractor_VLAN (400)',
    dacl: 'ACL-CONTRACTOR-LIMITED',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 3600,
    maintainConnectivity: false,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'ACL-CONTRACTOR-LIMITED.in' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '400' },
    ],
  },
  Guest_Access: {
    description: 'Internet-only guest access',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'Guest_VLAN (100)',
    dacl: 'ACL-GUEST-INTERNET',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 3600,
    maintainConnectivity: true,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'ACL-GUEST-INTERNET.in' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '100' },
      { attribute: 'Session-Timeout', type: 'IETF', value: '3600' },
    ],
  },
  Posture_Remediation: {
    description: 'Remediation VLAN for non-compliant',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'Remediation_VLAN (500)',
    dacl: 'ACL-POSTURE-REMEDIATE',
    voiceDomainPermission: false,
    webRedirection: { type: 'Client Provisioning (Posture)', acl: 'ACL-POSTURE-REDIRECT', portal: 'Client Provisioning Portal' },
    reauthTimer: 300,
    maintainConnectivity: true,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect-acl=ACL-POSTURE-REDIRECT' },
      { attribute: 'cisco-av-pair', type: 'Cisco', value: 'url-redirect=https://ise-psn01.corp.local:8443/portal/gateway?sessionId=SessionIdValue&portal=posture…' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '500' },
    ],
  },
  Blackhole_Stolen: {
    description: 'Redirect to stolen device notification page',
    accessType: 'ACCESS_ACCEPT',
    vlan: 'Blackhole_VLAN (999)',
    dacl: 'ACL-BLACKHOLE',
    voiceDomainPermission: false,
    webRedirection: null,
    reauthTimer: 0,
    maintainConnectivity: false,
    autoSmartPort: '',
    interfaceTemplate: '',
    asaVpn: '',
    avcProfile: '',
    airespacACL: '',
    radiusAVPs: [
      { attribute: 'Access-Type', type: 'IETF', value: 'ACCESS_ACCEPT' },
      { attribute: 'Filter-Id', type: 'IETF', value: 'ACL-BLACKHOLE.in' },
      { attribute: 'Tunnel-Private-Group-ID', type: 'IETF', value: '999' },
    ],
  },
};

// Network device extended details
export const networkDeviceDetails: Record<string, {
  description: string;
  deviceProfile: string;
  ndgLocation: string;
  ndgDeviceType: string;
  radiusCoAPort: number;
  radiusDTLS: boolean;
  radiusKeyWrap: boolean;
  tacacsSharedSecret: string;
  tacacsSingleConnect: boolean;
  tacacsLegacy: boolean;
  snmpVersion: string;
  snmpPollingInterval: number;
  snmpLinkTrap: boolean;
  snmpMacTrap: boolean;
  trustsecDeviceId: string;
  trustsecPassword: string;
  trustsecEnvDataDownload: boolean;
  trustsecPeerAuth: string;
  trustsecSgtNotify: boolean;
  trustsecPAC: boolean;
}> = {
  'SW-CORE-01': {
    description: 'Core switch for Building A',
    deviceProfile: 'Cisco',
    ndgLocation: 'All Locations#Building A',
    ndgDeviceType: 'All Device Types#Switch',
    radiusCoAPort: 1700,
    radiusDTLS: false,
    radiusKeyWrap: false,
    tacacsSharedSecret: '●●●●●●●●',
    tacacsSingleConnect: true,
    tacacsLegacy: false,
    snmpVersion: '2c',
    snmpPollingInterval: 3600,
    snmpLinkTrap: true,
    snmpMacTrap: true,
    trustsecDeviceId: 'SW-CORE-01',
    trustsecPassword: '●●●●●●●●',
    trustsecEnvDataDownload: true,
    trustsecPeerAuth: 'Policy',
    trustsecSgtNotify: true,
    trustsecPAC: true,
  },
  'SW-ACCESS-01': {
    description: 'Access switch Floor 1 Building A',
    deviceProfile: 'Cisco',
    ndgLocation: 'All Locations#Building A',
    ndgDeviceType: 'All Device Types#Switch',
    radiusCoAPort: 1700,
    radiusDTLS: false,
    radiusKeyWrap: false,
    tacacsSharedSecret: '●●●●●●●●',
    tacacsSingleConnect: true,
    tacacsLegacy: false,
    snmpVersion: '2c',
    snmpPollingInterval: 3600,
    snmpLinkTrap: true,
    snmpMacTrap: true,
    trustsecDeviceId: 'SW-ACCESS-01',
    trustsecPassword: '●●●●●●●●',
    trustsecEnvDataDownload: true,
    trustsecPeerAuth: 'Policy',
    trustsecSgtNotify: true,
    trustsecPAC: false,
  },
  'WLC-01': {
    description: 'Wireless LAN Controller - Data Center',
    deviceProfile: 'Cisco',
    ndgLocation: 'All Locations#Data Center',
    ndgDeviceType: 'All Device Types#Wireless Controller',
    radiusCoAPort: 3799,
    radiusDTLS: true,
    radiusKeyWrap: false,
    tacacsSharedSecret: '',
    tacacsSingleConnect: false,
    tacacsLegacy: false,
    snmpVersion: '2c',
    snmpPollingInterval: 1800,
    snmpLinkTrap: false,
    snmpMacTrap: false,
    trustsecDeviceId: '',
    trustsecPassword: '',
    trustsecEnvDataDownload: false,
    trustsecPeerAuth: 'None',
    trustsecSgtNotify: false,
    trustsecPAC: false,
  },
  'FW-EDGE-01': {
    description: 'Edge firewall - Data Center perimeter',
    deviceProfile: 'Cisco',
    ndgLocation: 'All Locations#Data Center',
    ndgDeviceType: 'All Device Types#Firewall',
    radiusCoAPort: 1700,
    radiusDTLS: false,
    radiusKeyWrap: false,
    tacacsSharedSecret: '',
    tacacsSingleConnect: false,
    tacacsLegacy: false,
    snmpVersion: '3',
    snmpPollingInterval: 900,
    snmpLinkTrap: true,
    snmpMacTrap: false,
    trustsecDeviceId: '',
    trustsecPassword: '',
    trustsecEnvDataDownload: false,
    trustsecPeerAuth: 'None',
    trustsecSgtNotify: false,
    trustsecPAC: false,
  },
  'VPN-CONC-01': {
    description: 'VPN concentrator in DMZ',
    deviceProfile: 'Cisco',
    ndgLocation: 'All Locations#DMZ',
    ndgDeviceType: 'All Device Types#VPN',
    radiusCoAPort: 1700,
    radiusDTLS: false,
    radiusKeyWrap: false,
    tacacsSharedSecret: '',
    tacacsSingleConnect: false,
    tacacsLegacy: false,
    snmpVersion: '2c',
    snmpPollingInterval: 3600,
    snmpLinkTrap: false,
    snmpMacTrap: false,
    trustsecDeviceId: '',
    trustsecPassword: '',
    trustsecEnvDataDownload: false,
    trustsecPeerAuth: 'None',
    trustsecSgtNotify: false,
    trustsecPAC: false,
  },
};

// Certificate PEM blocks
export const certificatePEMData: Record<string, {
  serialNumber: string;
  signatureAlgorithm: string;
  keyUsage: string;
  extKeyUsage: string;
  subjectAltName: string;
  pem: string;
}> = {
  'Default self-signed server certificate': {
    serialNumber: '01:A3:4B:5C:6D:7E:8F:90',
    signatureAlgorithm: 'SHA-256 with RSA Encryption',
    keyUsage: 'Digital Signature, Key Encipherment',
    extKeyUsage: 'Server Authentication, Client Authentication',
    subjectAltName: 'DNS:ise-pan01.corp.local, IP:10.1.1.10',
    pem: `-----BEGIN CERTIFICATE-----
MIIDrzCCApegAwIBAgIIAaM7XG1+j5AwDQYJKoZIhvcNAQELBQAwUjELMAkGA1UE
BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExDjAMBgNVBAcMBVNhbkpvc2UxDj
AMBgNVBAoMBUNpc2NvMQ4wDAYDVQQDDAVJU0UgQ0EwHhcNMjUwMTAxMDAwMDAw
WhcNMjcwMTAxMDAwMDAwWjBdMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZv
cm5pYTEOMAwGA1UEBwwFU2FuSm9zZTEOMAwGA1UECgwFQ2lzY28xGTAXBgNVBAMM
EGlzZS1wYW4wMS5jb3JwLmxvY2FsMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
-----END CERTIFICATE-----`,
  },
  'EAP Authentication Certificate': {
    serialNumber: '02:B4:C5:D6:E7:F8:09:1A',
    signatureAlgorithm: 'SHA-256 with RSA Encryption',
    keyUsage: 'Digital Signature, Key Encipherment',
    extKeyUsage: 'Server Authentication',
    subjectAltName: 'DNS:ise-psn01.corp.local',
    pem: `-----BEGIN CERTIFICATE-----
MIIEBTCCAu2gAwIBAgIIArTF1uf4CRowDQYJKoZIhvcNAQELBQAwRjELMAkGA1UE
BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExDjAMBgNVBAoMBUNvcnAxEjAQBgNV
BAMMCUNvcnAgUm9vdCBDQTAeFw0yNTA2MDEwMDAwMDBaFw0yNjA2MDEwMDAwMDBa
MF0xCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMQ4wDAYDVQQHDAVT
YW5Kb3NlMQ4wDAYDVQQKDAVDaXNjbzEZMBcGA1UEAwwQaXNlLXBzbjAxLmNv...
-----END CERTIFICATE-----`,
  },
};

// Internal user extended details
export const internalUserDetails: Record<string, {
  passwordNeverExpires: boolean;
  changePasswordNextLogin: boolean;
  accountDisabled: boolean;
  customAttributes: { name: string; value: string }[];
  description: string;
}> = {
  jsmith: {
    passwordNeverExpires: false,
    changePasswordNextLogin: false,
    accountDisabled: false,
    customAttributes: [
      { name: 'Department', value: 'Engineering' },
      { name: 'EmployeeID', value: 'EMP-10045' },
      { name: 'CostCenter', value: 'CC-200' },
    ],
    description: 'Senior network engineer',
  },
  jdoe: {
    passwordNeverExpires: false,
    changePasswordNextLogin: false,
    accountDisabled: false,
    customAttributes: [
      { name: 'Department', value: 'IT Security' },
      { name: 'EmployeeID', value: 'EMP-10078' },
    ],
    description: 'Security analyst',
  },
  mwilson: {
    passwordNeverExpires: true,
    changePasswordNextLogin: false,
    accountDisabled: false,
    customAttributes: [
      { name: 'Department', value: 'Operations' },
      { name: 'EmployeeID', value: 'EMP-10112' },
    ],
    description: 'NOC team lead',
  },
  guest_user01: {
    passwordNeverExpires: false,
    changePasswordNextLogin: true,
    accountDisabled: false,
    customAttributes: [],
    description: 'Temporary guest user',
  },
  contractor_01: {
    passwordNeverExpires: false,
    changePasswordNextLogin: false,
    accountDisabled: false,
    customAttributes: [
      { name: 'Company', value: 'Acme Consulting' },
      { name: 'ContractEnd', value: '2026-06-30' },
    ],
    description: 'External contractor',
  },
};

// Admin user extended details
export const adminUserDetails: Record<string, {
  description: string;
  adminGroups: string[];
  menuAccess: { menu: string; access: boolean }[];
}> = {
  admin: {
    description: 'Primary super administrator',
    adminGroups: ['Super Admin'],
    menuAccess: [
      { menu: 'Home', access: true },
      { menu: 'Context Visibility', access: true },
      { menu: 'Operations', access: true },
      { menu: 'Policy', access: true },
      { menu: 'Administration', access: true },
      { menu: 'Work Centers', access: true },
    ],
  },
  netadmin: {
    description: 'Network device administrator',
    adminGroups: ['Network Device Admin'],
    menuAccess: [
      { menu: 'Home', access: true },
      { menu: 'Context Visibility', access: true },
      { menu: 'Operations', access: true },
      { menu: 'Policy', access: false },
      { menu: 'Administration', access: true },
      { menu: 'Work Centers', access: false },
    ],
  },
  helpdesk: {
    description: 'Help desk support user',
    adminGroups: ['Help Desk Admin'],
    menuAccess: [
      { menu: 'Home', access: true },
      { menu: 'Context Visibility', access: true },
      { menu: 'Operations', access: true },
      { menu: 'Policy', access: false },
      { menu: 'Administration', access: false },
      { menu: 'Work Centers', access: false },
    ],
  },
  readonly: {
    description: 'Read-only monitoring account',
    adminGroups: ['Read Only Admin'],
    menuAccess: [
      { menu: 'Home', access: true },
      { menu: 'Context Visibility', access: true },
      { menu: 'Operations', access: true },
      { menu: 'Policy', access: true },
      { menu: 'Administration', access: true },
      { menu: 'Work Centers', access: true },
    ],
  },
};

// Profiling policy extended details
export const profilingPolicyDetails: Record<string, {
  description: string;
  minCertainty: number;
  parentPolicy: string;
  coaType: string;
  exceptionAction: string;
  conditions: { attribute: string; operator: string; value: string; certainty: number }[];
}> = {
  'Cisco-IP-Phone': {
    description: 'Identifies Cisco IP phones using CDP, DHCP, and OUI data',
    minCertainty: 70,
    parentPolicy: 'Cisco-Device',
    coaType: 'Port Bounce',
    exceptionAction: 'None',
    conditions: [
      { attribute: 'CDP:Platform', operator: 'CONTAINS', value: 'Cisco IP Phone', certainty: 40 },
      { attribute: 'DHCP:Class-Identifier', operator: 'STARTS_WITH', value: 'Cisco Systems, Inc. IP Phone', certainty: 30 },
      { attribute: 'OUI', operator: 'EQUALS', value: '00:1B:D4 (Cisco)', certainty: 10 },
      { attribute: 'LLDP:SystemDescription', operator: 'CONTAINS', value: 'Cisco IP Phone', certainty: 40 },
    ],
  },
  'Apple-MacBook': {
    description: 'Identifies Apple MacBook devices',
    minCertainty: 40,
    parentPolicy: 'Apple-Device',
    coaType: 'Reauth',
    exceptionAction: 'None',
    conditions: [
      { attribute: 'DHCP:host-name', operator: 'CONTAINS', value: 'Mac', certainty: 10 },
      { attribute: 'OUI', operator: 'EQUALS', value: '3C:22:FB (Apple)', certainty: 10 },
      { attribute: 'HTTP:User-Agent', operator: 'CONTAINS', value: 'Macintosh', certainty: 20 },
      { attribute: 'DHCP:Class-Identifier', operator: 'STARTS_WITH', value: 'Mac OS X', certainty: 20 },
    ],
  },
  'Windows10-Workstation': {
    description: 'Identifies Windows 10/11 workstations',
    minCertainty: 30,
    parentPolicy: 'Microsoft-Workstation',
    coaType: 'Reauth',
    exceptionAction: 'None',
    conditions: [
      { attribute: 'DHCP:Class-Identifier', operator: 'CONTAINS', value: 'MSFT 5.0', certainty: 20 },
      { attribute: 'HTTP:User-Agent', operator: 'CONTAINS', value: 'Windows NT 10', certainty: 20 },
      { attribute: 'DHCP:host-name', operator: 'MATCHES', value: 'DESKTOP-.*|LAPTOP-.*', certainty: 10 },
    ],
  },
  'HP-Printer': {
    description: 'Identifies HP printers via OUI and SNMP',
    minCertainty: 70,
    parentPolicy: 'HP-Device',
    coaType: 'No CoA',
    exceptionAction: 'None',
    conditions: [
      { attribute: 'OUI', operator: 'STARTS_WITH', value: '00:1A:4B', certainty: 10 },
      { attribute: 'SNMP:sysDescr', operator: 'CONTAINS', value: 'HP ETHERNET', certainty: 30 },
      { attribute: 'DHCP:host-name', operator: 'CONTAINS', value: 'HP', certainty: 10 },
      { attribute: 'HTTP:User-Agent', operator: 'CONTAINS', value: 'HP HTTP Server', certainty: 30 },
    ],
  },
};

// System settings for sub-tabs
export const systemSettings = {
  eapTls: {
    sessionResume: true,
    sessionTimeout: 7200,
    eapTlsCACert: 'Corporate Root CA',
    ocspEnabled: true,
    crlEnabled: true,
    crlUrl: 'http://crl.corp.local/crl.pem',
  },
  radius: {
    suppressAnomalousClients: true,
    detectAnomalousClients: true,
    coaType: 'RADIUS CoA (RFC 5176)',
    requestTimeout: 5,
    maxRetries: 3,
    suppressRepeatedFailedClients: true,
    suppressDuration: 600,
  },
  profiler: {
    coaType: 'Reauth',
    endpointAttributeFilter: true,
    profilingDelayOnCoA: 3,
    nmap: {
      enabled: true,
      scanSubnets: '10.1.0.0/16, 10.2.0.0/16',
      skipNmapScanForKnown: true,
    },
  },
  posture: {
    postureLease: 7,
    remediationTimer: 4,
    defaultPostureStatus: 'Non-Compliant',
    continuousMonitoring: true,
    acceptableUsePolicyEnabled: true,
    stealthMode: false,
  },
  pxGrid: {
    autoApprove: false,
    certificateBased: true,
    passwordBased: false,
    pxGridNode: 'ise-pan01.corp.local',
    status: 'Running',
  },
  logging: {
    targets: [
      { name: 'Local Store', type: 'Local', severity: 'INFO', status: 'Enabled' },
      { name: 'syslog-01.corp.local', type: 'Remote Syslog', severity: 'WARN', status: 'Enabled' },
      { name: 'syslog-02.corp.local', type: 'Remote Syslog', severity: 'ERROR', status: 'Enabled' },
    ],
    collectionFilters: [
      { name: 'Passed Authentications', enabled: true },
      { name: 'Failed Authentications', enabled: true },
      { name: 'RADIUS Accounting', enabled: true },
      { name: 'RADIUS Diagnostics', enabled: false },
      { name: 'System Diagnostics', enabled: true },
      { name: 'Administrative and Operational Audit', enabled: true },
    ],
  },
};

// Licensing extended details
export const licensingDetails = {
  smartLicense: {
    registrationStatus: 'Registered',
    accountName: 'CORP-Smart-Account',
    virtualAccount: 'ISE-Production',
    transportType: 'Direct (HTTPS)',
    transportUrl: 'https://tools.cisco.com/its/service/oddce/services/DDCEService',
    lastRenewal: '2026-03-01',
    nextRenewal: '2026-09-01',
    registrationToken: 'YjM2Zjk0ZDktN2M4…',
  },
  udi: [
    { pid: 'ISE-VM-K9', serialNumber: 'ISE-VM-01A3B5C7', hostname: 'ise-pan01.corp.local' },
    { pid: 'ISE-VM-K9', serialNumber: 'ISE-VM-02D4E6F8', hostname: 'ise-mnt01.corp.local' },
    { pid: 'ISE-VM-K9', serialNumber: 'ISE-VM-03G9H0I1', hostname: 'ise-psn01.corp.local' },
    { pid: 'ISE-VM-K9', serialNumber: 'ISE-VM-04J2K3L4', hostname: 'ise-psn02.corp.local' },
  ],
};

// Client provisioning rule details
export const clientProvisioningRuleDetails: Record<string, {
  description: string;
  osConditions: string[];
  agentPackage: string;
  profile: string;
  complianceModule: string;
}> = {
  'AnyConnect Windows 4.10': {
    description: 'Cisco AnyConnect Secure Mobility Client for Windows',
    osConditions: ['Windows 10 (All)', 'Windows 11 (All)'],
    agentPackage: 'AnyConnectDesktop-win-4.10.07061-webdeploy-k9.pkg',
    profile: 'AC_Win_Profile',
    complianceModule: 'AnyConnectComplianceModule-4.3.2233.6001-win-k9.cab',
  },
  'AnyConnect macOS 4.10': {
    description: 'Cisco AnyConnect Secure Mobility Client for macOS',
    osConditions: ['macOS 12 (Monterey)', 'macOS 13 (Ventura)', 'macOS 14 (Sonoma)'],
    agentPackage: 'AnyConnectDesktop-macos-4.10.07061-webdeploy-k9.dmg',
    profile: 'AC_Mac_Profile',
    complianceModule: 'AnyConnectComplianceModule-4.3.2233.6001-mac-k9.dmg',
  },
  'NAC Agent Windows': {
    description: 'Cisco NAC Agent for posture assessment',
    osConditions: ['Windows 10 (All)'],
    agentPackage: 'CiscoNACAgent-4.9.6.3-win-webdeploy.exe',
    profile: 'NAC_Agent_Profile',
    complianceModule: 'NAC_Compliance_Module-4.9.6.3.cab',
  },
};
