import React from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 text-primary rotate-45" />
            <div className="flex flex-col ml-2">
              <span className="text-3xl font-serif text-primary">Baraka</span>
              <span className="text-sm font-medium tracking-wider text-primary/80">BITES</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Email Verified!</h2>
        <p className="text-gray-700 mb-6">
          Your email has been successfully verified. You can now sign in and start generating delicious halal recipes.
        </p>

        <button
          onClick={() => navigate('/signin')}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
