import React, { useEffect, useState, useRef } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeGenerator from '../components/RecipeGenerator';
import { getUserRecipes } from '../api/recipes';
import SubscriptionManager from '../components/SubscriptionManager';
import UpgradeToPremium from '../components/UpgradeToPremium';
import SavedRecipesHero from '../components/SavedRecipesHero';
import { Crown, Utensils, Search } from 'lucide-react';
import { useNavigate} from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ generations_left: number; isPremium: boolean; name: string } | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/SignIn');
    return;
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:7001/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.user) {
        const generations_left = Math.max(3 - data.user.recipesGenerated, 0);

        setUserInfo({
          generations_left,
          isPremium: data.user.isPremium,
          name: data.user.name,
        });

        // (optional) Update localStorage if needed elsewhere
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        navigate('/SignIn');
      }

      const recipeRes = await getUserRecipes();
      setRecipes(recipeRes.recipes || []);
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  fetchUser();
}, []);

  const isSubscribed = userInfo?.isPremium ?? false;

  useEffect(() => {
    if (upgradeRef.current && !isSubscribed && userInfo?.generations_left === 0) {
      upgradeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userInfo, isSubscribed]);

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Welcome back, <span className="text-gold">{userInfo?.name || 'User'}</span>
          </h1>
          <p className="text-gray-700">
            {isSubscribed
              ? 'You have premium access with unlimited recipe generations.'
              : `You have used ${3 - (userInfo?.generations_left ?? 3)}/3 recipe generations.`}
          </p>
        </div>

        {!isSubscribed && (
          <div className="mb-8" ref={upgradeRef}>
            <UpgradeToPremium />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Stats Boxes */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-3">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Recipe Generations Left</h3>
            </div>
            <p className="text-3xl font-bold text-gold">
              {isSubscribed ? '∞' : userInfo?.generations_left ?? 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {isSubscribed ? 'Unlimited recipes' : 'Generations remaining'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-3">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Account Type</h3>
            </div>
            <p className="text-3xl font-bold text-gold">
              {isSubscribed ? 'Premium' : 'Free'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {isSubscribed ? 'Premium features unlocked' : 'Limited features available'}
            </p>
          </div>
        </div>

        {isSubscribed && <SubscriptionManager />}

        {(isSubscribed || (userInfo && userInfo.generations_left > 0)) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Generate New Recipe</h2>
            <RecipeGenerator onSuccess={() => {
              getUserRecipes().then((r) => setRecipes(r.recipes || []));
              setUserInfo((prev) => prev
                ? { ...prev, generations_left: Math.max(prev.generations_left - 1, 0) }
                : prev);
            }} />
          </div>
        )}

        {!isSubscribed && userInfo?.generations_left === 0 && (
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-700 mb-4">
              You've used all your free recipe generations.
            </p>
            <button className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition">
              Upgrade to Premium
            </button>
          </div>
        )}

       {recipes.length > 0 && (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-primary mb-6">Recent Recipes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes
        .slice(0, 3)
        .map((r) => <RecipeCard key={r._id} recipe={r} onDelete={(id) => setRecipes(prev => prev.filter(r => r._id !== id))}/>)}
    </div>
  </div>
)}

        <SavedRecipesHero />

        <div className="mb-8">
          <div id="mysavedrecipies" className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">My Saved Recipes</h2>
            {/* {recipes.length > 0 && (
              <button className="flex items-center text-primary hover:text-gold transition-colors duration-200">
                <Search className="w-5 h-5 mr-1" />
                <span>Find Recipe</span>
              </button>
            )} */}
          </div>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((r) => <RecipeCard key={r._id} recipe={r} onDelete={(id) => setRecipes(prev => prev.filter(r => r._id !== id))} />)}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-primary/10">
              <h3 className="text-xl font-bold text-primary mb-2">No Saved Recipes Yet</h3>
              <p className="text-gray-700 mb-4">
                {isSubscribed
                  ? "You haven't saved any recipes yet. Generate some recipes and save your favorites!"
                  : "Upgrade to premium to save your favorite recipes."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
