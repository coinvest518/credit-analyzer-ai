import type React from 'react';

export interface WorkflowStepDetail {
  title: string;
  text: string;
}

export interface ProcessingTask {
  name: string;
}

export interface WorkflowStep {
  id: number;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  details: WorkflowStepDetail[];
  processingTasks?: ProcessingTask[];
}

export interface UploadedFile {
    name: string;
    type: string;
    content: string; // base64 encoded
}

export type ViolationLaw = 'FCRA' | 'FDCPA' | 'TCPA' | 'OTHER';

export interface AnalysisViolation {
    law: ViolationLaw;
    violationCategory: string;
    description: string;
    evidenceText: string;
}

export interface StrategicOpportunities {
    goodwillLetter: boolean;
    payForDelete: boolean;
}

export interface ComplexIssues {
    mixedFile: boolean;
    identityTheft: boolean;
}

export interface AnalyzedAccount {
    creditorName: string;
    accountNumber: string;
    amount?: number;
    dateOpened?: string;
    dateReported?: string;
    accountStatus?: string;
    potentialViolations: AnalysisViolation[];
    summary: string;
    disputeStrengthScore: number;
    strategicOpportunities: StrategicOpportunities;
    complexIssues: ComplexIssues;
    recommendedNextSteps: string[];
}

export interface AnalysisResult {
    globalSummary: string;
    analyzedAccounts: AnalyzedAccount[];
}

export interface LetterPackage {
    creditBureau?: string;
    debtCollector?: string;
    creditor?: string;
    cfpb?: string;
}

export interface TrackingInfo {
    mailingDate: string;
    isCertified: boolean;
    trackingNumber?: string;
    cfpbFiled: boolean;
}