
import React, { useState } from 'react';
import type { WorkflowStep, UploadedFile, AnalysisResult, ProcessingTask, AnalyzedAccount, LetterPackage, TrackingInfo } from '../types';
import { SpinnerIcon, FileIcon, CopyIcon, DownloadIcon, ShieldCheckIcon, CheckIcon, DocumentTextIcon, ListBulletIcon, QuoteIcon, LightbulbIcon, ExclamationTriangleIcon, ClipboardCheckIcon, ChevronDownIcon, PackageIcon, CalendarIcon, EmailIcon } from './icons/Icons';
import { ProcessingVisualizer } from './ProcessingVisualizer';

interface InteractiveStepContentProps {
  step: WorkflowStep;
  isLoading: boolean;
  uploadedFile: UploadedFile | null;
  analysisResult: AnalysisResult | null;
  handleFileUpload: (file: File) => void;
  handleAnalyze: () => void;
  // Step 3
  summaryReport: string | null;
  actionPlan: string | null;
  handleGenerateReport: () => void;
  handleGenerateActionPlan: () => void;
  // Step 4
  letterPackage: LetterPackage | null;
  handleGenerateLetterPackage: () => void;
  // Step 5
  trackingInfo: TrackingInfo | null;
  handleSetupTracking: (info: TrackingInfo) => void;
  // Processing visualizer
  processingTasks: ProcessingTask[];
  currentTaskIndex: number;
  handleDownloadAttempt: () => boolean;
}

// --- Reusable Components ---
const ActionButton: React.FC<{onClick: () => void; isLoading: boolean; text: string; loadingText: string; icon?: React.FC<any>}> = ({ onClick, isLoading, text, loadingText, icon: Icon }) => (
    <button onClick={onClick} disabled={isLoading} className="w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:transform-none flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
        {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-3 animate-spin" /> {loadingText}</> : <>{Icon && <Icon className="w-5 h-5 mr-3"/>}{text}</>}
    </button>
);

const SuccessMessage: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center space-x-4 animate-fade-in-slow">
        <FileIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
        <div><p className="font-bold text-lg text-green-300">{title}</p><div className="text-sm text-green-400">{children}</div></div>
    </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map(line => line.trim());
    return (
        <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) return <h4 key={index} className="text-xl font-semibold text-gray-100 mt-4 mb-2">{line.substring(2)}</h4>;
                if (line.startsWith('## ')) return <h5 key={index} className="text-lg font-semibold text-gray-200 mt-3 mb-1">{line.substring(3)}</h5>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={index} className="ml-5 list-disc list-outside marker:text-cyan-400">{line.substring(2)}</li>;
                const parts = line.split('**');
                const renderedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-100">{part}</strong> : <span key={i}>{part}</span>);
                return line === '' ? <div key={index} className="h-4"></div> : <p key={index} className="my-1">{renderedLine}</p>;
            })}
        </div>
    );
};

const GeneratedContentDisplay: React.FC<{ icon: React.FC<any>, title: string, content: string }> = ({ icon: Icon, title, content }) => (
    <div className="space-y-3 animate-fade-in-slow">
        <div className="flex items-center space-x-3 border-b border-gray-700 pb-2">
            <Icon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
            <h3 className="text-xl font-bold text-cyan-300">{title}</h3>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-lg">
             <MarkdownRenderer content={content} />
        </div>
    </div>
);

// --- Step-Specific Components ---
const FileUpload: React.FC<{onFileUpload: (file: File) => void; isLoading: boolean}> = ({ onFileUpload, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) onFileUpload(file); };
    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isEntering: boolean) => { e.preventDefault(); e.stopPropagation(); setIsDragging(isEntering); };
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => { handleDragEvents(e, false); const file = e.dataTransfer.files?.[0]; if (file) onFileUpload(file); };
    return (
        <div className={`text-center p-6 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-800/50'}`}>
            <label htmlFor="file-upload" className="cursor-pointer" onDragEnter={(e) => handleDragEvents(e, true)} onDragLeave={(e) => handleDragEvents(e, false)} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                <div className="text-cyan-400 mb-2"><svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                <p className="text-lg font-semibold text-gray-200">Drag & Drop or Click to Upload</p>
                <p className="text-sm text-gray-400">PDF, PNG, or JPG files are accepted</p>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" disabled={isLoading} />
        </div>
    );
};

const AccountAnalysisCard: React.FC<{account: AnalyzedAccount, isOpen: boolean, onToggle: () => void}> = ({ account, isOpen, onToggle }) => {
    const score = account.disputeStrengthScore;
    const scoreColor = score >= 7 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-red-400';
    const opportunities = account.strategicOpportunities;
    const issues = account.complexIssues;
    const hasOpportunitiesOrIssues = opportunities?.goodwillLetter || opportunities?.payForDelete || issues?.mixedFile || issues?.identityTheft;
    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
            <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/60 transition-colors duration-200">
                <div className="flex-1 min-w-0"><p className="font-semibold text-gray-200 truncate">{account.creditorName}</p><p className="text-sm text-gray-400 font-mono">{account.accountNumber}</p></div>
                <div className="flex items-center space-x-4 ml-4"><p className={`font-bold text-lg ${scoreColor}`}>{score}/10</p><ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></div>
            </button>
            {isOpen && (<div className="p-4 border-t border-gray-700/50 space-y-6 animate-fade-in-slow">
                <div><h4 className="font-semibold text-gray-200 mb-1">Account Summary</h4><p className="text-gray-400 text-sm">{account.summary}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded-lg space-y-2"><h4 className="font-semibold text-gray-300 mb-2 text-sm">Key Data</h4><div className="flex justify-between text-xs"><span className="text-gray-400">Amount:</span> <span className="font-mono text-gray-200">{account.amount ? `$${account.amount.toFixed(2)}` : 'N/A'}</span></div><div className="flex justify-between text-xs"><span className="text-gray-400">Status:</span> <span className="font-mono text-gray-200">{account.accountStatus || 'N/A'}</span></div><div className="flex justify-between text-xs"><span className="text-gray-400">Date Opened:</span> <span className="font-mono text-gray-200">{account.dateOpened || 'N/A'}</span></div><div className="flex justify-between text-xs"><span className="text-gray-400">Date Reported:</span> <span className="font-mono text-gray-200">{account.dateReported || 'N/A'}</span></div></div>
                    <div className="bg-gray-800 p-3 rounded-lg flex flex-col justify-center items-center"><h4 className="font-semibold text-gray-300 mb-2 text-sm">Dispute Strength</h4><div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden"><div className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score * 10}%` }}></div></div></div>
                </div>
                {hasOpportunitiesOrIssues && (<div><h4 className="font-semibold text-gray-300 mb-2 text-sm">Opportunities &amp; Issues</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{opportunities?.goodwillLetter && <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2"><LightbulbIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" /><p className="text-xs text-gray-300">Goodwill Letter Candidate</p></div>}{opportunities?.payForDelete && <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2"><LightbulbIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" /><p className="text-xs text-gray-300">Pay-for-Delete Candidate</p></div>}{issues?.mixedFile && <div className="bg-red-900/40 p-3 rounded-lg flex items-center space-x-2"><ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" /><p className="text-xs text-gray-300">Potential Mixed File</p></div>}{issues?.identityTheft && <div className="bg-red-900/40 p-3 rounded-lg flex items-center space-x-2"><ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" /><p className="text-xs text-gray-300">Potential Identity Theft</p></div>}</div></div>)}
                <div><h4 className="font-semibold text-gray-300 mb-2 text-sm">Potential Violations</h4><div className="space-y-3">{account.potentialViolations.length > 0 ? (account.potentialViolations.map((violation, index) => (<div key={index} className="bg-gray-800 p-3 rounded-lg flex items-start space-x-3"><ShieldCheckIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" /><div><p className="font-semibold text-gray-300 text-sm">{violation.violationCategory}<span className="ml-2 text-xs font-mono bg-gray-700 text-cyan-300 px-2 py-0.5 rounded-full">{violation.law}</span></p><p className="text-xs text-gray-400">{violation.description}</p>{violation.evidenceText && (<div className="mt-1 pt-1 border-t border-gray-700 flex items-start space-x-2 text-gray-500"><QuoteIcon className="w-3 h-3 flex-shrink-0 mt-0.5" /><p className="text-xs italic">"{violation.evidenceText}"</p></div>)}</div></div>))) : <p className="text-xs text-gray-500 p-2">No specific violations were identified for this account.</p>}</div></div>
                {account.recommendedNextSteps?.length > 0 && (<div><h4 className="font-semibold text-gray-300 mb-2 text-sm">Recommended Next Steps</h4><div className="space-y-2 bg-gray-800 p-3 rounded-lg">{account.recommendedNextSteps.map((step, index) => (<div key={index} className="flex items-start space-x-2"><div className="mt-1 w-3 h-3 flex-shrink-0 text-cyan-400"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></div><p className="text-gray-300 text-xs">{step}</p></div>))}</div></div>)}
            </div>)}
        </div>
    );
};

const AnalysisDisplay: React.FC<{result: AnalysisResult}> = ({ result }) => {
    const [openAccountId, setOpenAccountId] = useState<string | null>(result.analyzedAccounts?.[0]?.accountNumber || null);
    const handleToggle = (accountId: string) => { setOpenAccountId(openAccountId === accountId ? null : accountId); };
    return (<div className="space-y-6 animate-fade-in-slow">
        <h3 className="text-xl font-bold text-cyan-300 border-b border-gray-700 pb-2">AI Analysis Results</h3>
        <div className="bg-gray-900/50 p-4 rounded-lg"><h4 className="font-semibold text-gray-200 mb-1">Global Summary</h4><p className="text-gray-400 text-sm">{result.globalSummary || 'No summary provided.'}</p></div>
        {result.analyzedAccounts?.length > 0 ? (<div className="space-y-3"><h4 className="font-semibold text-gray-200">Identified Accounts ({result.analyzedAccounts.length})</h4>{result.analyzedAccounts.map((account, index) => (<AccountAnalysisCard key={account.accountNumber || index} account={account} isOpen={openAccountId === account.accountNumber} onToggle={() => handleToggle(account.accountNumber)} />))}</div>) : (<p className="text-sm text-gray-500 text-center py-4">No specific negative accounts were identified by the AI.</p>)}
    </div>);
};

const LetterPackageDisplay: React.FC<{letterPackage: LetterPackage}> = ({ letterPackage }) => {
    const [activeTab, setActiveTab] = useState(Object.keys(letterPackage)[0]);
    const handleDownloadPackage = () => {
        const content = Object.entries(letterPackage)
            .map(([key, value]) => `--- START: ${key.replace(/([A-Z])/g, ' $1').toUpperCase()} LETTER ---\n\n${value}\n\n--- END: ${key.replace(/([A-Z])/g, ' $1').toUpperCase()} LETTER ---\n\n\n`)
            .join('');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dispute-letter-package.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const TabButton: React.FC<{name: string, label: string}> = ({name, label}) => (
        <button onClick={() => setActiveTab(name)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${activeTab === name ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{label}</button>
    );
    return (
        <div className="space-y-4 animate-fade-in-slow">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-cyan-300">Generated Letter Package</h3>
                <button onClick={handleDownloadPackage} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2" title="Download All Letters"><DownloadIcon className="w-5 h-5" /><span>Download Package</span></button>
            </div>
            <div className="flex space-x-2 border-b border-gray-700 p-1">
                {letterPackage.creditBureau && <TabButton name="creditBureau" label="Credit Bureau" />}
                {letterPackage.debtCollector && <TabButton name="debtCollector" label="Debt Collector" />}
                {letterPackage.creditor && <TabButton name="creditor" label="Creditor" />}
                {letterPackage.cfpb && <TabButton name="cfpb" label="CFPB Complaint" />}
            </div>
            <div className="bg-gray-900 p-4 rounded-lg text-sm whitespace-pre-wrap border border-gray-700 max-h-96 overflow-y-auto font-serif">
                {letterPackage[activeTab as keyof LetterPackage]}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button onClick={() => alert('This is a simulation. This would open a file dialog to upload your own letter.')} className="w-full text-center px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-all">Upload Own Letter (Simulated)</button>
                <button onClick={() => alert('This is a simulation. This would initiate an OAuth flow to connect to Google Drive or another cloud service.')} className="w-full text-center px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-all">Connect to Cloud (Simulated)</button>
            </div>
        </div>
    );
};

const AIAgentSetup: React.FC<{onSetup: (info: TrackingInfo) => void}> = ({ onSetup }) => {
    const [info, setInfo] = useState<Partial<TrackingInfo>>({ isCertified: false, cfpbFiled: false, mailingDate: new Date().toISOString().split('T')[0] });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSetup(info as TrackingInfo); };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-slow bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-cyan-300">Activate AI Tracking Agent</h3>
            <p className="text-sm text-gray-400">Answer a few questions to set up automated deadline tracking and reminders.</p>
            <div>
                <label htmlFor="mailingDate" className="block text-sm font-medium text-gray-300 mb-1">1. What date were the letters mailed?</label>
                <input type="date" id="mailingDate" value={info.mailingDate} onChange={e => setInfo({...info, mailingDate: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. Were they sent via Certified Mail?</label>
                <div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="isCertified" checked={info.isCertified === true} onChange={() => setInfo({...info, isCertified: true})} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500" /> <span className="ml-2 text-gray-300">Yes</span></label><label className="flex items-center"><input type="radio" name="isCertified" checked={info.isCertified === false} onChange={() => setInfo({...info, isCertified: false})} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500" /> <span className="ml-2 text-gray-300">No</span></label></div>
            </div>
            {info.isCertified && <div className="animate-fade-in-slow">
                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-300 mb-1">Please enter the tracking number:</label>
                <input type="text" id="trackingNumber" value={info.trackingNumber || ''} onChange={e => setInfo({...info, trackingNumber: e.target.value})} placeholder="e.g., 9407803699300000000000" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-200 font-mono focus:ring-cyan-500 focus:border-cyan-500" />
            </div>}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. Was a CFPB complaint filed?</label>
                <div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="cfpbFiled" checked={info.cfpbFiled === true} onChange={() => setInfo({...info, cfpbFiled: true})} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500" /> <span className="ml-2 text-gray-300">Yes</span></label><label className="flex items-center"><input type="radio" name="cfpbFiled" checked={info.cfpbFiled === false} onChange={() => setInfo({...info, cfpbFiled: false})} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500" /> <span className="ml-2 text-gray-300">No</span></label></div>
            </div>
            <button type="submit" className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center">Activate Tracking</button>
        </form>
    )
};

const TrackingDisplay: React.FC<{info: TrackingInfo}> = ({ info }) => {
    const addDays = (dateStr: string, days: number) => { const date = new Date(dateStr); date.setDate(date.getDate() + days + 1); return date.toLocaleDateString(); }
    return (
        <div className="space-y-4 animate-fade-in-slow bg-gray-900/50 p-6 rounded-lg border border-gray-700">
             <h3 className="text-xl font-bold text-green-400">AI Tracking Agent is Active</h3>
             <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-md"><CalendarIcon className="w-5 h-5 text-cyan-400"/><p className="text-sm text-gray-300">CRA Reinvestigation Deadline (30 days): <strong className="text-white">{addDays(info.mailingDate, 30)}</strong></p></div>
                {info.cfpbFiled && <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-md"><CalendarIcon className="w-5 h-5 text-cyan-400"/><p className="text-sm text-gray-300">CFPB Response Deadline (15 days): <strong className="text-white">{addDays(info.mailingDate, 15)}</strong></p></div>}
             </div>
             <p className="text-xs text-gray-500 pt-2">The AI agent will now monitor these deadlines and can send reminders.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <button onClick={() => alert('This is a simulation. This would integrate with your calendar to add these deadlines.')} className="w-full flex items-center justify-center space-x-2 text-center px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-all"><CalendarIcon className="w-5 h-5" /><span>Connect to Calendar</span></button>
                <button onClick={() => alert('This is a simulation. This would connect to your email to monitor for responses.')} className="w-full flex items-center justify-center space-x-2 text-center px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-all"><EmailIcon className="w-5 h-5" /><span>Connect to Email</span></button>
            </div>
        </div>
    )
};


export const InteractiveStepContent: React.FC<InteractiveStepContentProps> = (props) => {
    const { step, isLoading, uploadedFile, analysisResult, handleFileUpload, handleAnalyze, processingTasks, currentTaskIndex, summaryReport, actionPlan, handleGenerateReport, handleGenerateActionPlan, letterPackage, handleGenerateLetterPackage, trackingInfo, handleSetupTracking } = props;

    if (isLoading && processingTasks.length > 0) return <ProcessingVisualizer tasks={processingTasks} currentTaskIndex={currentTaskIndex} />;

    const renderContent = () => {
        switch (step.id) {
            case 1:
                 return (
                    <div className="text-center space-y-4 animate-fade-in-slow p-4">
                        <h3 className="text-3xl font-bold text-white tracking-tight">Meet Your AI Assistant</h3>
                        <p className="text-lg text-gray-300 max-w-xl mx-auto">
                            Hello! I'm here to guide you through a secure, step-by-step process to analyze your documents, identify potential issues, and generate professional dispute letters.
                        </p>
                        <div className="bg-gray-900/50 p-4 rounded-lg mt-4 max-w-lg mx-auto">
                            <p className="font-semibold text-cyan-400">Ready to start?</p>
                            <p className="text-gray-400 text-sm">Click the "Let's Begin" button below to proceed to the first task: uploading your document.</p>
                        </div>
                    </div>
                );
            case 2:
                if (uploadedFile) return (<SuccessMessage title="Document Processed Successfully!"><p><strong>File:</strong> {uploadedFile.name}</p><p>The document is now ready for AI analysis in the next step.</p></SuccessMessage>);
                return <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />;
            case 3:
                if (analysisResult) return <AnalysisDisplay result={analysisResult} />;
                if (uploadedFile) return <ActionButton onClick={handleAnalyze} isLoading={isLoading} text="Begin AI Analysis" loadingText="Analyzing..." />;
                return <p className="text-center text-gray-500">Please upload and process a document in Step 2 to begin analysis.</p>;
            case 4:
                 if (analysisResult) {
                    if (summaryReport && actionPlan) {
                         const handleDownload = () => {
                            const content = `# Legal Strategy & Findings\n\n## Summary Report\n\n${summaryReport}\n\n## Action Plan\n\n${actionPlan}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a'); a.href = url; a.download = 'strategy-and-action-plan.txt';
                            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                        };
                        return (
                            <div className="space-y-6">
                                <GeneratedContentDisplay icon={DocumentTextIcon} title="Summary Report & Findings" content={summaryReport} />
                                <GeneratedContentDisplay icon={ListBulletIcon} title="Recommended Action Plan" content={actionPlan} />
                                <button onClick={handleDownload} className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all flex items-center justify-center space-x-2">
                                    <DownloadIcon className="w-5 h-5"/>
                                    <span>Download Strategy & Action Plan</span>
                                </button>
                            </div>
                        );
                    }
                    return (
                        <div className="space-y-4">
                            {!summaryReport ? 
                                <ActionButton onClick={handleGenerateReport} isLoading={isLoading} text="Generate Summary Report" loadingText="Generating Report..." /> :
                                <ActionButton onClick={handleGenerateActionPlan} isLoading={isLoading} text="Create Action Plan" loadingText="Creating Plan..." />
                            }
                        </div>
                    );
                 }
                return <p className="text-center text-gray-500">Complete analysis in Step 3 to generate a strategy.</p>;
            case 5:
                if (letterPackage) return <LetterPackageDisplay letterPackage={letterPackage} />;
                if (actionPlan) return <ActionButton onClick={handleGenerateLetterPackage} isLoading={isLoading} text="Generate Letter Package" loadingText="Generating Letters..." icon={PackageIcon} />;
                return <p className="text-center text-gray-500">Generate a strategy in Step 4 to create letters.</p>;
            case 6:
                if (trackingInfo) return <TrackingDisplay info={trackingInfo} />;
                if (letterPackage) return <AIAgentSetup onSetup={handleSetupTracking} />;
                return <p className="text-center text-gray-500">Generate a letter package in Step 5 to set up tracking.</p>;
            case 7:
                return <p className="text-center text-gray-500">This step outlines potential escalations based on the tracking from the previous step.</p>;
            default:
                return <p className="text-center text-gray-500">This step is for informational purposes.</p>;
        }
    };
    
    return <div className="min-h-[200px] flex flex-col justify-center"><style>{`@keyframes fade-in-slow { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in-slow { animation: fade-in-slow 0.6s ease-out forwards; }`}</style>{renderContent()}</div>;
};
