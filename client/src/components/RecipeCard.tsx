import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Mail,
  Copy,
  Clock,
  X,
  Trash2,
} from "lucide-react";
import { deleteRecipe } from "../api/recipes"; // adjust path as needed

const sunnahIngredients = [
  'dates', 'honey', 'barley', 'cucumber', 'watermelon', 'black seed',
  'milk', 'figs', 'pomegranate', 'olives', 'olive oil', 'vinegar',
  'grapes', 'fish', 'pumpkin', 'gourd', 'meat', 'talbina'
];

const MINDFUL_TIPS = [
  'Pause and reflect before you eat.',
  'Try eating with your right hand.',
  'Sharing meals strengthens family bonds.',
  'Sitting while eating supports digestion.',
  "Don't waste food — even a few grains matter.",
  "Eat in moderation — stop before you're completely full."
];

interface Recipe {
  _id?: string;
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  recipe: Recipe;
  onDelete?: (id: string) => void; 
}

const RecipeCard: React.FC<Props> = ({ recipe, onDelete }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const location = useLocation(); 
  const isDashboard = location.pathname === "/dashboard";

  const randomTip = MINDFUL_TIPS[Math.floor(Math.random() * MINDFUL_TIPS.length)];
  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const handleDelete = async () => {
    if (!recipe._id) return;
    const confirm = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirm) return;

    try {
      setDeleting(true);
      await deleteRecipe(recipe._id);
      if (onDelete) onDelete(recipe._id);
    } catch (err: any) {
      alert("Failed to delete recipe: " + (err?.error || "Unknown error"));
    } finally {
      setDeleting(false);
    }
  };

  if (!recipe || typeof recipe !== 'object') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-red-600">
        Invalid recipe data provided.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary/10 transition-all duration-300 hover:shadow-xl max-w-4xl mx-auto mt-10">
        <div className="p-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            100% Halal Assured – No pork, alcohol, or haram content
          </div>

          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-primary">{recipe.title || "Untitled Recipe"}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareMenuOpen((prev) => !prev)}
                className={`bg-primary/5 p-2 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105 ${
                  shareMenuOpen ? "ring-2 ring-primary" : ""
                }`}
                title="Share recipe"
              >
                <Share2 className="w-5 h-5 text-primary" />
              </button>
             { isDashboard && <button
                onClick={handleDelete}
                className="bg-red-50 p-2 rounded-full hover:bg-red-100 transition-all"
                title="Delete recipe"
                disabled={deleting}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>}
            </div>
          </div>

          <p className="text-gray-700 mb-4">{recipe.description || "No description provided."}</p>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>Prep: {recipe.prepTime || "N/A"}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>Cook: {recipe.cookTime || "N/A"}</span>
          </div>

          {formattedDate && (
            <p className="text-xs text-gray-400 italic mb-4">
              Created on: {formattedDate}
            </p>
          )}

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {recipe.ingredients?.length ? (
                recipe.ingredients.map((ingredient, idx) => (
                  <li
                    key={idx}
                    className={
                      sunnahIngredients.includes(ingredient.toLowerCase())
                        ? "font-bold text-primary"
                        : ""
                    }
                    title={
                      sunnahIngredients.includes(ingredient.toLowerCase())
                        ? "Sunnah Ingredient"
                        : undefined
                    }
                  >
                    {ingredient}
                  </li>
                ))
              ) : (
                <li>No ingredients listed.</li>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Mindful Eating Tip:</h4>
            <p className="italic text-primary">{randomTip}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View Recipe Details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-full overflow-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-4">
              {recipe.title || "Untitled Recipe"}
            </h2>
            <p className="mb-4">{recipe.description || "No description available."}</p>

            <h3 className="font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
              {recipe.ingredients?.length ? (
                recipe.ingredients.map((ingredient, idx) => <li key={idx}>{ingredient}</li>)
              ) : (
                <li>No ingredients available.</li>
              )}
            </ul>

            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              {recipe.instructions?.length ? (
                recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)
              ) : (
                <li>No instructions available.</li>
              )}
            </ol>

            <p className="text-sm text-gray-500 italic mb-2">
              Prep Time: {recipe.prepTime || "N/A"} | Cook Time: {recipe.cookTime || "N/A"}
            </p>

            {formattedDate && (
              <p className="text-xs text-gray-400 italic">
                Created on: {formattedDate}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;
