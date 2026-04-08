

# Interactive Training Simulation Enhancement Plan

## Purpose
Transform the current Cisco ISE simulator from a display-oriented demo into a fully interactive training tool where students can perform hands-on labs — creating, editing, deleting, and testing configurations with realistic feedback loops.

---

## What's Missing for Training

Currently, most features are **read-only displays** with static mock data. Students can click rows to view details but cannot:
- Create new objects from scratch (devices, users, policies, endpoints)
- Delete items with confirmation workflows
- See cause-and-effect (e.g., "I changed a policy, now this endpoint gets denied")
- Follow guided lab exercises
- Search/filter consistently across all pages
- Get validation errors on bad input

---

## Implementation Plan

### 1. Global State Management with CRUD Operations
**Problem**: All data is imported as constants from mock files — nothing persists across interactions.

**Solution**: Create a `src/context/ISESimulationContext.tsx` React context that:
- Loads all mock data into `useState` on mount
- Exposes `add`, `update`, `delete` functions for every entity type (network devices, users, policy sets, endpoints, certificates, ACLs, etc.)
- Wraps the app so all pages share live state
- Shows toast confirmations on every mutation

**Files**: Create `src/context/ISESimulationContext.tsx`, modify `src/App.tsx` to wrap with provider, update all pages to use context instead of direct imports.

### 2. Add/Create Dialogs for Every Entity
**Problem**: "Add" buttons exist on some pages but most just show `toast.info("New rule added")` without actually creating anything.

**Solution**: Build functional "Add New" dialogs for:
- **Network Device**: Form with Name, IP, RADIUS secret, device type, location — adds to device table
- **Internal User**: Username, password, email, identity group — adds to users table
- **Policy Set**: Name, conditions, status — adds to policy sets and becomes clickable
- **Authorization Profile**: Name, access type, DACL, VLAN — adds to profiles
- **DACL**: Name, ACE content editor — adds to DACL list
- **Endpoint (manual)**: MAC, IP, profile, identity group — adds to Context Visibility
- **Certificate Signing Request**: CN, SAN, key size — generates mock CSR
- **ANC Policy application**: Already partially works, enhance with validation

Each dialog validates inputs (e.g., MAC format, IP format, required fields) and shows inline error messages.

**Files**: Create `src/components/AddEntityDialog.tsx` (generic reusable form dialog), modify each page to wire "Add" buttons.

### 3. Delete with Confirmation Dialogs
**Problem**: No delete functionality anywhere.

**Solution**: Add delete buttons (trash icon) to table rows and inside detail dialogs. Each triggers an AlertDialog:
- "Are you sure you want to delete network device 'SW-ACCESS-01'?"
- "This action cannot be undone."
- Red "Delete" button, gray "Cancel" button
- On confirm: remove from context state, show `toast.success("Deleted")`

**Files**: Create `src/components/ConfirmDeleteDialog.tsx`, add delete icons to table rows in Policy.tsx, Administration.tsx, WorkCenters.tsx.

### 4. Authentication Simulation Engine
**Problem**: Session trace shows hardcoded output. No cause-and-effect between policies and auth results.

**Solution**: Build a `src/lib/authSimulator.ts` that:
- Takes input: username, MAC, NAS IP, auth method
- Walks through policy sets in order (from context state)
- Matches conditions against input
- Returns step-by-step trace showing which policy matched, which auth profile applied, pass/fail reason
- If user modifies a policy (e.g., disables a rule), the simulator reflects that

Wire this into:
- Operations > Troubleshoot > Session Trace (replaces hardcoded output)
- Operations > RADIUS Auth Test (currently no-op)
- A new "Test Authentication" button inside Policy Set detail dialog

**Files**: Create `src/lib/authSimulator.ts`, modify `src/pages/Operations.tsx` troubleshoot section.

### 5. Guided Lab Mode with Step-by-Step Exercises
**Problem**: Students don't know what to do — no guided path.

**Solution**: Create `src/components/LabGuidePanel.tsx` — a slide-out panel with pre-built lab exercises:

**Lab 1: Basic 802.1X Setup**
- Step 1: Navigate to Administration > Network Devices > Add a switch (name, IP, secret)
- Step 2: Navigate to Policy > Policy Sets > Create a new policy set for Wired
- Step 3: Add an authentication rule using EAP-TLS
- Step 4: Add an authorization rule mapping to PermitAccess
- Step 5: Go to Operations > Troubleshoot > Test authentication
- Each step has a "Check" button that validates the student completed it

**Lab 2: Guest Access Configuration**
- Configure a guest portal, create a sponsor group, test guest login

**Lab 3: BYOD Onboarding**
- Set up BYOD portal, configure native supplicant profile

**Lab 4: TrustSec Segmentation**
- Create SGTs, build egress policy matrix, add IP-SGT mappings

**Lab 5: Posture Compliance**
- Create posture conditions, requirements, policy, test compliance

The panel shows progress (steps completed), highlights which nav item to click, and validates completion.

**Files**: Create `src/components/LabGuidePanel.tsx`, `src/lib/labDefinitions.ts`, add toggle button in `CiscoHeader.tsx`.

### 6. Real-Time Live Log Correlation
**Problem**: Live logs generate random data unrelated to user actions.

**Solution**: When a student performs a "Test Authentication" or adds/modifies a policy, inject a correlated log entry into the Live Logs feed showing:
- The exact username/MAC they tested
- The policy set that matched
- Pass/Fail based on current policy state
- Timestamp matching the action

**Files**: Modify `src/pages/Operations.tsx`, wire to simulation context.

### 7. Search and Filter on Every Table
**Problem**: Only Context Visibility has search. Other pages have no filtering.

**Solution**: Add a reusable `<TableToolbar>` component above every data table with:
- Search input (filters across all visible columns)
- Column-specific dropdown filters where relevant
- Row count display
- Export CSV button (generates and downloads actual CSV)

**Files**: Create `src/components/TableToolbar.tsx`, apply to all table instances.

### 8. Bulk Actions on Tables
**Problem**: No multi-select or bulk operations.

**Solution**: Add checkboxes to table rows with:
- Select all / deselect all
- Bulk delete, bulk enable/disable, bulk export
- Action bar appears when items are selected

**Files**: Enhance the reusable `Table` component in each page.

### 9. Endpoint Right-Click Context Menu
**Problem**: Only click-to-view is available.

**Solution**: Add right-click context menu on endpoint/session rows with:
- View Details
- Apply ANC Policy (Quarantine/Shutdown)
- Change Authorization (CoA)
- Delete Endpoint
- Copy MAC Address

**Files**: Use shadcn `ContextMenu` component, apply to Context Visibility and Live Sessions.

### 10. Visual Policy Flow Diagram
**Problem**: Students can't visualize how authentication flows through policy sets.

**Solution**: Create `src/components/PolicyFlowDiagram.tsx`:
- Shows a flowchart: Request → Policy Set Match → Authentication → Authorization → Result
- Highlights the active path when running a test authentication
- Uses simple SVG boxes and arrows (no external library needed)

**Files**: Create `src/components/PolicyFlowDiagram.tsx`, embed in Policy page and Troubleshoot.

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/context/ISESimulationContext.tsx` | Create | Global mutable state for all entities |
| `src/components/AddEntityDialog.tsx` | Create | Reusable add/create form dialog |
| `src/components/ConfirmDeleteDialog.tsx` | Create | Delete confirmation dialog |
| `src/components/LabGuidePanel.tsx` | Create | Guided lab exercise panel |
| `src/components/TableToolbar.tsx` | Create | Search/filter/export toolbar |
| `src/components/PolicyFlowDiagram.tsx` | Create | Visual auth flow diagram |
| `src/lib/labDefinitions.ts` | Create | Lab exercise step definitions |
| `src/lib/authSimulator.ts` | Create | Policy evaluation engine |
| `src/App.tsx` | Modify | Wrap with SimulationContext provider |
| `src/components/CiscoHeader.tsx` | Modify | Add Lab Guide toggle button |
| `src/pages/Policy.tsx` | Modify | CRUD operations, search, delete, flow diagram |
| `src/pages/Administration.tsx` | Modify | CRUD operations, functional add forms |
| `src/pages/Operations.tsx` | Modify | Correlated logs, auth simulator integration |
| `src/pages/ContextVisibility.tsx` | Modify | Context menu, bulk actions |
| `src/pages/WorkCenters.tsx` | Modify | CRUD, search, delete |
| `src/pages/ThreatContainment.tsx` | Modify | CRUD, search |
| `src/pages/PxGrid.tsx` | Modify | CRUD, search |

## Implementation Order
1. SimulationContext (foundation for everything)
2. AddEntityDialog + ConfirmDeleteDialog (CRUD everywhere)
3. TableToolbar (search/filter on all pages)
4. AuthSimulator + correlated logs (cause-and-effect)
5. LabGuidePanel + lab definitions (guided training)
6. PolicyFlowDiagram + context menus (visual learning aids)

