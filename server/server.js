import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.config.js";
import session from 'express-session';
import passport from 'passport';
import './config/passport.config.js';
import authRoutes from "./routes/auth.route.js"
import recipeRoutes from "./routes/recipe.route.js"
import paymentRoutes from "./routes/payment.route.js"
import stripeWebhookRoutes from "./routes/stripeWebhook.js"
import blogRoutes from "./routes/blog.route.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors()); 

app.use('/api/v1/stripe',stripeWebhookRoutes)

app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs', blogRoutes);

app.get('/',(req, res)=> {
    res.send("Welcome to Baraka Bites")
})


app.listen(PORT, async ()=>{ 
    console.log(`Server running on port http://localhost:${PORT}`)
    await connectDb();
});