
import React from 'react';
import type { WorkflowStep, UploadedFile, AnalysisResult, ProcessingTask, LetterPackage, TrackingInfo } from '../types';
import { InteractiveStepContent } from './InteractiveStepContent';

interface StepDetailProps {
  step: WorkflowStep;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isStepActionComplete: boolean;
  
  // State and handlers
  isLoading: boolean;
  uploadedFile: UploadedFile | null;
  analysisResult: AnalysisResult | null;
  handleFileUpload: (file: File) => void;
  handleAnalyze: () => void;
  
  // Processing visualizer
  processingTasks: ProcessingTask[];
  currentTaskIndex: number;
  
  // Step 3 props
  summaryReport: string | null;
  actionPlan: string | null;
  handleGenerateReport: () => void;
  handleGenerateActionPlan: () => void;
  
  // Step 4 props
  letterPackage: LetterPackage | null;
  handleGenerateLetterPackage: () => void;

  // Step 5 props
  trackingInfo: TrackingInfo | null;
  handleSetupTracking: (info: TrackingInfo) => void;
}


export const StepDetail: React.FC<StepDetailProps> = (props) => {
  const { step, onNext, onPrev, isFirst, isLast, isStepActionComplete } = props;
  
  return (
    <div key={step.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:p-8 shadow-2xl shadow-gray-900/50 animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg">
          <step.icon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <span className="text-sm font-semibold text-cyan-400">Step {step.id}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h2>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {step.details.map((detail, index) => (
            <div key={index} className="flex items-start">
                <svg className="w-5 h-5 text-cyan-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h4 className="font-semibold text-gray-100">{detail.title}</h4>
                    <p className="text-gray-400">{detail.text}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="my-8 border-t border-dashed border-gray-600"></div>

      {/* Interactive Content Area */}
      <InteractiveStepContent {...props} />


      <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Previous Step"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLast || !isStepActionComplete}
          className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Next Step"
        >
          {step.id === 1 ? "Let's Begin" : 'Next Step'}
        </button>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
