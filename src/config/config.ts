import 'dotenv/config';
import { generateToken } from '../utils/Utils';

export function fetchNullableVariable(key: string): string | null {
  return process.env[key] ?? null;
}

export function fetchVariable(key: string): string {
  const value = process.env[key];

  if (!value) throw new Error(`Could not fetch environment variable ${key}`);

  return value;
}

type Config = {
  mongoURI: string;
  appSecretKey: string;
  apiToken: string;
  jwtExpiration: string;
  emailFrom: string;
  stripeKey: string;
  sendgridKey: string;
  port: number;
  seedNumbers: {
    members: number;
    users: number;
    events: number;
  };
  stripeFeeProductId: string;
  sentryDSN: string;
  environment: string;
};

const environment = fetchNullableVariable('NODE_ENV') ?? 'development';

export const envIsDev = environment === 'development';
export const envIsTest = environment === 'test';
const envIsProd = environment === 'production';

const getConfig = (): Config => {
  switch (environment) {
    case 'test':
      return {
        mongoURI: '',
        appSecretKey: 'secretkey',
        apiToken: 'apitoken',
        jwtExpiration: '900',
        emailFrom: '',
        stripeKey: '',
        sendgridKey: '',
        port: 8080,
        seedNumbers: {
          members: 1,
          users: 1,
          events: 1,
        },
        stripeFeeProductId: '',
        sentryDSN: '',
        environment,
      };
    default:
      return {
        mongoURI: fetchVariable('MONGODB_URI'),
        appSecretKey:
          fetchNullableVariable('APP_SECRET_KEY') ?? generateToken(32),
        apiToken: fetchVariable('API_TOKEN'),
        jwtExpiration: fetchNullableVariable('JWT_EXPIRATION_TIME') ?? '900',
        emailFrom: fetchVariable('EMAIL_FROM'),
        stripeKey: fetchVariable('STRIPE_SECRET_KEY'),
        sendgridKey: fetchVariable('SENDGRID_API_KEY'),
        port: parseInt(fetchNullableVariable('PORT') ?? '8080'),
        seedNumbers: {
          members: parseInt(fetchNullableVariable('SEED_MEMBER_COUNT') ?? '15'),
          users: parseInt(fetchNullableVariable('SEED_USER_COUNT') ?? '2'),
          events: parseInt(fetchNullableVariable('SEED_EVENT_COUNT') ?? '5'),
        },
        stripeFeeProductId: envIsProd
          ? 'prod_JrHBBMKU67z4gu'
          : 'prod_JrHTTZhO6jaGdK',
        sentryDSN: fetchVariable('SENTRY_DSN'),
        environment,
      };
  }
};

const config = getConfig();

export default config;
