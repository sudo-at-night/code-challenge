# Didomi code challenge

## Starting it up

To start everything up using Docker, ensure you have Docker installed on your machine and run:

```sh
# Start everything up
./scripts/start.sh

# Clean and remove docker containers
./scripts/cleanup.sh
```

Then everything should be ready:
- `localhost:8080` | The API
- `localhost:5433` | The database

## File structure

The file structure is based on some practices I worked out both working comercially and doing my own projects. The key ideas behind this setup:

- everything is startable via one single command, given Docker is available
- Docker setup can be re-configured for dev/staging/prod environments as needed
- Docker setup is technology agnostic, containers are added or removed in the same way at all times
