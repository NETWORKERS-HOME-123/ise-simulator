import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  networkDevices, internalUsers, adminUsers, policySets, authenticationPolicies,
  authorizationPolicies, authorizationProfiles, policyConditions, securityGroups,
  identityGroupsList, systemCertificates, ancEndpoints, generateEndpoints, generateRadiusLogs,
} from '@/lib/mockData';
import { downloadableACLs, allowedProtocolsServices, threatEvents, postureConditions, pxGridClients, sxpDevices } from '@/lib/mockDataGap';

// Types
export type NetworkDevice = typeof networkDevices[0];
export type InternalUser = typeof internalUsers[0];
export type AdminUser = typeof adminUsers[0];
export type PolicySet = typeof policySets[0];
export type AuthnPolicy = typeof authenticationPolicies[0];
export type AuthzPolicy = typeof authorizationPolicies[0];
export type AuthzProfile = typeof authorizationProfiles[0];
export type PolicyCondition = typeof policyConditions[0];
export type SecurityGroup = typeof securityGroups[0];
export type DACL = typeof downloadableACLs[0];
export type ANCEndpoint = typeof ancEndpoints[0];
export type Endpoint = ReturnType<typeof generateEndpoints>[0];
export type RadiusLog = ReturnType<typeof generateRadiusLogs>[0];

interface SimState {
  networkDevices: NetworkDevice[];
  internalUsers: InternalUser[];
  adminUsers: AdminUser[];
  policySets: PolicySet[];
  authnPolicies: AuthnPolicy[];
  authzPolicies: AuthzPolicy[];
  authzProfiles: AuthzProfile[];
  conditions: PolicyCondition[];
  securityGroups: SecurityGroup[];
  dacls: DACL[];
  ancEndpoints: ANCEndpoint[];
  endpoints: Endpoint[];
  radiusLogs: RadiusLog[];
  simulationLogs: { time: string; action: string; detail: string }[];
}

interface SimActions {
  addNetworkDevice: (d: Omit<NetworkDevice, 'id'>) => void;
  deleteNetworkDevice: (id: number) => void;
  updateNetworkDevice: (id: number, updates: Partial<NetworkDevice>) => void;
  addInternalUser: (u: Omit<InternalUser, 'id'>) => void;
  deleteInternalUser: (id: number) => void;
  updateInternalUser: (id: number, updates: Partial<InternalUser>) => void;
  addPolicySet: (p: Omit<PolicySet, 'id'>) => void;
  deletePolicySet: (id: number) => void;
  updatePolicySet: (id: number, updates: Partial<PolicySet>) => void;
  addAuthzProfile: (p: Omit<AuthzProfile, 'id'>) => void;
  deleteAuthzProfile: (id: number) => void;
  addDACL: (d: Omit<DACL, 'id'>) => void;
  deleteDACL: (id: number) => void;
  updateDACL: (id: number, updates: Partial<DACL>) => void;
  addEndpoint: (e: Omit<Endpoint, 'id'>) => void;
  deleteEndpoint: (id: number) => void;
  addANCEndpoint: (a: Omit<ANCEndpoint, 'id'>) => void;
  removeANCEndpoint: (id: number) => void;
  addCondition: (c: Omit<PolicyCondition, 'id'>) => void;
  deleteCondition: (id: number) => void;
  addSecurityGroup: (sg: Omit<SecurityGroup, 'id'>) => void;
  deleteSecurityGroup: (id: number) => void;
  addSimulationLog: (action: string, detail: string) => void;
  injectRadiusLog: (log: RadiusLog) => void;
  resetAll: () => void;
}

const SimulationContext = createContext<(SimState & SimActions) | null>(null);

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be inside SimulationProvider');
  return ctx;
};

const nextId = (arr: { id: number }[]) => (arr.length ? Math.max(...arr.map(a => a.id)) + 1 : 1);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimState>(() => ({
    networkDevices: [...networkDevices],
    internalUsers: [...internalUsers],
    adminUsers: [...adminUsers],
    policySets: [...policySets],
    authnPolicies: [...authenticationPolicies],
    authzPolicies: [...authorizationPolicies],
    authzProfiles: [...authorizationProfiles],
    conditions: [...policyConditions],
    securityGroups: [...securityGroups],
    dacls: [...downloadableACLs],
    ancEndpoints: [...ancEndpoints],
    endpoints: generateEndpoints(80),
    radiusLogs: generateRadiusLogs(30),
    simulationLogs: [],
  }));

  const addSimulationLog = useCallback((action: string, detail: string) => {
    setState(s => ({ ...s, simulationLogs: [{ time: new Date().toISOString(), action, detail }, ...s.simulationLogs].slice(0, 200) }));
  }, []);

  // Generic CRUD helpers
  const addEntity = (key: keyof SimState, entity: any, label: string) => {
    setState(s => {
      const arr = s[key] as any[];
      const newItem = { ...entity, id: nextId(arr) };
      toast.success(`${label} created successfully`);
      return { ...s, [key]: [...arr, newItem], simulationLogs: [{ time: new Date().toISOString(), action: `Created ${label}`, detail: JSON.stringify(entity).slice(0, 100) }, ...s.simulationLogs].slice(0, 200) };
    });
  };

  const deleteEntity = (key: keyof SimState, id: number, label: string) => {
    setState(s => {
      toast.success(`${label} deleted`);
      return { ...s, [key]: (s[key] as any[]).filter((e: any) => e.id !== id), simulationLogs: [{ time: new Date().toISOString(), action: `Deleted ${label}`, detail: `ID: ${id}` }, ...s.simulationLogs].slice(0, 200) };
    });
  };

  const updateEntity = (key: keyof SimState, id: number, updates: any, label: string) => {
    setState(s => {
      toast.success(`${label} updated`);
      return { ...s, [key]: (s[key] as any[]).map((e: any) => e.id === id ? { ...e, ...updates } : e), simulationLogs: [{ time: new Date().toISOString(), action: `Updated ${label}`, detail: `ID: ${id}` }, ...s.simulationLogs].slice(0, 200) };
    });
  };

  const actions: SimActions = {
    addNetworkDevice: (d) => addEntity('networkDevices', d, 'Network Device'),
    deleteNetworkDevice: (id) => deleteEntity('networkDevices', id, 'Network Device'),
    updateNetworkDevice: (id, u) => updateEntity('networkDevices', id, u, 'Network Device'),
    addInternalUser: (u) => addEntity('internalUsers', u, 'Internal User'),
    deleteInternalUser: (id) => deleteEntity('internalUsers', id, 'Internal User'),
    updateInternalUser: (id, u) => updateEntity('internalUsers', id, u, 'Internal User'),
    addPolicySet: (p) => addEntity('policySets', p, 'Policy Set'),
    deletePolicySet: (id) => deleteEntity('policySets', id, 'Policy Set'),
    updatePolicySet: (id, u) => updateEntity('policySets', id, u, 'Policy Set'),
    addAuthzProfile: (p) => addEntity('authzProfiles', p, 'Authorization Profile'),
    deleteAuthzProfile: (id) => deleteEntity('authzProfiles', id, 'Authorization Profile'),
    addDACL: (d) => addEntity('dacls', d, 'DACL'),
    deleteDACL: (id) => deleteEntity('dacls', id, 'DACL'),
    updateDACL: (id, u) => updateEntity('dacls', id, u, 'DACL'),
    addEndpoint: (e) => addEntity('endpoints', e, 'Endpoint'),
    deleteEndpoint: (id) => deleteEntity('endpoints', id, 'Endpoint'),
    addANCEndpoint: (a) => addEntity('ancEndpoints', a, 'ANC Policy'),
    removeANCEndpoint: (id) => deleteEntity('ancEndpoints', id, 'ANC Policy'),
    addCondition: (c) => addEntity('conditions', c, 'Policy Condition'),
    deleteCondition: (id) => deleteEntity('conditions', id, 'Policy Condition'),
    addSecurityGroup: (sg) => addEntity('securityGroups', sg, 'Security Group'),
    deleteSecurityGroup: (id) => deleteEntity('securityGroups', id, 'Security Group'),
    addSimulationLog,
    injectRadiusLog: (log) => setState(s => ({ ...s, radiusLogs: [log, ...s.radiusLogs].slice(0, 100) })),
    resetAll: () => {
      setState({
        networkDevices: [...networkDevices],
        internalUsers: [...internalUsers],
        adminUsers: [...adminUsers],
        policySets: [...policySets],
        authnPolicies: [...authenticationPolicies],
        authzPolicies: [...authorizationPolicies],
        authzProfiles: [...authorizationProfiles],
        conditions: [...policyConditions],
        securityGroups: [...securityGroups],
        dacls: [...downloadableACLs],
        ancEndpoints: [...ancEndpoints],
        endpoints: generateEndpoints(80),
        radiusLogs: generateRadiusLogs(30),
        simulationLogs: [],
      });
      toast.success('Simulation reset to defaults');
    },
  };

  return <SimulationContext.Provider value={{ ...state, ...actions }}>{children}</SimulationContext.Provider>;
};
