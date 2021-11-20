FROM node:16-alpine3.14 as build

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN rm -rf ./node_modules

RUN yarn install --prod

FROM node:16-alpine3.14

WORKDIR /usr/app

COPY --from=build /usr/app/package.json ./
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/public ./public
COPY --from=build /usr/app/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"]
