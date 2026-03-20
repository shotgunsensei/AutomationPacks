import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { stripeService } from "../stripeService";
import { getStripePublishableKey } from "../stripeClient";
import {
  GetSubscriptionStatusResponse,
  CreateCheckoutSessionBody,
  CreateCheckoutSessionResponse,
  CreatePortalSessionResponse,
  GetSubscriptionPlansResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/subscription/status", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await storage.getUser(req.user.id);
    if (!user || !user.stripeSubscriptionId) {
      const data = GetSubscriptionStatusResponse.parse({
        hasSubscription: false,
        tier: null,
        status: null,
        currentPeriodEnd: null,
        stripeCustomerId: user?.stripeCustomerId || null,
      });
      res.json(data);
      return;
    }

    const subscription = await storage.getSubscription(user.stripeSubscriptionId);
    const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

    const data = GetSubscriptionStatusResponse.parse({
      hasSubscription: isActive,
      tier: isActive ? (user.subscriptionTier || 'basic') : null,
      status: subscription?.status || null,
      currentPeriodEnd: subscription?.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
      stripeCustomerId: user.stripeCustomerId || null,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ error: err }, "Failed to get subscription status");
    res.status(500).json({ error: "Failed to get subscription status" });
  }
});

router.post("/subscription/checkout", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { priceId } = CreateCheckoutSessionBody.parse(req.body);
    const user = await storage.getUser(req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer(user.email || '', user.id);
      await storage.updateUserStripeInfo(user.id, { stripeCustomerId: customer.id });
      customerId = customer.id;
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      `${baseUrl}/checkout/success`,
      `${baseUrl}/pricing`
    );

    const data = CreateCheckoutSessionResponse.parse({ url: session.url });
    res.json(data);
  } catch (err) {
    req.log.error({ error: err }, "Failed to create checkout session");
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/subscription/portal", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await storage.getUser(req.user.id);
    if (!user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer found" });
      return;
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const session = await stripeService.createCustomerPortalSession(
      user.stripeCustomerId,
      `${baseUrl}/account`
    );

    const data = CreatePortalSessionResponse.parse({ url: session.url });
    res.json(data);
  } catch (err) {
    req.log.error({ error: err }, "Failed to create portal session");
    res.status(500).json({ error: "Failed to create portal session" });
  }
});

router.get("/subscription/plans", async (_req, res) => {
  try {
    const rows = await storage.listProductsWithPrices();

    if (rows.length > 0) {
      const productsMap = new Map<string, any>();
      for (const row of rows) {
        if (!productsMap.has(row.product_id as string)) {
          productsMap.set(row.product_id as string, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            metadata: row.product_metadata,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id as string).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }

      const products = Array.from(productsMap.values());

      const plans = products.map((p: any) => {
        const monthlyPrice = p.prices.find((pr: any) => {
          const recurring = typeof pr.recurring === 'string' ? JSON.parse(pr.recurring) : pr.recurring;
          return recurring?.interval === 'month';
        });

        const metadata = typeof p.metadata === 'string' ? JSON.parse(p.metadata) : (p.metadata || {});
        const features = metadata.features ? metadata.features.split(',').map((f: string) => f.trim()) : [];

        return {
          id: p.id,
          name: p.name || 'Plan',
          description: p.description || '',
          priceId: monthlyPrice?.id || '',
          amount: monthlyPrice?.unit_amount || 0,
          interval: 'month',
          features,
        };
      });

      const data = GetSubscriptionPlansResponse.parse({ plans });
      res.json(data);
      return;
    }

    const { getUncachableStripeClient } = await import("../stripeClient");
    const stripe = await getUncachableStripeClient();
    const products = await stripe.products.list({ active: true, limit: 10 });
    const prices = await stripe.prices.list({ active: true, limit: 20 });

    const plans = products.data.map((product) => {
      const productPrices = prices.data.filter(
        (p) => (typeof p.product === 'string' ? p.product : p.product) === product.id && p.recurring?.interval === 'month'
      );
      const monthlyPrice = productPrices[0];
      const metadata = product.metadata || {};
      const features = metadata.features ? metadata.features.split(',').map((f: string) => f.trim()) : [];

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        priceId: monthlyPrice?.id || '',
        amount: monthlyPrice?.unit_amount || 0,
        interval: 'month',
        features,
      };
    });

    const data = GetSubscriptionPlansResponse.parse({ plans });
    res.json(data);
  } catch (err) {
    logger.error({ error: err }, "Failed to get plans");
    res.status(500).json({ error: "Failed to get subscription plans" });
  }
});

export default router;
