import React, { useEffect } from 'react';
import { Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us - Baraka Bites';
  }, []);

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Get in <span className="text-gold">Touch</span>
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help! Reach out to the Baraka Bites team.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Changed layout to single column */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 border border-primary/10">
              <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-1">Email Us</h3>
                    <p className="text-gray-700">hello@barakabites.app</p>
                    <p className="text-gray-500 text-sm mt-1">We respond within 24 hours</p>
                    <p className="text-gray-700 mt-3">
                      If you have any questions, feedback, or need help — whether it's about recipes,
                      technical issues, or managing your subscription — we’re here to assist.
                      <br /><br />
                      <strong>For subscription cancellations</strong>, please be sure to include the email address
                      you used to register, so we can process your request promptly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*
            <div className="bg-white rounded-lg shadow-md p-8 border border-primary/10">
              <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>

              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
            */}
          </div>

          {/* Terms of Service */}
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-6">Terms of Service</h2>
            <p className="text-gray-700 mb-4">Last Updated: 21 May 2025</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">1. Use of Our Services</h3>
                <p className="text-gray-700">
                  You agree to use this site for personal, non-commercial use. You must not misuse the AI tools or attempt to reverse-engineer, abuse, or extract data from the platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">2. AI Content Disclaimer</h3>
                <p className="text-gray-700">
                  Recipes generated are created by AI and may not always be accurate. Users are responsible for checking ingredients for allergens and halal compliance. We do not guarantee medical, nutritional, or dietary accuracy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">3. Premium Membership</h3>
                <p className="text-gray-700">
                  Some features may be available only to paying members. We reserve the right to change prices or features with notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">4. Prohibited Use</h3>
                <p className="text-gray-700">
                  Do not upload offensive, unlawful, or harmful content. Do not attempt to hack, disrupt, or harm the site or users.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">5. Intellectual Property</h3>
                <p className="text-gray-700">
                  All content, including branding, design, and custom AI tools, belong to Baraka Bites. You may not copy or redistribute any content without permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">6. Changes to Terms</h3>
                <p className="text-gray-700">
                  We may update these terms. Continued use means you accept the new version.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-6">Privacy Policy</h2>
            <p className="text-gray-700 mb-4">Last Updated: 21 May 2025</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">1. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Email Address: If you register or subscribe, we collect your email.</li>
                  <li>Ingredients/Data Input: When you use the recipe generator, your input is processed by our AI.</li>
                  <li>Payment Information: Handled securely by Stripe; we do not store your card details.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">2. How We Use Your Data</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>To provide you with recipe suggestions and membership access.</li>
                  <li>To improve our AI recipe tool and personalise your experience.</li>
                  <li>To send important updates or recipe tips (only if subscribed).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">3. Sharing Your Information</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>We never sell your data.</li>
                  <li>We may share anonymised data for analytics.</li>
                  <li>We may disclose information if required by law.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">4. Cookies</h3>
                <p className="text-gray-700">
                  We use basic cookies for functionality and analytics (e.g., Google Analytics).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">5. Your Rights</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>You can request deletion or access to your data by emailing hello@barakabites.app</li>
                  <li>You can unsubscribe anytime.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">6. Contact</h3>
                <p className="text-gray-700">
                  For any privacy questions, contact us at: hello@barakabites.app
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
