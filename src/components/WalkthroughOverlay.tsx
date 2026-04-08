import { useEffect, useState, useRef } from 'react';
import { useWalkthrough } from '@/context/WalkthroughContext';
import { X, ChevronRight, SkipForward, Lightbulb } from 'lucide-react';

const WalkthroughOverlay = () => {
  const wt = useWalkthrough();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showHint, setShowHint] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wt.active || !wt.highlightTarget) {
      setTargetRect(null);
      return;
    }

    const findTarget = () => {
      const el = document.querySelector(`[data-walkthrough="${wt.highlightTarget}"]`) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Add pulse class
        el.classList.add('walkthrough-pulse');
        return () => el.classList.remove('walkthrough-pulse');
      }
      setTargetRect(null);
    };

    // Retry a few times to find element after navigation
    let cleanup: (() => void) | undefined;
    let attempts = 0;
    const iv = setInterval(() => {
      cleanup = findTarget();
      attempts++;
      if (targetRect || attempts > 10) clearInterval(iv);
    }, 300);

    cleanup = findTarget();

    return () => {
      clearInterval(iv);
      cleanup?.();
    };
  }, [wt.active, wt.highlightTarget]);

  useEffect(() => {
    setShowHint(false);
  }, [wt.stepIndex]);

  if (!wt.active || !wt.currentStep) return null;

  const padding = 8;
  const step = wt.currentStep;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    const tooltipWidth = 340;
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceRight = window.innerWidth - targetRect.right;

    if (spaceBelow > 200) {
      return {
        top: targetRect.bottom + 12,
        left: Math.max(16, Math.min(targetRect.left, window.innerWidth - tooltipWidth - 16)),
      };
    }
    if (spaceRight > tooltipWidth + 20) {
      return {
        top: Math.max(16, targetRect.top),
        left: targetRect.right + 12,
      };
    }
    return {
      top: Math.max(16, targetRect.top - 200),
      left: Math.max(16, targetRect.left),
    };
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'none' }}>
      {/* Dimmed overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <defs>
          <mask id="wt-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="6"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.5)"
          mask="url(#wt-mask)"
          onClick={(e) => e.stopPropagation()}
        />
      </svg>

      {/* Highlight border around target */}
      {targetRect && (
        <div
          className="absolute border-2 rounded-md animate-pulse"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            borderColor: '#049fd9',
            boxShadow: '0 0 20px rgba(4, 159, 217, 0.4)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Make the target element clickable through the overlay */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            pointerEvents: 'auto',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => {
            const el = document.querySelector(`[data-walkthrough="${wt.highlightTarget}"]`) as HTMLElement;
            if (el) el.click();
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-card border border-border rounded-lg shadow-2xl"
        style={{
          ...getTooltipStyle(),
          width: 340,
          pointerEvents: 'auto',
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border" style={{ background: '#049fd9', borderRadius: '8px 8px 0 0' }}>
          <span className="text-xs font-semibold text-white">
            Step {wt.stepIndex + 1} of {wt.totalSteps}
          </span>
          <button className="p-0.5 rounded hover:bg-white/20" onClick={wt.stopWalkthrough}>
            <X size={14} color="#fff" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div className="text-xs font-semibold" style={{ color: '#333' }}>{step.title}</div>
          <div className="text-[11px]" style={{ color: '#555' }}>{step.tooltipText || step.instruction}</div>

          {/* Form field hints */}
          {step.formFields && step.formFields.length > 0 && (
            <div className="rounded p-2 space-y-1" style={{ background: '#f0f8ff', border: '1px solid #049fd920' }}>
              <div className="text-[10px] font-semibold" style={{ color: '#049fd9' }}>Expected Values:</div>
              {step.formFields.map(f => (
                <div key={f.fieldId} className="text-[10px] flex gap-2">
                  <span style={{ color: '#666' }}>{f.label}:</span>
                  <span className="font-mono font-semibold" style={{ color: '#333' }}>{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hint toggle */}
          {step.hint && (
            <button
              className="flex items-center gap-1 text-[10px] hover:underline"
              style={{ color: '#049fd9' }}
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb size={10} /> {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          )}
          {showHint && (
            <div className="text-[10px] p-2 rounded" style={{ background: '#fffbe6', color: '#8a6d00', border: '1px solid #fbab1830' }}>
              💡 {step.hint}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border">
          <button
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded hover:bg-accent"
            style={{ color: '#888' }}
            onClick={wt.skipStep}
          >
            <SkipForward size={11} /> Skip
          </button>
          <div className="flex items-center gap-1">
            {/* Progress dots */}
            {Array.from({ length: wt.totalSteps }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i < wt.stepIndex ? '#6cc04a' : i === wt.stepIndex ? '#049fd9' : '#ddd',
                }}
              />
            ))}
          </div>
          <button
            className="flex items-center gap-1 text-[11px] px-3 py-1 rounded text-white"
            style={{ background: '#049fd9' }}
            onClick={wt.nextStep}
          >
            Next <ChevronRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughOverlay;
