/* eslint-disable no-undef */
import 'dotenv/config';
import axios from 'axios';

async function deploy() {
  const [renderDeployUrl] = process.argv.slice(2);

  if (!renderDeployUrl) {
    throw new Error('Missing Render deployment URL');
  }

  const res = await axios.get(renderDeployUrl);

  if (res.status === 200) {
    console.log('Deployment webhook successfully sent');
  } else {
    throw new Error('Deployment webhook failed');
  }
}

deploy();
