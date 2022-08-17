import { Router } from 'express';
import logger from '../utils/logger';

const router = Router();

router.get('/test-sentry-error', (_req, res) => {
  const error = new Error(`Test Sentry error - ${new Date().toISOString()}`);

  logger.error(error, true);

  res.send(error.message);
});

export default router;
