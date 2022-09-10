/* eslint-disable no-undef */
import 'dotenv/config';
import axios from 'axios';

async function deploy() {
  const { RENDER_DEPLOY_URL } = process.env;

  if (!RENDER_DEPLOY_URL) {
    throw new Error('Missing Render deployment URL');
  }

  const res = await axios.get(RENDER_DEPLOY_URL);

  console.log(res.data);
}

deploy();
