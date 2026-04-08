

# Cisco ISE Dashboard Simulator

## Overview
Build a realistic clone of the Cisco Identity Services Engine (ISE) administration dashboard as an interactive simulator with mock data, mimicking the look and feel of the actual Cisco ISE 2.x/3.x interface.

## Pages & Layout

### Global Shell
- **Top navbar**: Cisco logo (left), navigation tabs (Home, Context Visibility, Operations, Policy, Administration, Work Centers), user menu & settings (right) — dark charcoal/black background with white text
- **Secondary nav bar**: Breadcrumb trail and quick-action icons
- **Cisco ISE branding** with teal/dark theme consistent with Cisco enterprise products

### 1. Home Dashboard (Main Page)
- **Summary bar** at top with colored metric cards: Active Endpoints (orange), Authenticated Guests (green), Profiled Endpoints (blue), each with sparkline charts and 24h trend
- **System Summary panel** (left): CPU, Memory, Authentication Latency gauges with 60m time selector
- **Alarms panel** (center-right): Table with severity icons (info/warning/error), alarm name, occurrences count, last occurred time — rows like "Configuration Changed", "ISE Authentication Inactivity", "DNS Resolution Failure", "NTP Sync Failure"
- **Right sidebar dashlets**: Passed Authentications, Failed Authentications, Distribution by endpoint type
- All dashlets have expand/collapse (+) controls

### 2. Context Visibility Page
- Endpoints list table with columns: MAC Address, IP, Identity Group, Endpoint Profile, Status
- Filter bar and search
- Mock data with realistic network device entries

### 3. Operations > RADIUS > Live Logs
- Real-time log viewer table with: Time, Status (pass/fail icons), Details, Username, Endpoint ID, Identity Group, Server
- Auto-refresh indicator with simulated new entries

### 4. Policy Page (simplified)
- Policy Sets list view with rule names, conditions, and results
- Read-only display of authentication/authorization policies

### 5. Administration Page (simplified)
- System settings view: Deployment nodes table showing PAN, MnT, PSN node roles
- Node status indicators (green/red)

## Interactive Simulator Features
- All navigation tabs are clickable and route between pages
- Dashboard metric values update with randomized mock data on refresh
- Alarms table is sortable and filterable
- Dashlets can be expanded/collapsed
- Simulated "last updated" timestamps
- Toast notifications for simulated system events

## Design System
- **Colors**: Cisco enterprise palette — dark header (#1a1a1a), white content area, teal accents (#049fd9), severity colors (red #cc0000, amber #fbab18, blue #049fd9, green #6cc04a)
- **Typography**: System sans-serif stack mimicking Cisco's CiscoSans feel
- **Tables**: Dense enterprise-style with alternating row shading
- **Cards/Panels**: Light borders, subtle shadows, compact padding
- **Icons**: Lucide icons for severity, status, and navigation

