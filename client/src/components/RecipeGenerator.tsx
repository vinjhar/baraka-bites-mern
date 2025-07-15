import { useEffect, useState } from 'react';
import { Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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

const FREE_MEAL_TYPES = ["Main Meals", "Light Meals", "Snack"];

const RecipeGenerator: React.FC<Props> = ({ onSuccess }) => {
  const [ingredients, setIngredients] = useState('');
  const [mealType, setMealType] = useState('Main Meals');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element>('');
  const [recipe, setRecipe] = useState<any>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  // Optional fields
  const [servingSize, setServingSize] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [avoid, setAvoid] = useState('');

  const [showPreferences, setShowPreferences] = useState(false);

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isPromptMode = userPrompt.trim().length > 0;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setIsPremium(data?.user?.isPremium || false);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    if (token) fetchUser();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setRecipe(null);

    if (!isAuthenticated) {
      setError('Please sign in to generate recipes.');
      setIsLoading(false);
      return;
    }

    if (isPromptMode) {
      if (!userPrompt.trim()) {
        setError('Please enter a recipe request.');
        setIsLoading(false);
        return;
      }
    } else {
      if (!ingredients || !mealType) {
        setError('Please provide both ingredients and a meal type.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const bodyData = isPromptMode
        ? { userPrompt }
        : {
            ingredients: ingredients.split(',').map(i => i.trim()),
            mealType,
            servingSize,
            spiceLevel,
            cuisine,
            healthGoals,
            avoid: avoid.split(',').map(a => a.trim()).filter(Boolean)
          };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/recipes/generate-openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
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
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-gray-700 font-medium mb-2">
            What would you like to cook with barakah today?
          </label>
          <input
            type="text"
            id="prompt"
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
            placeholder='e.g., How do I make chocolate cake?'
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">If this is filled, other options will be ignored.</p>
        </div>

        <div className="flex items-center justify-between mt-4 mb-2">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            or generate a recipe based on ingredients
            <span className="ml-2 text-sm text-gray-500">(optional)</span>
          </h3>
          </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 font-medium mb-2">
            Ingredients (comma separated)
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, onion, olive oil"
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={3}
            disabled={isPromptMode}
          />
        </div>

        {/* Meal Type */}
        <div>
          <label htmlFor="mealType" className="block text-gray-700 font-medium mb-2">
            Meal Type
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => {
              const selected = e.target.value;
              if (!isPremium && !FREE_MEAL_TYPES.includes(selected)) return;
              setMealType(selected);
            }}
            className="w-full p-3 border border-gray-300 rounded-md"
            disabled={isPromptMode}
          >
            {ALL_MEAL_TYPES.map((type) => (
              <option key={type} value={type} disabled={!isPremium && !FREE_MEAL_TYPES.includes(type)}>
                {type} {!isPremium && !FREE_MEAL_TYPES.includes(type) ? ' — Premium only 🔒' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Preferences Toggle */}
        <div className="flex items-center justify-between mt-6 mb-2 cursor-pointer">
          <h3
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Optional Preferences
            {showPreferences ? (
              <ChevronUp className="w-5 h-5 ml-2" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-2" />
            )}
          </h3>
        </div>

        {showPreferences && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Serving Size</label>
                <select
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  disabled={isPromptMode}
                >
                  <option value="">Select...</option>
                  <option value="2">2 people</option>
                  <option value="4">4 people</option>
                  <option value="6">6 people</option>
                  <option value="8">8 people</option>
                  <option value="10">10 people</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Spice Level</label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  disabled={isPromptMode}
                >
                  <option value="">Select...</option>
                  <option value="No Spice">No Spice</option>
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Spicy">Spicy</option>
                  <option value="Extra Spicy">Extra Spicy</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Cuisine Inspiration</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  disabled={isPromptMode}
                >
                  <option value="">Select...</option>
                  <option value="Desi">Desi</option>
                  <option value="Middle Eastern">Middle Eastern</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Thai">Thai</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Moroccan">Moroccan</option>
                  <option value="Persian">Persian</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Health Goals</label>
                <select
                  value={healthGoals}
                  onChange={(e) => setHealthGoals(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  disabled={isPromptMode}
                >
                  <option value="">Select...</option>
                  <option value="Low-carb">Low-carb</option>
                  <option value="High-protein">High-protein</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-free">Gluten-free</option>
                  <option value="Gut-friendly">Gut-friendly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ingredients to Avoid (comma separated)
              </label>
              <textarea
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder="e.g., peanuts, gluten"
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={2}
                disabled={isPromptMode}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
            isLoading || !isAuthenticated
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90 hover-lift'
          } transition-all duration-200`}
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
          <p className="mt-3 text-sm text-center text-gray-500">
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
