import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mistral } from "@mistralai/mistralai";
import { Header } from './components/Header';
import { WorkflowStepper } from './components/WorkflowStepper';
import { StepDetail } from './components/StepDetail';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';
import { EnvCheck } from './components/EnvCheck';
import { BlogAdmin } from './components/BlogAdmin';
import { useAuth } from './contexts/AuthContext';
import { usePayment } from './contexts/PaymentContext';
import { workflowSteps } from './constants';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { UploadedFile, AnalysisResult, ProcessingTask, LetterPackage, TrackingInfo } from './types';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isPaid, canDownload, markFreeDownloadUsed } = usePayment();
  const [activeStep, setActiveStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBlogAdmin, setShowBlogAdmin] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'true' && !currentUser) {
      setShowAuthModal(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);

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
      navigate('/pricing');
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
        // Block moving from Step 3 to Step 4 if not authenticated or not paid
        if (activeStep === 3) {
          if (!currentUser) {
            setShowAuthModal(true);
            return;
          }
          if (!canDownload) {
            navigate('/pricing');
            return;
          }
        }

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
        }, 150);
    });
  };

  const handleFileUpload = async (file: File) => {
    const tasks = activeStepData?.processingTasks || [];
    await runProcessingSequence(tasks);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const fileData: UploadedFile = {
            name: file.name,
            type: file.type,
            content: base64String,
        };

        // If user is logged in, upload to Firebase Storage
        if (currentUser) {
          try {
            const storageRef = ref(storage, `users/${currentUser.uid}/reports/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            // Save reference in Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
              reports: arrayUnion({
                name: file.name,
                url: downloadURL,
                uploadedAt: new Date().toISOString()
              })
            });
            
            fileData.url = downloadURL;
          } catch (error) {
            console.error("Error uploading to Firebase Storage:", error);
          }
        }

        setUploadedFile(fileData);
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
      setError("Please upload your credit report first.");
        return;
    }
    setAnalysisResult(null);

    const tasks = activeStepData?.processingTasks || [];
    await runProcessingSequence(tasks);
    
    try {
        const client = new Mistral({ apiKey: import.meta.env.VITE_MISTRAL_API_KEY! });
        
        // Step 1: OCR - Extract text and tables from document
        const isPdf = uploadedFile.type.includes('pdf');
        const dataUrl = `data:${uploadedFile.type};base64,${uploadedFile.content}`;
        
        const ocrResponse = await client.ocr.process({
            model: 'mistral-ocr-latest',
            document: isPdf ? {
                type: 'document_url',
                documentUrl: dataUrl
            } : {
                type: 'image_url',
                imageUrl: dataUrl
            },
            tableFormat: 'html'
        });
        
        // Combine all pages markdown content
        const extractedText = ocrResponse.pages.map(page => page.markdown).join('\n\n');
        
        // Step 2: Analyze extracted text with Mistral-Large
        const analysisPrompt = `Act as an expert paralegal specializing in consumer credit law. Analyze this credit report and identify ALL negative or inaccurate accounts.

Credit Report Content:
${extractedText}

Provide analysis as JSON:
{
  "globalSummary": "Brief overview",
  "analyzedAccounts": [
    {
      "creditorName": "string",
      "accountNumber": "string",
      "amount": number,
      "dateOpened": "string",
      "dateReported": "string",
      "accountStatus": "string",
      "potentialViolations": [
        {
          "law": "FCRA|FDCPA|TCPA|OTHER",
          "violationCategory": "string",
          "description": "string",
          "evidenceText": "exact quote"
        }
      ],
      "strategicOpportunities": {"goodwillLetter": boolean, "payForDelete": boolean},
      "complexIssues": {"mixedFile": boolean, "identityTheft": boolean},
      "summary": "string",
      "disputeStrengthScore": number,
      "recommendedNextSteps": ["string"]
    }
  ]
}

Return ONLY valid JSON.`;

        const response = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: analysisPrompt }],
            responseFormat: { type: 'json_object' }
        });
        
        const jsonResponse = JSON.parse(String(response.choices[0].message.content || '{}'));
        setAnalysisResult(jsonResponse);
        setCompletedStep(Math.max(completedStep, 3));
    } catch (e: any) {
        setError(`Analysis failed: ${e.message}. Please try again or contact support.`);
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
        const client = new Mistral({ apiKey: import.meta.env.VITE_MISTRAL_API_KEY! });
        
        // Create compact account list
        const accountList = analysisResult.analyzedAccounts?.map(acc => 
          `${acc.creditorName} (${acc.accountNumber})`).join(', ') || 'No accounts';
        const violationCount = analysisResult.analyzedAccounts?.reduce((sum, acc) => 
          sum + acc.potentialViolations.length, 0) || 0;
        
        const prompt = `You are a consumer law expert. Generate a consolidated narrative summary report for a layperson.

Global Summary: ${analysisResult.globalSummary}

Accounts (${analysisResult.analyzedAccounts?.length || 0}): ${accountList}
Total Violations Found: ${violationCount}

For each account, explain violations referencing relevant laws (FCRA, FDCPA) and why it matters to the consumer. Use markdown formatting (# Heading, ## Account, - List, **bold**).`;
        
        const response = await client.chat.complete({ model: 'mistral-large-latest', messages: [{ role: 'user', content: prompt }] });
        setSummaryReport(String(response.choices[0].message.content || ''));
    } catch (e: any) { setError(`Report generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateActionPlan = async () => {
    if (!analysisResult || !summaryReport) { setError("Analysis or report data is missing."); return; }
    setIsLoading(true); setError(null);
    try {
        const client = new Mistral({ apiKey: import.meta.env.VITE_MISTRAL_API_KEY! });
        
        // Compact data for prompt
        const accountCount = analysisResult.analyzedAccounts?.length || 0;
        const accountNames = analysisResult.analyzedAccounts?.map(a => a.creditorName).slice(0, 5).join(', ') || 'accounts';
        const hasCollections = analysisResult.analyzedAccounts?.some(a => a.accountStatus?.toLowerCase().includes('collection'));
        
        const prompt = `Create a prioritized, step-by-step action plan for a consumer with ${accountCount} problematic credit accounts.

Accounts include: ${accountNames}${accountCount > 5 ? ' and others' : ''}.
Collection accounts: ${hasCollections ? 'Yes' : 'No'}

Consolidate actions (e.g., "Draft dispute letters for all accounts"). Explain each step clearly:
1. Draft dispute letters
2. Send via Certified Mail
3. Calendar 30-day follow-ups

Use markdown formatting. Be specific and actionable.`;
        
        const response = await client.chat.complete({ model: 'mistral-large-latest', messages: [{ role: 'user', content: prompt }] });
        setActionPlan(String(response.choices[0].message.content || ''));
        setCompletedStep(Math.max(completedStep, 4));
    } catch (e: any) { setError(`Action plan generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateLetterPackage = async () => {
    if (!analysisResult || !actionPlan) { setError("Analysis and action plan must be generated first."); return; }
    setIsLoading(true); setError(null);
    try {
        const client = new Mistral({ apiKey: import.meta.env.VITE_MISTRAL_API_KEY! });
        
        // Create compact summary of accounts for prompt
        const accountSummary = analysisResult.analyzedAccounts?.map(acc => 
          `${acc.creditorName} (${acc.accountNumber}): ${acc.accountStatus}, Amount: $${acc.amount}, Violations: ${acc.potentialViolations.map(v => v.law).join(', ')}`
        ).join('\n') || 'No accounts';

        // Generate ALL 4 letters in ONE API call with JSON response
        const prompt = `You are a consumer law expert. Generate ALL 4 dispute letters based on this credit analysis.

Accounts:
${accountSummary}

Global Summary: ${analysisResult.globalSummary}

Generate a JSON response with ALL 4 letters:
{
  "creditBureau": "Formal FCRA Section 611 dispute letter to credit bureaus (Experian, TransUnion, Equifax). For EACH account, demand reinvestigation and deletion. Include placeholders [Your Name], [Your Address], [Date].",
  "debtCollector": "FDCPA Section 809 debt validation letter demanding proof and cease of collection activities. Include placeholders.",
  "creditor": "Direct dispute or goodwill letter to original creditor. For disputes, cite billing errors. For goodwill, request deletion politely. Include placeholders.",
  "cfpb": "CFPB complaint summary outlining FCRA non-compliance and demanding account deletion. Include placeholders."
}

Return ONLY valid JSON with complete, professional letters.`;

        const response = await client.chat.complete({ 
          model: 'mistral-large-latest', 
          messages: [{ role: 'user', content: prompt }],
          responseFormat: { type: 'json_object' }
        });
        
        const generated = JSON.parse(String(response.choices[0].message.content || '{}'));
        setLetterPackage(generated);
        setCompletedStep(Math.max(completedStep, 5));

    } catch (e: any) { setError(`Letter package generation failed: ${e.message}`); console.error(e); } finally { setIsLoading(false); }
  }

  const handleSetupTracking = (info: TrackingInfo) => {
    setTrackingInfo(info);
    setCompletedStep(Math.max(completedStep, 6));
  };

  useEffect(() => {
    document.title = 'AI Credit Report Analyzer - Free Credit Analysis & Dispute Letters';
    
    // Admin keyboard shortcut: Ctrl+Shift+B
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        setShowBlogAdmin(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (showBlogAdmin) {
    return <BlogAdmin onBackClick={() => setShowBlogAdmin(false)} />;
  }

  return (
    <>
        <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          onSignInClick={() => setShowAuthModal(true)}
          onUpgradeClick={() => navigate('/pricing')}
          onBlogClick={() => navigate('/blog')}
        />
        {/* Secret Admin Access - Press Ctrl+Shift+B */}
        {typeof window !== 'undefined' && (
          <div style={{ position: 'fixed', bottom: 0, right: 0, opacity: 0.01, fontSize: '1px' }}>
            <button onClick={() => setShowBlogAdmin(true)}>Admin</button>
          </div>
        )}
        <main className="container mx-auto px-4 py-4 sm:py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">AI Credit Report Analysis</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Follow the steps to analyze your credit report and generate disputes.</p>
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
                  isPaid={isPaid}
                  currentUser={currentUser}
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