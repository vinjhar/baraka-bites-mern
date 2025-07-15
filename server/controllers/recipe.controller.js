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
  const { ingredients, mealType, servingSize, spiceLevel, cuisine, healthGoals, avoid } = req.body;
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

  // --- Construct dynamic instruction additions ---
let optionalDetails = '';
if (servingSize) optionalDetails += `\n- The recipe should serve approximately ${servingSize} people.`;
if (spiceLevel) optionalDetails += `\n- The dish should be ${spiceLevel} in spice level.`;
if (cuisine) optionalDetails += `\n- The recipe should be inspired by ${cuisine} cuisine.`;
if (healthGoals) optionalDetails += `\n- Align with these dietary goals: ${healthGoals}.`;
if (avoid && avoid.length > 0) optionalDetails += `\n- Avoid these ingredients: ${avoid.join(', ')}.`;


const prompt = `
You are a halal recipe generator.

TASK:
Create a unique, 100% halal ${mealType} recipe using the following ingredients:
${filtered.join(', ')}

${optionalDetails}

STRICT REQUIREMENTS:
- The recipe must be fully halal.
- No pork, alcohol, or non-halal ingredients.
- Assume meat is halal-certified; do NOT say "halal chicken", just "chicken".
- Do NOT use alcohol-based extracts or cooking wine.
- Use halal alternatives for any doubtful ingredients.
- Include realistic, clear measurements (e.g., 1 tsp cumin, 200g chicken).
- Provide a calorie estimate for the full recipe or per serving.
- Suggest relevant tags (e.g., "gluten-free", "vegan", "high-protein", etc.).
- Format the response as a clean, valid JSON object. No markdown, no explanations, no extra text.
- Avoid these ingredients: ${avoid.join(', ')}.

FORMAT:
Respond ONLY with this valid JSON object:

{
  "title": "Name of the recipe",
  "description": "1-2 line summary of the dish.",
  "ingredients": ["List of all ingredients with measurements"],
  "instructions": ["Step-by-step cooking instructions"],
  "prepTime": "e.g., 10 minutes",
  "cookTime": "e.g., 25 minutes",
  "calories": "e.g., 450 kcal per serving",
  "tags": ["vegan", "gluten-free", "low-carb"] // max 5 relevant tags
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

    const normalizedOptions = {
    servingSize,
    spiceLevel,
    cuisine,
    healthGoals,
    avoid: Array.isArray(avoid) ? avoid : avoid?.split(',').map(a => a.trim()).filter(Boolean)
    };

    const recipeDoc = await Recipe.create({
      ...parsedRecipe,
      userId,
      mealType,
      ingredients: filtered,
      options: normalizedOptions
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { recipesGenerated: 1 },
      $push: { recipes: recipeDoc._id }
    });

    res.status(200).json({ recipe: recipeDoc });

  } catch (err) {
    console.error('[Unhandled Error]', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};


// POST /generate-openai
export const generateRecipeWithOpenAI = async (req, res) => {
  const {
    ingredients,
    mealType,
    servingSize,
    spiceLevel,
    cuisine,
    healthGoals,
    avoid,
    userPrompt, 
  } = req.body;

  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing.' });
  }

  const usingUserPrompt = !!userPrompt?.trim();
  const usingIngredients = Array.isArray(ingredients) && ingredients.length > 0;

  if (usingUserPrompt && (usingIngredients || mealType)) {
    return res.status(400).json({
      error: 'Cannot use both userPrompt and ingredients/mealType. Choose one approach.',
    });
  }

  if (!usingUserPrompt && (!usingIngredients || !mealType)) {
    return res.status(400).json({
      error: 'Provide either a userPrompt or ingredients with mealType.',
    });
  }

  let filteredIngredients = [];
  if (usingIngredients) {
    filteredIngredients = ingredients.filter(
      (i) => !HARAM_INGREDIENTS.some((h) => i.toLowerCase().includes(h))
    );

    if (filteredIngredients.length === 0) {
      return res.status(400).json({ error: 'All provided ingredients are haram.' });
    }
  }

  let optionalDetails = '';
  if (servingSize) optionalDetails += `\n- Serves approximately ${servingSize} people.`;
  if (spiceLevel) optionalDetails += `\n- The dish should be ${spiceLevel} in spice level.`;
  if (cuisine && !usingUserPrompt) optionalDetails += `\n- Inspired by ${cuisine} cuisine.`;
  if (healthGoals && !usingUserPrompt) optionalDetails += `\n- Align with these dietary goals: ${healthGoals}.`;
  if (avoid?.length > 0)
    optionalDetails += `\n- Avoid these ingredients: ${avoid.join(', ')}.`;

  // --- Construct final prompt ---
  let prompt = '';

  if (usingUserPrompt) {
    prompt = `
You are a halal recipe generator.

TASK:
Create a 100% halal recipe based on this user query:
"${userPrompt.trim()}"

MUST INCLUDE:
${optionalDetails}

REQUIREMENTS:
- The recipe must be halal (no pork, alcohol, or doubtful ingredients).
- Use halal-certified ingredients (do NOT label them as 'halal').
- Provide clear steps and measurements.
- Include a calorie estimate.
- Suggest relevant tags (e.g., gluten-free, protein-rich).
- Output ONLY a JSON object, no markdown, no extra text.

FORMAT:
{
  "title": "Name of the recipe",
  "description": "1-2 line summary of the dish.",
  "ingredients": ["List of all ingredients with measurements"],
  "instructions": ["Step-by-step cooking instructions"],
  "prepTime": "e.g., 10 minutes",
  "cookTime": "e.g., 25 minutes",
  "calories": "e.g., 450 kcal per serving",
  "tags": ["vegan", "gluten-free", "low-carb"]
}
    `.trim();
  } else {
    prompt = `
You are a halal recipe generator.

TASK:
Create a unique, 100% halal ${mealType} recipe using the following ingredients:
${filteredIngredients.join(', ')}

${optionalDetails}

STRICT REQUIREMENTS:
- The recipe must be halal.
- No pork, alcohol, or doubtful ingredients.
- Assume meat is halal-certified (no need to label as "halal").
- Use halal alternatives for any doubtful ingredients.
- Include clear measurements, calories, and tags.
- Output ONLY a JSON object. No explanation or markdown.

FORMAT:
{
  "title": "Name of the recipe",
  "description": "1-2 line summary of the dish.",
  "ingredients": ["List of all ingredients with measurements"],
  "instructions": ["Step-by-step cooking instructions"],
  "prepTime": "e.g., 10 minutes",
  "cookTime": "e.g., 25 minutes",
  "calories": "e.g., 450 kcal per serving",
  "tags": ["vegan", "gluten-free", "low-carb"]
}
    `.trim();
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a halal recipe assistant." },
          {
            role: "user",
            content: `Respond ONLY with valid JSON:\n\n${prompt}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const result = await openaiRes.json();
    const content = result.choices?.[0]?.message?.content;

    if (!openaiRes.ok) {
      return res
        .status(openaiRes.status)
        .json({ error: result?.error?.message || "OpenAI API failed." });
    }

    if (!content) {
      return res.status(500).json({ error: "Empty response from OpenAI." });
    }

    let cleaned = content.trim();
    if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json|^```/, "").replace(/```$/, "").trim();
    }

    let parsedRecipe;
    try {
      parsedRecipe = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({ error: "Failed to parse JSON from OpenAI." });
    }


    const normalizedOptions = {
      ...(servingSize && { servingSize }),
      ...(spiceLevel && { spiceLevel }),
      ...(cuisine && !usingUserPrompt && { cuisine }),
      ...(healthGoals && !usingUserPrompt && { healthGoals }),
      avoid: Array.isArray(avoid)
        ? avoid
        : avoid?.split(",").map((a) => a.trim()).filter(Boolean),
    };

    const recipeDoc = await Recipe.create({
      ...parsedRecipe,
      userId,
      mealType: usingUserPrompt ? null : mealType,
      ingredients: usingUserPrompt ? parsedRecipe.ingredients : filteredIngredients,
      options: normalizedOptions,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { recipesGenerated: 1 },
      $push: { recipes: recipeDoc._id },
    });

    res.status(200).json({ recipe: recipeDoc });
  } catch (err) {
    console.error("[OpenAI Error]", err);
    res.status(500).json({ error: err.message || "Internal server error" });
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

