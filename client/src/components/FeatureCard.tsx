import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="text-primary w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default FeatureCard;