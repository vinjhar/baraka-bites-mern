import React, { useEffect } from 'react';

const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service - Baraka Bites';
  }, []);

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-700 mb-8">Last Updated: 21 May 2025</p>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Use of Our Services</h2>
              <p className="text-gray-700">
                You agree to use this site for personal, non-commercial use. You must not misuse the AI tools or attempt to reverse-engineer, abuse, or extract data from the platform.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">2. AI Content Disclaimer</h2>
              <p className="text-gray-700">
                Recipes generated are created by AI and may not always be accurate. Users are responsible for checking ingredients for allergens and halal compliance. We do not guarantee medical, nutritional, or dietary accuracy.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Premium Membership</h2>
              <p className="text-gray-700">
                Some features may be available only to paying members. We reserve the right to change prices or features with notice.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Prohibited Use</h2>
              <p className="text-gray-700">
                Do not upload offensive, unlawful, or harmful content. Do not attempt to hack, disrupt, or harm the site or users.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Intellectual Property</h2>
              <p className="text-gray-700">
                All content, including branding, design, and custom AI tools, belong to Baraka Bites. You may not copy or redistribute any content without permission.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Changes to Terms</h2>
              <p className="text-gray-700">
                We may update these terms. Continued use means you accept the new version.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;