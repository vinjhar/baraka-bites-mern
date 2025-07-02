import express from 'express';
import { createCheckoutSession, cancelSubscription } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create-checkout-session', isAuthenticated,createCheckoutSession);
router.post('/cancel-subscription', isAuthenticated, cancelSubscription);

export default router;
