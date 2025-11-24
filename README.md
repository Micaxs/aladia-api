# Aladia NestJS Monorepo

Monorepo with a public HTTP gateway and an authentication microservice communicating via NestJS TCP microservices.

## Structure

- `apps/gateway` – HTTP REST API (Swagger, validation)
- `apps/authentication` – authentication & user management (MongoDB, JWT)
- `core` – shared infrastructure (e.g. networking service)
- `common` – shared DTOs/utilities (placeholder)
- `config` – configuration helpers (placeholder)

## Running locally

```bash
npm install
npm run start:auth:dev
npm run start:gateway:dev
```

Or with Docker:

```bash
npx run start:docker
```

```bash
docker compose up --build
```

Gateway: http://localhost:3000 (Swagger at `/api`).
