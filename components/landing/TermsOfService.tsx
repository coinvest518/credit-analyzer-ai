import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl pt-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service & Legal Disclaimers</h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using DisputeAI (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our Service.
            </p>
          </section>

          <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-semibold text-primary mb-4">2. IMPORTANT LEGAL DISCLAIMERS</h2>
            <div className="space-y-4">
              <p className="font-bold text-foreground italic">
                A. NOT A CREDIT REPAIR ORGANIZATION:
              </p>
              <p>
                DisputeAI is NOT a "credit repair organization" as defined under the Credit Repair Organizations Act (CROA). We do not provide credit repair services for a fee. We provide an AI-powered software tool that assists users in analyzing their own credit reports and generating their own dispute letters. We do not represent you or negotiate with credit bureaus on your behalf.
              </p>
              
              <p className="font-bold text-foreground italic">
                B. NOT LEGAL OR FINANCIAL ADVICE:
              </p>
              <p>
                The information, analysis, and recommendations provided by our AI are for educational and informational purposes only. DisputeAI does not provide legal, financial, or tax advice. You should consult with a qualified professional before making any financial or legal decisions.
              </p>
              
              <p className="font-bold text-foreground italic">
                C. NO GUARANTEE OF RESULTS:
              </p>
              <p>
                While our tool helps identify potential inaccuracies, we do not guarantee any specific result, credit score increase, or the removal of any item from your credit report. The final decision to dispute and the outcome of such disputes rest solely with the credit bureaus and individual creditors.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Privacy and Data Security</h2>
            <p>
              Your privacy is our priority. We want to be clear: <strong>We do not "steal" or sell your personal data.</strong> 
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>All credit report data is processed securely through encrypted connections.</li>
              <li>We use your data only to provide the analysis services you request.</li>
              <li>We do not share your sensitive financial information with third-party marketers.</li>
              <li>You have the right to request deletion of your data at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Responsibilities</h2>
            <p>
              You are responsible for the accuracy of the information you provide. You agree that you are the owner of the credit report being analyzed or have explicit legal authorization to analyze said report.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, DisputeAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12">
            <p className="text-sm">
              Last updated: January 6, 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
