// routes/stripe.js or routes/stripeWebhook.js

import express from 'express';
import Stripe from 'stripe';
import User from '../models/user.model.js'; // adjust path as needed

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires the raw body to validate the signature
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    switch (event.type) {
      case 'checkout.session.completed': {
        const customerId = data.customer;
        const subscriptionId = data.subscription;

        try {
          const user = await User.findOne({ stripeCustomerId: customerId });
          if (user) {
            user.isPremium = true;
            user.stripeSubscriptionId = subscriptionId;
            await user.save();
            console.log(`✅ User ${user.email} upgraded to Premium`);
          }
        } catch (err) {
          console.error('❌ Failed to update user to premium:', err.message);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const customerId = data.customer;

        try {
          const user = await User.findOne({ stripeCustomerId: customerId });
          if (user) {
            user.isPremium = false;
            user.stripeSubscriptionId = null;
            await user.save();
            console.log(`⚠️ User ${user.email}'s subscription cancelled.`);
          }
        } catch (err) {
          console.error('❌ Failed to downgrade user:', err.message);
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);


export default router;
