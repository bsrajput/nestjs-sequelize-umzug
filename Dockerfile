FROM node:14-alpine AS base
LABEL stage=base

RUN apk add \
  python \
  build-base \
  git \
  bash \
  curl \
  gettext \
  nano \
  && npm i -g node-gyp

FROM base AS deps
LABEL stage=deps

USER node
RUN mkdir -p /home/node/demo
WORKDIR /home/node/demo

COPY --chown=node:node . .

RUN npm i && npm run build

FROM base as prod
USER node
WORKDIR /home/node/demo
COPY --from=deps --chown=node:node /home/node/demo/. .
CMD ["npm", "start"]

