

# Cisco ISE Dashboard — Missing Features Plan

Based on the video walkthrough of Cisco ISE 2.x UI, the following features and sub-pages are missing from the current implementation.

## What's Missing

### 1. Operations — Live Sessions sub-page
The video shows **Live Sessions** alongside Live Logs under Operations > RADIUS. Currently we only have Live Logs.
- Add `/operations/live-sessions` route showing active sessions table: Username, IP, MAC, Session ID, Session Duration, NAS IP, Authorization Policy
- Add sub-navigation tabs (Live Logs | Live Sessions) within the Operations page

### 2. Operations — Troubleshooting sub-page
- Add `/operations/troubleshoot` with a diagnostic tools panel (Session Trace, TCP Dump simulator, RADIUS test)

### 3. Policy — Sub-pages (Authentication, Authorization, Policy Elements)
The video walks through multiple Policy sub-sections:
- **Authentication Policies** tab — rules with allowed protocols and identity stores
- **Authorization Policies** tab — "if X then Y" rules with conditions and authorization profiles
- **Policy Elements** section with sub-tabs:
  - **Results > Authorization Profiles** — list of profiles (PermitAccess, CWA_Redirect, DenyAccess, BYOD_Onboard, etc.)
  - **Conditions** — reusable condition library
  - **Dictionaries** — RADIUS attribute dictionaries
- **Profiling Policies** — device profiling rules (Cisco-IP-Phone, Apple-MacBook, etc.)
- **Client Provisioning** — supplicant provisioning wizard list (Windows, Android, iOS, Mac, Chromebook NSP)
- Add left sidebar navigation within the Policy page for these sub-sections

### 4. Administration — Full sub-page tree
The video covers extensive Administration sub-menus:
- **System > Deployment** (exists, but needs node detail dialog with role checkboxes, profiling probe settings: NetFlow, DHCP, DHCP SPAN, HTTP, RADIUS, NMAP, DNS, AD, SNMP — with toggles)
- **System > Licensing** — Base/Plus/Apex/Device Admin license table with counts and status
- **System > Certificates** — sub-tabs: System Certificates, Trusted Certificates, Certificate Authority, Certificate Signing Requests
- **System > Settings** — general settings panel
- **Admin Access > Administrators > Admin Users** — admin user management table with Add dialog
- **PAN Failover** toggle and status display within Deployment
- Add left sidebar navigation within Administration for these sub-sections

### 5. Work Centers nav tab
The video mentions Work Centers as a top-level nav item. Add it to the header and create a page with placeholder sub-sections (Guest Access, BYOD, Device Administration, Network Access, Posture, TrustSec).

### 6. Node Detail Dialog (Deployment)
Clicking a node in the deployment table should open a detail panel/dialog showing:
- Node hostname, IP, roles (Admin, Monitoring, Policy Service checkboxes)
- Profiling configuration section with toggle probes (NetFlow, DHCP, HTTP, RADIUS, NMAP, DNS, AD, SNMP)
- Save button

## Technical Approach

- **Routing**: Add nested routes under `/operations/*`, `/policy/*`, `/administration/*`, `/work-centers`
- **Left sidebar navigation**: Policy and Administration pages get an ISE-style left sidebar with collapsible menu sections
- **Mock data**: Extend `mockData.ts` with live sessions, authorization profiles, certificates, licenses, admin users, profiling policies, client provisioning data
- **Components**: Create reusable `ISELeftNav` sidebar component for sub-page navigation
- **Dialogs**: Use existing shadcn Dialog for node detail view and Add Admin User form

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/mockData.ts` | Add mock data for sessions, auth profiles, certificates, licenses, admin users, profiling policies |
| `src/components/ISELeftNav.tsx` | New — reusable left sidebar for sub-page navigation |
| `src/pages/Operations.tsx` | Refactor to tabbed layout (Live Logs / Live Sessions / Troubleshoot) |
| `src/pages/Policy.tsx` | Full rewrite with left nav and sub-pages (Policy Sets, Auth, Authz, Elements, Profiling, Client Provisioning) |
| `src/pages/Administration.tsx` | Full rewrite with left nav and sub-pages (Deployment w/ node dialog, Licensing, Certificates, Admin Users) |
| `src/pages/WorkCenters.tsx` | New — placeholder page with sub-section cards |
| `src/components/NodeDetailDialog.tsx` | New — deployment node detail with profiling probes |
| `src/components/CiscoHeader.tsx` | Add Work Centers tab |
| `src/App.tsx` | Add Work Centers route |

