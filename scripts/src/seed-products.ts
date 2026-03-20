import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Creating subscription products in Stripe...');

    const existingBasic = await stripe.products.search({
      query: "name:'Basic Plan' AND active:'true'"
    });

    if (existingBasic.data.length > 0) {
      console.log('Basic Plan already exists. Skipping.');
    } else {
      const basicProduct = await stripe.products.create({
        name: 'Basic Plan',
        description: 'Access to browse and download all automation scripts',
        metadata: {
          tier: 'basic',
          features: 'Browse automation scripts,Download scripts in all formats,Search and filter library,New scripts added regularly',
        },
      });
      console.log(`Created product: ${basicProduct.name} (${basicProduct.id})`);

      const basicPrice = await stripe.prices.create({
        product: basicProduct.id,
        unit_amount: 500,
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      console.log(`Created price: $5.00/month (${basicPrice.id})`);
    }

    const existingPro = await stripe.products.search({
      query: "name:'Pro Plan' AND active:'true'"
    });

    if (existingPro.data.length > 0) {
      console.log('Pro Plan already exists. Skipping.');
    } else {
      const proProduct = await stripe.products.create({
        name: 'Pro Plan',
        description: 'Everything in Basic plus AI-powered script generation',
        metadata: {
          tier: 'pro',
          features: 'Everything in Basic,AI-powered script generation,Request custom automation scripts,Generated scripts added to library,Priority support',
        },
      });
      console.log(`Created product: ${proProduct.name} (${proProduct.id})`);

      const proPrice = await stripe.prices.create({
        product: proProduct.id,
        unit_amount: 1000,
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      console.log(`Created price: $10.00/month (${proPrice.id})`);
    }

    console.log('Products and prices created successfully!');
    console.log('Webhooks will sync this data to your database automatically.');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
