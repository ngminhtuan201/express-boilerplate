# 🚀 Ultimate Express.js SaaS Boilerplate

A production-ready, feature-rich Express.js backend boilerplate built with TypeScript. Designed specifically for modern SaaS applications, it provides a highly scalable architecture, built-in background processing, multi-provider payment support, and robust security configurations out of the box.

## ✨ Key Features

### 🏗️ Architecture & Core
- **TypeScript**: Strictly typed codebase for superior maintainability and DX.
- **Layered Architecture**: Clean separation of Route ➔ Controller ➔ Service ➔ Helper.
- **Graceful Shutdown**: Zero-downtime deployments with proper signal handling (`SIGTERM`, `SIGINT`) to safely drain HTTP requests and close database connections.
- **Health Checks**: Advanced `/api/health` endpoint that strictly verifies MongoDB and Redis connectivity.

### 🔐 Security & Authentication
- **Multi-Strategy Auth**: Local login, Google OAuth2.0, and JWT-based authentication via `Passport.js`.
- **Redis-Backed Sessions**: Horizontally scalable session management using `connect-redis` (prevents memory leaks).
- **Hardened Security**: Pre-configured with `Helmet` (HTTP headers), `express-mongo-sanitize` (NoSQL injection prevention), CORS, and Cookie Parsing.
- **Rate Limiting**: Distributed rate limiting using `express-rate-limit` and `rate-limit-redis` to prevent DDoS and brute-force attacks.
- **Request Validation**: Schema-based payload validation via `Joi`.

### 💳 Payments & Billing
- **Multi-Provider Support**: Built-in support for **Stripe** and **Sepay** (Vietnamese bank transfers) via the Factory/Adapter pattern.
- **Webhook Handling**: Secure, signature-verified webhook endpoints.

### ⚙️ Background Jobs & Storage
- **Queues (BullMQ)**: Offload heavy tasks (e.g., email delivery) to Redis-backed queues.
- **Bull Board UI**: Built-in, password-protected dashboard to monitor and retry background jobs (`/admin/queues`).
- **Multi-Cloud Storage**: Seamlessly switch between Local, AWS S3, Cloudflare R2, and Cloudinary.
- **Emails**: `Nodemailer` integration (compatible with Resend, AWS SES, SendGrid).

### 🐳 DevOps & Observability
- **Docker Ready**: Includes `Dockerfile.dev` for local development and a multi-stage `Dockerfile.prod` for optimized, lightweight production images.
- **Centralized Logging**: Structured logging via `Winston` and `Morgan`.
- **API Documentation**: Interactive Swagger/OpenAPI docs auto-generated and served at `/api-docs`.

---

## 📦 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local or Atlas)
- **Redis** (Local or Upstash)
- **Docker & Docker Compose** (Optional, for containerized deployments)

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ngminhtuan201/express-boilerplate.git
   cd express-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the example config and fill in your secrets (MongoDB URI, Redis, Stripe, etc.):
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
.
├── src/
│   ├── dbs/          # Database setups (MongoDB, Redis)
│   ├── enums/        # Global TypeScript enums
│   ├── libs/         # Core integrations (Passport, Winston, JWT)
│   ├── middlewares/  # Express middlewares (Auth, Rate Limit, Validation)
│   ├── models/       # Mongoose schemas (User, Transaction, etc.)
│   ├── modules/      # Feature modules (Auth, Payments, Health, Uploads)
│   ├── worker/       # BullMQ job processors (Email queue)
│   ├── app.ts        # Express app initialization & security setup
│   └── server.ts     # HTTP Server entry point
├── Dockerfile.dev    # Docker config for local dev
├── Dockerfile.prod   # Multi-stage Docker config for production
├── compose.prod.yaml # Production docker-compose setup
└── package.json
```

---

## ⚙️ Available Scripts

- `npm run dev`: Start the app with auto-reload (Nodemon).
- `npm run build`: Compile TypeScript to JavaScript (`dist/`).
- `npm start`: Run the compiled code in production.
- `npm run start:worker`: Start a standalone background worker process.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.
- `npm run seed`: Run the database seeder to initialize admin accounts.

---

## 📊 Bull Board (Queue Dashboard)

Monitor your BullMQ background jobs via a beautiful UI:
- **URL**: `http://localhost:<PORT>/admin/queues`
- **Auth**: Protected by a session-based login. Use the `BULL_BOARD_USERNAME` and `BULL_BOARD_PASSWORD` from your `.env` file to log in.

---

## 🚀 Production Deployment

This boilerplate is designed for zero-downtime, horizontally scalable deployments. 

To deploy via Docker:
```bash
docker-compose -f compose.prod.yaml up --build -d
```
The production image utilizes a multi-stage build, automatically stripping out `devDependencies` to keep the image size minimal and secure.

---

## 📄 License

This project is licensed under the ISC License.
