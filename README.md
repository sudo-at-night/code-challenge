# Didomi code challenge

## Starting it up

To start everything up using Docker, ensure you have Docker installed on your machine and run:

```sh
# Start everything up
./scripts/start.sh

# Clean and remove docker containers
./scripts/cleanup.sh

# To execute commands on the Node container
docker exec -it didomi-node sh

# To execute commands on the Postgres container
docker exec -it didomi-db sh

# Connect to Postgres database using psql or other client
psql -h localhost -p 5433 -U admin -d didomi
```

Then everything should be ready:
- `localhost:8080` | The API
- `localhost:5433` | The database

## Docker environment

The file structure is based on some practices I worked out both working comercially and doing my own projects. The key ideas behind this setup:

- everything is startable via one single command, given Docker is available
- Docker setup can be re-configured for dev/staging/prod environments as needed
- Docker setup is technology agnostic, containers are added or removed in the same way at all times
- Docker enables pre-installing all required tools for developers, no need to install dozens of tools manually unless it's a preference
- if Docker is unavailable, environment can be adjusted to be ran without it

## File structure

Node.js application is split into the following structure:
- REST API layer
- database (data) layer
- services layer

### REST API layer

It's responsibility is the API communication with any/all clients. This is where we can setup all of the required authentication, split and nest the endpoints to describe entities we work with best, etc.

### Database (data) layer

This is where the data is created, read and removed. It's sole responsibility is communication with the database.

### Services layer

This is where any business logic lives. Whenever something changes in how we want to process things, we want to decide on validations or anything that has to do with the behaviour of our application, we can do it here.

## About queues and microservices

> [!WARNING]
> I have not implemented a queue system


> [!WARNING]
> This is a monolithic application, but open for extension

I'll be frank, I have not had the time to expand on this project more but the services can be split into microservices, together with their database "slice", and the app as it stands can use queue system such as RabbitMQ.

Let's say I had time and I was to expand this more, I think creating a small, highly available microservice to handle queueing up consent events could easily stand next to what we have here, and workers could in their own time send over consent events to this API via REST or some other protocol such as gRPC.
