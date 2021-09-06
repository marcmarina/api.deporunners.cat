FROM node:16-alpine3.14 as build

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml  ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN yarn build

RUN rm -rf ./node_modules

RUN pnpm install -P

FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 8080

CMD ["yarn", "start"]