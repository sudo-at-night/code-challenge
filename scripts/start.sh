#!/bin/sh

set -e

docker compose -f docker/compose.yml up --build --remove-orphans
