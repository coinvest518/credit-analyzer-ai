import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { WorkflowStepper } from './components/WorkflowStepper';
import { StepDetail } from './components/StepDetail';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';
import { EnvCheck } from './components/EnvCheck';
import { useAuth } from './contexts/AuthContext';
import { usePayment } from './contexts/PaymentContext';
import { workflowSteps } from './constants';
import type { UploadedFile, AnalysisResult, ProcessingTask, LetterPackage, TrackingInfo } from './types';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { isPaid, canDownload, markFreeDownloadUsed } = usePayment();
  const [activeStep, setActiveStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // App state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // State for Step 3
  const [summaryReport, setSummaryReport] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  
  // State for Step 4
  const [letterPackage, setLetterPackage] = useState<LetterPackage | null>(null);

  // State for Step 5
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);

  // State for processing visualization
  const [processingTasks, setProcessingTasks] = useState<ProcessingTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const activeStepData = workflowSteps.find(step => step.id === activeStep);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
  };
  
  const isStepActionComplete = (stepId: number): boolean => {
    switch (stepId) {
        case 1: return true; // Intro step is always complete
        case 2: return uploadedFile !== null;
        case 3: return analysisResult !== null;
        case 4: return summaryReport !== null && actionPlan !== null;
        case 5: return letterPackage !== null;
        case 6: return trackingInfo !== null;
        case 7: return trackingInfo !== null; // Step 7 is informational, depends on step 6
        default: return false;
    }
  };

  const handleDownloadAttempt = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return false;
    }
    if (!canDownload) {
      setShowPaymentModal(true);
      return false;
    }
    if (!isPaid) {
      markFreeDownloadUsed();
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep < workflowSteps.length) {
      if (isStepActionComplete(activeStep)) {
        setCompletedStep(Math.max(completedStep, activeStep));
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const runProcessingSequence = (tasks: ProcessingTask[]): Promise<void> => {
    return new Promise((resolve) => {
        setIsLoading(true);
        setProcessingTasks(tasks);
        setCurrentTaskIndex(0);
        setError(null);

        let currentTask = 0;
        const interval = setInterval(() => {
            if (currentTask < tasks.length - 1) {
                currentTask++;
                setCurrentTaskIndex(currentTask);
            } else {
                clearInterval(interval);
                resolve();
            }
        }, 800);
    });
  };

  const handleFileUpload = async (file: File) => {
    const tasks = activeStepData?.processingTasks || [];
    await runProcessingSequence(tasks);
    
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedFile({
            name: file.name,
            type: file.type,
            content: base64String,
        });
        setCompletedStep(Math.max(completedStep, 2));
        setIsLoading(false);
        setProcessingTasks([]);
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
        setProcessingTasks([]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
        setError("Please upload a document first.");
        return;
    }
    setAnalysisResult(null);

    const tasks = activeStepData?.processingTasks || [];
    await runProcessingSequence(tasks);
    
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
        const imagePart = { inlineData: { mimeType: uploadedFile.type, data: uploadedFile.content } };
        const textPart = { text: `Act as an expert paralegal specializing in consumer credit law. Perform a forensic analysis of the provided document to identify ALL negative or inaccurate accounts.

1.  **High-Level Summary**: Start with a brief 'globalSummary' of the overall findings.
2.  **Detailed Account Analysis**: Create an array called 'analyzedAccounts'. For EACH negative or inaccurate account you find, create a separate JSON object in this array with the following details:
    *   \`creditorName\`, \`accountNumber\`, \`amount\`, \`dateOpened\`, \`dateReported\`, \`accountStatus\`. (If a value is not present, return a descriptive string like "Not Found").
    *   \`potentialViolations\`: An array of potential violations (FCRA, FDCPA, etc.). For EACH violation, you MUST quote the exact text as \`evidenceText\`. This field cannot be empty.
    *   \`strategicOpportunities\`: Determine if it's a candidate for a \`goodwillLetter\` or \`payForDelete\`.
    *   \`complexIssues\`: Look for signs of a \`mixedFile\` or \`identityTheft\`.
    *   \`summary\`: A concise summary for THIS SPECIFIC account.
    *   \`disputeStrengthScore\`: A score from 1-10 based on evidence for this account.
    *   \`recommendedNextSteps\`: A list of clear, actionable next steps for this account.
3.  **Strict JSON Output**: You MUST respond ONLY with a single JSON object that strictly adheres to the provided schema. Do not include any explanatory text or markdown formatting.` };

        const analyzedAccountSchema = {
            type: Type.OBJECT, properties: {
                creditorName: { type: Type.STRING, description: "The name of the creditor. Return 'Not Found' if not present." },
                accountNumber: { type: Type.STRING, description: "The full account number. Return 'Not Found' if not present." },
                amount: { type: Type.NUMBER, description: "The precise monetary amount. Return 0 if not present." },
                dateOpened: { type: Type.STRING, description: "The date the account was opened. Return 'Not Found' if not present." },
                dateReported: { type: Type.STRING, description: "The date the account was last reported. Return 'Not Found' if not present." },
                accountStatus: { type: Type.STRING, description: "The current status of the account. Return 'Not Found' if not present." },
                potentialViolations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                    law: { type: Type.STRING, enum: ['FCRA', 'FDCPA', 'TCPA', 'OTHER'] },
                    violationCategory: { type: Type.STRING },
                    description: { type: Type.STRING },
                    evidenceText: { type: Type.STRING, description: "CRITICAL: The exact quote from the document that is evidence of the violation. This field must not be empty." }
                }, required: ['law', 'violationCategory', 'description', 'evidenceText']}},
                summary: { type: Type.STRING },
                disputeStrengthScore: { type: Type.NUMBER },
                strategicOpportunities: { type: Type.OBJECT, properties: {
                    goodwillLetter: { type: Type.BOOLEAN, description: "True if a goodwill letter is a viable strategy." },
                    payForDelete: { type: Type.BOOLEAN, description: "True if pay-for-delete negotiation is a viable strategy." }
                }, required: ['goodwillLetter', 'payForDelete']},
                complexIssues: { type: Type.OBJECT, properties: {
                    mixedFile: { type: Type.BOOLEAN, description: "True if there are signs of a mixed credit file." },
                    identityTheft: { type: Type.BOOLEAN, description: "True if there are signs of identity theft." }
                }, required: ['mixedFile', 'identityTheft']},
                recommendedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable next steps for the consumer for this specific account." }
            }, required: [
                'creditorName', 'accountNumber', 'potentialViolations', 'summary', 'disputeStrengthScore', 
                'strategicOpportunities', 'complexIssues', 'recommendedNextSteps'
            ]
        };

        const responseSchema = {
            type: Type.OBJECT, properties: {
                globalSummary: { type: Type.STRING, description: "A brief, high-level summary of the overall findings from the entire document." },
                analyzedAccounts: { type: Type.ARRAY, items: analyzedAccountSchema }
            }, required: ['globalSummary', 'analyzedAccounts']
        };

        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: { parts: [imagePart, textPart] }, config: { responseMimeType: "application/json", responseSchema }});
        
        const cleanedText = response.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const jsonResponse = JSON.parse(cleanedText);
        setAnalysisResult(jsonResponse);
        setCompletedStep(Math.max(completedStep, 3));
    } catch (e: any) {
        setError(`Analysis failed: ${e.message}. The AI may have returned an unexpected format.`);
        console.error(e);
    } finally {
        setIsLoading(false);
        setProcessingTasks([]);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisResult) { setError("Analysis data is missing."); return; }
    setIsLoading(true); setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
        const prompt = `You are a consumer law expert. Based on the following structured analysis of a credit document which contains multiple accounts, generate a single, consolidated narrative summary report. The report should be easy for a layperson to understand. Start with the 'globalSummary', then, for each account in the 'analyzedAccounts' array, create a section. In each section, explain the potential violations in detail, referencing the relevant law (e.g., FCRA, FDCPA) and explaining *why* it's a violation and what it means for the consumer. Analysis Data: ${JSON.stringify(analysisResult, null, 2)}. Generate the report now. Use markdown for formatting (e.g., # Heading, ## Account Heading, - List item, **bold**).`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        setSummaryReport(response.text);
    } catch (e: any) { setError(`Report generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateActionPlan = async () => {
    if (!analysisResult || !summaryReport) { setError("Analysis or report data is missing."); return; }
    setIsLoading(true); setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
        const prompt = `Based on the provided multi-account analysis and summary report, create a single, clear, step-by-step action plan for the consumer. The plan should be prioritized and actionable. Consolidate actions where possible (e.g., "Draft dispute letters for all identified accounts"). For each step, explain what the user needs to do. For example, "1. Draft a Dispute Letter addressing all accounts mentioned in the report," "2. Send each letter via Certified Mail to the relevant bureau," "3. Calendar a 30-day follow-up for each dispute." Analysis Data: ${JSON.stringify(analysisResult, null, 2)}. Summary Report: ${summaryReport}. Generate the action plan now using markdown.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setActionPlan(response.text);
        setCompletedStep(Math.max(completedStep, 4));
    } catch (e: any) { setError(`Action plan generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateLetterPackage = async () => {
    if (!analysisResult || !actionPlan) { setError("Analysis and action plan must be generated first."); return; }
    setIsLoading(true); setError(null);
    const generated: LetterPackage = {};
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
        const analysisData = JSON.stringify(analysisResult, null, 2);

        // 1. Credit Bureau Letter (FCRA)
        let prompt = `Based on the credit analysis data, generate a formal dispute letter to the credit bureaus (e.g., Experian, TransUnion, Equifax). The letter must comply with FCRA Section 611. For EACH account in 'analyzedAccounts', create a distinct section demanding a reinvestigation and deletion of the inaccurate item. Reference specific account numbers and creditors. Analysis Data: ${analysisData}. Generate the letter now. Include placeholders like [Your Name], [Your Address], and [Date].`;
        let response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        generated.creditBureau = response.text;

        // 2. Debt Collector Letter (FDCPA)
        prompt = `Based on the credit analysis data, generate a formal debt validation letter to a debt collector under FDCPA Section 809. The letter should state that the consumer refuses to pay until the debt is validated. It must demand proof of the debt and cease all collection activities until validation is provided. Reference the relevant account(s). Analysis Data: ${analysisData}. Generate the letter now. Include placeholders.`;
        response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        generated.debtCollector = response.text;
        
        // 3. Creditor Letter
        prompt = `Based on the credit analysis data, generate a direct dispute or goodwill letter to the original creditor. For direct disputes, point out the specific billing error or inaccuracy. For goodwill candidates, politely request a "goodwill deletion" of a late payment, acknowledging past issues but highlighting a good payment history otherwise. Select the most appropriate tone based on the analysis. Analysis Data: ${analysisData}. Generate the letter now. Include placeholders.`;
        response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        generated.creditor = response.text;

        // 4. CFPB Complaint Letter
        prompt = `Based on the credit analysis data, draft a formal complaint summary to be filed with the Consumer Financial Protection Bureau (CFPB). This should be a concise summary of the issue, outlining the failure of the credit bureau or furnisher to comply with the FCRA after a dispute was sent. Clearly state the desired resolution (e.g., "Deletion of the inaccurate account"). Analysis Data: ${analysisData}. Generate the complaint summary now.`;
        response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        generated.cfpb = response.text;

        setLetterPackage(generated);
        setCompletedStep(Math.max(completedStep, 5));

    } catch (e: any) { setError(`Letter package generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  }

  const handleSetupTracking = (info: TrackingInfo) => {
    setTrackingInfo(info);
    setCompletedStep(Math.max(completedStep, 6));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
        <Header 
          onSignInClick={() => setShowAuthModal(true)}
          onUpgradeClick={() => setShowPaymentModal(true)}
        />
        <main className="container mx-auto px-4 py-4 sm:py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3 sm:mb-4">AI Credit Analysis</h2>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Follow the steps to analyze your credit report and generate disputes.</p>
                <WorkflowStepper steps={workflowSteps} activeStep={activeStep} completedStep={completedStep} onStepClick={handleStepClick} />
              </div>
            </div>
            <div className="lg:col-span-3">
              {error && (<div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>)}
              {activeStepData && (
                <StepDetail 
                  step={activeStepData} onNext={handleNext} onPrev={handlePrev} isFirst={activeStep === 1} isLast={activeStep === workflowSteps.length} isStepActionComplete={isStepActionComplete(activeStep)}
                  isLoading={isLoading} 
                  uploadedFile={uploadedFile} 
                  analysisResult={analysisResult} 
                  handleFileUpload={handleFileUpload} 
                  handleAnalyze={handleAnalyze} 
                  processingTasks={processingTasks} 
                  currentTaskIndex={currentTaskIndex}
                  // Step 3 props
                  summaryReport={summaryReport} 
                  actionPlan={actionPlan} 
                  handleGenerateReport={handleGenerateReport} 
                  handleGenerateActionPlan={handleGenerateActionPlan}
                  // Step 4 props
                  letterPackage={letterPackage}
                  handleGenerateLetterPackage={handleGenerateLetterPackage}
                  // Step 5 props
                  trackingInfo={trackingInfo}
                  handleSetupTracking={handleSetupTracking}
                  // Download protection
                  handleDownloadAttempt={handleDownloadAttempt}
                />
              )}
            </div>
          </div>
        </main>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
        />
        <Footer />
        <EnvCheck />
      </div>
    </>
  );
};

export default App;