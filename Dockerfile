FROM node:20 AS builder
WORKDIR /app
COPY .eslintrc.js .eslintignore .postcssrc.js .prettierrc babel.config.js quasar.conf.js tsconfig.json ./
COPY package*.json yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
COPY scripts ./scripts
RUN yarn build

FROM alpine AS production
RUN apk add --update libintl && apk add --virtual build_deps gettext
WORKDIR /app
COPY --from=builder /app/dist/spa ./dist
