// Authentication Simulation Engine
// Walks through policy sets and generates step-by-step trace
// Uses official Cisco ISE 3.3 message catalog codes

import type { PolicySet, AuthnPolicy, AuthzPolicy, InternalUser, Endpoint, NetworkDevice } from '@/context/ISESimulationContext';

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
  messageCode?: number;
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

// Generate ISE-format session ID: 0a{node_hex}:{port_hex}/{timestamp_hex}/session_seq
function generateSessionId(nasIP: string): string {
  const parts = nasIP.split('.').map(p => parseInt(p).toString(16).padStart(2, '0'));
  const nodeHex = parts.join('');
  const portHex = Math.floor(Math.random() * 48).toString(16).padStart(4, '0');
  const tsHex = Math.floor(Date.now() / 1000).toString(16);
  const seq = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${nodeHex}:${portHex}/${tsHex}/${seq}`;
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
  const nasIP = input.nasIP || '10.1.100.1';
  const sessionId = generateSessionId(nasIP);
  const ts = new Date().toISOString();
  let stepNum = 0;

  const addStep = (action: string, detail: string, status: AuthSimStep['status'] = 'info', messageCode?: number) => {
    steps.push({ step: ++stepNum, action, detail, status, messageCode });
  };

  // Step 1: Receive request
  addStep('RADIUS Access-Request received', `From NAS ${nasIP}, Username: ${input.username}, MAC: ${input.mac || 'N/A'}, Session: ${sessionId}`, 'info', 11001);

  // Step 2: Find matching NAS device
  const nas = devices.find(d => d.ip === nasIP);
  if (nas) {
    addStep('NAS Device identified', `${nas.name} (${nas.ip}) — Profile: ${nas.profile}`, 'pass', 11003);
  } else {
    addStep('NAS Device lookup failed', `NAS IP ${nasIP} not found in Network Devices — RADIUS request dropped`, 'fail', 5405);
    return { passed: false, steps, matchedPolicySet: null, matchedAuthnRule: null, matchedAuthzRule: null, authzProfile: 'DenyAccess', sessionId, timestamp: ts };
  }

  // Step 3: Evaluate policy sets
  const enabledSets = policySets.filter(ps => ps.status === 'Enabled' || ps.status === 'Monitor Only');
  addStep('Evaluating Policy Sets', `${enabledSets.length} active policy sets to evaluate`, 'info', 15006);

  let matchedPS: PolicySet | null = null;
  for (const ps of enabledSets) {
    const condMatch = evaluateCondition(ps.conditions, input);
    if (condMatch) {
      matchedPS = ps;
      const monitorNote = ps.status === 'Monitor Only' ? ' [MONITOR ONLY — not enforced]' : '';
      addStep('Policy Set matched', `"${ps.name}" — Condition: ${ps.conditions}${monitorNote}`, 'pass', 15008);
      break;
    } else {
      addStep('Policy Set skipped', `"${ps.name}" — Condition "${ps.conditions}" not matched`, 'info', 15004);
    }
  }

  if (!matchedPS) {
    addStep('No Policy Set matched', 'Using Default policy set', 'warn', 15048);
    matchedPS = enabledSets[enabledSets.length - 1] || null;
  }

  // Step 4: Authentication
  const authnMethod = input.authMethod || 'PEAP (EAP-MSCHAPv2)';
  addStep('Authentication method', `${authnMethod}`, 'info', 12000);

  let matchedAuthn: AuthnPolicy | null = null;
  for (const rule of authnPolicies.filter(a => a.status === 'Enabled')) {
    if (evaluateCondition(rule.conditions, input)) {
      matchedAuthn = rule;
      addStep('Authentication Rule matched', `"${rule.rule}" — Identity Store: ${rule.identityStore}`, 'pass', 12002);
      break;
    }
  }

  if (!matchedAuthn) {
    matchedAuthn = authnPolicies.find(a => a.rule === 'Default') || null;
    addStep('Default Authentication Rule used', 'No specific rule matched', 'warn', 12015);
  }

  // Step 5: Identity lookup
  const user = users.find(u => u.name === input.username);
  if (user) {
    if (user.status === 'Enabled') {
      addStep('Identity resolved', `User "${user.name}" found in Internal Users — Group: ${user.identityGroup}`, 'pass', 22037);
    } else {
      addStep('User account disabled', `User "${user.name}" is disabled in identity store`, 'fail', 22016);
      return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: null, authzProfile: 'DenyAccess', sessionId, timestamp: ts };
    }
  } else {
    if (input.username.startsWith('host/')) {
      addStep('Machine authentication', `Host identity ${input.username} — checking endpoint database`, 'info', 12300);
      const ep = endpoints.find(e => e.mac === input.mac);
      if (ep) {
        addStep('Endpoint found', `MAC: ${ep.mac}, Profile: ${ep.profile}`, 'pass', 12305);
      } else {
        addStep('Endpoint not found', `MAC: ${input.mac || 'N/A'} — new endpoint, will be profiled`, 'warn', 12306);
      }
    } else {
      addStep('User not found', `"${input.username}" not found in the applicable identity store(s)`, 'fail', 22056);
      return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: null, authzProfile: 'DenyAccess', sessionId, timestamp: ts };
    }
  }

  // Step 6: EAP handshake
  if (authnMethod.includes('EAP-TLS')) {
    addStep('Extracted EAP-Response containing EAP-TLS response', 'Certificate validation successful', 'pass', 12304);
  } else if (authnMethod.includes('PEAP')) {
    addStep('PEAP handshake', 'Inner method EAP-MSCHAPv2 completed successfully', 'pass', 12304);
  }
  addStep('Authentication Succeeded', `${authnMethod} authentication completed`, 'pass', 5200);

  // Step 7: Authorization
  addStep('Evaluating Authorization Policies', `${authzPolicies.filter(a => a.status === 'Enabled').length} rules to evaluate`, 'info', 15036);

  let matchedAuthz: AuthzPolicy | null = null;
  for (const rule of authzPolicies.filter(a => a.status === 'Enabled')) {
    if (evaluateAuthzCondition(rule.conditions, input, user)) {
      matchedAuthz = rule;
      addStep('Authorization Rule matched', `"${rule.rule}" — Profile: ${rule.profile}, SGT: ${rule.securityGroup}`, 'pass', 15042);
      break;
    }
  }

  if (!matchedAuthz) {
    matchedAuthz = authzPolicies.find(a => a.rule === 'Default_Deny') || null;
    addStep('Default Deny applied', 'No authorization rule matched — applying DenyAccess', 'fail', 15039);
    return { passed: false, steps, matchedPolicySet: matchedPS?.name || null, matchedAuthnRule: matchedAuthn?.rule || null, matchedAuthzRule: 'Default_Deny', authzProfile: 'DenyAccess', sessionId, timestamp: ts };
  }

  // Step 8: Apply profile
  addStep('Authorization Profile applied', `${matchedAuthz.profile}`, 'pass', 15044);

  // Step 9: Send response
  const isAccept = matchedAuthz.profile !== 'DenyAccess';
  addStep(
    isAccept ? 'RADIUS Access-Accept sent' : 'RADIUS Access-Reject sent',
    `Session ID: ${sessionId}`,
    isAccept ? 'pass' : 'fail',
    isAccept ? 5200 : 5400
  );

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
