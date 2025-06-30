import React, { useEffect, useState } from 'react';
import { isTokenValid } from '../utils/auth';
import { getUserRecipes } from '../api/recipes';
import { BookOpen } from 'lucide-react';

const SavedRecipesHero: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipeCount, setRecipeCount] = useState<number | null>(null);

  useEffect(() => {
    const valid = isTokenValid();
    setIsAuthenticated(valid);

    if (valid) {
      getUserRecipes()
        .then((res) => {
          if (res && Array.isArray(res.recipes)) {
            setRecipeCount(res.recipes.length);
          }
        })
        .catch(() => setRecipeCount(null));
    }
  }, []);

  return (
    <div className="bg-primary/10 p-6 rounded-lg mb-8">
      <div className="flex items-center space-x-4">
        <div className="bg-primary rounded-full p-3">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Your Saved Recipes</h2>
          <p className="text-gray-600">
            {!isAuthenticated
              ? 'Sign in to see your saved recipes.'
              : recipeCount === null
              ? 'Loading your saved recipes...'
              : recipeCount === 0
              ? "You haven't saved any recipes yet. Start exploring and save your favorites!"
              : `You have ${recipeCount} saved recipe${recipeCount === 1 ? '' : 's'}.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedRecipesHero;
