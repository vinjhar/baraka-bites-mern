import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog - Baraka Bites';
  }, []);

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Baraka Bites <span className="text-gold">Blog</span>
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <Loader2 className="w-12 h-12 text-primary/50 mx-auto mb-4 animate-spin" />
            <p className="text-xl font-semibold text-primary mb-2">
              Coming soon insha'Allah
            </p>
            <p className="text-gray-700">
              We're preparing insightful articles about Islamic dietary practices, halal cooking tips, and the spiritual aspects of food in Islam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;