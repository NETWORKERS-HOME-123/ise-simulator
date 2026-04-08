

# Modal-Level Accuracy Enhancement for Administration & Policy

## Overview
Add detailed configuration modals and drill-down dialogs throughout the Administration and Policy sections to match the real Cisco ISE 3.x GUI at the modal/dialog level. Currently, most items are display-only tables. The real ISE allows clicking any row to open a full configuration form.

## What's Missing (Modal-Level)

### Policy Section

**1. Policy Set Detail Modal** — Clicking a policy set row should open a full-page-style dialog showing:
- Policy set name, description, status toggle
- Embedded Authentication Policy table (rules with conditions, allowed protocols, identity store)
- Embedded Authorization Policy table (rules with conditions, profile, security group)
- "+" buttons to add rules, drag-handle icons for reordering
- Conditions editor showing attribute/operator/value with AND/OR logic

**2. Authorization Profile Detail Modal** — Clicking a profile opens a tabbed dialog:
- **General tab**: Name, description, Access Type (ACCESS_ACCEPT/REJECT), DACL name, VLAN ID/Name, Voice Domain Permission, Web Redirection (type, ACL, portal), Reauthentication (timer, maintain connectivity), Advanced Attributes
- **Common Tasks section**: DACL toggle, VLAN toggle, Voice VLAN, Web Redirection (CWA/NSP/MDM/Client Provisioning), Auto SmartPort, Access Type, Interface Template, ASA VPN, AVC Profile, Airespace ACL
- Attributes Details panel showing RADIUS attribute-value pairs sent to NAD

**3. Condition Studio Modal** — Clicking a condition opens a visual condition builder:
- Drag-and-drop condition blocks with AND/OR/NOT logic
- Attribute browser (Dictionary, Attribute, Operator, Value dropdowns)
- Save As Library Condition option

**4. Profiling Policy Detail Modal** — Click a profiling policy:
- Name, Min Certainty Factor, Parent Policy
- Conditions list with certainty factor per condition
- Associated CoA (Change of Authorization) type
- Exception Action

**5. Client Provisioning Rule Editor** — Click a resource to see configuration:
- Rule name, OS conditions, results (agent package, profile, compliance module)

### Administration Section

**6. Network Device Detail Modal** — Clicking a device row opens a multi-tab dialog:
- **General tab**: Name, Description, IP/Subnet, Device Profile, Network Device Group (Location, Device Type)
- **Authentication Settings tab**: RADIUS Shared Secret, CoA Port (1700/3799), DTLS, KeyWrap settings
- **TACACS+ tab**: Shared Secret, Single Connect toggle, legacy settings
- **SNMP tab**: SNMP version (1/2c/3), Polling interval, Link Trap/MAC Trap query
- **Advanced tab**: TrustSec (device ID, password, environment data download, peer authorization, SGT notifications, OOB TrustSec PAC)

**7. Certificate Detail Modal** — Click any certificate to see:
- Subject, Issuer, Serial Number, Signature Algorithm
- Valid From/To, Key Usage, Extended Key Usage
- Base64-encoded certificate text
- "Renew", "Delete", "Export" buttons

**8. Internal User Detail Modal** — Click a user:
- Username, First/Last Name, Email, Password Change
- Identity Group assignment (dropdown)
- Custom Attributes section (name-value pairs)
- Account disabled toggle, Password Never Expires toggle, Change Password at Next Login

**9. Admin User Detail Modal** — Click admin:
- Username, Password, Admin Groups (multi-select)
- Account Status, Description
- Menu Access (tabs showing which menu items are accessible)

**10. Licensing Detail Panel** — Expand license to show:
- Smart License registration status
- Compliance details per license tier
- Registration token, transport gateway settings
- UDI (Universal Device Identifier) table

**11. Settings Sub-pages** — Break out General Settings into real sub-sections:
- **EAP-TLS Settings**: Session Resume, EAP-TLS Session Timeout
- **RADIUS Settings**: Suppress Anomalous Clients, Detect Anomalous Clients, CoA type
- **Profiler Settings**: CoA Type, Endpoint Attribute Filter
- **Posture Settings**: Posture Lease, Remediation Timer, Default Posture Status
- **pxGrid Settings**: Auto-approve, Certificate-based, Password-based
- **Logging**: Log severity targets, collection filters, remote logging targets

### New Mock Data Required
- RADIUS attribute-value pairs per authorization profile
- TrustSec device settings per network device
- Certificate PEM text blocks
- User custom attributes
- EAP/RADIUS/Profiler/pxGrid settings values

## Technical Approach

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/PolicySetDetailDialog.tsx` | Full policy set editor modal with embedded auth/authz tables |
| `src/components/AuthzProfileDetailDialog.tsx` | Authorization profile config with Common Tasks toggles |
| `src/components/ConditionStudioDialog.tsx` | Visual condition builder with AND/OR blocks |
| `src/components/NetworkDeviceDetailDialog.tsx` | Multi-tab device config (General/RADIUS/TACACS/SNMP/TrustSec) |
| `src/components/CertificateDetailDialog.tsx` | Certificate viewer with PEM display |
| `src/components/UserDetailDialog.tsx` | Internal/Admin user edit form |
| `src/components/ProfilingPolicyDetailDialog.tsx` | Profiling rule detail with certainty factors |

### Files to Modify
| File | Changes |
|------|---------|
| `src/lib/mockData.ts` | Add detailed attributes for auth profiles, RADIUS AVPs, TrustSec settings, cert PEM data |
| `src/pages/Policy.tsx` | Wire click handlers on every table row to open detail dialogs; add inline editing affordances |
| `src/pages/Administration.tsx` | Wire click handlers for network devices, certificates, users; expand Settings into sub-tabs with real ISE setting groups (EAP-TLS, RADIUS, Profiler, pxGrid, Logging) |

### UI Patterns
- All detail modals use `max-w-2xl` or `max-w-3xl` Dialog with internal tab navigation
- Form fields use ISE-style layout: label left (40% width), input right (60% width)
- Toggle switches for boolean settings (matching real ISE checkbox/toggle style)
- "Save" and "Cancel" footer buttons in Cisco blue
- Breadcrumb within dialog header showing context path

