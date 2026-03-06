---
name: express-pro
description: "AI Agent skill for developing in the vydora-server Express Application (Modular Architecture, Typescript, Mongoose, BullMQ)"
---

# Express-Pro AI Agent Skill

This skill provides guidelines and architectural context for developing features in the current `vydora-server` Express.js boilerplate project.

## 📁 Directory Structure

The project follows a modular, feature-based architecture.

- `src/app.ts`: Express application setup, global middlewares, and top-level routing.
- `src/server.ts`: Server initialization and termination entry point.
- `src/config.ts`: Centralized configuration mapping (loads from `.env.dev`, `.env.prod`).
- `src/errors.ts`: Custom error classes (e.g., `ApiError`) and standard HTTP status handling.
- `src/modules/`: Domain and business logic modules (e.g., `users`, `auth`, `emails`, `payments`).
  - Each module organizes its own `*.controller.ts`, `*.service.ts`, `*.route.ts`, and `*.helper.ts`.
  - External services must be implemented using the **Adapter Pattern** (e.g., `adapters/interface.ts`, `payment.adapter.factory.ts`).
- `src/models/`: Database schemas and models (Mongoose).
- `src/middlewares/`: Application-level Express middlewares.
- `src/worker/`: Background worker logic.
  - Workers define their own queues and processors within `src/worker/modules/<module-name>/`.
  - For example, email processing is handled via `send-email.processor.ts` and `send-email.job.ts`.
- `src/libs/`: Third-party service integrations/wrappers (Redis, SMTP, AI providers, Passport, etc.).
- `src/dbs/`: Database connection singletons (MongoDB, Redis).
- `src/routes/`: Global router aggregator connecting individual module routes.
- `src/types/` / `src/enums/` / `src/utils/`: Common TS types, enumerations, and pure functions.

## 🛠️ Tech Stack & Conventions

- **Language:** TypeScript
- **Framework:** Express 5.x
- **Database:** MongoDB via Mongoose
- **Background Jobs:** BullMQ with Redis
- **Validation:** Joi
- **Package Manager:** npm

## 📝 Coding Guidelines

When implementing new features, adhere to these strict rules:

1. **Modular Architecture:** Add new feature endpoints by creating a new directory or extending an existing one inside `src/modules/`. Do not pollute global files.
2. **Adapter Pattern:** If integrating a new third-party API (e.g., Stripe, Replicate, ElevenLabs), define an interface and utilize a factory adapter to inject dependencies. Keep external API dependencies isolated.
3. **Background Tasks (BullMQ):** Heavy operations (such as sending emails, async processing, generating AI content) must not block the main Express request thread. Define a job within `src/worker/modules/` and dispatch it from the controller or service layer.
4. **Error Handling:** Avoid ad-hoc `throw new Error(...)`. Always use the centralized custom errors from `src/errors.ts` and handle them using the standard `next(error)` pattern or within `express-async-handler` (if used).
5. **Environment Configuration:** Any new environment secrets must be documented in `.env.dev` and securely mapped in `src/config.ts`.
6. **Logging:** Never use `console.log` for production code. Always import and use the configured `logger` from `src/libs/`.

## 📦 Running the application

- **Local Development Command:** `npm run dev` (utilizes nodemon to restart processes).
- **Worker Initialization:** `npm run start:worker`
- **Docker:** Local infrastructure is managed via Docker (`compose.dev.yml`).
