

# Factual Accuracy Audit & Corrections Plan

## Research Sources Used
- **Official**: Cisco ISE 3.3 Administrator Guide (all 16 chapters) — cisco.com/c/en/us/td/docs/security/ise/3-3/admin_guide/
- **Chapters reviewed**: Overview, Licensing, Deployment, Basic Setup, Maintain & Monitor, Device Administration, Guest & Secure WiFi, Asset Visibility, BYOD, Secure Access, Segmentation, Compliance, Threat Containment, Cisco pxGrid, Integration, Troubleshoot
- **Cross-referenced**: Network Device Definition Settings, RADIUS/TACACS/SNMP field tables, Authorization Profile Common Tasks, DACL configuration, Policy Set structure, Conditions Studio

---

## CRITICAL INACCURACIES FOUND

### 1. Navigation Structure is Wrong

**Real ISE 3.3 top navigation**: Home | Context Visibility | Operations | Policy | Administration | **Work Centers** (contains sub-menus)

The current simulator has the correct top tabs. However, the **left navigation menus within each section** have significant structural errors:

**Policy page — wrong structure:**
- Current: Separate nav sections for "Authentication", "Authorization", "Policy Elements"
- **Real ISE**: Policy > Policy Sets (clicking into a policy set reveals embedded Authentication and Authorization tables). There are NO separate "Authentication Policies" or "Authorization Policies" top-level nav items. The left nav is:
  - Policy Sets
  - Policy Elements > Results > Authorization > Authorization Profiles
  - Policy Elements > Results > Authorization > Downloadable ACLs  
  - Policy Elements > Conditions > Library Conditions
  - Policy Elements > Dictionaries > System / User / RADIUS Vendor
  - Policy Elements > Results > Authentication > Allowed Protocols
  - Profiling > Profiling Policies
  - Client Provisioning > Resources

**Administration page — wrong hierarchy:**
- Current: "System Configuration" with SMTP/NTP/ERS is a separate section
- **Real ISE**: Administration left nav is:
  - System > Deployment / Licensing / Certificates / Logging / Maintenance (Backup, Restore, Repository, Patch) / Settings
  - Identity Management > Identity Source Sequences / Internal Users / External Identity Sources / Identity Groups / Settings
  - Network Resources > Network Devices / Network Device Groups / External RADIUS Servers / RADIUS Server Sequences / NAC Managers / Network Device Profiles
  - Device Administration > (link to Work Centers)
  - pxGrid Services > (link to pxGrid)
  - System > Admin Access > Administrators / Admin Groups / Authentication / Authorization
  - System > Settings > SMTP Server / Repository / Alarm Settings / General / Proxy

**Work Centers page — wrong sections:**
- Current: Guest Access, BYOD, Device Administration, Posture, TrustSec, Network Access
- **Real ISE Work Centers**: Each Work Center is its own sub-menu system:
  - Network Access > Overview / Policy Sets / Ext RADIUS Servers / External ID Sources / Network Devices
  - Guest Access > Overview / Portals & Components / Settings / Reports
  - TrustSec > Overview / Components (SGTs, SGACLs, IP-SGT, SXP) / TrustSec Policy (Egress, Matrix) / Settings
  - BYOD > Overview / Portals & Components / Settings
  - Device Administration > Overview / Policy Sets / Policy Elements / Network Resources / Reports / Settings
  - Posture > Overview / Policy Elements (Conditions, Requirements, Remediations) / Posture Policy / Client Provisioning / Settings

### 2. Network Device Fields — Missing Official Fields

Per Cisco documentation, the Network Device form has these exact fields the current `NetworkDeviceDetailDialog.tsx` may be missing or labeling incorrectly:
- **General**: Name, Description, IP Address/IP Range (with exclude), Device Profile (vendor dropdown), Model Name, Software Version, Network Device Group (Location + IPSEC + Device Type)
- **RADIUS**: Protocol, Shared Secret, Use Second Shared Secret, CoA Port (default from device profile), RADIUS DTLS (DTLS Required, Shared Secret, CoA Port, Issuer CA, DNS Name), Enable KeyWrap, Key Encryption Key, Message Authenticator Code Key, Key Input Format (ASCII/Hex)
- **TACACS+**: Shared Secret, Retired Shared Secret, Retire button, Remaining Retired Period, Enable Single Connect Mode (Legacy/Draft Compliance)
- **SNMP**: SNMP Version (1/2c/3), SNMP RO Community (v1/v2c), Username/Security Level/Auth Protocol/Auth Password/Privacy Protocol/Privacy Password (v3), Polling Interval, Link Trap Query, Mac Trap Query, Originating PSN

### 3. Authorization Profile Common Tasks — Incomplete

Per official doc, the Common Tasks section should include:
- DACL Name (IPv4 checkbox + dropdown)
- IPv6 DACL Name (separate checkbox)
- ACL (Filter-ID) with IPv4/IPv6 variants
- Airespace ACL Name / Airespace IPv6 ACL Name
- VLAN (ID/Name with Tag)
- Voice Domain Permission
- Web Redirection (type: CWA/MDM/NSP/Client Provisioning + Static IP/FQDN + ACL + Portal)
- Auto SmartPort
- Access Type (ACCESS_ACCEPT)
- Interface Template
- ASA VPN
- Reauthentication (Timer + Connectivity: Default/RADIUS-Request)
- MACSec Policy
- NEAT
- Web Authentication (Local Web Auth)
- Airespace Wireless Multicast
- AVC Profile

### 4. DACL Default Profiles Wrong

Per official doc, default DACLs are:
- DENY_ALL_IPV4_TRAFFIC
- PERMIT_ALL_IPV4_TRAFFIC
- DENY_ALL_IPV6_TRAFFIC
- PERMIT_ALL_IPV6_TRAFFIC

The current mock data may not match these exact names and the DACL editor should have an IP Version field (IPv4/IPv6/Agnostic) and a "Check DACL Syntax" button.

### 5. Operations > Live Logs Structure Wrong

Per official doc, the correct menu paths are:
- Operations > RADIUS > Live Logs (not just "Live Logs")
- Operations > RADIUS > Live Sessions
- Operations > TACACS > Live Logs
- Operations > Reports > (categories)
- Operations > Troubleshoot > Diagnostic Tools > General Tools
- Operations > Troubleshoot > Download Logs

### 6. Policy Set Status Values Incomplete

Per official documentation, Policy Set status can be:
- **Enabled**: Active policy
- **Disabled**: Inactive, will not be evaluated
- **Monitor Only**: Evaluated but NOT enforced, results visible in Live Log

The current simulator may be missing "Monitor Only" mode.

### 7. Failure Reason Codes Non-Standard

The current mock data uses failure reason codes like "24408 User not found" — these are close but need verification against official ISE message catalogs. Real ISE uses 5-digit message codes like:
- 5400 Authentication failed
- 5405 RADIUS Request dropped
- 5440 Endpoint is not an active directory member
- 22056 Subject not found in the applicable identity store(s)
- 24408 is NOT a real ISE code

---

## IMPLEMENTATION PLAN

### Phase 1: Fix Navigation Structure (Critical — Affects Training Muscle Memory)

**1a. Fix Policy Page Left Nav**
- Remove separate "Authentication" and "Authorization" sections
- Restructure to match real ISE:

```text
Policy Sets
Policy Elements
  ├── Results
  │   ├── Authorization Profiles
  │   ├── Downloadable ACLs
  │   └── Allowed Protocols
  ├── Conditions
  │   ├── Library Conditions
  │   └── Time & Date Conditions
  └── Dictionaries
      ├── System
      ├── User
      └── RADIUS Vendor
Profiling
  └── Profiling Policies
Client Provisioning
  └── Resources
```

**1b. Fix Administration Page Left Nav**
- Restructure to match real ISE hierarchy with correct groupings
- Move SMTP/NTP under System > Settings
- Add Admin Access sub-section under System
- Rename sections to match official labels exactly

**1c. Fix Work Centers Page Structure**
- Each Work Center should mirror the real sub-nav (Overview / Policy Elements / Policy / Settings / Reports)

**1d. Fix Operations Page Tabs**
- Change from flat tabs to proper structure: RADIUS > Live Logs, RADIUS > Live Sessions, TACACS > Live Logs, Reports, Troubleshoot

### Phase 2: Fix Field-Level Accuracy

**2a. Network Device Detail Dialog**
- Add missing fields: IP Range option, Device Profile vendor dropdown, Model Name, Software Version, Use Second Shared Secret, RADIUS DTLS section, KeyWrap settings, TACACS Retire mechanism, Enable Single Connect Mode, SNMP v3 full settings (Security Level, Auth/Privacy Protocol)
- Fix field labels to match official documentation exactly

**2b. Authorization Profile Dialog**
- Add missing Common Tasks: ACL (Filter-ID) IPv4/IPv6, Airespace ACL, MACSec Policy, NEAT, Interface Template, ASA VPN, AVC Profile, Web Authentication
- Add IPv6 DACL Name as separate option
- Fix "Attributes Details" panel to show computed RADIUS AVPs dynamically

**2c. DACL Editor**
- Add IP Version selector (IPv4/IPv6/Agnostic)
- Fix default DACL names to exact Cisco names
- Add "Check DACL Syntax" validation button

**2d. Policy Set Detail Dialog**
- Add "Monitor Only" status option
- Fix authorization rule columns to show: Status, Rule Name, Conditions, Results (Profiles), Results (Security Groups), Hits, Actions

### Phase 3: Fix Mock Data Accuracy

**3a. Fix Failure Reason Codes**
- Replace fake codes with real ISE message codes from the official message catalog
- Key codes: 5400, 5405, 5412, 5434, 5440, 12002, 12013, 12014, 12015, 22028, 22040, 22056, 24408 (verify each)

**3b. Fix Default Profile/Policy Names**
- Default DACLs: DENY_ALL_IPV4_TRAFFIC, PERMIT_ALL_IPV4_TRAFFIC, DENY_ALL_IPV6_TRAFFIC, PERMIT_ALL_IPV6_TRAFFIC
- Default Authorization Profiles: PermitAccess, DenyAccess, Cisco_WebAuth, Blackhole_Wireless_Access
- Default Policy Set: "Default" (always last, cannot be deleted)

**3c. Fix Session ID Format**
- Real ISE session IDs follow format: `0a{node_hex}:{port_hex}/{timestamp_hex}/session_seq` 
- Current random format is not realistic

---

## FILES TO MODIFY

| File | Changes |
|------|---------|
| `src/pages/Policy.tsx` | Restructure left nav sections to match real ISE; remove separate Auth/Authz sections |
| `src/pages/Administration.tsx` | Restructure left nav; move SMTP/NTP under Settings; add Admin Access sub-section |
| `src/pages/WorkCenters.tsx` | Restructure each Work Center with proper sub-nav matching real ISE |
| `src/pages/Operations.tsx` | Restructure tabs to RADIUS/TACACS/Reports/Troubleshoot hierarchy |
| `src/components/NetworkDeviceDetailDialog.tsx` | Add all missing fields per official documentation |
| `src/components/AuthzProfileDetailDialog.tsx` | Add missing Common Tasks (ACL, Airespace, MACSec, NEAT, etc.) |
| `src/components/DACLEditorDialog.tsx` | Add IP Version, fix defaults, add syntax check |
| `src/components/PolicySetDetailDialog.tsx` | Add Monitor Only status, fix column structure |
| `src/lib/mockData.ts` | Fix failure codes, session ID format, default names |
| `src/lib/mockDataGap.ts` | Fix DACL defaults, add missing message codes |
| `src/lib/authSimulator.ts` | Use correct ISE message codes in trace output |

## IMPLEMENTATION ORDER
1. Navigation structure fixes (Policy, Administration, Work Centers, Operations)
2. Network Device dialog field corrections
3. Authorization Profile dialog field corrections
4. DACL editor corrections
5. Mock data accuracy (failure codes, session IDs, default names)
6. Auth simulator trace output corrections

