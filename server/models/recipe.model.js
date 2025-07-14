import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  instructions: {
    type: [String],
    required: true
  },
  prepTime: {
    type: String,
    required: false
  },
  cookTime: {
    type: String,
    required: false
  },
  mealType: {
    type: String,
    enum: ['Main Meals', 'Light Meals', 'Snack', 'Dessert', 'Suhoor (Pre-Dawn)', 'Iftar (Post-Sunset)', 'Healthy Snacks'],
    default: 'Other'
  },
  calories:{
    type: String,
    required: false
  },
  options: {
    servingSize: {
      type: String 
    },
    spiceLevel: {
      type: String,
    },
    cuisine: {
      type: String 
    },
    healthGoals: {
      type: String
    },
    avoid: {
      type: [String] 
    }
  },
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
