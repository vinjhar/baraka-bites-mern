import express from 'express';
import { checkSubscription } from '../middlewares/subscription.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // assuming you already have this
import { 
    generateRecipe,
    getUserRecipes,
    getRecipeById,
    deleteRecipeById,
    generateRecipeWithOpenAI
 } from '../controllers/recipe.controller.js';


 // --> /api/v1/recipes

const router = express.Router();

router.use(isAuthenticated); 

router.get('/test', (req, res)=> {
    res.send("The Route is Protected and working fine.")
})


router.post('/generate', checkSubscription, generateRecipe);

// POST /generate-openai
router.post('/generate-openai',checkSubscription, generateRecipeWithOpenAI)

// Get all recipes for logged-in user
router.get('/', getUserRecipes);


router.get('/:id', getRecipeById);


router.delete('/:id', deleteRecipeById);

export default router;
