# Aladia NestJS Monorepo

Monorepo with a public HTTP gateway and an authentication microservice communicating via NestJS TCP microservices.

The configuration is handled with environment variables (.env file), make sure to create one when running locally.

## Project Structure

- `apps/gateway` – HTTP REST API (Swagger, validation)
- `apps/authentication` – authentication & user management (MongoDB, JWT)
- `core` – shared infrastructure (e.g. networking service)
- `common` – shared DTOs/utilities
- `config` – configuration helpers

## Running locally

```bash
npm install
npm run start:auth:dev
npm run start:gateway:dev
```

### Start all:
```bash
npm run start:all
```

### Run with Docker:
This includes a Mongo docker instance as well.

```bash
npx run start:docker
```

```bash
docker compose build
docker compose up
```

### Unit Tests
```bash
npm test```

```bash
npm run test:coverage
```

## API Information
Default Gateway: http://localhost:3000 
Swagger API Docs: http://localhost:3000/api


