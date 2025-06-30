import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const EmailConfirmationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Confirm Your Email - Baraka Bites';
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium text-primary mb-2">What's next?</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>1. Check your email inbox</li>
              <li>2. Click the confirmation link in the email</li>
              <li>3. Return to Baraka Bites to sign in</li>
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <p>Didn't receive the email? Check your spam folder or contact support.</p>
          </div>

          <Link
            to="/auth"
            className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;