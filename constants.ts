
import { AgentIcon, UploadIcon, AIEngineIcon, ReportIcon, CommunicationIcon, TrackingIcon, SpecialistIcon } from './components/icons/Icons';
import type { WorkflowStep } from './types';

export const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: 'Meet Your AI Agent',
    icon: AgentIcon,
    description: 'Start here. Your AI agent will guide you through the process.',
    details: [
      { title: 'Introduction', text: 'I am your AI-powered credit repair assistant, designed to simplify the dispute process.' },
      { title: 'Guided Process', text: 'I will walk you through each step, from uploading documents to generating letters.' },
      { title: 'Secure & Confidential', text: 'Your data is processed securely and remains confidential at all times.' },
      { title: 'Getting Started', text: 'Click "Let\'s Begin" to move to the first task: Document Intake.' },
    ],
  },
  {
    id: 2,
    title: 'Document Intake',
    icon: UploadIcon,
    description: 'Securely upload your documents to begin the analysis.',
    details: [
      { title: 'Trigger', text: 'Process starts via Webhook or Chat for document uploads.' },
      { title: 'File Parsing', text: 'AI parses various formats like PDFs, images (JPG, PNG), and emails.' },
      { title: 'Document Classification', text: 'Automatically categorizes documents: credit reports, collection letters, court statements, etc.' },
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
    title: 'AI Analysis Engine',
    icon: AIEngineIcon,
    description: 'The AI core extracts data and identifies potential issues.',
    details: [
      { title: 'Data Extraction', text: 'Extracts key data points: account numbers, dates, amounts, and creditor information.' },
      { title: 'Violation Detection', text: 'Scans for errors and potential violations under FCRA, FDCPA, and TCPA.' },
      { title: 'Dispute Scoring', text: 'Analyzes and scores the strength of each potential dispute case.' },
      { title: 'Statute of Limitations', text: 'Tracks and flags accounts nearing or past the statute of limitations for debt collection.' },
    ],
    processingTasks: [
      { name: 'Initializing AI Core...' },
      { name: 'Analyzing document context...' },
      { name: 'Extracting key entities...' },
      { name: 'Scanning for violations...' },
      { name: 'Scoring dispute strength...' },
      { name: 'Contacting Gemini AI...' },
    ]
  },
  {
    id: 4,
    title: 'Legal Strategy & Findings',
    icon: ReportIcon,
    description: 'Generates a report and actionable plan based on the AI analysis.',
    details: [
      { title: 'Key Findings Summary', text: 'Generates a summary of all errors, violations, and inconsistencies found.' },
      { title: 'Legal Basis for Dispute', text: 'Outlines the legal foundation for each dispute, citing relevant laws (e.g., FCRA § 611).' },
      { title: 'Recommended Action Plan', text: 'Provides a step-by-step plan with instructions and timelines for resolution.' },
      { title: 'Downloadable Strategy', text: 'Allows you to download the complete strategy and action plan for your records.' },
    ],
  },
  {
    id: 5,
    title: 'Letter Generation & Packaging',
    icon: CommunicationIcon,
    description: 'Generates a package of tailored letters for all required parties.',
    details: [
      { title: 'Credit Bureau Letters', text: 'Generates FCRA 611 dispute letters for reinvestigation and deletion requests.' },
      { title: 'Debt Collector Letters', text: 'Creates FDCPA validation letters or cease-and-desist requests.' },
      { title: 'Creditor Letters', text: 'Drafts goodwill deletion requests or billing-error disputes for original creditors.' },
      { title: 'Downloadable Package', text: 'Packages all generated letters for easy downloading and sending.' },
    ],
  },
  {
    id: 6,
    title: 'AI Agent Tracking Setup',
    icon: TrackingIcon,
    description: 'Activates an AI assistant to track deadlines and automate follow-ups.',
    details: [
      { title: 'AI-Powered Setup', text: 'The AI asks for key details like mailing dates and certified mail tracking numbers.' },
      { title: 'Automated Timelines', text: 'Calculates and tracks legal response periods (e.g., 30 days for CRAs, 15 days for CFPB).' },
      { title: 'Calendar & Email Integration', text: 'Connects to your tools to send reminders and document responses for evidence (simulated).' },
      { title: 'Compliance Monitoring', text: 'Monitors deadlines and prepares for the next step if no resolution is met.' },
    ],
  },
  {
    id: 7,
    title: 'Escalation & Enforcement',
    icon: SpecialistIcon,
    description: 'Recommends next steps if initial disputes are unsuccessful.',
    details: [
      { title: 'CFPB Complaint Filing', text: 'Prepares a package with all evidence to file a formal CFPB complaint.' },
      { title: 'Intent-to-Sue Notice', text: 'Generates a formal notice as a final step before potential legal action.' },
      { title: 'Small-Claims Preparation', text: 'Packages all documentation and communication logs for small claims court.' },
      { title: 'Damages Logging', text: 'Logs all outcomes and communications for potential FCRA or FDCPA damages claims.' },
    ],
  },
];
