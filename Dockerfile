FROM node:16-alpine3.14 as build

WORKDIR /usr/app

COPY package.json ./
COPY pnpm-lock.yaml  ./

RUN yarn install

COPY . .

RUN yarn build

RUN rm -rf ./node_modules

RUN yarn install --prod

FROM node:16-alpine3.14

WORKDIR /usr/app

COPY --from=build /usr/app/package.json ./
COPY --from=build /usr/app/build ./build
COPY --from=build /usr/app/public ./public
COPY --from=build /usr/app/node_modules ./node_modules

EXPOSE 8080

CMD ["yarn", "start"]