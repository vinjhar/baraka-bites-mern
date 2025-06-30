import React, { useEffect } from 'react';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - Baraka Bites';
  }, []);

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-700 mb-8">Last Updated: 21 May 2025</p>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Email Address: If you register or subscribe, we collect your email.</li>
                <li>Ingredients/Data Input: When you use the recipe generator, your input is processed by our AI.</li>
                <li>Payment Information: Handled securely by Stripe; we do not store your card details.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">2. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>To provide you with recipe suggestions and membership access.</li>
                <li>To improve our AI recipe tool and personalise your experience.</li>
                <li>To send important updates or recipe tips (only if subscribed).</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Sharing Your Information</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>We never sell your data.</li>
                <li>We may share anonymised data for analytics.</li>
                <li>We may disclose information if required by law.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Cookies</h2>
              <p className="text-gray-700">
                We use basic cookies for functionality and analytics (e.g., Google Analytics).
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>You can request deletion or access to your data by emailing hello@barakabites.app</li>
                <li>You can unsubscribe anytime.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Contact</h2>
              <p className="text-gray-700">
                For any privacy questions, contact us at: hello@barakabites.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;