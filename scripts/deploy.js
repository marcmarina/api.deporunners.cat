/* eslint-disable no-undef */
import 'dotenv/config';
import axios from 'axios';

async function deploy() {
  const [deploymentWebhookUrl] = process.argv.slice(2);

  if (!deploymentWebhookUrl) {
    throw new Error('Missing deployment webhook URL');
  }

  const res = await axios.get(deploymentWebhookUrl);

  if (res.status === 200) {
    console.log('Deployment webhook successfully sent');
  } else {
    throw new Error('Deployment webhook failed');
  }
}

deploy();
