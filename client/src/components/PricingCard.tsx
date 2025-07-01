import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!); // Make sure you define this in .env

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId: string | null;
  mode: 'payment' | 'subscription';
  isHighlighted?: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  priceId,
  mode,
  isHighlighted = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleCheckout = async () => {
    if (!priceId || !isAuthenticated) return;

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'http://localhost:7001/api/v1/payment/create-checkout-session',
        {
          priceId,
          mode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      }
    } catch (err) {
      console.error('Stripe Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg 
        ${isHighlighted ? 'border-2 border-gold scale-105 relative' : 'border border-primary/10'}`}
    >
      {isHighlighted && (
        <div className="bg-gold text-primary text-center py-1 font-semibold">
          Most Popular
        </div>
      )}

      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>

        <div className="mb-4">
          <span className="text-3xl font-bold text-primary">{price}</span>
          {mode === 'subscription' && (
            <span className="text-gray-500 ml-1">/month</span>
          )}
        </div>

        <p className="text-gray-700 mb-6">{description}</p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`w-5 h-5 mr-2 mt-0.5 ${isHighlighted ? 'text-gold' : 'text-primary'}`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={isLoading || !priceId}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-md font-medium transition-all duration-200 
            ${isHighlighted
              ? 'bg-gold text-primary hover:bg-gold/90'
              : 'bg-primary text-white hover:bg-primary/90'}
            ${(isLoading || !priceId) ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            !priceId
              ? 'Current Plan'
              : isAuthenticated
              ? 'Upgrade Now'
              : 'Sign In to Upgrade'
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
