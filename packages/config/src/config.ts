import 'dotenv/config';

import { merge } from 'lodash';
import * as z from 'zod';

import { assertNever, generateToken } from '@deporunners/utils';

import { fetchNullableVariable, fetchVariable } from './fetch-variable';

export enum Environment {
  Production = 'production',
  Staging = 'staging',
  Dev = 'development',
  Test = 'test',
}

const environment: Environment = (fetchNullableVariable('NODE_ENV') ??
  'development') as Environment;

const configSchema = z.object({
  mongoURI: z.string(),
  appSecretKey: z.string(),
  apiToken: z.string(),
  jwtExpiration: z.string(),
  emailFrom: z.string(),
  stripeKey: z.string(),
  sendgridKey: z.string(),
  port: z.number(),
  seedNumbers: z.object({
    members: z.number(),
    users: z.number(),
    events: z.number(),
  }),
  stripeFeeProductId: z.string(),
  sentryDSN: z.string(),
  environment: z.nativeEnum(Environment),
});

type Config = z.infer<typeof configSchema>;

const baseConfig = Object.freeze({
  appSecretKey: fetchNullableVariable('APP_SECRET_KEY') ?? generateToken(32),
  jwtExpiration: fetchNullableVariable('JWT_EXPIRATION_TIME') ?? '900',
  port: parseInt(fetchNullableVariable('PORT') ?? '8080'),
  seedNumbers: {
    members: parseInt(fetchNullableVariable('SEED_MEMBER_COUNT') ?? '15'),
    users: parseInt(fetchNullableVariable('SEED_USER_COUNT') ?? '2'),
    events: parseInt(fetchNullableVariable('SEED_EVENT_COUNT') ?? '5'),
  },
  stripeFeeProductId:
    environment === Environment.Production
      ? 'prod_JrHBBMKU67z4gu'
      : 'prod_JrHTTZhO6jaGdK',
  environment,
});

function getConfigForEnvironment(environment: Environment) {
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
          appSecretKey: 'test',
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
}

function getConfig(): Config {
  const parseResult = configSchema.safeParse(
    merge({}, baseConfig, getConfigForEnvironment(environment)),
  );

  if (!parseResult.success) {
    // eslint-disable-next-line no-console
    console.log(`Invalid config: ${parseResult.error}`);
    process.exit(1);
  }

  return parseResult.data;
}

export const config = getConfig();
