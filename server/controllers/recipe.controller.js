import Recipe from '../models/recipe.model.js';
import User from '../models/user.model.js';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const HARAM_INGREDIENTS = [
  "pork", "bacon", "ham", "alcohol", "wine", "beer", "lard", "gelatin",
  "pepsin", "rennet", "vanilla extract", "rum", "brandy", "sherry",
  "cooking wine", "mirin", "sake", "blood", "pig", "liquor", "spirits"
];

// POST /generate
export const generateRecipe = async (req, res) => {
  const { ingredients, mealType } = req.body;
  const userId = req.user._id;
  console.log(userId)

  if (!ingredients || !Array.isArray(ingredients) || !mealType || !userId) {
    return res.status(400).json({ error: 'Missing or invalid fields: ingredients, mealType required.' });
  }

  const filtered = ingredients.filter(i =>
    !HARAM_INGREDIENTS.some(h => i.toLowerCase().includes(h))
  );

  if (filtered.length === 0) {
    return res.status(400).json({ error: 'All provided ingredients are haram.' });
  }

  const prompt = `
Create a 100% halal ${mealType} recipe using: ${filtered.join(', ')}.

CRITICAL REQUIREMENTS:
  - The recipe MUST be strictly halal
  - NO pork, alcohol, or any non-halal ingredients
  - If meat is used, assume it's already halal-certified (don't prefix with "halal")
  - NO cooking wine or alcohol-based extracts
  - Use halal substitutes for any non-halal ingredients
  - Create a unique variation if possible
  - Only mention "halal" for ingredients that specifically need clarification
  - Make sure given all measurements for the ingredients used in recipe

Format as a JSON object:
{
  "title": "...",
  "description": "...",
  "ingredients": ["..."],
  "instructions": ["..."],
  "prepTime": "...",
  "cookTime": "..."
}
`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:7001',
        'X-Title': 'Baraka Bites'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: 'You are a halal recipe assistant.' },
          { role: 'user', content: `STRICTLY respond ONLY with valid JSON object. DO NOT include explanation. Just the object:\n\n${prompt}` }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!response.ok) {
      return res.status(response.status).json({ error: result?.error?.message || 'OpenRouter API failed.' });
    }

    if (!content) {
      return res.status(500).json({ error: 'Empty content from model.' });
    }

    console.log('🔍 Raw AI Content:', content);

    let cleaned = content.trim();
    if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json|^```/, '').replace(/```$/, '').trim();
    }

    let parsedRecipe;
    try {
      parsedRecipe = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON from model response.' });
    }

    const recipeDoc = await Recipe.create({
      ...parsedRecipe,
      userId: userId,
      mealType,
      ingredients: filtered
    });

    await User.findByIdAndUpdate(userId, { $inc: { recipesGenerated: 1 }, $push: {recipes:recipeDoc._id} });

    res.status(200).json({ recipe: recipeDoc });
  } catch (err) {
    console.error('[Unhandled Error]', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};


// POST /generate-openai
export const generateRecipeWithOpenAI = async (req, res) => {
  const { ingredients, mealType } = req.body;
  const userId = req.user._id;

  if (!ingredients || !Array.isArray(ingredients) || !mealType || !userId) {
    return res.status(400).json({ error: 'Missing or invalid fields: ingredients, mealType required.' });
  }

  const filtered = ingredients.filter(i =>
    !HARAM_INGREDIENTS.some(h => i.toLowerCase().includes(h))
  );

  if (filtered.length === 0) {
    return res.status(400).json({ error: 'All provided ingredients are haram.' });
  }

  const prompt = `
Create a 100% halal ${mealType} recipe using: ${filtered.join(', ')}.

CRITICAL REQUIREMENTS:
- The recipe MUST be strictly halal
- NO pork, alcohol, or any non-halal ingredients
- If meat is used, assume it's already halal-certified (don't prefix with "halal")
- NO cooking wine or alcohol-based extracts
- Use halal substitutes for any non-halal ingredients
- Create a unique variation if possible
- Only mention "halal" for ingredients that specifically need clarification
- Make sure given all measurements for the ingredients used in recipe

Respond ONLY in the following JSON format:
{
  "title": "...",
  "description": "...",
  "ingredients": ["..."],
  "instructions": ["..."],
  "prepTime": "...",
  "cookTime": "..."
}
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a halal recipe assistant." },
          { role: "user", content: `STRICTLY respond ONLY with valid JSON object. DO NOT include explanation. Just the object:\n\n${prompt}` }
        ],
        temperature: 0.7
      })
    });

    const result = await openaiRes.json();
    const content = result.choices?.[0]?.message?.content;

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: result?.error?.message || 'OpenAI API failed.' });
    }

    if (!content) {
      return res.status(500).json({ error: 'Empty content from OpenAI model.' });
    }

    console.log('🔍 OpenAI Raw Content:', content);

    let cleaned = content.trim();
    if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json|^```/, '').replace(/```$/, '').trim();
    }

    let parsedRecipe;
    try {
      parsedRecipe = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON from OpenAI response.' });
    }

    const recipeDoc = await Recipe.create({
      ...parsedRecipe,
      userId,
      mealType,
      ingredients: filtered
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { recipesGenerated: 1 },
      $push: { recipes: recipeDoc._id }
    });

    res.status(200).json({ recipe: recipeDoc });
  } catch (err) {
    console.error('[Unhandled Error - OpenAI]', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};


// GET /
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// GET /:id
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// DELETE /:id
export const deleteRecipeById = async (req, res) => {
  try {
    const deleted = await Recipe.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // <-- This must match the schema field
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

