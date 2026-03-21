import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Creating Ninjamation subscription products in Stripe...');

    const tiers = [
      {
        name: 'Starter Plan',
        description: 'Basic workflows, script library access, and community support',
        tier: 'starter',
        amount: 1000,
        features: 'Basic workflows,Script library access,Download scripts in all formats,Community support,Limited executions',
      },
      {
        name: 'Pro Plan',
        description: 'Unlimited workflows, AI agents & generation, all integrations',
        tier: 'pro',
        amount: 2000,
        features: 'Everything in Starter,Unlimited workflows,AI agents & script generation,All integrations,Priority support,Automation packs',
      },
      {
        name: 'Enterprise Plan',
        description: 'Multi-tenant support, all automation packs, white-label potential',
        tier: 'enterprise',
        amount: 10000,
        features: 'Everything in Pro,Multi-tenant support,All automation packs,White-label potential,Dedicated support,Custom integrations',
      },
    ];

    for (const t of tiers) {
      const existing = await stripe.products.search({
        query: `name:'${t.name}' AND active:'true'`
      });

      if (existing.data.length > 0) {
        console.log(`${t.name} already exists. Skipping.`);
        continue;
      }

      const product = await stripe.products.create({
        name: t.name,
        description: t.description,
        metadata: { tier: t.tier, features: t.features },
      });
      console.log(`Created product: ${product.name} (${product.id})`);

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: t.amount,
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      console.log(`Created price: $${t.amount / 100}/month (${price.id})`);
    }

    console.log('Products and prices created successfully!');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
