FROM node:14-alpine3.13 as build

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

RUN rm -rf ./node_modules

RUN yarn install --production

FROM node:14-alpine3.13

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 8080

CMD ["yarn", "start"]