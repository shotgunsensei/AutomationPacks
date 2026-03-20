import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from "./stripeClient";
import { syncFromGithub } from "./githubSync";
import app from "./app";
import { logger } from "./lib/logger";

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  try {
    logger.info('Initializing Stripe schema...');
    await runMigrations({ databaseUrl, schema: 'stripe' });
    logger.info('Stripe schema ready');

    const stripeSync = await getStripeSync();

    logger.info('Setting up managed webhook...');
    const replitDomains = process.env.REPLIT_DOMAINS;
    if (!replitDomains) {
      throw new Error('REPLIT_DOMAINS environment variable is required for webhook URL');
    }
    const webhookBaseUrl = `https://${replitDomains.split(',')[0]}`;
    await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
    logger.info('Webhook configured');

    logger.info('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => logger.info('Stripe data synced'))
      .catch((err: Error) => logger.error({ error: err }, 'Error syncing Stripe data'));
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Stripe');
    throw error;
  }
}

async function initGithubSync() {
  try {
    logger.info('Starting initial GitHub sync...');
    const result = await syncFromGithub();
    logger.info({ synced: result.synced }, result.message);
  } catch (error) {
    logger.error({ error }, 'Initial GitHub sync failed');
  }
}

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

await initStripe();

app.listen(port, () => {
  logger.info({ port }, "Server listening");
  initGithubSync();
});
