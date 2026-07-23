import React from 'react';
import { CheckCircle2, CircleDashed } from 'lucide-react';

export type StepperStage = 'evidence' | 'pipeline' | 'review' | 'export';

interface ProgressStepperProps {
  activeStage: StepperStage;
  approvedCount: number;
  totalSections: number;
  onSelectStage: (stage: StepperStage) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  activeStage,
  approvedCount,
  totalSections,
  onSelectStage,
}) => {
  const steps: { id: StepperStage; label: string; number: string }[] = [
    { id: 'evidence', label: '1. Curriculum Evidence', number: '1' },
    { id: 'pipeline', label: '2. Pipeline Generation', number: '2' },
    { id: 'review', label: '3. Human Review', number: '3' },
    { id: 'export', label: '4. Export Pack', number: '4' },
  ];

  return (
    <div className="h-12 bg-white border-b border-orange-100 flex items-center px-6 md:px-8 shrink-0 overflow-x-auto shadow-xs">
      <div className="flex items-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-wider shrink-0">
        {steps.map((step, idx) => {
          const isActive = activeStage === step.id;
          const isPast =
            (step.id === 'evidence' && activeStage !== 'evidence') ||
            (step.id === 'pipeline' && (activeStage === 'review' || activeStage === 'export')) ||
            (step.id === 'review' && activeStage === 'export');

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && <span className="text-orange-200 select-none">/</span>}
              <button
                onClick={() => onSelectStage(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-bright-orange text-white shadow-xs'
                    : isPast
                    ? 'text-primary-purple hover:bg-purple-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-purple" />
                ) : (
                  <CircleDashed className="w-3.5 h-3.5 opacity-70" />
                )}
                <span>{step.label}</span>
                {step.id === 'review' && totalSections > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      isActive ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {approvedCount}/{totalSections}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
