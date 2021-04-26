import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test';

const mongoURI = () =>
  isTest ? 'mongodb://localhost/deporunners' : process.env.MONGODB_URI;

const appSecretKey = () => (isTest ? 'secretKey' : process.env.APP_SECRET_KEY);

const apiToken = () => (isTest ? 'apiToken' : process.env.API_TOKEN);

const jwtExpiration = () => process.env.JWT_EXPIRATION_TIME ?? '900';

const emailFrom = () => process.env.EMAIL_FROM ?? 'cedeporunners@gmail.com';

const stripeKey = () => process.env.STRIPE_SECRET_KEY;

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
