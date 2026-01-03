import { AgentIcon, UploadIcon, AIEngineIcon, ReportIcon, CommunicationIcon, TrackingIcon, SpecialistIcon } from './components/icons/Icons';
import type { WorkflowStep } from './types';

export const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: 'Meet Your AI Credit Report Analyst',
    icon: AgentIcon,
    description: 'Start your journey to a better credit score with your AI-powered credit report analyzer.',
    details: [
      { title: 'Welcome', text: 'I am a fine-tuned AI agent model, trained on consumer protection laws to help you understand and improve your credit report.' },
      { title: 'How I Work', text: 'I will guide you through a step-by-step process to analyze your credit report, identify inaccuracies, and generate dispute letters.' },
      { title: 'Secure & Confidential', text: 'Your data is processed securely and remains confidential at all times.' },
      { title: 'Getting Started', text: 'Click "Let\'s Begin" to upload your credit report.' },
    ],
  },
  {
    id: 2,
    title: 'Upload Your Credit Report',
    icon: UploadIcon,
    description: 'Securely upload your credit report to begin the analysis.',
    details: [
      { title: 'Secure Upload', text: 'Upload your credit report in PDF format. Your data is encrypted and secure.' },
      { title: 'File Parsing', text: 'My AI will parse your credit report, extracting all the necessary information for analysis.' },
      { title: 'Data Extraction', text: 'I will identify and categorize all the elements of your credit report, including personal information, credit accounts, and inquiries.' },
    ],
    processingTasks: [
      { name: 'Uploading file...' },
      { name: 'Securing connection...' },
      { name: 'Parsing document structure...' },
      { name: 'Extracting raw text...' },
      { name: 'Finalizing intake...' },
    ]
  },
  {
    id: 3,
    title: 'AI-Powered Analysis',
    icon: AIEngineIcon,
    description: 'My core AI engine will analyze your credit report for inaccuracies and potential issues.',
    details: [
      { title: 'In-Depth Analysis', text: 'I will meticulously analyze your credit report, looking for any inaccuracies, errors, or signs of fraud.' },
      { title: 'Violation Detection', text: 'I am trained to detect potential violations of consumer protection laws like the FCRA and FDCPA.' },
      { title: 'Dispute Strategy', text: 'Based on my analysis, I will develop a personalized dispute strategy to help you address any issues found.' },
      { title: 'Statute of Limitations', text: 'I will also check for accounts that are past the statute of limitations for debt collection.' },
    ],
    processingTasks: [
      { name: 'Initializing AI Core...' },
      { name: 'Analyzing document context...' },
      { name: 'Extracting key entities...' },
      { name: 'Scanning for violations...' },
      { name: 'Scoring dispute strength...' },
      { name: 'Contacting Mistral AI...' },
    ]
  },
  {
    id: 4,
    title: 'Your Personalized Report',
    icon: ReportIcon,
    description: 'Review your personalized credit report analysis and action plan.',
    details: [
      { title: 'Summary of Findings', text: 'I will provide you with a clear and concise summary of my findings, highlighting any potential issues.' },
      { title: 'Legal Basis for Disputes', text: 'I will explain the legal basis for any recommended disputes, citing relevant consumer protection laws.' },
      { title: 'Step-by-Step Action Plan', text: 'I will provide you with a step-by-step action plan to help you address the identified issues.' },
      { title: 'Downloadable Report', text: 'You will be able to download your complete analysis and action plan for your records.' },
    ],
  },
  {
    id: 5,
    title: 'Generate Dispute Letters',
    icon: CommunicationIcon,
    description: 'Generate a package of tailored dispute letters to send to the credit bureaus and creditors.',
    details: [
      { title: 'Credit Bureau Letters', text: 'Generate dispute letters to the credit bureaus (Experian, TransUnion, Equifax) to request the removal of inaccurate information.' },
      { title: 'Debt Collector Letters', text: 'Create letters to debt collectors to request validation of debts or to stop collection activities.' },
      { title: 'Creditor Letters', text: 'Draft letters to original creditors to dispute inaccurate information or to request a goodwill deletion.' },
      { title: 'Downloadable Package', text: 'All generated letters will be available for you to download and send.' },
    ],
  },
  {
    id: 6,
    title: 'Track Your Disputes',
    icon: TrackingIcon,
    description: 'Keep track of your disputes and get reminders for follow-ups.',
    details: [
      { title: 'Dispute Tracking', text: 'I will help you track the status of your disputes and provide you with updates as they become available.' },
      { title: 'Automated Reminders', text: 'I will send you reminders for important deadlines, such as when to follow up on your disputes.' },
      { title: 'Compliance Monitoring', text: 'I will monitor the credit bureaus and creditors for compliance with consumer protection laws.' },
    ],
  },
  {
    id: 7,
    title: 'Escalate and Enforce',
    icon: SpecialistIcon,
    description: 'Learn about your options for escalation if your disputes are not resolved.',
    details: [
      { title: 'CFPB Complaints', text: 'I can help you prepare a complaint to the Consumer Financial Protection Bureau (CFPB).' },
      { title: 'Intent-to-Sue Notice', text: 'I can generate a formal notice of intent to sue as a final step before potential legal action.' },
      { title: 'Small Claims Court', text: 'I can provide you with information and resources to help you prepare for small claims court.' },
      { title: 'Damages Logging', text: 'I will help you log all outcomes and communications for potential damages claims.' },
    ],
  },
];