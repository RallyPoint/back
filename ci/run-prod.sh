#!/bin/bash

echo "NODE_ENV : $NODE_ENV"
npm run typeorm -- migration:run
node ./dist/main.js
