import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  feedback: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, image, feedback }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-primary/10 text-center">
    
    <p className="text-gray-700 italic mb-4">“{feedback}”</p>
    <h4 className="font-semibold text-primary">{name}</h4>
    <p className="text-sm text-gray-500">{role}</p>
  </div>
);

export default TestimonialCard;
