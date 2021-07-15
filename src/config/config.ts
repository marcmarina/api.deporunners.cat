import 'dotenv/config';
import { generateToken } from '../utils/Utils';

const isTest = process.env.NODE_ENV === 'test';

function fetchNullableVariable(key: string): string | null {
  return process.env[key] ?? null;
}

function fetchVariable(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Could not fetch environment variable ${key}`);

  return value;
}

export default {
  mongoURI: () => fetchVariable('MONGODB_URI'),
  appSecretKey: () =>
    isTest
      ? 'secretKey'
      : fetchNullableVariable('APP_SECRET_KEY') ?? generateToken(32),
  apiToken: () => fetchVariable('API_TOKEN'),
  jwtExpiration: () => fetchNullableVariable('JWT_EXPIRATION_TIME') ?? '900',
  emailFrom: () => fetchVariable('EMAIL_FROM'),
  stripeKey: () => (!isTest ? fetchVariable('STRIPE_SECRET_KEY') : ''),
  sendgridKey: () => fetchVariable('SENDGRID_API_KEY'),
  port: () => fetchNullableVariable('PORT') ?? 8080,
  seedNumbers: () => {
    return {
      members: parseInt(fetchNullableVariable('SEED_MEMBER_COUNT') ?? '150'),
      users: parseInt(fetchNullableVariable('SEED_USER_COUNT') ?? '2'),
      events: parseInt(fetchNullableVariable('SEED_EVENT_COUNT') ?? '20'),
    };
  },
  stripeFeeProductId: () => fetchVariable('STRIPE_FEE_PRODUCT_ID'),
};
