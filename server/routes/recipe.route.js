import express from 'express';
import { checkSubscription } from '../middlewares/subscription.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // assuming you already have this
import { 
    generateRecipe,
    getUserRecipes,
    getRecipeById,
    deleteRecipeById
 } from '../controllers/recipe.controller.js';


 // --> /api/v1/recipes

const router = express.Router();

router.use(isAuthenticated); 

router.get('/test', (req, res)=> {
    res.send("The Route is Protected and working fine.")
})

// Generate a new recipe (check subscription)
router.post('/generate', checkSubscription, generateRecipe);

// Get all recipes for logged-in user
router.get('/', getUserRecipes);

// Get a single recipe by ID
router.get('/:id', getRecipeById);

// Delete a recipe
router.delete('/:id', deleteRecipeById);

export default router;
