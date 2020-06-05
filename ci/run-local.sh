#!/bin/bash

rm -rf node_modules
rm -rf dist

export NODE_ENV="local-dev"
echo "NODE_ENV : $NODE_ENV"
yarn install
yarn run build
yarn run start:dev
