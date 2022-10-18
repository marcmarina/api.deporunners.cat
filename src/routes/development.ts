import { Router } from 'express';
import { getEmailTemplate } from '../mail/get-template';
import logger from '../utils/logger';

const router = Router();

router.get('/test-sentry-error', (_req, res) => {
  const error = new Error(`Test Sentry error - ${new Date().toISOString()}`);

  logger.error(error, true);

  res.send(error.message);
});

router.get('/email', async (_req, res) => {
  const email = await getEmailTemplate('member/newMember.pug', {
    member: {
      dni: '12345678A',
    },
  });

  res.send(email);
});

export default router;
