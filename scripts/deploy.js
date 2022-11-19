/* eslint-disable no-undef */
import { fireWebhook } from './fire-webhook.js';

async function deploy() {
  const [deploymentWebhookUrl] = process.argv.slice(2);

  if (!deploymentWebhookUrl) {
    throw new Error('Missing deployment webhook URL');
  }

  const res = await fireWebhook('GET', deploymentWebhookUrl);

  if (res.success) {
    console.log('Deployment webhook successfully sent');
  } else if (res.error) {
    throw res.error;
  } else {
    throw new Error(
      `Deployment webhook failed with status ${res.status} and response ${res.response}`
    );
  }
}

deploy();
