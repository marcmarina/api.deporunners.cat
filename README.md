# Deporunners - API

[![CircleCI](https://circleci.com/gh/marcmarina/api.deporunners.cat/tree/develop.svg?style=svg)](https://circleci.com/gh/marcmarina/api.deporunners.cat/tree/develop)

[![node](https://img.shields.io/badge/Node.js-v.14.X-brightgreen)](https://nodejs.org)
[![express](https://img.shields.io/badge/Express-v.4.17.X-brightgreen)](https://expressjs.com/)
[![mongoose](https://img.shields.io/badge/Mongoose-v.5.9.X-brightgreen)](https://mongoosejs.com/)

This is the API that powers the other two parts of this project: [website][web] and [app][app].

## Setup

Requirements:

- MongoDB
- `yarn`
- Node

To set up the project, install dependencies using `yarn` and then create a `.env` file using the provided example. If you need help, go to [this section](#env-help).

To populate the database and start the development server (defaults to port 8080):

```
npm run seed
npm run dev
```

### `.env` help

Almost all variables in the `.env` file are required.

`APP_SECRET_KEY` and `API_TOKEN` are meant to be fairly long (60-30 characters) hexadecimal strings. They can be the same but there's no need.

`JWT_EXPIRATION_TIME` is the time it takes for all issued JWT's to expire. In my production app it is set to 15 minutes (900 seconds).

`STRIPE_SECRET_KEY` is your Stripe test key, the one that's not publishable. In the front-end you will have to use your publishable one.

`MONGODB_URI` is the URI for your mongodb instance, that can be in your cloud cluster or in your machine.

All the `SEED_` variables are not needed, as they have default values inside the script, but feel free to change them here.

`SENDGRID_API_KEY` is necessary for sending emails. `EMAIL_FROM` is your preferred address to send emails from (must be set up on your Sendgrid account).

## Deployment

This API is currently deployed twice: one for production and one for live staging.

- Production: https://deporunners-api.herokuapp.com
- Staging: https://deporunners-api-development.herokuapp.com

[web]: https://github.com/marcmarina/gestor.deporunners.cat
[app]: https://github.com/marcmarina/Deporunners
