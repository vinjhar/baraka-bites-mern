import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import RecipeGenerator from '../components/RecipeGenerator';
import RecipeCard from '../components/RecipeCard';
import PricingCard from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { Utensils, Database, BookMarked, Medal, Search, Clock } from 'lucide-react';
import TestimonialCard from '../components/TestimonialCard';

const HomePage: React.FC = () => {
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]); // Store real recipe objects
  const [isPremium, setIsPremium] = useState(false)
  useEffect(() => {
    document.title = 'Baraka Bites - Halal Recipe AI Platform';

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.isPremium) setIsPremium(true);
        })
        .catch((err) => {
          console.error('Failed to load user info:', err);
        });
    }
  }, []);

  const handleRecipeSuccess = (newRecipe: any) => {
    setGeneratedRecipes((prev) => [newRecipe, ...prev]);
  };

  return (
    <div className="bg-cream">
      <HeroSection />

      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Generate Your <span className="text-gold">Halal Recipe</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Enter your ingredients below, and we'll generate a unique halal recipe using AI — grounded in tradition and mindful of your health, inshaAllah.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <RecipeGenerator onSuccess={handleRecipeSuccess} />
          </div>
        </div>
      </section>

     {generatedRecipes.length > 0 && (
  <section className="py-16 bg-cream/50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Generated <span className="text-gold">Recipes</span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Explore the delicious halal recipes created just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {generatedRecipes.slice(0, 3).map((recipe, idx) => (
          <RecipeCard key={recipe._id || idx} recipe={recipe} />
        ))}
      </div>
    </div>
  </section>
)}

      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose <span className="text-gold">Baraka Bites</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover the unique features that make our halal recipe platform special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Utensils}
              title="AI-Powered Recipes"
              description="Our advanced AI creates personalized halal recipes based on the ingredients you have available."
            />
            <FeatureCard
              icon={Database}
              title="Sunnah Food Knowledge"
              description="Learn about foods mentioned in Islamic traditions and their health benefits."
            />
            <FeatureCard
              icon={BookMarked}
              title="Save Your Favorites"
              description="Premium members can save and organize their favorite recipes for easy access."
            />
            <FeatureCard
              icon={Medal}
              title="100% Halal Verified"
              description="All recipes are carefully checked to ensure they conform to halal dietary guidelines."
            />
            <FeatureCard
              icon={Search}
              title="Ingredient Substitution"
              description="Easily find halal alternatives for any non-halal ingredients in traditional recipes."
            />
            <FeatureCard
              icon={Clock}
              title="Quick & Easy Recipes"
              description="Find recipes that fit your schedule, from 15-minute meals to slow-cooked delights."
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
        What <span className="text-gold">Users Say</span>
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto">
        Stories from Users who are discovering and cooking with Baraka Bites.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <TestimonialCard
        name="Amina Yusuf"
        role="Mother & Home Chef"
        
        feedback="Baraka Bites has made meal planning so easy for my family! I trust every recipe is 100% halal."
      />
      <TestimonialCard
        name="Hassan Raza"
        role="Fitness Coach"
        
        feedback="I use the health goals filter to generate protein-rich meals for my clients. It’s brilliant!"
      />
      <TestimonialCard
        name="Zahra Karim"
        role="University Student"
        
        feedback="As a student on a budget, I love the ingredient-based recipes. Saves time and money!"
      />
    </div>
  </div>
</section>

      <section className="py-16 bg-cream/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Choose Your <span className="text-gold">Plan</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Select the plan that best fits your cooking needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
  title={STRIPE_PRODUCTS.FREE.name}
  price="£0"
  description={STRIPE_PRODUCTS.FREE.description}
  features={[
    '3 recipe generations total',
    'Access to basic recipes',
    'Halal ingredient verification',
    'Email support',
  ]}
  mode={STRIPE_PRODUCTS.FREE.mode}
  isPremium={isPremium}
/>

<PricingCard
  title={STRIPE_PRODUCTS.PREMIUM.name}
  price="£4.99"
  description={STRIPE_PRODUCTS.PREMIUM.description}
  features={[
    'Unlimited recipe generations',
    'Save favorite recipes',
    'Advanced cooking techniques',
    'Priority support',
    "Downloadable du'a PDF book",
    '10% of proceeds donated to charity',
  ]}
  mode={STRIPE_PRODUCTS.PREMIUM.mode}
  isHighlighted={true}
  isPremium={isPremium}
/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
