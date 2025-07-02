import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId: string | null;
  mode: 'payment' | 'subscription';
  isHighlighted?: boolean;
  isPremium: boolean; // 👈 passed from HomePage
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  priceId,
  mode,
  isHighlighted = false,
  isPremium,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  console.log(isPremium)

  // Determine current plan
  const isCurrentPlan =
    (!isPremium && title.toLowerCase() === 'free') ||
    (isPremium && title.toLowerCase() === 'premium');

  const handleRedirect = () => {
    if (!isAuthenticated) {
      window.location.href = '/signin';
    } else {
      navigate('/billing');
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
          onClick={handleRedirect}
          disabled={isCurrentPlan}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-md font-medium transition-all duration-200 
            ${isHighlighted
              ? 'bg-gold text-primary hover:bg-gold/90'
              : 'bg-primary text-white hover:bg-primary/90'}
            ${isCurrentPlan ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isCurrentPlan ? 'Already Subscribed' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
