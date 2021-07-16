import * as Sentry from '@sentry/node';
import { isDev } from '../config/config';

export default {
  error: (error: Error) => {
    if (!isDev()) {
      console.log(error);
    } else {
      Sentry.captureException(error);
    }
  },
};
