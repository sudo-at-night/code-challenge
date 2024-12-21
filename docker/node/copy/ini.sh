#!/bin/sh

set -e

VENDOR_DIR=/home/node/app/node_modules

if [ ! -d "$VENDOR_DIR" ]; then
    npm install
fi

npm run start
