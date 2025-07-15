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
  Loader2,
} from "lucide-react";
import { deleteRecipe } from "../api/recipes";

const sunnahIngredients = [
  "dates",
  "honey",
  "barley",
  "cucumber",
  "watermelon",
  "black seed",
  "milk",
  "figs",
  "pomegranate",
  "olives",
  "olive oil",
  "vinegar",
  "grapes",
  "fish",
  "pumpkin",
  "gourd",
  "meat",
  "talbina",
];

const MINDFUL_TIPS = [
  "Pause and reflect before you eat.",
  "Try eating with your right hand.",
  "Sharing meals strengthens family bonds.",
  "Sitting while eating supports digestion.",
  "Don't waste food — even a few grains matter.",
  "Eat in moderation — stop before you're completely full.",
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

  const websiteUrl = "https://barakabites.app/";
  const recipeText = `🍽️ ${recipe.title}\n\n📝 ${
    recipe.description
  }\n\n🥘 Ingredients:\n${recipe.ingredients
    ?.map((i) => `• ${i}`)
    .join("\n")}\n\n👨‍🍳 Instructions:\n${recipe.instructions
    ?.map((i, idx) => `${idx + 1}. ${i}`)
    .join("\n")}\n\n⏱️ Prep Time: ${recipe.prepTime} | Cook Time: ${
    recipe.cookTime
  }\n\nView more at ${websiteUrl}`;

  const handleDelete = async () => {
    if (!recipe._id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
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
  const { servingSize, spiceLevel, cuisine, healthGoals, avoid } = options;

  const handleShareOption = (option: string) => {
    setShareMenuOpen(false);
    setIsSharing(true);
    const encodedText = encodeURIComponent(recipeText);

    switch (option) {
      case "whatsapp":
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappUrl = isMobile
          ? `whatsapp://send?text=${encodedText}`
          : `https://web.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappUrl, "_blank");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            websiteUrl
          )}`,
          "_blank",
          "noopener,noreferrer,width=600,height=400"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(
            websiteUrl
          )}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          "Check out this recipe: " + recipe.title
        )}&body=${encodedText}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(recipeText)
          .then(() => alert("Recipe copied to clipboard!"))
          .catch(() => alert("Copy failed. Please try manually."));
        break;
    }

    setIsSharing(false);
  };

  const randomTip =
    MINDFUL_TIPS[Math.floor(Math.random() * MINDFUL_TIPS.length)];

  if (!recipe || typeof recipe !== "object") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-red-600">
        Invalid recipe data provided.
      </div>
    );
  }

  // Keep all imports as is...

  // Inside RecipeCard Component

  // ... code before JSX unchanged

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary/10 transition-all duration-300 hover:shadow-xl max-w-4xl mx-auto mt-10">
        <div className="p-6 space-y-5">
          {/* Halal Assurance Banner */}
          <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center shadow-sm text-sm font-medium">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
            100% Halal Assured – No pork, alcohol, or haram content
          </div>

          {/* Header */}
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-primary">
              {recipe.title || "Untitled Recipe"}
            </h3>
            <div className="flex items-center gap-2 relative">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShareMenuOpen((prev) => !prev)}
                  className={`bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-all duration-200 ${
                    shareMenuOpen ? "ring-2 ring-primary" : ""
                  }`}
                  title="Share recipe"
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <Share2 className="w-5 h-5 text-primary" />
                  )}
                </button>

                {shareMenuOpen && (
                  <div
                    ref={shareMenuRef}
                    className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-2 space-y-1"
                  >
                    {/* Share Options */}
                    {[
                      [
                        "whatsapp",
                        <MessageCircle className="w-5 h-5 text-green-500" />,
                        "WhatsApp",
                      ],
                      [
                        "facebook",
                        <Facebook className="w-5 h-5 text-blue-600" />,
                        "Facebook",
                      ],
                      [
                        "twitter",
                        <Twitter className="w-5 h-5 text-sky-400" />,
                        "Twitter",
                      ],
                      [
                        "email",
                        <Mail className="w-5 h-5 text-red-600" />,
                        "Email",
                      ],
                      [
                        "copy",
                        <Copy className="w-5 h-5 text-gray-600" />,
                        "Copy to Clipboard",
                      ],
                    ].map(([key, icon, label]) => (
                      <button
                        key={key}
                        onClick={() => handleShareOption(key as string)}
                        className="flex items-center gap-2 w-full text-left px-3 py-1.5 hover:bg-primary/10 rounded-md"
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              {isDashboard && (
                <button
                  onClick={handleDelete}
                  className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-all"
                  title="Delete recipe"
                  disabled={deleting}
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {recipe.description || "No description provided."}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime || "N/A"} prep</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime || "N/A"} cook</span>
            </div>
            {servingSize && (
              <div className="flex items-center gap-1">
                <span className="text-lg">👥</span>
                <span>
                  {servingSize} serving{Number(servingSize) > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Date */}
          {formattedDate && (
            <p className="text-xs text-gray-400 italic">
              Created on: {formattedDate}
            </p>
          )}

          {/* Ingredients */}
          <div>
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
              {recipe.ingredients?.length ? (
                recipe.ingredients.map((ingredient, idx) => (
                  <li
                    key={idx}
                    className={
                      sunnahIngredients.includes(ingredient.toLowerCase())
                        ? "font-semibold text-primary"
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

          {/* Mindful Tip */}
          <div className="bg-primary/5 text-primary italic text-sm p-3 rounded-lg border border-primary/20">
            {randomTip}
          </div>

          {/* View Modal Button */}
          <div className="text-right">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              View Recipe Details
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            className={`bg-white rounded-xl max-w-3xl w-full max-h-full overflow-auto p-6 relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeIn`}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-2">
              {recipe.title || "Untitled Recipe"}
            </h2>
            <p className="mb-4">
              {recipe.description || "No description available."}
            </p>

            <h3 className="font-semibold mb-1">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4 text-sm">
              {recipe.ingredients?.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>

            <h3 className="font-semibold mb-1">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4 text-sm">
              {recipe.instructions?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime || "N/A"} prep</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookTime || "N/A"} cook</span>
              </div>
              {servingSize && (
                <div className="flex items-center gap-1">
                  <span className="text-lg">👥</span>
                  <span>
                    {servingSize} serving{Number(servingSize) > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Calories */}
            {recipe.calories && (
              <p className="text-sm text-gray-800 mb-2">
                <strong>Calories:</strong> {recipe.calories}
              </p>
            )}

            {/* Tags */}
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

            {/* Options */}
            {(spiceLevel ||
              cuisine ||
              healthGoals ||
              (avoid && avoid.length > 0)) && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Personalized Options:</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {spiceLevel && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Spice: {spiceLevel}
                    </span>
                  )}
                  {cuisine && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Cuisine: {cuisine}
                    </span>
                  )}
                  {healthGoals && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Goal: {healthGoals}
                    </span>
                  )}
                  {avoid && avoid.length > 0 && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                      Avoid: {Array.isArray(avoid) ? avoid.join(", ") : avoid}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Date */}
            {formattedDate && (
              <p className="text-xs text-gray-400 italic mt-4">
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
