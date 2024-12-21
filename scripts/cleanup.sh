#!/bin/sh

set -e

docker compose -f docker/compose.yml down -v
rm -rf src/node/node_modules
