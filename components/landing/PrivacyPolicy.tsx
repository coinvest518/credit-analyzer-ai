import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl pt-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p>
              To provide our AI analysis, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Account information (name, email) if you create an account.</li>
              <li>Credit report data (PDFs or images) that you explicitly upload.</li>
              <li>Usage data (IP address, browser type) to improve our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Data</h2>
            <p>
              We use your data solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Perform the AI-powered credit analysis you request.</li>
              <li>Generate dispute letters for your personal use.</li>
              <li>Improve the accuracy of our AI models (anonymized data only).</li>
              <li>Communicate with you regarding your account.</li>
            </ul>
          </section>

          <section className="bg-green-500/5 p-6 rounded-lg border border-green-500/20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Security & Integrity</h2>
            <p>
              <strong>We do not sell your data.</strong> We do not share your personal financial information with third parties for marketing purposes. All uploaded documents are processed via industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Services</h2>
            <p>
              We use secure third-party providers like Mistral AI for processing and Firebase for storage. These providers are bound by strict confidentiality and security requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can delete your account and all associated data at any time through the application settings or by contacting us at <a href="mailto:coinvest518@gmail.com" className="text-primary hover:underline">coinvest518@gmail.com</a>.
            </p>
          </section>

          <div className="pt-8 border-t border-border mt-12">
            <p className="text-sm">
              Last updated: April 21, 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
