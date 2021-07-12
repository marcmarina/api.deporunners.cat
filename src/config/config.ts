import 'dotenv/config';
import { generateToken } from '../utils/Utils';

const isTest = process.env.NODE_ENV === 'test';

const mongoURI = () =>
  process.env.MONGODB_URI ?? 'mongodb://localhost/deporunners';

const appSecretKey = () =>
  isTest ? 'secretKey' : process.env.APP_SECRET_KEY ?? generateToken(32);

const apiToken = () => {
  const key = isTest ? 'apiToken' : process.env.API_TOKEN;

  if (!key) throw new Error('No API Token  set');

  return key;
};

const jwtExpiration = () => process.env.JWT_EXPIRATION_TIME ?? '900';

const emailFrom = () => process.env.EMAIL_FROM;

const stripeKey = () => {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) throw new Error('No Stripe secret key set');

  return key;
};

const sendgridKey = () => process.env.SENDGRID_API_KEY;

const port = () => process.env.PORT ?? 8080;

const seedNumbers = () => {
  return {
    members: parseInt(process.env.SEED_MEMBER_COUNT ?? '150'),
    users: parseInt(process.env.SEED_USER_COUNT ?? '2'),
    events: parseInt(process.env.SEED_EVENT_COUNT ?? '20'),
  };
};

export default {
  apiToken,
  appSecretKey,
  mongoURI,
  jwtExpiration,
  emailFrom,
  stripeKey,
  sendgridKey,
  port,
  seedNumbers,
};
