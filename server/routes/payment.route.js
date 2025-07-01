import express from 'express';
import { createCheckoutSession } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create-checkout-session', isAuthenticated,createCheckoutSession);

export default router;
