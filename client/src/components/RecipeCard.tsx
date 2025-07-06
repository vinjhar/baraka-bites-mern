import React, { useState, useEffect, useRef } from "react";
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
  Loader2
} from "lucide-react";
import { deleteRecipe } from "../api/recipes"; 

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
  calories?: string;
  tags?: string[];   
  options?: {
    servingSize?: number;
    spiceLevel?: string;
    cuisine?: string;
    healthGoals?: string;
    avoid?: string[] | string;
  };
}

interface Props {
  recipe: Recipe;
  onDelete?: (id: string) => void;
}

const RecipeCard: React.FC<Props> = ({ recipe, onDelete }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const shareMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShareMenuOpen(false);
      }
    }

    if (shareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareMenuOpen]);

  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const websiteUrl = "https://www.Baraka-Bites.com.pk";
  const recipeText = `🍽️ ${recipe.title}\n\n📝 ${recipe.description}\n\n🥘 Ingredients:\n${recipe.ingredients?.map(i => `• ${i}`).join('\n')}\n\n👨‍🍳 Instructions:\n${recipe.instructions?.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\n⏱️ Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}\n\nView more at ${websiteUrl}`;

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

  const options = recipe.options || {};
const {
  servingSize,
  spiceLevel,
  cuisine,
  healthGoals,
  avoid
} = options;


  const handleShareOption = (option: string) => {
    setShareMenuOpen(false);
    setIsSharing(true);
    const encodedText = encodeURIComponent(recipeText);

    switch (option) {
      case 'whatsapp':
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappUrl = isMobile
          ? `whatsapp://send?text=${encodedText}`
          : `https://web.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`,
          '_blank',
          'noopener,noreferrer,width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(websiteUrl)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent('Check out this recipe: ' + recipe.title)}&body=${encodedText}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(recipeText)
          .then(() => alert('Recipe copied to clipboard!'))
          .catch(() => alert('Copy failed. Please try manually.'));
        break;
    }

    setIsSharing(false);
  };

  const randomTip = MINDFUL_TIPS[Math.floor(Math.random() * MINDFUL_TIPS.length)];

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
            <div className="flex items-center gap-2 relative">
              <div className="relative">
                <button
                  onClick={() => setShareMenuOpen(prev => !prev)}
                  className={`bg-primary/5 p-2 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105 ${shareMenuOpen ? 'ring-2 ring-primary' : ''}`}
                  title="Share recipe"
                  disabled={isSharing}
                >
                  {isSharing ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Share2 className="w-5 h-5 text-primary" />}
                </button>

                {shareMenuOpen && (
                  <div
                    ref={shareMenuRef}
                    className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-2 space-y-1"
                  >
                    <button onClick={() => handleShareOption('whatsapp')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md">
                      <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
                    </button>
                    <button onClick={() => handleShareOption('facebook')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md">
                      <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                    </button>
                    <button onClick={() => handleShareOption('twitter')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md">
                      <Twitter className="w-5 h-5 text-sky-400" /> Twitter
                    </button>
                    <button onClick={() => handleShareOption('email')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md">
                      <Mail className="w-5 h-5 text-red-600" /> Email
                    </button>
                    <button onClick={() => handleShareOption('copy')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md">
                      <Copy className="w-5 h-5 text-gray-600" /> Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>

              {isDashboard && (
                <button
                  onClick={handleDelete}
                  className="bg-red-50 p-2 rounded-full hover:bg-red-100 transition-all"
                  title="Delete recipe"
                  disabled={deleting}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
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

            {recipe.calories && (
  <p className="text-sm text-gray-800 mb-2">
    <strong>Calories:</strong> {recipe.calories}
  </p>
)}

  {recipe.tags?.length > 0 && (
    <div className="mb-4">
      <strong className="block mb-1">Tags:</strong>
      <div className="flex flex-wrap gap-2">
        {recipe.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full capitalize"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )}


            {(servingSize || spiceLevel || cuisine || healthGoals || (avoid && avoid.length > 0)) && (
  <div className="mb-4">
    <h4 className="font-semibold mb-2">Personalized Options:</h4>
    <ul className="list-disc list-inside text-gray-800 space-y-1">
      {servingSize && <li><strong>Serving Size:</strong> {servingSize} people</li>}
      {spiceLevel && <li><strong>Spice Level:</strong> {spiceLevel}</li>}
      {cuisine && <li><strong>Cuisine Inspiration:</strong> {cuisine}</li>}
      {healthGoals && <li><strong>Health Goals:</strong> {healthGoals}</li>}
      {avoid && avoid.length > 0 && (
        <li><strong>Avoid:</strong> {Array.isArray(avoid) ? avoid.join(', ') : avoid}</li>
      )}
    </ul>
  </div>
)}

            

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
