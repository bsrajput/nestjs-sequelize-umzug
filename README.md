## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Installation

1. Install postgress (homebrew or macports)

## DB copy

You can copy db over different environments, for this you have to have corresponding `.env.*` files and execute following
command in terminal

```bash
sh scripts/AWSbackup.sh staging
sh scripts/AWSrestore.sh staging
```

Please be careful and don't do mess up production database
