import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SunnahFoodItemProps = {
  title: string;
  description: string;
  benefits: string[];
  sources: string[];
};

const SunnahFoodItem: React.FC<SunnahFoodItemProps> = ({
  title,
  description,
  benefits,
  sources,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg p-5">
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      
      <button 
        onClick={toggleExpanded}
        className="flex items-center text-primary font-medium hover:text-gold transition-colors duration-200"
      >
        {isExpanded ? (
          <>
            <span>Show Less</span>
            <ChevronUp className="w-5 h-5 ml-1" />
          </>
        ) : (
          <>
            <span>Learn More</span>
            <ChevronDown className="w-5 h-5 ml-1" />
          </>
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <h4 className="font-semibold text-primary mb-2">Health Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-2">Sources:</h4>
            <ul className="list-decimal pl-5 space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-gray-700 text-sm">{source}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunnahFoodItem;