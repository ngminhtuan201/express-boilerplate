# Express Boilerplate

A production-ready, feature-rich Express.js boilerplate built with TypeScript. This boilerplate provides a solid foundation for building scalable web applications and REST APIs, integrating essential services and best practices out of the box.

## 🚀 Features

- **TypeScript**: Strictly typed codebase for better maintainability and developer experience.
- **Database**: MongoDB integration using Mongoose.
- **Caching & Queues**: Redis and BullMQ integration for background job processing, complete with an integrated **Bull Board** admin UI.
- **Authentication**: Robust authentication system using Passport.js.
  - Session and JWT-based authentication.
  - Google OAuth2.0 integration.
  - Local authentication (used to protect the Admin Dashboard).
- **File Storage**: Multi-provider storage support (Local, AWS S3, Cloudinary).
- **Payments**: Stripe billing integration.
- **Email**: Email delivery setup using Nodemailer (compatible with Resend and other SMTP providers).
- **Security**: Configured with Helmet, Express-Mongo-Sanitize, CORS, and Cookie Parser.
- **Validation**: Request data validation using Joi.
- **Logging**: Structured request and error logging with Winston and Morgan.

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- MongoDB
- Redis

## 🛠️ Installation & Setup

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and configure your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
.
├── src/
│   ├── dbs/          # Database connection setups (MongoDB, Redis)
│   ├── enums/        # TypeScript enums
│   ├── libs/         # Core libraries configurations (Passport, Winston, Morgan, JWT)
│   ├── middlewares/  # Express middlewares (Auth, Validation, Error Handling)
│   ├── models/       # Mongoose database models
│   ├── modules/      # Feature-based API modules (Auth, Admin, Payments, Uploads)
│   ├── worker/       # Background jobs and queue processors (e.g., sending emails)
│   ├── app.ts        # Express app setup and middleware registration
│   └── server.ts     # Server entry point
├── views/            # EJS templates (e.g., Bull Board login UI)
└── package.json
```

## ⚙️ Available Scripts

- `npm run dev`: Starts the application in development mode using Nodemon.
- `npm run build`: Compiles the TypeScript code to JavaScript inside the `dist` directory.
- `npm start`: Runs the compiled server in production mode.
- `npm run start:worker`: Starts the background job worker process independently.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the code using Prettier.

## 📊 Bull Board (Admin Queues)

This project includes `@bull-board` for visual monitoring of background jobs (BullMQ).

- **URL**: `http://localhost:<PORT>/admin/queues`
- **Authentication**: The board is protected by a session-based local authentication strategy. You must log in using the credentials specified in your `.env` file (`BULL_BOARD_USERNAME` and `BULL_BOARD_PASSWORD`) to access the dashboard.

## 📄 License

This project is licensed under the ISC License.
