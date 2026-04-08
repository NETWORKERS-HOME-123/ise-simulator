export interface FormFieldHint {
  fieldId: string;
  value: string;
  label: string;
}

export interface LabStep {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  validation: (ctx: any) => boolean;
  route: string;
  navKey?: string;
  highlightSelector: string;
  tooltipText: string;
  formFields?: FormFieldHint[];
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  steps: LabStep[];
}

export const labs: Lab[] = [
  {
    id: 'lab1',
    title: 'Lab 1: 802.1X Wired Authentication',
    description: 'Configure end-to-end 802.1X wired authentication: add a switch, create an internal user, build a policy set with authorization profile, and test authentication.',
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    steps: [
      {
        id: 'lab1-s1',
        title: 'Add a Network Device',
        instruction: 'Navigate to Administration > Network Devices and add a new switch named "LAB-SW-01" with IP "10.10.10.1".',
        hint: 'Click the "+ Add Device" button in the top-right corner of the Network Devices table.',
        validation: (ctx) => ctx.networkDevices.some((d: any) => d.name === 'LAB-SW-01'),
        route: '/administration',
        navKey: 'network-devices',
        highlightSelector: 'add-device-btn',
        tooltipText: 'Click "+ Add Device" to add a new network access device (switch) to ISE.',
        formFields: [
          { fieldId: 'device-name', value: 'LAB-SW-01', label: 'Device Name' },
          { fieldId: 'device-ip', value: '10.10.10.1', label: 'IP Address' },
        ],
      },
      {
        id: 'lab1-s2',
        title: 'Create an Internal User',
        instruction: 'Navigate to Administration > Internal Users and add user "labuser" in the "Employee" identity group.',
        hint: 'Click "+ Add User" button and fill in the username and select Employee group.',
        validation: (ctx) => ctx.internalUsers.some((u: any) => u.name === 'labuser'),
        route: '/administration',
        navKey: 'internal-users',
        highlightSelector: 'add-user-btn',
        tooltipText: 'Click "+ Add User" to create a new internal identity for authentication testing.',
        formFields: [
          { fieldId: 'username', value: 'labuser', label: 'Username' },
          { fieldId: 'identity-group', value: 'Employee', label: 'Identity Group' },
        ],
      },
      {
        id: 'lab1-s3',
        title: 'Create a Policy Set',
        instruction: 'Navigate to Policy > Policy Sets and create a new policy set named "Lab_Wired" with condition "Wired_802.1X".',
        hint: 'Click "+ Add Policy Set" to create a new top-level policy set.',
        validation: (ctx) => ctx.policySets.some((p: any) => p.name === 'Lab_Wired'),
        route: '/policy',
        navKey: 'policy-sets',
        highlightSelector: 'add-policy-btn',
        tooltipText: 'Click "+ Add Policy Set" to define authentication and authorization rules for wired 802.1X.',
        formFields: [
          { fieldId: 'policy-name', value: 'Lab_Wired', label: 'Policy Set Name' },
          { fieldId: 'condition', value: 'Wired_802.1X', label: 'Condition' },
        ],
      },
      {
        id: 'lab1-s4',
        title: 'Create an Authorization Profile',
        instruction: 'Navigate to Policy > Authorization Profiles and create a profile named "Lab_Permit" with access type "ACCESS_ACCEPT".',
        hint: 'Click "+ Add Profile" to create the authorization result returned on successful authentication.',
        validation: (ctx) => ctx.authzProfiles.some((p: any) => p.name === 'Lab_Permit'),
        route: '/policy',
        navKey: 'authz-profiles',
        highlightSelector: 'add-profile-btn',
        tooltipText: 'Click "+ Add Profile" to create an authorization profile that defines what network access is granted.',
        formFields: [
          { fieldId: 'profile-name', value: 'Lab_Permit', label: 'Profile Name' },
          { fieldId: 'access-type', value: 'ACCESS_ACCEPT', label: 'Access Type' },
        ],
      },
      {
        id: 'lab1-s5',
        title: 'Test Authentication',
        instruction: 'Navigate to Operations > Troubleshoot and run a RADIUS auth test with username "labuser" and NAS IP "10.10.10.1".',
        hint: 'Go to the Troubleshoot tab, scroll to RADIUS Authentication Test, fill in credentials and click "Run Test".',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Auth Test') && l.detail.includes('labuser')),
        route: '/operations',
        highlightSelector: 'tab-troubleshoot',
        tooltipText: 'Click the "Troubleshoot" tab to access the RADIUS Authentication Test tool.',
        formFields: [
          { fieldId: 'test-username', value: 'labuser', label: 'Username' },
          { fieldId: 'test-nas-ip', value: '10.10.10.1', label: 'NAS IP' },
        ],
      },
    ],
  },
  {
    id: 'lab2',
    title: 'Lab 2: Guest Access & ANC',
    description: 'Set up guest access by creating a guest user and applying Adaptive Network Control (ANC) quarantine policies.',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab2-s1',
        title: 'Create a Guest User',
        instruction: 'Navigate to Administration > Internal Users and add user "guest_lab" in the "Guest" identity group.',
        hint: 'Click "+ Add User" and select "Guest" as the identity group.',
        validation: (ctx) => ctx.internalUsers.some((u: any) => u.name === 'guest_lab'),
        route: '/administration',
        navKey: 'internal-users',
        highlightSelector: 'add-user-btn',
        tooltipText: 'Click "+ Add User" to create a guest identity account.',
        formFields: [
          { fieldId: 'username', value: 'guest_lab', label: 'Username' },
          { fieldId: 'identity-group', value: 'Guest', label: 'Identity Group' },
        ],
      },
      {
        id: 'lab2-s2',
        title: 'View Guest Portal Configuration',
        instruction: 'Navigate to Work Centers > Guest Access > Portals & Components to see available guest portals.',
        hint: 'Use the left navigation to find Guest Access > Portals & Components.',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Navigated')) || true,
        route: '/work-centers',
        navKey: 'guest-portals',
        highlightSelector: 'nav-guest-portals',
        tooltipText: 'Click "Portals & Components" to view configured guest web portals.',
      },
      {
        id: 'lab2-s3',
        title: 'Apply ANC Quarantine',
        instruction: 'Navigate to Operations > ANC and apply "ANC-Quarantine" policy to any MAC address.',
        hint: 'Click "+ Apply ANC Policy" and enter a MAC address.',
        validation: (ctx) => ctx.ancEndpoints.length > 3,
        route: '/operations',
        highlightSelector: 'tab-anc',
        tooltipText: 'Click the "ANC" tab to manage Adaptive Network Control policies.',
      },
      {
        id: 'lab2-s4',
        title: 'Verify in Context Visibility',
        instruction: 'Navigate to Context Visibility and verify the quarantined endpoint appears in the endpoint table.',
        hint: 'Search for the MAC address you quarantined.',
        validation: (ctx) => ctx.endpoints.length > 0,
        route: '/context-visibility',
        highlightSelector: 'cv-search',
        tooltipText: 'Use the search bar to find the endpoint you quarantined.',
      },
    ],
  },
  {
    id: 'lab3',
    title: 'Lab 3: TrustSec Segmentation',
    description: 'Create Security Group Tags (SGTs), configure downloadable ACLs, and build authorization profiles with TrustSec mappings.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    steps: [
      {
        id: 'lab3-s1',
        title: 'Create a Security Group',
        instruction: 'Navigate to Work Centers > TrustSec > Security Groups and add a new SGT named "Lab_Servers" with tag value 50.',
        hint: 'Click "+ Add SGT" button.',
        validation: (ctx) => ctx.securityGroups.some((sg: any) => sg.name === 'Lab_Servers'),
        route: '/work-centers',
        navKey: 'security-groups',
        highlightSelector: 'add-sgt-btn',
        tooltipText: 'Click "+ Add SGT" to create a new Security Group Tag for network segmentation.',
        formFields: [
          { fieldId: 'sgt-name', value: 'Lab_Servers', label: 'SGT Name' },
          { fieldId: 'sgt-value', value: '50', label: 'Tag Value' },
        ],
      },
      {
        id: 'lab3-s2',
        title: 'Create a DACL',
        instruction: 'Navigate to Policy > Downloadable ACLs and create a new DACL named "ACL-LAB-PERMIT" with content "permit ip any any".',
        hint: 'Click "+ Add DACL" button.',
        validation: (ctx) => ctx.dacls.some((d: any) => d.name === 'ACL-LAB-PERMIT'),
        route: '/policy',
        navKey: 'dacls',
        highlightSelector: 'add-dacl-btn',
        tooltipText: 'Click "+ Add DACL" to create a Downloadable Access Control List.',
        formFields: [
          { fieldId: 'dacl-name', value: 'ACL-LAB-PERMIT', label: 'DACL Name' },
          { fieldId: 'dacl-content', value: 'permit ip any any', label: 'ACE Content' },
        ],
      },
      {
        id: 'lab3-s3',
        title: 'Create Authorization Profile with DACL',
        instruction: 'Navigate to Policy > Authorization Profiles and create "TrustSec_Lab" profile mapping the DACL.',
        hint: 'Click "+ Add Profile" and select the DACL you just created.',
        validation: (ctx) => ctx.authzProfiles.some((p: any) => p.name === 'TrustSec_Lab'),
        route: '/policy',
        navKey: 'authz-profiles',
        highlightSelector: 'add-profile-btn',
        tooltipText: 'Click "+ Add Profile" to create an authorization profile with TrustSec DACL mapping.',
        formFields: [
          { fieldId: 'profile-name', value: 'TrustSec_Lab', label: 'Profile Name' },
        ],
      },
      {
        id: 'lab3-s4',
        title: 'Run Auth Test to Verify',
        instruction: 'Navigate to Operations > Troubleshoot and run an authentication test to verify SGT assignment.',
        hint: 'Use the RADIUS Authentication Test panel.',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Auth Test')),
        route: '/operations',
        highlightSelector: 'tab-troubleshoot',
        tooltipText: 'Click "Troubleshoot" to test authentication and verify TrustSec SGT assignment in the trace.',
      },
    ],
  },
  {
    id: 'lab4',
    title: 'Lab 4: Certificate Management',
    description: 'Explore ISE certificate management: view system certificates, generate a CSR, and review the trusted certificate store.',
    difficulty: 'Intermediate',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab4-s1',
        title: 'View System Certificates',
        instruction: 'Navigate to Administration > Certificates and review the system certificates installed on ISE nodes.',
        hint: 'Click "Certificates" in the left navigation under System.',
        validation: () => true,
        route: '/administration',
        navKey: 'certificates',
        highlightSelector: 'nav-certificates',
        tooltipText: 'Click "Certificates" to view the system certificate store used for EAP-TLS, HTTPS, and pxGrid.',
      },
      {
        id: 'lab4-s2',
        title: 'View CSR Tab',
        instruction: 'Click the "Certificate Signing Requests" tab to see pending CSRs.',
        hint: 'Look at the tab bar at the top of the certificates page.',
        validation: () => true,
        route: '/administration',
        navKey: 'certificates',
        highlightSelector: 'cert-tab-csr',
        tooltipText: 'Click the "Certificate Signing Requests" tab to view and generate CSRs.',
      },
      {
        id: 'lab4-s3',
        title: 'View Trusted Certificates',
        instruction: 'Click the "Trusted Certificates" tab to see the trusted CA store.',
        hint: 'The trusted certificates tab shows external CA certificates imported into ISE.',
        validation: () => true,
        route: '/administration',
        navKey: 'certificates',
        highlightSelector: 'cert-tab-trusted',
        tooltipText: 'Click "Trusted Certificates" to review the CA certificates ISE trusts for EAP-TLS validation.',
      },
    ],
  },
  {
    id: 'lab5',
    title: 'Lab 5: Endpoint Lifecycle',
    description: 'Manage the endpoint lifecycle: manually add an endpoint, apply ANC quarantine via context menu, and delete endpoints.',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab5-s1',
        title: 'Add an Endpoint',
        instruction: 'Navigate to Context Visibility and manually add an endpoint with MAC "AA:BB:CC:DD:EE:FF".',
        hint: 'Click "+ Add Endpoint" button at the top.',
        validation: (ctx) => ctx.endpoints.some((e: any) => e.mac === 'AA:BB:CC:DD:EE:FF'),
        route: '/context-visibility',
        highlightSelector: 'add-endpoint-btn',
        tooltipText: 'Click "+ Add Endpoint" to manually register a new endpoint in the ISE database.',
        formFields: [
          { fieldId: 'mac', value: 'AA:BB:CC:DD:EE:FF', label: 'MAC Address' },
        ],
      },
      {
        id: 'lab5-s2',
        title: 'Apply ANC Quarantine',
        instruction: 'Right-click the endpoint you just added and select "Apply ANC Quarantine".',
        hint: 'Right-click on the row with MAC AA:BB:CC:DD:EE:FF.',
        validation: (ctx) => ctx.ancEndpoints.some((a: any) => a.mac === 'AA:BB:CC:DD:EE:FF'),
        route: '/context-visibility',
        highlightSelector: 'endpoint-table',
        tooltipText: 'Right-click the endpoint row to access the context menu, then select "Apply ANC Quarantine".',
      },
      {
        id: 'lab5-s3',
        title: 'Verify ANC in Operations',
        instruction: 'Navigate to Operations > ANC and verify the endpoint shows as quarantined.',
        hint: 'Look for MAC AA:BB:CC:DD:EE:FF in the ANC table.',
        validation: (ctx) => ctx.ancEndpoints.some((a: any) => a.mac === 'AA:BB:CC:DD:EE:FF'),
        route: '/operations',
        highlightSelector: 'tab-anc',
        tooltipText: 'Click the "ANC" tab to verify the quarantine policy was applied successfully.',
      },
      {
        id: 'lab5-s4',
        title: 'Delete an Endpoint',
        instruction: 'Return to Context Visibility and delete any endpoint from the table.',
        hint: 'Click the trash icon on any endpoint row or use the delete button.',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Deleted Endpoint')),
        route: '/context-visibility',
        highlightSelector: 'endpoint-table',
        tooltipText: 'Click the delete (trash) icon on any endpoint row to remove it from the database.',
      },
    ],
  },
];
