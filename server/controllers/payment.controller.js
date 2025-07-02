import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2022-11-15',
// });

export const createCheckoutSession = async (req, res) => {
  const { priceId, mode } = req.body;

  if (!priceId || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = req.user;

    // If user doesn't have a Stripe customer ID, create one
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode,
      customer: user.stripeCustomerId, // ✅ attach existing or new customer
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error.message);
    return res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
};

export const cancelSubscription = async (req, res) => {
  const user = req.user;

  if (!user.stripeSubscriptionId) {
    return res.status(400).json({ error: 'No active subscription found.' });
  }

  try {
    // Cancel subscription on Stripe
    console.log('Attempting to cancel subscription:', user.stripeSubscriptionId);
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    // Update user in DB
    user.isPremium = false;
    user.stripeSubscriptionId = null;
    await user.save();

    return res.status(200).json({ message: 'Subscription cancelled successfully.' });
  } catch (error) {
    console.error('Subscription cancellation failed:', error.message);
    return res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
};
