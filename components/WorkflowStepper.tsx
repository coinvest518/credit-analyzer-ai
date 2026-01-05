import React from 'react';
import type { WorkflowStep } from '../types';

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  activeStep: number;
  completedStep: number;
  onStepClick: (stepId: number) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ steps, activeStep, completedStep, onStepClick }) => {
  return (
    <nav aria-label="Progress">
      <ol className="relative ml-2 sm:ml-4">
        {steps.map((step, index) => {
          const isCompleted = step.id <= completedStep;
          const isActive = step.id === activeStep;
          
          const circleClass = isCompleted 
            ? 'bg-green-500 ring-green-500/30' 
            : isActive 
            ? 'bg-primary ring-primary/30 shadow-lg shadow-primary/50' 
            : 'bg-gray-600 ring-gray-700';

          const textClass = isActive ? 'text-primary font-semibold' : 'text-muted-foreground group-hover:text-foreground';
          const descriptionClass = isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground';

          return (
            <li key={step.id} className="mb-6 sm:mb-8 relative">
              {index !== steps.length - 1 && (
                <div className={`absolute left-[1rem] sm:left-[1.125rem] top-10 sm:top-12 -bottom-6 sm:-bottom-8 w-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              )}
              <div className="flex items-start space-x-3 sm:space-x-5 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-gray-800/50 transition-colors" onClick={() => onStepClick(step.id)}>
                <div className="flex-shrink-0 relative">
                  <div className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ring-2 sm:ring-4 transition-all duration-300 ${circleClass}`}>
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="pt-1 sm:pt-1.5 min-w-0 flex-1">
                  <h3 className={`text-base sm:text-lg transition-colors duration-300 ${textClass}`}>{step.title}</h3>
                  <p className={`text-xs sm:text-sm mt-0.5 transition-colors duration-300 ${descriptionClass} line-clamp-2`}>{step.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};