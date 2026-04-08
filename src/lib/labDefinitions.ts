export interface LabStep {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  validation: (ctx: any) => boolean;
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
    title: 'Lab 1: Basic 802.1X Setup',
    description: 'Configure a basic 802.1X wired authentication environment — add a switch, create a policy set, and test authentication.',
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    steps: [
      {
        id: 'lab1-s1',
        title: 'Add a Network Device',
        instruction: 'Navigate to Administration > Network Devices and add a new switch with name "LAB-SW-01", IP "10.10.10.1".',
        hint: 'Click "+ Add Device" button and fill in the form.',
        validation: (ctx) => ctx.networkDevices.some((d: any) => d.name === 'LAB-SW-01'),
      },
      {
        id: 'lab1-s2',
        title: 'Create a Policy Set',
        instruction: 'Navigate to Policy > Policy Sets and create a new policy set named "Lab_Wired" with condition "Wired_802.1X".',
        hint: 'Click "+ Add Policy Set" and configure the name and condition.',
        validation: (ctx) => ctx.policySets.some((p: any) => p.name === 'Lab_Wired'),
      },
      {
        id: 'lab1-s3',
        title: 'Create an Internal User',
        instruction: 'Navigate to Administration > Internal Users and add user "labuser" in the "Employee" identity group.',
        hint: 'Click "+ Add User" button.',
        validation: (ctx) => ctx.internalUsers.some((u: any) => u.name === 'labuser'),
      },
      {
        id: 'lab1-s4',
        title: 'Test Authentication',
        instruction: 'Navigate to Operations > Troubleshoot and run a RADIUS auth test with username "labuser" and NAS IP "10.10.10.1".',
        hint: 'Use the "Test Authentication" panel and click "Run Test".',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Auth Test') && l.detail.includes('labuser')),
      },
    ],
  },
  {
    id: 'lab2',
    title: 'Lab 2: Guest Access Configuration',
    description: 'Set up guest access with a self-registered guest portal and configure ANC policies for quarantine.',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab2-s1',
        title: 'Create a Guest User',
        instruction: 'Navigate to Administration > Internal Users and add user "guest_lab" in the "Guest" identity group.',
        hint: 'Click "+ Add User" and select "Guest" as identity group.',
        validation: (ctx) => ctx.internalUsers.some((u: any) => u.name === 'guest_lab'),
      },
      {
        id: 'lab2-s2',
        title: 'Apply ANC Quarantine',
        instruction: 'Navigate to Operations > ANC and apply "ANC-Quarantine" policy to any MAC address.',
        hint: 'Click "+ Apply ANC Policy" and enter a MAC address.',
        validation: (ctx) => ctx.ancEndpoints.length > 3,
      },
    ],
  },
  {
    id: 'lab3',
    title: 'Lab 3: TrustSec Segmentation',
    description: 'Create Security Group Tags, configure IP-SGT mappings, and understand the egress policy matrix.',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    steps: [
      {
        id: 'lab3-s1',
        title: 'Create a Security Group',
        instruction: 'Navigate to Work Centers > TrustSec > Security Groups and add a new SGT named "Lab_Servers" with tag value 50.',
        hint: 'Click "+ Add SGT" button.',
        validation: (ctx) => ctx.securityGroups.some((sg: any) => sg.name === 'Lab_Servers'),
      },
      {
        id: 'lab3-s2',
        title: 'Create a DACL',
        instruction: 'Navigate to Policy > Downloadable ACLs and create a new DACL named "ACL-LAB-PERMIT" with content "permit ip any any".',
        hint: 'Click "+ Add DACL" button.',
        validation: (ctx) => ctx.dacls.some((d: any) => d.name === 'ACL-LAB-PERMIT'),
      },
    ],
  },
  {
    id: 'lab4',
    title: 'Lab 4: Authorization Profiles',
    description: 'Create custom authorization profiles with VLAN assignment and DACL mapping.',
    difficulty: 'Intermediate',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab4-s1',
        title: 'Create an Authorization Profile',
        instruction: 'Navigate to Policy > Authorization Profiles and create a profile named "Lab_Permit" with access type "ACCESS_ACCEPT".',
        hint: 'Click "+ Add Profile" button.',
        validation: (ctx) => ctx.authzProfiles.some((p: any) => p.name === 'Lab_Permit'),
      },
    ],
  },
  {
    id: 'lab5',
    title: 'Lab 5: Endpoint Management',
    description: 'Manually add an endpoint, apply ANC policy, and verify in Context Visibility.',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    steps: [
      {
        id: 'lab5-s1',
        title: 'Add an Endpoint',
        instruction: 'Navigate to Context Visibility and manually add an endpoint with MAC "AA:BB:CC:DD:EE:FF".',
        hint: 'Click "+ Add Endpoint" button.',
        validation: (ctx) => ctx.endpoints.some((e: any) => e.mac === 'AA:BB:CC:DD:EE:FF'),
      },
      {
        id: 'lab5-s2',
        title: 'Delete an Endpoint',
        instruction: 'Delete any endpoint from the Context Visibility table.',
        hint: 'Right-click an endpoint or use the delete button.',
        validation: (ctx) => ctx.simulationLogs.some((l: any) => l.action.includes('Deleted Endpoint')),
      },
    ],
  },
];
