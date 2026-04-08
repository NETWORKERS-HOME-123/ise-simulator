// Authentication Simulation Engine
// Walks through policy sets and generates step-by-step trace

import type { PolicySet, AuthnPolicy, AuthzPolicy, InternalUser, Endpoint, NetworkDevice } from '@/context/ISESimulationContext';
import { generateMacAddress } from './mockData';

export interface AuthSimInput {
  username: string;
  mac?: string;
  nasIP?: string;
  authMethod?: string;
}

export interface AuthSimStep {
  step: number;
  action: string;
  detail: string;
  status: 'info' | 'pass' | 'fail' | 'warn';
}

export interface AuthSimResult {
  passed: boolean;
  steps: AuthSimStep[];
  matchedPolicySet: string | null;
  matchedAuthnRule: string | null;
  matchedAuthzRule: string | null;
  authzProfile: string | null;
  sessionId: string;
  timestamp: string;
}

export function simulateAuthentication(
  input: AuthSimInput,
  policySets: PolicySet[],
  authnPolicies: AuthnPolicy[],
  authzPolicies: AuthzPolicy[],
  users: InternalUser[],
  endpoints: Endpoint[],
  devices: NetworkDevice[]
): AuthSimResult {
  const steps: AuthSimStep[] = [];
  const sessionId = `0A0${Math.floor(Math.random() * 9)}${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
  const ts = new Date().toISOString();
  let stepNum = 0;

  const addStep = (action: string, detail: string, status: AuthSimStep['status'] = 'info') => {
    steps.push({ step: ++stepNum, action, detail, status });
  };

  // Step 1: Receive request
  addStep('RADIUS Access-Request received', `From NAS ${input.nasIP || '10.1.100.1'}, Username: ${input.username}, MAC: ${input.mac || 'N/A'}`);

  // Step 2: Find matching NAS device
  const nas = devices.find(d => d.ip === (input.nasIP || '10.1.100.1'));
  if (nas) {
    addStep('NAS Device identified', `${nas.name} (${nas.ip}) — Profile: ${nas.profile}`, 'pass');
  } else {
    addStep('NAS Device lookup', `NAS IP ${input.nasIP || '10.1.100.1'} — using default device profile`, 'warn');
  }

  // Step 3: Evaluate policy sets
  const enabledSets = policySets.filter(ps => ps.status === 'Enabled');
  addStep('Evaluating Policy Sets', `${enabledSets.length} active policy sets to evaluate`);

  let matchedPS: PolicySet | null = null;
  for (const ps of enabledSets) {
    const condMatch = evaluateCondition(ps.conditions, input);
    if (condMatch) {
      matchedPS = ps;
      addStep('Policy Set matched', `"${ps.name}" — Condition: ${ps.conditions}`, 'pass');
      break;
    } else {
      addStep('Policy Set skipped', `"${ps.name}" — Condition "${ps.conditions}" not matched`, 'info');
    }
  }

  if (!matchedPS) {
    addStep('No Policy Set matched', 'Using Default policy set', 'warn');
    matchedPS = enabledSets[enabledSets.length - 1] || null;
  }

  // Step 4: Authentication
  const authnMethod = input.authMethod || 'PEAP (EAP-MSCHAPv2)';
  addStep('Authentication method', `${authnMethod}`);

  let matchedAuthn: AuthnPolicy | null = null;
  for (const rule of authnPolicies.filter(a => a.status === 'Enabled')) {
    if (evaluateCondition(rule.conditions, input)) {
      matchedAuthn = rule;
      addStep('Authentication Rule matched', `"${rule.rule}" — Identity Store: ${rule.identityStore}`, 'pass');
      break;
    }
  }

  if (!matchedAuthn) {
    matchedAuthn = authnPolicies.find(a => a.rule === 'Default') || null;
    addStep('Default Authentication Rule used', 'No specific rule matched', 'warn');
  }

  // Step 5: Identity lookup
  const user = users.find(u => u.name === input.username);
  if (user) {
    if (user.status === 'Enabled') {
      addStep('Identity resolved', `User "${user.name}" found in Internal Users — Group: ${user.identityGroup}`, 'pass');
    } else {
      addStep('User account disabled', `User "${user.name}" is disabled`, 'fail');
      return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: null, authzProfile: 'DenyAccess', sessionId, timestamp: ts };
    }
  } else {
    // Check if it's a host/ machine auth
    if (input.username.startsWith('host/')) {
      addStep('Machine authentication', `Host identity ${input.username} — checking endpoint database`, 'info');
      const ep = endpoints.find(e => e.mac === input.mac);
      if (ep) {
        addStep('Endpoint found', `MAC: ${ep.mac}, Profile: ${ep.profile}`, 'pass');
      } else {
        addStep('Endpoint not found', `MAC: ${input.mac || 'N/A'} — new endpoint, will be profiled`, 'warn');
      }
    } else {
      addStep('User not found', `"${input.username}" not found in any identity store`, 'fail');
      return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: null, authzProfile: 'DenyAccess', sessionId, timestamp: ts };
    }
  }

  // Step 6: EAP handshake
  addStep('EAP handshake', `${authnMethod} handshake completed successfully`, 'pass');

  // Step 7: Authorization
  addStep('Evaluating Authorization Policies', `${authzPolicies.filter(a => a.status === 'Enabled').length} rules to evaluate`);

  let matchedAuthz: AuthzPolicy | null = null;
  for (const rule of authzPolicies.filter(a => a.status === 'Enabled')) {
    if (evaluateAuthzCondition(rule.conditions, input, user)) {
      matchedAuthz = rule;
      addStep('Authorization Rule matched', `"${rule.rule}" — Profile: ${rule.profile}, SGT: ${rule.securityGroup}`, 'pass');
      break;
    }
  }

  if (!matchedAuthz) {
    matchedAuthz = authzPolicies.find(a => a.rule === 'Default_Deny') || null;
    addStep('Default Deny applied', 'No authorization rule matched', 'fail');
    return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: 'Default_Deny', authzProfile: 'DenyAccess', sessionId, timestamp: ts };
  }

  // Step 8: Apply profile
  addStep('Authorization Profile applied', `${matchedAuthz.profile}`, 'pass');

  // Step 9: Send response
  const isAccept = matchedAuthz.profile !== 'DenyAccess';
  addStep(isAccept ? 'RADIUS Access-Accept sent' : 'RADIUS Access-Reject sent', `Session ID: ${sessionId}`, isAccept ? 'pass' : 'fail');

  return {
    passed: isAccept,
    steps,
    matchedPolicySet: matchedPS?.name || null,
    matchedAuthnRule: matchedAuthn?.rule || null,
    matchedAuthzRule: matchedAuthz?.rule || null,
    authzProfile: matchedAuthz?.profile || null,
    sessionId,
    timestamp: ts,
  };
}

function evaluateCondition(condition: string, input: AuthSimInput): boolean {
  const c = condition.toLowerCase();
  if (c === 'default') return true;
  if (c.includes('wired_802.1x') && (input.authMethod?.includes('802.1X') || input.authMethod?.includes('EAP'))) return true;
  if (c.includes('wireless_802.1x') && input.authMethod?.includes('Wireless')) return true;
  if (c.includes('wired_mab') && input.authMethod?.includes('MAB')) return true;
  if (c.includes('wireless_mab') && input.authMethod?.includes('MAB')) return true;
  if (c.includes('vpn') && input.authMethod?.includes('VPN')) return true;
  // Default: match first enabled set if conditions aren't specific
  return false;
}

function evaluateAuthzCondition(condition: string, input: AuthSimInput, user: InternalUser | undefined): boolean {
  const c = condition.toLowerCase();
  if (c === 'default') return true;
  if (user) {
    if (c.includes(`identitygroup:${user.identityGroup.toLowerCase()}`)) return true;
    if (c.includes('employee') && user.identityGroup === 'Employee') return true;
    if (c.includes('guest') && user.identityGroup === 'Guest') return true;
    if (c.includes('contractor') && user.identityGroup === 'Contractor') return true;
    if (c.includes('byod') && user.identityGroup === 'BYOD') return true;
    if (c.includes('iot') && user.identityGroup === 'IOT') return true;
  }
  return false;
}
