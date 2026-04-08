import { useState } from 'react';
import { labs } from '@/lib/labDefinitions';
import { useSimulation } from '@/context/ISESimulationContext';
import { useWalkthrough } from '@/context/WalkthroughContext';
import { CheckCircle, Circle, BookOpen, ChevronDown, ChevronRight, RotateCcw, X, Play, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface LabGuidePanelProps {
  open: boolean;
  onClose: () => void;
}

const LabGuidePanel = ({ open, onClose }: LabGuidePanelProps) => {
  const sim = useSimulation();
  const wt = useWalkthrough();
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (!open) return null;

  const lab = labs.find(l => l.id === selectedLab);

  const checkStep = (stepId: string) => {
    if (!lab) return;
    const step = lab.steps.find(s => s.id === stepId);
    if (!step) return;
    if (step.validation(sim)) {
      toast.success(`✓ Step completed: ${step.title}`);
    } else {
      toast.error(`✗ Step not yet completed. ${step.hint}`);
    }
  };

  const getLabProgress = (labId: string) => {
    const l = labs.find(lb => lb.id === labId);
    if (!l) return 0;
    const completed = l.steps.filter(s => s.validation(sim)).length;
    return Math.round((completed / l.steps.length) * 100);
  };

  const handleStartWalkthrough = (labId: string) => {
    wt.startWalkthrough(labId);
    onClose();
  };

  const handleGoToStep = (labId: string, stepIndex: number) => {
    if (!wt.active || wt.labId !== labId) {
      wt.startWalkthrough(labId);
    }
    setTimeout(() => wt.goToStep(stepIndex), 100);
    onClose();
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-xl z-50 flex flex-col" style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border" style={{ background: '#049fd9' }}>
        <div className="flex items-center gap-2">
          <BookOpen size={14} color="#fff" />
          <span className="text-xs font-semibold text-white">Lab Guide</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-white/20" onClick={() => { sim.resetAll(); toast.info('Simulation reset for labs'); }}>
            <RotateCcw size={12} color="#fff" />
          </button>
          <button className="p-1 rounded hover:bg-white/20" onClick={onClose}>
            <X size={14} color="#fff" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedLab ? (
          <div className="p-3 space-y-2">
            <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Select a Lab Exercise</div>
            {labs.map(l => {
              const progress = getLabProgress(l.id);
              return (
                <div key={l.id} className="border border-border rounded p-3 hover:bg-accent/40 transition-colors">
                  <button className="w-full text-left" onClick={() => setSelectedLab(l.id)}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: '#049fd9' }}>{l.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                        background: l.difficulty === 'Beginner' ? '#6cc04a20' : l.difficulty === 'Intermediate' ? '#fbab1830' : '#cc000020',
                        color: l.difficulty === 'Beginner' ? '#3d7a2a' : l.difficulty === 'Intermediate' ? '#b47a00' : '#cc0000'
                      }}>{l.difficulty}</span>
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: '#666' }}>{l.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e5e5' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: progress === 100 ? '#6cc04a' : '#049fd9' }} />
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: '#888' }}>{progress}%</span>
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: '#888' }}>⏱ {l.estimatedTime} • {l.steps.length} steps</div>
                  </button>
                  <button
                    className="w-full mt-2 flex items-center justify-center gap-1.5 text-[11px] px-3 py-1.5 rounded text-white font-medium transition-colors"
                    style={{ background: '#6cc04a' }}
                    onClick={() => handleStartWalkthrough(l.id)}
                  >
                    <Play size={11} /> Start Guided Walkthrough
                  </button>
                </div>
              );
            })}
          </div>
        ) : lab ? (
          <div className="p-3">
            <button className="text-[11px] mb-3 flex items-center gap-1 hover:underline" style={{ color: '#049fd9' }} onClick={() => setSelectedLab(null)}>
              ← Back to Labs
            </button>
            <div className="text-xs font-semibold mb-1" style={{ color: '#333' }}>{lab.title}</div>
            <div className="text-[11px] mb-2" style={{ color: '#666' }}>{lab.description}</div>

            <button
              className="w-full mb-3 flex items-center justify-center gap-1.5 text-[11px] px-3 py-1.5 rounded text-white font-medium"
              style={{ background: '#6cc04a' }}
              onClick={() => handleStartWalkthrough(lab.id)}
            >
              <Play size={11} /> Start Guided Walkthrough
            </button>

            <div className="space-y-2">
              {lab.steps.map((step, i) => {
                const completed = step.validation(sim);
                const isExpanded = expandedStep === step.id;
                return (
                  <div key={step.id} className="border border-border rounded overflow-hidden">
                    <button
                      className="w-full flex items-center gap-2 p-2 text-left hover:bg-accent/30"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      {completed ? <CheckCircle size={14} style={{ color: '#6cc04a' }} /> : <Circle size={14} style={{ color: '#ccc' }} />}
                      <span className="text-xs flex-1" style={{ color: completed ? '#3d7a2a' : '#333' }}>
                        Step {i + 1}: {step.title}
                      </span>
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-border">
                        <div className="text-[11px] mb-2" style={{ color: '#555' }}>{step.instruction}</div>
                        {step.formFields && step.formFields.length > 0 && (
                          <div className="text-[10px] mb-2 p-2 rounded" style={{ background: '#f0f8ff', border: '1px solid #049fd920' }}>
                            <div className="font-semibold mb-1" style={{ color: '#049fd9' }}>Expected Values:</div>
                            {step.formFields.map(f => (
                              <div key={f.fieldId} className="flex gap-2">
                                <span style={{ color: '#666' }}>{f.label}:</span>
                                <span className="font-mono font-semibold" style={{ color: '#333' }}>{f.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[10px] mb-2 p-2 rounded" style={{ background: '#f5f5f5', color: '#888' }}>
                          💡 Hint: {step.hint}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-[11px] px-3 py-1 rounded text-white"
                            style={{ background: '#049fd9' }}
                            onClick={() => checkStep(step.id)}
                          >
                            Validate Step
                          </button>
                          <button
                            className="text-[11px] px-3 py-1 rounded border border-border flex items-center gap-1 hover:bg-accent/30"
                            style={{ color: '#049fd9' }}
                            onClick={() => handleGoToStep(lab.id, i)}
                          >
                            <Navigation size={10} /> Go To Step
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-2 rounded text-center" style={{
              background: lab.steps.every(s => s.validation(sim)) ? '#6cc04a20' : '#f5f5f5',
              color: lab.steps.every(s => s.validation(sim)) ? '#3d7a2a' : '#888'
            }}>
              <span className="text-xs font-semibold">
                {lab.steps.every(s => s.validation(sim)) ? '🎉 Lab Complete!' : `${lab.steps.filter(s => s.validation(sim)).length} / ${lab.steps.length} steps completed`}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LabGuidePanel;
