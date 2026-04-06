# Finance Dashboard Backend

A Node.js, Express, and MongoDB backend for finance record management, JWT authentication, role-based access control, dashboard analytics, and Swagger API documentation.

## Features

- JWT access token and refresh token authentication
- Role-based access control for `admin`, `analyst`, and `viewer`
- User management APIs
- Financial records CRUD with filtering and pagination
- Dashboard summary and analytics APIs
- Swagger UI documentation at `/api-docs`
- Optional keep-alive ping endpoint and scheduler for deployments

## Project Structure

```text
src/
  config/
  constants/
  controllers/
  docs/
  middlewares/
  models/
  routes/
  services/
  utils/
```

## Prerequisites

- Node.js 22+
- MongoDB Atlas URI or local MongoDB instance

## Environment Variables

Create a `.env` file with these values:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
MONGO_DB_NAME=finance_dashboard
JWT_ACCESS_SECRET=replace_with_a_strong_secret
JWT_REFRESH_SECRET=replace_with_a_strong_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
APP_BASE_URL=http://localhost:5000
KEEP_ALIVE_ENABLED=false
KEEP_ALIVE_INTERVAL_MS=540000
```

## Local Setup

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Create or update an admin user:

```env
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongadmin123
```

```bash
npm run seed:admin
```

## API Docs

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

## Main API Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users`
- `PATCH /api/v1/users/:userId`
- `POST /api/v1/records`
- `GET /api/v1/records`
- `PATCH /api/v1/records/:recordId`
- `DELETE /api/v1/records/:recordId`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/health`
- `GET /api/v1/health/keep-alive`

## Keep-Alive for Render

There is a dedicated endpoint:

```text
GET /api/v1/health/keep-alive
```

And an optional self-ping scheduler in the app. To enable it:

```env
KEEP_ALIVE_ENABLED=true
APP_BASE_URL=https://your-render-service.onrender.com
KEEP_ALIVE_INTERVAL_MS=540000
```

This makes the app send a ping to its own keep-alive endpoint every 9 minutes.

Note: self-pinging may not prevent all platform idling behavior depending on Render plan and platform rules, but the route and scheduler are ready if you want that behavior in your deployment.

## Docker

Build the image:

```bash
docker build -t finance-dashboard-backend .
```

Run the container:

```bash
docker run --env-file .env -p 5000:5000 finance-dashboard-backend
```

## Notes

- Use strong JWT secrets outside local development.
- Public registration accepts `role`, but only for non-admin roles. Admin users should be created with `npm run seed:admin`.
- Refresh tokens are stored as hashes in MongoDB.
- Swagger docs are generated from route annotations.
