# SmartChallan API Server

External REST API for SmartChallan clients. Exposes login (JWT) and two data
endpoints backed by the SmartChallan database.

## Quick start (hosting / dev)

```bash
cp .env.example .env     # fill in DB creds and JWT_SECRET
npm install
npm start                # defaults to port 4001
```

## Authentication

All data endpoints require a JWT. Obtain one via `POST /auth/login`, then send
it as `Authorization: Bearer <token>` on every subsequent request.

- Token lifetime: `JWT_EXPIRES_IN` (default **12h**)
- Errors: `401 TOKEN_EXPIRED` → re-login; `401 INVALID_TOKEN` → re-login

## Endpoints

### 1. `POST /auth/login`

Request:
```json
{ "email": "client@example.com", "password": "•••" }
```
Response 200:
```json
{
  "token": "eyJhbGciOi...",
  "expiresIn": "12h",
  "client": { "id": 42, "name": "Acme", "email": "client@example.com" }
}
```

### 2. `GET /api/rto-data?page=1&limit=300`

Paginated RTO data for your **active** vehicles.

| Param | Default | Max |
|-------|---------|-----|
| page  | 1       | —   |
| limit | 100     | 300 |

Response:
```json
{
  "meta": { "page": 1, "limit": 300, "total": 742, "totalPages": 3, "hasNext": true, "hasPrev": false },
  "data": [ { "vehicle_number": "MH12AB1234", "insurance_exp": "...", "rto_data": { ... } } ]
}
```

### 3. `GET /api/challan-data?page=1&limit=300`

Paginated challan data (pending + disposed) for your **active** vehicles.
Same pagination rules as `/api/rto-data`.

## Typical client flow

```
POST /auth/login  → store token
loop page = 1..totalPages:
    GET /api/rto-data?page=<page>&limit=300
    GET /api/challan-data?page=<page>&limit=300
```

## Postman collection

`postman/SmartChallan-API.postman_collection.json` — import into Postman. The
login request auto-captures `token` into a collection variable used by the other
two requests. Edit the `baseUrl`, `email`, `password` variables before use.
