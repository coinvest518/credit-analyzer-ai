
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
  handleDownloadAttempt: () => boolean;
  isPaid: boolean;
  currentUser: any;
}


export const StepDetail: React.FC<StepDetailProps> = (props) => {
  const { step, onNext, onPrev, isFirst, isLast, isStepActionComplete, isPaid, currentUser } = props;
  
  return (
    <div key={step.id} className="bg-gradient-to-br from-gray-50 via-white to-lime-50 border-2 border-lime-200 rounded-xl p-6 md:p-8 shadow-2xl shadow-lime-400/20 animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-br from-lime-400 to-lime-500 border-2 border-lime-600 p-3 rounded-lg shadow-lg shadow-lime-400/40">
          <step.icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-lime-600">Step {step.id}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h2>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {step.details.map((detail, index) => (
            <div key={index} className="flex items-start">
                <svg className="w-5 h-5 text-lime-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h4 className="font-semibold text-gray-900">{detail.title}</h4>
                    <p className="text-gray-700">{detail.text}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="my-8 border-t border-dashed border-lime-300"></div>

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
          className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Next Step"
        >
          {step.id === 1 ? "Let's Begin" : 
           step.id === 3 && (!currentUser || !isPaid) ? "Unlock Full Report" :
           'Next Step'}
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
