

# Interactive Guided Walkthrough & Hands-On Lab Simulation

## Problem

The current Lab Guide is a **passive checklist** — it shows instructions and validates completion, but:
1. Students must manually find the right page, button, and fields
2. No visual highlighting of what to click
3. No auto-navigation — students get lost
4. Labs validate state but don't guide the student through the actual UI interaction
5. No real-time feedback during the process (only after clicking "Validate")

## Solution

Build a **walkthrough engine** that actively drives the student through each step: auto-navigates to the correct route, highlights the exact UI element (button/field/nav item), shows a tooltip with instructions, and auto-advances when the action is completed.

---

## Architecture

### New: Walkthrough Context (`src/context/WalkthroughContext.tsx`)

A global context that tracks:
- `activeLabId` / `activeStepIndex` — which lab step is live
- `walkthroughMode: boolean` — whether guided mode is active
- `highlightTarget: string | null` — CSS selector or `data-walkthrough` ID of the element to highlight
- `navigateTo: string | null` — route to auto-navigate to
- `tooltipPosition` — where to show the instruction tooltip
- `autoValidate: boolean` — watch simulation context and auto-advance on completion

### New: Lab Step Metadata (extend `labDefinitions.ts`)

Each step gets new fields:
```typescript
interface LabStep {
  // existing
  id: string;
  title: string;
  instruction: string;
  hint: string;
  validation: (ctx: any) => boolean;
  // NEW
  route: string;                    // e.g. "/administration"
  navKey?: string;                  // left-nav item to auto-click, e.g. "network-devices"
  highlightSelector: string;        // data-walkthrough="add-device-btn"
  tooltipText: string;              // concise action: "Click this button to add a new switch"
  formFields?: {                    // pre-fill hints shown inside form
    fieldId: string;
    value: string;
    label: string;
  }[];
}
```

### New: Walkthrough Overlay (`src/components/WalkthroughOverlay.tsx`)

A full-screen overlay component that:
1. **Dims the entire page** except the highlighted element (spotlight effect using CSS `mix-blend-mode` or a mask)
2. **Shows a tooltip/popover** anchored to the highlighted element with:
   - Step number (e.g., "Step 1 of 4")
   - Instruction text
   - "Skip" and "Next" buttons
   - For form steps: shows expected values as helper text
3. **Pulses/glows** the target element with a CSS animation
4. **Auto-advances** when `validation()` returns true (watches SimulationContext changes via useEffect)

### Modified: LabGuidePanel (`src/components/LabGuidePanel.tsx`)

Add a "Start Guided Walkthrough" button per lab that:
- Activates walkthrough mode
- Navigates to the first step's route
- Sets the first highlight target

Each step card also gets a "Go To This Step" button that navigates and highlights.

### Modified: All pages & key components

Add `data-walkthrough` attributes to interactive elements:
- `data-walkthrough="add-device-btn"` on Administration's "+ Add Device" button
- `data-walkthrough="add-user-btn"` on Internal Users "+ Add User" button
- `data-walkthrough="add-policy-btn"` on Policy Sets "+ Add Policy Set" button
- `data-walkthrough="add-endpoint-btn"` on Context Visibility "+ Add Endpoint" button
- `data-walkthrough="add-dacl-btn"` on DACLs "+ Add DACL" button
- `data-walkthrough="add-sgt-btn"` on TrustSec "+ Add SGT" button
- `data-walkthrough="add-profile-btn"` on Auth Profiles "+ Add Profile"
- `data-walkthrough="run-auth-test"` on Troubleshoot "Run Test" button
- `data-walkthrough="nav-{key}"` on left nav items

### Redesigned Labs (Real Hands-On Scenarios)

**Lab 1: 802.1X Wired Authentication (5 steps)**
1. Navigate to Administration > Network Devices → highlight "Add Device" → student fills form with name="LAB-SW-01", IP="10.10.10.1" → validated when device appears in state
2. Navigate to Administration > Internal Users → highlight "Add User" → student creates "labuser" in Employee group → validated
3. Navigate to Policy > Policy Sets → highlight "Add Policy Set" → student creates "Lab_Wired" with condition "Wired_802.1X" → validated
4. Navigate to Policy > Authorization Profiles → highlight "Add Profile" → student creates "Lab_Permit" with ACCESS_ACCEPT → validated
5. Navigate to Operations > Troubleshoot → highlight auth test form → student enters username="labuser", NAS="10.10.10.1", clicks Run → validated when log appears

**Lab 2: Guest Access & ANC (4 steps)**
1. Add guest user "guest_lab" in Guest group
2. Navigate to Work Centers > Guest Access → view portal configuration
3. Apply ANC-Quarantine to a MAC address in Operations > ANC
4. Verify quarantined endpoint appears in Context Visibility

**Lab 3: TrustSec Segmentation (4 steps)**
1. Create SGT "Lab_Servers" tag=50 in Work Centers > TrustSec
2. Create DACL "ACL-LAB-PERMIT" in Policy > DACLs
3. Create authorization profile "TrustSec_Lab" with DACL mapping
4. Run auth test to verify SGT assignment in trace

**Lab 4: Certificate Management (3 steps)**
1. View system certificates in Administration > Certificates
2. Generate a CSR with CN="ise-lab.cisco.com"
3. View trusted certificates store

**Lab 5: Endpoint Lifecycle (4 steps)**
1. Add endpoint MAC="AA:BB:CC:DD:EE:FF" in Context Visibility
2. Right-click endpoint → Apply ANC Quarantine
3. Verify in Operations > ANC that endpoint shows quarantined
4. Delete the endpoint and verify removal

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/context/WalkthroughContext.tsx` | Create | Global walkthrough state: active step, highlight target, auto-navigate |
| `src/components/WalkthroughOverlay.tsx` | Create | Spotlight overlay with tooltip, pulse animation, auto-advance |
| `src/lib/labDefinitions.ts` | Rewrite | Add route, navKey, highlightSelector, tooltipText, formFields to every step |
| `src/components/LabGuidePanel.tsx` | Modify | Add "Start Guided Walkthrough" button, "Go To Step" per step |
| `src/App.tsx` | Modify | Wrap with WalkthroughProvider, render WalkthroughOverlay |
| `src/pages/Administration.tsx` | Modify | Add `data-walkthrough` attributes to buttons |
| `src/pages/Policy.tsx` | Modify | Add `data-walkthrough` attributes to buttons |
| `src/pages/Operations.tsx` | Modify | Add `data-walkthrough` attributes to test form |
| `src/pages/ContextVisibility.tsx` | Modify | Add `data-walkthrough` attributes to buttons |
| `src/pages/WorkCenters.tsx` | Modify | Add `data-walkthrough` attributes to buttons |
| `src/components/CiscoHeader.tsx` | Modify | Add `data-walkthrough="nav-*"` to top nav tabs |

## Implementation Order
1. WalkthroughContext + WalkthroughOverlay (engine)
2. Rewrite labDefinitions.ts with full step metadata
3. Update LabGuidePanel with guided mode trigger
4. Add data-walkthrough attributes across all pages
5. Wire auto-navigation and auto-advance logic

