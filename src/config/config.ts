import 'dotenv/config';
import { generateToken } from '../utils/Utils';

function fetchNullableVariable(key: string): string | null {
  return process.env[key] ?? null;
}

function fetchVariable(key: string): string {
  const value = process.env[key];

  if (!value) throw new Error(`Could not fetch environment variable ${key}`);

  return value;
}

type Config = {
  mongoURI: () => string;
  appSecretKey: () => string;
  apiToken: () => string;
  jwtExpiration: () => string;
  emailFrom: () => string;
  stripeKey: () => string;
  sendgridKey: () => string;
  port: () => number;
  seedNumbers: () => {
    members: number;
    users: number;
    events: number;
  };
  stripeFeeProductId: () => string;
  sentryDSN: () => string;
  environment: () => string;
};

const defaultConfig: Config = {
  mongoURI: () => fetchVariable('MONGODB_URI'),
  appSecretKey: () =>
    isTest()
      ? 'secretKey'
      : fetchNullableVariable('APP_SECRET_KEY') ?? generateToken(32),
  apiToken: () => fetchVariable('API_TOKEN'),
  jwtExpiration: () => fetchNullableVariable('JWT_EXPIRATION_TIME') ?? '900',
  emailFrom: () => fetchVariable('EMAIL_FROM'),
  stripeKey: () => (!isTest() ? fetchVariable('STRIPE_SECRET_KEY') : ''),
  sendgridKey: () => fetchVariable('SENDGRID_API_KEY'),
  port: () => parseInt(fetchNullableVariable('PORT') ?? '8080'),
  seedNumbers: () => {
    return {
      members: parseInt(fetchNullableVariable('SEED_MEMBER_COUNT') ?? '15'),
      users: parseInt(fetchNullableVariable('SEED_USER_COUNT') ?? '2'),
      events: parseInt(fetchNullableVariable('SEED_EVENT_COUNT') ?? '5'),
    };
  },
  stripeFeeProductId: () =>
    isProd() ? 'prod_JrHBBMKU67z4gu' : 'prod_JrHTTZhO6jaGdK',
  sentryDSN: () => fetchVariable('SENTRY_DSN'),
  environment: () => fetchNullableVariable('NODE_ENV') ?? 'development',
};

const testConfig: Config = {
  mongoURI: () => '',
  appSecretKey: () => 'secretkey',
  apiToken: () => 'apitoken',
  jwtExpiration: () => '900',
  emailFrom: () => '',
  stripeKey: () => '',
  sendgridKey: () => '',
  port: () => 8080,
  seedNumbers: () => {
    return {
      members: 1,
      users: 1,
      events: 1,
    };
  },
  stripeFeeProductId: () => '',
  sentryDSN: () => '',
  environment: () => '',
};

export const isDev = () => defaultConfig.environment() === 'development';
const isTest = () => defaultConfig.environment() === 'test';
const isProd = () => defaultConfig.environment() === 'production';

const config = isTest() ? testConfig : defaultConfig;

export default config;
