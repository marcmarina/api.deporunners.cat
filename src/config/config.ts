import 'dotenv/config';
import { merge } from 'lodash';

import { generateToken } from '../utils/Utils';
import { assertNever } from '../utils/assert-never';

export function fetchNullableVariable(key: string): string | null {
  return process.env[key] ?? null;
}

export function fetchVariable(key: string): string {
  const value = process.env[key];

  if (!value) throw new Error(`Could not fetch environment variable ${key}`);

  return value;
}

enum Environment {
  Production = 'production',
  Staging = 'staging',
  Dev = 'development',
  Test = 'test',
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
  environment: Environment;
};

const environment: Environment = (fetchNullableVariable('NODE_ENV') ??
  'development') as Environment;

export const envIsDev = environment === Environment.Dev;
export const envIsTest = environment === Environment.Test;
const envIsProd = environment === Environment.Production;

const baseConfig = {
  appSecretKey: fetchNullableVariable('APP_SECRET_KEY') ?? generateToken(32),
  jwtExpiration: fetchNullableVariable('JWT_EXPIRATION_TIME') ?? '900',
  port: parseInt(fetchNullableVariable('PORT') ?? '8080'),
  seedNumbers: {
    members: parseInt(fetchNullableVariable('SEED_MEMBER_COUNT') ?? '15'),
    users: parseInt(fetchNullableVariable('SEED_USER_COUNT') ?? '2'),
    events: parseInt(fetchNullableVariable('SEED_EVENT_COUNT') ?? '5'),
  },
  stripeFeeProductId: envIsProd ? 'prod_JrHBBMKU67z4gu' : 'prod_JrHTTZhO6jaGdK',
  environment,
};

const getConfigForEnvironment = (environment: Environment) => {
  try {
    switch (environment) {
      case Environment.Production:
      case Environment.Staging:
      case Environment.Dev:
        return {
          mongoURI: fetchVariable('MONGODB_URI'),
          apiToken: fetchVariable('API_TOKEN'),
          emailFrom: fetchVariable('EMAIL_FROM'),
          stripeKey: fetchVariable('STRIPE_SECRET_KEY'),
          sendgridKey: fetchVariable('SENDGRID_API_KEY'),
          sentryDSN: fetchVariable('SENTRY_DSN'),
        };
      case Environment.Test:
        return {
          mongoURI: '',
          apiToken: 'apitoken',
          emailFrom: '',
          stripeKey: '',
          sendgridKey: '',
          sentryDSN: '',
        };
      default:
        assertNever(environment);
    }
  } catch (err) {
    if (err.message.includes('Unexpected object')) {
      throw new Error(
        `Environment "${environment}" is not valid, choose one from: ${Object.values(
          Environment,
        ).join(', ')}.`,
      );
    }

    throw err;
  }
};

const getConfig = (): Config => {
  return merge(baseConfig, getConfigForEnvironment(environment));
};

export const config = getConfig();
