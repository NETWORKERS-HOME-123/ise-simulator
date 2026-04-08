import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from './ISESimulationContext';
import { labs, LabStep } from '@/lib/labDefinitions';
import { toast } from 'sonner';

interface WalkthroughState {
  active: boolean;
  labId: string | null;
  stepIndex: number;
  highlightTarget: string | null;
}

interface WalkthroughContextType extends WalkthroughState {
  startWalkthrough: (labId: string) => void;
  stopWalkthrough: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  skipStep: () => void;
  currentStep: LabStep | null;
  currentLab: typeof labs[0] | null;
  totalSteps: number;
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export const useWalkthrough = () => {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error('useWalkthrough must be used within WalkthroughProvider');
  return ctx;
};

export const WalkthroughProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<WalkthroughState>({
    active: false,
    labId: null,
    stepIndex: 0,
    highlightTarget: null,
  });

  const sim = useSimulation();
  const navigateRef = useRef<ReturnType<typeof useNavigate> | null>(null);

  const currentLab = state.labId ? labs.find(l => l.id === state.labId) || null : null;
  const currentStep = currentLab && state.stepIndex < currentLab.steps.length
    ? currentLab.steps[state.stepIndex]
    : null;
  const totalSteps = currentLab?.steps.length || 0;

  const navigateToStep = useCallback((step: LabStep) => {
    if (step.route && navigateRef.current) {
      navigateRef.current(step.route);
    }
    // Set nav key after a small delay to allow page to render
    if (step.navKey) {
      setTimeout(() => {
        const navEl = document.querySelector(`[data-walkthrough="nav-${step.navKey}"]`) as HTMLElement;
        if (navEl) navEl.click();
      }, 200);
    }
    setTimeout(() => {
      setState(prev => ({ ...prev, highlightTarget: step.highlightSelector }));
    }, step.navKey ? 400 : 200);
  }, []);

  const startWalkthrough = useCallback((labId: string) => {
    const lab = labs.find(l => l.id === labId);
    if (!lab || lab.steps.length === 0) return;
    setState({
      active: true,
      labId,
      stepIndex: 0,
      highlightTarget: null,
    });
    navigateToStep(lab.steps[0]);
    toast.info(`Starting: ${lab.title}`);
  }, [navigateToStep]);

  const stopWalkthrough = useCallback(() => {
    setState({ active: false, labId: null, stepIndex: 0, highlightTarget: null });
  }, []);

  const goToStep = useCallback((index: number) => {
    if (!currentLab || index < 0 || index >= currentLab.steps.length) return;
    setState(prev => ({ ...prev, stepIndex: index, highlightTarget: null }));
    navigateToStep(currentLab.steps[index]);
  }, [currentLab, navigateToStep]);

  const nextStep = useCallback(() => {
    if (!currentLab) return;
    const next = state.stepIndex + 1;
    if (next >= currentLab.steps.length) {
      toast.success(`🎉 ${currentLab.title} completed!`);
      stopWalkthrough();
      return;
    }
    setState(prev => ({ ...prev, stepIndex: next, highlightTarget: null }));
    navigateToStep(currentLab.steps[next]);
  }, [currentLab, state.stepIndex, navigateToStep, stopWalkthrough]);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  // Auto-advance when validation passes
  useEffect(() => {
    if (!state.active || !currentStep) return;
    if (currentStep.validation(sim)) {
      toast.success(`✓ Step completed: ${currentStep.title}`);
      const timer = setTimeout(() => nextStep(), 800);
      return () => clearTimeout(timer);
    }
  }, [state.active, currentStep, sim, nextStep]);

  return (
    <WalkthroughContext.Provider value={{
      ...state,
      startWalkthrough,
      stopWalkthrough,
      goToStep,
      nextStep,
      skipStep,
      currentStep,
      currentLab,
      totalSteps,
    }}>
      <NavigateInjector navigateRef={navigateRef} />
      {children}
    </WalkthroughContext.Provider>
  );
};

// Inject useNavigate from within Router context
const NavigateInjector = ({ navigateRef }: { navigateRef: React.MutableRefObject<ReturnType<typeof useNavigate> | null> }) => {
  const navigate = useNavigate();
  navigateRef.current = navigate;
  return null;
};
