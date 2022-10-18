import { Router } from 'express';
import logger from '../utils/logger';
import { getPugTemplate } from '../utils/Utils';

const router = Router();

router.get('/test-sentry-error', (_req, res) => {
  const error = new Error(`Test Sentry error - ${new Date().toISOString()}`);

  logger.error(error, true);

  res.send(error.message);
});

router.get('/email', async (_req, res) => {
  const email = getPugTemplate('member/newMember.pug', {
    member: {
      dni: '12345678A',
    },
  });

  res.send(email);
});

export default router;
