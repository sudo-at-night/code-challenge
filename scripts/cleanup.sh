#!/bin/sh

set -e

docker compose -f docker/compose.yml down -v
rm -rf node/node_modules
rm -rf node/dist
