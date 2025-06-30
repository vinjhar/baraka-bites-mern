import React, { useState, useCallback, useEffect } from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { Loader2, AlertCircle } from 'lucide-react';


// Make sure you have supabase client imported or globally available
 
const UpgradeToPremium: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isAuthenticated = false

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleUpgrade = async () => {
    if (isSubscribed) {
      setError('You are already subscribed to Premium.');
      return;
    }

    console.log('Starting upgrade process...', { isAuthenticated });
    setIsLoading(true);

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to auth page');
      window.location.href = '/auth';
      return;
    }

    try {
      resetState();
      setIsLoading(true);

      console.log('Initiating checkout process...');

      const timeoutId = setTimeout(() => {
        console.error('Checkout process timed out');
        setError('Request timed out. Please try again.');
        setIsLoading(false);
      }, 30000);

      const checkoutUrl = await redirectToCheckout(
        STRIPE_PRODUCTS.PREMIUM.priceId!,
        STRIPE_PRODUCTS.PREMIUM.mode
      );

      clearTimeout(timeoutId);
      resetState();

      console.log('Received checkout URL:', checkoutUrl);

      if (!checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      console.log('Redirecting to Stripe checkout...');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Upgrade error:', err);

      let errorMessage = 'Failed to start upgrade process. Please try again.';
      if (err.message.includes('session has expired')) {
        errorMessage = 'Your session has expired. Please sign in again.';
      } else if (err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message.includes('customer')) {
        errorMessage = 'Unable to create customer profile. Please try again or contact support.';
      } else if (err.message.includes('price')) {
        errorMessage = 'Invalid subscription plan. Please contact support.';
      } else if (err.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (err.message.includes('too many requests')) {
        errorMessage = 'Too many requests. Please try again in a few minutes.';
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
      <h3 className="text-lg font-semibold text-primary mb-4">Upgrade to Premium</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
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

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">Get access to:</p>
        <ul className="text-sm text-gray-600 space-y-1">
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
