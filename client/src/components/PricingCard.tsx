import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  mode: 'payment' | 'subscription';
  isHighlighted?: boolean;
  isPremium: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  mode,
  isHighlighted = false,
  isPremium,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const isFreePlan = title.toLowerCase().includes('free');
  let buttonText = 'Change Plan';
  let isDisabled = false;

  if (!isAuthenticated) {
    buttonText = 'Sign In to Continue';
  } else {
    if (!isPremium && isFreePlan) {
      buttonText = 'Current Plan';
      isDisabled = true;
    } else if (isPremium && !isFreePlan) {
      buttonText = 'Already Subscribed';
      isDisabled = true;
    }
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!isDisabled) {
      navigate('/billing');
    }
  };

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg
        ${isHighlighted ? 'border-2 border-gold scale-105 relative' : 'border border-gray-200'}`}
    >
      {isHighlighted && (
        <div className="bg-gold text-primary text-center py-1 font-semibold">
          Most Popular
        </div>
      )}

      <div className="p-6 bg-white h-full">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>

        <div className="mb-4">
          <span className="text-3xl font-bold text-primary">{price}</span>
          {mode === 'subscription' && (
            <span className="text-gray-500 ml-1 text-base">/month</span>
          )}
        </div>

        <p className="text-gray-600 mb-6">{description}</p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`w-5 h-5 mr-2 mt-0.5 ${isHighlighted ? 'text-gold' : 'text-primary'}`} />
              <span className="text-gray-800">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleClick}
          disabled={isAuthenticated && isDisabled}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 
            ${isHighlighted 
              ? 'bg-gold text-primary hover:bg-gold/90' 
              : 'bg-primary text-white hover:bg-primary/90'} 
            ${isAuthenticated && isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
