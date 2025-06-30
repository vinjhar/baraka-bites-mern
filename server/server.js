import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.config.js";
import session from 'express-session';
import passport from 'passport';
import './config/passport.config.js';
import authRoutes from "./routes/auth.route.js"
import recipeRoutes from "./routes/recipe.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cors()); 
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res)=> {
    res.send("Welcome to Baraka Bites")
})

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recipes', recipeRoutes);
// app.use('/api/v1/payment', paymentRoutes);

app.listen(PORT, async ()=>{ 
    console.log(`Server running on port http://localhost:${PORT}`)
    await connectDb();
});