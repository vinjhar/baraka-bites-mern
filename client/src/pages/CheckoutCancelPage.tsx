import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CheckoutCancelPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Payment Cancelled - Baraka Bites';
  }, []);

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-700 mb-6">
            Your payment was cancelled and you have not been charged. If you have any questions or concerns, please don't hesitate to contact our support team.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              Return to Home
            </Link>
            
            <Link
              to="/contact"
              className="block w-full px-6 py-3 bg-transparent border-2 border-primary text-primary font-medium rounded-md hover:bg-primary/10 transition-colors duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;