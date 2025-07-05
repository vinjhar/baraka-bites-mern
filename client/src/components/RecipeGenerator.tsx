import { useEffect, useState } from 'react';
import { Loader2, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  onSuccess?: (recipe: any) => void;
};

const ALL_MEAL_TYPES = [
  "Suhoor (Pre-Dawn)",
  "Iftar (Post-Sunset)",
  "Light Meals",
  "Main Meals",
  "Dessert",
  "Snack",
  "Healthy Snacks"
];

const FREE_MEAL_TYPES = [
  "Main Meals",
  "Light Meals",
  "Snack"
];

const RecipeGenerator: React.FC<Props> = ({ onSuccess }) => {
  const [ingredients, setIngredients] = useState('');
  const [mealType, setMealType] = useState('Main Meals');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element>('');
  const [recipe, setRecipe] = useState<any>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:7001/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setIsPremium(data?.user?.isPremium || false);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredients(e.target.value);
  };

  const handleMealTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (!isPremium && !FREE_MEAL_TYPES.includes(selected)) {
      return; // Prevent selection if not allowed
    }
    setMealType(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setRecipe(null);

    if (!ingredients || !mealType) {
      setError('Please provide both ingredients and a meal type.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:7001/api/v1/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(i => i.trim()),
          mealType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setError(
            <>
              You've reached your limit.{' '}
              <Link to="/billing" className="text-primary hover:text-gold underline">
                Upgrade to premium
              </Link>{' '}
              for unlimited recipes.
            </>
          );
        } else {
          setError(data.error || 'Failed to generate recipe.');
        }
        setIsLoading(false);
        return;
      }

      setRecipe(data.recipe);
      onSuccess?.(data.recipe);

    } catch (err: any) {
      console.error('Error generating recipe:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary/10 hover-lift">
      <div className="flex items-center mb-6">
        <Sparkles className="w-6 h-6 text-gold mr-2" />
        <h2 className="text-2xl font-bold text-primary">Generate Halal Recipe</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 font-medium mb-2">
            Ingredients (comma separated)
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={handleIngredientsChange}
            placeholder="e.g., chicken, rice, onion, olive oil"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow duration-200"
            rows={3}
          ></textarea>
        </div>

        <div>
          <label htmlFor="mealType" className="block text-gray-700 font-medium mb-2">
            Meal Type
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={handleMealTypeChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow duration-200"
          >
            {ALL_MEAL_TYPES.map((type) => (
              <option
                key={type}
                value={type}
                disabled={!isPremium && !FREE_MEAL_TYPES.includes(type)}
              >
                {type} {!isPremium && !FREE_MEAL_TYPES.includes(type) ? ' — Premium only 🔒' : ''}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md animate-fade-in">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center
            ${isLoading || !isAuthenticated
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90 hover-lift'} 
            transition-all duration-200`}
          disabled={isLoading || !isAuthenticated}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Bismillah — Generate My Recipe
            </>
          )}
        </button>

        {!isAuthenticated && (
          <p className="mt-3 text-sm text-center text-gray-500 animate-fade-in">
            Please sign in to generate recipes
          </p>
        )}
      </form>

      {recipe && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-bold text-primary mb-2">{recipe.title}</h3>
          <p className="text-gray-700 mb-4">{recipe.description}</p>

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-4">🕒 Prep: {recipe.prepTime}</span>
            <span>🔥 Cook: {recipe.cookTime}</span>
          </div>

          <h4 className="font-semibold mt-4 mb-1">Ingredients:</h4>
          <ul className="list-disc list-inside mb-3">
            {recipe.ingredients.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h4 className="font-semibold mb-1">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            {recipe.instructions.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
