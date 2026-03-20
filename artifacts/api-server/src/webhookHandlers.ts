import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { logger } from './lib/logger';
import type Stripe from 'stripe';

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== 'subscription' || !session.subscription || !session.customer) {
    return;
  }

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;

  const user = await storage.getUserByStripeCustomerId(customerId);
  if (!user) {
    logger.warn({ customerId }, 'No user found for Stripe customer during checkout');
    return;
  }

  const stripe = await getUncachableStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const priceId = subscription.items.data[0]?.price?.id;
  let tier = 'basic';
  if (priceId) {
    const price = subscription.items.data[0].price;
    const amount = price.unit_amount || 0;
    tier = amount >= 1000 ? 'pro' : 'basic';
  }

  await storage.updateUserStripeInfo(user.id, {
    stripeSubscriptionId: subscriptionId,
    subscriptionTier: tier,
  });

  logger.info({ userId: user.id, tier, subscriptionId }, 'User subscription activated after checkout');
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const user = await storage.getUserByStripeCustomerId(customerId);
  if (!user) return;

  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  if (isActive) {
    const priceId = subscription.items.data[0]?.price?.id;
    const amount = subscription.items.data[0]?.price?.unit_amount || 0;
    const tier = amount >= 1000 ? 'pro' : 'basic';

    await storage.updateUserStripeInfo(user.id, {
      stripeSubscriptionId: subscription.id,
      subscriptionTier: tier,
    });
    logger.info({ userId: user.id, tier }, 'Subscription updated');
  } else {
    await storage.updateUserStripeInfo(user.id, {
      stripeSubscriptionId: subscription.id,
      subscriptionTier: null,
    });
    logger.info({ userId: user.id, status: subscription.status }, 'Subscription deactivated');
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const user = await storage.getUserByStripeCustomerId(customerId);
  if (!user) return;

  await storage.updateUserStripeInfo(user.id, {
    stripeSubscriptionId: null,
    subscriptionTier: null,
  });
  logger.info({ userId: user.id }, 'Subscription deleted');
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    const event = JSON.parse(payload.toString()) as Stripe.Event;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
      }
    } catch (err) {
      logger.error({ error: err, eventType: event.type }, 'Error processing webhook event for user update');
    }
  }
}
