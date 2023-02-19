import { logger } from '../logger';

import { fireWebhook } from './fire-webhook';

async function deploy() {
  const [deploymentWebhookUrl] = process.argv.slice(2);

  if (!deploymentWebhookUrl) {
    throw new Error('Missing deployment webhook URL');
  }

  const result = await fireWebhook('GET', deploymentWebhookUrl);

  if (result.success === true) {
    logger.info('Deployment webhook successfully sent');
  } else if (result.error) {
    throw result.error;
  } else if (result.success === false) {
    throw new Error(
      `Deployment webhook failed with status ${result.status} and response ${result.response}`,
    );
  }
}

deploy();
