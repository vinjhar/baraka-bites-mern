import React, { useState, useCallback } from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  isAuthenticated: boolean;
  isSubscribed: boolean;
}

const UpgradeToPremium: React.FC<Props> = ({ isAuthenticated, isSubscribed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleUpgrade = async () => {
    if (isSubscribed) {
      setError('You are already subscribed to Premium.');
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/signin';
      return;
    }

    try {
      resetState();
      setIsLoading(true);

      const res = await fetch('http://localhost:7001/api/v1/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          priceId: STRIPE_PRODUCTS.PREMIUM.priceId
        })
      });

      const { url } = await res.json();

      if (!url) throw new Error('No checkout URL returned.');

      window.location.href = url;
    } catch (err: any) {
      setError('Upgrade failed. Please try again or contact support.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
      <h3 className="text-lg font-semibold text-primary mb-4">Upgrade to Premium</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={isLoading || isSubscribed}
        className="w-full flex items-center justify-center px-4 py-2 bg-gold text-primary rounded-md hover:bg-gold/90 transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : isSubscribed ? (
          'Already Subscribed'
        ) : (
          'Upgrade Now'
        )}
      </button>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>Get access to:</p>
        <ul className="space-y-1">
          <li>• Unlimited recipe generations</li>
          <li>• Save favorite recipes</li>
          <li>• Advanced cooking techniques</li>
          <li>• Priority support</li>
          <li>• Downloadable du'a PDF book</li>
          <li>• 10% of proceeds donated to charity</li>
        </ul>
      </div>
    </div>
  );
};

export default UpgradeToPremium;
