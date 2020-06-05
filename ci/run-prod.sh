#!/bin/bash


sed -i "s/%AUTH_HOST%/${AUTH_HOST}/g" ./config/ci.json
sed -i "s/%MYSQL_HOST%/${MYSQL_HOST}/g" ./config/ci.json
sed -i "s/%MYSQL_PORT%/${MYSQL_PORT}/g" ./config/ci.json
sed -i "s/%MYSQL_USER%/${MYSQL_USER}/g" ./config/ci.json
sed -i "s/%MYSQL_PASSWORD%/${MYSQL_PASSWORD}/g" ./config/ci.json
sed -i "s/%MYSQL_DATABASE%/${MYSQL_DATABASE}/g" ./config/ci.json

cat ./config/ci.json
echo "NODE_ENV : $NODE_ENV"
npm run typeorm -- migration:run
node ./dist/main.js
