import axios, { Method } from 'axios';

import { logger } from '../logger';

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

type Maybe<T> = T | null;

async function fireWebhook(
  method: Method = 'POST',
  url,
): Promise<{
  success: boolean;
  error: Maybe<Error>;
  response: Maybe<any>;
  status: Maybe<number>;
}> {
  try {
    const response = await axios({ method, url });

    if (response.status === 200) {
      return {
        success: true,
        error: null,
        response: response.data,
        status: response.status,
      };
    } else {
      return {
        success: false,
        response: response.data,
        status: response.status,
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error,
      response: null,
      status: null,
    };
  }
}

deploy();
