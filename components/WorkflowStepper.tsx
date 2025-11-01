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
      <ol className="relative ml-4">
        {steps.map((step, index) => {
          const isCompleted = step.id <= completedStep;
          const isActive = step.id === activeStep;
          
          const circleClass = isCompleted 
            ? 'bg-green-500 ring-green-500/30' 
            : isActive 
            ? 'bg-cyan-500 ring-cyan-500/30 shadow-lg shadow-cyan-500/50' 
            : 'bg-gray-600 ring-gray-700';

          const textClass = isActive ? 'text-cyan-300 font-semibold' : 'text-gray-400 group-hover:text-gray-300';
          const descriptionClass = isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400';

          return (
            <li key={step.id} className="mb-8 relative">
              {index !== steps.length - 1 && (
                <div className={`absolute left-[1.125rem] top-12 -bottom-8 w-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              )}
              <div className="flex items-start space-x-5 cursor-pointer group" onClick={() => onStepClick(step.id)}>
                <div className="flex-shrink-0 relative">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ring-4 transition-all duration-300 ${circleClass}`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="pt-1.5">
                  <h3 className={`text-lg transition-colors duration-300 ${textClass}`}>{step.title}</h3>
                  <p className={`text-sm mt-0.5 transition-colors duration-300 ${descriptionClass}`}>{step.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};